import base64
import os
from pathlib import Path


def image_to_base64_src(image_path: str) -> str:
    """
    读取图片文件，返回可直接用于 HTML/JSX img src 属性的 base64 字符串。

    Args:
        image_path: 图片文件路径（支持相对路径或绝对路径）

    Returns:
        格式为 "data:image/{ext};base64,{data}" 的字符串

    Raises:
        FileNotFoundError: 图片文件不存在时抛出
        ValueError: 不支持的图片格式时抛出
    """
    # 扩展名 → MIME 类型映射
    MIME_MAP = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".bmp": "image/bmp",
        ".ico": "image/x-icon",
    }

    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(f"图片文件不存在: {image_path}")

    ext = path.suffix.lower()
    mime_type = MIME_MAP.get(ext)
    if not mime_type:
        raise ValueError(f"不支持的图片格式: {ext}，支持格式: {list(MIME_MAP.keys())}")

    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"


def batch_images_to_base64(image_paths: list[str]) -> dict[str, str]:
    """
    批量转换多张图片为 base64 src 字符串。

    Args:
        image_paths: 图片路径列表

    Returns:
        dict，key 为原始路径，value 为对应的 base64 src 字符串
        转换失败的图片会记录错误信息作为 value
    """
    results = {}
    for path in image_paths:
        try:
            results[path] = image_to_base64_src(path)
            print(f"✅ 转换成功: {path}")
        except (FileNotFoundError, ValueError) as e:
            results[path] = f"ERROR: {e}"
            print(f"❌ 转换失败: {path} → {e}")
    return results


def images_in_folder_to_base64(folder_path: str) -> dict[str, str]:
    """
    转换指定文件夹下所有支持格式的图片。

    Args:
        folder_path: 图片所在文件夹路径

    Returns:
        dict，key 为文件名，value 为 base64 src 字符串
    """
    SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"}

    folder = Path(folder_path)
    if not folder.is_dir():
        raise NotADirectoryError(f"路径不是有效文件夹: {folder_path}")

    image_files = [
        str(f) for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not image_files:
        print(f"⚠️ 文件夹中未找到支持的图片: {folder_path}")
        return {}

    return batch_images_to_base64(image_files)


# ── 使用示例 ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    #
    # # 1. 单张图片转换
    # src = image_to_base64_src("C:/Users/Administrator/Desktop/网站资料/categories/urchip-uhf.jpg")
    # print(src[:80], "...")  # 预览前80字符

    # 2. 批量转换（列表）
    results = batch_images_to_base64([
        "C:/Users/Administrator/Desktop/网站资料/categories/urchip-uhf.jpg",
        "C:/Users/Administrator/Desktop/网站资料/categories/smart-linens.jpg",
        "C:/Users/Administrator/Desktop/网站资料/categories/urtag-silicone.jpg",
        "C:/Users/Administrator/Desktop/网站资料/categories/rfid-readers.jpg",
    ])
    for path, b64 in results.items():
        print(b64)

    # # 3. 整个文件夹转换
    # folder_results = images_in_folder_to_base64("assets/")
    # for filename, b64 in folder_results.items():
    #     print(f"{filename}: {b64}")
