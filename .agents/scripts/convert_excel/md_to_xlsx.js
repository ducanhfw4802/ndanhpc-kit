/**
 * Script: md_to_xlsx.js
 * Mô tả:  Convert file Markdown Test Cases sang Excel (.xlsx) có format đẹp.
 * Cách dùng:
 *   node scripts/md_to_xlsx.js <input.md> [output.xlsx]
 *
 * Yêu cầu: npm install xlsx   (hoặc chạy 1 lần: npm i xlsx --save-dev)
 */

const fs = require("fs");
const path = require("path");

let XLSX;
try {
  XLSX = require("xlsx");
} catch {
  console.error("❌ Thiếu thư viện xlsx. Cài đặt bằng lệnh:");
  console.error("   npm install xlsx");
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Remove emoji characters */
function stripEmoji(text) {
  return text.replace(/[\u{1F534}\u{1F7E1}\u{1F7E2}\u2705\u274C\u{1F525}]/gu, "").trim();
}

/** Convert <br> → newline, strip backticks & emoji */
function cleanCell(text) {
  let out = text.replace(/<br>/gi, "\n");
  out = out.replace(/`([^`]*)`/g, "$1"); // remove inline code markers
  return stripEmoji(out).trim();
}

/** Detect risk level from cell text */
function detectRisk(text) {
  const l = text.toLowerCase();
  if (l.includes("high")) return "high";
  if (l.includes("medium")) return "medium";
  if (l.includes("low")) return "low";
  return "";
}

/** Detect priority from cell text */
function detectPriority(text) {
  const l = text.toLowerCase();
  for (const p of ["critical", "high", "medium", "low"]) {
    if (l.includes(p)) return p;
  }
  return "";
}

// ── Parse Markdown tables ──────────────────────────────────────────────────

function parseMdTables(filepath) {
  const content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n");

  const tables = [];
  let currentTable = null;
  let headerFound = false;

  for (const line of lines) {
    const stripped = line.trim();

    // Detect header row of a test-case table
    if (stripped.startsWith("|") && stripped.includes("TC ID")) {
      headerFound = true;
      currentTable = [];
      continue;
    }

    // Skip separator row (|---|---|…)
    if (headerFound && /^\|[\s\-|]+\|$/.test(stripped)) {
      headerFound = false;
      continue;
    }

    // Data rows
    if (currentTable !== null && stripped.startsWith("|")) {
      const cells = stripped
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.length > 0) {
        currentTable.push(cells);
      }
    } else if (currentTable !== null && !stripped.startsWith("|")) {
      if (currentTable.length > 0) {
        tables.push(currentTable);
      }
      currentTable = null;
    }
  }

  // Flush last table
  if (currentTable && currentTable.length > 0) {
    tables.push(currentTable);
  }

  return tables;
}

// ── Build Excel ────────────────────────────────────────────────────────────

function buildXlsx(tables, outputPath) {
  const headers = [
    "TC ID",
    "Module",
    "Risk Level",
    "Test Title",
    "Pre-Condition",
    "Test Steps",
    "Expected Result",
    "Priority",
    "Test Data",
  ];

  const colWidths = [22, 22, 14, 50, 35, 60, 60, 12, 40];

  // Collect all rows
  const allRows = [];
  for (const table of tables) {
    for (const row of table) {
      const cleaned = [];
      for (let i = 0; i < 9; i++) {
        cleaned.push(cleanCell(row[i] || ""));
      }
      allRows.push(cleaned);
    }
  }

  // Build worksheet data (header + data rows)
  const wsData = [headers, ...allRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ── Column widths ──────────────────────────────────────────────────────
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));

  // ── Freeze top row ─────────────────────────────────────────────────────
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", state: "frozen" };

  // ── AutoFilter ─────────────────────────────────────────────────────────
  ws["!autofilter"] = { ref: `A1:I${allRows.length + 1}` };

  // ── Create workbook & save ─────────────────────────────────────────────
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
  XLSX.writeFile(wb, outputPath);

  return allRows.length;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Cách dùng: node scripts/md_to_xlsx.js <input.md> [output.xlsx]");
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File không tồn tại: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = args[1]
    ? path.resolve(args[1])
    : inputPath.replace(/\.md$/i, ".xlsx");

  console.log(`📖 Đang đọc: ${inputPath}`);
  const tables = parseMdTables(inputPath);

  if (tables.length === 0) {
    console.error("❌ Không tìm thấy bảng Test Cases nào trong file markdown.");
    process.exit(1);
  }

  const totalRows = tables.reduce((sum, t) => sum + t.length, 0);
  console.log(`📊 Tìm thấy ${tables.length} bảng, tổng ${totalRows} test cases`);

  const count = buildXlsx(tables, outputPath);
  console.log(`✅ Đã xuất ${count} test cases → ${outputPath}`);
}

main();
