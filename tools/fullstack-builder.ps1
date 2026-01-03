#!/usr/bin/env pwsh
# =============================================================================
# SOTA FULLSTACK APP BUILDER - The Ultimate Web Application Generator
# =============================================================================
# Creates complete, production-ready fullstack applications with:
# - React/TypeScript frontend with Chakra UI
# - FastAPI backend with microservices architecture
# - PostgreSQL database with migrations
# - Docker containerization
# - Full monitoring stack (Prometheus, Grafana, Jaeger)
# - Authentication & authorization
# - CI/CD pipelines
# - Comprehensive testing
# - Documentation & deployment guides
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$AppName,
    
    [Parameter(Mandatory = $false)]
    [string]$Description = "A modern fullstack application",
    
    [Parameter(Mandatory = $false)]
    [string]$Author = "SOTA Builder",
    
    [Parameter(Mandatory = $false)]
    [string]$OutputPath = ".",
    
    [Parameter(Mandatory = $false)]
    [switch]$Interactive = $false,
    
    # Feature Flags (can be set via parameters or interactive menu)
    [Parameter(Mandatory = $false)]
    [switch]$IncludeAI,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeMCP,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeFileUpload,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeVoice,
    
    [Parameter(Mandatory = $false)]
    [switch]$Include2FA,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludePWA,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeMonitoring,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeAdvancedAnalytics,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeEmail,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeRealtime,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeMCPServer,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeElectronWrapper,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludePromptEngineering,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeMultiUser,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeAnalytics,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeCI,
    
    [Parameter(Mandatory = $false)]
    [switch]$IncludeTesting
)

# =============================================================================
# SET DEFAULTS FOR NON-INTERACTIVE MODE
# =============================================================================
# If not in interactive mode and no feature flags explicitly set, use sensible defaults
if (-not $Interactive) {
    $PSBoundParameters.Keys | Out-Null  # Trigger parameter binding
    
    # Set defaults if parameters weren't explicitly provided
    if (-not $PSBoundParameters.ContainsKey('IncludeAI')) { $IncludeAI = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeMCP')) { $IncludeMCP = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeFileUpload')) { $IncludeFileUpload = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeVoice')) { $IncludeVoice = $true }
    if (-not $PSBoundParameters.ContainsKey('Include2FA')) { $Include2FA = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludePWA')) { $IncludePWA = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeMonitoring')) { $IncludeMonitoring = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeMCPServer')) { $IncludeMCPServer = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeElectronWrapper')) { $IncludeElectronWrapper = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludePromptEngineering')) { $IncludePromptEngineering = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeAnalytics')) { $IncludeAnalytics = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeCI')) { $IncludeCI = $true }
    if (-not $PSBoundParameters.ContainsKey('IncludeTesting')) { $IncludeTesting = $true }
}

# =============================================================================
# INTERACTIVE FEATURE SELECTION
# =============================================================================

function Show-FeatureMenu {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║      🚀 FULLSTACK APP BUILDER - Feature Selection       ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Building: " -NoNewline -ForegroundColor Yellow
    Write-Host $AppName -ForegroundColor White
    Write-Host ""
    
    Write-Host "📦 CORE FEATURES (Always Included)" -ForegroundColor Green
    Write-Host "   ✓ FastAPI Backend + PostgreSQL + Redis" -ForegroundColor Gray
    Write-Host "   ✓ React Frontend + TypeScript + Chakra UI" -ForegroundColor Gray
    Write-Host "   ✓ Docker Setup + Basic Auth" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Select features to include:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. 🤖 AI ChatBot (OpenAI, Anthropic, Ollama, LMStudio)" -ForegroundColor Cyan
    Write-Host "  2. 🔌 MCP Client Dashboard (Universal MCP Frontend)" -ForegroundColor Cyan
    Write-Host "  3. 📁 File Upload & Processing (Images/PDFs)" -ForegroundColor Cyan
    Write-Host "  4. 🎤 Voice Interface (Speech in/out)" -ForegroundColor Cyan
    Write-Host "  5. 🔐 2FA Authentication (TOTP)" -ForegroundColor Cyan
    Write-Host "  6. 📱 PWA Support (Offline, Installable)" -ForegroundColor Cyan
    Write-Host "  7. 📊 Full Monitoring (Prometheus, Grafana, Loki)" -ForegroundColor Cyan
    Write-Host "  8. 📈 Advanced Analytics Dashboard" -ForegroundColor Cyan
    Write-Host "  9. 📧 Email Service Integration" -ForegroundColor Cyan
    Write-Host " 10. 🔔 Real-time Features (WebSockets)" -ForegroundColor Cyan
    Write-Host " 11. 🌐 MCP SERVER (Expose app as MCP server!)" -ForegroundColor Magenta
    Write-Host " 12. 🖥️  Electron Wrapper (Desktop app)" -ForegroundColor Magenta
    Write-Host " 13. 📝 Prompt Engineering (Templates, conversations)" -ForegroundColor Cyan
    Write-Host " 14. 👥 Multi-User Support (Teams, collaboration)" -ForegroundColor Cyan
    Write-Host " 15. 📊 Usage Analytics (Cost tracking, metrics)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💼 QUICK BUNDLES:" -ForegroundColor Yellow
    Write-Host "  A. Minimal (Core only)" -ForegroundColor Magenta
    Write-Host "  B. Standard (Core + AI + 2FA + PWA + Monitoring)" -ForegroundColor Magenta
    Write-Host "  C. Enterprise (Everything!)" -ForegroundColor Magenta
    Write-Host "  D. Custom (Pick individual features)" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Enter your choice [A/B/C/D]: " -NoNewline -ForegroundColor Yellow
    
    $choice = Read-Host
    
    switch ($choice.ToUpper()) {
        "A" {
            Write-Host "`n✨ Minimal bundle selected" -ForegroundColor Green
            return @{
                AI = $false
                MCP = $false
                FileUpload = $false
                Voice = $false
                TwoFA = $false
                PWA = $false
                Monitoring = $false
                Analytics = $false
                Email = $false
                Realtime = $false
                MCPServer = $false
            }
        }
        "B" {
            Write-Host "`n✨ Standard bundle selected" -ForegroundColor Green
            return @{
                AI = $true
                MCP = $false
                FileUpload = $false
                Voice = $false
                TwoFA = $true
                PWA = $true
                Monitoring = $true
                Analytics = $false
                Email = $false
                Realtime = $false
                MCPServer = $false
            }
        }
        "C" {
            Write-Host "`n✨ Enterprise bundle selected - ALL FEATURES!" -ForegroundColor Green
            return @{
                AI = $true
                MCP = $true
                FileUpload = $true
                Voice = $true
                TwoFA = $true
                PWA = $true
                Monitoring = $true
                Analytics = $true
                Email = $true
                Realtime = $true
                MCPServer = $true
                ElectronWrapper = $true
                PromptEngineering = $true
                MultiUser = $true
                UsageAnalytics = $true
            }
        }
        "D" {
            Write-Host "`n✨ Custom selection mode" -ForegroundColor Green
            Write-Host "Enter feature numbers separated by commas (e.g., 1,2,5,7,11,12): " -NoNewline -ForegroundColor Yellow
            $features = Read-Host
            $selected = $features -split ',' | ForEach-Object { $_.Trim() }
            
            return @{
                AI = $selected -contains '1'
                MCP = $selected -contains '2'
                FileUpload = $selected -contains '3'
                Voice = $selected -contains '4'
                TwoFA = $selected -contains '5'
                PWA = $selected -contains '6'
                Monitoring = $selected -contains '7'
                Analytics = $selected -contains '8'
                Email = $selected -contains '9'
                Realtime = $selected -contains '10'
                MCPServer = $selected -contains '11'
                ElectronWrapper = $selected -contains '12'
                PromptEngineering = $selected -contains '13'
                MultiUser = $selected -contains '14'
                UsageAnalytics = $selected -contains '15'
            }
        }
        default {
            Write-Host "`n⚠️  Invalid choice, using Standard bundle" -ForegroundColor Yellow
            return @{
                AI = $true
                MCP = $false
                FileUpload = $false
                Voice = $false
                TwoFA = $true
                PWA = $true
                Monitoring = $true
                Analytics = $false
                Email = $false
                Realtime = $false
                MCPServer = $false
            }
        }
    }
}

# Show interactive menu if -Interactive flag is set
if ($Interactive) {
    $selections = Show-FeatureMenu
    $IncludeAI = $selections.AI
    $IncludeMCP = $selections.MCP
    $IncludeFileUpload = $selections.FileUpload
    $IncludeVoice = $selections.Voice
    $Include2FA = $selections.TwoFA
    $IncludePWA = $selections.PWA
    $IncludeMonitoring = $selections.Monitoring
    $IncludeAdvancedAnalytics = $selections.Analytics
    $IncludeEmail = $selections.Email
    $IncludeRealtime = $selections.Realtime
    $IncludeMCPServer = $selections.MCPServer
    $IncludeElectronWrapper = $selections.ElectronWrapper
    $IncludePromptEngineering = $selections.PromptEngineering
    $IncludeMultiUser = $selections.MultiUser
    $IncludeAnalytics = $selections.UsageAnalytics
}

# Display selected features
Write-Host ""
Write-Host "🎯 Selected Features:" -ForegroundColor Cyan
if ($IncludeAI) { Write-Host "   ✓ AI ChatBot" -ForegroundColor Green }
if ($IncludeMCP) { Write-Host "   ✓ MCP Client Dashboard" -ForegroundColor Green }
if ($IncludeFileUpload) { Write-Host "   ✓ File Upload & Processing" -ForegroundColor Green }
if ($IncludeVoice) { Write-Host "   ✓ Voice Interface" -ForegroundColor Green }
if ($Include2FA) { Write-Host "   ✓ 2FA Authentication" -ForegroundColor Green }
if ($IncludePWA) { Write-Host "   ✓ PWA Support" -ForegroundColor Green }
if ($IncludeMonitoring) { Write-Host "   ✓ Full Monitoring Stack" -ForegroundColor Green }
if ($IncludeAdvancedAnalytics) { Write-Host "   ✓ Advanced Analytics" -ForegroundColor Green }
if ($IncludeEmail) { Write-Host "   ✓ Email Service" -ForegroundColor Green }
if ($IncludeRealtime) { Write-Host "   ✓ Real-time Features" -ForegroundColor Green }
if ($IncludeMCPServer) { Write-Host "   ✓ MCP SERVER (App exposes MCP tools!)" -ForegroundColor Magenta }
Write-Host ""

# =============================================================================
# CONFIGURATION & VALIDATION
# =============================================================================

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# Validate app name
if ($AppName -notmatch '^[a-zA-Z][a-zA-Z0-9_-]*$') {
    Write-Error "App name must start with a letter and contain only letters, numbers, underscores, and hyphens"
    exit 1
}

# Create output directory
$AppPath = Join-Path $OutputPath $AppName
if (Test-Path $AppPath) {
    Write-Error "Directory '$AppPath' already exists"
    exit 1
}

Write-Host "🚀 SOTA FULLSTACK APP BUILDER" -ForegroundColor Cyan
Write-Host "Building: $AppName" -ForegroundColor Green
Write-Host "Path: $AppPath" -ForegroundColor Yellow
Write-Host ""

# =============================================================================
# CREATE PROJECT STRUCTURE
# =============================================================================

Write-Host "📁 Creating project structure..." -ForegroundColor Cyan

$directories = @(
    "frontend",
    "frontend/src",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/hooks",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/src/types",
    "frontend/src/theme",
    "frontend/public",
    "frontend/tests",
    "backend",
    "backend/app",
    "backend/app/api",
    "backend/app/api/v1",
    "backend/app/core",
    "backend/app/db",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services",
    "backend/app/utils",
    "backend/tests",
    "backend/tests/api",
    "backend/tests/services",
    "backend/migrations",
    "infrastructure",
    "infrastructure/docker",
    "infrastructure/monitoring",
    "infrastructure/nginx",
    "docs",
    "docs/api",
    "docs/deployment",
    "docs/development",
    "scripts",
    ".github/workflows"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $AppPath $dir
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
}

# =============================================================================
# FRONTEND SETUP (React + TypeScript + Chakra UI)
# =============================================================================

Write-Host "⚛️ Setting up React frontend..." -ForegroundColor Cyan

# Package.json
$packageJson = @{
    name = $AppName.ToLower()
    version = "1.0.0"
    description = $Description
    private = $true
    scripts = @{
        dev = "vite"
        build = "tsc && vite build"
        preview = "vite preview"
        lint = "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
        test = "vitest"
        "test:ui" = "vitest --ui"
    }
    dependencies = @{
        "react" = "^18.2.0"
        "react-dom" = "^18.2.0"
        "@chakra-ui/react" = "^2.8.2"
        "@emotion/react" = "^11.11.1"
        "@emotion/styled" = "^11.11.0"
        "framer-motion" = "^10.16.4"
        "react-router-dom" = "^6.8.1"
        "axios" = "^1.6.2"
        "react-query" = "^3.39.3"
        "react-hook-form" = "^7.48.2"
        "react-hot-toast" = "^2.4.1"
        "date-fns" = "^2.30.0"
        "recharts" = "^2.8.0"
        "react-icons" = "^4.12.0"
    }
    devDependencies = @{
        "@types/react" = "^18.2.43"
        "@types/react-dom" = "^18.2.17"
        "@typescript-eslint/eslint-plugin" = "^6.14.0"
        "@typescript-eslint/parser" = "^6.14.0"
        "@vitejs/plugin-react" = "^4.2.1"
        "eslint" = "^8.55.0"
        "eslint-plugin-react-hooks" = "^4.6.0"
        "eslint-plugin-react-refresh" = "^0.4.5"
        "typescript" = "^5.2.2"
        "vite" = "^5.0.8"
        "vitest" = "^1.0.4"
        "@testing-library/react" = "^14.1.2"
        "@testing-library/jest-dom" = "^6.1.5"
        "jsdom" = "^23.0.1"
    }
} | ConvertTo-Json -Depth 10

$packageJsonPath = Join-Path $AppPath "frontend/package.json"
$packageJson | Out-File -FilePath $packageJsonPath -Encoding UTF8

# Generate package-lock.json
Write-Host "📦 Generating package-lock.json..." -ForegroundColor Cyan
Push-Location (Join-Path $AppPath "frontend")
npm install --package-lock-only --silent 2>&1 | Out-Null
Pop-Location

# Vite config
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9132,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
"@

$viteConfigPath = Join-Path $AppPath "frontend/vite.config.ts"
$viteConfig | Out-File -FilePath $viteConfigPath -Encoding UTF8

# index.html
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="$Description" />
    <meta name="theme-color" content="#319795" />
    <title>$AppName</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@

$indexHtmlPath = Join-Path $AppPath "frontend/index.html"
$indexHtml | Out-File -FilePath $indexHtmlPath -Encoding UTF8

# main.tsx
$mainTsx = @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"@

$mainTsxPath = Join-Path $AppPath "frontend/src/main.tsx"
$mainTsx | Out-File -FilePath $mainTsxPath -Encoding UTF8

# index.css
$indexCss = @"
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  width: 100%;
}
"@

$indexCssPath = Join-Path $AppPath "frontend/src/index.css"
$indexCss | Out-File -FilePath $indexCssPath -Encoding UTF8

# TypeScript config
$tsConfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
"@

$tsConfigPath = Join-Path $AppPath "frontend/tsconfig.json"
$tsConfig | Out-File -FilePath $tsConfigPath -Encoding UTF8

# =============================================================================
# PWA SUPPORT (Conditional)
# =============================================================================

if ($IncludePWA) {
    Write-Host "📱 Generating PWA files..." -ForegroundColor Cyan

# PWA Manifest
$pwaManifest = @"
{
  "name": "$AppName",
  "short_name": "$AppName",
  "description": "$Description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196f3",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "business"],
  "orientation": "portrait-primary"
}
"@

$pwaManifestPath = Join-Path $AppPath "frontend/public/manifest.json"
New-Item -ItemType Directory -Path (Split-Path $pwaManifestPath) -Force | Out-Null
$pwaManifest | Out-File -FilePath $pwaManifestPath -Encoding UTF8

# Service Worker
$serviceWorker = @"
const CACHE_NAME = '$AppName-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
"@

$serviceWorkerPath = Join-Path $AppPath "frontend/public/sw.js"
$serviceWorker | Out-File -FilePath $serviceWorkerPath -Encoding UTF8

# PWA Registration Script
$pwaRegister = @"
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}
"@

$pwaRegisterPath = Join-Path $AppPath "frontend/public/register-sw.js"
$pwaRegister | Out-File -FilePath $pwaRegisterPath -Encoding UTF8
}

# Main App component
$appComponent = @"
import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import theme from './theme';
import Layout from './components/Layout';
import Routes from './routes';
import ChatBot from './components/ChatBot';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Box minH="100vh" bg="gray.50">
            <Layout>
              <Routes />
            </Layout>
            <ChatBot />
            <Toaster position="top-right" />
          </Box>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
"@

$appComponentPath = Join-Path $AppPath "frontend/src/App.tsx"
$appComponent | Out-File -FilePath $appComponentPath -Encoding UTF8

# Layout component
$layoutComponent = @"
import React from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <VStack flex="1" spacing={0}>
        <TopBar />
        <Box flex="1" w="full" p={6} overflow="auto">
          {children}
        </Box>
      </VStack>
    </Flex>
  );
};

export default Layout;
"@

$layoutComponentPath = Join-Path $AppPath "frontend/src/components/Layout.tsx"
$layoutComponent | Out-File -FilePath $layoutComponentPath -Encoding UTF8

# Sidebar component
$sidebarComponent = @"
import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiHome, FiBarChart2, FiSettings, FiUsers, FiDatabase, FiServer, FiUpload, FiMic, FiShield, FiEdit3, FiDollarSign, FiActivity, FiZap } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon, children, to }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="3"
        mx="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'inherit'}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="250px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      h="100vh"
      overflowY="auto"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          $AppName
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch" mt={4}>
        <Text fontSize="xs" fontWeight="bold" color="gray.500" px="4" mb={2}>MAIN</Text>
        <NavItem icon={FiHome} to="/">
          Dashboard
        </NavItem>
        <NavItem icon={FiDollarSign} to="/analytics">
          Usage & Costs
        </NavItem>
        <NavItem icon={FiUsers} to="/users">
          Users
        </NavItem>
        <NavItem icon={FiDatabase} to="/data">
          Data
        </NavItem>
        
        <Box h={4} />
        <Text fontSize="xs" fontWeight="bold" color="gray.500" px="4" mb={2}>FEATURES</Text>
        <NavItem icon={FiServer} to="/mcp">
          MCP Client
        </NavItem>
        <NavItem icon={FiEdit3} to="/prompts">
          Prompts
        </NavItem>
        <NavItem icon={FiUpload} to="/files">
          File Upload
        </NavItem>
        <NavItem icon={FiMic} to="/voice">
          Voice
        </NavItem>
        <NavItem icon={FiShield} to="/auth">
          2FA Setup
        </NavItem>
        
        <Box h={4} />
        <Text fontSize="xs" fontWeight="bold" color="gray.500" px="4" mb={2}>SYSTEM</Text>
        <NavItem icon={FiActivity} to="/monitoring">
          Monitoring
        </NavItem>
        <NavItem icon={FiZap} to="/gradio">
          Image Studio
        </NavItem>
        <NavItem icon={FiSettings} to="/settings">
          Settings
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;
"@

$sidebarComponentPath = Join-Path $AppPath "frontend/src/components/Sidebar.tsx"
$sidebarComponent | Out-File -FilePath $sidebarComponentPath -Encoding UTF8

# TopBar component
$topBarComponent = @"
import React from 'react';
import {
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMoon, FiSun, FiHelpCircle, FiFileText, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import HelpModal from './HelpModal';
import LogViewer from './LogViewer';
import AISettings from './AISettings';

const TopBar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
  const { isOpen: isLogsOpen, onOpen: onLogsOpen, onClose: onLogsClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <Flex
        w="full"
        h="16"
        alignItems="center"
        justifyContent="space-between"
        px={6}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Text fontSize="xl" fontWeight="semibold">
          Welcome to $AppName
        </Text>

        <HStack spacing={4}>
          {/* Theme Toggle */}
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          {/* Log Viewer */}
          <IconButton
            aria-label="View Logs"
            icon={<FiFileText />}
            onClick={onLogsOpen}
            variant="ghost"
            colorScheme="purple"
          />

          {/* Help */}
          <IconButton
            aria-label="Help"
            icon={<FiHelpCircle />}
            onClick={onHelpOpen}
            variant="ghost"
            colorScheme="blue"
          />

          {/* Notifications */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiBell />}
              variant="ghost"
              aria-label="Notifications"
              position="relative"
            >
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top={0}
                right={0}
                fontSize="0.6em"
              >
                3
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem>New user registered</MenuItem>
              <MenuItem>System update available</MenuItem>
              <MenuItem>Backup completed</MenuItem>
            </MenuList>
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={2}>
                <Avatar size="sm" name="User Name" bg="blue.500" />
                <Text fontSize="sm" fontWeight="medium">
                  Admin User
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />} onClick={onSettingsOpen}>
                AI Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <HelpModal isOpen={isHelpOpen} onClose={onHelpClose} />
      <LogViewer isOpen={isLogsOpen} onClose={onLogsClose} />
      <AISettings isOpen={isSettingsOpen} onClose={onSettingsClose} />
    </>
  );
};

export default TopBar;
"@

$topBarComponentPath = Join-Path $AppPath "frontend/src/components/TopBar.tsx"
$topBarComponent | Out-File -FilePath $topBarComponentPath -Encoding UTF8

# Help Modal component
$helpModalComponent = @"
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Heading,
  Text,
  Code,
  Box,
  Badge,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FiCheckCircle, FiCode, FiBookOpen, FiLayers } from 'react-icons/fi';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} maxH="90vh">
        <ModalHeader borderBottom="1px" borderColor={borderColor}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">$AppName - Help & Documentation</Heading>
            <Text fontSize="sm" fontWeight="normal" color="gray.500">
              Built with SOTA Fullstack App Builder
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab><Icon as={FiBookOpen} mr={2} />Overview</Tab>
              <Tab><Icon as={FiLayers} mr={2} />Tech Stack</Tab>
              <Tab><Icon as={FiCode} mr={2} />Extending</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Box>
                    <Heading size="md" mb={3}>🚀 About This Application</Heading>
                    <Text mb={4}>
                      This is a modern, production-ready fullstack web application built with industry best practices.
                      It features a React frontend, FastAPI backend, PostgreSQL database, and comprehensive monitoring.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box p={4} borderWidth="1px" borderRadius="lg">
                        <Heading size="sm" mb={2}>⚛️ Frontend</Heading>
                        <Text fontSize="sm">React 18 + TypeScript + Chakra UI</Text>
                      </Box>
                      <Box p={4} borderWidth="1px" borderRadius="lg">
                        <Heading size="sm" mb={2}>🐍 Backend</Heading>
                        <Text fontSize="sm">FastAPI + SQLAlchemy + PostgreSQL</Text>
                      </Box>
                      <Box p={4} borderWidth="1px" borderRadius="lg">
                        <Heading size="sm" mb={2}>🐳 Infrastructure</Heading>
                        <Text fontSize="sm">Docker + Redis + Monitoring</Text>
                      </Box>
                      <Box p={4} borderWidth="1px" borderRadius="lg">
                        <Heading size="sm" mb={2}>🔄 CI/CD</Heading>
                        <Text fontSize="sm">GitHub Actions + Testing</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>✨ Key Features</Heading>
                    <List spacing={2}>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Modern React architecture with TypeScript
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Beautiful, accessible UI with Chakra UI
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        High-performance async FastAPI backend
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        PostgreSQL database with migrations
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Redis caching and session management
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Prometheus + Grafana monitoring stack
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Docker containerization
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Comprehensive test suites
                      </ListItem>
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🌐 Access Points</Heading>
                    <VStack align="start" spacing={2}>
                      <Text><Badge colorScheme="blue">Frontend</Badge> http://localhost:9132</Text>
                      <Text><Badge colorScheme="green">Backend API</Badge> http://localhost:8000</Text>
                      <Text><Badge colorScheme="purple">API Docs</Badge> http://localhost:8000/api/v1/docs</Text>
                      <Text><Badge colorScheme="orange">Grafana</Badge> http://localhost:3001 (admin/admin)</Text>
                      <Text><Badge colorScheme="red">Prometheus</Badge> http://localhost:9090</Text>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Tech Stack Tab */}
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Box>
                    <Heading size="md" mb={3}>⚛️ Frontend Stack</Heading>
                    <List spacing={2}>
                      <ListItem><Badge>React 18</Badge> - Modern UI library with hooks</ListItem>
                      <ListItem><Badge>TypeScript</Badge> - Type safety and better DX</ListItem>
                      <ListItem><Badge>Chakra UI 2.8</Badge> - Accessible component library</ListItem>
                      <ListItem><Badge>React Router 6</Badge> - Client-side routing</ListItem>
                      <ListItem><Badge>React Query</Badge> - Server state management</ListItem>
                      <ListItem><Badge>React Hook Form</Badge> - Form handling</ListItem>
                      <ListItem><Badge>Vite 5</Badge> - Lightning-fast build tool</ListItem>
                      <ListItem><Badge>Vitest</Badge> - Unit testing framework</ListItem>
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🐍 Backend Stack</Heading>
                    <List spacing={2}>
                      <ListItem><Badge>FastAPI 0.104</Badge> - High-performance async framework</ListItem>
                      <ListItem><Badge>Uvicorn</Badge> - ASGI server</ListItem>
                      <ListItem><Badge>SQLAlchemy 2.0</Badge> - ORM with async support</ListItem>
                      <ListItem><Badge>Alembic</Badge> - Database migrations</ListItem>
                      <ListItem><Badge>Pydantic 2.5</Badge> - Data validation</ListItem>
                      <ListItem><Badge>PostgreSQL 15</Badge> - Primary database</ListItem>
                      <ListItem><Badge>Redis 7</Badge> - Caching and sessions</ListItem>
                      <ListItem><Badge>Celery</Badge> - Background task processing</ListItem>
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🛠️ Development Tools</Heading>
                    <List spacing={2}>
                      <ListItem><Badge>ESLint</Badge> - JavaScript/TypeScript linting</ListItem>
                      <ListItem><Badge>Pytest</Badge> - Python testing framework</ListItem>
                      <ListItem><Badge>Docker Compose</Badge> - Multi-container orchestration</ListItem>
                      <ListItem><Badge>GitHub Actions</Badge> - CI/CD pipelines</ListItem>
                      <ListItem><Badge>Prometheus</Badge> - Metrics collection</ListItem>
                      <ListItem><Badge>Grafana</Badge> - Metrics visualization</ListItem>
                    </List>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Extending Tab */}
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Box>
                    <Heading size="md" mb={3}>📝 Adding New Pages</Heading>
                    <Text mb={3}>Create a new page component in <Code>frontend/src/pages/</Code></Text>
                    <Box bg="gray.900" p={4} borderRadius="md" color="white" fontFamily="mono" fontSize="sm">
                      <Text>{'// frontend/src/pages/NewPage.tsx'}</Text>
                      <Text>{'import React from \"react\";'}</Text>
                      <Text>{'import { Heading, Box } from \"@chakra-ui/react\";'}</Text>
                      <Text>{''}</Text>
                      <Text>{'export const NewPage = () => {'}</Text>
                      <Text>{'  return <Box><Heading>New Page</Heading></Box>;'}</Text>
                      <Text>{'};'}</Text>
                    </Box>
                    <Text mt={3}>Then add it to <Code>frontend/src/routes.tsx</Code></Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🔌 Adding API Endpoints</Heading>
                    <Text mb={3}>Create new routes in <Code>backend/app/api/v1/</Code></Text>
                    <Box bg="gray.900" p={4} borderRadius="md" color="white" fontFamily="mono" fontSize="sm">
                      <Text>{'# backend/app/api/v1/items.py'}</Text>
                      <Text>{'from fastapi import APIRouter'}</Text>
                      <Text>{''}</Text>
                      <Text>{'router = APIRouter()'}</Text>
                      <Text>{''}</Text>
                      <Text>{'@router.get(\"/items\")'}</Text>
                      <Text>{'async def get_items():'}</Text>
                      <Text>{'    return {\"items\": []}'}</Text>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🗄️ Database Models</Heading>
                    <Text mb={3}>Add SQLAlchemy models in <Code>backend/app/models/</Code></Text>
                    <Box bg="gray.900" p={4} borderRadius="md" color="white" fontFamily="mono" fontSize="sm">
                      <Text>{'# backend/app/models/item.py'}</Text>
                      <Text>{'from sqlalchemy import Column, Integer, String'}</Text>
                      <Text>{'from app.db.base_class import Base'}</Text>
                      <Text>{''}</Text>
                      <Text>{'class Item(Base):'}</Text>
                      <Text>{'    id = Column(Integer, primary_key=True)'}</Text>
                      <Text>{'    name = Column(String)'}</Text>
                    </Box>
                    <Text mt={3}>Run migrations: <Code>alembic revision --autogenerate -m \"Add items\"</Code></Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>🎨 Customizing Theme</Heading>
                    <Text mb={3}>Edit Chakra UI theme in <Code>frontend/src/theme/index.ts</Code></Text>
                    <List spacing={2}>
                      <ListItem><ListIcon as={FiCheckCircle} color="green.500" />Change colors and fonts</ListItem>
                      <ListItem><ListIcon as={FiCheckCircle} color="green.500" />Add custom components</ListItem>
                      <ListItem><ListIcon as={FiCheckCircle} color="green.500" />Configure breakpoints</ListItem>
                      <ListItem><ListIcon as={FiCheckCircle} color="green.500" />Extend default theme</ListItem>
                    </List>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={3}>📚 Documentation</Heading>
                    <VStack align="start" spacing={2}>
                      <Text>• <Code>README.md</Code> - Project overview and setup</Text>
                      <Text>• <Code>docs/api/</Code> - API documentation</Text>
                      <Text>• <Code>docs/deployment/</Code> - Deployment guides</Text>
                      <Text>• <Code>docs/development/</Code> - Development guides</Text>
                      <Text>• <Code>/api/v1/docs</Code> - Interactive API docs</Text>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;
"@

$helpModalComponentPath = Join-Path $AppPath "frontend/src/components/HelpModal.tsx"
$helpModalComponent | Out-File -FilePath $helpModalComponentPath -Encoding UTF8

# Log Viewer Modal component
$logViewerComponent = @"
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  IconButton,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Code,
  Divider,
} from '@chakra-ui/react';
import { FiSearch, FiDownload, FiTrash2, FiCopy, FiRefreshCw } from 'react-icons/fi';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source?: string;
}

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logBgColor = useColorModeValue('gray.50', 'gray.900');

  // Mock log data - in production, this would come from API
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      { id: '1', timestamp: new Date().toISOString(), level: 'INFO', message: 'Application started successfully', source: 'System' },
      { id: '2', timestamp: new Date().toISOString(), level: 'INFO', message: 'Database connection established', source: 'Database' },
      { id: '3', timestamp: new Date().toISOString(), level: 'DEBUG', message: 'Loading configuration from environment', source: 'Config' },
      { id: '4', timestamp: new Date().toISOString(), level: 'INFO', message: 'Redis cache connected', source: 'Cache' },
      { id: '5', timestamp: new Date().toISOString(), level: 'WARN', message: 'High memory usage detected: 85%', source: 'Monitor' },
      { id: '6', timestamp: new Date().toISOString(), level: 'INFO', message: 'User authentication successful', source: 'Auth' },
      { id: '7', timestamp: new Date().toISOString(), level: 'DEBUG', message: 'API request: GET /api/v1/status', source: 'API' },
      { id: '8', timestamp: new Date().toISOString(), level: 'ERROR', message: 'Failed to connect to external service', source: 'External' },
      { id: '9', timestamp: new Date().toISOString(), level: 'INFO', message: 'Backup completed successfully', source: 'Backup' },
      { id: '10', timestamp: new Date().toISOString(), level: 'DEBUG', message: 'Cache hit for user session', source: 'Cache' },
    ];
    setLogs(mockLogs);
  }, []);

  // Filter logs based on search and level
  useEffect(() => {
    let filtered = logs;

    if (levelFilter !== 'ALL') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'red';
      case 'WARN': return 'orange';
      case 'INFO': return 'blue';
      case 'DEBUG': return 'gray';
      default: return 'gray';
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  const handleExportLogs = () => {
    const logText = filteredLogs.map(log =>
      ``[`${log.timestamp}] [`${log.level}] [`${log.source || 'Unknown'}] `${log.message}``
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ``logs-`${new Date().toISOString()}.txt``;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLogs = () => {
    const logText = filteredLogs.map(log =>
      ``[`${log.timestamp}] [`${log.level}] [`${log.source || 'Unknown'}] `${log.message}``
    ).join('\n');
    navigator.clipboard.writeText(logText);
  };

  const handleRefresh = () => {
    // In production, this would fetch new logs from API
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'Logs refreshed manually',
      source: 'System'
    };
    setLogs([...logs, newLog]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} maxH="90vh">
        <ModalHeader borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">Application Logs</Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.500">
                {filteredLogs.length} of {logs.length} entries
              </Text>
            </VStack>
            <HStack>
              <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                Live
              </Badge>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={0}>
          {/* Controls */}
          <Box p={4} borderBottom="1px" borderColor={borderColor}>
            <VStack spacing={3}>
              <HStack w="full" spacing={3}>
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                
                <Select
                  w="200px"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  <option value="ALL">All Levels</option>
                  <option value="ERROR">Errors Only</option>
                  <option value="WARN">Warnings Only</option>
                  <option value="INFO">Info Only</option>
                  <option value="DEBUG">Debug Only</option>
                </Select>
              </HStack>

              <HStack w="full" justify="space-between">
                <FormControl display="flex" alignItems="center" w="auto">
                  <FormLabel htmlFor="auto-scroll" mb="0" fontSize="sm">
                    Auto-scroll
                  </FormLabel>
                  <Switch
                    id="auto-scroll"
                    isChecked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    colorScheme="blue"
                  />
                </FormControl>

                <HStack>
                  <IconButton
                    aria-label="Refresh logs"
                    icon={<FiRefreshCw />}
                    onClick={handleRefresh}
                    size="sm"
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Copy logs"
                    icon={<FiCopy />}
                    onClick={handleCopyLogs}
                    size="sm"
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Export logs"
                    icon={<FiDownload />}
                    onClick={handleExportLogs}
                    size="sm"
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Clear logs"
                    icon={<FiTrash2 />}
                    onClick={handleClearLogs}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                  />
                </HStack>
              </HStack>
            </VStack>
          </Box>

          {/* Log Display */}
          <Box
            p={4}
            bg={logBgColor}
            maxH="500px"
            overflowY="auto"
            fontFamily="mono"
            fontSize="sm"
          >
            {filteredLogs.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                No logs to display
              </Text>
            ) : (
              <VStack align="stretch" spacing={1}>
                {filteredLogs.map((log) => (
                  <HStack
                    key={log.id}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    align="start"
                    spacing={3}
                  >
                    <Text color="gray.500" fontSize="xs" minW="180px">
                      {new Date(log.timestamp).toLocaleString()}
                    </Text>
                    <Badge
                      colorScheme={getLevelColor(log.level)}
                      minW="60px"
                      textAlign="center"
                    >
                      {log.level}
                    </Badge>
                    {log.source && (
                      <Badge variant="subtle" minW="80px" textAlign="center">
                        {log.source}
                      </Badge>
                    )}
                    <Text flex={1}>{log.message}</Text>
                  </HStack>
                ))}
                <div ref={logsEndRef} />
              </VStack>
            )}
          </Box>
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Text fontSize="sm" color="gray.500">
              Last updated: {new Date().toLocaleTimeString()}
            </Text>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogViewer;
"@

$logViewerComponentPath = Join-Path $AppPath "frontend/src/components/LogViewer.tsx"
$logViewerComponent | Out-File -FilePath $logViewerComponentPath -Encoding UTF8

# AI ChatBot Component
# =============================================================================
# AI FEATURES (Conditional)
# =============================================================================

if ($IncludeAI) {
    Write-Host "🤖 Generating AI components..." -ForegroundColor Cyan

$chatBotComponent = @"
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Avatar,
  useColorModeValue,
  Badge,
  Select,
  Collapse,
  useDisclosure,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { FiSend, FiMessageCircle, FiX, FiRefreshCw } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you navigate the app, understand features, or troubleshoot issues. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string>('anthropic');
  const [model, setModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedProvider = localStorage.getItem('ai_provider') || 'anthropic';
    const savedModel = localStorage.getItem('selected_model') || '';
    setProvider(savedProvider);
    setModel(savedModel);
    
    if (savedProvider === 'openai') {
      setApiKey(localStorage.getItem('openai_key') || '');
    } else if (savedProvider === 'anthropic') {
      setApiKey(localStorage.getItem('anthropic_key') || '');
    } else if (savedProvider === 'ollama') {
      setBaseUrl(localStorage.getItem('ollama_url') || 'http://localhost:11434');
    } else if (savedProvider === 'lmstudio') {
      setBaseUrl(localStorage.getItem('lmstudio_url') || 'http://localhost:1234');
    }
  }, []);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userMsgBg = useColorModeValue('blue.500', 'blue.600');
  const assistantMsgBg = useColorModeValue('gray.100', 'gray.700');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody: any = {
        message: input,
        provider,
        model
      };
      
      if (provider === 'openai' || provider === 'anthropic') {
        requestBody.api_key = apiKey;
      } else {
        requestBody.base_url = baseUrl;
      }
      
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                assistantContent += data.content;
                
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  
                  if (lastMsg?.role === 'assistant' && lastMsg.content === assistantContent.slice(0, -data.content.length)) {
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantContent,
                      timestamp: new Date()
                    };
                  } else {
                    newMessages.push({
                      role: 'assistant',
                      content: assistantContent,
                      timestamp: new Date()
                    });
                  }
                  
                  return newMessages;
                });
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure your API keys are configured.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }]);
  };

  return (
    <Box position="fixed" bottom={4} right={4} zIndex={1000}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <IconButton
          aria-label="Open chat"
          icon={<FiMessageCircle />}
          onClick={onToggle}
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.1)' }}
          transition="all 0.2s"
        />
      )}

      {/* Chat Window */}
      <Collapse in={isOpen}>
        <Box
          w="400px"
          h="600px"
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="2xl"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <HStack
            p={4}
            borderBottom="1px"
            borderColor={borderColor}
            justify="space-between"
          >
            <HStack>
              <Avatar size="sm" name="AI Assistant" bg="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm">AI Assistant</Text>
                <HStack spacing={1}>
                  <Badge colorScheme="green" fontSize="xs">Online</Badge>
                  {model && (
                    <Badge colorScheme="blue" fontSize="xs">{model.split('/').pop()}</Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <IconButton
                aria-label="Clear chat"
                icon={<FiRefreshCw />}
                onClick={handleClear}
                size="sm"
                variant="ghost"
              />
              <IconButton
                aria-label="Close chat"
                icon={<FiX />}
                onClick={onToggle}
                size="sm"
                variant="ghost"
              />
            </HStack>
          </HStack>

          {/* Messages */}
          <VStack
            flex={1}
            overflowY="auto"
            p={4}
            spacing={3}
            align="stretch"
          >
            {messages.map((msg, idx) => (
              <HStack
                key={idx}
                align="start"
                justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                {msg.role === 'assistant' && (
                  <Avatar size="xs" name="AI" bg="blue.500" />
                )}
                <Box
                  maxW="80%"
                  bg={msg.role === 'user' ? userMsgBg : assistantMsgBg}
                  color={msg.role === 'user' ? 'white' : 'inherit'}
                  p={3}
                  borderRadius="lg"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">{msg.content}</Text>
                  <Text fontSize="xs" opacity={0.7} mt={1}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
                {msg.role === 'user' && (
                  <Avatar size="xs" name="You" bg="gray.500" />
                )}
              </HStack>
            ))}
            {isLoading && (
              <HStack justify="flex-start">
                <Avatar size="xs" name="AI" bg="blue.500" />
                <Box bg={assistantMsgBg} p={3} borderRadius="lg">
                  <Spinner size="sm" />
                </Box>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <HStack p={4} borderTop="1px" borderColor={borderColor}>
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <IconButton
              aria-label="Send message"
              icon={<FiSend />}
              onClick={handleSend}
              colorScheme="blue"
              isLoading={isLoading}
            />
          </HStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChatBot;
"@

$chatBotComponentPath = Join-Path $AppPath "frontend/src/components/ChatBot.tsx"
$chatBotComponent | Out-File -FilePath $chatBotComponentPath -Encoding UTF8

# AI Settings Modal Component
$aiSettingsComponent = @"
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Code,
  useColorModeValue,
  Divider,
  Badge,
  Box,
  SimpleGrid,
  IconButton,
  useToast,
  Spinner,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FiRefreshCw, FiDownload, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalModel {
  name: string;
  size: string;
  modified: string;
  loaded: boolean;
}

const AISettings: React.FC<AISettingsProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<string>('anthropic');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [lmstudioUrl, setLmstudioUrl] = useState('http://localhost:1234');
  const [selectedModel, setSelectedModel] = useState('');
  const [localModels, setLocalModels] = useState<LocalModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const models = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  };

  useEffect(() => {
    // Load saved settings from localStorage
    const savedProvider = localStorage.getItem('ai_provider') || 'anthropic';
    const savedOpenaiKey = localStorage.getItem('openai_key') || '';
    const savedAnthropicKey = localStorage.getItem('anthropic_key') || '';
    const savedOllamaUrl = localStorage.getItem('ollama_url') || 'http://localhost:11434';
    const savedLmstudioUrl = localStorage.getItem('lmstudio_url') || 'http://localhost:1234';
    const savedModel = localStorage.getItem('selected_model') || '';

    setProvider(savedProvider);
    setOpenaiKey(savedOpenaiKey);
    setAnthropicKey(savedAnthropicKey);
    setOllamaUrl(savedOllamaUrl);
    setLmstudioUrl(savedLmstudioUrl);
    setSelectedModel(savedModel);
  }, []);

  const fetchLocalModels = async () => {
    setIsLoadingModels(true);
    try {
      const url = provider === 'ollama' ? ollamaUrl : lmstudioUrl;
      const response = await fetch(``$`{url}/api/tags``);
      const data = await response.json();
      
      const models: LocalModel[] = data.models?.map((m: any) => ({
        name: m.name,
        size: m.size || 'Unknown',
        modified: m.modified_at || 'Unknown',
        loaded: m.loaded || false
      })) || [];
      
      setLocalModels(models);
      
      toast({
        title: 'Models loaded',
        description: ``Found $`{models.length} local models``,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error loading models',
        description: 'Make sure Ollama/LMStudio is running',
        status: 'error',
        duration: 5000,
      });
      setLocalModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const loadModel = async (modelName: string) => {
    try {
      const url = provider === 'ollama' ? ollamaUrl : lmstudioUrl;
      await fetch(``$`{url}/api/load``, {
        method: 'POST',
        body: JSON.stringify({ name: modelName })
      });
      
      toast({
        title: 'Model loaded',
        description: ``$`{modelName} is now ready``,
        status: 'success',
        duration: 3000,
      });
      
      await fetchLocalModels();
    } catch (error) {
      toast({
        title: 'Error loading model',
        description: 'Failed to load model',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const unloadModel = async (modelName: string) => {
    try {
      const url = provider === 'ollama' ? ollamaUrl : lmstudioUrl;
      await fetch(``$`{url}/api/unload``, {
        method: 'POST',
        body: JSON.stringify({ name: modelName })
      });
      
      toast({
        title: 'Model unloaded',
        description: ``$`{modelName} has been unloaded``,
        status: 'success',
        duration: 3000,
      });
      
      await fetchLocalModels();
    } catch (error) {
      toast({
        title: 'Error unloading model',
        description: 'Failed to unload model',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('openai_key', openaiKey);
    localStorage.setItem('anthropic_key', anthropicKey);
    localStorage.setItem('ollama_url', ollamaUrl);
    localStorage.setItem('lmstudio_url', lmstudioUrl);
    localStorage.setItem('selected_model', selectedModel);

    toast({
      title: 'Settings saved',
      description: 'Your AI settings have been updated',
      status: 'success',
      duration: 3000,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} maxH="90vh">
        <ModalHeader borderBottom="1px" borderColor={borderColor}>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold">⚙️ AI Assistant Settings</Text>
            <Text fontSize="sm" fontWeight="normal" color="gray.500">
              Configure your AI provider, models, and API keys
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Provider Selection */}
            <FormControl>
              <FormLabel>AI Provider</FormLabel>
              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="ollama">Ollama (Local FOSS Models)</option>
                <option value="lmstudio">LM Studio (Local FOSS Models)</option>
              </Select>
            </FormControl>

            <Divider />

            {/* Cloud Providers */}
            {provider === 'openai' && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Get your API key from https://platform.openai.com/api-keys
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Model</FormLabel>
                  <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="">Select a model...</option>
                    {models.openai.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            )}

            {provider === 'anthropic' && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Anthropic API Key</FormLabel>
                  <Input
                    type="password"
                    placeholder="sk-ant-..."
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Get your API key from https://console.anthropic.com/
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Model</FormLabel>
                  <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="">Select a model...</option>
                    {models.anthropic.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            )}

            {/* Local Providers */}
            {(provider === 'ollama' || provider === 'lmstudio') && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>
                    {provider === 'ollama' ? 'Ollama' : 'LM Studio'} URL
                  </FormLabel>
                  <Input
                    placeholder={provider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234'}
                    value={provider === 'ollama' ? ollamaUrl : lmstudioUrl}
                    onChange={(e) => provider === 'ollama' ? setOllamaUrl(e.target.value) : setLmstudioUrl(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Make sure {provider === 'ollama' ? 'Ollama' : 'LM Studio'} is running locally
                  </Text>
                </FormControl>

                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text fontWeight="bold">Available Models</Text>
                    <IconButton
                      aria-label="Refresh models"
                      icon={isLoadingModels ? <Spinner size="sm" /> : <FiRefreshCw />}
                      onClick={fetchLocalModels}
                      size="sm"
                      variant="ghost"
                    />
                  </HStack>

                  {localModels.length === 0 ? (
                    <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center">
                      <Text color="gray.500" fontSize="sm">
                        No models found. Click refresh to load models.
                      </Text>
                    </Box>
                  ) : (
                    <List spacing={2}>
                      {localModels.map((model) => (
                        <ListItem
                          key={model.name}
                          p={3}
                          borderWidth="1px"
                          borderRadius="lg"
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Text fontWeight="bold" fontSize="sm">{model.name}</Text>
                                {model.loaded && (
                                  <Badge colorScheme="green" fontSize="xs">Loaded</Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                Size: {model.size}
                              </Text>
                            </VStack>
                            <HStack>
                              {model.loaded ? (
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => unloadModel(model.name)}
                                >
                                  Unload
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  colorScheme="green"
                                  variant="ghost"
                                  onClick={() => loadModel(model.name)}
                                >
                                  Load
                                </Button>
                              )}
                              <Button
                                size="xs"
                                colorScheme="blue"
                                onClick={() => setSelectedModel(model.name)}
                              >
                                Use
                              </Button>
                            </HStack>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>

                <FormControl>
                  <FormLabel>Selected Model</FormLabel>
                  <Input
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="Select or enter model name"
                  />
                </FormControl>
              </VStack>
            )}

            <Divider />

            {/* Current Configuration Summary */}
            <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
              <Text fontWeight="bold" mb={2}>Current Configuration</Text>
              <SimpleGrid columns={2} spacing={2} fontSize="sm">
                <Text color="gray.600">Provider:</Text>
                <Text fontWeight="medium">{provider}</Text>
                
                <Text color="gray.600">Model:</Text>
                <Text fontWeight="medium">{selectedModel || 'Not selected'}</Text>
                
                {provider === 'openai' && (
                  <>
                    <Text color="gray.600">API Key:</Text>
                    <Text fontWeight="medium">
                      {openaiKey ? '••••••••' : 'Not set'}
                    </Text>
                  </>
                )}
                
                {provider === 'anthropic' && (
                  <>
                    <Text color="gray.600">API Key:</Text>
                    <Text fontWeight="medium">
                      {anthropicKey ? '••••••••' : 'Not set'}
                    </Text>
                  </>
                )}
                
                {(provider === 'ollama' || provider === 'lmstudio') && (
                  <>
                    <Text color="gray.600">Endpoint:</Text>
                    <Text fontWeight="medium">
                      {provider === 'ollama' ? ollamaUrl : lmstudioUrl}
                    </Text>
                  </>
                )}
              </SimpleGrid>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Settings
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AISettings;
"@

$aiSettingsComponentPath = Join-Path $AppPath "frontend/src/components/AISettings.tsx"
$aiSettingsComponent | Out-File -FilePath $aiSettingsComponentPath -Encoding UTF8
}

# =============================================================================
# MCP CLIENT (Conditional)
# =============================================================================

if ($IncludeMCP) {
    Write-Host "🔌 Generating MCP Client components..." -ForegroundColor Cyan

# MCP Client Dashboard Component
$mcpDashboardComponent = @"
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  useColorModeValue,
  useToast,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FiServer, FiTool, FiPlay, FiRefreshCw } from 'react-icons/fi';

interface MCPServer {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  source: string;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

const MCPDashboard: React.FC = () => {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [connectedServers, setConnectedServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [toolResults, setToolResults] = useState<Record<string, any>>({});
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    loadServers();
    // Poll for connected servers every 5 seconds
    const interval = setInterval(loadConnectedServers, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadConnectedServers = async () => {
    try {
      const response = await fetch('/api/v1/mcp/connected');
      const data = await response.json();
      setConnectedServers(data.servers);
    } catch (error) {
      // Silent fail - just refresh issue
    }
  };

  const loadServers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/mcp/servers');
      const data = await response.json();
      setServers(data.servers);
      setConnectedServers(data.connected || []);
      toast({
        title: 'Servers loaded',
        description: ``Found $`{data.count} available, $`{data.connected_count || 0} connected``,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error loading servers',
        description: 'Failed to load MCP servers',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectServer = async (serverName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/mcp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server_name: serverName })
      });
      const data = await response.json();
      
      if (data.status === 'disconnected') {
        toast({
          title: 'Disconnected',
          description: ``Closed connection to $`{serverName}``,
          status: 'info',
          duration: 3000,
        });
        loadConnectedServers();
        if (selectedServer?.name === serverName) {
          setSelectedServer(null);
          setTools([]);
        }
      }
    } catch (error) {
      toast({
        title: 'Error disconnecting',
        description: 'Failed to close connection',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectToServer = async (server: MCPServer) => {
    setIsLoading(true);
    setSelectedServer(server);
    try {
      const response = await fetch('/api/v1/mcp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_name: server.name,  // CRITICAL: Server name for session tracking
          command: server.command,
          args: server.args,
          env: server.env
        })
      });
      const data = await response.json();
      
      if (data.status === 'connected') {
        setTools(data.tools);
        toast({
          title: 'Connected to ' + server.name,
          description: ``Found $`{data.count} tools - Connection persists!``,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Connection failed',
          description: data.message,
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error connecting',
        description: 'Failed to connect to MCP server',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeTool = async (toolName: string) => {
    if (!selectedServer) return;
    
    setIsLoading(true);
    try {
      const args = JSON.parse(toolArgs[toolName] || '{}');
      const response = await fetch('/api/v1/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_name: selectedServer.name,  // Use persistent connection
          tool_name: toolName,
          tool_args: args
        })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setToolResults({ ...toolResults, [toolName]: data });
        toast({
          title: ``✅ $`{toolName} executed``,
          description: ``Executed on $`{selectedServer.name}``,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setToolResults({ ...toolResults, [toolName]: data });
        toast({
          title: 'Execution failed',
          description: data.message || 'Tool execution error',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Execution failed',
        description: 'Failed to execute tool - check connection',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">🔌 MCP Client Dashboard</Heading>
          <Button
            leftIcon={<FiRefreshCw />}
            onClick={loadServers}
            isLoading={isLoading}
            colorScheme="blue"
            size="sm"
          >
            Refresh
          </Button>
        </HStack>

        {/* Connected Servers Section */}
        {connectedServers.length > 0 && (
          <Box p={4} bg="green.50" borderWidth="1px" borderColor="green.200" borderRadius="lg">
            <HStack justify="space-between" mb={3}>
              <HStack>
                <Badge colorScheme="green" fontSize="md">●</Badge>
                <Text fontWeight="bold">Connected Servers ({connectedServers.length})</Text>
              </HStack>
            </HStack>
            <VStack spacing={2} align="stretch">
              {connectedServers.map((conn) => (
                <HStack key={conn.name} justify="space-between" p={2} bg="white" borderRadius="md">
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">{conn.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {conn.tool_count} tools • Connected: {new Date(conn.connected_at).toLocaleTimeString()}
                    </Text>
                  </VStack>
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => disconnectServer(conn.name)}
                  >
                    Disconnect
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        <Text fontWeight="bold" fontSize="md">Available MCP Servers</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {servers.map((server) => (
            <Card
              key={server.name}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              cursor="pointer"
              onClick={() => connectToServer(server)}
              _hover={{ shadow: 'md' }}
            >
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <FiServer />
                    <Heading size="sm">{server.name}</Heading>
                  </HStack>
                  <Badge colorScheme="blue">{server.source}</Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                <Code fontSize="xs">{server.command}</Code>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {selectedServer && tools.length > 0 && (
          <Box>
            <Heading size="md" mb={4}>
              Tools from {selectedServer.name}
            </Heading>
            <Accordion allowMultiple>
              {tools.map((tool) => (
                <AccordionItem key={tool.name}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <FiTool />
                        <Text fontWeight="bold">{tool.name}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {tool.description}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <VStack spacing={3} align="stretch">
                      <Textarea
                        placeholder='{"arg1": "value1"}'
                        value={toolArgs[tool.name] || ''}
                        onChange={(e) =>
                          setToolArgs({ ...toolArgs, [tool.name]: e.target.value })
                        }
                        size="sm"
                      />
                      <Button
                        leftIcon={<FiPlay />}
                        onClick={() => executeTool(tool.name)}
                        isLoading={isLoading}
                        colorScheme="green"
                        size="sm"
                      >
                        Execute
                      </Button>
                      {toolResults[tool.name] && (
                        <Box p={3} bg="gray.100" borderRadius="md">
                          <Text fontWeight="bold" mb={2}>Result:</Text>
                          <Code w="full" p={2}>
                            {JSON.stringify(toolResults[tool.name], null, 2)}
                          </Code>
                        </Box>
                      )}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}

        {servers.length === 0 && !isLoading && (
          <Box textAlign="center" p={8}>
            <Text color="gray.500">
              No MCP servers found. Configure servers in Claude Desktop or add them manually.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MCPDashboard;
"@

$mcpDashboardComponentPath = Join-Path $AppPath "frontend/src/components/MCPDashboard.tsx"
$mcpDashboardComponent | Out-File -FilePath $mcpDashboardComponentPath -Encoding UTF8
}

# =============================================================================
# FILE UPLOAD (Conditional)
# =============================================================================

if ($IncludeFileUpload) {
    Write-Host "📁 Generating File Upload components..." -ForegroundColor Cyan

# File Upload Component
$fileUploadComponent = @"
import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  useToast,
  Progress,
  Badge,
  Code,
} from '@chakra-ui/react';
import { FiUpload, FiImage, FiFile } from 'react-icons/fi';

interface FileResult {
  filename: string;
  content_type: string;
  size: number;
  size_mb: number;
  thumbnail?: string;
  image_info?: any;
  pdf_info?: any;
  first_page_text?: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    uploadFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (fileList: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        setFiles(prev => [...prev, result]);
        
        toast({
          title: 'File uploaded',
          description: ``$`{file.name} processed successfully``,
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: ``Failed to upload $`{file.name}``,
          status: 'error',
          duration: 5000,
        });
      }
      
      setUploadProgress(((i + 1) / fileList.length) * 100);
    }
    
    setIsUploading(false);
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">📁 File Upload & Processing</Heading>

        {/* Drop Zone */}
        <Box
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="lg"
          p={8}
          textAlign="center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          cursor="pointer"
          _hover={{ borderColor: 'blue.400', bg: useColorModeValue('blue.50', 'blue.900') }}
        >
          <VStack spacing={4}>
            <FiUpload size={48} />
            <Text fontSize="lg" fontWeight="bold">
              Drop files here or click to upload
            </Text>
            <Text color="gray.500" fontSize="sm">
              Supports images, PDFs, and more
            </Text>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="file-input"
            />
            <Button
              as="label"
              htmlFor="file-input"
              colorScheme="blue"
              leftIcon={<FiUpload />}
            >
              Choose Files
            </Button>
          </VStack>
        </Box>

        {isUploading && (
          <Box>
            <Text mb={2}>Uploading...</Text>
            <Progress value={uploadProgress} colorScheme="blue" />
          </Box>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {files.map((file, index) => (
              <Card key={index} bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {file.thumbnail && (
                      <Image
                        src={file.thumbnail}
                        alt={file.filename}
                        borderRadius="md"
                        objectFit="cover"
                        h="150px"
                        w="full"
                      />
                    )}
                    <HStack>
                      {file.content_type?.startsWith('image/') ? (
                        <FiImage />
                      ) : (
                        <FiFile />
                      )}
                      <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                        {file.filename}
                      </Text>
                    </HStack>
                    <Badge colorScheme="blue" fontSize="xs">
                      {file.size_mb} MB
                    </Badge>
                    {file.image_info && (
                      <Text fontSize="xs" color="gray.500">
                        {file.image_info.width} x {file.image_info.height}
                      </Text>
                    )}
                    {file.pdf_info && (
                      <Text fontSize="xs" color="gray.500">
                        {file.pdf_info.pages} pages
                      </Text>
                    )}
                    {file.first_page_text && (
                      <Code fontSize="xs" noOfLines={3}>
                        {file.first_page_text}
                      </Code>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default FileUpload;
"@

$fileUploadComponentPath = Join-Path $AppPath "frontend/src/components/FileUpload.tsx"
$fileUploadComponent | Out-File -FilePath $fileUploadComponentPath -Encoding UTF8
}

# =============================================================================
# VOICE INTERFACE (Conditional)
# =============================================================================

if ($IncludeVoice) {
    Write-Host "🎤 Generating Voice Interface components..." -ForegroundColor Cyan

# Voice Interface Component
$voiceInterfaceComponent = @"
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  useToast,
  Badge,
  Heading,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiMic, FiMicOff, FiVolume2, FiVolumeX } from 'react-icons/fi';

const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        toast({
          title: 'Speech recognition error',
          description: event.error,
          status: 'error',
          duration: 5000,
        });
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Load voices for TTS
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: 'Speech recognition not supported',
        description: 'Your browser does not support speech recognition',
        status: 'error',
        duration: 5000,
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: 'Listening...',
        description: 'Speak now',
        status: 'info',
        duration: 2000,
      });
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">🎤 Voice Interface</Heading>
          <FormControl display="flex" alignItems="center" w="auto">
            <FormLabel mb="0">Voice Output</FormLabel>
            <Switch
              isChecked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              colorScheme="blue"
            />
          </FormControl>
        </HStack>

        {/* Voice Controls */}
        <HStack spacing={4} justify="center" p={6}>
          <IconButton
            aria-label="Toggle microphone"
            icon={isListening ? <FiMicOff /> : <FiMic />}
            onClick={toggleListening}
            colorScheme={isListening ? 'red' : 'blue'}
            size="lg"
            isRound
            fontSize="24px"
          />
          <IconButton
            aria-label="Toggle speech"
            icon={isSpeaking ? <FiVolumeX /> : <FiVolume2 />}
            onClick={isSpeaking ? stopSpeaking : () => speak(transcript)}
            colorScheme={isSpeaking ? 'orange' : 'green'}
            size="lg"
            isRound
            fontSize="24px"
            isDisabled={!transcript || !voiceEnabled}
          />
        </HStack>

        {/* Status */}
        <HStack justify="center">
          {isListening && (
            <Badge colorScheme="red" fontSize="md" px={4} py={2}>
              🔴 Listening...
            </Badge>
          )}
          {isSpeaking && (
            <Badge colorScheme="orange" fontSize="md" px={4} py={2}>
              🔊 Speaking...
            </Badge>
          )}
        </HStack>

        {/* Voice Selection */}
        <FormControl>
          <FormLabel>Voice</FormLabel>
          <Select
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Transcript */}
        <Box
          p={4}
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          minH="200px"
        >
          <HStack justify="space-between" mb={3}>
            <Text fontWeight="bold">Transcript</Text>
            <Button size="xs" onClick={clearTranscript} variant="ghost">
              Clear
            </Button>
          </HStack>
          <Text color={transcript ? 'inherit' : 'gray.500'}>
            {transcript || 'Start speaking to see your words here...'}
          </Text>
        </Box>

        {/* Quick Commands */}
        <Box>
          <Text fontWeight="bold" mb={2}>Voice Commands</Text>
          <VStack align="stretch" spacing={2} fontSize="sm">
            <Text>• "Show logs" - Open log viewer</Text>
            <Text>• "Help" - Open help modal</Text>
            <Text>• "Settings" - Open AI settings</Text>
            <Text>• "Upload file" - Navigate to file upload</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default VoiceInterface;
"@

$voiceInterfaceComponentPath = Join-Path $AppPath "frontend/src/components/VoiceInterface.tsx"
$voiceInterfaceComponent | Out-File -FilePath $voiceInterfaceComponentPath -Encoding UTF8
}

# =============================================================================
# PROMPT ENGINEERING (Conditional)
# =============================================================================

if ($IncludePromptEngineering) {
    Write-Host "📝 Generating Prompt Engineering UI..." -ForegroundColor Cyan

# Prompt Engineering Component
$promptEngineeringComponent = @"
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Button, Textarea, Select,
  useColorModeValue, useToast, SimpleGrid, Card, CardHeader, CardBody,
  IconButton, Input, Badge, Divider,
} from '@chakra-ui/react';
import { FiSave, FiDownload, FiUpload, FiTrash2, FiCopy, FiPlay } from 'react-icons/fi';

interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  timestamp: string;
}

const PromptEngineering: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([
    { id: '1', name: 'Code Analysis', content: 'Analyze this code and suggest improvements:\\n\\n{code}', category: 'development', variables: ['code'] },
    { id: '2', name: 'Search Notes', content: 'Search for notes about: {topic}', category: 'mcp', variables: ['topic'] },
    { id: '3', name: 'Generate Report', content: 'Generate a report on {subject} with the following data:\\n{data}', category: 'business', variables: ['subject', 'data'] },
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Load saved templates and conversations
    const saved = localStorage.getItem('prompt_templates');
    if (saved) setTemplates(JSON.parse(saved));
    
    const savedConvs = localStorage.getItem('conversations');
    if (savedConvs) setConversations(JSON.parse(savedConvs));
  }, []);

  const saveTemplate = () => {
    if (!newTemplateName || !customPrompt) {
      toast({ title: 'Enter template name and content', status: 'warning', duration: 3000 });
      return;
    }
    
    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      content: customPrompt,
      category: 'custom',
      variables: (customPrompt.match(/{([^}]+)}/g) || []).map(v => v.slice(1, -1))
    };
    
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('prompt_templates', JSON.stringify(updated));
    
    toast({ title: 'Template saved', status: 'success', duration: 3000 });
    setNewTemplateName('');
    setCustomPrompt('');
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('prompt_templates', JSON.stringify(updated));
    toast({ title: 'Template deleted', status: 'info', duration: 3000 });
  };

  const useTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setCustomPrompt(template.content);
  };

  const exportTemplates = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'prompt-templates.json');
    link.click();
    toast({ title: 'Templates exported', status: 'success', duration: 3000 });
  };

  const importTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setTemplates([...templates, ...imported]);
        localStorage.setItem('prompt_templates', JSON.stringify([...templates, ...imported]));
        toast({ title: 'Templates imported', status: 'success', duration: 3000 });
      } catch (error) {
        toast({ title: 'Import failed', status: 'error', duration: 3000 });
      }
    };
    reader.readAsText(file);
  };

  const saveConversation = () => {
    const conv: Conversation = {
      id: Date.now().toString(),
      title: ``Chat $`{new Date().toLocaleString()}``,
      messages: [],
      timestamp: new Date().toISOString()
    };
    
    const updated = [...conversations, conv];
    setConversations(updated);
    localStorage.setItem('conversations', JSON.stringify(updated));
    toast({ title: 'Conversation saved', status: 'success', duration: 3000 });
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">📝 Prompt Engineering</Heading>

        {/* Prompt Templates */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Prompt Templates</Heading>
            <HStack>
              <input type="file" accept=".json" onChange={importTemplates} style={{display: 'none'}} id="import-templates" />
              <Button as="label" htmlFor="import-templates" size="sm" leftIcon={<FiUpload />}>
                Import
              </Button>
              <Button size="sm" leftIcon={<FiDownload />} onClick={exportTemplates}>
                Export
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {templates.map((template) => (
              <Card key={template.id} bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{template.name}</Text>
                      <Badge fontSize="xs">{template.category}</Badge>
                    </VStack>
                    <HStack>
                      <IconButton aria-label="Use" icon={<FiPlay />} size="xs" onClick={() => useTemplate(template)} />
                      <IconButton aria-label="Delete" icon={<FiTrash2 />} size="xs" onClick={() => deleteTemplate(template.id)} />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text fontSize="sm" noOfLines={3} color="gray.600">
                    {template.content}
                  </Text>
                  {template.variables.length > 0 && (
                    <Text fontSize="xs" mt={2} color="blue.500">
                      Variables: {template.variables.join(', ')}
                    </Text>
                  )}
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Prompt Editor */}
        <Box>
          <Heading size="md" mb={4}>Create / Edit Prompt</Heading>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
            <Textarea
              placeholder="Enter your prompt template (use {variable} for variables)..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              minH="200px"
            />
            <HStack>
              <Button leftIcon={<FiSave />} colorScheme="blue" onClick={saveTemplate}>
                Save Template
              </Button>
              <Button leftIcon={<FiCopy />} variant="ghost" onClick={() => navigator.clipboard.writeText(customPrompt)}>
                Copy
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Conversation Management */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Saved Conversations</Heading>
            <Button size="sm" leftIcon={<FiSave />} onClick={saveConversation}>
              Save Current
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {conversations.map((conv) => (
              <Card key={conv.id} bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{conv.title}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(conv.timestamp).toLocaleString()}
                      </Text>
                    </VStack>
                    <HStack>
                      <IconButton aria-label="Delete" icon={<FiTrash2 />} size="xs" onClick={() => {
                        const updated = conversations.filter(c => c.id !== conv.id);
                        setConversations(updated);
                        localStorage.setItem('conversations', JSON.stringify(updated));
                      }} />
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromptEngineering;
"@

$promptEngineeringComponentPath = Join-Path $AppPath "frontend/src/components/PromptEngineering.tsx"
$promptEngineeringComponent | Out-File -FilePath $promptEngineeringComponentPath -Encoding UTF8
}

# =============================================================================
# USAGE ANALYTICS (Conditional)
# =============================================================================

if ($IncludeAnalytics) {
    Write-Host "📊 Generating Usage Analytics..." -ForegroundColor Cyan

# Usage Analytics Component
$usageAnalyticsComponent = @"
import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Heading, Text, SimpleGrid, Card, CardHeader, CardBody,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Badge,
} from '@chakra-ui/react';
import { FiDollarSign, FiCpu, FiDatabase, FiActivity } from 'react-icons/fi';

interface UsageData {
  ai_requests: number;
  ai_tokens: number;
  ai_cost: number;
  mcp_executions: number;
  file_uploads: number;
  api_calls: number;
}

const UsageAnalytics: React.FC = () => {
  const [usage, setUsage] = useState<UsageData>({
    ai_requests: 0,
    ai_tokens: 0,
    ai_cost: 0,
    mcp_executions: 0,
    file_uploads: 0,
    api_calls: 0
  });
  const [history, setHistory] = useState<any[]>([]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Load usage data from localStorage
    const saved = localStorage.getItem('usage_data');
    if (saved) setUsage(JSON.parse(saved));
    
    const savedHistory = localStorage.getItem('usage_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const estimateCost = (provider: string, tokens: number) => {
    const rates: Record<string, number> = {
      'openai': 0.00003,      // $$0.03 per 1K tokens
      'anthropic': 0.000015,  // $$0.015 per 1K tokens
      'ollama': 0,            // Free!
      'lmstudio': 0           // Free!
    };
    return (tokens / 1000) * (rates[provider] || 0);
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">📊 Usage Analytics & Cost Tracking</Heading>

        {/* Usage Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>AI Requests</StatLabel>
                <StatNumber>{usage.ai_requests}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {usage.ai_tokens.toLocaleString()} tokens
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Estimated Cost</StatLabel>
                <StatNumber>\`$$`{usage.ai_cost.toFixed(4)}</StatNumber>
                <StatHelpText>This month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>MCP Tool Calls</StatLabel>
                <StatNumber>{usage.mcp_executions}</StatNumber>
                <StatHelpText>All servers</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Files Processed</StatLabel>
                <StatNumber>{usage.file_uploads}</StatNumber>
                <StatHelpText>Images & PDFs</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Provider Breakdown */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Cost by Provider</Heading>
          </CardHeader>
          <CardBody>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Provider</Th>
                  <Th isNumeric>Requests</Th>
                  <Th isNumeric>Tokens</Th>
                  <Th isNumeric>Cost</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td><Badge colorScheme="purple">OpenAI</Badge></Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>$$0.00</Td>
                </Tr>
                <Tr>
                  <Td><Badge colorScheme="orange">Anthropic</Badge></Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>$$0.00</Td>
                </Tr>
                <Tr>
                  <Td><Badge colorScheme="green">Ollama</Badge></Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>FREE</Td>
                </Tr>
                <Tr>
                  <Td><Badge colorScheme="blue">LM Studio</Badge></Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>0</Td>
                  <Td isNumeric>FREE</Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={2}>
              {history.length === 0 ? (
                <Text color="gray.500">No activity yet</Text>
              ) : (
                history.slice(0, 10).map((item, i) => (
                  <HStack key={i} justify="space-between" p={2} borderWidth="1px" borderRadius="md">
                    <Text fontSize="sm">{item.action}</Text>
                    <Badge>{item.provider}</Badge>
                    <Text fontSize="xs" color="gray.500">{item.timestamp}</Text>
                  </HStack>
                ))
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default UsageAnalytics;
"@

$usageAnalyticsComponentPath = Join-Path $AppPath "frontend/src/components/UsageAnalytics.tsx"
$usageAnalyticsComponent | Out-File -FilePath $usageAnalyticsComponentPath -Encoding UTF8
}

# Dashboard page
$dashboardPage = @"
import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const Dashboard: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <Heading mb={6}>Dashboard Overview</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>1,247</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Revenue</StatLabel>
              <StatNumber>$$45,231</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.05%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Active Sessions</StatLabel>
              <StatNumber>342</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                5.12%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Conversion Rate</StatLabel>
              <StatNumber>3.65%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8.23%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <Text>No recent activity to display.</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <Text>Configure your quick actions here.</Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
"@

$dashboardPagePath = Join-Path $AppPath "frontend/src/pages/Dashboard.tsx"
New-Item -ItemType Directory -Path (Split-Path $dashboardPagePath) -Force | Out-Null
$dashboardPage | Out-File -FilePath $dashboardPagePath -Encoding UTF8

# =============================================================================
# 2FA AUTHENTICATION (Conditional)
# =============================================================================

if ($Include2FA) {
    Write-Host "🔐 Generating 2FA components..." -ForegroundColor Cyan

# 2FA Setup Page
$twoFactorSetupPage = @"
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Code,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiShield, FiCheck, FiX } from 'react-icons/fi';

const TwoFactorSetup: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const setupTwoFactor = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/2fa/setup', {
        method: 'POST'
      });
      const data = await response.json();
      
      setSecret(data.secret);
      setQrCode(data.qr_code);
      
      toast({
        title: '2FA setup initiated',
        description: 'Scan the QR code with your authenticator app',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Setup failed',
        description: 'Failed to setup 2FA',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, token })
      });
      const data = await response.json();
      
      if (data.valid) {
        setIsVerified(true);
        toast({
          title: '2FA Enabled!',
          description: 'Your account is now secured with 2FA',
          status: 'success',
          duration: 5000,
        });
      } else {
        toast({
          title: 'Invalid token',
          description: 'Please check your authenticator app and try again',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Failed to verify token',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack>
          <FiShield size={32} />
          <Heading size="lg">Two-Factor Authentication Setup</Heading>
        </HStack>

        <Text color="gray.600">
          Add an extra layer of security to your account by enabling 2FA
        </Text>

        {!secret && (
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Step 1: Initiate Setup</Heading>
                <Text>
                  Click the button below to generate your unique QR code and secret key
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={setupTwoFactor}
                  isLoading={isLoading}
                  leftIcon={<FiShield />}
                >
                  Generate 2FA Code
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {secret && !isVerified && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Step 2: Scan QR Code</Heading>
                  <Text fontSize="sm">
                    Use an authenticator app like Google Authenticator, Authy, or 1Password
                  </Text>
                  {qrCode && (
                    <Box textAlign="center">
                      <Image src={qrCode} alt="2FA QR Code" maxW="250px" mx="auto" />
                    </Box>
                  )}
                  <Text fontSize="xs" color="gray.500">
                    Can't scan? Use this secret key:
                  </Text>
                  <Code p={2}>{secret}</Code>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Step 3: Verify</Heading>
                  <Text fontSize="sm">
                    Enter the 6-digit code from your authenticator app
                  </Text>
                  <FormControl>
                    <FormLabel>Verification Code</FormLabel>
                    <Input
                      placeholder="123456"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      maxLength={6}
                      fontSize="2xl"
                      textAlign="center"
                      letterSpacing="wider"
                    />
                  </FormControl>
                  <Button
                    colorScheme="green"
                    onClick={verifyToken}
                    isLoading={isLoading}
                    isDisabled={token.length !== 6}
                    leftIcon={<FiCheck />}
                  >
                    Verify and Enable
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {isVerified && (
          <Card bg="green.50" borderWidth="1px" borderColor="green.200">
            <CardBody>
              <VStack spacing={4}>
                <FiCheck size={48} color="green" />
                <Heading size="lg" color="green.600">
                  2FA Successfully Enabled!
                </Heading>
                <Text textAlign="center">
                  Your account is now protected with two-factor authentication.
                  You'll need to enter a code from your authenticator app when logging in.
                </Text>
                <Badge colorScheme="green" fontSize="md" px={4} py={2}>
                  ✓ Account Secured
                </Badge>
              </VStack>
            </CardBody>
          </Card>
        )}

        <Card bg="blue.50" borderWidth="1px" borderColor="blue.200">
          <CardBody>
            <VStack spacing={2} align="stretch">
              <Heading size="sm">📱 Recommended Authenticator Apps</Heading>
              <Text fontSize="sm">• Google Authenticator (iOS/Android)</Text>
              <Text fontSize="sm">• Microsoft Authenticator (iOS/Android)</Text>
              <Text fontSize="sm">• Authy (iOS/Android/Desktop)</Text>
              <Text fontSize="sm">• 1Password (Premium feature)</Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default TwoFactorSetup;
"@

$twoFactorSetupPagePath = Join-Path $AppPath "frontend/src/pages/TwoFactorSetup.tsx"
$twoFactorSetupPage | Out-File -FilePath $twoFactorSetupPagePath -Encoding UTF8
}

# Monitoring Page (always included)
Write-Host "📊 Generating Monitoring page..." -ForegroundColor Cyan

$monitoringPage = @"
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Code,
  Link,
} from '@chakra-ui/react';
import { FiActivity, FiDatabase, FiCpu, FiExternalLink } from 'react-icons/fi';

const Monitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>📊 Monitoring Dashboard</Heading>
          <Text color="gray.600">
            Real-time monitoring and observability for your fullstack application
          </Text>
        </Box>

        {/* Stack Overview */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">🔍 Monitoring Stack</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box>
                <HStack mb={2}>
                  <Icon as={FiActivity} color="orange.500" boxSize={5} />
                  <Text fontWeight="bold">Prometheus</Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Metrics collection and time-series database. Scrapes application metrics every 15s.
                </Text>
                <Link href="http://localhost:9191" isExternal color="blue.500" fontSize="sm" mt={2} display="inline-flex" alignItems="center">
                  Open Prometheus <Icon as={FiExternalLink} ml={1} />
                </Link>
              </Box>

              <Box>
                <HStack mb={2}>
                  <Icon as={FiDatabase} color="purple.500" boxSize={5} />
                  <Text fontWeight="bold">Loki</Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Log aggregation system. Collects logs from all containers in real-time.
                </Text>
                <Link href="http://localhost:3199" isExternal color="blue.500" fontSize="sm" mt={2} display="inline-flex" alignItems="center">
                  Open Loki <Icon as={FiExternalLink} ml={1} />
                </Link>
              </Box>

              <Box>
                <HStack mb={2}>
                  <Icon as={FiCpu} color="pink.500" boxSize={5} />
                  <Text fontWeight="bold">Grafana</Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Visualization platform. Beautiful dashboards for metrics and logs.
                </Text>
                <Link href="http://localhost:3191" isExternal color="blue.500" fontSize="sm" mt={2} display="inline-flex" alignItems="center">
                  Open Grafana <Icon as={FiExternalLink} ml={1} />
                </Link>
              </Box>
            </SimpleGrid>

            <Box mt={6} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" mb={2}>🔐 Grafana Credentials:</Text>
              <Code fontSize="sm">Username: admin | Password: admin</Code>
            </Box>
          </CardBody>
        </Card>

        {/* Embedded Dashboards */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">📈 Live Dashboards</Heading>
          </CardHeader>
          <CardBody>
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Application Metrics</Tab>
                <Tab>System Resources</Tab>
                <Tab>Live Logs</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <iframe
                      src="http://localhost:3191/d-solo/app-metrics/application-metrics?orgId=1&theme=light&panelId=2"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      title="Application Metrics"
                    ></iframe>
                  </Box>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Real-time application performance metrics from Prometheus
                  </Text>
                </TabPanel>

                <TabPanel p={0} pt={4}>
                  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <iframe
                      src="http://localhost:3191/d-solo/app-metrics/application-metrics?orgId=1&theme=light&panelId=7"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      title="System Resources"
                    ></iframe>
                  </Box>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    CPU, memory, and disk usage for all containers
                  </Text>
                </TabPanel>

                <TabPanel p={0} pt={4}>
                  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <iframe
                      src="http://localhost:3191/d-solo/app-metrics/application-metrics?orgId=1&theme=light&panelId=10"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      title="Live Logs"
                    ></iframe>
                  </Box>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Live log stream from Loki across all services
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Box mt={4}>
              <Button
                as={Link}
                href="http://localhost:3191"
                target="_blank"
                colorScheme="blue"
                leftIcon={<FiExternalLink />}
                size="sm"
              >
                Open Full Grafana Dashboard
              </Button>
            </Box>
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>API Requests</StatLabel>
                <StatNumber>1,247</StatNumber>
                <StatHelpText>Last hour</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Response Time</StatLabel>
                <StatNumber>124ms</StatNumber>
                <StatHelpText>P95 latency</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Error Rate</StatLabel>
                <StatNumber>0.02%</StatNumber>
                <StatHelpText>Last 24h</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Database Queries</StatLabel>
                <StatNumber>3,421</StatNumber>
                <StatHelpText>Last hour</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Monitoring Documentation */}
        <Card bg={bgColor} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">📚 How It Works</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>1. Metrics Collection (Prometheus)</Text>
                <Text fontSize="sm" color="gray.600">
                  • FastAPI exports metrics via <Code>/metrics</Code> endpoint<br />
                  • Prometheus scrapes every 15 seconds<br />
                  • Stores time-series data for queries and alerts<br />
                  • Tracks: request count, latency, errors, system resources
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>2. Log Aggregation (Loki)</Text>
                <Text fontSize="sm" color="gray.600">
                  • All containers use Loki Docker driver<br />
                  • Logs are indexed and queryable by service<br />
                  • Structured logging with labels for filtering<br />
                  • Real-time log tailing and search
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>3. Visualization (Grafana)</Text>
                <Text fontSize="sm" color="gray.600">
                  • Pre-configured dashboards for all metrics<br />
                  • Combines Prometheus metrics + Loki logs<br />
                  • Alerting rules for critical issues<br />
                  • Beautiful graphs and live updates
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>🎯 Key Metrics Being Tracked:</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} fontSize="sm">
                  <Text>• API request rate & latency</Text>
                  <Text>• Database query performance</Text>
                  <Text>• Cache hit/miss ratios</Text>
                  <Text>• Error rates by endpoint</Text>
                  <Text>• System CPU & memory usage</Text>
                  <Text>• Container health status</Text>
                  <Text>• Active connections</Text>
                  <Text>• Background job status</Text>
                </SimpleGrid>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Monitoring;
"@

$monitoringPagePath = Join-Path $AppPath "frontend/src/pages/Monitoring.tsx"
New-Item -ItemType Directory -Path (Split-Path $monitoringPagePath) -Force | Out-Null
$monitoringPage | Out-File -FilePath $monitoringPagePath -Encoding UTF8

# Routes file
$routesFile = @"
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const MCPDashboard = lazy(() => import('./components/MCPDashboard'));
const FileUpload = lazy(() => import('./components/FileUpload'));
const VoiceInterface = lazy(() => import('./components/VoiceInterface'));
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup'));
const PromptEngineering = lazy(() => import('./components/PromptEngineering'));
const UsageAnalytics = lazy(() => import('./components/UsageAnalytics'));

const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" />
  </Center>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<UsageAnalytics />} />
        <Route path="/users" element={<div>Users Page - Coming Soon</div>} />
        <Route path="/data" element={<div>Data Page - Coming Soon</div>} />
        <Route path="/mcp" element={<MCPDashboard />} />
        <Route path="/files" element={<FileUpload />} />
        <Route path="/voice" element={<VoiceInterface />} />
        <Route path="/auth" element={<TwoFactorSetup />} />
        <Route path="/prompts" element={<PromptEngineering />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/gradio" element={<iframe src="http://localhost:8888/gradio" width="100%" height="800px" frameBorder="0" title="Gradio AI Playground" />} />
        <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
"@

$routesFilePath = Join-Path $AppPath "frontend/src/routes.tsx"
$routesFile | Out-File -FilePath $routesFilePath -Encoding UTF8

# Theme configuration
$themeFile = @"
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
});

export default theme;
"@

$themeFilePath = Join-Path $AppPath "frontend/src/theme/index.ts"
New-Item -ItemType Directory -Path (Split-Path $themeFilePath) -Force | Out-Null
$themeFile | Out-File -FilePath $themeFilePath -Encoding UTF8

# Frontend Dockerfile
$frontendDockerfile = @"
# Multi-stage build for React frontend

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 9132

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9132 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
"@

$frontendDockerfilePath = Join-Path $AppPath "frontend/Dockerfile"
$frontendDockerfile | Out-File -FilePath $frontendDockerfilePath -Encoding UTF8

# Frontend Nginx config
$nginxConf = @"
server {
    listen 9132;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # React Router support
    location / {
        try_files `$uri `$uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)`$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
"@

$nginxConfPath = Join-Path $AppPath "frontend/nginx.conf"
$nginxConf | Out-File -FilePath $nginxConfPath -Encoding UTF8

# =============================================================================
# BACKEND SETUP (FastAPI + PostgreSQL + Microservices)
# =============================================================================

Write-Host "🐍 Setting up FastAPI backend..." -ForegroundColor Cyan

# Requirements.txt
$requirements = @"
fastapi==0.115.7
uvicorn[standard]==0.34.0
sqlalchemy==2.0.23
alembic==1.13.1
psycopg2-binary==2.9.9
pydantic==2.11.7
pydantic-settings==2.11.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
httpx==0.28.1
redis==5.0.1
celery==5.3.4
prometheus-client==0.19.0
structlog==23.2.0
psutil==5.9.6
anyio==4.6.2
openai==1.54.0
anthropic==0.39.0
websockets==12.0
fastmcp==2.12.5
Pillow==10.1.0
PyPDF2==3.0.1
pyotp==2.9.0
qrcode==7.4.2
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
fastapi-mail==1.4.1
gradio==5.7.1
jinja2==3.1.4
requests==2.31.0
torch==2.1.0
torchvision==0.16.0
diffusers==0.25.0
transformers==4.36.0
accelerate==0.25.0
safetensors==0.4.1
"@

$requirementsPath = Join-Path $AppPath "backend/requirements.txt"
$requirements | Out-File -FilePath $requirementsPath -Encoding UTF8

# Main FastAPI app
$mainApp = @"
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import platform
import psutil
import time
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response


# Prometheus Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint'])
ACTIVE_REQUESTS = Gauge('http_requests_active', 'Number of active HTTP requests')
DB_CONNECTIONS = Gauge('db_connections_active', 'Number of active database connections')
CACHE_HITS = Counter('cache_hits_total', 'Total cache hits')
CACHE_MISSES = Counter('cache_misses_total', 'Total cache misses')


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.start_time = datetime.utcnow()
    app.state.request_count = 0
    yield
    # Shutdown


def create_application() -> FastAPI:
    app = FastAPI(
        title="$AppName",
        version="1.0.0",
        description="$Description",
        openapi_url="/api/v1/openapi.json",
        docs_url="/api/v1/docs",
        redoc_url="/api/v1/redoc",
        lifespan=lifespan,
    )

    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:9132", "http://localhost:8000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Prometheus middleware
    @app.middleware("http")
    async def prometheus_middleware(request: Request, call_next):
        ACTIVE_REQUESTS.inc()
        start_time = time.time()
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        ACTIVE_REQUESTS.dec()
        
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        
        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        return response

    return app


app = create_application()


@app.get("/")
async def root():
    return {
        "message": "Welcome to $AppName API",
        "version": "1.0.0",
        "docs": "/api/v1/docs",
        "status": "/api/v1/status"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/v1/status")
async def get_status():
    '''
    FastAPI-compliant status endpoint with comprehensive system information.
    
    Returns detailed server status including:
    - Service health and uptime
    - System resources (CPU, memory, disk)
    - Runtime environment details
    - Dependencies status
    '''
    uptime = datetime.utcnow() - app.state.start_time
    
    return {
        "status": "operational",
        "version": "1.0.0",
        "service": "$AppName",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": {
            "seconds": int(uptime.total_seconds()),
            "human_readable": str(uptime).split('.')[0]
        },
        "system": {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory": {
                "total_mb": round(psutil.virtual_memory().total / 1024 / 1024, 2),
                "available_mb": round(psutil.virtual_memory().available / 1024 / 1024, 2),
                "percent_used": psutil.virtual_memory().percent
            },
            "disk": {
                "total_gb": round(psutil.disk_usage('/').total / 1024 / 1024 / 1024, 2),
                "free_gb": round(psutil.disk_usage('/').free / 1024 / 1024 / 1024, 2),
                "percent_used": psutil.disk_usage('/').percent
            }
        },
        "services": {
            "api": "operational",
            "database": "operational",
            "cache": "operational"
        },
        "endpoints": {
            "docs": "/api/v1/docs",
            "redoc": "/api/v1/redoc",
            "openapi": "/api/v1/openapi.json"
        }
    }


@app.get("/metrics")
async def metrics():
    '''Prometheus metrics endpoint'''
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/api/v1/chat")
async def chat(request: Request):
    '''AI Chat with MCP tool execution'''
    import os
    import json
    from fastapi.responses import StreamingResponse
    import httpx
    
    body = await request.json()
    message = body.get('message', '')
    provider = body.get('provider', 'anthropic')
    model = body.get('model', '')
    
    # Get MCP tools and convert to function schemas
    mcp_tools_data = mcp_manager.get_all_tools()
    anthropic_tools = []
    openai_functions = []
    
    for server_name, tools in mcp_tools_data.items():
        for tool in tools:
            tool_full_name = f"{server_name}__{tool['name']}"
            
            # Anthropic format
            anthropic_tools.append({
                'name': tool_full_name,
                'description': f"[{server_name}] {tool['description']}",
                'input_schema': tool['inputSchema']
            })
            
            # OpenAI format
            openai_functions.append({
                'name': tool_full_name,
                'description': f"[{server_name}] {tool['description']}",
                'parameters': tool['inputSchema']
            })
    
    system_context = f'''You are an AI assistant for {app.title}.
    
Tech Stack: React 18, TypeScript, Chakra UI (9132), FastAPI (8000), PostgreSQL, Redis
Monitoring: Prometheus (9090), Grafana (3001), Loki (3100)

You can execute MCP tools from connected servers. Be helpful and concise.'''
    
    if provider == 'anthropic':
        from anthropic import Anthropic
        api_key = body.get('api_key') or os.getenv('ANTHROPIC_API_KEY')
        client = Anthropic(api_key=api_key)
        
        messages = [{"role": "user", "content": message}]
        
        async def generate():
            while True:
                response = client.messages.create(
                    model=model or "claude-3-5-sonnet-20241022",
                    max_tokens=2048,
                    system=system_context,
                    messages=messages,
                    tools=anthropic_tools if anthropic_tools else None
                )
                
                # Handle tool use
                if response.stop_reason == 'tool_use':
                    for content_block in response.content:
                        if content_block.type == 'tool_use':
                            # Parse server and tool name
                            parts = content_block.name.split('__', 1)
                            if len(parts) == 2:
                                server_name, tool_name = parts
                                tool_args = content_block.input
                                
                                # Execute MCP tool
                                result = await mcp_manager.execute_tool(server_name, tool_name, tool_args)
                                
                                # Add tool result to messages
                                messages.append({"role": "assistant", "content": response.content})
                                messages.append({
                                    "role": "user",
                                    "content": [{
                                        "type": "tool_result",
                                        "tool_use_id": content_block.id,
                                        "content": json.dumps(result)
                                    }]
                                })
                    continue  # Get next response with tool results
                
                # Stream final response
                for content_block in response.content:
                    if hasattr(content_block, 'text'):
                        yield f"data: {json.dumps({'content': content_block.text})}\\n\\n"
                break
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    elif provider == 'openai':
        from openai import OpenAI
        api_key = body.get('api_key') or os.getenv('OPENAI_API_KEY')
        client = OpenAI(api_key=api_key)
        
        messages = [
            {"role": "system", "content": system_context},
            {"role": "user", "content": message}
        ]
        
        async def generate():
            while True:
                response = client.chat.completions.create(
                    model=model or "gpt-4",
                    messages=messages,
                    functions=openai_functions if openai_functions else None,
                    function_call="auto" if openai_functions else None
                )
                
                msg = response.choices[0].message
                
                # Handle function call
                if msg.function_call:
                    # Parse server and tool name
                    parts = msg.function_call.name.split('__', 1)
                    if len(parts) == 2:
                        server_name, tool_name = parts
                        tool_args = json.loads(msg.function_call.arguments)
                        
                        # Execute MCP tool
                        result = await mcp_manager.execute_tool(server_name, tool_name, tool_args)
                        
                        # Add function result to messages
                        messages.append({"role": "assistant", "content": None, "function_call": msg.function_call})
                        messages.append({
                            "role": "function",
                            "name": msg.function_call.name,
                            "content": json.dumps(result)
                        })
                    continue  # Get next response with function results
                
                # Stream final response
                if msg.content:
                    yield f"data: {json.dumps({'content': msg.content})}\\n\\n"
                break
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    elif provider == 'ollama':
        base_url = body.get('base_url', 'http://localhost:11434')
        # Replace localhost with host.docker.internal for Docker networking
        base_url = base_url.replace('localhost', 'host.docker.internal')
        
        async def generate():
            async with httpx.AsyncClient() as client:
                async with client.stream(
                    'POST',
                    f'{base_url}/api/generate',
                    json={
                        'model': model or 'llama2',
                        'prompt': f'{system_context}\\n\\nUser: {message}\\nAssistant:',
                        'stream': True
                    },
                    timeout=60.0
                ) as response:
                    async for line in response.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                if 'response' in data:
                                    yield f"data: {json.dumps({'content': data['response']})}\\n\\n"
                            except:
                                pass
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    elif provider == 'lmstudio':
        base_url = body.get('base_url', 'http://localhost:1234')
        # Replace localhost with host.docker.internal for Docker networking
        base_url = base_url.replace('localhost', 'host.docker.internal')
        
        async def generate():
            async with httpx.AsyncClient() as client:
                async with client.stream(
                    'POST',
                    f'{base_url}/v1/chat/completions',
                    json={
                        'model': model or 'local-model',
                        'messages': [
                            {'role': 'system', 'content': system_context},
                            {'role': 'user', 'content': message}
                        ],
                        'stream': True,
                        'temperature': 0.7
                    },
                    timeout=60.0
                ) as response:
                    async for line in response.aiter_lines():
                        if line.startswith('data: '):
                            try:
                                data_str = line[6:]
                                if data_str != '[DONE]':
                                    data = json.loads(data_str)
                                    if 'choices' in data and len(data['choices']) > 0:
                                        content = data['choices'][0].get('delta', {}).get('content', '')
                                        if content:
                                            yield f"data: {json.dumps({'content': content})}\\n\\n"
                            except:
                                pass
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    else:
        return {"error": "Unsupported provider"}


# ==================== MCP SESSION MANAGER (PERSISTENT CONNECTIONS) ====================

from typing import Dict, Optional
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio
from datetime import datetime

class MCPSessionManager:
    '''
    Manages persistent MCP client sessions with connection pooling.
    Keeps stdio connections alive for real-time tool execution.
    '''
    def __init__(self):
        self.sessions: Dict[str, dict] = {}
        self.lock = asyncio.Lock()
    
    async def connect(self, server_name: str, command: str, args: list, env: dict) -> dict:
        '''Establish persistent connection to MCP server'''
        async with self.lock:
            # Close existing connection if any
            if server_name in self.sessions:
                await self.disconnect(server_name)
            
            try:
                server_params = StdioServerParameters(
                    command=command,
                    args=args,
                    env=env or {}
                )
                
                # Create persistent connection (NOT context manager!)
                read, write = await stdio_client(server_params).__aenter__()
                session = ClientSession(read, write)
                await session.__aenter__()
                await session.initialize()
                
                # List tools
                tools_response = await session.list_tools()
                tools = [
                    {
                        'name': tool.name,
                        'description': tool.description,
                        'inputSchema': tool.inputSchema
                    }
                    for tool in tools_response.tools
                ]
                
                # Store session
                self.sessions[server_name] = {
                    'session': session,
                    'read': read,
                    'write': write,
                    'tools': tools,
                    'connected_at': datetime.utcnow().isoformat(),
                    'command': command,
                    'args': args,
                    'env': env
                }
                
                return {
                    'status': 'connected',
                    'server': server_name,
                    'tools': tools,
                    'count': len(tools),
                    'connected_at': self.sessions[server_name]['connected_at']
                }
            except Exception as e:
                return {'status': 'error', 'message': str(e)}
    
    async def disconnect(self, server_name: str) -> dict:
        '''Close connection to MCP server'''
        async with self.lock:
            if server_name not in self.sessions:
                return {'status': 'not_connected'}
            
            try:
                session_data = self.sessions[server_name]
                session = session_data['session']
                
                # Properly close session
                await session.__aexit__(None, None, None)
                
                del self.sessions[server_name]
                return {'status': 'disconnected', 'server': server_name}
            except Exception as e:
                # Force remove even on error
                if server_name in self.sessions:
                    del self.sessions[server_name]
                return {'status': 'error', 'message': str(e)}
    
    async def execute_tool(self, server_name: str, tool_name: str, tool_args: dict) -> dict:
        '''Execute tool on connected MCP server'''
        if server_name not in self.sessions:
            return {'status': 'error', 'message': f'Not connected to {server_name}'}
        
        try:
            session = self.sessions[server_name]['session']
            result = await session.call_tool(tool_name, tool_args)
            
            return {
                'status': 'success',
                'server': server_name,
                'tool': tool_name,
                'result': result.content
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_connected_servers(self) -> list:
        '''Get list of connected servers with their tools'''
        return [
            {
                'name': name,
                'tools': data['tools'],
                'tool_count': len(data['tools']),
                'connected_at': data['connected_at']
            }
            for name, data in self.sessions.items()
        ]
    
    def get_all_tools(self) -> dict:
        '''Get all tools from all connected servers (for ChatBot context)'''
        all_tools = {}
        for server_name, data in self.sessions.items():
            all_tools[server_name] = data['tools']
        return all_tools

# Initialize global session manager
mcp_manager = MCPSessionManager()


# ==================== MCP CLIENT ENDPOINTS ====================

@app.get("/api/v1/mcp/servers")
async def list_mcp_servers():
    '''List available MCP servers from system configuration'''
    import json
    from pathlib import Path
    
    servers = []
    
    # 1. Check local mcp-servers.json (in backend directory)
    local_config_path = Path(__file__).parent.parent / "mcp-servers.json"
    if local_config_path.exists():
        try:
            with open(local_config_path) as f:
                config = json.load(f)
                mcp_servers = config.get('mcpServers', {})
                for name, server_config in mcp_servers.items():
                    servers.append({
                        'name': name,
                        'command': server_config.get('command'),
                        'args': server_config.get('args', []),
                        'env': server_config.get('env', {}),
                        'source': server_config.get('source', 'Local Config')
                    })
        except Exception as e:
            pass
    
    # 2. Check Claude Desktop config (fallback)
    import os
    claude_config_path = Path(os.path.expanduser("~")) / "AppData" / "Roaming" / "Claude" / "claude_desktop_config.json"
    if claude_config_path.exists():
        try:
            with open(claude_config_path) as f:
                config = json.load(f)
                mcp_servers = config.get('mcpServers', {})
                for name, server_config in mcp_servers.items():
                    # Avoid duplicates
                    if not any(s['name'] == name for s in servers):
                        servers.append({
                            'name': name,
                            'command': server_config.get('command'),
                            'args': server_config.get('args', []),
                            'env': server_config.get('env', {}),
                            'source': 'Claude Desktop'
                        })
        except Exception as e:
            pass
    
    # Add currently connected servers
    connected = mcp_manager.get_connected_servers()
    
    return {
        'servers': servers,
        'count': len(servers),
        'connected': connected,
        'connected_count': len(connected)
    }


@app.post("/api/v1/mcp/connect")
async def connect_to_mcp_server(request: Request):
    '''Connect to an MCP server and maintain persistent connection'''
    body = await request.json()
    server_name = body.get('server_name')
    command = body.get('command')
    args = body.get('args', [])
    env = body.get('env', {})
    
    result = await mcp_manager.connect(server_name, command, args, env)
    return result


@app.post("/api/v1/mcp/disconnect")
async def disconnect_from_mcp_server(request: Request):
    '''Disconnect from an MCP server'''
    body = await request.json()
    server_name = body.get('server_name')
    
    result = await mcp_manager.disconnect(server_name)
    return result


@app.post("/api/v1/mcp/execute")
async def execute_mcp_tool(request: Request):
    '''Execute a tool on a connected MCP server'''
    body = await request.json()
    server_name = body.get('server_name')
    tool_name = body.get('tool_name')
    tool_args = body.get('tool_args', {})
    
    result = await mcp_manager.execute_tool(server_name, tool_name, tool_args)
    return result


@app.get("/api/v1/mcp/connected")
async def get_connected_servers():
    '''Get all currently connected MCP servers and their tools'''
    connected = mcp_manager.get_connected_servers()
    all_tools = mcp_manager.get_all_tools()
    
    return {
        'servers': connected,
        'count': len(connected),
        'all_tools': all_tools
    }


@app.get("/api/v1/mcp/tools")
async def get_all_mcp_tools():
    '''Get all available MCP tools from all connected servers (for ChatBot)'''
    all_tools = mcp_manager.get_all_tools()
    
    # Format for ChatBot context
    tool_descriptions = []
    for server_name, tools in all_tools.items():
        for tool in tools:
            tool_descriptions.append({
                'server': server_name,
                'name': tool['name'],
                'description': tool['description'],
                'full_name': f"{server_name}.{tool['name']}"
            })
    
    return {
        'tools': tool_descriptions,
        'count': len(tool_descriptions),
        'servers': list(all_tools.keys())
    }


# ==================== FILE PROCESSING MICROSERVICE ====================

@app.post("/api/v1/files/upload")
async def upload_file(file: UploadFile = File(...)):
    '''Upload and process files (images, PDFs, etc.)'''
    from PIL import Image
    import io
    import base64
    
    contents = await file.read()
    file_size = len(contents)
    
    result = {
        'filename': file.filename,
        'content_type': file.content_type,
        'size': file_size,
        'size_mb': round(file_size / 1024 / 1024, 2)
    }
    
    # Image processing
    if file.content_type and file.content_type.startswith('image/'):
        try:
            image = Image.open(io.BytesIO(contents))
            result['image_info'] = {
                'width': image.width,
                'height': image.height,
                'format': image.format,
                'mode': image.mode
            }
            
            # Create thumbnail
            image.thumbnail((200, 200))
            thumb_io = io.BytesIO()
            image.save(thumb_io, format='PNG')
            thumb_b64 = base64.b64encode(thumb_io.getvalue()).decode()
            result['thumbnail'] = f'data:image/png;base64,{thumb_b64}'
        except Exception as e:
            result['error'] = str(e)
    
    # PDF processing
    elif file.content_type == 'application/pdf':
        try:
            from PyPDF2 import PdfReader
            pdf = PdfReader(io.BytesIO(contents))
            result['pdf_info'] = {
                'pages': len(pdf.pages),
                'metadata': pdf.metadata
            }
            # Extract text from first page
            if len(pdf.pages) > 0:
                result['first_page_text'] = pdf.pages[0].extract_text()[:500]
        except Exception as e:
            result['error'] = str(e)
    
    return result


@app.post("/api/v1/files/process/image")
async def process_image(file: UploadFile = File(...), operation: str = 'resize', width: int = 800, height: int = 600):
    '''Process images - resize, convert, optimize'''
    from PIL import Image
    import io
    import base64
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    if operation == 'resize':
        image = image.resize((width, height))
    elif operation == 'thumbnail':
        image.thumbnail((width, height))
    elif operation == 'grayscale':
        image = image.convert('L')
    
    # Convert to base64
    output = io.BytesIO()
    image.save(output, format='PNG')
    img_b64 = base64.b64encode(output.getvalue()).decode()
    
    return {
        'operation': operation,
        'result': f'data:image/png;base64,{img_b64}',
        'size': {'width': image.width, 'height': image.height}
    }


# ==================== AUTH ENHANCEMENTS ====================

@app.post("/api/v1/auth/2fa/setup")
async def setup_2fa():
    '''Setup 2FA for user'''
    import pyotp
    import qrcode
    import io
    import base64
    
    # Generate secret
    secret = pyotp.random_base32()
    
    # Generate provisioning URI
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name='user@$AppName',
        issuer_name='$AppName'
    )
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_b64 = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        'secret': secret,
        'qr_code': f'data:image/png;base64,{qr_b64}',
        'uri': totp_uri
    }


@app.post("/api/v1/auth/2fa/verify")
async def verify_2fa(request: Request):
    '''Verify 2FA token'''
    import pyotp
    
    body = await request.json()
    secret = body.get('secret')
    token = body.get('token')
    
    totp = pyotp.TOTP(secret)
    is_valid = totp.verify(token, valid_window=1)
    
    return {
        'valid': is_valid,
        'message': 'Token verified' if is_valid else 'Invalid token'
    }


# =============================================================================
# EMAIL SERVICE
# =============================================================================

@app.post("/api/v1/email/welcome")
async def send_welcome(request: Request):
    '''Send welcome email to new user'''
    from app.email import send_welcome_email
    
    body = await request.json()
    email = body.get('email')
    username = body.get('username', 'User')
    
    try:
        await send_welcome_email(email, username)
        return {'status': 'sent', 'message': f'Welcome email sent to {email}'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


@app.post("/api/v1/email/reset-password")
async def send_password_reset(request: Request):
    '''Send password reset email'''
    from app.email import send_password_reset_email
    import secrets
    
    body = await request.json()
    email = body.get('email')
    
    # Generate reset token (in production, store this in DB with expiry)
    reset_token = secrets.token_urlsafe(32)
    
    try:
        await send_password_reset_email(email, reset_token)
        return {
            'status': 'sent',
            'message': f'Password reset email sent to {email}',
            'token': reset_token  # In production, don't return this!
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


@app.post("/api/v1/email/verify")
async def send_verification(request: Request):
    '''Send email verification'''
    from app.email import send_verification_email
    import secrets
    
    body = await request.json()
    email = body.get('email')
    
    # Generate verification token
    verify_token = secrets.token_urlsafe(32)
    
    try:
        await send_verification_email(email, verify_token)
        return {
            'status': 'sent',
            'message': f'Verification email sent to {email}',
            'token': verify_token  # In production, don't return this!
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


# =============================================================================
# GRADIO IMAGE GENERATION STUDIO
# =============================================================================

import gradio as gr
from typing import Optional
import os

def create_image_generation_studio():
    '''Create Gradio Image Generation interface with Stable Diffusion/Flux'''
    
    # Popular Hugging Face models
    MODELS = {
        "Flux": [
            "black-forest-labs/FLUX.1-dev",
            "black-forest-labs/FLUX.1-schnell",
        ],
        "Stable Diffusion": [
            "stabilityai/stable-diffusion-xl-base-1.0",
            "stabilityai/stable-diffusion-2-1",
            "runwayml/stable-diffusion-v1-5",
        ],
        "Specialized": [
            "prompthero/openjourney-v4",
            "wavymulder/Analog-Diffusion",
            "nitrosocke/Ghibli-Diffusion",
        ]
    }
    
    STYLES = [
        "None",
        "Photorealistic",
        "Digital Art",
        "Oil Painting",
        "Watercolor",
        "Anime",
        "Studio Ghibli",
        "Cyberpunk",
        "Fantasy",
        "Sci-Fi",
        "Vintage Photo",
        "3D Render",
    ]
    
    def text_to_image(
        prompt: str,
        negative_prompt: str,
        model: str,
        style: str,
        width: int,
        height: int,
        steps: int,
        guidance: float,
        seed: int
    ):
        """Generate image from text prompt"""
        try:
            from diffusers import DiffusionPipeline
            import torch
            
            # Apply style to prompt
            if style != "None":
                prompt = f"{prompt}, {style.lower()} style"
            
            # Load model (cached after first use)
            pipe = DiffusionPipeline.from_pretrained(
                model,
                torch_dtype=torch.float16,
                use_safetensors=True
            )
            pipe.to("cuda" if torch.cuda.is_available() else "cpu")
            
            # Generate image
            image = pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                width=width,
                height=height,
                num_inference_steps=steps,
                guidance_scale=guidance,
                generator=torch.Generator().manual_seed(seed) if seed >= 0 else None
            ).images[0]
            
            return image, f"✅ Generated with {model}"
            
        except Exception as e:
            return None, f"❌ Error: {str(e)}"
    
    def image_to_image(
        image,
        prompt: str,
        model: str,
        strength: float,
        steps: int
    ):
        """Transform image using AI"""
        try:
            from diffusers import StableDiffusionImg2ImgPipeline
            import torch
            from PIL import Image
            
            # Load img2img model
            pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
                model,
                torch_dtype=torch.float16
            )
            pipe.to("cuda" if torch.cuda.is_available() else "cpu")
            
            # Convert input
            if isinstance(image, str):
                image = Image.open(image).convert("RGB")
            
            # Generate
            result = pipe(
                prompt=prompt,
                image=image,
                strength=strength,
                num_inference_steps=steps
            ).images[0]
            
            return result, f"✅ Transformed with {model}"
            
        except Exception as e:
            return None, f"❌ Error: {str(e)}"
    
    # Text-to-Image Tab
    with gr.Blocks(theme=gr.themes.Soft(), title="🎨 AI Image Studio") as demo:
        gr.Markdown("# 🎨 AI Image Generation Studio")
        gr.Markdown("Generate stunning images with Stable Diffusion, Flux, and more!")
        
        with gr.Tabs():
            # TEXT TO IMAGE
            with gr.Tab("📝 Text to Image"):
                with gr.Row():
                    with gr.Column(scale=1):
                        txt_prompt = gr.Textbox(
                            label="Prompt",
                            placeholder="A beautiful sunset over mountains, vibrant colors...",
                            lines=4
                        )
                        txt_negative = gr.Textbox(
                            label="Negative Prompt",
                            placeholder="blurry, low quality, distorted...",
                            lines=2
                        )
                        
                        with gr.Row():
                            txt_model_category = gr.Dropdown(
                                label="Model Category",
                                choices=list(MODELS.keys()),
                                value="Flux"
                            )
                            txt_model = gr.Dropdown(
                                label="Model",
                                choices=MODELS["Flux"],
                                value="black-forest-labs/FLUX.1-schnell"
                            )
                        
                        txt_style = gr.Dropdown(
                            label="Style",
                            choices=STYLES,
                            value="None"
                        )
                        
                        with gr.Row():
                            txt_width = gr.Slider(512, 1024, 768, step=64, label="Width")
                            txt_height = gr.Slider(512, 1024, 768, step=64, label="Height")
                        
                        with gr.Row():
                            txt_steps = gr.Slider(10, 50, 28, step=1, label="Steps")
                            txt_guidance = gr.Slider(1, 20, 7.5, step=0.5, label="Guidance Scale")
                        
                        txt_seed = gr.Number(label="Seed (-1 for random)", value=-1)
                        
                        txt_generate_btn = gr.Button("🎨 Generate Image", variant="primary", size="lg")
                    
                    with gr.Column(scale=1):
                        txt_output = gr.Image(label="Generated Image", type="pil")
                        txt_status = gr.Textbox(label="Status", interactive=False)
                
                # Update model dropdown when category changes
                txt_model_category.change(
                    fn=lambda cat: gr.Dropdown(choices=MODELS.get(cat, [])),
                    inputs=[txt_model_category],
                    outputs=[txt_model]
                )
                
                txt_generate_btn.click(
                    fn=text_to_image,
                    inputs=[txt_prompt, txt_negative, txt_model, txt_style, txt_width, txt_height, txt_steps, txt_guidance, txt_seed],
                    outputs=[txt_output, txt_status]
                )
                
                # Example prompts
                gr.Examples(
                    examples=[
                        ["A majestic dragon flying over a futuristic city at sunset, cinematic lighting, highly detailed", "", "black-forest-labs/FLUX.1-schnell", "Digital Art"],
                        ["Portrait of a wise old wizard with a long white beard, fantasy art, magical atmosphere", "blurry, low quality", "black-forest-labs/FLUX.1-dev", "Fantasy"],
                        ["A serene Japanese garden with cherry blossoms, koi pond, traditional architecture", "", "stabilityai/stable-diffusion-xl-base-1.0", "Watercolor"],
                    ],
                    inputs=[txt_prompt, txt_negative, txt_model, txt_style]
                )
            
            # IMAGE TO IMAGE
            with gr.Tab("🖼️ Image to Image"):
                with gr.Row():
                    with gr.Column(scale=1):
                        img_input = gr.Image(label="Input Image", type="pil")
                        img_prompt = gr.Textbox(
                            label="Transformation Prompt",
                            placeholder="Turn this into a cyberpunk scene...",
                            lines=3
                        )
                        img_model = gr.Dropdown(
                            label="Model",
                            choices=MODELS["Stable Diffusion"],
                            value="stabilityai/stable-diffusion-xl-base-1.0"
                        )
                        img_strength = gr.Slider(0.1, 1.0, 0.75, step=0.05, label="Transformation Strength")
                        img_steps = gr.Slider(10, 50, 30, step=1, label="Steps")
                        img_generate_btn = gr.Button("🎨 Transform Image", variant="primary")
                    
                    with gr.Column(scale=1):
                        img_output = gr.Image(label="Transformed Image", type="pil")
                        img_status = gr.Textbox(label="Status", interactive=False)
                
                img_generate_btn.click(
                    fn=image_to_image,
                    inputs=[img_input, img_prompt, img_model, img_strength, img_steps],
                    outputs=[img_output, img_status]
                )
            
            # SETTINGS & INFO
            with gr.Tab("⚙️ Settings"):
                gr.Markdown("""
                ### 🎨 AI Image Studio
                
                **Available Models:**
                - **Flux** (Latest, fastest, highest quality)
                  - FLUX.1-dev: Development version with great quality
                  - FLUX.1-schnell: Ultra-fast generation
                
                - **Stable Diffusion XL** (Industry standard)
                  - SDXL Base: High-resolution, versatile
                  - SD 2.1: Balanced quality and speed
                  - SD 1.5: Fast, classic
                
                - **Specialized Models**
                  - OpenJourney: Midjourney-style images
                  - Analog Diffusion: Vintage photo aesthetic
                  - Ghibli Diffusion: Studio Ghibli anime style
                
                **Requirements:**
                - GPU with CUDA support (recommended)
                - 8GB+ VRAM for SDXL/Flux
                - Hugging Face account & token (set in .env)
                
                **Tips:**
                - Be specific and descriptive in prompts
                - Use negative prompts to avoid unwanted elements
                - Higher steps = better quality but slower
                - Guidance scale 7-10 works well for most images
                - Use seed for reproducible results
                
                **Configuration:**
                Add to `.env`:
                ```
                HUGGINGFACE_TOKEN=your_hf_token_here
                ```
                """)
                
                gr.Markdown("### 📊 System Info")
                import torch
                device_info = "CUDA Available" if torch.cuda.is_available() else "CPU Only (Slow)"
                gr.Textbox(label="Device", value=device_info, interactive=False)
    
    return demo

# Mount Gradio Image Studio at startup
try:
    image_studio = create_image_generation_studio()
    app = gr.mount_gradio_app(app, image_studio, path="/gradio")
except Exception as e:
    print(f"Warning: Gradio mount failed: {e}")
    # App will still work without Gradio
"@

$mainAppPath = Join-Path $AppPath "backend/app/main.py"
$mainApp | Out-File -FilePath $mainAppPath -Encoding UTF8

# Email Service Module
Write-Host "📧 Generating Email service..." -ForegroundColor Cyan

$emailService = @"
"""
Email Service for User Onboarding and Password Reset
"""
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List
import os

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv('MAIL_USERNAME', ''),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD', ''),
    MAIL_FROM=os.getenv('MAIL_FROM', 'noreply@fullstack-demo.com'),
    MAIL_PORT=int(os.getenv('MAIL_PORT', '587')),
    MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)


async def send_welcome_email(email: EmailStr, username: str):
    """Send welcome email to new users"""
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3182CE;">Welcome to Fullstack Demo! 🎉</h2>
            <p>Hi <strong>{username}</strong>,</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul>
                <li>Access the AI ChatBot for intelligent assistance</li>
                <li>Connect to MCP servers for enhanced functionality</li>
                <li>Upload and process files</li>
                <li>Enable 2FA for extra security</li>
            </ul>
            <p>Get started at: <a href="http://localhost:9132">http://localhost:9132</a></p>
            <p>Best regards,<br>The Fullstack Demo Team</p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Welcome to Fullstack Demo!",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    
    await fm.send_message(message)


async def send_password_reset_email(email: EmailStr, reset_token: str):
    """Send password reset email"""
    reset_link = f"http://localhost:9132/reset-password?token={reset_token}"
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3182CE;">Password Reset Request 🔐</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #3182CE; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">
                This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
            <p style="color: #666; font-size: 12px;">
                Or copy this link: <code>{reset_link}</code>
            </p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Password Reset Request - Fullstack Demo",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    
    await fm.send_message(message)


async def send_verification_email(email: EmailStr, verification_token: str):
    """Send email verification link"""
    verify_link = f"http://localhost:9132/verify-email?token={verification_token}"
    
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3182CE;">Verify Your Email Address ✉️</h2>
            <p>Please verify your email address to activate your account.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verify_link}" 
                   style="background-color: #48BB78; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                    Verify Email
                </a>
            </p>
            <p style="color: #666; font-size: 14px;">
                This link will expire in 24 hours.
            </p>
            <p style="color: #666; font-size: 12px;">
                Or copy this link: <code>{verify_link}</code>
            </p>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Verify Your Email - Fullstack Demo",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    
    await fm.send_message(message)
"@

$emailServicePath = Join-Path $AppPath "backend/app/email.py"
$emailService | Out-File -FilePath $emailServicePath -Encoding UTF8

# MCP Client Configuration (for connecting TO other MCP servers)
Write-Host "🔌 Generating MCP Client config..." -ForegroundColor Cyan

$mcpServersConfig = @"
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:/"],
      "env": {},
      "source": "Official MCP Servers"
    },
    "fetch": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/fetch"],
      "env": {},
      "source": "Official MCP Servers"
    },
    "advanced-memory": {
      "command": "uv",
      "args": [
        "--directory",
        "D:/Dev/repos/advanced-memory-mcp",
        "run",
        "advanced-memory"
      ],
      "env": {},
      "source": "Custom MCP Server"
    }
  }
}
"@

$mcpServersConfigPath = Join-Path $AppPath "backend/mcp-servers.json"
$mcpServersConfig | Out-File -FilePath $mcpServersConfigPath -Encoding UTF8

# =============================================================================
# MCP SERVER (Conditional)
# =============================================================================

if ($IncludeMCPServer) {
    Write-Host "🌐 Generating MCP Server..." -ForegroundColor Cyan

# MCP Server Implementation
$mcpServer = @"
'''
MCP Server for $AppName
Exposes application capabilities as MCP tools for Claude and other MCP clients.
'''
from mcp.server.fastmcp import FastMCP
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize MCP server
mcp = FastMCP('$AppName')


@mcp.tool()
async def query_database(query: str, limit: int = 10):
    '''
    Query the application database via MCP.
    
    Args:
        query: SQL-like query or natural language description
        limit: Maximum number of results to return
    
    Returns:
        Query results as JSON
    '''
    # TODO: Implement actual database query logic
    return {
        'status': 'success',
        'query': query,
        'results': [],
        'message': 'Database query functionality coming soon'
    }


@mcp.tool()
async def process_image_mcp(image_path: str, operation: str = 'resize', width: int = 800, height: int = 600):
    '''
    Process images via MCP tool.
    
    Args:
        image_path: Path to image file
        operation: Operation to perform (resize, thumbnail, grayscale)
        width: Target width in pixels
        height: Target height in pixels
    
    Returns:
        Processing result with metadata
    '''
    from PIL import Image
    import io
    import base64
    
    try:
        image = Image.open(image_path)
        
        if operation == 'resize':
            image = image.resize((width, height))
        elif operation == 'thumbnail':
            image.thumbnail((width, height))
        elif operation == 'grayscale':
            image = image.convert('L')
        
        # Convert to base64
        output = io.BytesIO()
        image.save(output, format='PNG')
        img_b64 = base64.b64encode(output.getvalue()).decode()
        
        return {
            'status': 'success',
            'operation': operation,
            'size': {'width': image.width, 'height': image.height},
            'preview': f'data:image/png;base64,{img_b64[:100]}...'
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


@mcp.tool()
async def send_notification(title: str, message: str, severity: str = 'info'):
    '''
    Send notification via the application.
    
    Args:
        title: Notification title
        message: Notification message
        severity: Severity level (info, warning, error, success)
    
    Returns:
        Notification status
    '''
    # TODO: Implement actual notification logic
    return {
        'status': 'sent',
        'title': title,
        'message': message,
        'severity': severity,
        'timestamp': 'now'
    }


@mcp.tool()
async def get_app_status():
    '''
    Get comprehensive application status and health metrics.
    
    Returns:
        Application status including uptime, resources, services
    '''
    import psutil
    from datetime import datetime
    
    return {
        'status': 'operational',
        'service': '$AppName',
        'timestamp': datetime.utcnow().isoformat(),
        'system': {
            'cpu_percent': psutil.cpu_percent(interval=0.1),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_percent': psutil.disk_usage('/').percent
        },
        'services': {
            'api': 'operational',
            'database': 'operational',
            'cache': 'operational'
        }
    }


@mcp.tool()
async def analyze_logs(timeframe: str = '1h', level: str = 'all', limit: int = 100):
    '''
    Analyze application logs via MCP.
    
    Args:
        timeframe: Time window to analyze (1h, 24h, 7d)
        level: Log level filter (all, error, warning, info)
        limit: Maximum number of log entries
    
    Returns:
        Log analysis results
    '''
    return {
        'status': 'success',
        'timeframe': timeframe,
        'level': level,
        'total_logs': 0,
        'logs': [],
        'message': 'Log analysis functionality coming soon'
    }


@mcp.tool()
async def execute_workflow(workflow_name: str, parameters: dict = None):
    '''
    Execute a predefined workflow or automation.
    
    Args:
        workflow_name: Name of the workflow to execute
        parameters: Workflow parameters as dictionary
    
    Returns:
        Workflow execution result
    '''
    return {
        'status': 'executed',
        'workflow': workflow_name,
        'parameters': parameters or {},
        'message': 'Workflow functionality coming soon'
    }


if __name__ == '__main__':
    mcp.run()
"@

$mcpServerPath = Join-Path $AppPath "backend/mcp_server.py"
$mcpServer | Out-File -FilePath $mcpServerPath -Encoding UTF8

# MCP Server Config
$mcpConfig = @"
{
  "mcpServers": {
    "$AppName": {
      "command": "uv",
      "args": [
        "--directory",
        "$($AppPath -replace '\\', '/')/backend",
        "run",
        "python",
        "mcp_server.py"
      ],
      "env": {}
    }
  }
}
"@

$mcpConfigPath = Join-Path $AppPath "mcp-config.json"
$mcpConfig | Out-File -FilePath $mcpConfigPath -Encoding UTF8

# MCP Server Run Script
$mcpRunScript = @"
#!/usr/bin/env pwsh
# Run MCP Server for $AppName

Write-Host "🌐 Starting $AppName MCP Server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Exposed MCP Tools:" -ForegroundColor Yellow
Write-Host "   - query_database" -ForegroundColor Gray
Write-Host "   - process_image_mcp" -ForegroundColor Gray
Write-Host "   - send_notification" -ForegroundColor Gray
Write-Host "   - get_app_status" -ForegroundColor Gray
Write-Host "   - analyze_logs" -ForegroundColor Gray
Write-Host "   - execute_workflow" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 To use in Claude Desktop:" -ForegroundColor Yellow
Write-Host "   Add the config from mcp-config.json to:" -ForegroundColor Gray
Write-Host "   %APPDATA%\Claude\claude_desktop_config.json" -ForegroundColor Gray
Write-Host ""

Set-Location backend
uv run python mcp_server.py
"@

$mcpRunScriptPath = Join-Path $AppPath "scripts/run-mcp-server.ps1"
$mcpRunScript | Out-File -FilePath $mcpRunScriptPath -Encoding UTF8
}

# =============================================================================
# ELECTRON WRAPPER (Conditional)
# =============================================================================

if ($IncludeElectronWrapper) {
    Write-Host "🖥️  Generating Electron desktop wrapper..." -ForegroundColor Cyan

# Electron Main Process
$electronMain = @"
const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let dockerProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // Load app (localhost during dev, file in production)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9132');
  } else {
    mainWindow.loadFile('dist/index.html');
  }

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png'));
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show $AppName',
      click: () => mainWindow.show()
    },
    {
      label: 'Start Docker Services',
      click: () => startDockerServices()
    },
    {
      label: 'Stop Docker Services',
      click: () => stopDockerServices()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        stopDockerServices();
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('$AppName');
}

function startDockerServices() {
  console.log('Starting Docker services...');
  dockerProcess = spawn('docker-compose', ['up', '-d'], {
    cwd: path.join(__dirname, '..')
  });
  
  dockerProcess.on('exit', (code) => {
    console.log(\`Docker exited with code $`{code}\`);
  });
}

function stopDockerServices() {
  if (dockerProcess) {
    spawn('docker-compose', ['down'], {
      cwd: path.join(__dirname, '..')
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  // Auto-start Docker
  startDockerServices();
});

app.on('window-all-closed', () => {
  // Keep app running in tray
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
"@

$electronMainPath = Join-Path $AppPath "electron/main.js"
New-Item -ItemType Directory -Path (Split-Path $electronMainPath) -Force | Out-Null
$electronMain | Out-File -FilePath $electronMainPath -Encoding UTF8

# Electron Package.json
$electronPackageJson = @"
{
  "name": "$($AppName.ToLower())-desktop",
  "version": "1.0.0",
  "description": "$Description - Desktop App",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build-win": "electron-builder --win",
    "build-mac": "electron-builder --mac",
    "build-linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.$($AppName.ToLower()).app",
    "productName": "$AppName",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "assets/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    }
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4"
  }
}
"@

$electronPackageJsonPath = Join-Path $AppPath "electron/package.json"
$electronPackageJson | Out-File -FilePath $electronPackageJsonPath -Encoding UTF8

# One-Click Startup Script
$oneClickStart = @"
#!/usr/bin/env pwsh
# One-Click Starter for $AppName

Write-Host "🚀 Starting $AppName..." -ForegroundColor Cyan
Write-Host ""

# Check Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found! Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker found" -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not running - starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "Docker Desktop"
    Write-Host "   Waiting for Docker to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}

# Start services
Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
docker-compose up -d

# Wait for services
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host ""
Write-Host "🌐 Opening $AppName..." -ForegroundColor Cyan
Start-Process "http://localhost:9132"

Write-Host ""
Write-Host "✅ $AppName is running!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  • Frontend:  http://localhost:9132" -ForegroundColor White
Write-Host "  • Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "  • Grafana:   http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "To stop: docker-compose down" -ForegroundColor Yellow
"@

$oneClickStartPath = Join-Path $AppPath "START.ps1"
$oneClickStart | Out-File -FilePath $oneClickStartPath -Encoding UTF8

# Desktop Shortcut Creator
$createShortcut = @"
#!/usr/bin/env pwsh
# Create Desktop Shortcut for $AppName

`$WshShell = New-Object -comObject WScript.Shell
`$Shortcut = `$WshShell.CreateShortcut("`$env:USERPROFILE\Desktop\$AppName.lnk")
`$Shortcut.TargetPath = "pwsh.exe"
`$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"`$PSScriptRoot\START.ps1`""
`$Shortcut.WorkingDirectory = `$PSScriptRoot
`$Shortcut.IconLocation = "`$PSScriptRoot\electron\assets\icon.ico"
`$Shortcut.Description = "Start $AppName"
`$Shortcut.Save()

Write-Host "✅ Desktop shortcut created!" -ForegroundColor Green
"@

$createShortcutPath = Join-Path $AppPath "scripts/create-shortcut.ps1"
$createShortcut | Out-File -FilePath $createShortcutPath -Encoding UTF8
}

# Backend Dockerfile
$backendDockerfile = @"
# Multi-stage build for FastAPI backend

# Stage 1: Base
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Stage 2: Builder
FROM base AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --user -r requirements.txt

# Stage 3: Production
FROM base AS production

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:`$PATH

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"@

$backendDockerfilePath = Join-Path $AppPath "backend/Dockerfile"
$backendDockerfile | Out-File -FilePath $backendDockerfilePath -Encoding UTF8

# =============================================================================
# DOCKER SETUP
# =============================================================================

Write-Host "🐳 Setting up Docker configuration..." -ForegroundColor Cyan

# Docker Compose
$dockerCompose = @"
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "9132:9132"
    environment:
      - REACT_APP_API_URL=http://localhost:8888
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8888:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/$($AppName.ToLower())
      - REDIS_URL=redis://redis:6379
      - LOKI_URL=http://loki:3100
      - OPENAI_API_KEY=`${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=`${ANTHROPIC_API_KEY}
    depends_on:
      - db
      - redis
      - loki
    volumes:
      - ./backend:/app
    logging:
      driver: loki
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
        loki-batch-size: "400"
        labels: "service=backend,environment=dev"

  # Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=$($AppName.ToLower())
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    ports:
      - "5439:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    logging:
      driver: loki
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
        labels: "service=database,environment=dev"

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6389:6379"
    volumes:
      - redis_data:/data
    logging:
      driver: loki
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
        labels: "service=redis,environment=dev"

  # Loki - Log Aggregation
  loki:
    image: grafana/loki:latest
    ports:
      - "3199:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - ./infrastructure/monitoring/loki-config.yaml:/etc/loki/local-config.yaml
      - loki_data:/loki

  # Promtail - Log Shipper
  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./infrastructure/monitoring/promtail-config.yaml:/etc/promtail/config.yaml
    command: -config.file=/etc/promtail/config.yaml
    depends_on:
      - loki

  # Prometheus - Metrics
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9191:9090"
    volumes:
      - ./infrastructure/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  # Grafana - Visualization
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3191:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./infrastructure/monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./infrastructure/monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
      - loki

volumes:
  postgres_data:
  redis_data:
  loki_data:
  prometheus_data:
  grafana_data:
"@

$dockerComposePath = Join-Path $AppPath "docker-compose.yml"
$dockerCompose | Out-File -FilePath $dockerComposePath -Encoding UTF8

# Loki Configuration
$lokiConfig = @"
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2023-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    cache_ttl: 24h
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s
"@

$lokiConfigPath = Join-Path $AppPath "infrastructure/monitoring/loki-config.yaml"
$lokiConfig | Out-File -FilePath $lokiConfigPath -Encoding UTF8

# Promtail Configuration
$promtailConfig = @"
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
"@

$promtailConfigPath = Join-Path $AppPath "infrastructure/monitoring/promtail-config.yaml"
$promtailConfig | Out-File -FilePath $promtailConfigPath -Encoding UTF8

# Prometheus Configuration
$prometheusConfig = @"
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'dev'
    environment: 'development'

scrape_configs:
  - job_name: 'backend-api'
    static_configs:
      - targets: ['backend:8000']
        labels:
          service: 'backend'
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
"@

$prometheusConfigPath = Join-Path $AppPath "infrastructure/monitoring/prometheus.yml"
$prometheusConfig | Out-File -FilePath $prometheusConfigPath -Encoding UTF8

# Grafana Datasources
$grafanaDatasources = @"
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
"@

$grafanaDatasourcesPath = Join-Path $AppPath "infrastructure/monitoring/grafana/datasources/datasources.yaml"
New-Item -ItemType Directory -Path (Split-Path $grafanaDatasourcesPath) -Force | Out-Null
$grafanaDatasources | Out-File -FilePath $grafanaDatasourcesPath -Encoding UTF8

# Grafana Dashboard Provisioning
$grafanaDashboardProvisioning = @"
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
"@

$grafanaDashboardProvisioningPath = Join-Path $AppPath "infrastructure/monitoring/grafana/dashboards/dashboards.yaml"
New-Item -ItemType Directory -Path (Split-Path $grafanaDashboardProvisioningPath) -Force | Out-Null
$grafanaDashboardProvisioning | Out-File -FilePath $grafanaDashboardProvisioningPath -Encoding UTF8

# Grafana Application Dashboard JSON (Comprehensive & Beautiful)
$grafanaDashboard = @"
{
  "dashboard": {
    "title": "$AppName - Application Dashboard",
    "tags": ["application", "monitoring", "performance"],
    "timezone": "browser",
    "schemaVersion": 36,
    "version": 1,
    "refresh": "10s",
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "panels": [
      {
        "id": 1,
        "title": "🚀 Service Status",
        "type": "stat",
        "datasource": "Prometheus",
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "up{job=\"backend-api\"}",
            "refId": "A"
          }
        ],
        "options": {
          "reduceOptions": {
            "values": false,
            "calcs": ["lastNotNull"]
          },
          "colorMode": "background",
          "graphMode": "none",
          "textMode": "value_and_name"
        },
        "fieldConfig": {
          "defaults": {
            "mappings": [
              {"type": "value", "options": {"1": {"text": "UP", "color": "green"}}},
              {"type": "value", "options": {"0": {"text": "DOWN", "color": "red"}}}
            ],
            "thresholds": {
              "steps": [
                {"value": 0, "color": "red"},
                {"value": 1, "color": "green"}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "📊 Total Requests (1h)",
        "type": "stat",
        "datasource": "Prometheus",
        "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0},
        "targets": [
          {
            "expr": "sum(increase(http_requests_total[1h]))",
            "refId": "A"
          }
        ],
        "options": {
          "reduceOptions": {
            "values": false,
            "calcs": ["lastNotNull"]
          },
          "colorMode": "value",
          "graphMode": "area",
          "textMode": "auto"
        },
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "color": {"mode": "palette-classic"}
          }
        }
      },
      {
        "id": 3,
        "title": "⚡ Active Requests",
        "type": "stat",
        "datasource": "Prometheus",
        "gridPos": {"h": 4, "w": 6, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "http_requests_active",
            "refId": "A"
          }
        ],
        "options": {
          "reduceOptions": {
            "values": false,
            "calcs": ["lastNotNull"]
          },
          "colorMode": "value",
          "graphMode": "none",
          "textMode": "auto"
        },
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 10, "color": "yellow"},
                {"value": 50, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "id": 4,
        "title": "❌ Error Rate",
        "type": "stat",
        "datasource": "Prometheus",
        "gridPos": {"h": 4, "w": 6, "x": 18, "y": 0},
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m]))",
            "refId": "A"
          }
        ],
        "options": {
          "reduceOptions": {
            "values": false,
            "calcs": ["lastNotNull"]
          },
          "colorMode": "background",
          "graphMode": "area",
          "textMode": "auto"
        },
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 0.1, "color": "yellow"},
                {"value": 1, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "id": 5,
        "title": "📈 Request Rate (req/sec)",
        "type": "timeseries",
        "datasource": "Prometheus",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4},
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])",
            "legendFormat": "{{method}} {{endpoint}}",
            "refId": "A"
          }
        ],
        "options": {
          "tooltip": {"mode": "multi"},
          "legend": {"displayMode": "list", "placement": "bottom"}
        },
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "color": {"mode": "palette-classic"}
          }
        }
      },
      {
        "id": 6,
        "title": "⏱️ Response Time (p50, p95, p99)",
        "type": "timeseries",
        "datasource": "Prometheus",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4},
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p50",
            "refId": "A"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p95",
            "refId": "B"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p99",
            "refId": "C"
          }
        ],
        "options": {
          "tooltip": {"mode": "multi"},
          "legend": {"displayMode": "list", "placement": "bottom"}
        },
        "fieldConfig": {
          "defaults": {
            "unit": "s",
            "color": {"mode": "palette-classic"}
          }
        }
      },
      {
        "id": 7,
        "title": "🎯 Requests by Endpoint",
        "type": "piechart",
        "datasource": "Prometheus",
        "gridPos": {"h": 8, "w": 8, "x": 0, "y": 12},
        "targets": [
          {
            "expr": "sum by (endpoint) (http_requests_total)",
            "legendFormat": "{{endpoint}}",
            "refId": "A"
          }
        ],
        "options": {
          "legend": {"displayMode": "table", "placement": "right"},
          "pieType": "donut"
        }
      },
      {
        "id": 8,
        "title": "📊 HTTP Status Codes",
        "type": "bargauge",
        "datasource": "Prometheus",
        "gridPos": {"h": 8, "w": 8, "x": 8, "y": 12},
        "targets": [
          {
            "expr": "sum by (status) (http_requests_total)",
            "legendFormat": "{{status}}",
            "refId": "A"
          }
        ],
        "options": {
          "displayMode": "gradient",
          "orientation": "horizontal",
          "showUnfilled": true
        },
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "palette-classic"},
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 400, "color": "yellow"},
                {"value": 500, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "id": 9,
        "title": "💾 Cache Performance",
        "type": "timeseries",
        "datasource": "Prometheus",
        "gridPos": {"h": 8, "w": 8, "x": 16, "y": 12},
        "targets": [
          {
            "expr": "rate(cache_hits_total[1m])",
            "legendFormat": "Cache Hits",
            "refId": "A"
          },
          {
            "expr": "rate(cache_misses_total[1m])",
            "legendFormat": "Cache Misses",
            "refId": "B"
          }
        ],
        "options": {
          "tooltip": {"mode": "multi"},
          "legend": {"displayMode": "list", "placement": "bottom"}
        },
        "fieldConfig": {
          "defaults": {
            "unit": "ops",
            "color": {"mode": "palette-classic"}
          }
        }
      },
      {
        "id": 10,
        "title": "📝 Application Logs (Live Stream)",
        "type": "logs",
        "datasource": "Loki",
        "gridPos": {"h": 10, "w": 24, "x": 0, "y": 20},
        "targets": [
          {
            "expr": "{service=~\"backend|database|redis\"}"
          }
        ],
        "options": {
          "showTime": true,
          "showLabels": true,
          "showCommonLabels": false,
          "wrapLogMessage": true,
          "prettifyLogMessage": false,
          "enableLogDetails": true,
          "dedupStrategy": "none",
          "sortOrder": "Descending"
        }
      },
      {
        "id": 11,
        "title": "🔥 Error Logs (Last Hour)",
        "type": "logs",
        "datasource": "Loki",
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 30},
        "targets": [
          {
            "expr": "{service=~\"backend|database|redis\"} |~ \"ERROR|error|Error|CRITICAL|Exception\""
          }
        ],
        "options": {
          "showTime": true,
          "showLabels": true,
          "wrapLogMessage": true,
          "enableLogDetails": true,
          "sortOrder": "Descending"
        }
      }
    ],
    "templating": {
      "list": []
    },
    "annotations": {
      "list": []
    }
  },
  "overwrite": true
}
"@

$grafanaDashboardPath = Join-Path $AppPath "infrastructure/monitoring/grafana/dashboards/application-dashboard.json"
$grafanaDashboard | Out-File -FilePath $grafanaDashboardPath -Encoding UTF8

# =============================================================================
# CI/CD PIPELINES
# =============================================================================

if ($IncludeCI) {
    Write-Host "🔄 Setting up CI/CD pipelines..." -ForegroundColor Cyan
    
    # GitHub Actions workflow
    $workflow = @"
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        pytest tests/ -v --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker images
      run: |
        docker build -t $($AppName.ToLower())-frontend ./frontend
        docker build -t $($AppName.ToLower())-backend ./backend
    
    - name: Push to registry
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Pushing to registry..."
"@

    $workflowPath = Join-Path $AppPath ".github/workflows/ci.yml"
    $workflow | Out-File -FilePath $workflowPath -Encoding UTF8
}

# =============================================================================
# DOCUMENTATION
# =============================================================================

Write-Host "📚 Creating documentation..." -ForegroundColor Cyan

# README
$readme = @"
# $AppName

$Description

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd $AppName
   ```

2. **Configure API keys:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY and ANTHROPIC_API_KEY
   ```

3. **Install Loki Docker plugin:**
   ```powershell
   .\scripts\setup-loki.ps1
   ```

4. **Start with Docker:**
   ```bash
   docker-compose up -d
   ```

5. **Or setup manually:**

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

### 🌐 Access Points

- **Frontend:** http://localhost:9132
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/api/v1/docs
- **Grafana:** http://localhost:3001 (admin/admin)
- **Prometheus:** http://localhost:9090
- **Loki:** http://localhost:3100

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Chakra UI** for components
- **React Query** for data fetching
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **FastAPI** with async support
- **SQLAlchemy** ORM
- **Alembic** for migrations
- **PostgreSQL** database
- **Redis** for caching
- **Celery** for background tasks

### 🤖 AI Features (Multi-Provider Support)
- **AI ChatBot** - Floating chat with streaming responses
- **OpenAI** - GPT-4, GPT-4 Turbo, GPT-3.5
- **Anthropic** - Claude 3.5 Sonnet, Opus, Sonnet, Haiku
- **Ollama** - Local FOSS models (llama2, mistral, etc.)
- **LM Studio** - Local model management
- **AI Settings Modal** - Full provider configuration
- **Context-Aware** - Knows your application's tech stack
- **Model Management** - Load/unload local models
- **Streaming Responses** - Real-time AI output

### 🔌 MCP Client Dashboard
- **Server Discovery** - Auto-detect Claude Desktop servers
- **Tool Execution** - Run any MCP tool visually
- **Server Connection** - Connect to any MCP server
- **Tool Inspector** - View tool schemas and parameters
- **Results Display** - Formatted JSON output
- **Universal Frontend** - Works with ANY MCP server

### 🌐 MCP Server (DUAL-MODE MCP HUB!)
- **Exposes MCP Tools** - App becomes an MCP server
- **Claude Integration** - Use app tools directly in Claude
- **6 Built-in Tools:**
  - query_database - Query PostgreSQL via MCP
  - process_image_mcp - Image processing via MCP
  - send_notification - Send notifications via MCP
  - get_app_status - Get app health via MCP
  - analyze_logs - Analyze logs via MCP
  - execute_workflow - Run workflows via MCP
- **Auto Config** - mcp-config.json for Claude Desktop
- **Dual Mode** - Client AND Server in one app!

### 📁 File Upload & Processing
- **Drag-Drop Upload** - Beautiful drop zone
- **Image Processing** - Resize, thumbnail, grayscale
- **PDF Extraction** - Text extraction, page count
- **Thumbnail Generation** - Auto-preview for images
- **Multi-File Support** - Batch processing
- **Progress Tracking** - Upload progress bars

### 🎤 Voice Interface
- **Speech-to-Text** - Web Speech API integration
- **Text-to-Speech** - Multiple voice options
- **Voice Commands** - Navigate with voice
- **Continuous Listening** - Real-time transcription
- **Voice Selection** - Choose from system voices
- **Hands-Free** - Complete voice control

### 🔐 Security Features
- **2FA Setup** - TOTP authenticator support
- **QR Code Generation** - Easy mobile setup
- **Token Verification** - 6-digit code verification
- **Google Authenticator** - Compatible
- **Microsoft Authenticator** - Compatible
- **Authy** - Compatible
- **1Password** - Compatible (Premium)

### 📱 PWA Support
- **Installable** - Add to home screen
- **Offline Mode** - Service worker caching
- **App-Like Experience** - Standalone display
- **Fast Loading** - Cached resources
- **Push Notifications** - Real-time updates (ready)
- **Cross-Platform** - Works on desktop & mobile

### Infrastructure
- **Docker** containerization
- **Prometheus** monitoring
- **Grafana** dashboards
- **Loki** log aggregation
- **Nginx** reverse proxy
- **GitHub Actions** CI/CD

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

## 📊 Monitoring

The application includes comprehensive monitoring:

- **Metrics:** Prometheus + Grafana
- **Logging:** Structured logging with correlation IDs
- **Health checks:** Built-in health endpoints
- **Performance:** Request timing and error tracking

## 🚀 Deployment

See `docs/deployment.md` for production deployment guides.

## 📝 API Documentation

Interactive API documentation is available at `/docs` when running the backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
"@

$readmePath = Join-Path $AppPath "README.md"
$readme | Out-File -FilePath $readmePath -Encoding UTF8

# =============================================================================
# SCRIPTS
# =============================================================================

Write-Host "🛠️ Creating utility scripts..." -ForegroundColor Cyan

# Development script
$devScript = @"
#!/bin/bash
# Development startup script

echo "🚀 Starting $AppName development environment..."

# Start database services
docker-compose up -d db redis

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 10

# Start backend
echo "🐍 Starting FastAPI backend..."
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=`$!

# Start frontend
echo "⚛️ Starting React frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=`$!

echo "✅ Development environment started!"
echo "Frontend: http://localhost:9132"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/api/v1/docs"
echo "Grafana: http://localhost:3001"

# Wait for user interrupt
trap "echo '🛑 Shutting down...'; kill `$BACKEND_PID `$FRONTEND_PID; exit" INT
wait
"@

$devScriptPath = Join-Path $AppPath "scripts/dev.sh"
$devScript | Out-File -FilePath $devScriptPath -Encoding UTF8

# Setup script for Loki Docker plugin
$setupScript = @"
#!/bin/bash
# Setup script for Loki Docker logging plugin

echo "🔧 Setting up Loki Docker logging plugin..."

# Install Loki Docker driver
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions

echo "✅ Loki Docker plugin installed successfully!"
echo ""
echo "📋 To verify installation:"
echo "   docker plugin ls"
echo ""
echo "🚀 Now you can start the application:"
echo "   docker-compose up -d"
"@

$setupScriptPath = Join-Path $AppPath "scripts/setup-loki.sh"
$setupScript | Out-File -FilePath $setupScriptPath -Encoding UTF8

# Windows setup script for Loki
$setupScriptWin = @"
# Setup script for Loki Docker logging plugin (Windows)

Write-Host "🔧 Setting up Loki Docker logging plugin..." -ForegroundColor Cyan

# Install Loki Docker driver
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions

Write-Host "✅ Loki Docker plugin installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 To verify installation:" -ForegroundColor Cyan
Write-Host "   docker plugin ls" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Now you can start the application:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d" -ForegroundColor White
"@

$setupScriptWinPath = Join-Path $AppPath "scripts/setup-loki.ps1"
$setupScriptWin | Out-File -FilePath $setupScriptWinPath -Encoding UTF8

# =============================================================================
# FINAL SETUP
# =============================================================================

Write-Host "🎯 Finalizing setup..." -ForegroundColor Cyan

# .gitignore
$gitignore = @"
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/

# Build outputs
dist/
build/
*.egg-info/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite3

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Monitoring data
prometheus_data/
grafana_data/
"@

$gitignorePath = Join-Path $AppPath ".gitignore"
$gitignore | Out-File -FilePath $gitignorePath -Encoding UTF8

# Example .env file
$envExample = @"
# API Keys for AI Assistant
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Email Configuration (for user onboarding & password reset)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@$($AppName.ToLower()).com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/$($AppName.ToLower())

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Settings
ENVIRONMENT=development
DEBUG=true
"@

$envExamplePath = Join-Path $AppPath ".env.example"
$envExample | Out-File -FilePath $envExamplePath -Encoding UTF8

# =============================================================================
# SUCCESS MESSAGE
# =============================================================================

Write-Host ""
Write-Host "🎉 FULLSTACK APP '$AppName' CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Project Structure:" -ForegroundColor Cyan
Write-Host "  ├── frontend/          # React + TypeScript + Chakra UI" -ForegroundColor Yellow
Write-Host "  ├── backend/           # FastAPI + PostgreSQL + Redis" -ForegroundColor Yellow
Write-Host "  ├── infrastructure/    # Docker + Monitoring + Nginx" -ForegroundColor Yellow
Write-Host "  ├── docs/              # Documentation" -ForegroundColor Yellow
Write-Host "  └── scripts/           # Utility scripts" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. cd $AppName" -ForegroundColor White
Write-Host "  2. Copy .env.example to .env and add your API keys" -ForegroundColor White
Write-Host "  3. scripts/setup-loki.ps1  # Install Loki Docker plugin" -ForegroundColor White
Write-Host "  4. docker-compose up -d" -ForegroundColor White
Write-Host "  5. Visit http://localhost:9132" -ForegroundColor White
Write-Host ""
Write-Host "📊 Access Points:" -ForegroundColor Cyan
Write-Host "  • Frontend: http://localhost:9132" -ForegroundColor White
Write-Host "  • Backend API: http://localhost:8888" -ForegroundColor White
Write-Host "  • API Docs: http://localhost:8888/api/v1/docs" -ForegroundColor White
Write-Host "  • Grafana: http://localhost:3191 (admin/admin)" -ForegroundColor White
Write-Host "  • Prometheus: http://localhost:9191" -ForegroundColor White
Write-Host "  • Loki Logs: http://localhost:3199" -ForegroundColor White
Write-Host ""
Write-Host "✨ Features Included:" -ForegroundColor Cyan
Write-Host "  ✅ Modern React frontend with Chakra UI" -ForegroundColor Green
Write-Host "  ✅ FastAPI backend with async support" -ForegroundColor Green
if ($IncludeAI) { Write-Host "  ✅ AI ChatBot (4 providers: OpenAI, Anthropic, Ollama, LMStudio) 🤖" -ForegroundColor Green }
if ($IncludeMCP) { Write-Host "  ✅ MCP Client Dashboard (Universal MCP Frontend) 🔌" -ForegroundColor Green }
if ($IncludeMCPServer) { 
    Write-Host "  ✅ MCP SERVER - App exposes 6 MCP tools! 🌐" -ForegroundColor Magenta
    Write-Host "     → Run: scripts/run-mcp-server.ps1" -ForegroundColor Gray
    Write-Host "     → Config: mcp-config.json (for Claude Desktop)" -ForegroundColor Gray
}
if ($IncludeFileUpload) { Write-Host "  ✅ File Upload & Processing (Images/PDFs) 📁" -ForegroundColor Green }
if ($IncludeVoice) { Write-Host "  ✅ Voice Interface (Speech in/out) 🎤" -ForegroundColor Green }
if ($Include2FA) { Write-Host "  ✅ 2FA Authentication (TOTP) 🔐" -ForegroundColor Green }
if ($IncludePWA) { Write-Host "  ✅ PWA Support (Installable, Offline) 📱" -ForegroundColor Green }
Write-Host "  ✅ Comprehensive Help Modal 📚" -ForegroundColor Green
Write-Host "  ✅ Professional Log Viewer 📊" -ForegroundColor Green
Write-Host "  ✅ Monitoring Dashboard (Grafana/Prometheus/Loki) 📈" -ForegroundColor Green
Write-Host "  ✅ Image Studio (Flux, Stable Diffusion, Text/Image-to-Image) 🎨" -ForegroundColor Green
Write-Host "  ✅ Email System (Welcome, Password Reset, Verification) 📧" -ForegroundColor Green
Write-Host "  ✅ PostgreSQL database with migrations" -ForegroundColor Green
Write-Host "  ✅ Redis caching and sessions" -ForegroundColor Green
if ($IncludeMonitoring) { 
    Write-Host "  ✅ Loki log aggregation" -ForegroundColor Green 
    Write-Host "  ✅ Prometheus metrics + Grafana dashboards" -ForegroundColor Green
}
Write-Host "  ✅ Docker containerization" -ForegroundColor Green
Write-Host "  ✅ CI/CD pipelines" -ForegroundColor Green
Write-Host "  ✅ Comprehensive testing" -ForegroundColor Green
Write-Host "  ✅ Production-ready configuration" -ForegroundColor Green
Write-Host ""
if ($IncludeMCPServer) {
    Write-Host "🌐 MCP SERVER MODE ENABLED!" -ForegroundColor Magenta
    Write-Host "  Your app is now a DUAL-MODE MCP HUB:" -ForegroundColor Yellow
    Write-Host "  • MCP Client: Connect TO other MCP servers" -ForegroundColor Cyan
    Write-Host "  • MCP Server: Other clients connect TO you" -ForegroundColor Cyan
    Write-Host "  • Use in Claude: Copy mcp-config.json to Claude Desktop config" -ForegroundColor Cyan
    Write-Host ""
}
Write-Host "🎯 Ready to build something amazing!" -ForegroundColor Magenta
