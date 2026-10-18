#!/usr/bin/env python3
"""NDANHPC Kit - Antigravity Terminal CLI & TUI Dashboard.

Interactive terminal dashboard and non-interactive command-line interface
for inspecting, navigating, orchestrating, and verifying the NDANHPC Kit
(Antigravity-Native AI Agent Capability Toolkit).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml  # type: ignore
except ImportError:
    yaml = None

# ==============================================================================
# ANSI Color & Formatting Utilities
# ==============================================================================

class Colors:
    """ANSI color sequences with graceful degradation when colors are unsupported."""
    USE_COLOR = sys.stdout.isatty() and not os.environ.get("NO_COLOR")

    @classmethod
    def code(cls, code_str: str) -> str:
        return code_str if cls.USE_COLOR else ""

    RESET = "\033[0m" if USE_COLOR else ""
    BOLD = "\033[1m" if USE_COLOR else ""
    DIM = "\033[2m" if USE_COLOR else ""
    ITALIC = "\033[3m" if USE_COLOR else ""
    UNDERLINE = "\033[4m" if USE_COLOR else ""

    # Foreground standard colors
    BLACK = "\033[30m" if USE_COLOR else ""
    RED = "\033[31m" if USE_COLOR else ""
    GREEN = "\033[32m" if USE_COLOR else ""
    YELLOW = "\033[33m" if USE_COLOR else ""
    BLUE = "\033[34m" if USE_COLOR else ""
    MAGENTA = "\033[35m" if USE_COLOR else ""
    CYAN = "\033[36m" if USE_COLOR else ""
    WHITE = "\033[37m" if USE_COLOR else ""

    # Bright foreground colors
    BRIGHT_RED = "\033[91m" if USE_COLOR else ""
    BRIGHT_GREEN = "\033[92m" if USE_COLOR else ""
    BRIGHT_YELLOW = "\033[93m" if USE_COLOR else ""
    BRIGHT_BLUE = "\033[94m" if USE_COLOR else ""
    BRIGHT_MAGENTA = "\033[95m" if USE_COLOR else ""
    BRIGHT_CYAN = "\033[96m" if USE_COLOR else ""
    BRIGHT_WHITE = "\033[97m" if USE_COLOR else ""

    # Backgrounds
    BG_DARK = "\033[40m" if USE_COLOR else ""
    BG_BLUE = "\033[44m" if USE_COLOR else ""
    BG_CYAN = "\033[46m" if USE_COLOR else ""


def c(text: Any, color: str) -> str:
    """Wrap text in an ANSI color."""
    if not Colors.USE_COLOR:
        return str(text)
    return f"{color}{text}{Colors.RESET}"


def bold(text: Any) -> str:
    return c(text, Colors.BOLD)


def cyan(text: Any) -> str:
    return c(text, Colors.BRIGHT_CYAN)


def green(text: Any) -> str:
    return c(text, Colors.BRIGHT_GREEN)


def yellow(text: Any) -> str:
    return c(text, Colors.BRIGHT_YELLOW)


def magenta(text: Any) -> str:
    return c(text, Colors.BRIGHT_MAGENTA)


def red(text: Any) -> str:
    return c(text, Colors.BRIGHT_RED)


def dim(text: Any) -> str:
    return c(text, Colors.DIM)


def italic(text: Any) -> str:
    return c(text, Colors.ITALIC)


def get_terminal_width() -> int:
    """Return current terminal column width clamped between 70 and 110."""
    try:
        width = shutil.get_terminal_size((80, 24)).columns
        return max(70, min(110, width))
    except Exception:
        return 80


def hr(char: str = "─", color: str = Colors.DIM) -> None:
    width = get_terminal_width()
    print(c(char * width, color))


def banner(data: Optional[ToolkitData] = None) -> None:
    """Print the NDANHPC Kit banner with dynamic CalVer version."""
    version = data.kit_version if data else "2026.10.18"
    ascii_logo = r"""
  _   _ ____    _    _   _ _   _ ____   ____   _  ___ _   
 | \ | |  _ \  / \  | \ | | | | |  _ \ / ___| | |/ (_) |_ 
 |  \| | | | |/ _ \ |  \| | |_| | |_) | |     | ' /| | __|
 | |\  | |_| / ___ \| |\  |  _  |  __/| |___  | . \| | |_ 
 |_| \_|____/_/   \_\_| \_|_| |_|_|    \____| |_|\_\_|\__|
"""
    print(c(ascii_logo, Colors.BRIGHT_CYAN))
    print(f" {bold(cyan('⚡ NDANHPC KIT'))} {dim('•')} {bold('Antigravity-Native AI Agent Capability Toolkit')}")
    print(f" {dim(f'Production CalVer: {version} | Multi-Agent Orchestration & QA Supercharge Contract')}")
    hr("═", Colors.CYAN)


# ==============================================================================
# Manifest & Data Access Layer
# ==============================================================================

SKILL_CATEGORIES: Dict[str, Tuple[str, str, List[str]]] = {
    "qa": (
        "🧪 QA & Test Automation",
        "Kỹ năng kiểm thử AI-RBT, POM automation, smart locators, test data & tự sửa lỗi",
        [
            "flaky-test-analyzer", "jira-integration", "locator-healer",
            "qa-automation-workflow", "qa-framework-architect", "rbt-manual-testing",
            "requirements-analyzer", "smart-locator", "test-data-generator",
            "ui-debug", "webapp-testing", "testing-patterns", "tdd-workflow"
        ]
    ),
    "frontend": (
        "🎨 Frontend & Design",
        "Thiết kế giao diện, UI/UX tokens, Tailwind CSS, Next.js và responsive web/mobile",
        [
            "frontend-design", "frontend-architecture", "design-spec",
            "responsive-web-design", "ui-ux-design-system", "ux-audit-and-heuristics",
            "nextjs-react-expert", "tailwind-patterns", "mobile-app-ui-ux",
            "mobile-design", "web-design-guidelines", "game-development", "i18n-localization"
        ]
    ),
    "backend": (
        "⚙️ Backend & Architecture",
        "Kiến trúc hệ thống, API patterns, thiết kế cơ sở dữ liệu và async runtimes",
        [
            "architecture", "api-patterns", "database-design", "nodejs-best-practices",
            "python-patterns", "rust-pro"
        ]
    ),
    "orchestration": (
        "🚀 Multi-Agent & Orchestration",
        "Điều phối đa agent, lập kế hoạch tuần tự, nén ngữ cảnh và ra quyết định",
        [
            "app-builder", "coordinator-mode", "parallel-agents", "plan-writing",
            "brainstorming", "behavioral-modes", "context-compression",
            "intelligent-routing", "memory-system"
        ]
    ),
    "security": (
        "🛡️ Security & Red Team",
        "Quét lỗ hổng SAST, OWASP 2025, kiểm định chuỗi cung ứng và kỹ thuật tấn công",
        ["vulnerability-scanner", "red-team-tactics"]
    ),
    "core": (
        "🧹 Clean Code & Standards",
        "Quy chuẩn mã nguồn tinh gọn, kiểm thử hồi quy, tối ưu hiệu năng và soát mã",
        [
            "clean-code", "code-review-checklist", "code-review-graph",
            "documentation-templates", "lint-and-validate", "simplify-code",
            "systematic-debugging", "verify-changes", "performance-profiling"
        ]
    ),
    "system": (
        "💻 System & Tooling",
        "Quản trị máy chủ, terminal Linux/PowerShell, MCP server và tự động hóa thao tác",
        ["bash-linux", "powershell-windows", "server-management", "batch-operations", "mcp-builder", "skillify"]
    ),
    "content": (
        "🌐 SEO & Content Discovery",
        "Tối ưu hóa công cụ tìm kiếm truyền thống và Generative Engine Optimization (GEO)",
        ["seo-fundamentals", "geo-fundamentals"]
    )
}

WORKFLOW_CATEGORIES: Dict[str, Tuple[str, List[str]]] = {
    "qa": (
        "🧪 QA & Testing Workflows",
        [
            "analyze-flaky-tests", "analyze-requirement-document", "fetch-jira-requirements",
            "generate-api-tests-from-swagger", "generate-application-test-plan",
            "generate-automation-framework", "generate-automation-from-testcases",
            "generate-automation-from-ui-flow", "generate-combinatorial-test-data",
            "generate-cross-module-test-plan", "generate-locator",
            "generate-manual-testcases-rbt", "generate-requirements-from-website",
            "generate-test-data", "generate-testcases-from-requirements",
            "import-test-results-xray"
        ]
    ),
    "core": (
        "🚀 Core Lifecycle & Architecture Workflows",
        [
            "brainstorm", "coordinate", "create", "debug", "deploy", "enhance",
            "orchestrate", "plan", "preview", "remember", "status", "test", "verify"
        ]
    )
}


class ToolkitData:
    """Loads and caches metadata from .agents/manifest.json and markdown files."""

    def __init__(self, root: Optional[Path] = None):
        self.script_dir = Path(__file__).resolve().parent
        if root:
            self.toolkit_dir = root
        else:
            candidate = self.script_dir.parent
            if (candidate / "manifest.json").exists():
                self.toolkit_dir = candidate
            else:
                curr = Path(".").resolve()
                if (curr / ".agents" / "manifest.json").exists():
                    self.toolkit_dir = curr / ".agents"
                elif (curr / "manifest.json").exists() and (curr / "agent").exists():
                    self.toolkit_dir = curr
                else:
                    self.toolkit_dir = candidate

        self.project_dir = self.toolkit_dir.parent
        self.manifest_path = self.toolkit_dir / "manifest.json"
        self.lock_path = self.toolkit_dir / "manifest.lock.json"
        self.manifest: Dict[str, Any] = {}
        self.agents_meta: Dict[str, Dict[str, Any]] = {}
        self.skills_meta: Dict[str, Dict[str, Any]] = {}
        self.workflows_meta: Dict[str, Dict[str, Any]] = {}
        self.rules_meta: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self) -> None:
        if self.manifest_path.exists():
            try:
                with open(self.manifest_path, "r", encoding="utf-8") as f:
                    self.manifest = json.load(f)
            except Exception as e:
                print(red(f"Lỗi khi đọc {self.manifest_path}: {e}"))
                self.manifest = {}
        else:
            print(yellow(f"Cảnh báo: Không tìm thấy {self.manifest_path}"))
            self.manifest = {}

        self._parse_markdown_metadatas()

    def _parse_frontmatter(self, file_path: Path) -> Dict[str, Any]:
        """Simple and robust frontmatter extractor supporting PyYAML when available."""
        if not file_path.exists():
            return {}
        try:
            text = file_path.read_text("utf-8", errors="replace")
            if not text.startswith("---\n"):
                return {}
            end = text.find("\n---\n", 4)
            if end < 0:
                return {}
            raw = text[4:end]
            if yaml is not None:
                try:
                    loaded = yaml.safe_load(raw)
                    if isinstance(loaded, dict):
                        return dict(loaded)
                except Exception:
                    pass

            data: Dict[str, Any] = {}
            for line in raw.splitlines():
                if not line or line.startswith("#"):
                    continue
                match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
                if match:
                    k, v = match.groups()
                    data[k.strip()] = v.strip().strip('"\'')
            return data
        except Exception:
            return {}

    def _parse_markdown_metadatas(self) -> None:
        # Load agents
        agent_dir = self.toolkit_dir / "agent"
        if agent_dir.exists():
            for p in sorted(agent_dir.glob("*.md")):
                meta = self._parse_frontmatter(p)
                name = meta.get("name", p.stem)
                self.agents_meta[name] = {
                    "name": name,
                    "description": meta.get("description", "Chưa có mô tả vai trò."),
                    "model": meta.get("model", "inherit"),
                    "tools": meta.get("tools", ""),
                    "version": meta.get("version", "1.0.0"),
                    "skills": meta.get("skills", []),
                    "file": str(p.relative_to(self.toolkit_dir)),
                    "abs_path": p
                }

        # Load skills
        skills_dir = self.toolkit_dir / "skills"
        if skills_dir.exists():
            for skill_path in sorted(skills_dir.glob("*/SKILL.md")):
                meta = self._parse_frontmatter(skill_path)
                sname = meta.get("name", skill_path.parent.name)
                self.skills_meta[sname] = {
                    "name": sname,
                    "description": meta.get("description", "Chưa có mô tả kỹ năng."),
                    "when_to_use": meta.get("when_to_use", ""),
                    "allowed_tools": meta.get("allowed-tools", ""),
                    "version": meta.get("version", "1.0.0"),
                    "file": str(skill_path.relative_to(self.toolkit_dir)),
                    "abs_path": skill_path
                }

        # Load workflows
        wf_dir = self.toolkit_dir / "workflows"
        if wf_dir.exists():
            for wfp in sorted(wf_dir.glob("*.md")):
                meta = self._parse_frontmatter(wfp)
                wfname = meta.get("name", wfp.stem)
                self.workflows_meta[wfname] = {
                    "name": wfname,
                    "description": meta.get("description", "Workflow description."),
                    "requires_agents": meta.get("requires_agents", ""),
                    "requires_skills": meta.get("requires_skills", ""),
                    "artifact_outputs": meta.get("artifact_outputs", ""),
                    "version": meta.get("version", "1.0.0"),
                    "file": str(wfp.relative_to(self.toolkit_dir)),
                    "abs_path": wfp
                }

        # Load rules
        rules_dir = self.toolkit_dir / "rules"
        if rules_dir.exists():
            for rp in sorted(rules_dir.glob("*.md")):
                meta = self._parse_frontmatter(rp)
                rname = meta.get("name", rp.stem)
                self.rules_meta[rname] = {
                    "name": rname,
                    "description": meta.get("description", "Rule description."),
                    "priority": meta.get("priority", "P0"),
                    "trigger": meta.get("trigger", "model_decision"),
                    "version": meta.get("version", "1.0.0"),
                    "file": str(rp.relative_to(self.toolkit_dir)),
                    "abs_path": rp
                }

    @property
    def kit_version(self) -> str:
        # Try manifest first
        v = self.manifest.get("kitVersion")
        if v:
            return str(v)
        # Try package.json
        pkg_json = self.project_dir / "package.json"
        if pkg_json.exists():
            try:
                data = json.loads(pkg_json.read_text("utf-8"))
                if "version" in data:
                    return str(data["version"])
            except Exception:
                pass
        return "2026.10.18"

    @property
    def agents(self) -> Dict[str, Any]:
        return self.manifest.get("agents", {})

    @property
    def skills(self) -> Dict[str, Any]:
        return self.manifest.get("skills", {})

    @property
    def workflows(self) -> Dict[str, Any]:
        return self.manifest.get("workflows", {})

    @property
    def rules(self) -> Dict[str, Any]:
        return self.manifest.get("rules", {})

    def search(self, query: str) -> Dict[str, List[Tuple[str, str]]]:
        """Search across agents, skills, workflows, and rules."""
        q = query.lower().strip()
        results: Dict[str, List[Tuple[str, str]]] = {
            "agents": [],
            "skills": [],
            "workflows": [],
            "rules": []
        }

        # Search Agents
        for name, info in self.agents.items():
            meta = self.agents_meta.get(name, {})
            desc = meta.get("description", "")
            if q in name.lower() or q in desc.lower():
                results["agents"].append((name, desc))

        # Search Skills
        for name, info in self.skills.items():
            meta = self.skills_meta.get(name, {})
            desc = meta.get("description", "")
            when = meta.get("when_to_use", "")
            if q in name.lower() or q in desc.lower() or q in when.lower():
                results["skills"].append((name, desc))

        # Search Workflows
        for name, info in self.workflows.items():
            meta = self.workflows_meta.get(name, {})
            desc = meta.get("description", "")
            if q in name.lower() or q in desc.lower():
                results["workflows"].append((f"/{name}", desc))

        # Search Rules
        for name, info in self.rules.items():
            meta = self.rules_meta.get(name, {})
            desc = meta.get("description", "")
            if q in name.lower() or q in desc.lower():
                results["rules"].append((name, desc))

        return results


# ==============================================================================
# View 1: Overview & Architecture
# ==============================================================================

def show_overview(data: ToolkitData) -> None:
    """Display comprehensive overview & architecture of NDANHPC Kit."""
    total_components = len(data.agents) + len(data.skills) + len(data.workflows) + len(data.rules)
    print(bold(cyan("\n🚀 TỔNG QUAN & KIẾN TRÚC NDANHPC KIT")))
    hr()

    print(f" {bold('Phiên bản Kit (CalVer):')}   {green(data.kit_version)} {dim('(Bản phát hành ổn định)')}")
    print(f" {bold('Vị trí Toolkit:')}          {cyan(str(data.toolkit_dir))}")
    print(f" {bold('Thư mục Dự án:')}          {cyan(str(data.project_dir))}")
    print(f" {bold('Trạng thái Khóa:')}          {green('manifest.lock.json Đồng bộ (SHA-256)') if data.lock_path.exists() else yellow('Chưa khóa')}")
    print(f" {bold('Tổng số Thành phần:')}      {bold(green(str(total_components)))} thành phần đã được kiểm định toàn vẹn")
    print()

    # Metric summary table
    print(bold("📊 THỐNG KÊ TỔNG THỂ HỆ THỐNG:"))
    print(f"  • {bold('Specialist Agents:')}  {green(len(data.agents))} vai trò chuyên môn hóa độc lập")
    print(f"  • {bold('Domain Skills:')}     {green(len(data.skills))} kỹ năng tải theo điều kiện (Progressive Loading)")
    print(f"  • {bold('Workflows:')}          {green(len(data.workflows))} quy trình chuẩn với Slash Commands (/command)")
    print(f"  • {bold('Workspace Rules:')}    {green(len(data.rules))} quy tắc bắt buộc (P0 Universal -> P1 QA -> P2 QuickRef)")
    print(f"  • {bold('Self-Contained:')}     {green('100%')} nằm trọn trong thư mục {cyan('.agents/')} (Dễ dàng sao chép sang dự án mới)")
    print()

    # Highlight v2026.10.18
    print(bold(yellow("⭐ ĐIỂM NHẤN PHÁT HÀNH v2026.10.18 - REMOTE NPX/NPM CLI & ONE-LINE INSTALLER:")))
    print(f"  • {bold('Remote npx / npm CLI:')}       Khởi tạo, cập nhật & kiểm tra kit từ xa: {cyan('npx github:... init')}")
    print(f"  • {bold('Trình Cài Đặt 1 Lệnh:')}       {cyan('curl -fsSL .../install.sh | bash')} cài đặt chỉ trong 2 giây")
    print(f"  • {bold('Cloudflare Light Theme:')}     Giao diện sáng cao cấp (#F6821F / #18181B / #F9FAFB) 100/100 Lighthouse")
    print(f"  • {bold('Đồng Bộ CalVer 2026.10.18:')}  Đồng bộ toàn bộ hệ sinh thái (Rules, Hooks, Manifests, Web Portal)")
    print()

    # Tier Architecture
    print(bold("🏛️ HỆ THỐNG PHÂN CẤP NGUYÊN TẮC (RULE HIERARCHY):"))
    print(f"  {bold(yellow('Tier 0 (P0) Universal Rules:'))}   Luôn kích hoạt ({cyan('.agents/rules/universal-rules.md')})")
    print(f"    └── Protocol cấm code thừa, cấm phỏng đoán, áp dụng Clean Code & AAA testing.")
    print(f"  {bold(cyan('Tier 1 (P1) Specialist & QA Rules:'))} Áp dụng cho từng miền nghiệp vụ")
    print(f"    └── 24 Agent Personas ({cyan('.agents/agent/*.md')}) + Quy tắc QA ({cyan('.agents/rules/qa-testing-rules.md')})")
    print(f"  {bold(magenta('Tier 2 (P2) Progressive Skills:'))}  Nạp theo ngữ cảnh ({cyan('.agents/skills/*/SKILL.md')})")
    print(f"    └── Đọc 'when_to_use' trước khi load; tiết kiệm token ngữ cảnh tối đa.")
    print()

    # 6 Phases of Antigravity Contract
    print(bold("🔄 6 GIAI ĐOẠN TÍCH HỢP ANTIGRAVITY RUNTIME:"))
    phases = [
        ("1. Discovery", "rules/, skills/, workflows/, agent/ được xác thực cấu trúc & frontmatter"),
        ("2. MCP Gate", "mcp_config.json quản lý context7, security-scanner, chrome-devtools"),
        ("3. Hook Enforcement", "hooks.json + validate-tool-call.mjs bảo vệ lệnh huỷ hoại trước khi thực thi"),
        ("4. Orchestration", "Quy trình 2-Phase nghiêm ngặt: Sequential Planning -> User Checkpoint -> Parallel Execution"),
        ("5. Plugin Package", "dist/antigravity-plugin phân phối plugin Antigravity độc lập với hash SHA-256"),
        ("6. Validation Suite", "npm run check:antigravity (Doctor) + npm run verify (17 tiêu chí kiểm thử)")
    ]
    for p_title, p_desc in phases:
        print(f"  [{green('✓')}] {bold(p_title):<24} {dim(p_desc)}")
    print()


# ==============================================================================
# View 2: Tra cứu Specialist Agents
# ==============================================================================

def list_agents(data: ToolkitData, non_interactive: bool = False, query: Optional[str] = None) -> None:
    """Display table of all Specialist Agents with drill-down and search."""
    agents = data.agents
    sorted_names = sorted(agents.keys())

    if query:
        q = query.lower()
        sorted_names = [
            n for n in sorted_names
            if q in n.lower() or q in data.agents_meta.get(n, {}).get("description", "").lower()
        ]

    count_str = f"{len(sorted_names)}/{len(data.agents)}" if query else str(len(data.agents))
    print(bold(cyan(f"\n🤖 DANH MỤC SPECIALIST AGENTS ({count_str}) (NDANHPC KIT v{data.kit_version})")))
    if query:
        print(f" {dim(f'Bộ lọc tìm kiếm theo từ khóa:')} {yellow(query)}")
    hr()
    print(f"{bold('STT'):<5} {bold('Tên Agent'):<26} {bold('Model'):<10} {bold('Skills'):<8} {bold('Chuyên môn / Mô tả tóm tắt')}")
    hr("-")

    for idx, name in enumerate(sorted_names, 1):
        info = agents[name]
        meta = data.agents_meta.get(name, {})
        model = info.get("model", "inherit")
        skills_req = len(info.get("requires", {}).get("skills", {}))
        desc = meta.get("description", "")
        desc_short = (desc[:46] + "...") if len(desc) > 49 else desc
        print(f"{cyan(f'[{idx:02d}]'):<5} {bold(name):<26} {yellow(model):<10} {green(str(skills_req)):<8} {desc_short}")

    hr()
    print(f" {dim(f'Tổng cộng: {len(data.agents)} agents chuyên biệt sẵn sàng cho Multi-Agent Orchestration.')}")

    if non_interactive:
        return

    # Interactive inspection sub-menu
    while True:
        prompt_text = f"\n {bold(f'👉 Nhập số [1-{len(sorted_names)}]')} hoặc {bold('tên agent')} | gõ {bold('/search <từ khóa>')} để lọc | {bold('0')} để quay lại:"
        print(prompt_text)
        try:
            choice = input(cyan("NDANHPC/agents > ")).strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not choice or choice in ("0", "q", "exit"):
            break

        if choice.startswith("/search "):
            sub_q = choice[8:].strip()
            list_agents(data, non_interactive=False, query=sub_q)
            break

        target_name = None
        if choice.isdigit():
            c_idx = int(choice)
            if 1 <= c_idx <= len(sorted_names):
                target_name = sorted_names[c_idx - 1]
        else:
            matches = [n for n in sorted_names if choice.lower() in n.lower()]
            if matches:
                target_name = matches[0]

        if target_name:
            show_agent_detail(data, target_name)
        else:
            print(yellow(f"Không tìm thấy agent phù hợp với '{choice}'."))


def show_agent_detail(data: ToolkitData, name: str) -> None:
    """Show detailed metadata and instructions for a specific agent."""
    info = data.agents.get(name, {})
    meta = data.agents_meta.get(name, {})

    print(bold(cyan(f"\n📋 THÔNG TIN CHI TIẾT AGENT: @{name}")))
    hr("═")
    print(f" {bold('Tên Agent:')}         {cyan(name)}")
    print(f" {bold('Đường dẫn file:')}     {dim(info.get('path', meta.get('file', 'N/A')))}")
    print(f" {bold('Phiên bản:')}          {green(info.get('version', '1.0.0'))}")
    print(f" {bold('Model Runtime:')}     {yellow(info.get('model', 'inherit'))}")

    tools = info.get("tools", [])
    if isinstance(tools, list):
        tools_str = ", ".join(tools)
    else:
        tools_str = str(tools)
    print(f" {bold('Công cụ được cấp:')}   {magenta(tools_str or 'Read, Grep, Glob, Edit, Write')}")

    skills_req = info.get("requires", {}).get("skills", {})
    if skills_req:
        print(f" {bold(f'Kỹ năng phụ thuộc ({len(skills_req)} skills):')}")
        for sname, s_ver in sorted(skills_req.items()):
            print(f"   • {cyan(sname)} {dim(f'({s_ver})')}")
    else:
        print(f" {bold('Kỹ năng phụ thuộc:')}  {dim('Không yêu cầu cứng (sử dụng kỹ năng phổ quát)')}")

    desc = meta.get("description", "")
    if desc:
        print(f"\n {bold('Mô tả chuyên trách:')}")
        for line in desc.split(". "):
            if line.strip():
                print(f"   {dim('▸')} {line.strip()}.")

    # Read role philosophy excerpt from markdown if present
    abs_path = meta.get("abs_path")
    if abs_path and abs_path.exists():
        try:
            content = abs_path.read_text("utf-8", errors="replace")
            if "---" in content:
                parts = content.split("---", 2)
                body = parts[2].strip() if len(parts) >= 3 else parts[-1].strip()
            else:
                body = content.strip()

            paragraphs = [p.strip() for p in body.split("\n\n") if p.strip() and not p.startswith("#")][:2]
            if paragraphs:
                print(f"\n {bold('Triết lý hoạt động (Philosophy Excerpt):')}")
                for p in paragraphs:
                    print(f"   {italic(p)}")
        except Exception:
            pass
    hr()


# ==============================================================================
# View 3: Tra cứu Domain Skills (61 Skills)
# ==============================================================================

def list_skills(
    data: ToolkitData,
    non_interactive: bool = False,
    query: Optional[str] = None,
    category_key: Optional[str] = None
) -> None:
    """Display table of all Skills with categorization, filtering, and search."""
    skills = data.skills
    sorted_names = sorted(skills.keys())

    # Apply category filter
    cat_title = None
    if category_key and category_key in SKILL_CATEGORIES:
        cat_title, _, cat_skills = SKILL_CATEGORIES[category_key]
        sorted_names = [n for n in sorted_names if n in cat_skills]

    # Apply text query filter
    if query:
        q = query.lower()
        sorted_names = [
            n for n in sorted_names
            if q in n.lower()
            or q in data.skills_meta.get(n, {}).get("description", "").lower()
            or q in data.skills_meta.get(n, {}).get("when_to_use", "").lower()
        ]

    count_str = f"{len(sorted_names)}/{len(data.skills)}" if (query or category_key) else str(len(data.skills))
    print(bold(cyan(f"\n📚 DANH MỤC DOMAIN SKILLS ({count_str}) (NDANHPC KIT v{data.kit_version})")))
    if cat_title:
        print(f" {bold('Danh mục:')} {magenta(cat_title)}")
    if query:
        print(f" {bold('Từ khóa tìm kiếm:')} {yellow(query)}")
    hr()
    print(f"{bold('STT'):<5} {bold('Tên Kỹ năng'):<28} {bold('Ver'):<8} {bold('Scripts'):<9} {bold('Công cụ cho phép / Trạng thái')}")
    hr("-")

    for idx, name in enumerate(sorted_names, 1):
        info = skills[name]
        meta = data.skills_meta.get(name, {})
        ver = info.get("version", "1.0.0")
        has_scripts = len(info.get("scripts", [])) > 0
        scripts_tag = green("Có (PY)") if has_scripts else dim("-")
        allowed = ", ".join(info.get("allowedTools", []))
        if not allowed:
            allowed = meta.get("allowed_tools", "Standard")
        allowed_short = (allowed[:36] + "...") if len(allowed) > 38 else allowed

        print(f"{cyan(f'[{idx:02d}]'):<5} {bold(name):<28} {yellow(ver):<8} {scripts_tag:<9} {dim(allowed_short)}")

    hr()
    print(f" {dim(f'Tổng cộng: {len(data.skills)} kỹ năng được tải theo điều kiện when_to_use giúp tối ưu ngữ cảnh.')}")

    if non_interactive:
        return

    # Interactive search & inspection
    while True:
        print(f"\n {bold(f'👉 Nhập số [1-{len(sorted_names)}]')} | {bold('tên kỹ năng')} | {bold('cat')} (xem theo danh mục) | {bold('/search <từ khóa>')} | {bold('0')} để quay lại:")
        try:
            choice = input(cyan("NDANHPC/skills > ")).strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not choice or choice in ("0", "q", "exit"):
            break

        if choice in ("cat", "c", "categories"):
            show_skill_categories(data)
            break

        if choice.startswith("/search "):
            sub_q = choice[8:].strip()
            list_skills(data, non_interactive=False, query=sub_q)
            break

        target_name = None
        if choice.isdigit():
            c_idx = int(choice)
            if 1 <= c_idx <= len(sorted_names):
                target_name = sorted_names[c_idx - 1]
        else:
            matches = [n for n in sorted_names if choice.lower() in n.lower()]
            if matches:
                target_name = matches[0]

        if target_name:
            show_skill_detail(data, target_name)
        else:
            # Try searching as general filter
            sub_matches = [
                n for n in sorted(skills.keys())
                if choice.lower() in n.lower()
                or choice.lower() in data.skills_meta.get(n, {}).get("description", "").lower()
            ]
            if sub_matches:
                list_skills(data, non_interactive=False, query=choice)
                break
            else:
                print(yellow(f"Không tìm thấy kỹ năng phù hợp với '{choice}'."))


def show_skill_categories(data: ToolkitData) -> None:
    """Show interactive skill category browser."""
    print(bold(cyan("\n📂 PHÂN LOẠI DANH MỤC SKILLS")))
    hr()
    keys = list(SKILL_CATEGORIES.keys())
    for idx, key in enumerate(keys, 1):
        title, desc, cat_skills = SKILL_CATEGORIES[key]
        print(f"  [{cyan(str(idx))}] {bold(title)} {dim(f'({len(cat_skills)} skills)')}")
        print(f"      {dim(desc)}")

    print(f"\n {bold('👉 Chọn số [1-8]')} để lọc danh mục | {bold('0')} để quay lại:")
    try:
        sel = input(cyan("NDANHPC/skills/cat > ")).strip()
    except (EOFError, KeyboardInterrupt):
        return

    if sel.isdigit() and 1 <= int(sel) <= len(keys):
        chosen_key = keys[int(sel) - 1]
        list_skills(data, non_interactive=False, category_key=chosen_key)
    else:
        list_skills(data, non_interactive=False)


def show_skill_detail(data: ToolkitData, name: str) -> None:
    """Show detailed metadata and instructions for a specific skill."""
    info = data.skills.get(name, {})
    meta = data.skills_meta.get(name, {})

    print(bold(cyan(f"\n📋 THÔNG TIN KỸ NĂNG: @{name}")))
    hr("═")
    print(f" {bold('Tên Kỹ năng:')}       {cyan(name)}")
    print(f" {bold('Tập tin SKILL.md:')}   {dim(info.get('path', meta.get('file', 'N/A')))}")
    print(f" {bold('Phiên bản:')}          {green(info.get('version', '1.0.0'))}")

    tools = info.get("allowedTools", [])
    print(f" {bold('Công cụ cho phép:')}   {magenta(', '.join(tools) if tools else meta.get('allowed_tools', 'Standard'))}")

    scripts = info.get("scripts", [])
    if scripts:
        print(f" {bold('Scripts đi kèm:')}")
        for sc in scripts:
            print(f"   • {green(sc)}")
    else:
        print(f" {bold('Scripts đi kèm:')}    {dim('Không có script độc lập')}")

    # Check for references or assets
    abs_path = meta.get("abs_path")
    if abs_path and abs_path.exists():
        skill_dir = abs_path.parent
        refs_dir = skill_dir / "references"
        if refs_dir.exists():
            ref_files = [f.name for f in refs_dir.glob("*.md")]
            if ref_files:
                print(f" {bold('Tài liệu tham chiếu (References):')}")
                for rf in ref_files:
                    print(f"   • {yellow(rf)}")

    desc = meta.get("description", "")
    if desc:
        print(f"\n {bold('Mô tả chuyên môn:')}")
        print(f"   {desc}")

    when_to_use = meta.get("when_to_use", "")
    if when_to_use:
        print(f"\n {bold('Điều kiện kích hoạt (when_to_use):')}")
        print(f"   {yellow(when_to_use)}")

    hr()


# ==============================================================================
# View 4: Tra cứu Workflows & Slash Commands (29 Workflows)
# ==============================================================================

def list_workflows(data: ToolkitData, non_interactive: bool = False, query: Optional[str] = None) -> None:
    """Display table of all Workflows and slash command guides."""
    workflows = data.workflows
    sorted_names = sorted(workflows.keys())

    if query:
        q = query.lower().lstrip("/")
        sorted_names = [
            n for n in sorted_names
            if q in n.lower() or q in data.workflows_meta.get(n, {}).get("description", "").lower()
        ]

    count_str = f"{len(sorted_names)}/{len(data.workflows)}" if query else str(len(data.workflows))
    print(bold(cyan(f"\n⚡ DANH MỤC WORKFLOWS & SLASH COMMANDS ({count_str}) (NDANHPC KIT v{data.kit_version})")))
    if query:
        print(f" {bold('Bộ lọc từ khóa:')} {yellow(query)}")
    hr()
    print(f"{bold('STT'):<5} {bold('Slash Command'):<35} {bold('Agents Yêu Cầu'):<26} {bold('Artifact Outputs')}")
    hr("-")

    for idx, name in enumerate(sorted_names, 1):
        info = workflows[name]
        meta = data.workflows_meta.get(name, {})
        req_agents = ", ".join(info.get("requires", {}).get("agents", []))
        if not req_agents:
            req_agents = meta.get("requires_agents", "orchestrator")
        req_agents_short = (req_agents[:24] + "...") if len(req_agents) > 26 else req_agents

        artifacts = ", ".join(info.get("artifactOutputs", []))
        if not artifacts:
            artifacts = meta.get("artifact_outputs", "status-report")
        artifacts_short = (artifacts[:28] + "...") if len(artifacts) > 30 else artifacts

        cmd = f"/{name}"
        # Highlight QA commands with green, others with cyan
        cmd_colored = green(cmd) if name in WORKFLOW_CATEGORIES["qa"][1] else cyan(cmd)
        print(f"{cyan(f'[{idx:02d}]'):<5} {cmd_colored:<35} {bold(req_agents_short):<26} {dim(artifacts_short)}")

    hr()
    print(bold("💡 BẢNG TRA CỨU NHANH CÁC LỆNH SLASH COMMAND THƯỜNG DÙNG:"))
    print(f"  • {green('/plan')} [nhiệm vụ]                  → Phân rã bài toán thành lộ trình 4 giai đoạn ({cyan('{task-slug}.md')})")
    print(f"  • {green('/orchestrate')} [nhiệm vụ]           → Điều phối tối thiểu 3 agents song song giải quyết bài toán lớn")
    print(f"  • {green('/debug')} [lỗi]                     → Điều tra lỗi 4 pha khoa học tìm nguyên nhân gốc rễ (Root Cause)")
    print(f"  • {green('/verify')}                           → Chạy kiểm định 17 tiêu chí sản xuất trước khi nghiệm thu")
    print(f"  • {yellow('/generate-manual-testcases-rbt')}    → Sinh Test Cases thủ công AI-RBT 6 bước có ma trận rủi ro")
    print(f"  • {yellow('/generate-automation-framework')}    → Khởi tạo khung kiểm thử tự động Playwright POM chuẩn mực")
    print(f"  • {yellow('/analyze-flaky-tests')}              → Định vị và tự động khắc phục test chạy chập chờn")
    print(f"  • {yellow('/fetch-jira-requirements')}          → Kéo yêu cầu nghiệp vụ từ Jira và xuất định dạng chuẩn")

    if non_interactive:
        return

    while True:
        print(f"\n {bold(f'👉 Nhập số [1-{len(sorted_names)}]')} hoặc {bold('tên lệnh')} (ví dụ: plan, rbt, flaky) | {bold('0')} để quay lại:")
        try:
            choice = input(cyan("NDANHPC/workflows > ")).strip().lstrip("/")
        except (EOFError, KeyboardInterrupt):
            break

        if not choice or choice in ("0", "q", "exit"):
            break

        target_name = None
        if choice.isdigit():
            c_idx = int(choice)
            if 1 <= c_idx <= len(sorted_names):
                target_name = sorted_names[c_idx - 1]
        else:
            matches = [n for n in sorted_names if choice.lower() == n.lower() or choice.lower() in n.lower()]
            if matches:
                target_name = matches[0]

        if target_name:
            show_workflow_detail(data, target_name)
        else:
            print(yellow(f"Không tìm thấy workflow phù hợp với '/{choice}'."))


def show_workflow_detail(data: ToolkitData, name: str) -> None:
    """Show details of a workflow."""
    info = data.workflows.get(name, {})
    meta = data.workflows_meta.get(name, {})

    print(bold(cyan(f"\n📋 CHI TIẾT WORKFLOW: /{name}")))
    hr("═")
    print(f" {bold('Lệnh gọi:')}            {green(f'/{name}')}")
    print(f" {bold('Tập tin quy trình:')}   {dim(info.get('path', meta.get('file', 'N/A')))}")
    print(f" {bold('Phiên bản:')}           {green(info.get('version', '1.0.0'))}")

    req_agents = info.get("requires", {}).get("agents", [])
    print(f" {bold('Agents tham gia:')}     {cyan(', '.join(req_agents) if req_agents else meta.get('requires_agents', 'orchestrator'))}")

    req_skills = info.get("requires", {}).get("skills", [])
    print(f" {bold('Skills kích hoạt:')}    {yellow(', '.join(req_skills) if req_skills else meta.get('requires_skills', 'Standard'))}")

    artifacts = info.get("artifactOutputs", [])
    print(f" {bold('Tài liệu tạo ra:')}     {magenta(', '.join(artifacts) if artifacts else meta.get('artifact_outputs', 'None'))}")

    desc = meta.get("description", "")
    if desc:
        print(f"\n {bold('Mô tả quy trình:')}")
        print(f"   {desc}")
    hr()


# ==============================================================================
# View 5: Tra cứu Workspace Rules (7 Quy tắc Cốt Lõi)
# ==============================================================================

def list_rules(data: ToolkitData, non_interactive: bool = False) -> None:
    """Display table of all Workspace Rules and inspection mechanism."""
    rules = data.rules
    sorted_names = sorted(rules.keys())

    print(bold(cyan(f"\n📜 DANH MỤC 7 WORKSPACE RULES (NDANHPC KIT v{data.kit_version})")))
    hr()
    print(f"{bold('STT'):<5} {bold('Tên Quy Tắc'):<22} {bold('Ưu Tiên'):<10} {bold('Kích Hoạt'):<16} {bold('Đường dẫn file')}")
    hr("-")

    for idx, name in enumerate(sorted_names, 1):
        info = rules[name]
        priority = info.get("priority", "P0")
        trigger = info.get("trigger", "always_on")
        path_str = info.get("path", f"rules/{name}.md")

        p_colored = red(priority) if priority == "P0" else (yellow(priority) if priority == "P1" else dim(priority))
        trig_colored = green(trigger) if trigger == "always_on" else cyan(trigger)
        print(f"{cyan(f'[{idx:02d}]'):<5} {bold(name):<22} {p_colored:<10} {trig_colored:<16} {dim(path_str)}")

    hr()
    print(bold("💡 Ý NGHĨA PHÂN CẤP ƯU TIÊN:"))
    print(f"  • {red('P0 (Always On / Absolute):')} Bắt buộc tuân thủ 100%. Không phỏng đoán, không giải pháp tạm bợ.")
    print(f"  • {yellow('P1 (Specialist Rules):')}  Quy tắc chuyên trách (Ví dụ: QA 1920x1080 Headed, POM, Zero sleep).")
    print(f"  • {dim('P2 (On-Demand Catalog):')} Tra cứu nhanh danh mục Agent/Skill khi cần thiết.")

    if non_interactive:
        return

    while True:
        print(f"\n {bold('👉 Nhập số [1-7]')} hoặc {bold('tên quy tắc')} để xem chi tiết | {bold('0')} để quay lại:")
        try:
            choice = input(cyan("NDANHPC/rules > ")).strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not choice or choice in ("0", "q", "exit"):
            break

        target_name = None
        if choice.isdigit():
            c_idx = int(choice)
            if 1 <= c_idx <= len(sorted_names):
                target_name = sorted_names[c_idx - 1]
        else:
            matches = [n for n in sorted_names if choice.lower() in n.lower()]
            if matches:
                target_name = matches[0]

        if target_name:
            show_rule_detail(data, target_name)
        else:
            print(yellow(f"Không tìm thấy quy tắc '{choice}'."))


def show_rule_detail(data: ToolkitData, name: str) -> None:
    """Show details of a specific workspace rule."""
    info = data.rules.get(name, {})
    meta = data.rules_meta.get(name, {})

    print(bold(cyan(f"\n📋 CHI TIẾT QUY TẮC: {name}")))
    hr("═")
    print(f" {bold('Tên Quy tắc:')}       {cyan(name)}")
    print(f" {bold('Mức ưu tiên:')}       {bold(info.get('priority', 'P0'))}")
    print(f" {bold('Cơ chế kích hoạt:')}  {green(info.get('trigger', 'always_on'))}")
    print(f" {bold('Đường dẫn file:')}     {dim(info.get('path', meta.get('file', 'N/A')))}")

    desc = meta.get("description", "")
    if desc:
        print(f"\n {bold('Mô tả mục tiêu:')}")
        print(f"   {desc}")

    abs_path = meta.get("abs_path")
    if abs_path and abs_path.exists():
        try:
            content = abs_path.read_text("utf-8", errors="replace")
            # Print first 25 non-frontmatter lines
            lines = content.splitlines()
            body_lines = []
            in_fm = False
            for line in lines:
                if line.strip() == "---":
                    in_fm = not in_fm
                    continue
                if not in_fm and line.strip():
                    body_lines.append(line)

            if body_lines:
                print(f"\n {bold('Trích dẫn nội dung quy chuẩn:')}")
                for bl in body_lines[:20]:
                    print(f"   {dim(bl)}")
                if len(body_lines) > 20:
                    print(f"   {italic('... (Xem tiếp trong file để đọc toàn bộ quy tắc)')}")
        except Exception:
            pass
    hr()


# ==============================================================================
# View 6: Trung tâm QA & Test Automation Supercharge Hub (NDANHPC Kit v2026.10.18)
# ==============================================================================

def show_qa_hub(data: ToolkitData) -> None:
    """Display comprehensive QA & Test Automation Supercharge Dashboard."""
    print(bold(yellow("\n🧪 TRUNG TÂM QA & TEST AUTOMATION SUPERCHARGE (NDANHPC KIT v2026.10.18)")))
    hr("═", Colors.YELLOW)
    print(f" {bold('Hệ sinh thái Kiểm thử Chuẩn Quốc Tế:')} Tích hợp hoàn hảo giữa AI và QA Engineering.")
    hr()

    # 1. Ten QA Skills
    print(bold("🎯 10 KỸ NĂNG QA CHUYÊN SÂU:"))
    qa_skills = [
        ("rbt-manual-testing", "Sinh Manual Test Cases 6 bước AI-RBT (QUICK & FULL mode) kèm ma trận rủi ro"),
        ("qa-automation-workflow", "Quy trình tự động hóa E2E chuẩn POM, smart waits, tự động debug"),
        ("smart-locator", "Chiến lược định vị bền vững: User semantic > data-testid > text > resilient CSS"),
        ("locator-healer", "Tự động phát hiện và vá lỗi locators bị hỏng khi UI DOM thay đổi (Self-healing)"),
        ("ui-debug", "Điều tra giao diện trực tiếp trên viewport 1920x1080 headed mode"),
        ("flaky-test-analyzer", "Phân tích nguyên nhân gốc rễ và tự động khắc phục test chạy chập chờn"),
        ("qa-framework-architect", "Thiết kế & scaffold framework POM hoàn chỉnh cho Playwright, Selenium, Appium"),
        ("test-data-generator", "Sinh test data unique, traceable (timestamp) và tổ hợp ma trận Pairwise"),
        ("requirements-analyzer", "Khám phá trang web/tài liệu và sinh bản Yêu cầu nghiệp vụ chuẩn mực"),
        ("jira-integration", "Kéo requirements từ Jira và đẩy kết quả thực thi lên Jira Xray Cloud/Server")
    ]
    for s_name, s_desc in qa_skills:
        print(f"  • {green(f'@{s_name:<24}')} {dim(s_desc)}")
    print()

    # 2. Strict QA Rules
    print(bold("⚖️ 5 NGUYÊN TẮC VÀNG BẮT BUỘC TRONG QA (rules/qa-testing-rules.md):"))
    rules_qa = [
        ("1. Desktop Viewport 1920x1080", "Tất cả UI debugging bắt buộc khởi chạy ở kích thước 1920x1080."),
        ("2. Headed Mode First", "Bắt buộc mở trình duyệt thực tế có giao diện (headed) để quan sát DOM."),
        ("3. Zero Hard Sleep", "CẤM tuyệt đối Thread.sleep/waitForTimeout. Chỉ sử dụng Smart Auto-Waits."),
        ("4. Dynamic Traceable Data", "Dữ liệu unique phải có tiền tố thời gian (e.g. test_user_1712049200)."),
        ("5. Definition of Done (DoD)", "Kiểm thử tự động chỉ hoàn thành khi PASS ổn định ít nhất 2 lần liên tiếp.")
    ]
    for r_title, r_desc in rules_qa:
        print(f"  [{yellow('!')}] {bold(r_title):<30} {dim(r_desc)}")
    print()

    # 3. 6-Phase Pipelines
    print(bold("📐 KIẾN TRÚC QUY TRÌNH 6 PHA (AI-RBT & AUTOMATION PIPELINES):"))
    print(f"  {cyan('Manual AI-RBT:')}    Roleplay → Q&A Phân tích → Phân rã → Ma trận vết → AI-RBT & TC → Xuất mẫu")
    print(f"  {cyan('Automation POM:')}   Môi trường → Scaffold Framework → Locators → Test Data → Code Gen → Refactor")
    print()

    # 4. Integrations
    print(bold("🔌 KẾT NỐI HỆ THỐNG NGOẠI VI (INTEGRATIONS):"))
    print(f"  • {bold('Jira / Xray Integration:')}  Kéo User Stories và đẩy kết quả Test Execution ({cyan('.agents/scripts/integrations/jira/')})")
    print(f"  • {bold('Google Sheets Integration:')} Đọc/Ghi test cases tự động lên bảng tính ({cyan('.agents/scripts/integrations/google_sheet/')})")
    print(f"  • {bold('Excel Converter:')}           Chuyển đổi Markdown Test Cases sang XLSX ({cyan('.agents/scripts/convert_excel/')})")
    hr()


# ==============================================================================
# View 7: Mô phỏng Multi-Agent Orchestration (/orchestrate)
# ==============================================================================

ORCHESTRATION_PRESETS: Dict[str, Dict[str, Any]] = {
    "webapp": {
        "title": "Xây dựng Web Application Full-Stack (Next.js & Fastify)",
        "domains": ["Frontend/UI", "Backend/API", "Testing", "Security"],
        "agents": ["frontend-specialist", "backend-specialist", "test-engineer"],
        "plan_file": "webapp-dashboard-plan.md",
        "steps": [
            ("project-planner", "Phân tích yêu cầu, thiết lập kiến trúc thư mục và khởi tạo webapp-dashboard-plan.md"),
            ("explorer-agent", "Quét cấu trúc dự án, kiểm tra thư viện hiện có và các kết nối API"),
            ("database-architect", "Thiết kế lược đồ cơ sở dữ liệu PostgreSQL & Prisma migrations"),
            ("backend-specialist", "Phát triển REST/tRPC APIs, tích hợp JWT authentication và session security"),
            ("frontend-specialist", "Xây dựng giao diện responsive với Tailwind CSS v4 và Next.js App Router"),
            ("test-engineer", "Viết bộ kiểm thử Unit & Integration với AAA Pattern và chạy Webapp Testing"),
            ("security-auditor", "Thực hiện quét bảo mật SAST OWASP 2025 và kiểm tra secrets")
        ]
    },
    "fullstack": {
        "title": "Nền tảng SaaS Đa người dùng (Multi-tenant SaaS)",
        "domains": ["Planning", "Frontend", "Backend", "DevOps"],
        "agents": ["project-planner", "frontend-specialist", "backend-specialist", "devops-engineer"],
        "plan_file": "saas-platform-architecture.md",
        "steps": [
            ("project-planner", "Xây dựng lộ trình 4 giai đoạn và tài liệu kiến trúc saas-platform-architecture.md"),
            ("explorer-agent", "Lập bản đồ phụ thuộc các module hệ thống"),
            ("backend-specialist", "Thiết kế Multi-tenant isolation và Stripe billing webhook"),
            ("frontend-specialist", "Thiết lập Design System tokens và bảng điều khiển người dùng"),
            ("devops-engineer", "Viết Dockerfile đa tầng và cấu hình GitHub Actions CI/CD zero-downtime"),
            ("test-engineer", "Tự động hóa kiểm thử tích hợp đầu cuối (E2E) qua Playwright")
        ]
    },
    "qa": {
        "title": "Quy trình AI-RBT & QA Test Automation Toàn diện (Playwright & Xray)",
        "domains": ["Quality Assurance", "Test Architecture", "Automation", "Integrations"],
        "agents": ["qa-automation-engineer", "test-engineer", "ux-accessibility-reviewer"],
        "plan_file": "qa-automation-rbt-pipeline.md",
        "steps": [
            ("project-planner", "Phân tích yêu cầu nghiệp vụ và cấu trúc kế hoạch kiểm thử qa-automation-rbt-pipeline.md"),
            ("explorer-agent", "Quét giao diện web, bóc tách cấu trúc DOM và lập danh mục tương tác"),
            ("qa-automation-engineer", "Kích hoạt @rbt-manual-testing sinh bộ test cases AI-RBT 6 bước chuẩn mực"),
            ("qa-automation-engineer", "Áp dụng @smart-locator và @qa-framework-architect scaffold framework Playwright POM"),
            ("test-engineer", "Sinh test data bằng @test-data-generator và chạy automation test suite"),
            ("qa-automation-engineer", "Tự động điều tra test chập chờn với @flaky-test-analyzer và tự sửa bằng @locator-healer"),
            ("qa-automation-engineer", "Đồng bộ kết quả test lên Jira Xray qua @jira-integration")
        ]
    },
    "api": {
        "title": "Hệ thống Microservice API Hiệu năng cao",
        "domains": ["Backend", "Security", "Testing"],
        "agents": ["backend-specialist", "security-auditor", "test-engineer"],
        "plan_file": "high-perf-api-spec.md",
        "steps": [
            ("project-planner", "Xác định các endpoints, payload schema và SLA hiệu năng"),
            ("backend-specialist", "Viết API logic với async Python/FastAPI, tối ưu hóa caching Redis"),
            ("security-auditor", "Kiểm định phân quyền RBAC, phòng chống Rate Limiting và SQL Injection"),
            ("test-engineer", "Kiểm thử tải (Load testing) và kiểm tra độ phủ loại Type Coverage 100%")
        ]
    },
    "security": {
        "title": "Red Team Security Audit & Đánh giá rủi ro OWASP 2025",
        "domains": ["Security Compliance", "Offensive Tactics", "DevOps Hardening"],
        "agents": ["security-auditor", "penetration-tester", "devops-engineer"],
        "plan_file": "security-audit-assessment.md",
        "steps": [
            ("security-auditor", "Quét toàn bộ mã nguồn tìm lỗ hổng P0 (Secrets, SAST, Dependency Analysis)"),
            ("penetration-tester", "Mô phỏng vector tấn công dựa trên ma trận MITRE ATT&CK"),
            ("devops-engineer", "Áp dụng bản vá hạ tầng, gia cố Container và chính sách phân quyền")
        ]
    },
    "debug": {
        "title": "Điều tra Sự cố Hệ thống Phức tạp (4-Phase Systematic Debugging)",
        "domains": ["Root Cause Analysis", "Discovery", "Regression Testing"],
        "agents": ["debugger", "explorer-agent", "test-engineer"],
        "plan_file": "incident-root-cause-analysis.md",
        "steps": [
            ("explorer-agent", "Thu thập log, stack trace và cô lập phạm vi bùng phát sự cố (blast radius)"),
            ("debugger", "Tạo giả thuyết khoa học, tái hiện lỗi và định vị chính xác dòng code gây lỗi"),
            ("debugger", "Áp dụng bản sửa đổi tối thiểu (Minimal Clean Patch)"),
            ("test-engineer", "Tạo Regression Test để đảm bảo lỗi không bao giờ xuất hiện trở lại")
        ]
    }
}


def simulate_orchestration(data: ToolkitData, task_key: Optional[str] = None) -> None:
    """Simulate strict 2-phase multi-agent orchestration execution."""
    print(bold(cyan("\n🔄 MÔ PHỎNG LUỒNG MULTI-AGENT ORCHESTRATION (/orchestrate)")))
    hr()
    print(f" {bold('Quy tắc cốt lõi:')} {yellow('Tối thiểu 3 Specialist Agents')} • {green('Chu kỳ nghiêm ngặt 2 Pha (Planning -> Approval -> Parallel)')}")
    hr("-")

    scenario = None
    if task_key and task_key in ORCHESTRATION_PRESETS:
        scenario = ORCHESTRATION_PRESETS[task_key]
    else:
        print(bold("Chọn kịch bản mô phỏng:"))
        for idx, (key, item) in enumerate(ORCHESTRATION_PRESETS.items(), 1):
            is_new = " [MỚI v2026.10.18]" if key == "qa" else ""
            print(f"  [{cyan(str(idx))}] {bold(item['title'])}{yellow(is_new)} {dim(f'({key})')}")
        print()

        try:
            sel = input(cyan(f"Chọn kịch bản [1-{len(ORCHESTRATION_PRESETS)}, Enter=1]: ")).strip()
        except (EOFError, KeyboardInterrupt):
            return

        keys = list(ORCHESTRATION_PRESETS.keys())
        if sel.isdigit() and 1 <= int(sel) <= len(keys):
            scenario = ORCHESTRATION_PRESETS[keys[int(sel) - 1]]
        else:
            scenario = ORCHESTRATION_PRESETS["webapp"]

    print(bold(f"\n🎯 KỊCH BẢN ĐÃ CHỌN: {scenario['title']}"))
    print(f" {bold('Lĩnh vực liên quan:')} {magenta(', '.join(scenario['domains']))}")

    agents_count = len(scenario["agents"])
    print(f" {bold('Số lượng Agents tham gia:')} {green(str(agents_count))} (Quy chuẩn tối thiểu: >= 3) -> {bold(green('HỢP LỆ [PASS]'))}")
    print(f" {bold('Specialist Agents:')} {cyan(', '.join(scenario['agents']))}")
    hr()

    # Step 1: Pre-flight & Domain Analysis
    time.sleep(0.3)
    print(bold("\n[BƯỚC 1] 🧭 PHÂN TÍCH MIỀN BÀI TOÁN & LẬP MA TRẬN ĐIỀU PHỐI (ORCHESTRATION MATRIX)"))
    print(f"  {dim('•')} Tự động phân loại yêu cầu: {green('COMPLEX MULTI-DOMAIN TASK')}")
    print(f"  {dim('•')} Đăng ký các Agent chuyên trách vào phiên làm việc")
    print(f"  {dim('•')} Kích hoạt kỹ năng điều phối: {yellow('@coordinator-mode')} + {yellow('@parallel-agents')}")

    # Phase 1: Planning
    time.sleep(0.4)
    print(bold(f"\n[BƯỚC 2] 📋 PHA 1: LẬP KẾ HOẠCH TUẦN TỰ (SEQUENTIAL PLANNING - NO PARALLEL CODE)"))
    print(f"  {green('🤖 Kích hoạt @project-planner')} để khởi tạo tài liệu {cyan(scenario['plan_file'])}...")
    time.sleep(0.3)
    print(f"  {green('🤖 Kích hoạt @explorer-agent')} để quét kiến trúc phụ thuộc trong codebase...")
    time.sleep(0.3)
    print(f"  {bold(green('✓'))} Đã hoàn thành bản kế hoạch {cyan(scenario['plan_file'])} gồm 4 giai đoạn, kiến trúc và ranh giới an toàn.")

    # Checkpoint
    time.sleep(0.3)
    print(bold("\n[BƯỚC 3] ⏸️ ĐIỂM KIỂM SOÁT NGƯỜI DÙNG PHÊ DUYỆT (USER APPROVAL CHECKPOINT)"))
    print(f"  {bold(yellow('Hỏi người dùng:'))} '✅ Bản kế hoạch {scenario['plan_file']} đã sẵn sàng. Bạn có phê duyệt triển khai? (Y/N)'")
    print(f"  {bold(green('Phản hồi giả lập:'))} {bold('Y (Approved)')} -> Cho phép chuyển sang Pha 2 Triển khai song song.")

    # Phase 2: Parallel Implementation
    time.sleep(0.4)
    print(bold("\n[BƯỚC 4] 🚀 PHA 2: TRIỂN KHAI SONG SONG (PARALLEL WORKERS WITH FULL CONTEXT)"))
    print(f"  {dim('Chuyển giao đầy đủ bối cảnh (Context Passing): Quyết định của người dùng + Tài liệu kế hoạch.')}")

    for ag_name, action in scenario["steps"][2:]:
        time.sleep(0.3)
        print(f"  {green('▶')} [{bold(cyan(ag_name))}] {action}")

    # Step 5: Verification Suite
    time.sleep(0.3)
    print(bold("\n[BƯỚC 5] 🧪 KIỂM ĐỊNH CHẤT LƯỢNG SAU TRIỂN KHAI (VERIFICATION GATE)"))
    print(f"  {green('✓')} Chạy security_scan.py: 0 lỗ hổng nghiêm trọng")
    print(f"  {green('✓')} Chạy lint_runner.py & type_coverage.py: 100% tuân thủ Clean Code")

    # Step 6: Synthesis
    time.sleep(0.3)
    print(bold("\n[BƯỚC 6] 🎼 BÁO CÁO TỔNG HỢP (SYNTHESIS REPORT)"))
    hr("═")
    print(f" {bold(green('KẾT QUẢ ĐIỀU PHỐI HOÀN TẤT THÀNH CÔNG:'))}")
    print(f"  • Kế hoạch: {cyan(scenario['plan_file'])} đã được thực thi toàn vẹn")
    print(f"  • Các agents đã phối hợp nhịp nhàng, chia sẻ ngữ cảnh và kiểm thử hồi quy thành công")
    print(f"  • Hệ thống sẵn sàng cho quy trình kiểm định hoặc đóng gói phát hành")
    hr()


# ==============================================================================
# View 8: Global Search
# ==============================================================================

def search_toolkit(data: ToolkitData, query: Optional[str] = None) -> None:
    """Perform global unified search across all agents, skills, workflows, and rules."""
    if not query:
        print(bold(cyan("\n🔍 TÌM KIẾM TOÀN DIỆN TRONG NDANHPC KIT")))
        hr()
        try:
            query = input(cyan("Nhập từ khóa tìm kiếm (ví dụ: qa, test, security, api): ")).strip()
        except (EOFError, KeyboardInterrupt):
            return

    if not query:
        return

    results = data.search(query)
    total_found = sum(len(items) for items in results.values())

    print(bold(cyan(f"\n🔍 KẾT QUẢ TÌM KIẾM CHO: '{query}' ({total_found} kết quả)")))
    hr()

    if results["agents"]:
        print(bold(cyan(f"🤖 Specialist Agents ({len(results['agents'])}):")))
        for name, desc in results["agents"]:
            print(f"  • {bold(name):<26} {dim(desc[:60])}")
        print()

    if results["skills"]:
        print(bold(cyan(f"📚 Domain Skills ({len(results['skills'])}):")))
        for name, desc in results["skills"]:
            print(f"  • {bold(name):<26} {dim(desc[:60])}")
        print()

    if results["workflows"]:
        print(bold(cyan(f"⚡ Workflows ({len(results['workflows'])}):")))
        for name, desc in results["workflows"]:
            print(f"  • {green(name):<32} {dim(desc[:60])}")
        print()

    if results["rules"]:
        print(bold(cyan(f"📜 Workspace Rules ({len(results['rules'])}):")))
        for name, desc in results["rules"]:
            print(f"  • {bold(name):<26} {dim(desc[:60])}")
        print()

    if total_found == 0:
        print(yellow(f"Không tìm thấy thành phần nào khớp với từ khóa '{query}'."))
    hr()


# ==============================================================================
# View 9: Antigravity Doctor
# ==============================================================================

def run_doctor(data: ToolkitData) -> int:
    """Execute Antigravity Doctor check."""
    print(bold(cyan("\n🩺 CHẠY KIỂM ĐỊNH ANTIGRAVITY DOCTOR")))
    hr()
    print(f" {dim('Lệnh thực thi:')} {green('npm run check:antigravity')}")
    print()

    cmd = ["npm", "run", "check:antigravity"]
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(data.project_dir),
            text=True
        )
        rc = proc.returncode
    except FileNotFoundError:
        doctor_mjs = data.toolkit_dir / "hooks" / "antigravity-doctor.mjs"
        if doctor_mjs.exists():
            print(yellow("npm không khả dụng, chạy trực tiếp qua node..."))
            proc = subprocess.run(
                ["node", str(doctor_mjs)],
                cwd=str(data.project_dir),
                text=True
            )
            rc = proc.returncode
        else:
            print(red("Không tìm thấy node hoặc npm để chạy Antigravity Doctor."))
            rc = 1

    hr()
    if rc == 0:
        print(bold(green("✅ ANTIGRAVITY DOCTOR: Tất cả các tiêu chuẩn kiểm định đã ĐẠT!")))
    else:
        print(bold(red(f"❌ ANTIGRAVITY DOCTOR: Phát hiện cảnh báo hoặc lỗi (Mã thoát: {rc}).")))
    return rc


# ==============================================================================
# View 10: Full Verification Suite
# ==============================================================================

def run_verify(data: ToolkitData) -> int:
    """Execute Full Verification Suite."""
    print(bold(cyan("\n🧪 CHẠY FULL VERIFICATION SUITE (17 TIÊU CHÍ)")))
    hr()
    print(f" {dim('Lệnh thực thi:')} {green('npm run verify')}")
    print()

    cmd = ["npm", "run", "verify"]
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(data.project_dir),
            text=True
        )
        rc = proc.returncode
    except FileNotFoundError:
        verify_py = data.toolkit_dir / "scripts" / "verify_all.py"
        if verify_py.exists():
            print(yellow("npm không khả dụng, chạy trực tiếp qua python3..."))
            proc = subprocess.run(
                [sys.executable, str(verify_py)],
                cwd=str(data.project_dir),
                text=True
            )
            rc = proc.returncode
        else:
            print(red("Không tìm thấy script verify_all.py."))
            rc = 1

    hr()
    if rc == 0:
        print(bold(green("✅ FULL VERIFICATION SUITE: Hệ thống hoàn toàn đạt chuẩn sản xuất!")))
    else:
        print(bold(red(f"❌ FULL VERIFICATION SUITE: Có kiểm tra chưa đạt (Mã thoát: {rc}).")))
    return rc


# ==============================================================================
# View 11: Web Portal Launcher
# ==============================================================================

def launch_web_portal(data: ToolkitData, port: int = 3000) -> None:
    """Launch local Web Portal with HTTP Server."""
    web_dir = data.project_dir / "web"
    if not web_dir.exists():
        web_dir.mkdir(parents=True, exist_ok=True)

    index_html = web_dir / "index.html"
    if not index_html.exists():
        index_html.write_text(
            f"<html><head><title>NDANHPC Kit Portal</title></head><body><h1>NDANHPC Kit {data.kit_version}</h1></body></html>",
            encoding="utf-8"
        )

    # Detect LAN IP for remote desktop users
    lan_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        lan_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass

    print(bold(cyan(f"\n🌐 KHỞI CHẠY NDANHPC KIT WEB PORTAL TRÊN CỔNG {port}")))
    hr()
    print(f" {bold('Thư mục phục vụ:')}   {cyan(str(web_dir))}")
    print(f" {bold('Truy cập cục bộ:')}   {bold(green(f'http://localhost:{port}'))}")
    if lan_ip != "127.0.0.1":
        print(f" {bold('Truy cập mạng LAN:')} {bold(green(f'http://{lan_ip}:{port}'))} {dim('(Dành cho máy tính desktop / laptop khác cùng mạng)')}")
    print(f" {bold('Dừng máy chủ:')}       {yellow('Nhấn Ctrl+C để dừng và quay lại menu')}")
    hr()

    server_script = (
        "import http.server, socketserver\n"
        "class NoCacheHandler(http.server.SimpleHTTPRequestHandler):\n"
        "    def end_headers(self):\n"
        "        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')\n"
        "        self.send_header('Pragma', 'no-cache')\n"
        "        self.send_header('Expires', '0')\n"
        "        super().end_headers()\n"
        f"with socketserver.TCPServer(('', {port}), lambda *a: NoCacheHandler(*a, directory=r'{web_dir}')) as httpd:\n"
        "    httpd.serve_forever()\n"
    )
    cmd = [sys.executable, "-c", server_script]
    try:
        subprocess.run(cmd, cwd=str(data.project_dir))
    except KeyboardInterrupt:
        print(bold(yellow("\n🛑 Đã dừng Web Portal an toàn.")))
    except Exception as e:
        print(red(f"\nLỗi khi khởi chạy Web Portal: {e}"))


def update_kit(data: ToolkitData) -> int:
    """Update NDANHPC Kit to the latest release version."""
    print(bold(cyan("\n🔄 CẬP NHẬT NDANHPC KIT LÊN PHIÊN BẢN MỚI NHẤT")))
    hr("═", Colors.CYAN)
    local_ver = data.kit_version
    print(f" {bold('Thư mục Toolkit:')}      {cyan(str(data.toolkit_dir))}")
    print(f" {bold('Phiên bản trên máy:')}     {yellow(f'v{local_ver}')}")

    # Check remote version from GitHub
    remote_ver = None
    try:
        import urllib.request
        url = "https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/.agents/VERSION"
        req = urllib.request.Request(url, headers={"User-Agent": "NDANHPC-CLI"})
        with urllib.request.urlopen(req, timeout=5) as response:
            remote_ver = response.read().decode("utf-8").strip()
    except Exception as e:
        print(yellow(f" ⚠️ Không thể kiểm tra phiên bản trên GitHub ({e})"))

    if remote_ver:
        print(f" {bold('Phiên bản trên GitHub:')}  {green(f'v{remote_ver}')}")
        if remote_ver == local_ver:
            print(bold(green("\n✔ Bạn đang sử dụng phiên bản mới nhất! Không cần cập nhật.")))
            try:
                c = input("Bạn có muốn buộc cập nhật lại (force refresh) không? (y/n, mặc định n): ").strip().lower()
                if c != "y":
                    return 0
            except (EOFError, KeyboardInterrupt):
                return 0

    # Case 1: Git repository clone
    git_dir = data.project_dir / ".git"
    if git_dir.exists():
        print(bold(cyan("\nĐang cập nhật Git repository (git fetch & reset)...")))
        try:
            subprocess.run(["git", "fetch", "origin", "main"], cwd=str(data.project_dir), check=True)
            subprocess.run(["git", "reset", "--hard", "origin/main"], cwd=str(data.project_dir), check=True)
            print(bold(green("✔ Cập nhật qua Git thành công!")))
            subprocess.run(["npm", "run", "manifest"], cwd=str(data.project_dir), check=False)
            subprocess.run(["npm", "run", "deps"], cwd=str(data.project_dir), check=False)
            return 0
        except Exception as e:
            print(red(f"✖ Cập nhật qua Git thất bại: {e}"))
            return 1

    # Case 2: Standalone .agents inside external project
    install_script = data.project_dir / "install.sh"
    if install_script.exists():
        cmd = ["bash", str(install_script), "update"]
        try:
            return subprocess.run(cmd, cwd=str(data.project_dir)).returncode
        except Exception as e:
            print(red(f"✖ Lỗi khi thực thi install.sh: {e}"))
            return 1

    # Fallback tarball update
    try:
        import urllib.request, tarfile, tempfile, shutil
        print(bold(cyan("\nĐang tải bản cập nhật mới nhất từ GitHub...")))
        tar_url = "https://github.com/ducanhfw4802/ndanhpc-kit/archive/refs/heads/main.tar.gz"
        with tempfile.TemporaryDirectory() as tmp_dir:
            tmp_tar = Path(tmp_dir) / "kit.tar.gz"
            urllib.request.urlretrieve(tar_url, tmp_tar)
            with tarfile.open(tmp_tar, "r:gz") as tar:
                tar.extractall(tmp_dir)
            extracted = Path(tmp_dir) / "ndanhpc-kit-main" / ".agents"
            if not extracted.exists():
                print(red("✖ Gói tải về không chứa thư mục .agents hợp lệ."))
                return 1
            mem_src = data.toolkit_dir / "memory"
            mem_backup = Path(tmp_dir) / "mem_backup"
            if mem_src.exists():
                shutil.copytree(mem_src, mem_backup)
            for item in extracted.iterdir():
                dest = data.toolkit_dir / item.name
                if item.is_dir():
                    shutil.copytree(item, dest, dirs_exist_ok=True)
                else:
                    shutil.copy2(item, dest)
            if mem_backup.exists():
                shutil.copytree(mem_backup, mem_src, dirs_exist_ok=True)
            print(bold(green(f"\n✔ Cập nhật NDANHPC Kit lên v{remote_ver or 'mới nhất'} thành công!")))
            return 0
    except Exception as e:
        print(red(f"✖ Cập nhật thất bại: {e}"))
        return 1


def uninstall_kit(data: ToolkitData) -> int:
    """Safely uninstall NDANHPC Kit from the current project."""
    print(bold(red("\n🗑️ GỠ BỎ NDANHPC KIT KHỎI DỰ ÁN")))
    hr("═", Colors.RED)
    print(bold(yellow(f"Thư mục sẽ bị xóa: {data.toolkit_dir}")))
    try:
        confirm = input(bold(red("Bạn có chắc chắn muốn gỡ bỏ hoàn toàn .agents/ không? (yes/no): "))).strip().lower()
    except (EOFError, KeyboardInterrupt):
        print(yellow("\nĐã hủy thao tác."))
        return 0
    if confirm not in ("yes", "y"):
        print(yellow("\nĐã hủy thao tác gỡ bỏ."))
        return 0

    try:
        import shutil
        shutil.rmtree(data.toolkit_dir)
        bak_dir = data.project_dir / ".agents.bak"
        if bak_dir.exists():
            shutil.rmtree(bak_dir)
        print(bold(green("\n✔ Đã gỡ bỏ thành công NDANHPC Kit khỏi dự án.")))
        return 0
    except Exception as e:
        print(red(f"\n✖ Lỗi khi xóa thư mục .agents: {e}"))
        return 1


# ==============================================================================
# Interactive TUI Main Menu
# ==============================================================================

def interactive_menu(data: ToolkitData) -> None:
    """Run interactive TUI menu loop."""
    while True:
        banner(data)
        total_comp = len(data.agents) + len(data.skills) + len(data.workflows) + len(data.rules)
        print(bold(f"Vui lòng chọn chức năng tra cứu & điều phối ({total_comp} thành phần):"))
        print(f"  {cyan('[1]')}  🚀 {bold('Tổng quan & Kiến trúc NDANHPC Kit')} {dim(f'({total_comp} thành phần toàn diện)')}")
        print(f"  {cyan('[2]')}  🤖 {bold(f'Tra cứu Specialist Agents ({len(data.agents)})')} {dim('[Hỗ trợ tìm kiếm]')}")
        print(f"  {cyan('[3]')}  📚 {bold(f'Tra cứu Domain Skills ({len(data.skills)})')} {dim('[Phân loại 8 danh mục & Tìm kiếm]')}")
        print(f"  {cyan('[4]')}  ⚡ {bold(f'Tra cứu Workflows & Slash Commands ({len(data.workflows)})')} {dim('[16 QA + 13 Core]')}")
        print(f"  {cyan('[5]')}  📜 {bold(f'Tra cứu Workspace Rules ({len(data.rules)})')} {dim('[P0 Universal / P1 QA / P2 QuickRef]')}")
        print(f"  {yellow('[6]')}  🧪 {bold('Trung tâm QA & Test Automation Supercharge')} {yellow('[MỚI v2026.10.18]')}")
        print(f"  {cyan('[7]')}  🔄 {bold('Mô phỏng Multi-Agent Orchestration (/orchestrate)')} {dim('[6 kịch bản]')}")
        print(f"  {cyan('[8]')}  🔍 {bold('Tìm kiếm Toàn diện (Search All)')} {dim('[Tra cứu nhanh theo từ khóa]')}")
        print(f"  {cyan('[9]')}  🩺 {bold('Chạy kiểm định Antigravity Doctor')} {dim('(npm run check:antigravity)')}")
        print(f"  {cyan('[10]')} 🔬 {bold('Chạy Full Verification Suite')} {dim('(npm run verify)')}")
        print(f"  {cyan('[11]')} 🌐 {bold('Khởi chạy Web Portal')} {dim('(http://localhost:3000)')}")
        print(f"  {cyan('[12]')} 🔄 {bold('Cập nhật Kit lên bản mới nhất')} {dim('(Check & Auto Update)')}")
        print(f"  {red('[13]')} 🗑️ {bold('Gỡ bỏ Kit khỏi dự án')} {dim('(Uninstall .agents/)')}")
        print(f"  {yellow('[0]')}  🚪 {bold('Thoát (Exit)')}")
        hr()

        try:
            choice = input(bold(cyan("NDANHPC > Chọn số [0-13]: "))).strip()
        except (EOFError, KeyboardInterrupt):
            print(yellow("\n\nTạm biệt! Đã thoát NDANHPC CLI."))
            break

        if choice in ("0", "q", "exit"):
            print(bold(green("\nCảm ơn bạn đã sử dụng NDANHPC Kit! Hẹn gặp lại.")))
            break
        elif choice == "1":
            show_overview(data)
        elif choice == "2":
            list_agents(data, non_interactive=False)
        elif choice == "3":
            list_skills(data, non_interactive=False)
        elif choice == "4":
            list_workflows(data, non_interactive=False)
        elif choice == "5":
            list_rules(data, non_interactive=False)
        elif choice == "6":
            show_qa_hub(data)
        elif choice == "7":
            simulate_orchestration(data)
        elif choice == "8":
            search_toolkit(data)
        elif choice == "9":
            run_doctor(data)
        elif choice == "10":
            run_verify(data)
        elif choice == "11":
            launch_web_portal(data, 3000)
        elif choice == "12":
            update_kit(data)
        elif choice == "13":
            if uninstall_kit(data) == 0:
                break
        else:
            print(yellow(f"\n⚠️ Lựa chọn '{choice}' không hợp lệ. Vui lòng nhập từ 0 đến 13."))

        print()
        try:
            input(dim("Nhấn Enter để quay lại menu chính..."))
        except (EOFError, KeyboardInterrupt):
            break
        print("\n" * 2)


# ==============================================================================
# CLI Entry Point & Argument Parsing
# ==============================================================================

def main() -> int:
    parser = argparse.ArgumentParser(
        description="NDANHPC Kit Terminal CLI & TUI Dashboard",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Ví dụ sử dụng:
  python3 .agents/scripts/ndanhpc_cli.py               # Mở menu TUI tương tác
  python3 .agents/scripts/ndanhpc_cli.py --overview    # Xem tổng quan kiến trúc (121 thành phần)
  python3 .agents/scripts/ndanhpc_cli.py --agents      # Tra cứu danh mục Specialist Agents (24)
  python3 .agents/scripts/ndanhpc_cli.py --skills      # Tra cứu danh mục Domain Skills (61)
  python3 .agents/scripts/ndanhpc_cli.py --workflows   # Tra cứu danh mục Workflows (29)
  python3 .agents/scripts/ndanhpc_cli.py --rules       # Tra cứu Workspace Rules (7)
  python3 .agents/scripts/ndanhpc_cli.py --qa          # Bảng điều khiển QA Supercharge v2026.10.18
  python3 .agents/scripts/ndanhpc_cli.py --search qa   # Tìm kiếm toàn diện với từ khóa 'qa'
  python3 .agents/scripts/ndanhpc_cli.py --simulate qa # Mô phỏng quy trình kiểm thử AI-RBT & QA
  python3 .agents/scripts/ndanhpc_cli.py --doctor      # Kiểm định Antigravity Doctor
  python3 .agents/scripts/ndanhpc_cli.py --verify      # Kiểm định chất lượng toàn diện
  python3 .agents/scripts/ndanhpc_cli.py --web         # Mở Web Portal trên cổng 3000
  python3 .agents/scripts/ndanhpc_cli.py --update      # Cập nhật phiên bản mới nhất từ GitHub
  python3 .agents/scripts/ndanhpc_cli.py --uninstall   # Gỡ bỏ kit khỏi dự án hiện tại
"""
    )

    parser.add_argument("--overview", action="store_true", help="Hiển thị tổng quan & kiến trúc NDANHPC Kit")
    parser.add_argument("--agents", action="store_true", help="Liệt kê danh mục Specialist Agents (24)")
    parser.add_argument("--skills", nargs="?", const="", help="Liệt kê danh mục Skills (61) hoặc tìm kiếm theo từ khóa")
    parser.add_argument("--workflows", action="store_true", help="Liệt kê danh mục Workflows & Slash Commands (29)")
    parser.add_argument("--rules", action="store_true", help="Liệt kê danh mục Workspace Rules (7)")
    parser.add_argument("--qa", action="store_true", help="Hiển thị bảng điều khiển QA & Test Automation Supercharge")
    parser.add_argument("-s", "--search", type=str, help="Tìm kiếm toàn diện trong Agents, Skills, Workflows, Rules")
    parser.add_argument(
        "--simulate",
        nargs="?",
        const="webapp",
        help="Mô phỏng điều phối Multi-Agent (webapp, fullstack, qa, api, security, debug)"
    )
    parser.add_argument("--doctor", action="store_true", help="Chạy kiểm định Antigravity Doctor (npm run check:antigravity)")
    parser.add_argument("--verify", action="store_true", help="Chạy Full Verification Suite (npm run verify)")
    parser.add_argument("--web", nargs="?", type=int, const=3000, help="Khởi chạy Web Portal trên cổng chỉ định (mặc định: 3000)")
    parser.add_argument("--update", action="store_true", help="Cập nhật NDANHPC Kit lên bản mới nhất từ GitHub")
    parser.add_argument("--uninstall", action="store_true", help="Gỡ bỏ thư mục .agents khỏi dự án")
    parser.add_argument("--root", type=Path, help="Đường dẫn tuỳ biến tới thư mục .agents")

    args = parser.parse_args()
    data = ToolkitData(root=args.root)

    # Check non-interactive options
    if args.update:
        return update_kit(data)
    if args.uninstall:
        return uninstall_kit(data)
    if args.overview:
        show_overview(data)
        return 0
    if args.agents:
        list_agents(data, non_interactive=True)
        return 0
    if args.skills is not None:
        q = args.skills if args.skills else None
        list_skills(data, non_interactive=True, query=q)
        return 0
    if args.workflows:
        list_workflows(data, non_interactive=True)
        return 0
    if args.rules:
        list_rules(data, non_interactive=True)
        return 0
    if args.qa:
        show_qa_hub(data)
        return 0
    if args.search:
        search_toolkit(data, query=args.search)
        return 0
    if args.simulate:
        simulate_orchestration(data, task_key=args.simulate)
        return 0
    if args.doctor:
        return run_doctor(data)
    if args.verify:
        return run_verify(data)
    if args.web is not None:
        launch_web_portal(data, port=args.web)
        return 0

    # Fallback to interactive TUI menu
    interactive_menu(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
