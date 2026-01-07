# Meta MCP

Meta MCP is the ultimate **"Argh-Coding" bloop-buster** - a comprehensive management platform for MCP (Model Context Protocol) servers that prevents the developer pain points we've all experienced.

## 🎯 The Mission: Stop the "Argh" Moments

We've all been there:
- **🚨 Unicode logging crashes** that cause restart loops
- **🐳 Docker Desktop maximum confusion** (UI works but doesn't)
- **🔧 Framework assumption errors** that waste hours
- **📦 MCPB packaging nightmares**
- **🏗️ SOTA compliance failures**

Meta MCP is the industrial-strength solution that turns these "argh" moments into productive development.

## 🛠️ Core Capabilities

### **🔍 Discovery & Analysis**
- **MCP Server Discovery**: Find all MCP servers across your system
- **SOTA Compliance Analysis**: Validate against FastMCP 2.14.1+ standards
- **Repository Health Scanning**: Identify "runt" repositories needing upgrades
- **Unicode Safety Auditing**: Find emoji-infested logger calls before they crash
- **Client Integration Diagnostics**: Real-time visibility into server status across Antigravity, Claude, Cursor, and Zed

### **🏗️ Generation & Scaffolding**
- **MCP Server Builder**: Create SOTA-compliant servers with enhanced response patterns
- **Docker Scaffolder**: Production-ready container setups
- **WebApp Builder**: Fullstack applications with MCP integration
- **Landing Page Generator**: Beautiful startup-ready pages (Little Timmy's dreams!)

### **🛡️ Quality & Safety**
- **🚨 EmojiBuster (Safe Scanner)**: Scan and fix Unicode logging crashes using hex escape sequences (e.g., `\U0001F680`)
- **Enhanced Response Validator**: Ensure FastMCP 2.14.1+ compliance
- **MCPB Packaging Validator**: Prevent packaging errors
- **Production Readiness Checker**: Comprehensive deployment validation

### **🌐 Management & Operations**
- **Server Lifecycle Management**: Start, stop, update MCP servers
- **Configuration Management**: Update client configurations safely
- **Health Monitoring**: Real-time server status and performance
- **Remote Tool Execution**: Execute tools across MCP server networks

## 🎭 The "Argh-Coding" Philosophy

Every tool in Meta MCP is designed around **enhanced response patterns** that prevent the classic developer frustrations:

```python
# Instead of mysterious crashes:
"LOGGING_UNICODE_CRASH: Found 16 Unicode loggers causing restart loops"

# Instead of generic errors:  
"DOCKER_CONNECTION_BROKEN: Kill all three processes, UI is deceptive"

# Instead of wasted debugging:
"FASTMCP_API_MISUSE: Use decorator patterns, not list_tools() method"
```

## 🚀 Quick Start

For detailed installation instructions, see **[INSTALL.md](INSTALL.md)**.

### Quick Installation

```powershell
# Navigate to the backend directory
cd backend

# Install in development mode
pip install -e .
```

### Configure in Cursor IDE

Add Meta MCP to your Cursor settings:

1. **Open Cursor Settings** (Ctrl/Cmd + ,)
2. **Add to MCP Configuration**:

```json
{
  "mcp": {
    "meta-mcp": {
      "command": "meta-mcp-server",
      "args": [],
      "cwd": "D:\\Dev\\repos\\meta_mcp\\backend"
    }
  }
}
```

3. **Restart Cursor** to load the MCP server

> **Note**: Update the `cwd` path to match your actual repository location!

### Start MCP Server Directly (stdio)
```bash
meta-mcp-server
```

### Start Web UI/API
```bash
meta-mcp
```

### First Use: EmojiBuster Scan
```bash
# Scan all repositories for Unicode logging crashes
meta-mcp-server
# Then call: emojibuster_scan(repo_path="*", auto_fix=True)
```

## 🛠️ Available Tools

Once configured in Cursor, Meta MCP provides these tool categories:

### 🔍 **Discovery & Analysis**
- **`analyze_runts`**: Scan MCP repositories for "runts" needing SOTA upgrades
- **`get_repo_status`**: Detailed repository health analysis and recommendations
- **`discover_servers`**: Find all MCP servers across your system
- **`check_client_integration`**: Audit MCP client configurations

### 🔧 **Diagnostic Tools**
- **`emojibuster`**: Unicode logging crash prevention and recovery
- **`powershell_tools`**: PowerShell script validation and management

### 🏗️ **Scaffolding & Generation**
- **`create_mcp_server`**: Generate SOTA-compliant MCP server repositories
- **`create_fullstack_app`**: Build FastAPI + React fullstack applications
- **`create_landing_page`**: Create beautiful, responsive landing pages
- **`create_webshop`**: Generate e-commerce applications
- **`create_game`**: Build browser-based games
- **`create_wisdom_tree`**: Create interactive wisdom tree applications

### 📋 Tool Categories Reference

#### 🔧 **Diagnostic Tools**
- **EmojiBuster**: Unicode logging crash prevention and recovery
- **PowerShell Validator**: Script syntax and best practices validation

#### 🏗️ **Generation Tools**
- **MCP Server Builder**: SOTA-compliant server scaffolding
- **Fullstack App Builder**: FastAPI + React application generation
- **Landing Page Builder**: Startup-ready page generation
- **Webshop Builder**: E-commerce application scaffolding
- **Game Builder**: Browser-based game creation
- **Wisdom Tree Builder**: Interactive knowledge visualization

#### 🚀 **Improvement Tools**
- **Runt Analyzer**: Repository health assessment and upgrade recommendations
- **SOTA Compliance Checker**: FastMCP 2.14.1+ standards validation
- **Repository Scanner**: Comprehensive MCP ecosystem analysis

## 🎯 Real-World Impact

### Before Meta MCP:
- **3+ days** of cumulative delay from Unicode crashes
- **Hours** debugging Docker Desktop confusion
- **Mysterious** service restarts and instability
- **Frustrating** framework assumption errors

### After Meta MCP:
- **Immediate Audit**: 100% ASCII-safe code and docstrings
- **Proactive Protection**: Eliminates "crasher" emojis across code and documentation
- **SOTA Compliance**: 200+ improvements made automatically in `meta_mcp` alone

## 🌟 Enhanced Response Patterns

All Meta MCP tools implement FastMCP 2.14.1+ enhanced response patterns:

- **🔍 Progressive Success**: Multi-level detail with recommendations
- **❓ Clarification**: Ambiguity resolution with options
- **🛡️ Error Recovery**: Fail-fast with specific recovery steps
- **📊 Rich Metadata**: Search/navigation with pagination
- **💬 Conversational**: Natural dialogue flow with context

## 🔧 Troubleshooting

### Common Issues

**Server Won't Start in Cursor:**
- ✅ **Verify installation**: `pip install -e .` in backend directory
- ✅ **Check configuration**: Ensure correct `cwd` path in Cursor settings
- ✅ **Restart Cursor**: Required after adding MCP configuration

**Tools Not Appearing:**
- ✅ **Wait for loading**: Cursor may take a moment to load MCP servers
- ✅ **Check logs**: Look for errors in Cursor's MCP output
- ✅ **Verify paths**: Ensure all paths in configuration are correct

**Import Errors:**
- ✅ **Python path**: Make sure you're in the backend directory
- ✅ **Dependencies**: Run `pip install -e .` to install all requirements
- ✅ **Environment**: Check that FastMCP 2.14.1+ is installed

### Getting Help

- **Check server status**: Run `meta-mcp-server` directly to test
- **View logs**: Look for error messages in Cursor's MCP server logs
- **Validate config**: Ensure JSON syntax is correct in Cursor settings

## 📚 Documentation

- **[INSTALL.md](INSTALL.md)**: Complete installation and configuration guide
- **[STANDARDS.md](STANDARDS.md)**: Complete FastMCP 2.14.1+ SOTA standards
- **[TOOLS.md](docs/TOOLS.md)**: Detailed tool documentation
- **[PATTERNS.md](docs/PATTERNS.md)**: Enhanced response pattern guide
- **[EXAMPLES.md](docs/EXAMPLES.md)**: Real-world usage examples
- **[POWERSHELL_BEST_PRACTICES.md](docs/POWERSHELL_BEST_PRACTICES.md)**: PowerShell development guidelines

## 🤝 Contributing

Meta MCP follows the **"Argh-Coding" philosophy** - if you've experienced a developer frustration that deserves a bloop-buster tool, we want to build it!

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Meta MCP**: Turning "Argh!" moments into "Aha!" moments since 2026. 🚀
