#!/usr/bin/env python3
"""
Docker & Kubernetes Validator - NDANHPC Kit
Validates container definitions and orchestration manifests for production readiness:
- Unpinned Docker tags (:latest)
- Root user execution (missing USER directive)
- Missing .dockerignore files
- Kubernetes manifests without resource limits or health probes
- Privileged container flags
"""

import sys
import re
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass


def check_dockerfile(path: Path) -> list:
    issues = []
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {path.name}: {e}"]

    # 1. Check for unpinned :latest
    if re.search(r'^\s*FROM\s+[\w\./-]+:latest\b', content, re.MULTILINE | re.IGNORECASE):
        issues.append("Base image uses ':latest' tag. Pin to an explicit version or digest")

    # 2. Check for missing USER directive
    if not re.search(r'^\s*USER\s+\w+', content, re.MULTILINE):
        issues.append("Missing 'USER' instruction. Container will run as root by default")

    # 3. Check for matching .dockerignore
    dockerignore = path.parent / ".dockerignore"
    if not dockerignore.exists():
        issues.append(f"Missing .dockerignore in directory {path.parent}")

    # 4. Plaintext secret in ENV
    for idx, line in enumerate(content.splitlines(), 1):
        if re.search(r'^\s*ENV\s+.*(KEY|SECRET|PASSWORD|TOKEN)\s*=', line, re.IGNORECASE):
            issues.append(f"Line {idx}: Potential hardcoded secret in ENV instruction")

    return issues


def check_k8s_manifest(path: Path) -> list:
    issues = []
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Could not read {path.name}: {e}"]

    if "kind: Deployment" in content or "kind: StatefulSet" in content:
        # Check probes
        if "readinessProbe" not in content:
            issues.append("Deployment missing 'readinessProbe' to guard rolling updates")
        if "livenessProbe" not in content:
            issues.append("Deployment missing 'livenessProbe' for automatic pod restarts on deadlock")

        # Check resource limits
        if "resources:" not in content or "limits:" not in content:
            issues.append("Missing container 'resources.limits'. Nodes risk OOM cascade")

        # Check privileged
        if re.search(r'privileged:\s*true', content):
            issues.append("CRITICAL: Container configured with 'privileged: true'")

    return issues


def main() -> int:
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python3 docker_k8s_validator.py [project_path]")
        print("Audits Dockerfiles, Docker Compose, and Kubernetes manifests for security & resilience.")
        return 0

    target_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print("=" * 60)
    print("  DOCKER & KUBERNETES MANIFEST VALIDATOR (NDANHPC KIT)")
    print("=" * 60)
    print(f"Scanning target: {target_path}\n")

    dockerfiles = list(target_path.glob("**/Dockerfile*"))
    k8s_files = [p for p in target_path.glob("**/*.yaml") if any(k in p.name.lower() for k in ["k8s", "deploy", "pod", "service"])]

    all_files = [f for f in dockerfiles + k8s_files if ".git" not in str(f) and "node_modules" not in str(f)]

    if not all_files:
        print("[INFO] No Dockerfile or Kubernetes manifests found in target directory.")
        print("[PASS] 0 issues found.")
        return 0

    total_issues = 0
    files_with_issues = 0

    for f in all_files:
        rel_path = f.relative_to(target_path) if f.is_relative_to(target_path) else f
        if "dockerfile" in f.name.lower():
            issues = check_dockerfile(f)
        else:
            issues = check_k8s_manifest(f)

        if issues:
            files_with_issues += 1
            print(f"[!] {rel_path} ({len(issues)} issue(s)):")
            for issue in issues:
                print(f"    - {issue}")
                total_issues += 1
            print()

    print("-" * 60)
    if total_issues == 0:
        print(f"[SUCCESS] Scanned {len(all_files)} container/K8s files. All checks passed!")
        return 0
    else:
        print(f"[WARNING] Found {total_issues} potential issue(s) across {files_with_issues} file(s).")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
