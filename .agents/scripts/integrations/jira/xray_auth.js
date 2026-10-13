/**
 * Xray Authentication - Lấy Token của Xray
 *
 * Xray sử dụng OAuth-style token với Client ID + Client Secret.
 * Token có thời hạn, cần refresh định kỳ.
 *
 * Hỗ trợ:
 *   - Xray Cloud (Jira Cloud marketplace app)
 *   - Xray Server / Data Center (self-hosted)
 *
 * Sử dụng:
 *   node xray_auth.js             # Lấy token mới
 *   node xray_auth.js --verify    # Verify token hiện tại
 */

const axios = require('axios');
const path = require('path');
const {
  loadEnv,
  validateEnvVars,
  log,
  saveJsonToFile,
  readJsonFile,
} = require('./utils');

// Load environment
loadEnv();

// Xray Cloud API endpoint
const XRAY_CLOUD_AUTH_URL = 'https://xray.cloud.getxray.app/api/v2/authenticate';

// Xray Server endpoints
const XRAY_SERVER_AUTH_URL_SUFFIX = '/rest/raven/2.0/api/token';

// Path lưu token cache
const TOKEN_CACHE_PATH = path.resolve(__dirname, '.xray_token_cache.json');

/**
 * Lấy Xray Cloud token bằng Client ID + Client Secret
 * @returns {string} JWT token
 */
async function getXrayCloudToken() {
  validateEnvVars(['XRAY_CLIENT_ID', 'XRAY_CLIENT_SECRET']);

  log('LOG', 'Đang xác thực với Xray Cloud...');

  // Kiểm tra cache
  const cached = readTokenCache();
  if (cached) {
    log('LOG', 'Sử dụng token từ cache.');
    return cached;
  }

  try {
    const response = await axios.post(
      XRAY_CLOUD_AUTH_URL,
      {
        client_id: process.env.XRAY_CLIENT_ID,
        client_secret: process.env.XRAY_CLIENT_SECRET,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const token = response.data;

    if (typeof token !== 'string') {
      log('ERROR', 'Xray trả về token không hợp lệ.');
      return null;
    }

    // Cache token (hết hạn sau 1 giờ theo Xray docs)
    saveTokenCache(token, 3600);

    log('LOG', 'Xác thực Xray Cloud thành công!');
    return token;
  } catch (error) {
    handleXrayAuthError(error);
    return null;
  }
}

/**
 * Lấy Xray Server token (PAT-based, không cần OAuth)
 * Xray Server/DC sử dụng chung xác thực với Jira Server
 * @returns {string} Bearer token hoặc Basic Auth
 */
function getXrayServerAuth() {
  const jiraBaseUrl = process.env.JIRA_BASE_URL;
  const pat = process.env.JIRA_PAT;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!jiraBaseUrl) {
    log('ERROR', 'JIRA_BASE_URL chưa được cấu hình.');
    return null;
  }

  if (pat) {
    return { type: 'bearer', token: pat };
  } else if (email && apiToken) {
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    return { type: 'basic', token: auth };
  }

  log('ERROR', 'Thiếu thông tin xác thực cho Xray Server.');
  return null;
}

/**
 * Xây dựng headers cho Xray API calls
 * @param {string} platform - 'cloud' hoặc 'server'
 * @param {string} token - Token đã lấy được
 * @returns {object}
 */
function buildXrayHeaders(platform, token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (platform === 'cloud') {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Server/DC
    if (token.type === 'bearer') {
      headers['Authorization'] = `Bearer ${token.token}`;
    } else {
      headers['Authorization'] = `Basic ${token.token}`;
    }
  }

  return headers;
}

/**
 * Verify token còn hợp lệ bằng cách gọi API ping
 * @param {string} platform - 'cloud' hoặc 'server'
 * @param {string} token
 * @returns {boolean}
 */
async function verifyToken(platform, token) {
  try {
    if (platform === 'cloud') {
      // Xray Cloud: thử lấy GraphQL endpoint
      await axios.get('https://xray.cloud.getxray.app/api/v2/graphql', {
        headers: buildXrayHeaders('cloud', token),
      });
    } else {
      // Xray Server: thử lấy test list
      const baseUrl = process.env.JIRA_BASE_URL.replace(/\/+$/, '');
      await axios.get(`${baseUrl}/rest/raven/2.0/api/test`, {
        headers: buildXrayHeaders('server', token),
        params: { limit: 1 },
      });
    }
    log('LOG', 'Token hợp lệ ✓');
    return true;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      log('WARN', 'Token không hợp lệ hoặc đã hết hạn ✗');
      return false;
    }
    // Các lỗi khác (network, 404...) không nhất thiết token sai
    log('WARN', `Không xác nhận được token: ${error.message}`);
    return false;
  }
}

// ============ Token Cache ============

function saveTokenCache(token, expiresInSeconds) {
  const data = {
    token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
    createdAt: new Date().toISOString(),
  };
  saveJsonToFile(TOKEN_CACHE_PATH, data);
}

function readTokenCache() {
  const cached = readJsonFile(TOKEN_CACHE_PATH);
  if (!cached) return null;

  // Kiểm tra hết hạn (trừ đi 5 phút buffer)
  if (Date.now() > cached.expiresAt - 5 * 60 * 1000) {
    log('LOG', 'Token cache đã hết hạn, cần lấy mới.');
    return null;
  }

  return cached.token;
}

// ============ Error Handling ============

function handleXrayAuthError(error) {
  if (error.response) {
    const status = error.response.status;
    log('ERROR', `Xray Auth HTTP ${status}`);
    if (status === 401 || status === 403) {
      log('ERROR', 'XRAY_CLIENT_ID hoặc XRAY_CLIENT_SECRET không đúng.');
      log('ERROR', 'Kiểm tra lại tại: https://app.getxray.app → API Keys');
    } else {
      log('ERROR', `Response: ${JSON.stringify(error.response.data)}`);
    }
  } else {
    log('ERROR', `Network error: ${error.message}`);
  }
}

// ============ CLI ============

async function main() {
  const args = process.argv.slice(2);
  const platform = process.env.XRAY_PLATFORM || 'cloud';

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║             XRAY AUTHENTICATION - Antigravity               ║
║          Lấy và quản lý Xray API Token                      ║
╚══════════════════════════════════════════════════════════════╝
`);
  console.log(`Platform: ${platform}`);

  let token;

  if (platform === 'cloud') {
    token = await getXrayCloudToken();
  } else {
    token = getXrayServerAuth();
  }

  if (!token) {
    log('ERROR', 'Không lấy được token. Kiểm tra lại cấu hình .env');
    process.exit(1);
  }

  if (args.includes('--verify')) {
    const valid = await verifyToken(platform, token);
    process.exit(valid ? 0 : 1);
  }

  if (platform === 'cloud') {
    console.log('\n--- Xray Cloud Token ---');
    console.log(`Token (first 20 chars): ${token.substring(0, 20)}...`);
    console.log('Token đầy đủ đã được cache.');
  } else {
    console.log('\n--- Xray Server Auth ---');
    console.log(`Type: ${token.type}`);
    console.log('Auth đã sẵn sàng.');
  }
}

// Export
module.exports = {
  getXrayCloudToken,
  getXrayServerAuth,
  buildXrayHeaders,
  verifyToken,
};

// CLI
if (require.main === module) {
  main().catch((err) => {
    log('ERROR', `Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
