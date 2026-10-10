# Migration Guide - NDANHPC Kit

## Version: 2026.10.10 (Initial Proprietary Release)

NDANHPC Kit 2026.10.10 establishes an independent, self-contained AI Agent Capability Toolkit.

### Upgrading & Synchronization

1. **Component Verification**:
   ```bash
   npm run check:agents
   ```
2. **Antigravity Contract Verification**:
   ```bash
   npm run check:antigravity
   ```
3. **Automated Manifest Regeneration**:
   When adding or updating skills, agents, or rules, synchronize registry and SHA-256 integrity lock:
   ```bash
   npm run manifest
   npm run deps
   ```
