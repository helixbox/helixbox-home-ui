# 需要UI团队提供的图片文件

## 占位符文件列表

以下文件已创建为占位符，需要从UI团队获取实际设计后替换：

### 1. favicon.ico
- **当前状态**: 文本占位符
- **位置**: `/favicon.ico`
- **规格**: 32x32px（建议包含16x16, 32x32, 48x48多尺寸）
- **格式**: ICO
- **优先级**: 低（已有 favicon.svg 可用）

### 2. apple-touch-icon.png
- **当前状态**: 文本占位符
- **位置**: `/apple-touch-icon.png`
- **规格**: 180x180px
- **格式**: PNG
- **设计建议**: 深色背景 + 白色/蓝色logo
- **优先级**: 中

### 3. og-image.png
- **当前状态**: 文本占位符
- **位置**: `/og-image.png`
- **规格**: 1200x630px
- **格式**: PNG 或 JPG
- **设计建议**:
  - 包含 Helixbox Labs logo
  - 标语: "Building the Future of Crypto + AI"
  - 背景: 黑色渐变 + 品牌蓝色 (#0040FF)
  - 可以加入粒子效果或几何元素
- **用途**: 社交媒体分享预览（Facebook, Twitter, LinkedIn等）
- **优先级**: 高

## 已完成的文件

### favicon.svg ✓
- **位置**: `/favicon.svg`
- **状态**: 已创建，使用logo元素
- **可用**: 是，现代浏览器已支持

## 如何替换

1. 从UI团队获取对应规格的图片
2. 将文件放置在项目根目录，覆盖同名文件
3. 文件名必须保持一致
4. 无需修改代码，HTML已配置好引用路径

## 社交媒体预览测试

替换 og-image.png 后，可以使用以下工具测试效果：
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/
