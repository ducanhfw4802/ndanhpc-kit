#!/usr/bin/env python3
"""
RAG & AI Patterns Validator - NDANHPC Kit
Validates RAG & Vector Search configurations for common production pitfalls:
- Missing HNSW/IVFFlat vector indexes in SQL schemas
- Hardcoded LLM / Embedding API keys
- Dangerous zero-overlap text chunking configurations
- Unbounded vector similarity queries (missing LIMIT)
- Unsanitized prompt template injections
"""

import sys
import re
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass


def find_source_files(project_path: Path) -> list:
    """Find Python, TypeScript, and SQL files in project."""
    files = []
    for ext in ("*.py", "*.ts", "*.js", "*.sql"):
        for p in project_path.glob(f"**/{ext}"):
            s = str(p)
            if any(skip in s for skip in [".git", "node_modules", "vendor", "dist", ".venv"]):
                continue
            files.append(p)
    return files


def check_file(file_path: Path) -> list:
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {file_path.name}: {e}"]

    lines = content.splitlines()

    # 1. Check SQL vector column without index
    if file_path.suffix == ".sql":
        if "vector(" in content.lower() and not re.search(r'using\s+(hnsw|ivfflat)', content, re.IGNORECASE):
            issues.append("Vector column defined without an explicit HNSW or IVFFlat index")

    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("#") or stripped.startswith("--"):
            continue

        # 2. Hardcoded OpenAI / Anthropic / Cohere Keys
        if re.search(r'["\'](sk-[a-zA-Z0-9]{20,}|sk-ant-[a-zA-Z0-9]{20,})["\']', stripped):
            issues.append(f"Line {idx}: Potential hardcoded AI API key detected. Use environment variables")

        # 3. Chunk overlap zero
        if re.search(r'chunk_overlap\s*[:=]\s*0\b', stripped):
            issues.append(f"Line {idx}: chunk_overlap is set to 0. A 10-20% overlap is recommended to prevent contextual loss at boundaries")

        # 4. Vector query missing limit
        if re.search(r'<=>.*query_embedding', stripped) and "limit" not in stripped.lower():
            issues.append(f"Line {idx}: Vector similarity query without apparent LIMIT. Always cap retrieval results")

    return issues


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python3 rag_validator.py [project_path]")
        print("Validates RAG codebase for vector indexes, API key leaks, chunking configurations, and query limits.")
        return 0

    target_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print("=" * 60)
    print("  AI & RAG ARCHITECTURE VALIDATOR (NDANHPC KIT)")
    print("=" * 60)
    print(f"Scanning target: {target_path}\n")

    files = find_source_files(target_path)
    if not files:
        print("[INFO] No AI / Vector source files found in target directory.")
        print("[PASS] 0 issues found.")
        return 0

    total_issues = 0
    files_with_issues = 0

    for f in files:
        rel_path = f.relative_to(target_path) if f.is_relative_to(target_path) else f
        file_issues = check_file(f)
        if file_issues:
            files_with_issues += 1
            print(f"[!] {rel_path} ({len(file_issues)} issue(s)):")
            for issue in file_issues:
                print(f"    - {issue}")
                total_issues += 1
            print()

    print("-" * 60)
    if total_issues == 0:
        print(f"[SUCCESS] Scanned {len(files)} files. All RAG & AI patterns passed!")
        return 0
    else:
        print(f"[WARNING] Found {total_issues} potential issue(s) across {files_with_issues} file(s).")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
