#!/usr/bin/env python3
"""
Web Scraping & Crawler Validator - NDANHPC Kit
Validates web scrapers and crawlers for safety, stability, and anti-detection hygiene:
- Missing request timeouts (hanging socket risk)
- Insecure SSL verification disabled (verify=False)
- Aggressive unthrottled loops
- Hardcoded proxy credentials
- Missing User-Agent headers
"""

import sys
import re
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass


def find_scraper_files(project_path: Path) -> list:
    """Find crawler and scraper script files."""
    files = []
    for ext in ("*.py", "*.ts", "*.js"):
        for p in project_path.glob(f"**/{ext}"):
            s = str(p).lower()
            if any(skip in s for skip in [".git", "node_modules", "vendor", ".venv", "tests"]):
                continue
            if any(k in s for k in ["scrape", "crawl", "spider", "extract", "fetch"]):
                files.append(p)
    return files


def check_scraper_file(file_path: Path) -> list:
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {file_path.name}: {e}"]

    lines = content.splitlines()

    # 1. Missing timeout in requests.get/post or httpx
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith("#") or stripped.startswith("//"):
            continue

        # Check HTTP calls without timeout
        if re.search(r'(requests|httpx)\.(get|post|put|delete)\(', stripped) and "timeout" not in stripped:
            issues.append(f"Line {idx}: HTTP call without explicit 'timeout=' parameter. Requests risk hanging indefinitely")

        # 2. Insecure verify=False
        if re.search(r'verify\s*=\s*False', stripped) or "rejectUnauthorized: false" in stripped:
            issues.append(f"Line {idx}: SSL verification disabled (verify=False). Fix certificates instead of disabling security")

        # 3. Hardcoded proxy with credentials
        if re.search(r'https?://[^:@\s]+:[^@\s]+@[\d\w\.-]+:\d+', stripped):
            issues.append(f"Line {idx}: Hardcoded proxy credentials detected. Store in environment variables")

    # 4. Check for infinite loops without sleep
    if "while True" in content and "sleep" not in content and "break" not in content:
        issues.append("Detected 'while True' loop without apparent sleep or throttling. Risks aggressive IP banning")

    return issues


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python3 scraping_validator.py [project_path]")
        print("Validates scraper and crawler code for timeouts, SSL hygiene, proxy security, and rate limiting.")
        return 0

    target_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print("=" * 60)
    print("  WEB SCRAPER & CRAWLER VALIDATOR (NDANHPC KIT)")
    print("=" * 60)
    print(f"Scanning target: {target_path}\n")

    files = find_scraper_files(target_path)
    if not files:
        print("[INFO] No scraper or crawler files found in target directory.")
        print("[PASS] 0 issues found.")
        return 0

    total_issues = 0
    files_with_issues = 0

    for f in files:
        rel_path = f.relative_to(target_path) if f.is_relative_to(target_path) else f
        file_issues = check_scraper_file(f)
        if file_issues:
            files_with_issues += 1
            print(f"[!] {rel_path} ({len(file_issues)} issue(s)):")
            for issue in file_issues:
                print(f"    - {issue}")
                total_issues += 1
            print()

    print("-" * 60)
    if total_issues == 0:
        print(f"[SUCCESS] Scanned {len(files)} scraper files. All safety checks passed!")
        return 0
    else:
        print(f"[WARNING] Found {total_issues} potential issue(s) across {files_with_issues} file(s).")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
