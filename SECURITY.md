# Security Policy - NDANHPC Kit

## Security Boundaries & Model

NDANHPC Kit enforces safety boundaries within the Google Antigravity workspace runtime:

1. **PreToolUse Execution Gate**:
   - Registered in `.agents/hooks.json`.
   - Executed via `.agents/hooks/validate-tool-call.mjs`.
   - Prevents destructive filesystem commands (such as raw root disk formats, destructive recursive root wipes, raw partition manipulation).

2. **Least Privilege & Safe Tooling**:
   - Model execution adheres strictly to user authorization gates.
   - MCP connections run in controlled sandboxed environments with placeholder and permission verification.
   - Dual-track integrity: Every managed agent and skill is checksummed with SHA-256 in `.agents/manifest.lock.json`.

## Reporting Security Issues

If you discover any security vulnerability or bypass in the policy gate:
- Maintain confidential disclosure.
- Contact the owner (`ndanhpc`).
