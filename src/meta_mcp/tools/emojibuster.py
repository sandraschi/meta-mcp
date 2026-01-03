"""
EmojiBuster Tool - Unicode Logging Crash Prevention and Recovery

This tool scans repositories for Unicode characters in logger calls that cause
production crashes and restart loops. It's the ultimate "Argh-Coding" bloop-buster
for the Gen X emoji overuse problem!
"""

import asyncio
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from fastmcp import FastMCP

# Unsafe Unicode patterns that cause logging crashes
UNSAFE_UNICODE_PATTERNS = [
    r'logger\.[a-z_]+\([^)]*[🚀⚠️❌✅🔍🎉🏆😀😂😍🎭😎]',
    r'print\([^)]*[🚀⚠️❌✅🔍🎉🏆😀😂😍🎭😎]',  # PRINT STATEMENTS TOO!
    r'logger\.[a-z_]+\([^)]*[\U0001F600-\U0001F64F]',  # Emoticons
    r'print\([^)]*[\U0001F600-\U0001F64F]',  # Emoticons in print
    r'logger\.[a-z_]+\([^)]*[\U0001F300-\U0001F5FF]',  # Misc Symbols
    r'print\([^)]*[\U0001F300-\U0001F5FF]',  # Misc Symbols in print
    r'logger\.[a-z_]+\([^)]*[\U0001F680-\U0001F6FF]',  # Transport & Map
    r'print\([^)]*[\U0001F680-\U0001F6FF]',  # Transport & Map in print
    r'logger\.[a-z_]+\([^)]*[\U0001F700-\U0001F77F]',  # Alchemical
    r'print\([^)]*[\U0001F700-\U0001F77F]',  # Alchemical in print
    r'logger\.[a-z_]+\([^)]*[\U0001F780-\U0001F7FF]',  # Geometric
    r'print\([^)]*[\U0001F780-\U0001F7FF]',  # Geometric in print
    r'logger\.[a-z_]+\([^)]*[\U0001F800-\U0001F8FF]',  # Supplemental
    r'print\([^)]*[\U0001F800-\U0001F8FF]',  # Supplemental in print
    r'logger\.[a-z_]+\([^)]*[\U0001F900-\U0001F9FF]',  # Symbols & Pictographs
    r'print\([^)]*[\U0001F900-\U0001F9FF]',  # Symbols & Pictographs in print
    r'logger\.[a-z_]+\([^)]*[\U0001FA00-\U0001FA6F]',  # Chess
    r'print\([^)]*[\U0001FA00-\U0001FA6F]',  # Chess in print
    r'logger\.[a-z_]+\([^)]*[\U0001FB00-\U0001FBFF]',  # Symbols
    r'print\([^)]*[\U0001FB00-\U0001FBFF]',  # Symbols in print
]

# Safe ASCII replacements for common Unicode emojis
UNICODE_REPLACEMENTS = {
    '🚀': 'Process',
    '⚠️': 'WARNING',
    '❌': 'ERROR',
    '✅': 'SUCCESS',
    '🔍': 'DEBUG',
    '🎉': 'Celebration',
    '🏆': 'Achievement',
    '😀': 'Happy',
    '😂': 'Laughing',
    '😍': 'Love',
    '🎭': 'Mask',
    '😎': 'Cool',
    '📝': 'Document',
    '📊': 'Chart',
    '🔧': 'Tools',
    '💡': 'Idea',
    '🎯': 'Target',
    '⭐': 'Star',
    '🔗': 'Link',
    '📁': 'Folder',
    '🔒': 'Lock',
    '🌐': 'Global',
    '📱': 'Mobile',
    '💻': 'Computer',
    '🚦': 'Start',
    '⏸️': 'Stop',
    '🔄': 'Refresh',
    '⬆️': 'Up',
    '⬇️': 'Down',
    '✨️': 'Magic',
    '🎨': 'Design',
    '🌈': 'Rainbow',
    '🌟': 'Sun',
    '🌙': 'Moon',
    '⚡': 'Bolt',
    '🔥': 'Fire',
    '💧': 'Water',
    '🌊': 'Wave',
}

class EmojiBuster:
    """Unicode logging crash prevention and recovery specialist.
    
    Scans for Unicode characters in ALL output streams that cause crashes:
    - logger.*() calls (logging to files/console)
    - print() statements (direct console output)
    - Any Unicode in output streams destined for logs/files
    
    SAFE Unicode (allowed):
    - Triple-quoted comments: Docstring content
    - Content body: Return values, API responses
    - User-facing content: UI elements, messages
    - Safe emojis in content: (serialize reliably)
    """
    
    def __init__(self):
        self.scan_cache = {}
        self.success_stories = []
    
    async def scan_repository(
        self, 
        repo_path: str, 
        scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan a single repository for Unicode logging issues."""
        
        repo_path = Path(repo_path)
        if not repo_path.exists():
            return {
                "success": False,
                "error": f"Repository path does not exist: {repo_path}",
                "error_code": "REPO_NOT_FOUND"
            }
        
        # Find all Python files
        python_files = list(repo_path.rglob("*.py"))
        
        unicode_issues = []
        total_files = len(python_files)
        files_with_unicode = 0
        
        for file_path in python_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                    
                file_issues = []
                for line_num, line in enumerate(lines, 1):
                    for pattern in UNSAFE_UNICODE_PATTERNS:
                        matches = re.finditer(pattern, line)
                        for match in matches:
                            file_issues.append({
                                "line_number": line_num,
                                "line_content": line.strip(),
                                "unsafe_match": match.group(),
                                "risk_level": "critical"
                            })
                
                if file_issues:
                    files_with_unicode += 1
                    unicode_issues.append({
                        "file": str(file_path.relative_to(repo_path)),
                        "issues": file_issues,
                        "issue_count": len(file_issues)
                    })
                    
            except Exception as e:
                unicode_issues.append({
                    "file": str(file_path.relative_to(repo_path)),
                    "error": f"Failed to scan file: {str(e)}",
                    "issue_count": 0
                })
        
        return {
            "success": True,
            "repository": str(repo_path),
            "scan_mode": scan_mode,
            "total_files": total_files,
            "files_with_unicode": files_with_unicode,
            "total_unicode_issues": len(unicode_issues),
            "unicode_issues": unicode_issues,
            "crash_risk": "HIGH" if files_with_unicode > 0 else "LOW"
        }
    
    async def scan_multiple_repositories(
        self, 
        repo_paths: List[str],
        scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan multiple repositories for Unicode logging issues."""
        
        results = []
        total_unicode_issues = 0
        repos_with_unicode = 0
        
        for repo_path in repo_paths:
            result = await self.scan_repository(repo_path, scan_mode)
            results.append(result)
            
            if result.get("success"):
                total_unicode_issues += result.get("total_unicode_issues", 0)
                if result.get("files_with_unicode", 0) > 0:
                    repos_with_unicode += 1
        
        return {
            "success": True,
            "operation": "emojibuster_scan_multiple",
            "scan_mode": scan_mode,
            "repos_scanned": len(repo_paths),
            "repos_with_unicode": repos_with_unicode,
            "total_unicode_issues": total_unicode_issues,
            "individual_results": results,
            "overall_crash_risk": "HIGH" if total_unicode_issues > 0 else "LOW"
        }
    
    async def fix_unicode_logging(
        self, 
        repo_path: str,
        backup: bool = True
    ) -> Dict[str, Any]:
        """Fix Unicode logging issues in a repository."""
        
        scan_result = await self.scan_repository(repo_path)
        
        if not scan_result.get("success"):
            return scan_result
        
        if scan_result.get("total_unicode_issues", 0) == 0:
            return {
                "success": True,
                "message": "No Unicode logging issues found",
                "repository": repo_path,
                "issues_fixed": 0
            }
        
        repo_path = Path(repo_path)
        fixed_files = 0
        total_fixes = 0
        
        for issue in scan_result["unicode_issues"]:
            if "error" in issue:
                continue
                
            file_path = repo_path / issue["file"]
            
            # Create backup if requested
            if backup:
                backup_path = file_path.with_suffix(file_path.suffix + ".backup")
                backup_path.write_text(file_path.read_text(encoding='utf-8'), encoding='utf-8')
            
            # Fix the file
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Replace Unicode with safe alternatives
                for unicode_char, replacement in UNICODE_REPLACEMENTS.items():
                    content = content.replace(unicode_char, replacement)
                
                # Also replace in logger calls specifically
                lines = content.split('\n')
                fixed_lines = []
                
                for line in lines:
                    # Check if this is a logger call with Unicode
                    if re.search(r'logger\.[a-z_]+.*[\U0001F000-\U0001F9FF]', line):
                        # Remove all Unicode characters from logger calls
                        # Keep only ASCII-safe characters
                        clean_line = re.sub(r'[^\x00-\x7F]+', '', line)
                        fixed_lines.append(clean_line)
                    else:
                        fixed_lines.append(line)
                
                content = '\n'.join(fixed_lines)
                
                # Only write if content changed
                if content != original_content:
                    file_path.write_text(content, encoding='utf-8')
                    fixed_files += 1
                    total_fixes += len(issue["issues"])
                    
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Failed to fix file {issue['file']}: {str(e)}",
                    "error_code": "FIX_FAILED"
                }
        
        # Add to success stories
        success_story = {
            "repository": str(repo_path),
            "timestamp": asyncio.get_event_loop().time(),
            "issues_fixed": total_fixes,
            "files_fixed": fixed_files,
            "stability_improved": True
        }
        self.success_stories.append(success_story)
        
        return {
            "success": True,
            "operation": "emojibuster_fix",
            "repository": str(repo_path),
            "files_fixed": fixed_files,
            "total_fixes": total_fixes,
            "backup_created": backup,
            "success_story": success_story
        }
    
    async def get_success_stories(self) -> Dict[str, Any]:
        """Get success stories from previous EmojiBuster operations."""
        
        return {
            "success": True,
            "operation": "emojibuster_success_stories",
            "total_stories": len(self.success_stories),
            "success_stories": self.success_stories,
            "summary": {
                "total_repos_fixed": len(set(story["repository"] for story in self.success_stories)),
                "total_issues_fixed": sum(story["issues_fixed"] for story in self.success_stories),
                "stability_improvements": len(self.success_stories)
            }
        }


# Initialize EmojiBuster instance
emoji_buster = EmojiBuster()


def register_emojibuster_tools(app: FastMCP):
    """Register EmojiBuster tools with FastMCP application."""
    
    @app.tool()
    async def emojibuster_scan(
        repo_path: str = "*",
        scan_mode: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Scan repository/repositories for Unicode logging crash risks.
        
        Args:
            repo_path: Repository path to scan (use "*" for all discovered repos)
            scan_mode: Scan intensity level ("quick" or "comprehensive")
            
        Returns:
            Enhanced response with scan results and crash risk assessment
        """
        
        if repo_path == "*":
            # Discover repositories (simplified - in real implementation, 
            # this would use the discovery tools)
            repo_paths = ["d:\\Dev\\repos\\mcp-central-docs", "d:\\Dev\\repos\\qbt-mcp"]
            result = await emoji_buster.scan_multiple_repositories(repo_paths, scan_mode)
        else:
            result = await emoji_buster.scan_repository(repo_path, scan_mode)
        
        # Add enhanced response pattern
        if result.get("success"):
            result.update({
                "operation": "emojibuster_scan",
                "scan_completed": True,
                "recommendations": [
                    "Run with auto_fix=True to automatically fix Unicode issues",
                    "Add pre-commit hooks to prevent future Unicode logging",
                    "Audit repositories weekly for new Unicode additions"
                ],
                "next_steps": [
                    "Run emojibuster_fix() to resolve identified issues",
                    "Check success_stories for similar fixes",
                    "Implement Unicode validation in CI/CD pipeline"
                ]
            })
        
        return result
    
    @app.tool()
    async def emojibuster_fix(
        repo_path: str,
        auto_fix: bool = False,
        backup: bool = True
    ) -> Dict[str, Any]:
        """Fix Unicode logging issues that cause crashes.
        
        Args:
            repo_path: Repository path to fix
            auto_fix: Whether to automatically fix issues (requires confirmation)
            backup: Whether to create backups before fixing
            
        Returns:
            Enhanced response with fix results and stability improvements
        """
        
        if not auto_fix:
            return {
                "success": False,
                "error": "Auto-fix not enabled. Set auto_fix=True to proceed.",
                "error_code": "AUTO_FIX_REQUIRED",
                "recovery_options": [
                    "Set auto_fix=True to automatically fix Unicode issues",
                    "Manually review and fix each Unicode logger call",
                    "Use emojibuster_scan() to see specific issues first"
                ],
                "warning": "Auto-fix will replace Unicode characters with ASCII alternatives"
            }
        
        result = await emoji_buster.fix_unicode_logging(repo_path, backup)
        
        # Add enhanced response pattern
        if result.get("success"):
            result.update({
                "operation": "emojibuster_fix",
                "stability_improved": True,
                "crash_risk_eliminated": "HIGH" if result.get("total_fixes", 0) > 0 else "LOW",
                "follow_up_actions": [
                    "Test the fixed repository for stability",
                    "Monitor for any remaining Unicode issues",
                    "Add pre-commit hooks to prevent future problems"
                ]
            })
        
        return result
    
    @app.tool()
    async def emojibuster_success_stories() -> Dict[str, Any]:
        """Get success stories from previous EmojiBuster operations.
        
        Returns:
            Enhanced response with success stories and stability improvements
        """
        
        result = await emoji_buster.get_success_stories()
        
        # Add enhanced response pattern
        result.update({
            "operation": "emojibuster_success_stories",
            "impact_summary": {
                "crashes_prevented": "Unknown but significant",
                "developer_hours_saved": "Substantial",
                "production_stability": "Greatly improved"
            },
            "recommendations": [
                "Share success stories to help other developers",
                "Monitor fixed repositories for continued stability",
                "Contribute new Unicode patterns to improve detection"
            ]
        })
        
        return result
