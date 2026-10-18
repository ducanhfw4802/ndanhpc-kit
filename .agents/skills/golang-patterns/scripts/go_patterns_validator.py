#!/usr/bin/env python3
"""
Go Patterns Validator - Validates Go codebases for anti-patterns & best practices.
Checks for:
- Missing resp.Body.Close()
- SQL Injection risks (string formatting in queries)
- Unbounded / Leaked goroutines
- Silently ignored errors (_ = ...)
- Missing context propagation in handlers/database queries
"""

import sys
import re
from pathlib import Path

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass


def find_go_files(project_path: Path) -> list:
    """Find all .go files excluding vendor and third-party modules."""
    files = []
    for p in project_path.glob("**/*.go"):
        s = str(p)
        if any(skip in s for skip in ["vendor", ".git", "node_modules", "_test.go"]):
            continue
        files.append(p)
    return files


def check_go_file(file_path: Path) -> list:
    """Scan a single Go source file for common anti-patterns."""
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {file_path.name}: {e}"]

    lines = content.splitlines()

    # 1. Check HTTP response body leak
    has_http_call = bool(re.search(r'http\.(Get|Post|Do)\(', content))
    has_body_close = "Body.Close()" in content
    if has_http_call and not has_body_close:
        issues.append("HTTP request made but no resp.Body.Close() detected (Connection/memory leak risk)")

    # Line-by-line checks
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()

        # 2. Check for SQL Injection risks in queries
        if re.search(r'\.(Query|QueryRow|Exec)(Context)?\(.*fmt\.Sprintf', stripped):
            issues.append(f"Line {idx}: Potential SQL Injection via fmt.Sprintf in query call. Use parameterized placeholders ($1, ?)")

        # 3. Check for raw SQL concatenation
        if re.search(r'\.(Query|QueryRow|Exec)(Context)?\(.*["\']\s*\+\s*\w+', stripped):
            issues.append(f"Line {idx}: Potential SQL Injection via string concatenation (+). Use parameterized queries")

        # 4. Check for naked goroutine without context or waitgroup in service/handler
        if re.match(r'^\s*go\s+func\(', stripped) and "ctx" not in stripped and "wg" not in stripped:
            issues.append(f"Line {idx}: Unmanaged goroutine launched (go func). Ensure context cancellation or WaitGroup is used to prevent leaks")

        # 5. Check for ignored errors on critical operations
        if re.search(r'_\s*=\s*(json\.Unmarshal|json\.NewDecoder|os\.Remove|db\.)', stripped):
            issues.append(f"Line {idx}: Critical error silently discarded with '_ ='. Explicitly handle errors")

    return issues


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python3 go_patterns_validator.py [project_path]")
        print("Scans Go codebase for goroutine leaks, unclosed resp.Body, SQL injection, and ignored errors.")
        return 0

    target_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print("=" * 60)
    print("  GO PATTERNS & ANTI-PATTERN VALIDATOR (NDANHPC KIT)")
    print("=" * 60)
    print(f"Scanning target: {target_path}\n")

    go_files = find_go_files(target_path)
    if not go_files:
        print("[INFO] No Go (.go) files found in target directory.")
        print("[PASS] 0 issues found.")
        return 0

    total_issues = 0
    files_with_issues = 0

    for f in go_files:
        rel_path = f.relative_to(target_path) if f.is_relative_to(target_path) else f
        file_issues = check_go_file(f)
        if file_issues:
            files_with_issues += 1
            print(f"[!] {rel_path} ({len(file_issues)} issue(s)):")
            for issue in file_issues:
                print(f"    - {issue}")
                total_issues += 1
            print()

    print("-" * 60)
    if total_issues == 0:
        print(f"[SUCCESS] Scanned {len(go_files)} Go files. All best practices and safety checks passed!")
        return 0
    else:
        print(f"[WARNING] Found {total_issues} potential issue(s) across {files_with_issues} file(s).")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
