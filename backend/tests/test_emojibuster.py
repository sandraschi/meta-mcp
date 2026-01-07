import pytest
from meta_mcp.tools.emojibuster import EmojiBuster


@pytest.fixture
def emojibuster():
    return EmojiBuster()


@pytest.mark.asyncio
async def test_scan_repository_no_issues(emojibuster, tmp_path):
    # Create a clean python file
    p = tmp_path / "clean.py"
    p.write_text("print('Hello World')", encoding="utf-8")

    result = await emojibuster.scan_repository(str(tmp_path))

    assert result["success"] is True
    assert result["total_unicode_issues"] == 0
    assert result["files_with_unicode"] == 0


@pytest.mark.asyncio
async def test_scan_repository_with_issues(emojibuster, tmp_path):
    # Create a file with emoji in print
    p = tmp_path / "bad.py"
    p.write_text("print('Hello Process')", encoding="utf-8")

    result = await emojibuster.scan_repository(str(tmp_path))

    assert result["success"] is True
    assert result["total_unicode_issues"] == 1
    assert result["files_with_unicode"] == 1
    assert result["unicode_issues"][0]["file"] == "bad.py"


@pytest.mark.asyncio
async def test_fix_unicode_logging(emojibuster, tmp_path):
    # Create a file that needs fixing
    p = tmp_path / "fixme.py"
    original_content = "logger.info('Starting process Process')"
    p.write_text(original_content, encoding="utf-8")

    # Fix it
    result = await emojibuster.fix_unicode_logging(str(tmp_path), backup=True)

    assert result["success"] is True
    assert result["files_fixed"] == 1

    # Verify content changed
    new_content = p.read_text(encoding="utf-8")
    assert "Process" not in new_content
    # The replacement map in EmojiBuster defines Process -> Process
    assert "Process" in new_content

    # Verify backup exists
    backup_path = p.with_suffix(".py.backup")
    assert backup_path.exists()
    assert backup_path.read_text(encoding="utf-8") == original_content


@pytest.mark.asyncio
async def test_repo_not_found(emojibuster):
    result = await emojibuster.scan_repository("/path/does/not/exist")
    assert result["success"] is False
    assert result["error_code"] == "REPO_NOT_FOUND"
