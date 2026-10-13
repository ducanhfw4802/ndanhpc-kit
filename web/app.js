/**
 * NDANHPC Kit - Modern Interactive Web Portal (v2026.10.10)
 * Antigravity-native AI Agent Capability Toolkit
 */

// Embedded full dataset for seamless operation offline / file:// / HTTP
const EMBEDDED_DATA = {
  "kitVersion": "2026.10.13",
  "schemaVersion": "1.0.0",
  "counts": {
    "agents": 24,
    "skills": 61,
    "workflows": 29,
    "rules": 7
  },
  "agents": [
    {
      "id": "backend-specialist",
      "name": "backend-specialist",
      "title": "Backend Development Architect",
      "description": "Expert backend architect for Node.js, Python, and modern serverless/edge systems. Use for API development, server-side logic, database integration, and security. Triggers on backend, server, api, endpoint, database, auth.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "api-patterns",
        "bash-linux",
        "clean-code",
        "database-design",
        "lint-and-validate",
        "mcp-builder",
        "nodejs-best-practices",
        "powershell-windows",
        "python-patterns",
        "rust-pro"
      ],
      "path": "agent/backend-specialist.md",
      "category": "Backend & Data"
    },
    {
      "id": "code-archaeologist",
      "name": "code-archaeologist",
      "title": "Code Archaeologist",
      "description": "Expert in legacy code, refactoring, and understanding undocumented systems. Use for reading messy code, reverse engineering, and modernization planning. Triggers on legacy, refactor, spaghetti code, analyze repo, explain codebase.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "code-review-checklist",
        "simplify-code"
      ],
      "path": "agent/code-archaeologist.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "database-architect",
      "name": "database-architect",
      "title": "Database Architect",
      "description": "Expert database architect for schema design, query optimization, migrations, and modern serverless databases. Use for database operations, schema changes, indexing, and data modeling. Triggers on database, sql, schema, migration, query, postgres, index, table.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "database-design"
      ],
      "path": "agent/database-architect.md",
      "category": "Backend & Data"
    },
    {
      "id": "debugger",
      "name": "debugger",
      "title": "Debugger - Root Cause Analysis Expert",
      "description": "Expert in systematic debugging, root cause analysis, and crash investigation. Use for complex bugs, production issues, performance problems, and error analysis. Triggers on bug, error, crash, not working, broken, investigate, fix.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Edit",
        "Bash"
      ],
      "skills": [
        "clean-code",
        "systematic-debugging"
      ],
      "path": "agent/debugger.md",
      "category": "Testing & Quality"
    },
    {
      "id": "devops-engineer",
      "name": "devops-engineer",
      "title": "DevOps Engineer",
      "description": "Expert in deployment, server management, CI/CD, and production operations. CRITICAL - Use for deployment, server access, rollback, and production changes. HIGH RISK operations. Triggers on deploy, production, server, pm2, ssh, release, rollback, ci/cd.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "bash-linux",
        "clean-code",
        "deployment-procedures",
        "powershell-windows",
        "server-management"
      ],
      "path": "agent/devops-engineer.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "documentation-writer",
      "name": "documentation-writer",
      "title": "Documentation Writer",
      "description": "Expert in technical documentation. Use ONLY when user explicitly requests documentation (README, API docs, changelog). DO NOT auto-invoke during normal development.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "documentation-templates"
      ],
      "path": "agent/documentation-writer.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "explorer-agent",
      "name": "explorer-agent",
      "title": "Explorer Agent - Advanced Discovery & Research",
      "description": "Advanced codebase discovery, deep architectural analysis, and proactive research agent. The eyes and ears of the framework. Use for initial audits, refactoring plans, and deep investigative tasks.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "ViewCodeItem",
        "FindByName"
      ],
      "skills": [
        "architecture",
        "brainstorming",
        "clean-code",
        "plan-writing",
        "systematic-debugging"
      ],
      "path": "agent/explorer-agent.md",
      "category": "Coordination & Product"
    },
    {
      "id": "frontend-specialist",
      "name": "frontend-specialist",
      "title": "Senior Frontend Architect",
      "description": "Senior Frontend Architect who builds maintainable React/Next.js systems with performance-first mindset. Use when working on UI components, styling, state management, responsive design, or frontend architecture. Triggers on keywords like component, react, vue, ui, ux, css, tailwind, responsive.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "design-spec",
        "frontend-architecture",
        "frontend-design",
        "lint-and-validate",
        "nextjs-react-expert",
        "tailwind-patterns",
        "web-design-guidelines"
      ],
      "path": "agent/frontend-specialist.md",
      "category": "Frontend & Design"
    },
    {
      "id": "frontend-ui-developer",
      "name": "frontend-ui-developer",
      "title": "Senior Frontend UI/UX Engineer",
      "description": "Senior Frontend Engineer specialized in converting UI/UX designs into pixel-perfect, responsive, accessible web applications using React, Next.js, Vue, Tailwind CSS, and modern CSS (Grid, Flexbox, Container Queries).",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "view_file",
        "write_to_file",
        "replace_file_content",
        "run_command",
        "read_url_content"
      ],
      "skills": [
        "frontend-architecture",
        "frontend-design",
        "responsive-web-design",
        "tailwind-patterns",
        "web-design-guidelines"
      ],
      "path": "agent/frontend-ui-developer.md",
      "category": "Frontend & Design"
    },
    {
      "id": "game-developer",
      "name": "game-developer",
      "title": "Game Developer Agent",
      "description": "Game development across all platforms (PC, Web, Mobile, VR/AR). Use when building games with Unity, Godot, Unreal, Phaser, Three.js, or any game engine. Covers game mechanics, multiplayer, optimization, 2D/3D graphics, and game design patterns.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Write",
        "Edit",
        "Bash",
        "Grep",
        "Glob"
      ],
      "skills": [
        "clean-code",
        "game-development"
      ],
      "path": "agent/game-developer.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "mobile-developer",
      "name": "mobile-developer",
      "title": "Mobile Developer",
      "description": "Expert in React Native and Flutter mobile development. Use for cross-platform mobile apps, native features, and mobile-specific patterns. Triggers on mobile, react native, flutter, ios, android, app store, expo.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "design-spec",
        "mobile-design"
      ],
      "path": "agent/mobile-developer.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "mobile-ui-developer",
      "name": "mobile-ui-developer",
      "title": "Mobile UI/UX Specialist Engineer",
      "description": "Mobile UI/UX Engineer specialized in iOS & Android user interface design and implementation across Flutter, React Native, SwiftUI, and Kotlin. Focuses on touch ergonomics, thumb zones, gesture navigation, safe areas, and 60/120fps mobile performance.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "view_file",
        "write_to_file",
        "replace_file_content",
        "run_command",
        "read_url_content"
      ],
      "skills": [
        "mobile-app-ui-ux",
        "mobile-design",
        "ui-ux-design-system"
      ],
      "path": "agent/mobile-ui-developer.md",
      "category": "Frontend & Design"
    },
    {
      "id": "orchestrator",
      "name": "orchestrator",
      "title": "Orchestrator — Antigravity-First Multi-Agent Coordination",
      "description": "Multi-agent coordination and task orchestration with coordinator mode. Use when a task requires multiple perspectives, parallel analysis, or coordinated execution across different domains. Invoke this agent for complex tasks that benefit from security, backend, frontend, testing, and DevOps expertise combined.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Write",
        "Edit",
        "Agent"
      ],
      "skills": [
        "architecture",
        "bash-linux",
        "behavioral-modes",
        "brainstorming",
        "clean-code",
        "context-compression",
        "coordinator-mode",
        "lint-and-validate",
        "memory-system",
        "parallel-agents",
        "plan-writing",
        "powershell-windows",
        "verify-changes"
      ],
      "path": "agent/orchestrator.md",
      "category": "Coordination & Product"
    },
    {
      "id": "penetration-tester",
      "name": "penetration-tester",
      "title": "Penetration Tester",
      "description": "Expert in offensive security, penetration testing, red team operations, and vulnerability exploitation. Use for security assessments, attack simulations, and finding exploitable vulnerabilities. Triggers on pentest, exploit, attack, hack, breach, pwn, redteam, offensive.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "api-patterns",
        "clean-code",
        "red-team-tactics",
        "vulnerability-scanner"
      ],
      "path": "agent/penetration-tester.md",
      "category": "Security"
    },
    {
      "id": "performance-optimizer",
      "name": "performance-optimizer",
      "title": "Performance Optimizer",
      "description": "Expert in performance optimization, profiling, Core Web Vitals, and bundle optimization. Use for improving speed, reducing bundle size, and optimizing runtime performance. Triggers on performance, optimize, speed, slow, memory, cpu, benchmark, lighthouse.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "performance-profiling"
      ],
      "path": "agent/performance-optimizer.md",
      "category": "Coordination"
    },
    {
      "id": "product-manager",
      "name": "product-manager",
      "title": "Product Manager",
      "description": "Expert in product requirements, user stories, and acceptance criteria. Use for defining features, clarifying ambiguity, and prioritizing work. Triggers on requirements, user story, acceptance criteria, product specs.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash"
      ],
      "skills": [
        "brainstorming",
        "clean-code",
        "plan-writing"
      ],
      "path": "agent/product-manager.md",
      "category": "Coordination & Product"
    },
    {
      "id": "product-owner",
      "name": "product-owner",
      "title": "Product Owner",
      "description": "Strategic facilitator bridging business needs and technical execution. Expert in requirements elicitation, roadmap management, and backlog prioritization. Triggers on requirements, user story, backlog, MVP, PRD, stakeholder.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash"
      ],
      "skills": [
        "brainstorming",
        "clean-code",
        "plan-writing"
      ],
      "path": "agent/product-owner.md",
      "category": "Coordination & Product"
    },
    {
      "id": "project-planner",
      "name": "project-planner",
      "title": "Project Planner - Smart Project Planning",
      "description": "Smart project planning agent. Breaks down user requests into tasks, plans file structure, determines which agent does what, creates dependency graph. Use when starting new projects or planning major features.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash"
      ],
      "skills": [
        "app-builder",
        "brainstorming",
        "clean-code",
        "plan-writing"
      ],
      "path": "agent/project-planner.md",
      "category": "Coordination & Product"
    },
    {
      "id": "qa-automation-engineer",
      "name": "qa-automation-engineer",
      "title": "QA Automation Engineer",
      "description": "Specialist in test automation infrastructure and E2E testing. Focuses on Playwright, Cypress, CI pipelines, and breaking the system. Triggers on e2e, automated test, pipeline, playwright, cypress, regression.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "flaky-test-analyzer",
        "jira-integration",
        "lint-and-validate",
        "locator-healer",
        "qa-automation-workflow",
        "qa-framework-architect",
        "rbt-manual-testing",
        "requirements-analyzer",
        "smart-locator",
        "test-data-generator",
        "testing-patterns",
        "ui-debug",
        "web-design-guidelines",
        "webapp-testing"
      ],
      "path": "agent/qa-automation-engineer.md",
      "category": "Testing & Quality"
    },
    {
      "id": "security-auditor",
      "name": "security-auditor",
      "title": "Security Auditor",
      "description": "Elite cybersecurity expert. Think like an attacker, defend like an expert. OWASP 2025, supply chain security, zero trust architecture. Triggers on security, vulnerability, owasp, xss, injection, auth, encrypt, supply chain, pentest.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "api-patterns",
        "clean-code",
        "red-team-tactics",
        "vulnerability-scanner"
      ],
      "path": "agent/security-auditor.md",
      "category": "Security"
    },
    {
      "id": "seo-specialist",
      "name": "seo-specialist",
      "title": "SEO Specialist",
      "description": "SEO and GEO (Generative Engine Optimization) expert. Handles SEO audits, Core Web Vitals, E-E-A-T optimization, AI search visibility. Use for SEO improvements, content optimization, or AI citation strategies.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Write"
      ],
      "skills": [
        "clean-code",
        "geo-fundamentals",
        "seo-fundamentals"
      ],
      "path": "agent/seo-specialist.md",
      "category": "Specialist Engineering"
    },
    {
      "id": "test-engineer",
      "name": "test-engineer",
      "title": "Test Engineer",
      "description": "Expert in testing, TDD, and test automation. Use for writing tests, improving coverage, debugging test failures. Triggers on test, spec, coverage, jest, pytest, playwright, e2e, unit test.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Edit",
        "Write"
      ],
      "skills": [
        "clean-code",
        "code-review-checklist",
        "lint-and-validate",
        "qa-automation-workflow",
        "rbt-manual-testing",
        "tdd-workflow",
        "test-data-generator",
        "testing-patterns",
        "webapp-testing"
      ],
      "path": "agent/test-engineer.md",
      "category": "Testing & Quality"
    },
    {
      "id": "ui-ux-designer",
      "name": "ui-ux-designer",
      "title": "UI/UX Design Architect & Lead",
      "description": "Expert UI/UX Designer specialized in user research, wireframing, design tokens, visual hierarchy, Figma-to-code, interactive component specifications, and user experience auditing for web and mobile apps.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "view_file",
        "write_to_file",
        "replace_file_content",
        "run_command",
        "read_url_content"
      ],
      "skills": [
        "design-spec",
        "frontend-design",
        "mobile-design",
        "ui-ux-design-system",
        "ux-audit-and-heuristics"
      ],
      "path": "agent/ui-ux-designer.md",
      "category": "Frontend & Design"
    },
    {
      "id": "ux-accessibility-reviewer",
      "name": "ux-accessibility-reviewer",
      "title": "UX & Accessibility (a11y) Reviewer",
      "description": "Specialist in WCAG 2.2 accessibility and UX usability audits. Evaluates color contrast, screen reader compatibility, keyboard navigation, touch target dimensions, form friction, and Nielsen's 10 usability heuristics.",
      "version": "1.0.0",
      "model": "inherit",
      "tools": [
        "view_file",
        "write_to_file",
        "replace_file_content",
        "run_command",
        "read_url_content"
      ],
      "skills": [
        "ui-ux-design-system",
        "ux-audit-and-heuristics",
        "web-design-guidelines"
      ],
      "path": "agent/ux-accessibility-reviewer.md",
      "category": "Frontend & Design"
    }
  ],
  "skills": [
    {
      "id": "api-patterns",
      "name": "api-patterns",
      "description": "API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [
        "skills/api-patterns/scripts/api_validator.py"
      ],
      "path": "skills/api-patterns/SKILL.md",
      "category": "Backend & API"
    },
    {
      "id": "app-builder",
      "name": "app-builder",
      "description": "Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.",
      "version": "1.1.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash",
        "Agent"
      ],
      "scripts": [],
      "path": "skills/app-builder/SKILL.md",
      "category": "Architecture & Planning"
    },
    {
      "id": "architecture",
      "name": "architecture",
      "description": "Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation. Use when making architecture decisions or analyzing system design.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/architecture/SKILL.md",
      "category": "Architecture & Planning"
    },
    {
      "id": "bash-linux",
      "name": "bash-linux",
      "description": "Bash/Linux terminal patterns. Critical commands, piping, error handling, scripting. Use when working on macOS or Linux systems.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/bash-linux/SKILL.md",
      "category": "Shell/CLI"
    },
    {
      "id": "batch-operations",
      "name": "batch-operations",
      "description": "Apply operations across multiple files simultaneously. Pattern-based bulk modifications, search-and-replace across codebases, consistent changes to many files at once.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Grep",
        "Glob",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/batch-operations/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "behavioral-modes",
      "name": "behavioral-modes",
      "description": "AI operational modes (brainstorm, implement, debug, review, teach, ship, orchestrate). Use to adapt behavior based on task type.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/behavioral-modes/SKILL.md",
      "category": "Architecture & Planning"
    },
    {
      "id": "brainstorming",
      "name": "brainstorming",
      "description": "Socratic questioning protocol + user communication. MANDATORY for complex requests, new features, or unclear requirements. Includes progress reporting and error handling.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/brainstorming/SKILL.md",
      "category": "Architecture & Planning"
    },
    {
      "id": "clean-code",
      "name": "clean-code",
      "description": "Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments",
      "version": "2.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit"
      ],
      "scripts": [],
      "path": "skills/clean-code/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "code-review-checklist",
      "name": "code-review-checklist",
      "description": "Code review guidelines covering code quality, security, and best practices.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/code-review-checklist/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "code-review-graph",
      "name": "code-review-graph",
      "description": "Token-efficient code review using Tree-sitter AST graphs and MCP. Cuts AI token usage on large codebases by computing the blast radius of changes instead of reading entire codebases. Uses a SQLite graph database for structural analysis.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Grep",
        "Glob",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/code-review-graph/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "context-compression",
      "name": "context-compression",
      "description": "Manage and compress conversation context in long sessions. Detect when context is growing large, summarize completed work phases, archive old findings while preserving key decisions. Prevents context degradation.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/context-compression/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "coordinator-mode",
      "name": "coordinator-mode",
      "description": "Advanced multi-agent orchestration with parallel workers, synthesis protocols, and coordinator lifecycle. Use when complex tasks require multiple agents working in parallel with intelligent result synthesis.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Grep",
        "Glob",
        "Bash",
        "Write",
        "Edit",
        "Agent"
      ],
      "scripts": [],
      "path": "skills/coordinator-mode/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "database-design",
      "name": "database-design",
      "description": "Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [
        "skills/database-design/scripts/schema_validator.py"
      ],
      "path": "skills/database-design/SKILL.md",
      "category": "Database"
    },
    {
      "id": "deployment-procedures",
      "name": "deployment-procedures",
      "description": "Production deployment principles and decision-making. Safe deployment workflows, rollback strategies, and verification. Teaches thinking, not scripts.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/deployment-procedures/SKILL.md",
      "category": "Cloud & Infrastructure"
    },
    {
      "id": "design-spec",
      "name": "design-spec",
      "description": "How to author a DESIGN.md file — the machine-readable design-token + human-rationale format that must exist before any UI is built. YAML front-matter token schema (colors, typography, spacing, rounded, components), type system, token references, and canonical section order.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/design-spec/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "documentation-templates",
      "name": "documentation-templates",
      "description": "Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/documentation-templates/SKILL.md",
      "category": "Other"
    },
    {
      "id": "flaky-test-analyzer",
      "name": "flaky-test-analyzer",
      "description": "Phân tích và khắc phục các automation test không ổn định (flaky tests), xác định root cause và đề xuất fix.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/flaky-test-analyzer/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "frontend-architecture",
      "name": "frontend-architecture",
      "description": "How to organize frontend code — separation of concerns (UI / logic / data / type), file responsibility, state tiers, API services, schema validation, and framework conventions for React/Next and Vue. Structural rules, not visual design.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/frontend-architecture/SKILL.md",
      "category": "Other"
    },
    {
      "id": "frontend-design",
      "name": "frontend-design",
      "description": "Anti-slop frontend design for web UI — landing pages, portfolios, marketing/product sites, and redesigns. Reads the brief, infers the right direction, and ships interfaces that don't look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check. NOT for mobile apps.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/frontend-design/scripts/accessibility_checker.py",
        "skills/frontend-design/scripts/ux_audit.py"
      ],
      "path": "skills/frontend-design/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "game-development",
      "name": "game-development",
      "description": "Game development orchestrator. Routes to platform-specific skills based on project needs.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/game-development/SKILL.md",
      "category": "Game Development"
    },
    {
      "id": "geo-fundamentals",
      "name": "geo-fundamentals",
      "description": "Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity).",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [
        "skills/geo-fundamentals/scripts/geo_checker.py"
      ],
      "path": "skills/geo-fundamentals/SKILL.md",
      "category": "SEO & Growth"
    },
    {
      "id": "i18n-localization",
      "name": "i18n-localization",
      "description": "Internationalization and localization patterns. Detecting hardcoded strings, managing translations, locale files, RTL support.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [
        "skills/i18n-localization/scripts/i18n_checker.py"
      ],
      "path": "skills/i18n-localization/SKILL.md",
      "category": "Other"
    },
    {
      "id": "intelligent-routing",
      "name": "intelligent-routing",
      "description": "Automatic agent selection and intelligent task routing. Analyzes user requests and automatically selects the best specialist agent(s) without requiring explicit user mentions.",
      "version": "1.1.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/intelligent-routing/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "jira-integration",
      "name": "jira-integration",
      "description": "Tích hợp Jira và Xray — lấy requirements/user stories từ Jira, xác thực Xray, và đẩy kết quả test lên Xray Cloud/Server.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/jira-integration/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "lint-and-validate",
      "name": "lint-and-validate",
      "description": "Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers on keywords: lint, format, check, validate, types, static analysis.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/lint-and-validate/scripts/lint_runner.py",
        "skills/lint-and-validate/scripts/type_coverage.py"
      ],
      "path": "skills/lint-and-validate/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "locator-healer",
      "name": "locator-healer",
      "description": "Tự động phát hiện và sửa chữa locators bị hỏng khi UI automation tests fail do thay đổi DOM.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/locator-healer/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "mcp-builder",
      "name": "mcp-builder",
      "description": "MCP (Model Context Protocol) server and client engineering. Protocol design, schemas, transports, extensions, security, and migration.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/mcp-builder/SKILL.md",
      "category": "Other"
    },
    {
      "id": "memory-system",
      "name": "memory-system",
      "description": "Persistent cross-session memory management. Enables agents to remember user preferences, project conventions, and past decisions across different sessions using a structured MEMORY.md index and topic files.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Grep",
        "Glob"
      ],
      "scripts": [],
      "path": "skills/memory-system/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "mobile-app-ui-ux",
      "name": "mobile-app-ui-ux",
      "description": "Mobile UX/UI design patterns, touch interaction ergonomics, and platform conventions for iOS and Android apps (React Native, Flutter, Swift, Kotlin). Use when designing mobile app interfaces, optimizing thumb zone navigation, handling safe areas (notch, dynamic island, home bar), designing bottom sheets and gesture flows, or auditing mobile touch targets and 60fps performance.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/mobile-app-ui-ux/SKILL.md",
      "category": "Mobile"
    },
    {
      "id": "mobile-design",
      "name": "mobile-design",
      "description": "Mobile-first design thinking and decision-making for iOS and Android apps. Touch interaction, performance patterns, platform conventions. Teaches principles, not fixed values. Use when building React Native, Flutter, or native mobile apps.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/mobile-design/scripts/mobile_audit.py"
      ],
      "path": "skills/mobile-design/SKILL.md",
      "category": "Mobile"
    },
    {
      "id": "nextjs-react-expert",
      "name": "nextjs-react-expert",
      "description": "React and Next.js performance optimization from Vercel Engineering. Use when building React components, optimizing performance, eliminating waterfalls, reducing bundle size, reviewing code for performance issues, or implementing server/client-side optimizations.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/nextjs-react-expert/scripts/convert_rules.py",
        "skills/nextjs-react-expert/scripts/react_performance_checker.py"
      ],
      "path": "skills/nextjs-react-expert/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "nodejs-best-practices",
      "name": "nodejs-best-practices",
      "description": "Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/nodejs-best-practices/SKILL.md",
      "category": "Backend & API"
    },
    {
      "id": "parallel-agents",
      "name": "parallel-agents",
      "description": "Multi-agent orchestration patterns. Use when multiple independent tasks can run with different domain expertise or when comprehensive analysis requires multiple perspectives.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/parallel-agents/SKILL.md",
      "category": "Orchestration & Memory"
    },
    {
      "id": "performance-profiling",
      "name": "performance-profiling",
      "description": "Performance profiling principles. Measurement, analysis, and optimization techniques.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/performance-profiling/scripts/bundle_analyzer.py",
        "skills/performance-profiling/scripts/lighthouse_audit.py"
      ],
      "path": "skills/performance-profiling/SKILL.md",
      "category": "Other"
    },
    {
      "id": "plan-writing",
      "name": "plan-writing",
      "description": "Structured task planning with clear breakdowns, dependencies, and verification criteria. Use when implementing features, refactoring, or any multi-step work.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/plan-writing/SKILL.md",
      "category": "Architecture & Planning"
    },
    {
      "id": "powershell-windows",
      "name": "powershell-windows",
      "description": "PowerShell Windows patterns. Critical pitfalls, operator syntax, error handling.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/powershell-windows/SKILL.md",
      "category": "Shell/CLI"
    },
    {
      "id": "python-patterns",
      "name": "python-patterns",
      "description": "Python development principles and decision-making. Framework selection, async patterns, type hints, project structure. Teaches thinking, not copying.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/python-patterns/SKILL.md",
      "category": "Backend & API"
    },
    {
      "id": "qa-automation-workflow",
      "name": "qa-automation-workflow",
      "description": "Quy trình kiểm thử automation toàn diện: sinh test script Playwright/Selenium/Appium/API, chuẩn POM, smart waits, tự động debug và verify.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/qa-automation-workflow/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "qa-framework-architect",
      "name": "qa-framework-architect",
      "description": "Thiết kế và scaffold automation framework hoàn chỉnh cho Playwright, Selenium, và Appium — bao gồm POM, base classes, config, reporting.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/qa-framework-architect/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "rbt-manual-testing",
      "name": "rbt-manual-testing",
      "description": "Sinh manual test cases với 2 modes: QUICK (sinh nhanh từ requirements) và FULL RBT (quy trình AI-RBT 6 bước có đánh giá rủi ro).",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/rbt-manual-testing/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "red-team-tactics",
      "name": "red-team-tactics",
      "description": "Red team tactics principles based on MITRE ATT&CK. Attack phases, detection evasion, reporting.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/red-team-tactics/SKILL.md",
      "category": "Security"
    },
    {
      "id": "requirements-analyzer",
      "name": "requirements-analyzer",
      "description": "Kỹ năng phân tích trang web/module và sinh ra tài liệu Yêu cầu (Requirements Document/User Stories) chuẩn mực.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/requirements-analyzer/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "responsive-web-design",
      "name": "responsive-web-design",
      "description": "Modern responsive web design, fluid typography, container queries, and cross-device layout strategies. Use when building adaptive web layouts across mobile, tablet, laptop, and ultra-wide screens, implementing fluid typography and spacing with clamp(), designing responsive navigation, or eliminating layout shifts (CLS).",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/responsive-web-design/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "rust-pro",
      "name": "rust-pro",
      "description": "Master modern Rust (2024 edition) with async patterns, advanced type system features, and production-ready systems programming. Expert in the current Rust ecosystem including Tokio, axum, and modern crates. Use PROACTIVELY for Rust development, performance optimization, or systems programming.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/rust-pro/SKILL.md",
      "category": "Backend & API"
    },
    {
      "id": "seo-fundamentals",
      "name": "seo-fundamentals",
      "description": "SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [
        "skills/seo-fundamentals/scripts/seo_checker.py"
      ],
      "path": "skills/seo-fundamentals/SKILL.md",
      "category": "SEO & Growth"
    },
    {
      "id": "server-management",
      "name": "server-management",
      "description": "Server management principles and decision-making. Process management, monitoring strategy, and scaling decisions. Teaches thinking, not commands.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/server-management/SKILL.md",
      "category": "Cloud & Infrastructure"
    },
    {
      "id": "simplify-code",
      "name": "simplify-code",
      "description": "Reduce complexity of over-engineered code. Identify unnecessary abstractions, remove dead code, flatten deep nesting, and simplify logic while preserving behavior.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Grep",
        "Glob"
      ],
      "scripts": [],
      "path": "skills/simplify-code/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "skillify",
      "name": "skillify",
      "description": "Auto-create new skills from repetitive workflows. When you notice yourself doing the same multi-step process repeatedly, extract it into a reusable SKILL.md that any agent can use.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/skillify/SKILL.md",
      "category": "Other"
    },
    {
      "id": "smart-locator",
      "name": "smart-locator",
      "description": "Sinh locator ổn định, bền vững và dễ bảo trì cho UI automation (Playwright, Selenium, Appium), ưu tiên semantic và data-testid.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/smart-locator/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "systematic-debugging",
      "name": "systematic-debugging",
      "description": "4-phase systematic debugging methodology with root cause analysis and evidence-based verification. Use when debugging complex issues.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/systematic-debugging/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "tailwind-patterns",
      "name": "tailwind-patterns",
      "description": "Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns, design token architecture.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep"
      ],
      "scripts": [],
      "path": "skills/tailwind-patterns/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "tdd-workflow",
      "name": "tdd-workflow",
      "description": "Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/tdd-workflow/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "test-data-generator",
      "name": "test-data-generator",
      "description": "Sinh test data có cấu trúc, unique, traceable (timestamp/random prefix) cho automation tests, hỗ trợ combinatorial pairwise test data.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/test-data-generator/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "testing-patterns",
      "name": "testing-patterns",
      "description": "Testing patterns and principles. Unit, integration, mocking strategies.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/testing-patterns/scripts/test_runner.py"
      ],
      "path": "skills/testing-patterns/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "ui-debug",
      "name": "ui-debug",
      "description": "Inspect web/mobile applications bằng browser tools, phân tích DOM elements, chụp snapshot, debug UI automation failures với viewport 1920x1080 headed.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/ui-debug/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "ui-ux-design-system",
      "name": "ui-ux-design-system",
      "description": "Design system architecture, design tokens, and scalable UI component libraries for web and mobile. Use when architecting design systems, creating design tokens (colors, typography, spacing, shadows, radius), establishing component hierarchies (Atomic Design), defining multi-state component contracts (hover, active, focus-visible, disabled, loading, empty, error), or configuring multi-theme/dark mode systems.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/ui-ux-design-system/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "ux-audit-and-heuristics",
      "name": "ux-audit-and-heuristics",
      "description": "UX evaluation, usability heuristics audit, cognitive load reduction, and conversion rate optimization (CRO) for web and mobile apps. Use when conducting UX reviews, auditing interfaces against Nielsen's 10 Heuristics, optimizing form UX and error handling, reducing cognitive load, or improving onboarding and empty states.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [],
      "path": "skills/ux-audit-and-heuristics/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "verify-changes",
      "name": "verify-changes",
      "description": "Prove code works by running it, not just checking it exists. Verification through execution rather than inspection. Use after writing or modifying code to ensure it actually functions correctly.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Bash",
        "Grep",
        "Glob"
      ],
      "scripts": [],
      "path": "skills/verify-changes/SKILL.md",
      "category": "Testing & Quality"
    },
    {
      "id": "vulnerability-scanner",
      "name": "vulnerability-scanner",
      "description": "Advanced vulnerability analysis principles. OWASP 2025, Supply Chain Security, attack surface mapping, risk prioritization.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/vulnerability-scanner/scripts/dependency_analyzer.py",
        "skills/vulnerability-scanner/scripts/security_scan.py"
      ],
      "path": "skills/vulnerability-scanner/SKILL.md",
      "category": "Security"
    },
    {
      "id": "web-design-guidelines",
      "name": "web-design-guidelines",
      "description": "Review UI code for Web Interface Guidelines compliance. Use when asked to \"review my UI\", \"check accessibility\", \"audit design\", \"review UX\", or \"check my site against best practices\".",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Grep",
        "Glob",
        "WebFetch"
      ],
      "scripts": [],
      "path": "skills/web-design-guidelines/SKILL.md",
      "category": "Frontend & UI"
    },
    {
      "id": "webapp-testing",
      "name": "webapp-testing",
      "description": "Web application testing principles. E2E, Playwright, deep audit strategies.",
      "version": "1.0.0",
      "allowedTools": [
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Bash"
      ],
      "scripts": [
        "skills/webapp-testing/scripts/playwright_runner.py"
      ],
      "path": "skills/webapp-testing/SKILL.md",
      "category": "Testing & Quality"
    }
  ],
  "workflows": [
    {
      "id": "analyze-flaky-tests",
      "name": "/analyze_flaky_tests",
      "slug": "analyze-flaky-tests",
      "description": "Phân tích và khắc phục các automation test không ổn định (flaky tests).",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "flaky-test-analyzer",
          "qa-automation-workflow"
        ]
      },
      "artifactOutputs": [
        "test-report"
      ],
      "path": "workflows/analyze-flaky-tests.md"
    },
    {
      "id": "analyze-requirement-document",
      "name": "/analyze_requirement_document",
      "slug": "analyze-requirement-document",
      "description": "Phân tích requirement document (Jira/.doc) — sinh tài liệu phân tích nghiệp vụ, rủi ro, gap và test scope.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "requirements-analyzer",
          "rbt-manual-testing"
        ]
      },
      "artifactOutputs": [
        "requirement-spec"
      ],
      "path": "workflows/analyze-requirement-document.md"
    },
    {
      "id": "brainstorm",
      "name": "/brainstorm",
      "slug": "brainstorm",
      "description": "Structured brainstorming for projects and features. Explores multiple options before implementation.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "project-planner"
        ],
        "skills": [
          "brainstorming"
        ]
      },
      "artifactOutputs": [
        "discovery-notes",
        "decision-summary"
      ],
      "path": "workflows/brainstorm.md"
    },
    {
      "id": "coordinate",
      "name": "/coordinate",
      "slug": "coordinate",
      "description": "Advanced multi-agent coordination with parallel dispatch and synthesis. Use for complex tasks requiring multiple specialist perspectives.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "orchestrator"
        ],
        "skills": [
          "coordinator-mode",
          "parallel-agents"
        ]
      },
      "artifactOutputs": [
        "coordination-plan",
        "phase-status"
      ],
      "path": "workflows/coordinate.md"
    },
    {
      "id": "create",
      "name": "/create",
      "slug": "create",
      "description": "Create new application command. Triggers App Builder skill and starts interactive dialogue with user.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "orchestrator",
          "project-planner"
        ],
        "skills": [
          "app-builder",
          "design-spec",
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "implementation-plan",
        "changed-files",
        "verification-report"
      ],
      "path": "workflows/create.md"
    },
    {
      "id": "debug",
      "name": "/debug",
      "slug": "debug",
      "description": "Debugging command. Activates DEBUG mode for systematic problem investigation.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "debugger"
        ],
        "skills": [
          "systematic-debugging",
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "root-cause",
        "fix-summary",
        "verification-report"
      ],
      "path": "workflows/debug.md"
    },
    {
      "id": "deploy",
      "name": "/deploy",
      "slug": "deploy",
      "description": "Deployment command for production releases. Pre-flight checks and deployment execution.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "devops-engineer"
        ],
        "skills": [
          "deployment-procedures",
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "deployment-plan",
        "deployment-report",
        "rollback-plan"
      ],
      "path": "workflows/deploy.md"
    },
    {
      "id": "enhance",
      "name": "/enhance",
      "slug": "enhance",
      "description": "Add or update features in existing application. Used for iterative development.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "code-archaeologist"
        ],
        "skills": [
          "simplify-code",
          "clean-code",
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "change-plan",
        "changed-files",
        "verification-report"
      ],
      "path": "workflows/enhance.md"
    },
    {
      "id": "fetch-jira-requirements",
      "name": "/fetch_jira_requirements",
      "slug": "fetch-jira-requirements",
      "description": "Lấy requirements/user stories từ Jira và lưu trữ thành tài liệu Markdown.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "jira-integration",
          "requirements-analyzer"
        ]
      },
      "artifactOutputs": [
        "requirement-spec"
      ],
      "path": "workflows/fetch-jira-requirements.md"
    },
    {
      "id": "generate-api-tests-from-swagger",
      "name": "/generate_api_tests_from_swagger",
      "slug": "generate-api-tests-from-swagger",
      "description": "Sinh API automation test scripts tự động từ Swagger/OpenAPI spec.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "qa-automation-workflow",
          "test-data-generator"
        ]
      },
      "artifactOutputs": [
        "automation-suite"
      ],
      "path": "workflows/generate-api-tests-from-swagger.md"
    },
    {
      "id": "generate-application-test-plan",
      "name": "/generate_application_test_plan",
      "slug": "generate-application-test-plan",
      "description": "Khám phá toàn diện ứng dụng web/mobile và xây dựng Test Plan chiến lược hoặc Full Test Suite.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "requirements-analyzer",
          "rbt-manual-testing",
          "ui-debug"
        ]
      },
      "artifactOutputs": [
        "test-plan"
      ],
      "path": "workflows/generate-application-test-plan.md"
    },
    {
      "id": "generate-automation-framework",
      "name": "/generate_automation_framework",
      "slug": "generate-automation-framework",
      "description": "Thiết kế và scaffold khung automation test hoàn chỉnh cho Playwright, Selenium, hoặc Appium.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "qa-framework-architect",
          "qa-automation-workflow"
        ]
      },
      "artifactOutputs": [
        "automation-framework"
      ],
      "path": "workflows/generate-automation-framework.md"
    },
    {
      "id": "generate-automation-from-testcases",
      "name": "/generate_automation_from_testcases",
      "slug": "generate-automation-from-testcases",
      "description": "Chuyển đổi Manual Test Cases thành kịch bản Automation Test (Playwright, Selenium) theo chuẩn POM.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "qa-automation-workflow",
          "smart-locator",
          "test-data-generator"
        ]
      },
      "artifactOutputs": [
        "automation-suite"
      ],
      "path": "workflows/generate-automation-from-testcases.md"
    },
    {
      "id": "generate-automation-from-ui-flow",
      "name": "/generate_automation_from_ui_flow",
      "slug": "generate-automation-from-ui-flow",
      "description": "Trực tiếp điều tra UI flow trên trình duyệt và tự động sinh mã automation test.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "ui-debug",
          "smart-locator",
          "qa-automation-workflow"
        ]
      },
      "artifactOutputs": [
        "automation-suite"
      ],
      "path": "workflows/generate-automation-from-ui-flow.md"
    },
    {
      "id": "generate-combinatorial-test-data",
      "name": "/generate_combinatorial_test_data",
      "slug": "generate-combinatorial-test-data",
      "description": "Sinh bộ dữ liệu kiểm thử tổ hợp (Pairwise/Orthogonal Array) từ ma trận kết hợp.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "test-data-generator"
        ]
      },
      "artifactOutputs": [
        "test-data"
      ],
      "path": "workflows/generate-combinatorial-test-data.md"
    },
    {
      "id": "generate-cross-module-test-plan",
      "name": "/generate_cross_module_test_plan",
      "slug": "generate-cross-module-test-plan",
      "description": "Phân tích kiểm thử tương tác đa module (Cross-Module) và sinh ma trận kết hợp Pairwise.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "rbt-manual-testing",
          "test-data-generator"
        ]
      },
      "artifactOutputs": [
        "test-plan"
      ],
      "path": "workflows/generate-cross-module-test-plan.md"
    },
    {
      "id": "generate-locator",
      "name": "/generate_locator",
      "slug": "generate-locator",
      "description": "Phân tích DOM và sinh locator bền vững, tối ưu cho Playwright, Selenium, hoặc Appium.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "smart-locator",
          "ui-debug"
        ]
      },
      "artifactOutputs": [
        "locator-spec"
      ],
      "path": "workflows/generate-locator.md"
    },
    {
      "id": "generate-manual-testcases-rbt",
      "name": "/generate_manual_testcases_rbt",
      "slug": "generate-manual-testcases-rbt",
      "description": "Sinh manual test cases chất lượng cao theo quy trình AI-RBT 6 bước (Risk-Based Testing).",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "rbt-manual-testing",
          "requirements-analyzer"
        ]
      },
      "artifactOutputs": [
        "test-cases"
      ],
      "path": "workflows/generate-manual-testcases-rbt.md"
    },
    {
      "id": "generate-requirements-from-website",
      "name": "/generate_requirements_from_website",
      "slug": "generate-requirements-from-website",
      "description": "Trực tiếp duyệt website và trích xuất tài liệu Requirements / User Stories chuẩn mực.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "requirements-analyzer",
          "ui-debug"
        ]
      },
      "artifactOutputs": [
        "requirement-spec"
      ],
      "path": "workflows/generate-requirements-from-website.md"
    },
    {
      "id": "generate-test-data",
      "name": "/generate_test_data",
      "slug": "generate-test-data",
      "description": "Sinh tập dữ liệu test có cấu trúc, unique, traceable và phù hợp với nhiều miền giá trị.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "test-data-generator"
        ]
      },
      "artifactOutputs": [
        "test-data"
      ],
      "path": "workflows/generate-test-data.md"
    },
    {
      "id": "generate-testcases-from-requirements",
      "name": "/generate_testcases_from_requirements",
      "slug": "generate-testcases-from-requirements",
      "description": "Sinh test cases nhanh chóng từ tài liệu requirements (Quick Mode).",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "rbt-manual-testing"
        ]
      },
      "artifactOutputs": [
        "test-cases"
      ],
      "path": "workflows/generate-testcases-from-requirements.md"
    },
    {
      "id": "import-test-results-xray",
      "name": "/import_test_results_xray",
      "slug": "import-test-results-xray",
      "description": "Xác thực và tự động import kết quả test execution lên Jira Xray Cloud/Server.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "qa-automation-engineer"
        ],
        "skills": [
          "jira-integration"
        ]
      },
      "artifactOutputs": [
        "test-report"
      ],
      "path": "workflows/import-test-results-xray.md"
    },
    {
      "id": "orchestrate",
      "name": "/orchestrate",
      "slug": "orchestrate",
      "description": "Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "orchestrator"
        ],
        "skills": [
          "parallel-agents",
          "coordinator-mode"
        ]
      },
      "artifactOutputs": [
        "task-graph",
        "coordination-status",
        "final-synthesis"
      ],
      "path": "workflows/orchestrate.md"
    },
    {
      "id": "plan",
      "name": "/plan",
      "slug": "plan",
      "description": "Create project plan using project-planner agent. No code writing - only plan file generation.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "project-planner"
        ],
        "skills": [
          "plan-writing",
          "architecture"
        ]
      },
      "artifactOutputs": [
        "implementation-plan"
      ],
      "path": "workflows/plan.md"
    },
    {
      "id": "preview",
      "name": "/preview",
      "slug": "preview",
      "description": "Preview server start, stop, and status check. Local development server management.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "frontend-specialist"
        ],
        "skills": [
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "preview-status",
        "runtime-findings"
      ],
      "path": "workflows/preview.md"
    },
    {
      "id": "remember",
      "name": "/remember",
      "slug": "remember",
      "description": "Save information to persistent memory for cross-session recall. Stores preferences, conventions, decisions, and context.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "orchestrator"
        ],
        "skills": [
          "memory-system"
        ]
      },
      "artifactOutputs": [
        "memory-entry"
      ],
      "path": "workflows/remember.md"
    },
    {
      "id": "status",
      "name": "/status",
      "slug": "status",
      "description": "Display agent and project status. Progress tracking and status board.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "orchestrator"
        ],
        "skills": [
          "context-compression",
          "memory-system"
        ]
      },
      "artifactOutputs": [
        "status-report"
      ],
      "path": "workflows/status.md"
    },
    {
      "id": "test",
      "name": "/test",
      "slug": "test",
      "description": "Test generation and test running command. Creates and executes tests for code.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "test-engineer"
        ],
        "skills": [
          "testing-patterns",
          "verify-changes"
        ]
      },
      "artifactOutputs": [
        "test-report"
      ],
      "path": "workflows/test.md"
    },
    {
      "id": "verify",
      "name": "/verify",
      "slug": "verify",
      "description": "Verify code changes work by running them. Proves through execution, not just inspection.",
      "version": "1.0.0",
      "requires": {
        "agents": [
          "test-engineer"
        ],
        "skills": [
          "verify-changes",
          "lint-and-validate"
        ]
      },
      "artifactOutputs": [
        "verification-report"
      ],
      "path": "workflows/verify.md"
    }
  ],
  "rules": [
    {
      "id": "code-rules",
      "name": "code-rules",
      "priority": "P0",
      "trigger": "model_decision",
      "version": "1.0.0",
      "description": "Apply when writing, building, refactoring, or fixing code — project-type agent routing, the Socratic Gate, Plan Mode phases, and the final checklist/scripts. Skip for pure questions or text-only responses.",
      "path": "rules/code-rules.md"
    },
    {
      "id": "core-protocol",
      "name": "core-protocol",
      "priority": "P0",
      "trigger": "always_on",
      "version": "1.0.0",
      "description": "The highest-priority workspace rules. How the AI loads agents/skills, skill announcement protocol, file dependency awareness, and read-understand-apply enforcement.",
      "path": "rules/core-protocol.md"
    },
    {
      "id": "design-rules",
      "name": "design-rules",
      "priority": "P0",
      "trigger": "glob",
      "version": "1.0.0",
      "description": "Anti-slop UI design principles, purple ban enforcement, high contrast, clean typography, responsive layout contracts.",
      "path": "rules/design-rules.md"
    },
    {
      "id": "qa-testing-rules",
      "name": "qa-testing-rules",
      "priority": "P1",
      "trigger": "model_decision",
      "version": "1.0.0",
      "description": "Strict guidelines for QA testing, manual test case design, locator strategy, smart waits, Playwright/Selenium/Appium automation, and API verification.",
      "path": "rules/qa-testing-rules.md"
    },
    {
      "id": "quick-reference",
      "name": "quick-reference",
      "priority": "P2",
      "trigger": "model_decision",
      "version": "1.0.0",
      "description": "Apply when you need a fast lookup of which agents, skills, or validation scripts exist — for routing decisions or recalling the master/key components of the kit.",
      "path": "rules/quick-reference.md"
    },
    {
      "id": "request-routing",
      "name": "request-routing",
      "priority": "P0",
      "trigger": "always_on",
      "version": "1.0.0",
      "description": "Always-active request classifier and intelligent agent auto-routing to specialist personas before responding.",
      "path": "rules/request-routing.md"
    },
    {
      "id": "universal-rules",
      "name": "universal-rules",
      "priority": "P0",
      "trigger": "always_on",
      "version": "1.0.0",
      "description": "Always-active universal rules (TIER 0): multilingual handling, clean-code standard, AAA testing, security verification.",
      "path": "rules/universal-rules.md"
    }
  ],
  "contracts": {
    "antigravityRuntime": "1.0.0",
    "componentApi": "1.0.0",
    "memorySchema": "1.0.0",
    "rulesApi": "1.0.0",
    "workflowApi": "1.0.0"
  },
  "runtimes": {
    "antigravity": {
      "path": "antigravity.json",
      "phases": {
        "discovery": {
          "rules": ".agents/rules",
          "skills": ".agents/skills",
          "workflows": ".agents/workflows"
        },
        "hooks": {
          "config": ".agents/hooks.json",
          "policy": ".agents/hooks/validate-tool-call.mjs"
        },
        "mcp": {
          "cliGlobalConfig": "~/.gemini/antigravity-cli/mcp_config.json",
          "suiteGlobalConfig": "~/.gemini/config/mcp_config.json",
          "workspaceConfig": ".agents/mcp_config.json"
        },
        "orchestration": {
          "agents": [
            "orchestrator",
            "project-planner",
            "security-auditor",
            "test-engineer"
          ],
          "skills": [
            "coordinator-mode",
            "parallel-agents",
            "intelligent-routing",
            "verify-changes"
          ],
          "workflows": [
            "coordinate",
            "orchestrate"
          ]
        },
        "plugin": {
          "builder": ".agents/hooks/build-plugin.mjs",
          "defaultOutput": "dist/antigravity-plugin"
        },
        "validation": {
          "doctor": ".agents/hooks/antigravity-doctor.mjs",
          "tests": ".agents/hooks/tests"
        }
      },
      "requiredCliCommands": [
        "changelog",
        "plugin",
        "update"
      ],
      "schemaVersion": "1.0.0"
    }
  }
};

// =========================================================
// INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
  await initData();
  setupNavTabs();
  initOverviewTab();
  initCatalogTab();
  initSimulatorTab();
  initSetupTab();
  setupKeyboardShortcuts();
});

async function initData() {
  try {
    const res = await fetch('manifest.json');
    if (res.ok) {
      const liveData = await res.json();
      state.data.manifest = liveData;
      console.log('Successfully loaded live manifest data.');
    }
  } catch (err) {
    console.info('Using embedded fallback manifest data (standalone mode).');
  }

  // Flatten catalog items
  const m = state.data.manifest;
  state.catalog.items = [
    ...(m.agents || []).map(a => ({ ...a, kind: 'agent' })),
    ...(m.skills || []).map(s => ({ ...s, kind: 'skill' })),
    ...(m.workflows || []).map(w => ({ ...w, kind: 'workflow' })),
    ...(m.rules || []).map(r => ({ ...r, kind: 'rule' }))
  ];

  // Update hero stats
  const statAgents = document.getElementById('stat-agents');
  const statSkills = document.getElementById('stat-skills');
  const statWorkflows = document.getElementById('stat-workflows');
  const statRules = document.getElementById('stat-rules');

  if (statAgents) statAgents.textContent = (m.agents || []).length;
  if (statSkills) statSkills.textContent = (m.skills || []).length;
  if (statWorkflows) statWorkflows.textContent = (m.workflows || []).length;
  if (statRules) statRules.textContent = (m.rules || []).length;
}

// Navigation Tabs
function setupNavTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      switchTab(target);
    });
  });

  const btnDoc = document.getElementById('btn-quick-doctor');
  if (btnDoc) {
    btnDoc.addEventListener('click', () => {
      switchTab('setup');
      showToast('Đã chuyển đến trang hướng dẫn Antigravity Doctor.');
    });
  }
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabName}`);
  });
}

// =========================================================
// TAB 1: OVERVIEW TAB LOGIC
// =========================================================
function initOverviewTab() {
  renderPhasesTimeline();
  setupPreToolUseSandbox();
}

function renderPhasesTimeline() {
  const container = document.getElementById('phases-timeline');
  if (!container) return;

  const phases = state.data.phases;
  container.innerHTML = phases.map((p, idx) => `
    <div class="phase-node ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
      <div class="phase-step-badge">${p.step}</div>
      <div class="phase-name">${p.name}</div>
      <div class="phase-sub">${p.subtitle}</div>
    </div>
  `).join('');

  const nodes = container.querySelectorAll('.phase-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.dataset.idx, 10);
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      renderPhaseDetail(phases[idx]);
    });
  });

  if (phases.length > 0) {
    renderPhaseDetail(phases[0]);
  }
}

function renderPhaseDetail(phase) {
  const detailCard = document.getElementById('phase-detail-card');
  if (!detailCard) return;

  detailCard.innerHTML = `
    <div class="phase-detail-header">
      <div class="phase-detail-title">Pha ${phase.step}: ${phase.name} — ${phase.subtitle}</div>
      <div class="phase-detail-guarantee">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        ${phase.guarantee}
      </div>
    </div>
    <div class="phase-detail-body">${phase.desc}</div>
    <div>
      <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">Tệp tin quản lý & Hợp đồng:</div>
      <div class="phase-files-list">
        ${phase.files.map(f => `<span class="file-tag">${f}</span>`).join('')}
      </div>
    </div>
  `;
}

// PreToolUse Sandbox Tester
const BLOCK_PATTERNS = [
  {
    id: 'unix-root-delete',
    pattern: /(?:^|[;&|]\s*)(?:sudo\s+)?rm\s+(?:-[A-Za-z]*r[A-Za-z]*f[A-Za-z]*|-[A-Za-z]*f[A-Za-z]*r[A-Za-z]*)\s+(?:--\s+)?\/(?:\*|\s|$)/i,
    message: 'Lệnh xóa đệ quy gốc hệ điều hành (recursive deletion of filesystem root)'
  },
  {
    id: 'filesystem-format',
    pattern: /(?:^|[;&|]\s*)(?:sudo\s+)?mkfs(?:\.[A-Za-z0-9_-]+)?\b/i,
    message: 'Lệnh định dạng lại hệ thống tệp tin (filesystem formatting command)'
  },
  {
    id: 'raw-disk-overwrite',
    pattern: /\bdd\b[^\n]*\bof=\/dev\/(?:sd|nvme|vd|xvd)[A-Za-z0-9_-]*/i,
    message: 'Lệnh ghi đè dữ liệu trực tiếp lên phân vùng ổ đĩa thô (raw disk overwrite)'
  },
  {
    id: 'windows-drive-format',
    pattern: /(?:^|[;&|]\s*)format(?:\.com)?\s+[A-Za-z]:/i,
    message: 'Lệnh định dạng ổ đĩa Windows (Windows drive format)'
  },
  {
    id: 'windows-root-delete',
    pattern: /remove-item\b[^\n]*-(?:recurse|r)\b[^\n]*-(?:force|fo)\b[^\n]*(?:[A-Za-z]:\\(?:\s|$)|[A-Za-z]:\\\*)/i,
    message: 'Lệnh xóa triệt để ổ đĩa gốc Windows (Windows root recursive deletion)'
  }
];

function testPreToolUseCommand(cmd) {
  const trimmed = cmd.trim();
  for (const rule of BLOCK_PATTERNS) {
    if (rule.pattern.test(trimmed)) {
      return {
        blocked: true,
        ruleId: rule.id,
        reason: rule.message
      };
    }
  }
  return { blocked: false };
}

function setupPreToolUseSandbox() {
  const input = document.getElementById('sandbox-input');
  const btn = document.getElementById('btn-test-sandbox');
  const resultBox = document.getElementById('sandbox-result');
  const chips = document.querySelectorAll('.cmd-chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (input) {
        input.value = chip.dataset.cmd;
        runSandboxTest();
      }
    });
  });

  if (btn && input) {
    btn.addEventListener('click', runSandboxTest);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSandboxTest();
    });
  }

  function runSandboxTest() {
    if (!input || !resultBox) return;
    const cmd = input.value;
    const res = testPreToolUseCommand(cmd);

    if (res.blocked) {
      resultBox.className = 'sandbox-result blocked';
      resultBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
        <div>
          <div style="font-weight: 700; color: #FDA4AF;">❌ BLOCKED BY PRE-TOOL-USE GATE (Exit Code 1)</div>
          <div style="font-size: 0.8rem; margin-top: 2px;">Quy tắc vi phạm: <strong>${res.ruleId}</strong> — ${res.reason}.</div>
          <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 4px;">Hành động này bị chặn hoàn toàn trước khi chuyển tới Antigravity Bash tool.</div>
        </div>
      `;
    } else {
      resultBox.className = 'sandbox-result allowed';
      resultBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <div>
          <div style="font-weight: 700; color: #A7F3D0;">✅ ALLOWED TO EXECUTE (Exit Code 0)</div>
          <div style="font-size: 0.8rem; margin-top: 2px;">Lệnh an toàn. Không trùng khớp với bất kỳ mẫu phá hủy hệ thống nào trong chính sách.</div>
          <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 4px;">Lệnh sẽ được chuyển tiếp an toàn tới Bash runtime kèm quyền kiểm soát của người dùng.</div>
        </div>
      `;
    }
  }

  runSandboxTest();
}

// =========================================================
// TAB 2: EXPLORER & CATALOG TAB LOGIC
// =========================================================
function initCatalogTab() {
  setupCatalogFilters();
  renderSubcatChips();
  renderCatalogItems();
  setupDetailModal();
}

function setupCatalogFilters() {
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalog.search = e.target.value.toLowerCase();
      renderCatalogItems();
    });
  }

  const typeButtons = document.querySelectorAll('.type-filter-btn');
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.catalog.type = btn.dataset.type;
      renderSubcatChips();
      renderCatalogItems();
    });
  });
}

function renderSubcatChips() {
  const container = document.getElementById('subcat-chips');
  if (!container) return;

  const currentType = state.catalog.type;
  let subcats = ['Tất cả'];

  if (currentType === 'agent' || currentType === 'all') {
    subcats.push('Coordination & Product', 'Frontend & Design', 'Backend & Data', 'Security', 'Testing & Quality', 'Specialist Engineering');
  }
  if (currentType === 'skill' || currentType === 'all') {
    subcats.push('Frontend & UI', 'Backend & API', 'Architecture & Planning', 'Testing & Quality', 'Security', 'Orchestration & Memory', 'Mobile', 'Cloud & Infrastructure', 'Shell/CLI');
  }

  subcats = [...new Set(subcats)];

  container.innerHTML = subcats.map((sc, i) => `
    <button class="subcat-chip ${i === 0 ? 'active' : ''}" data-sub="${sc}">${sc}</button>
  `).join('');

  container.querySelectorAll('.subcat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.subcat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.catalog.subcat = chip.dataset.sub === 'Tất cả' ? 'all' : chip.dataset.sub;
      renderCatalogItems();
    });
  });
}

function renderCatalogItems() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const { type, subcat, search, items } = state.catalog;

  const filtered = items.filter(item => {
    if (type !== 'all' && item.kind !== type) return false;
    if (subcat !== 'all') {
      if (item.category && item.category !== subcat) return false;
      if (!item.category) return false;
    }
    if (search) {
      const name = (item.name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const tools = (item.tools || item.allowedTools || []).join(' ').toLowerCase();
      if (!name.includes(search) && !desc.includes(search) && !cat.includes(search) && !tools.includes(search)) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <div style="font-size: 1.1rem; color: #FFFFFF; font-weight: 600;">Không tìm thấy thành phần phù hợp</div>
        <div style="font-size: 0.85rem; margin-top: 0.35rem;">Hãy thử từ khóa khác hoặc bỏ bộ lọc danh mục.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    let iconLetter = 'A';
    let iconClass = 'agent';
    let subInfo = item.category || 'Specialist Agent';

    if (item.kind === 'skill') {
      iconLetter = 'S';
      iconClass = 'skill';
      subInfo = item.category || 'Modular Skill';
    } else if (item.kind === 'workflow') {
      iconLetter = '/';
      iconClass = 'workflow';
      subInfo = 'Slash Command Workflow';
    } else if (item.kind === 'rule') {
      iconLetter = 'R';
      iconClass = 'rule';
      subInfo = `${item.priority || 'P0'} Rule (${item.trigger || 'always_on'})`;
    }

    const tools = item.tools || item.allowedTools || [];
    const tagsHtml = tools.slice(0, 4).map(t => `<span class="card-tag">${t}</span>`).join('');

    return `
      <div class="item-card">
        <div class="card-top">
          <div class="card-header-line">
            <div class="item-title-wrap">
              <div class="item-kind-icon ${iconClass}">${iconLetter}</div>
              <div>
                <div class="item-name">${item.name}</div>
                <div class="item-meta-sub">${subInfo}</div>
              </div>
            </div>
            <span class="item-version-badge">v${item.version || '1.0.0'}</span>
          </div>
          <p class="item-desc">${item.description || 'Không có mô tả chi tiết.'}</p>
          <div class="card-tags">
            ${tagsHtml}
            ${tools.length > 4 ? `<span class="card-tag">+${tools.length - 4}</span>` : ''}
          </div>
        </div>
        <div class="card-actions">
          <button class="card-btn btn-details" data-id="${item.id}" data-kind="${item.kind}">Xem chi tiết</button>
          <button class="card-btn btn-copy-prompt" data-id="${item.id}" data-kind="${item.kind}">Copy Prompt</button>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const kind = btn.dataset.kind;
      const target = state.catalog.items.find(x => x.id === id && x.kind === kind);
      if (target) openDetailModal(target);
    });
  });

  grid.querySelectorAll('.btn-copy-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const kind = btn.dataset.kind;
      const target = state.catalog.items.find(x => x.id === id && x.kind === kind);
      if (target) {
        const promptText = generatePromptText(target);
        copyToClipboard(promptText);
        showToast(`Đã sao chép prompt cho @[${target.name}]!`);
      }
    });
  });
}

function generatePromptText(item) {
  if (item.kind === 'agent') {
    return `🤖 **Applying knowledge of @[${item.name}]...**\n\nNhiệm vụ: [Nhập yêu cầu chuyên môn cần xử lý]`;
  } else if (item.kind === 'skill') {
    return `📚 **Using skill: @[${item.name}]...**\n\nNgữ cảnh: Tải quy chuẩn và hướng dẫn từ skill @[${item.name}].`;
  } else if (item.kind === 'workflow') {
    return `${item.name} [Mô tả mục tiêu thực thi]`;
  } else if (item.kind === 'rule') {
    return `Tuân thủ nghiêm ngặt quy tắc P0 Workspace: @[${item.name}]`;
  }
  return item.name;
}

let currentModalItem = null;

function setupDetailModal() {
  const modal = document.getElementById('detail-modal');
  const closeBtn = document.getElementById('modal-close');
  const footerCloseBtn = document.getElementById('modal-btn-close');
  const copyBtn = document.getElementById('modal-btn-copy');

  const closeFn = () => {
    if (modal) modal.classList.remove('open');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeFn);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeFn);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFn();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (currentModalItem) {
        const prompt = generatePromptText(currentModalItem);
        copyToClipboard(prompt);
        showToast(`Đã sao chép prompt @[${currentModalItem.name}] thành công!`);
        closeFn();
      }
    });
  }
}

function openDetailModal(item) {
  currentModalItem = item;
  const modal = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const sub = document.getElementById('modal-subtitle');
  const icon = document.getElementById('modal-kind-icon');
  const desc = document.getElementById('modal-desc');
  const toolsBox = document.getElementById('modal-tools');
  const reqBox = document.getElementById('modal-requires');
  const promptBox = document.getElementById('modal-prompt');

  if (!modal) return;

  title.textContent = item.name;
  sub.textContent = `${item.kind.toUpperCase()} • v${item.version || '1.0.0'} • ${item.category || ''}`;

  icon.className = `item-kind-icon ${item.kind}`;
  icon.textContent = item.kind === 'workflow' ? '/' : item.kind.charAt(0).toUpperCase();

  desc.textContent = item.description || 'Không có mô tả bổ sung.';

  const tools = item.tools || item.allowedTools || [];
  if (tools.length > 0) {
    toolsBox.innerHTML = tools.map(t => `<span class="card-tag" style="color: var(--accent-cyan-light);">${t}</span>`).join('');
    document.getElementById('modal-tools-section').style.display = 'block';
  } else {
    document.getElementById('modal-tools-section').style.display = 'none';
  }

  const reqs = item.skills || (item.requires ? Object.values(item.requires).flat() : []);
  if (reqs.length > 0) {
    reqBox.innerHTML = reqs.map(r => `<span class="card-tag" style="color: #34D399;">${r}</span>`).join('');
    document.getElementById('modal-requires-section').style.display = 'block';
  } else {
    document.getElementById('modal-requires-section').style.display = 'none';
  }

  promptBox.textContent = generatePromptText(item);
  modal.classList.add('open');
}

// =========================================================
// TAB 3: MULTI-AGENT SIMULATOR TAB LOGIC
// =========================================================
function initSimulatorTab() {
  setupSimulatorControls();
  loadSimulatorPreset('webapp');
}

function setupSimulatorControls() {
  const presetList = document.getElementById('preset-list');
  if (presetList) {
    const presets = state.data.presets;
    presetList.innerHTML = Object.entries(presets).map(([k, p], idx) => `
      <button class="preset-btn ${idx === 0 ? 'active' : ''}" data-key="${k}">
        <span>${p.name}</span>
        <span class="preset-agent-count">${p.agents.length} agents</span>
      </button>
    `).join('');

    presetList.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        presetList.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.simulator.presetKey = btn.dataset.key;
        loadSimulatorPreset(btn.dataset.key);
      });
    });
  }

  const toggleBtns = document.querySelectorAll('.sim-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.simulator.mode = btn.dataset.flow;
      updateSimulatorWorkflowMode();
    });
  });

  const startBtn = document.getElementById('btn-start-sim');
  const resetBtn = document.getElementById('btn-reset-sim');
  const speedSelect = document.getElementById('sim-speed');

  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      state.simulator.speed = parseInt(e.target.value, 10);
    });
  }

  if (startBtn) startBtn.addEventListener('click', toggleSimulatorRun);
  if (resetBtn) resetBtn.addEventListener('click', resetSimulator);

  const gateApproveBtn = document.getElementById('btn-gate-approve');
  if (gateApproveBtn) {
    gateApproveBtn.addEventListener('click', () => {
      logTerminal('User approved {task-slug}.md plan at checkpoint gate.', 'success');
      showToast('Đã phê duyệt kế hoạch! Bắt đầu thực thi song song.');
      if (state.simulator.isRunning && state.simulator.step === 1) {
        advanceSimulationStep();
      }
    });
  }
}

function updateSimulatorWorkflowMode() {
  const mode = state.simulator.mode;
  const p1Block = document.getElementById('sim-p1');
  const p2Block = document.getElementById('sim-p2');
  const p3Block = document.getElementById('sim-p3');
  const minBadge = document.getElementById('sim-agent-min-badge');

  if (mode === 'coordinate') {
    if (minBadge) minBadge.textContent = 'Parallel Workers Dispatch';
    p1Block.querySelector('.sim-phase-name').textContent = 'Phase 1: Worker Decompose & Research';
    p1Block.querySelector('.sim-phase-rule').textContent = 'Phân tách bài toán và thu thập thông tin song song';
    p2Block.querySelector('.sim-phase-name').textContent = 'Phase 2: Sequential Writes & Implementation';
    p2Block.querySelector('.sim-phase-rule').textContent = 'Ghi code tuần tự để tránh xung đột tài nguyên';
    p3Block.querySelector('.sim-phase-name').textContent = 'Phase 3: Insight Synthesis & Verification';
    p3Block.querySelector('.sim-phase-rule').textContent = 'Tổng hợp sâu sắc, không copy-paste';
  } else {
    if (minBadge) minBadge.textContent = 'Tối thiểu 3 Agents';
    p1Block.querySelector('.sim-phase-name').textContent = 'Phase 1: Sequential Planning (Tuần tự)';
    p1Block.querySelector('.sim-phase-rule').textContent = 'Chỉ project-planner / explorer-agent • Chưa code';
    p2Block.querySelector('.sim-phase-name').textContent = 'Phase 2: Parallel Execution (Thực thi song song)';
    p2Block.querySelector('.sim-phase-rule').textContent = 'Bắt buộc ≥ 3 chuyên gia song song';
    p3Block.querySelector('.sim-phase-name').textContent = 'Phase 3: Synthesis & Verification (Tổng hợp & Thẩm định)';
    p3Block.querySelector('.sim-phase-rule').textContent = 'orchestrator + security_scan + lint_runner';
  }

  logTerminal(`Đã chuyển sang chế độ điều phối /${mode}`, 'info');
}

function loadSimulatorPreset(key) {
  const preset = state.data.presets[key];
  if (!preset) return;

  const title = document.getElementById('sim-task-name');
  const descInput = document.getElementById('custom-task-desc');

  if (title) title.textContent = preset.name;
  if (descInput) descInput.value = preset.desc;

  renderSimulatorDiagram(preset);
  resetSimulator();
}

function renderSimulatorDiagram(preset) {
  const p1Container = document.getElementById('p1-agents');
  const p2Container = document.getElementById('p2-agents');
  const p3Container = document.getElementById('p3-agents');

  if (!p1Container || !p2Container || !p3Container) return;

  p1Container.innerHTML = `
    <div class="sim-agent-card" id="agent-planner">
      <div class="sim-agent-top">
        <span class="sim-agent-name">project-planner</span>
        <div class="sim-status-dot"></div>
      </div>
      <div class="sim-agent-action">Khảo sát yêu cầu, khởi tạo {task-slug}.md và Socratic Gate</div>
      <div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>
    </div>
  `;

  p2Container.innerHTML = preset.agents.map((agName, idx) => {
    const actionDesc = (preset.subtasks && preset.subtasks[agName]) || `Thực thi chuyên môn cho ${agName}`;
    return `
      <div class="sim-agent-card" id="agent-worker-${idx}">
        <div class="sim-agent-top">
          <span class="sim-agent-name">${agName}</span>
          <div class="sim-status-dot"></div>
        </div>
        <div class="sim-agent-action">${actionDesc}</div>
        <div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>
      </div>
    `;
  }).join('');

  p3Container.innerHTML = `
    <div class="sim-agent-card" id="agent-orchestrator">
      <div class="sim-agent-top">
        <span class="sim-agent-name">orchestrator</span>
        <div class="sim-status-dot"></div>
      </div>
      <div class="sim-agent-action">Tổng hợp báo cáo Orchestration Report, chạy security_scan.py & lint_runner.py</div>
      <div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>
    </div>
  `;
}

function toggleSimulatorRun() {
  if (state.simulator.isRunning) {
    pauseSimulator();
  } else {
    startSimulator();
  }
}

function startSimulator() {
  state.simulator.isRunning = true;
  state.simulator.step = 0;
  const startBtn = document.getElementById('btn-start-sim');
  if (startBtn) {
    startBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      Tạm dừng mô phỏng
    `;
  }

  logTerminal(`[START] Bắt đầu quy trình /${state.simulator.mode} cho: ${document.getElementById('sim-task-name').textContent}`, 'info');
  advanceSimulationStep();
}

function pauseSimulator() {
  state.simulator.isRunning = false;
  clearTimeout(state.simulator.timer);
  const startBtn = document.getElementById('btn-start-sim');
  if (startBtn) {
    startBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Tiếp tục mô phỏng
    `;
  }
  logTerminal('[PAUSE] Tiến trình mô phỏng tạm dừng.', 'warning');
}

function resetSimulator() {
  state.simulator.isRunning = false;
  state.simulator.step = 0;
  clearTimeout(state.simulator.timer);

  const startBtn = document.getElementById('btn-start-sim');
  if (startBtn) {
    startBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Bắt đầu mô phỏng
    `;
  }

  ['sim-p1', 'sim-p2', 'sim-p3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active', 'completed');
      el.querySelectorAll('.sim-progress-fill').forEach(p => p.style.width = '0%');
      el.querySelectorAll('.sim-status-dot').forEach(d => {
        d.classList.remove('active', 'done');
      });
      el.querySelectorAll('.sim-agent-card').forEach(c => {
        c.classList.remove('running', 'completed');
      });
    }
  });

  const stepInd = document.getElementById('sim-step-indicator');
  if (stepInd) stepInd.textContent = 'Trạng thái: Chờ khởi chạy';

  const term = document.getElementById('sim-terminal');
  if (term) {
    term.innerHTML = '<div class="term-line info">[RESET] Tiến trình đã được đưa về trạng thái khởi tạo.</div>';
  }
}

function advanceSimulationStep() {
  if (!state.simulator.isRunning) return;

  const step = state.simulator.step;
  const speed = state.simulator.speed;
  const stepInd = document.getElementById('sim-step-indicator');

  if (step === 0) {
    if (stepInd) stepInd.textContent = 'Đang chạy: Phase 1 — Planning (Tuần tự)';
    const p1 = document.getElementById('sim-p1');
    p1.classList.add('active');
    const plannerCard = document.getElementById('agent-planner');
    if (plannerCard) {
      plannerCard.classList.add('running');
      plannerCard.querySelector('.sim-status-dot').classList.add('active');
      plannerCard.querySelector('.sim-progress-fill').style.width = '70%';
    }

    logTerminal('[PHASE 1] project-planner đang phân tích kiến trúc và tạo {task-slug}.md...', 'info');

    state.simulator.timer = setTimeout(() => {
      if (plannerCard) {
        plannerCard.classList.remove('running');
        plannerCard.classList.add('completed');
        plannerCard.querySelector('.sim-status-dot').classList.remove('active');
        plannerCard.querySelector('.sim-status-dot').classList.add('done');
        plannerCard.querySelector('.sim-progress-fill').style.width = '100%';
      }
      p1.classList.remove('active');
      p1.classList.add('completed');

      logTerminal('[CHECKPOINT] Kế hoạch hoàn tất. Đợi người dùng kiểm tra và phê duyệt.', 'warning');
      state.simulator.step = 1;

      if (speed <= 400) {
        advanceSimulationStep();
      } else {
        state.simulator.timer = setTimeout(() => {
          advanceSimulationStep();
        }, 1500);
      }
    }, speed * 1.5);

  } else if (step === 1) {
    if (stepInd) stepInd.textContent = 'Đang chạy: Phase 2 — Parallel Execution (Song song)';
    const p2 = document.getElementById('sim-p2');
    p2.classList.add('active');

    const workerCards = p2.querySelectorAll('.sim-agent-card');
    workerCards.forEach(c => {
      c.classList.add('running');
      c.querySelector('.sim-status-dot').classList.add('active');
      c.querySelector('.sim-progress-fill').style.width = '40%';
    });

    logTerminal(`[PHASE 2] Khởi chạy song song ${workerCards.length} specialist agents...`, 'info');

    state.simulator.timer = setTimeout(() => {
      workerCards.forEach(c => {
        c.querySelector('.sim-progress-fill').style.width = '80%';
      });
      logTerminal('[PARALLEL] Các tác tử đang xử lý đồng thời mà không nghẽn tài nguyên...', 'info');

      state.simulator.timer = setTimeout(() => {
        workerCards.forEach(c => {
          c.classList.remove('running');
          c.classList.add('completed');
          c.querySelector('.sim-status-dot').classList.remove('active');
          c.querySelector('.sim-status-dot').classList.add('done');
          c.querySelector('.sim-progress-fill').style.width = '100%';
        });
        p2.classList.remove('active');
        p2.classList.add('completed');

        logTerminal('[PHASE 2 DONE] Toàn bộ tác tử song song đã hoàn thành subtasks.', 'success');
        state.simulator.step = 2;
        advanceSimulationStep();
      }, speed * 1.2);
    }, speed * 1.2);

  } else if (step === 2) {
    if (stepInd) stepInd.textContent = 'Đang chạy: Phase 3 — Synthesis & Verification (Thẩm định)';
    const p3 = document.getElementById('sim-p3');
    p3.classList.add('active');

    const orchCard = document.getElementById('agent-orchestrator');
    if (orchCard) {
      orchCard.classList.add('running');
      orchCard.querySelector('.sim-status-dot').classList.add('active');
      orchCard.querySelector('.sim-progress-fill').style.width = '60%';
    }

    logTerminal('[PHASE 3] orchestrator đang tổng hợp báo cáo và chạy kiểm tra tự động...', 'info');

    state.simulator.timer = setTimeout(() => {
      logTerminal('[VERIFY] Chạy security_scan.py: 0 vulnerabilities found.', 'success');
      logTerminal('[VERIFY] Chạy lint_runner.py: All syntax rules validated.', 'success');

      if (orchCard) {
        orchCard.classList.remove('running');
        orchCard.classList.add('completed');
        orchCard.querySelector('.sim-status-dot').classList.remove('active');
        orchCard.querySelector('.sim-status-dot').classList.add('done');
        orchCard.querySelector('.sim-progress-fill').style.width = '100%';
      }
      p3.classList.remove('active');
      p3.classList.add('completed');

      if (stepInd) stepInd.textContent = 'Hoàn tất: Quy trình điều phối thành công 100%';
      logTerminal('[SUCCESS] Điều phối hoàn tất xuất sắc! Báo cáo hợp nhất sẵn sàng.', 'success');
      showToast('Mô phỏng hoàn tất thành công!');

      const startBtn = document.getElementById('btn-start-sim');
      if (startBtn) {
        startBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Chạy lại mô phỏng
        `;
      }
      state.simulator.isRunning = false;
    }, speed * 1.5);
  }
}

function logTerminal(msg, type = 'info') {
  const term = document.getElementById('sim-terminal');
  if (!term) return;

  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = `term-line ${type}`;
  div.textContent = `[${time}] ${msg}`;
  term.appendChild(div);
  term.scrollTop = term.scrollHeight;
}

// =========================================================
// TAB 4: SLASH COMMAND GENERATOR & SETUP TAB LOGIC
// =========================================================
function initSetupTab() {
  setupGeneratorForm();
}

function setupGeneratorForm() {
  const tabs = document.querySelectorAll('.cmd-tab-btn');
  const taskInput = document.getElementById('gen-task');
  const stackInput = document.getElementById('gen-stack');
  const modeSelect = document.getElementById('gen-mode');
  const copyBtn = document.getElementById('btn-copy-command');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.generator.cmd = btn.dataset.cmd;
      updateGeneratorPreview();
    });
  });

  if (taskInput) {
    taskInput.addEventListener('input', (e) => {
      state.generator.task = e.target.value;
      updateGeneratorPreview();
    });
  }

  if (stackInput) {
    stackInput.addEventListener('input', (e) => {
      state.generator.stack = e.target.value;
      updateGeneratorPreview();
    });
  }

  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      state.generator.mode = e.target.value;
      updateGeneratorPreview();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const preview = document.getElementById('cmd-preview-text');
      if (preview) {
        copyToClipboard(preview.textContent);
        showToast('Đã sao chép lệnh Slash Command vào bộ nhớ tạm!');
      }
    });
  }

  updateGeneratorPreview();
}

function updateGeneratorPreview() {
  const preview = document.getElementById('cmd-preview-text');
  const stackGroup = document.getElementById('form-group-stack');
  if (!preview) return;

  const { cmd, task, stack, mode } = state.generator;
  let text = '';

  if (cmd === '/create') {
    if (stackGroup) stackGroup.style.display = 'block';
    text = `/create ${task} --stack="${stack}" --mode=${mode}`;
  } else if (cmd === '/orchestrate') {
    if (stackGroup) stackGroup.style.display = 'block';
    text = `/orchestrate ${task} (Yêu cầu phối hợp đa chuyên gia)`;
  } else if (cmd === '/debug') {
    if (stackGroup) stackGroup.style.display = 'none';
    text = `/debug ${task} --systematic`;
  } else if (cmd === '/plan') {
    if (stackGroup) stackGroup.style.display = 'none';
    text = `/plan ${task} --no-code-before-approval`;
  }

  preview.textContent = text;
}

// =========================================================
// UTILITY FUNCTIONS
// =========================================================
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    console.error('Copy failed:', e);
  }
  document.body.removeChild(ta);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, 3000);
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      switchTab('catalog');
      const searchInput = document.getElementById('catalog-search');
      if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('detail-modal');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
      }
    }
  });
}
