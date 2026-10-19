---
name: scaffold-skill
description: Scaffold a new modular skill with compliant frontmatter, when_to_use triggers, allowed-tools, optional validation script, and manifest synchronization.
version: 1.0.0
requires_agents: orchestrator
requires_skills: clean-code, lint-and-validate, skillify
artifact_outputs: skill-definition
---

# /scaffold-skill - Scaffold New Modular Skill

Create a fully compliant, self-contained Domain Skill for the NDANHPC Kit.

---

## Usage

```bash
/scaffold-skill <skill-name> [options]
```

### Options
- `--description "..."`: Clear description of skill domain and principles
- `--tools "..."`: Allowed tool list (Default: `Read, Write, Edit, Glob, Grep, Bash`)
- `--script`: Generate a companion Python static validator script

---

## Workflow Steps

1. **Define Triggers & Scope**:
   Identify trigger conditions (`when_to_use`), domain boundaries, and best practices.

2. **Execute Scaffolder Engine**:
   Run the automated generator:
   ```bash
   python3 .agents/scripts/scaffold_component.py skill "$ARGUMENTS" --script
   ```

3. **Verify Compliance**:
   Run the self-validation suite:
   ```bash
   npm run check:agents && npm run test:toolkit
   ```
