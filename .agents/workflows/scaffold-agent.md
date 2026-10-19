---
name: scaffold-agent
description: Scaffold a new specialist AI agent for the NDANHPC Kit with compliant frontmatter, tools, philosophy, Socratic gate, and auto-registration.
version: 1.0.0
requires_agents: orchestrator
requires_skills: clean-code, lint-and-validate
artifact_outputs: agent-definition
---

# /scaffold-agent - Scaffold New Specialist Agent

Create a fully compliant, production-grade Specialist Agent definition for the NDANHPC Kit.

---

## Usage

```bash
/scaffold-agent <agent-name> [options]
```

### Options
- `--description "..."`: Explicit persona description and trigger keywords
- `--skills "..."`: Comma-separated list of required modular skills
- `--tools "..."`: Allowed tool permissions (Default: `Read, Grep, Glob, Bash, Edit, Write`)

---

## Workflow Steps

1. **Clarify Domain & Capabilities**:
   Ask user for specific domain boundaries, philosophy, decision frameworks, and expertise areas.

2. **Execute Scaffolder Engine**:
   Run the automated generator:
   ```bash
   python3 .agents/scripts/scaffold_component.py agent "$ARGUMENTS"
   ```

3. **Verify Compliance**:
   Run the self-validation suite:
   ```bash
   npm run check:agents && npm run test:toolkit
   ```
