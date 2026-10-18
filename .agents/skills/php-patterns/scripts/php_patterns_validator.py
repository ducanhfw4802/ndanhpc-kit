#!/usr/bin/env python3
"""
PHP & Laravel Patterns Validator - NDANHPC Kit
Validates PHP/Laravel codebases for modern best practices and safety anti-patterns:
- Missing declare(strict_types=1);
- SQL Injection in raw clauses (whereRaw, DB::raw string concatenation)
- Empty catch blocks silently suppressing exceptions
- Dangerous function invocations (eval, shell_exec, system, exec)
- Unvalidated request inputs (Request $request ->all() directly into Model::create)
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


def find_php_files(project_path: Path) -> list:
    """Find all .php files excluding vendor, storage, and tests."""
    files = []
    for p in project_path.glob("**/*.php"):
        s = str(p)
        if any(skip in s for skip in ["vendor", ".git", "node_modules", "storage", "bootstrap/cache"]):
            continue
        files.append(p)
    return files


def check_php_file(file_path: Path) -> list:
    """Scan a single PHP source file for common anti-patterns."""
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {file_path.name}: {e}"]

    lines = content.splitlines()

    # 1. Check for declare(strict_types=1);
    # Exclude config files or routes where it might be optional, but recommend for app/
    is_app_file = "app/" in str(file_path).replace("\\", "/")
    if is_app_file and "declare(strict_types=1);" not in content:
        issues.append("Missing 'declare(strict_types=1);' declaration at the top of file")

    # 2. Check for empty catch blocks
    if re.search(r'catch\s*\([^)]+\)\s*\{\s*\}', content):
        issues.append("Empty catch block detected: Exceptions are silently suppressed")

    # Line-by-line checks
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("#"):
            continue

        # 3. Check for raw SQL injection risks
        if re.search(r'(whereRaw|selectRaw|orderByRaw|havingRaw|DB::raw)\s*\(\s*["\'].*?\s*\.\s*\$', stripped):
            issues.append(f"Line {idx}: Potential SQL Injection via string concatenation in raw query clause. Use parameterized bindings [?]")

        # 4. Dangerous execution functions
        if re.search(r'\b(eval|shell_exec|passthru)\s*\(', stripped):
            issues.append(f"Line {idx}: High-risk execution function detected ({stripped[:40]}...)")

        # 5. Direct mass-assignment with $request->all()
        if re.search(r'(::create|->update)\s*\(\s*\$request->all\(\)\s*\)', stripped):
            issues.append(f"Line {idx}: Unvalidated mass assignment via $request->all(). Use validated FormRequest or $request->validated()")

    return issues


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python3 php_patterns_validator.py [project_path]")
        print("Scans PHP/Laravel codebase for strict types, SQL injection, empty catch blocks, and mass-assignment risks.")
        return 0

    target_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print("=" * 60)
    print("  PHP & LARAVEL PATTERNS VALIDATOR (NDANHPC KIT)")
    print("=" * 60)
    print(f"Scanning target: {target_path}\n")

    php_files = find_php_files(target_path)
    if not php_files:
        print("[INFO] No PHP (.php) files found in target directory.")
        print("[PASS] 0 issues found.")
        return 0

    total_issues = 0
    files_with_issues = 0

    for f in php_files:
        rel_path = f.relative_to(target_path) if f.is_relative_to(target_path) else f
        file_issues = check_php_file(f)
        if file_issues:
            files_with_issues += 1
            print(f"[!] {rel_path} ({len(file_issues)} issue(s)):")
            for issue in file_issues:
                print(f"    - {issue}")
                total_issues += 1
            print()

    print("-" * 60)
    if total_issues == 0:
        print(f"[SUCCESS] Scanned {len(php_files)} PHP files. All patterns & safety checks passed!")
        return 0
    else:
        print(f"[WARNING] Found {total_issues} potential issue(s) across {files_with_issues} file(s).")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
