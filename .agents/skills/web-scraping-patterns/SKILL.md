---
name: web-scraping-patterns
description: Production-grade web scraping, crawling, and anti-bot evasion. Headless browser automation (Playwright/Puppeteer), fingerprint spoofing, proxy rotation, rate limiting, HTML parsing with BeautifulSoup/Cheerio, and structured data extraction.
when_to_use: "When writing web scrapers, crawlers, or data extraction scripts, bypassing bot protections (Cloudflare, Akamai), managing proxies, or parsing unstructured HTML."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Web Scraping & Crawler Engineering Patterns

> Production-grade strategies for web extraction, anti-bot bypass, browser fingerprinting management, proxy rotation, and resilient parsing.

---

## 🎯 When to Use This Skill

- Building scalable **Web Scrapers**, **Crawlers**, or **Data Harvesting Pipelines**
- Extracting data from single-page applications (SPAs) using **Playwright** or **Puppeteer**
- Overcoming **Anti-Bot Defenses** (Cloudflare Turnstile, Datadome, Akamai, PerimeterX)
- Parsing high-volume HTML with ultra-fast native parsers (**Selectolax**, **Cheerio**, **BeautifulSoup**)
- Implementing **Proxy Rotation** (Residential / Mobile) and intelligent **Rate Limiting**
- Normalizing, validating, and streaming extracted data into **JSONL / SQLite / PostgreSQL**

---

## 🛠️ 1. Scraping Engine Selection Matrix

| Engine | Best For | Speed | Memory | JS Rendering |
| :--- | :--- | :--- | :--- | :--- |
| **`httpx` + `selectolax`** (Python) | High-throughput static HTML, public APIs | ⚡ 1000+ req/s | Very Low | ❌ No |
| **`playwright-stealth`** (Python / TS) | Heavy JavaScript, protected targets, logins | 🐢 10-50 req/s | High | ✅ Full |
| **`Crawlee`** (Node.js / Python) | Enterprise multi-tier crawling, auto-queues | 🚀 Balanced | Medium | ✅ Adaptive |
| **`Scrapy`** (Python) | Large-scale asynchronous catalog scraping | ⚡ 200+ req/s | Low | ⚠️ With plugin |

---

## 🕵️ 2. Anti-Detection & Fingerprint Evasion

### 2.1 Critical Fingerprint Vectors
Modern WAFs (Cloudflare, Datadome) inspect:
1. **`navigator.webdriver` flag**: Must be deleted or spoofed.
2. **TLS / JA4 Fingerprint**: Standard Python `requests` or `urllib` reveals standard cipher suites immediately. Use `curl_cffi` or real browser contexts.
3. **Canvas & WebGL noise**: Slight random noise per session to prevent device fingerprint hashing.
4. **Headers & Client Hints**: `Sec-Ch-Ua`, `Sec-Ch-Ua-Mobile`, `Sec-Ch-Ua-Platform` must match the User-Agent OS/Architecture exactly.

### 2.2 Hardened Playwright Launch Pattern (Python)

```python
import asyncio
from playwright.async_api import async_playwright

async def create_stealth_browser():
    p = await async_playwright().start()
    browser = await p.chromium.launch(
        headless=True,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--disable-features=IsolateOrigins,site-per-process",
            "--no-sandbox",
        ]
    )
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080},
        locale="en-US",
        timezone_id="America/New_York",
    )
    # Mask webdriver property
    await context.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        window.chrome = { runtime: {} };
    """)
    return p, browser, context
```

---

## 🌐 3. Proxy Rotation & Resilient Rate Limiting

### 3.1 Proxy Types

| Type | Cost | Detectability | Use Case |
| :--- | :--- | :--- | :--- |
| **Datacenter** | Low | High | Unprotected sites, APIs |
| **Residential** | Medium-High | Low | Cloudflare Turnstile, e-commerce |
| **Mobile 4G/5G** | Very High | Extremely Low | Social networks, strict fraud engines |

### 3.2 Token Bucket Rate Limiter with Jitter
Never scrape at fixed periodic intervals (e.g. exactly every 1000ms):

```python
import asyncio
import random

async def throttled_request(url: str, session, base_delay: float = 1.5):
    # Add randomized jitter (+/- 40%)
    jitter = base_delay * random.uniform(0.6, 1.4)
    await asyncio.sleep(jitter)
    
    timeout = 15.0
    response = await session.get(url, timeout=timeout)
    if response.status_code == 429:
        retry_after = int(response.headers.get("Retry-After", 30))
        await asyncio.sleep(retry_after)
        return await session.get(url, timeout=timeout)
    return response
```

---

## 📑 4. Robust Extraction & Schema Validation

### 4.1 Fallback Selector Chains
Never rely on a single brittle CSS class that may change during frontend builds:

```python
from selectolax.parser import HTMLParser

def extract_product_price(parser: HTMLParser) -> float:
    # Try multiple selectors in order of specificity
    candidates = [
        'span[data-testid="product-price"]',
        '.price-display__value',
        'meta[property="product:price:amount"]::attr(content)',
        'span.amount',
    ]
    for sel in candidates:
        if "::attr(" in sel:
            css, attr = sel.split("::attr(")
            node = parser.css_first(css)
            if node and node.attributes.get(attr.rstrip(")")):
                return parse_price(node.attributes.get(attr.rstrip(")")))
        else:
            node = parser.css_first(sel)
            if node and node.text(strip=True):
                return parse_price(node.text(strip=True))
    raise ValueError("Price not found using selector fallbacks")
```

---

## ⚖️ 5. Crawler Etiquette & Best Practices

- [ ] Always configure strict timeouts (`timeout=15.0`) on all HTTP calls
- [ ] Implement exponential backoff for HTTP `429` (Too Many Requests) and `503`
- [ ] Save data progressively (Streaming JSON Lines `jsonl`) to prevent memory exhaustion
- [ ] Avoid scraping personal identifiable information (PII) unless explicitly authorized
