#!/usr/bin/env node
// ==============================================================================
// NDANHPC Kit - Unified Remote CLI (npx / npm)
// Repository: https://github.com/ducanhfw4802/ndanhpc-kit
//
// Usage:
//   npx ndanhpc-kit init         # Install kit into current project
//   npx ndanhpc-kit update       # Update kit to the latest version
//   npx ndanhpc-kit check        # Check local and remote version
//   npx ndanhpc-kit web          # Start interactive Web Portal
//   npx ndanhpc-kit tui          # Open Terminal TUI Dashboard
//   npx ndanhpc-kit doctor       # Run Antigravity Doctor check
//   npx ndanhpc-kit uninstall    # Remove kit from current project
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync, execSync } from 'node:child_process';
import https from 'node:https';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = process.cwd();

const REPO_OWNER = 'ducanhfw4802';
const REPO_NAME = 'ndanhpc-kit';
const REPO_BRANCH = 'main';
const RAW_BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}`;
const TARBALL_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/heads/${REPO_BRANCH}.tar.gz`;

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[1;31m',
  green: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[1;34m',
  cyan: '\x1b[1;36m',
  orange: '\x1b[38;5;208m'
};

function banner() {
  console.log(`\n${colors.orange}  _   _ ____    _    _   _ _   _ ____   ____   _  ___ _   ${colors.reset}`);
  console.log(`${colors.orange} | \\ | |  _ \\  / \\  | \\ | | | | |  _ \\ / ___| | |/ (_) |_ ${colors.reset}`);
  console.log(`${colors.orange} |  \\| | | | |/ _ \\ |  \\| | |_| | |_) | |     | ' /| | __|${colors.reset}`);
  console.log(`${colors.orange} | |\\  | |_| / ___ \\| |\\  |  _  |  __/| |___  | . \\| | |_ ${colors.reset}`);
  console.log(`${colors.orange} |_| \\_|____/_/   \\_\\_| \\_|_| |_|_|    \\____| |_|\\_\\_|\\__|${colors.reset}\n`);
  console.log(` ${colors.bold}${colors.orange}⚡ NDANHPC KIT${colors.reset} ${colors.dim}•${colors.reset} ${colors.bold}Antigravity-Native AI Agent Capability Toolkit${colors.reset}`);
  console.log(` ${colors.dim}Remote CLI Runner (npx & npm) · CalVer Edition${colors.reset}`);
  console.log(`────────────────────────────────────────────────────────────────────────\n`);
}

function prompt(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function getLocalVersion() {
  const vPath = path.join(TARGET_DIR, '.agents', 'VERSION');
  if (fs.existsSync(vPath)) {
    return fs.readFileSync(vPath, 'utf8').trim();
  }
  return null;
}

function getRemoteVersion() {
  return new Promise(resolve => {
    https.get(`${RAW_BASE_URL}/.agents/VERSION`, res => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => resolve(null));
  });
}

function copyRecursive(src, dest) {
  fs.cpSync(src, dest, { recursive: true, verbatimSymlinks: true });
}

async function downloadAndExtractAgents(targetAgentsDir) {
  const tmpDir = path.join(TARGET_DIR, '.tmp_ndanhpc_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  const tarFile = path.join(tmpDir, 'kit.tar.gz');

  try {
    // Check if package has bundled .agents
    const bundledAgents = path.join(PACKAGE_ROOT, '.agents');
    if (fs.existsSync(bundledAgents) && fs.existsSync(path.join(bundledAgents, 'VERSION'))) {
      copyRecursive(bundledAgents, targetAgentsDir);
      return true;
    }

    // Fallback: download archive from GitHub
    console.log(`${colors.cyan}ℹ Đang tải bản phát hành mới nhất từ GitHub (${REPO_OWNER}/${REPO_NAME})...${colors.reset}`);
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(tarFile);
      const req = https.get(TARBALL_URL, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          https.get(res.headers.location, redirectRes => {
            redirectRes.pipe(file);
            file.on('finish', () => { file.close(resolve); });
          }).on('error', reject);
        } else {
          res.pipe(file);
          file.on('finish', () => { file.close(resolve); });
        }
      });
      req.on('error', reject);
    });

    console.log(`${colors.cyan}ℹ Đang giải nén bộ não AI khép kín (.agents/)...${colors.reset}`);
    execSync(`tar -xzf "${tarFile}" -C "${tmpDir}"`, { stdio: 'inherit' });
    const extractedDir = path.join(tmpDir, `${REPO_NAME}-${REPO_BRANCH}`, '.agents');
    if (!fs.existsSync(extractedDir)) {
      throw new Error('Gói tải về không chứa thư mục .agents hợp lệ.');
    }
    copyRecursive(extractedDir, targetAgentsDir);
    return true;
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

async function cmdInit() {
  banner();
  const currentVer = getLocalVersion();
  const targetAgents = path.join(TARGET_DIR, '.agents');

  if (currentVer) {
    console.log(`${colors.yellow}⚠ NDANHPC Kit đã tồn tại (Phiên bản v${currentVer}) tại:${colors.reset} ${targetAgents}`);
    const ans = await prompt(`Bạn có muốn cập nhật lên bản mới nhất không? (y/n, mặc định y): `);
    if (ans.toLowerCase() === 'y' || ans.toLowerCase() === 'yes' || ans === '') {
      await cmdUpdate();
    } else {
      console.log(`${colors.cyan}ℹ Đã giữ nguyên phiên bản hiện tại.${colors.reset}`);
    }
    return;
  }

  console.log(`${colors.cyan}ℹ Thư mục đích:${colors.reset} ${TARGET_DIR}`);
  console.log(`${colors.cyan}ℹ Đang tiến hành cài đặt .agents/ vào dự án...${colors.reset}`);

  try {
    await downloadAndExtractAgents(targetAgents);
    const installedVer = getLocalVersion() || 'mới nhất';
    console.log(`\n${colors.green}✔ Cài đặt NDANHPC Kit v${installedVer} thành công!${colors.reset}`);

    // Run verification if python3 is present
    const validatorPath = path.join(targetAgents, 'scripts', 'validate_kit.py');
    if (fs.existsSync(validatorPath)) {
      try {
        execSync(`python3 "${validatorPath}"`, { stdio: 'pipe' });
        console.log(`${colors.green}✔ Kiểm định toàn vẹn cấu trúc: 100% SẴN SÀNG.${colors.reset}`);
      } catch {}
    }

    console.log(`\n${colors.bold}${colors.green}🎉 CHÚC MỪNG! DỰ ÁN CỦA BẠN ĐÃ SỞ HỮU TRỌN BỘ 121 THÀNH PHẦN AI AGENTS.${colors.reset}`);
    console.log(`Cách sử dụng nhanh:`);
    console.log(`  • ${colors.cyan}npx ndanhpc-kit tui${colors.reset}         # Mở bảng điều khiển Terminal TUI`);
    console.log(`  • ${colors.cyan}npx ndanhpc-kit web${colors.reset}         # Mở Cổng thông tin Web Portal trực quan`);
    console.log(`  • ${colors.cyan}npx ndanhpc-kit doctor${colors.reset}      # Kiểm định Antigravity Readiness`);
    console.log(`  • ${colors.cyan}npx ndanhpc-kit update${colors.reset}      # Cập nhật khi có bản phát hành mới\n`);
  } catch (err) {
    console.error(`${colors.red}✖ Lỗi khi cài đặt: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

async function cmdUpdate() {
  banner();
  const currentVer = getLocalVersion();
  const targetAgents = path.join(TARGET_DIR, '.agents');

  if (!currentVer) {
    console.log(`${colors.yellow}⚠ Chưa phát hiện thư mục .agents/ trong dự án hiện tại: ${TARGET_DIR}${colors.reset}`);
    const ans = await prompt(`Bạn có muốn tiến hành cài mới không? (y/n, mặc định y): `);
    if (ans.toLowerCase() === 'y' || ans.toLowerCase() === 'yes' || ans === '') {
      await cmdInit();
    }
    return;
  }

  console.log(`${colors.cyan}ℹ Phiên bản hiện tại trên máy:${colors.reset} ${colors.yellow}v${currentVer}${colors.reset}`);
  console.log(`${colors.cyan}ℹ Đang kiểm tra phiên bản mới nhất trên GitHub...${colors.reset}`);
  const remoteVer = await getRemoteVersion();

  if (remoteVer && remoteVer === currentVer) {
    console.log(`${colors.green}✔ Bạn đang ở phiên bản mới nhất (v${currentVer}). Không cần cập nhật!${colors.reset}`);
    const ans = await prompt(`Bạn có muốn buộc cài đặt lại (force refresh) không? (y/n, mặc định n): `);
    if (ans.toLowerCase() !== 'y' && ans.toLowerCase() !== 'yes') {
      return;
    }
  }

  console.log(`${colors.bold}${colors.cyan}Bắt đầu cập nhật: v${currentVer} ➔ v${remoteVer || 'mới nhất'}${colors.reset}`);

  // Backup memory if exists
  const memoryDir = path.join(targetAgents, 'memory');
  const tmpBackup = path.join(TARGET_DIR, '.agents_memory_tmp');
  if (fs.existsSync(memoryDir)) {
    copyRecursive(memoryDir, tmpBackup);
  }

  // Backup entire .agents
  const bakDir = path.join(TARGET_DIR, '.agents.bak');
  try {
    fs.rmSync(bakDir, { recursive: true, force: true });
    copyRecursive(targetAgents, bakDir);
  } catch {}

  try {
    await downloadAndExtractAgents(targetAgents);
    // Restore memory
    if (fs.existsSync(tmpBackup)) {
      copyRecursive(tmpBackup, memoryDir);
      fs.rmSync(tmpBackup, { recursive: true, force: true });
    }

    const updatedVer = getLocalVersion();
    console.log(`\n${colors.green}✔ Cập nhật thành công lên NDANHPC Kit v${updatedVer}!${colors.reset}`);
    console.log(`${colors.dim}Bản sao lưu trước khi cập nhật được lưu tạm tại '.agents.bak/'.${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}✖ Lỗi khi cập nhật: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

async function cmdCheck() {
  const currentVer = getLocalVersion();
  const remoteVer = await getRemoteVersion();

  console.log(`\n────────────────────────────────────────────────────────`);
  console.log(`  • Phiên bản trên máy hiện tại  : ${colors.cyan}v${currentVer || 'Chưa cài đặt'}${colors.reset}`);
  console.log(`  • Phiên bản mới nhất trên GitHub: ${colors.green}v${remoteVer || 'Không xác định'}${colors.reset}`);
  if (currentVer && remoteVer && currentVer === remoteVer) {
    console.log(`  • Trạng thái                     : ${colors.green}Đang ở bản mới nhất ✔${colors.reset}`);
  } else if (currentVer) {
    console.log(`  • Trạng thái                     : ${colors.yellow}Có bản cập nhật mới!${colors.reset} Chạy: npx ndanhpc-kit update`);
  } else {
    console.log(`  • Trạng thái                     : ${colors.red}Chưa cài đặt${colors.reset}. Chạy: npx ndanhpc-kit init`);
  }
  console.log(`────────────────────────────────────────────────────────\n`);
}

async function cmdDoctor() {
  const doctorScript = path.join(TARGET_DIR, '.agents', 'hooks', 'antigravity-doctor.mjs');
  const fallbackDoctor = path.join(PACKAGE_ROOT, '.agents', 'hooks', 'antigravity-doctor.mjs');
  const targetScript = fs.existsSync(doctorScript) ? doctorScript : fallbackDoctor;

  if (fs.existsSync(targetScript)) {
    spawnSync('node', [targetScript], { stdio: 'inherit', cwd: TARGET_DIR });
  } else {
    console.error(`${colors.red}✖ Không tìm thấy script antigravity-doctor.mjs. Hãy chạy 'npx ndanhpc-kit init' trước.${colors.reset}`);
  }
}

async function cmdWeb() {
  const webDir = path.join(TARGET_DIR, 'web');
  const fallbackWeb = path.join(PACKAGE_ROOT, 'web');
  const targetWeb = fs.existsSync(webDir) ? webDir : fallbackWeb;

  if (!fs.existsSync(targetWeb)) {
    console.error(`${colors.red}✖ Không tìm thấy thư mục web portal. Đang khởi tạo...${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}🌐 Đang khởi chạy NDANHPC Kit Web Portal tại http://localhost:3000 ...${colors.reset}`);
  console.log(`${colors.dim}Nhấn Ctrl+C để dừng server.${colors.reset}`);
  spawnSync('python3', ['-m', 'http.server', '3000', '--directory', targetWeb], { stdio: 'inherit' });
}

async function cmdTui() {
  const tuiScript = path.join(TARGET_DIR, '.agents', 'scripts', 'ndanhpc_cli.py');
  const fallbackTui = path.join(PACKAGE_ROOT, '.agents', 'scripts', 'ndanhpc_cli.py');
  const targetTui = fs.existsSync(tuiScript) ? tuiScript : fallbackTui;

  if (fs.existsSync(targetTui)) {
    spawnSync('python3', [targetTui], { stdio: 'inherit', cwd: TARGET_DIR });
  } else {
    console.error(`${colors.red}✖ Không tìm thấy script ndanhpc_cli.py. Hãy chạy 'npx ndanhpc-kit init' trước.${colors.reset}`);
  }
}

async function cmdUninstall() {
  banner();
  const currentVer = getLocalVersion();
  const targetAgents = path.join(TARGET_DIR, '.agents');

  if (!currentVer && !fs.existsSync(targetAgents)) {
    console.log(`${colors.yellow}⚠ Không tìm thấy thư mục .agents/ trong dự án hiện tại.${colors.reset}`);
    return;
  }

  console.log(`${colors.red}${colors.bold}CẢNH BÁO: Thao tác này sẽ gỡ bỏ hoàn toàn thư mục .agents/ khỏi dự án của bạn.${colors.reset}`);
  const ans = await prompt(`Bạn có chắc chắn muốn gỡ bỏ NDANHPC Kit v${currentVer || ''}? (yes/no): `);
  if (ans.toLowerCase() !== 'yes' && ans.toLowerCase() !== 'y') {
    console.log(`${colors.yellow}Đã hủy thao tác gỡ bỏ.${colors.reset}`);
    return;
  }

  try {
    fs.rmSync(targetAgents, { recursive: true, force: true });
    const bakDir = path.join(TARGET_DIR, '.agents.bak');
    if (fs.existsSync(bakDir)) {
      fs.rmSync(bakDir, { recursive: true, force: true });
    }
    console.log(`\n${colors.green}✔ Đã gỡ bỏ hoàn toàn NDANHPC Kit khỏi: ${TARGET_DIR}${colors.reset}\n`);
  } catch (err) {
    console.error(`${colors.red}✖ Lỗi khi gỡ bỏ: ${err.message}${colors.reset}`);
  }
}

function showHelp() {
  banner();
  console.log(`Lệnh khả dụng:\n`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit init${colors.reset}       Cài đặt trọn gói thư mục .agents/ vào dự án hiện tại`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit update${colors.reset}     Cập nhật kit lên phiên bản mới nhất từ GitHub`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit check${colors.reset}      Kiểm tra phiên bản hiện tại vs mới nhất`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit doctor${colors.reset}     Chạy kiểm định Antigravity Doctor`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit web${colors.reset}        Khởi chạy Web Portal tương tác trên cổng 3000`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit tui${colors.reset}        Khởi chạy Terminal TUI Dashboard`);
  console.log(`  ${colors.cyan}npx ndanhpc-kit uninstall${colors.reset}  Gỡ bỏ hoàn toàn bộ kit khỏi dự án\n`);
  console.log(`Cài đặt toàn cục (Global CLI):`);
  console.log(`  ${colors.dim}npm install -g ndanhpc-kit${colors.reset}`);
  console.log(`  ${colors.dim}ndanhpc-kit init${colors.reset}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'init';

  switch (command) {
    case 'init':
    case 'install':
    case 'add':
      await cmdInit();
      break;
    case 'update':
    case 'upgrade':
      await cmdUpdate();
      break;
    case 'check':
    case 'status':
    case 'version':
    case '-v':
    case '--version':
      await cmdCheck();
      break;
    case 'doctor':
      await cmdDoctor();
      break;
    case 'web':
      await cmdWeb();
      break;
    case 'tui':
    case 'cli':
      await cmdTui();
      break;
    case 'uninstall':
    case 'remove':
    case 'delete':
      await cmdUninstall();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.error(`${colors.red}✖ Lệnh không hợp lệ: '${command}'${colors.reset}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(`Lỗi nghiêm trọng:`, err);
  process.exit(1);
});
