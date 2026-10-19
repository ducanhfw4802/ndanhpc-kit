#!/usr/bin/env python3
"""
Component Scaffolder - NDANHPC Kit
Safely generates new Specialist Agents, Domain Skills, or Workflows with
strict schema compliance and automatic manifest/lock synchronization.

Usage:
  python3 scaffold_component.py agent <name> --description "..." --skills "clean-code,api-patterns"
  python3 scaffold_component.py skill <name> --description "..." --tools "Read,Write,Edit,Glob,Grep,Bash"
  python3 scaffold_component.py workflow <name> --description "..." --agents "orchestrator" --skills "clean-code"
"""

import sys
import argparse
import subprocess
from pathlib import Path

# Paths
KIT_ROOT = Path(__file__).resolve().parent.parent
AGENTS_DIR = KIT_ROOT / "agent"
SKILLS_DIR = KIT_ROOT / "skills"
WORKFLOWS_DIR = KIT_ROOT / "workflows"


def scaffold_agent(name: str, description: str, skills: str, tools: str) -> None:
    slug = name.lower().replace(" ", "-").replace("_", "-")
    file_path = AGENTS_DIR / f"{slug}.md"
    if file_path.exists():
        print(f"[!] Error: Agent already exists at {file_path}")
        sys.exit(1)

    content = f"""---
name: {slug}
description: {description}
tools: {tools}
model: inherit
version: 1.0.0
skills: {skills}
---

# {name.replace('-', ' ').title()}

You are a {name.replace('-', ' ').title()} specializing in {description}.

---

## Core Philosophy

> "Write high-quality, maintainable, and verified code with explicit boundaries."

---

## Your Mindset

- **Clarity over cleverness**: Write clean, self-documenting code.
- **Verification first**: Prove changes work with tests and live verification.
- **Safe defaults**: Never expose secrets or execute destructive actions without confirmation.

---

## 🛑 Socratic Gate (Clarify Before Implementation)

When receiving ambiguous requests, ask questions across key dimensions before coding.

---

## Best Practices

✅ Always validate inputs and handle edge cases gracefully.
✅ Follow project conventions and memory guidelines.
❌ Never hardcode sensitive credentials or environment-specific values.
"""
    file_path.write_text(content, encoding="utf-8")
    print(f"[SUCCESS] Created Agent at: {file_path}")


def scaffold_skill(name: str, description: str, tools: str, with_script: bool) -> None:
    slug = name.lower().replace(" ", "-").replace("_", "-")
    skill_dir = SKILLS_DIR / slug
    if skill_dir.exists():
        print(f"[!] Error: Skill folder already exists at {skill_dir}")
        sys.exit(1)

    skill_dir.mkdir(parents=True, exist_ok=True)
    file_path = skill_dir / "SKILL.md"

    content = f"""---
name: {slug}
description: {description}
when_to_use: "When working on tasks involving {name.replace('-', ' ')} or requiring specific {name.replace('-', ' ')} conventions."
allowed-tools: {tools}
version: 1.0.0
---

# {name.replace('-', ' ').title()} Patterns & Best Practices

> Production-grade guidelines and architecture principles for {description}.

---

## 🎯 When to Use This Skill

- Applying best practices for {name.replace('-', ' ')}
- Avoiding anti-patterns and performance bottlenecks
- Ensuring consistent project standards

---

## 📐 Core Architecture & Guidelines

1. **Principles**: Follow clean code standards and strict typing.
2. **Quality Checklist**: Ensure all edge cases and error states are handled.
"""
    file_path.write_text(content, encoding="utf-8")
    print(f"[SUCCESS] Created Skill at: {file_path}")

    if with_script:
        scripts_dir = skill_dir / "scripts"
        scripts_dir.mkdir(exist_ok=True)
        script_file = scripts_dir / f"{slug.replace('-', '_')}_validator.py"
        script_content = f"""#!/usr/bin/env python3
\"\"\"
{name.replace('-', ' ').title()} Validator - NDANHPC Kit
\"\"\"
import sys
from pathlib import Path

def main() -> int:
    target = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    print(f"[INFO] Scanning {{target}} for {slug} conventions...")
    print("[PASS] All checks passed.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
"""
        script_file.write_text(script_content, encoding="utf-8")
        script_file.chmod(0o755)
        print(f"[SUCCESS] Created companion script at: {script_file}")


def scaffold_workflow(name: str, description: str, agents: str, skills: str) -> None:
    slug = name.lower().replace("/", "").replace(" ", "-").replace("_", "-")
    file_path = WORKFLOWS_DIR / f"{slug}.md"
    if file_path.exists():
        print(f"[!] Error: Workflow already exists at {file_path}")
        sys.exit(1)

    content = f"""---
name: {slug}
description: {description}
version: 1.0.0
requires_agents: {agents}
requires_skills: {skills}
artifact_outputs: {slug}-report
---

# /{slug} - {name.replace('-', ' ').title()}

$ARGUMENTS

---

## Purpose

{description}

---

## Workflow Steps

1. **Phase 1: Analysis & Requirements**: Inspect target context and evaluate constraints.
2. **Phase 2: Execution**: Coordinate specialized agents to carry out the required actions.
3. **Phase 3: Verification**: Validate results against project standards.
"""
    file_path.write_text(content, encoding="utf-8")
    print(f"[SUCCESS] Created Workflow at: {file_path}")


def sync_manifests() -> None:
    print("\n[INFO] Synchronizing manifests and integrity lock...")
    try:
        subprocess.run(["npm", "run", "generate:agents"], cwd=KIT_ROOT.parent, check=True)
        print("[SUCCESS] Manifests and SHA-256 locks updated successfully.")
    except Exception as e:
        print(f"[WARNING] Could not auto-sync manifests: {e}")


def main() -> int:
    parser = argparse.ArgumentParser(description="NDANHPC Kit Component Scaffolder")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Agent
    p_agent = subparsers.add_parser("agent", help="Scaffold a new specialist agent")
    p_agent.add_argument("name", help="Agent identifier (e.g. data-scientist)")
    p_agent.add_argument("-d", "--description", required=True, help="Agent role and trigger description")
    p_agent.add_argument("-s", "--skills", default="clean-code,lint-and-validate", help="Comma-separated skill names")
    p_agent.add_argument("-t", "--tools", default="Read, Grep, Glob, Bash, Edit, Write", help="Allowed tools")
    p_agent.add_argument("--no-sync", action="store_true", help="Skip manifest auto-generation")

    # Skill
    p_skill = subparsers.add_parser("skill", help="Scaffold a new modular skill")
    p_skill.add_argument("name", help="Skill identifier (e.g. redis-cache-patterns)")
    p_skill.add_argument("-d", "--description", required=True, help="Skill capability description")
    p_skill.add_argument("-t", "--tools", default="Read, Write, Edit, Glob, Grep, Bash", help="Allowed tools")
    p_skill.add_argument("--script", action="store_true", help="Create companion validator script")
    p_skill.add_argument("--no-sync", action="store_true", help="Skip manifest auto-generation")

    # Workflow
    p_wf = subparsers.add_parser("workflow", help="Scaffold a new slash command workflow")
    p_wf.add_argument("name", help="Workflow command name (e.g. benchmark)")
    p_wf.add_argument("-d", "--description", required=True, help="Workflow purpose description")
    p_wf.add_argument("-a", "--agents", default="orchestrator", help="Comma-separated agent names")
    p_wf.add_argument("-s", "--skills", default="clean-code,lint-and-validate", help="Comma-separated skill names")
    p_wf.add_argument("--no-sync", action="store_true", help="Skip manifest auto-generation")

    args = parser.parse_args()

    if args.command == "agent":
        scaffold_agent(args.name, args.description, args.skills, args.tools)
    elif args.command == "skill":
        scaffold_skill(args.name, args.description, args.tools, args.script)
    elif args.command == "workflow":
        scaffold_workflow(args.name, args.description, args.agents, args.skills)

    if not getattr(args, "no_sync", False):
        sync_manifests()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
