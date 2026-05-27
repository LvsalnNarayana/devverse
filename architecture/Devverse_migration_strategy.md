# JSON File Migration Strategy: Public Folder → CDN

## Development to Production Transition Plan

---

## 🎯 Yes, Absolutely! This is a Great Approach

Starting with the public folder during development is **recommended** and allows for:

- ✅ Faster iteration (no CDN upload needed)
- ✅ Simpler local development
- ✅ Easy testing and debugging
- ✅ No CDN costs during development
- ✅ Smooth migration path to production

---

## 📐 Three-Stage Migration Strategy

```
Stage 1: Development (Public Folder)
         ↓
Stage 2: Staging (Test CDN Integration)
         ↓
Stage 3: Production (Full CDN)
```

---

## Stage 1: Development Setup (Public Folder)

### Directory Structure

```
project/
├── public/
│   └── configs/
│       ├── algorithms/
│       │   ├── binarySearch.json
│       │   ├── bfs.json
│       │   ├── dfs-graph.json
│       │   ├── dfs-tree.json
│       │   ├── dfs-matrix.json
│       │   └── ... (95 more)
│       └── references/
│           ├── react-basics.json
│           ├── kafka-basics.json
│           └── ... (more)
│
├── src/
│   ├── configs/
│   │   └── configRegistry.js        ← Still keep this!
│   ├── hooks/
│   │   └── useConfigLoader.js       ← Fetch from public/
│   └── utils/
│       └── configService.js         ← Environment-aware loader
```

### Why Public Folder?

**During Development:**

- Files served directly by webpack-dev-server
- Hot reload works automatically
- No build step needed for JSON changes
- Fast iteration cycles
- URL: `http://localhost:3000/configs/algorithms/binarySearch.json`

**During Build:**

- Files copied to `build/configs/` automatically
- Served by your hosting (same origin)
- No CORS issues
- Simple deployment

---

## 🔧 Implementation: Environment-Aware Config Loader

### Config Service (Environment Detection)

**src/utils/configService.js**

```javascript
/**
 * Environment-aware config loader
 * - Development: Load from /public/configs/
 * - Production: Load from CDN
 */

const CONFIG_SOURCES = {
  development: '/configs', // public folder
  staging: 'https://staging-cdn.yourapp.com/configs',
  production: 'https://cdn.yourapp.com/configs',
};

/**
 * Get base URL for config loading based on environment
 */
export function getConfigBaseUrl() {
  const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

  // Allow override via env variable
  if (process.env.REACT_APP_CONFIG_CDN_URL) {
    return process.env.REACT_APP_CONFIG_CDN_URL;
  }

  return CONFIG_SOURCES[env] || CONFIG_SOURCES.development;
}

/**
 * Build full URL for a config file
 */
export function getConfigUrl(configPath) {
  const baseUrl = getConfigBaseUrl();
  return `${baseUrl}/${configPath}.json`;
}

/**
 * Fetch a config from appropriate source
 */
export async function fetchConfig(configPath) {
  const url = getConfigUrl(configPath);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Config not found: ${configPath}`);
    }

    const config = await response.json();
    return config;
  } catch (error) {
    console.error(`Failed to load config from ${url}:`, error);
    throw error;
  }
}
```

### Updated Hook (Fetch-Based)

**src/hooks/useConfigLoader.js**

```javascript
import { useState, useEffect, useCallback } from 'react';
import { getConfigMeta } from '../configs/configRegistry';
import { fetchConfig } from '../utils/configService';

// In-memory cache (same as before)
class ConfigCache {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  has(key) {
    return this.cache.has(key);
  }
  get(key) {
    return this.cache.get(key);
  }
  set(key, value) {
    this.cache.set(key, value);
  }
  isLoading(key) {
    return this.loading.has(key);
  }
  setLoading(key, promise) {
    this.loading.set(key, promise);
  }
  clearLoading(key) {
    this.loading.delete(key);
  }
  getLoadingPromise(key) {
    return this.loading.get(key);
  }
}

const configCache = new ConfigCache();

export function useConfigLoader(configId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConfig = useCallback(async () => {
    if (!configId) {
      setLoading(false);
      return;
    }

    // Check cache
    if (configCache.has(configId)) {
      setConfig(configCache.get(configId));
      setLoading(false);
      return;
    }

    // Check if already loading
    if (configCache.isLoading(configId)) {
      try {
        const loadedConfig = await configCache.getLoadingPromise(configId);
        setConfig(loadedConfig);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const meta = getConfigMeta(configId);
      if (!meta) {
        throw new Error(`Config "${configId}" not found in registry`);
      }

      // Fetch from public folder or CDN (environment-aware)
      const loadPromise = fetchConfig(meta.path);
      configCache.setLoading(configId, loadPromise);

      const loadedConfig = await loadPromise;

      configCache.set(configId, loadedConfig);
      configCache.clearLoading(configId);

      setConfig(loadedConfig);
    } catch (err) {
      console.error(`Failed to load config "${configId}":`, err);
      configCache.clearLoading(configId);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [configId]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const reload = useCallback(() => loadConfig(), [loadConfig]);

  return { config, loading, error, reload };
}
```

---

## 🌍 Environment Configuration

### .env Files

**.env.development**

```bash
REACT_APP_ENV=development
# Configs loaded from public folder
# No CDN needed
```

**.env.staging**

```bash
REACT_APP_ENV=staging
REACT_APP_CONFIG_CDN_URL=https://staging-cdn.yourapp.com/configs
```

**.env.production**

```bash
REACT_APP_ENV=production
REACT_APP_CONFIG_CDN_URL=https://cdn.yourapp.com/configs
```

### Usage

```bash
# Development - loads from public/
npm start

# Staging build
REACT_APP_ENV=staging npm run build

# Production build
REACT_APP_ENV=production npm run build
```

---

## 📦 Build Configuration

### package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build:staging": "REACT_APP_ENV=staging npm run build",
    "build:prod": "REACT_APP_ENV=production npm run build",
    "deploy:staging": "npm run build:staging && npm run upload:staging",
    "deploy:prod": "npm run build:prod && npm run upload:prod",
    "upload:staging": "aws s3 sync build/ s3://staging-bucket/",
    "upload:prod": "aws s3 sync build/ s3://prod-bucket/"
  }
}
```

---

## Stage 2: Staging Migration (Test CDN)

### Step 1: Upload Configs to Staging CDN

```bash
# Upload only config files to staging CDN
aws s3 sync public/configs/ s3://staging-cdn-bucket/configs/ \
  --cache-control "public, max-age=3600"

# Verify upload
aws s3 ls s3://staging-cdn-bucket/configs/algorithms/
```

### Step 2: Test with Staging Environment

```bash
# Build with staging config
REACT_APP_ENV=staging npm run build

# Test locally
serve -s build -p 5000

# Open http://localhost:5000
# Configs should load from staging CDN
```

### Step 3: Verify in Staging

**Checklist:**

- [ ] All configs load successfully from CDN
- [ ] CORS headers configured correctly
- [ ] Cache headers working (check Network tab)
- [ ] No 404s or failed requests
- [ ] Performance is acceptable

---

## Stage 3: Production Migration (Full CDN)

### Pre-Migration Checklist

- [ ] All configs tested in staging
- [ ] CDN configured with proper cache headers
- [ ] CORS policy configured
- [ ] Monitoring/alerting setup
- [ ] Rollback plan ready

### Migration Steps

**Step 1: Upload to Production CDN**

```bash
# Upload configs to production CDN
aws s3 sync public/configs/ s3://prod-cdn-bucket/configs/ \
  --cache-control "public, max-age=31536000, immutable" \
  --acl public-read

# Set up CloudFront distribution (if using)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/configs/*"
```

**Step 2: Deploy Application**

```bash
# Build production bundle
REACT_APP_ENV=production npm run build

# Deploy to hosting
npm run deploy:prod
```

**Step 3: Monitor**

```javascript
// Add monitoring
window.addEventListener('load', () => {
  const configLoadTime = performance
    .getEntriesByType('resource')
    .filter((entry) => entry.name.includes('/configs/'))
    .map((entry) => entry.duration);

  console.log('Config load times:', configLoadTime);
});
```

---

## 🔄 Comparison: Public Folder vs CDN

| Aspect              | Public Folder    | CDN               |
| ------------------- | ---------------- | ----------------- |
| **Development**     | ✅ Perfect       | ❌ Overkill       |
| **Speed (Local)**   | ⚡ Instant       | 🐌 Network delay  |
| **Speed (Prod)**    | 🐌 Same origin   | ⚡ Edge caching   |
| **Caching**         | ⚠️ Basic         | ✅ Advanced       |
| **Cost**            | ✅ Free          | 💰 $$             |
| **Setup**           | ✅ Zero config   | ⚠️ Requires setup |
| **Versioning**      | ❌ Manual        | ✅ Automatic      |
| **Global Delivery** | ❌ Single region | ✅ Global         |
| **CORS**            | ✅ No issues     | ⚠️ Must configure |

---

## 🎯 Recommended Timeline

### Phase 1: Development (Weeks 1-4)

```
✅ Use public/ folder
✅ Focus on feature development
✅ Fast iteration
✅ No CDN complexity
```

**Config Location:** `public/configs/`
**Load Method:** `fetch('/configs/...')`
**Environment:** Development only

### Phase 2: Pre-Production Testing (Week 5)

```
✅ Upload to staging CDN
✅ Test with REACT_APP_CONFIG_CDN_URL
✅ Verify performance
✅ Fix any CORS issues
```

**Config Location:** Staging CDN
**Load Method:** `fetch('https://staging-cdn.../configs/...')`
**Environment:** Staging

### Phase 3: Production Launch (Week 6)

```
✅ Upload to production CDN
✅ Deploy with CDN URL
✅ Monitor performance
✅ Celebrate! 🎉
```

**Config Location:** Production CDN
**Load Method:** `fetch('https://cdn.../configs/...')`
**Environment:** Production

---

## 🛡️ CDN Configuration

### AWS S3 + CloudFront Setup

**S3 Bucket Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-cdn-bucket/configs/*"
    }
  ]
}
```

**CORS Configuration**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://yourapp.com",
      "https://staging.yourapp.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

**CloudFront Cache Behavior**

```yaml
PathPattern: /configs/*
ViewerProtocolPolicy: redirect-to-https
AllowedMethods: [GET, HEAD, OPTIONS]
CachedMethods: [GET, HEAD]
Compress: true
DefaultTTL: 31536000 # 1 year
MaxTTL: 31536000
MinTTL: 0
ForwardedValues:
  QueryString: false
  Cookies:
    Forward: none
```

---

## 🔍 Debugging & Testing

### Check Config Source

```javascript
// Add to configService.js for debugging
export function logConfigSource() {
  const baseUrl = getConfigBaseUrl();
  console.log('🔧 Config Source:', baseUrl);
  console.log('🌍 Environment:', process.env.REACT_APP_ENV);
}

// Call in development
if (process.env.NODE_ENV === 'development') {
  logConfigSource();
}
```

### Test Config Loading

```javascript
// Test in browser console
fetch('/configs/algorithms/binarySearch.json')
  .then((r) => r.json())
  .then((config) => console.log('✅ Config loaded:', config))
  .catch((err) => console.error('❌ Failed:', err));
```

### Network Monitoring

```javascript
// Monitor all config requests
const originalFetch = window.fetch;
window.fetch = function (...args) {
  const [url] = args;
  if (url.includes('/configs/')) {
    console.log('📡 Loading config:', url);
  }
  return originalFetch.apply(this, args);
};
```

---

## 💡 Best Practices

### During Development (Public Folder)

**Do:**

- ✅ Keep all configs in `public/configs/`
- ✅ Use relative paths (`/configs/...`)
- ✅ Test with different configs frequently
- ✅ Version control all JSON files
- ✅ Use consistent naming conventions

**Don't:**

- ❌ Hardcode CDN URLs yet
- ❌ Worry about caching strategies
- ❌ Optimize file sizes prematurely
- ❌ Add complex versioning

### Before Migration to CDN

**Checklist:**

- [ ] All configs validated (no syntax errors)
- [ ] File sizes optimized (<50KB each)
- [ ] Consistent structure across all configs
- [ ] Registry updated with all entries
- [ ] CORS tested in staging
- [ ] Cache headers configured
- [ ] Monitoring setup

---

## 🚀 Migration Commands

### One-Time Setup

```bash
# Create CDN bucket
aws s3 mb s3://your-cdn-bucket

# Set public access
aws s3api put-bucket-policy \
  --bucket your-cdn-bucket \
  --policy file://bucket-policy.json

# Configure CORS
aws s3api put-bucket-cors \
  --bucket your-cdn-bucket \
  --cors-configuration file://cors-config.json
```

### Deploy Configs

```bash
# Staging
npm run upload:configs:staging

# Production
npm run upload:configs:prod
```

**package.json:**

```json
{
  "scripts": {
    "upload:configs:staging": "aws s3 sync public/configs/ s3://staging-cdn-bucket/configs/",
    "upload:configs:prod": "aws s3 sync public/configs/ s3://prod-cdn-bucket/configs/ --cache-control 'public,max-age=31536000,immutable'"
  }
}
```

---

## 📊 Performance Expectations

### Public Folder (Development/Small Scale)

```
Load Time: 50-150ms (same origin)
Cache: Browser cache only
Global: Single region
Scalability: Limited
Cost: $0
```

**Good for:**

- Local development
- Small user base (<1000 users)
- Single region deployment

### CDN (Production/Scale)

```
Load Time: 20-80ms (edge caching)
Cache: Multi-layer (edge + browser)
Global: Worldwide
Scalability: Unlimited
Cost: ~$10-50/month
```

**Good for:**

- Production deployment
- Global user base
- High traffic
- Performance-critical apps

---

## 🎉 Summary

### Recommended Approach

```
✅ Start: public/ folder (Weeks 1-4)
    ↓ Fast development, zero setup

✅ Test: Staging CDN (Week 5)
    ↓ Verify CDN integration

✅ Launch: Production CDN (Week 6)
    ↓ Full performance benefits
```

### Why This Works

1. **No premature optimization** - CDN during development is overkill
2. **Smooth transition** - Same code works for both
3. **Risk mitigation** - Test in staging before production
4. **Cost effective** - No CDN costs during development
5. **Developer friendly** - Fast iteration cycles

### Key Takeaway

**Start simple (public folder), migrate when ready (CDN).** The environment-aware config loader makes this transition seamless!
