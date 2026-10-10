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
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

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


def banner() -> None:
    """Print the NDANHPC Kit banner."""
    ascii_logo = r"""
  _   _ ____    _    _   _ _   _ ____   ____   _  ___ _   
 | \ | |  _ \  / \  | \ | | | | |  _ \ / ___| | |/ (_) |_ 
 |  \| | | | |/ _ \ |  \| | |_| | |_) | |     | ' /| | __|
 | |\  | |_| / ___ \| |\  |  _  |  __/| |___  | . \| | |_ 
 |_| \_|____/_/   \_\_| \_|_| |_|_|    \____| |_|\_\_|\__|
"""
    print(c(ascii_logo, Colors.BRIGHT_CYAN))
    print(f" {bold(cyan('⚡ NDANHPC KIT'))} {dim('•')} {bold('Antigravity-Native AI Agent Capability Toolkit')}")
    print(f" {dim('Production CalVer: 2026.10.10 | Multi-Agent Orchestration & Runtime Contract')}")
    hr("═", Colors.CYAN)


# ==============================================================================
# Manifest & Data Access Layer
# ==============================================================================

class ToolkitData:
    """Loads and caches metadata from .agents/manifest.json and markdown files."""

    def __init__(self, root: Optional[Path] = None):
        self.script_dir = Path(__file__).resolve().parent
        if root:
            self.toolkit_dir = root
        else:
            # ndanhpc_cli.py is at .agents/scripts/ndanhpc_cli.py
            # parent is .agents/scripts, parent.parent is .agents
            candidate = self.script_dir.parent
            if (candidate / "manifest.json").exists():
                self.toolkit_dir = candidate
            else:
                # Search up from current directory
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
        """Simple, standard library frontmatter extractor."""
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
                    "description": meta.get("description", "No description provided."),
                    "model": meta.get("model", "inherit"),
                    "tools": meta.get("tools", ""),
                    "version": meta.get("version", "1.0.0"),
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
                    "description": meta.get("description", "No description provided."),
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

    @property
    def kit_version(self) -> str:
        return self.manifest.get("kitVersion", "2026.10.10")

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


# ==============================================================================
# View 1: Overview & Architecture
# ==============================================================================

def show_overview(data: ToolkitData) -> None:
    """Display comprehensive overview & architecture of NDANHPC Kit."""
    print(bold(cyan("\n🚀 TỔNG QUAN & KIẾN TRÚC NDANHPC KIT")))
    hr()

    print(f" {bold('Phiên bản Kit (CalVer):')}   {green(data.kit_version)}")
    print(f" {bold('Vị trí Toolkit:')}          {cyan(str(data.toolkit_dir))}")
    print(f" {bold('Thư mục Dự án:')}          {cyan(str(data.project_dir))}")
    print(f" {bold('Trạng thái Khóa:')}          {green('manifest.lock.json Đồng bộ') if data.lock_path.exists() else yellow('Chưa khóa')}")
    print()

    # Metric summary table
    print(bold("📊 THỐNG KÊ TỔNG THỂ HỆ THỐNG:"))
    print(f"  • {bold('Specialist Agents:')}  {green(len(data.agents))} vai trò chuyên môn hóa")
    print(f"  • {bold('Domain Skills:')}     {green(len(data.skills))} kỹ năng tải theo điều kiện (Progressive)")
    print(f"  • {bold('Workflows:')}          {green(len(data.workflows))} quy trình chuẩn với Slash Commands (/command)")
    print(f"  • {bold('Workspace Rules:')}    {green(len(data.rules))} quy tắc bắt buộc (P0 Universal -> P1 -> P2)")
    print(f"  • {bold('Runtime Contracts:')}   {green('Antigravity 6-Phase Contract')} (Discovery, MCP, Hooks, Orchestration, Plugin, Validation)")
    print()

    # Tier Architecture
    print(bold("🏛️ HỆ THỐNG PHÂN CẤP NGUYÊN TẮC (RULE HIERARCHY):"))
    print(f"  {bold(yellow('Tier 0 (P0) Universal Rules:'))}   Luôn kích hoạt ({cyan('.agents/rules/universal-rules.md')})")
    print(f"    └── Protocol cấm code thừa, cấm phỏng đoán, áp dụng Clean Code & AAA testing.")
    print(f"  {bold(cyan('Tier 1 (P1) Specialist Personas:'))} Khi kích hoạt Agent ({cyan('.agents/agent/*.md')})")
    print(f"    └── Phong cách, triết lý, công cụ và kỹ năng gắn liền với từng vai trò chuyên trách.")
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
# View 2: Tra cứu 24 Specialist Agents
# ==============================================================================

def list_agents(data: ToolkitData, non_interactive: bool = False) -> None:
    """Display table of all 24 Specialist Agents with drill-down capability."""
    agents = data.agents
    sorted_names = sorted(agents.keys())

    print(bold(cyan(f"\n🤖 DANH MỤC 24 SPECIALIST AGENTS (NDANHPC KIT v{data.kit_version})")))
    hr()
    print(f"{bold('STT'):<5} {bold('Tên Agent'):<26} {bold('Model'):<10} {bold('Skills'):<8} {bold('Chuyên môn / Mô tả tóm tắt')}")
    hr("-")

    for idx, name in enumerate(sorted_names, 1):
        info = agents[name]
        meta = data.agents_meta.get(name, {})
        model = info.get("model", "inherit")
        skills_req = len(info.get("requires", {}).get("skills", {}))
        desc = meta.get("description", "")
        # Truncate description for table
        desc_short = (desc[:48] + "...") if len(desc) > 51 else desc
        print(f"{cyan(f'[{idx:02d}]'):<5} {bold(name):<26} {yellow(model):<10} {green(str(skills_req)):<8} {desc_short}")

    hr()
    print(f" {dim('Tổng cộng: 24 agents chuyên biệt sẵn sàng cho Multi-Agent Orchestration.')}")

    if non_interactive:
        return

    # Interactive inspection sub-menu
    while True:
        print(f"\n {bold('👉 Nhập số [1-24]')} hoặc {bold('tên agent')} để xem chi tiết | {bold('0')} để quay lại menu:")
        try:
            choice = input(cyan("NDANHPC/agents > ")).strip()
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
        print(f" {bold('Kỹ năng phụ thuộc:')}")
        for sname, s_ver in skills_req.items():
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
            # Skip frontmatter
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


def italic(text: Any) -> str:
    return c(text, Colors.ITALIC)


# ==============================================================================
# View 3: Tra cứu 51 Skills
# ==============================================================================

def list_skills(data: ToolkitData, non_interactive: bool = False) -> None:
    """Display table of all 51 Skills categorized with search capability."""
    skills = data.skills
    sorted_names = sorted(skills.keys())

    print(bold(cyan(f"\n📚 DANH MỤC 51 DOMAIN SKILLS (NDANHPC KIT v{data.kit_version})")))
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
        allowed_short = (allowed[:38] + "...") if len(allowed) > 40 else allowed

        print(f"{cyan(f'[{idx:02d}]'):<5} {bold(name):<28} {yellow(ver):<8} {scripts_tag:<9} {dim(allowed_short)}")

    hr()
    print(f" {dim('Tổng cộng: 51 kỹ năng được tải theo điều kiện when_to_use giúp tối ưu ngữ cảnh.')}")

    if non_interactive:
        return

    # Interactive search & inspection
    while True:
        print(f"\n {bold('👉 Nhập số [1-51]')} hoặc {bold('tên kỹ năng')} để xem chi tiết | {bold('0')} để quay lại menu:")
        try:
            choice = input(cyan("NDANHPC/skills > ")).strip()
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
            show_skill_detail(data, target_name)
        else:
            print(yellow(f"Không tìm thấy kỹ năng phù hợp với '{choice}'."))


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
# View 4: Tra cứu 13 Workflows & Slash Commands
# ==============================================================================

def list_workflows(data: ToolkitData, non_interactive: bool = False) -> None:
    """Display table of all 13 Workflows and slash command guides."""
    workflows = data.workflows
    sorted_names = sorted(workflows.keys())

    print(bold(cyan(f"\n⚡ DANH MỤC 13 WORKFLOWS & SLASH COMMANDS (NDANHPC KIT v{data.kit_version})")))
    hr()
    print(f"{bold('Slash Command'):<18} {bold('Agents Yêu Cầu'):<30} {bold('Artifact Outputs')}")
    hr("-")

    for name in sorted_names:
        info = workflows[name]
        meta = data.workflows_meta.get(name, {})
        req_agents = ", ".join(info.get("requires", {}).get("agents", []))
        if not req_agents:
            req_agents = meta.get("requires_agents", "orchestrator")
        
        artifacts = ", ".join(info.get("artifactOutputs", []))
        if not artifacts:
            artifacts = meta.get("artifact_outputs", "status-report")

        cmd = f"/{name}"
        print(f"{green(cmd):<18} {cyan(req_agents):<30} {dim(artifacts)}")

    hr()
    print(bold("\n💡 HƯỚNG DẪN SỬ DỤNG TRONG GOOGLE ANTIGRAVITY:"))
    print(f"  • Nhập {green('/plan')} [nhiệm vụ]        → Khởi tạo file kế hoạch phân rã {cyan('{task-slug}.md')}")
    print(f"  • Nhập {green('/orchestrate')} [nhiệm vụ] → Phối hợp tối thiểu 3 agents giải quyết bài toán phức tạp")
    print(f"  • Nhập {green('/debug')} [lỗi]           → Điều tra 4 pha khoa học tìm nguyên nhân gốc rễ (Root Cause)")
    print(f"  • Nhập {green('/verify')}                 → Chạy kiểm định 17 tiêu chí toàn diện trước khi bàn giao")
    print(f"  • Nhập {green('/remember')} [thông tin]  → Lưu trữ quyết định hoặc quy ước vào hệ thống MEMORY.md")

    if non_interactive:
        return

    while True:
        print(f"\n {bold('👉 Nhập tên lệnh (ví dụ: orchestrate, plan, verify)')} để xem chi tiết | {bold('0')} để quay lại:")
        try:
            choice = input(cyan("NDANHPC/workflows > ")).strip().lstrip("/")
        except (EOFError, KeyboardInterrupt):
            break

        if not choice or choice in ("0", "q", "exit"):
            break

        matches = [n for n in sorted_names if choice.lower() == n.lower() or choice.lower() in n.lower()]
        if matches:
            show_workflow_detail(data, matches[0])
        else:
            print(yellow(f"Không tìm thấy workflow '/{choice}'."))


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
    print(f" {bold('Agents tham gia:')}     {cyan(', '.join(req_agents) if req_agents else 'orchestrator')}")

    req_skills = info.get("requires", {}).get("skills", [])
    print(f" {bold('Skills kích hoạt:')}    {yellow(', '.join(req_skills) if req_skills else 'Standard')}")

    artifacts = info.get("artifactOutputs", [])
    print(f" {bold('Tài liệu tạo ra:')}     {magenta(', '.join(artifacts) if artifacts else 'None')}")

    desc = meta.get("description", "")
    if desc:
        print(f"\n {bold('Mô tả quy trình:')}")
        print(f"   {desc}")
    hr()


# ==============================================================================
# View 5: Mô phỏng Multi-Agent Orchestration (/orchestrate)
# ==============================================================================

ORCHESTRATION_PRESETS = {
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
            print(f"  [{cyan(str(idx))}] {bold(item['title'])} {dim(f'({key})')}")
        print()

        try:
            sel = input(cyan("Chọn kịch bản [1-5, Enter=1]: ")).strip()
        except (EOFError, KeyboardInterrupt):
            return

        keys = list(ORCHESTRATION_PRESETS.keys())
        if sel.isdigit() and 1 <= int(sel) <= len(keys):
            scenario = ORCHESTRATION_PRESETS[keys[int(sel) - 1]]
        else:
            scenario = ORCHESTRATION_PRESETS["webapp"]

    print(bold(f"\n🎯 KỊCH BẢN ĐÃ CHỌN: {scenario['title']}"))
    print(f" {bold('Lĩnh vực liên quan:')} {magenta(', '.join(scenario['domains']))}")
    
    # Validation: Agent count check
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
# View 6: Antigravity Doctor
# ==============================================================================

def run_doctor(data: ToolkitData) -> int:
    """Execute Antigravity Doctor check."""
    print(bold(cyan("\n🩺 CHẠY KIỂM ĐỊNH ANTIGRAVITY DOCTOR")))
    hr()
    print(f" {dim('Lệnh thực thi:')} {green('npm run check:antigravity')}")
    print()

    cmd = ["npm", "run", "check:antigravity"]
    # Check if npm is available, otherwise run node directly
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
# View 7: Full Verification Suite
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
# View 8: Web Portal Launcher
# ==============================================================================

def launch_web_portal(data: ToolkitData, port: int = 3000) -> None:
    """Launch local Web Portal with HTTP Server."""
    web_dir = data.project_dir / "web"
    if not web_dir.exists():
        web_dir.mkdir(parents=True, exist_ok=True)

    index_html = web_dir / "index.html"
    if not index_html.exists():
        # Create minimal fallback if missing
        index_html.write_text(
            f"<html><head><title>NDANHPC Kit Portal</title></head><body><h1>NDANHPC Kit {data.kit_version}</h1></body></html>",
            encoding="utf-8"
        )

    print(bold(cyan(f"\n🌐 KHỞI CHẠY NDANHPC KIT WEB PORTAL TRÊN CỔNG {port}")))
    hr()
    print(f" {bold('Thư mục phục vụ:')}   {cyan(str(web_dir))}")
    print(f" {bold('Địa chỉ truy cập:')}   {bold(green(f'http://localhost:{port}'))}")
    print(f" {bold('Dừng máy chủ:')}       {yellow('Nhấn Ctrl+C để dừng và quay lại menu')}")
    hr()

    cmd = [sys.executable, "-m", "http.server", str(port), "--directory", str(web_dir)]
    try:
        subprocess.run(cmd, cwd=str(data.project_dir))
    except KeyboardInterrupt:
        print(bold(yellow("\n🛑 Đã dừng Web Portal an toàn.")))
    except Exception as e:
        print(red(f"\nLỗi khi khởi chạy Web Portal: {e}"))


# ==============================================================================
# Interactive TUI Main Menu
# ==============================================================================

def interactive_menu(data: ToolkitData) -> None:
    """Run interactive TUI menu loop."""
    while True:
        banner()
        print(bold("Vui lòng chọn một chức năng bên dưới:"))
        print(f"  {cyan('[1]')} 🚀 {bold('Tổng quan & Kiến trúc NDANHPC Kit')}")
        print(f"  {cyan('[2]')} 🤖 {bold('Tra cứu danh mục 24 Specialist Agents')}")
        print(f"  {cyan('[3]')} 📚 {bold('Tra cứu danh mục 51 Skills')}")
        print(f"  {cyan('[4]')} ⚡ {bold('Tra cứu 13 Workflows & Hướng dẫn Slash Commands')}")
        print(f"  {cyan('[5]')} 🔄 {bold('Mô phỏng luồng Multi-Agent Orchestration (/orchestrate)')}")
        print(f"  {cyan('[6]')} 🩺 {bold('Chạy kiểm định Antigravity Doctor')} {dim('(npm run check:antigravity)')}")
        print(f"  {cyan('[7]')} 🧪 {bold('Chạy Full Verification Suite')} {dim('(npm run verify)')}")
        print(f"  {cyan('[8]')} 🌐 {bold('Khởi chạy Web Portal')} {dim('(python3 -m http.server 3000 --directory web)')}")
        print(f"  {yellow('[0]')} 🚪 {bold('Thoát (Exit)')}")
        hr()

        try:
            choice = input(bold(cyan("NDANHPC > Chọn số [0-8]: "))).strip()
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
            simulate_orchestration(data)
        elif choice == "6":
            run_doctor(data)
        elif choice == "7":
            run_verify(data)
        elif choice == "8":
            launch_web_portal(data, 3000)
        else:
            print(yellow(f"\n⚠️ Lựa chọn '{choice}' không hợp lệ. Vui lòng nhập từ 0 đến 8."))

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
  python3 .agents/scripts/ndanhpc_cli.py --overview    # Xem tổng quan kiến trúc
  python3 .agents/scripts/ndanhpc_cli.py --agents      # Tra cứu 24 Specialist Agents
  python3 .agents/scripts/ndanhpc_cli.py --skills      # Tra cứu 51 Skills
  python3 .agents/scripts/ndanhpc_cli.py --workflows   # Tra cứu 13 Workflows
  python3 .agents/scripts/ndanhpc_cli.py --simulate webapp  # Mô phỏng điều phối
  python3 .agents/scripts/ndanhpc_cli.py --doctor      # Kiểm định Antigravity Doctor
  python3 .agents/scripts/ndanhpc_cli.py --verify      # Kiểm định chất lượng toàn diện
"""
    )

    parser.add_argument("--overview", action="store_true", help="Hiển thị tổng quan & kiến trúc NDANHPC Kit")
    parser.add_argument("--agents", action="store_true", help="Liệt kê danh mục 24 Specialist Agents")
    parser.add_argument("--skills", action="store_true", help="Liệt kê danh mục 51 Skills")
    parser.add_argument("--workflows", action="store_true", help="Liệt kê danh mục 13 Workflows & Slash Commands")
    parser.add_argument("--simulate", nargs="?", const="webapp", help="Mô phỏng điều phối Multi-Agent (webapp, fullstack, api, security, debug)")
    parser.add_argument("--doctor", action="store_true", help="Chạy kiểm định Antigravity Doctor (npm run check:antigravity)")
    parser.add_argument("--verify", action="store_true", help="Chạy Full Verification Suite (npm run verify)")
    parser.add_argument("--web", nargs="?", type=int, const=3000, help="Khởi chạy Web Portal trên cổng chỉ định (mặc định: 3000)")
    parser.add_argument("--root", type=Path, help="Đường dẫn tuỳ biến tới thư mục .agents")

    args = parser.parse_args()
    data = ToolkitData(root=args.root)

    # Check non-interactive options
    if args.overview:
        show_overview(data)
        return 0
    if args.agents:
        list_agents(data, non_interactive=True)
        return 0
    if args.skills:
        list_skills(data, non_interactive=True)
        return 0
    if args.workflows:
        list_workflows(data, non_interactive=True)
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
