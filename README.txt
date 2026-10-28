熙叆角色资源站
==============

向日葵精灵「熙叆」的角色资源网站：四季时光碎片图库、三卷「会动的碎片」影像、
主题音乐与完整角色设定。与视觉小说《魔法时间的童话 ～熙叆的时光物语～》同属一套世界观。

【怎么打开】
1. 用 Chrome / Edge 浏览器双击 index.html 即可。
2. 本站是**单页应用**（SPA），所有页面都在 index.html 里，靠地址栏的 #/ 路由切换。
3. 本站已自包含：图片、视频、音乐都在站内，不需要「熙叆物语」文件夹。
   「D:\24436\Documents\熙叆\」只是原始素材的来源，仅在重新生成缩略图时才会用到。

【页面导航（#/ 路由）】
- #/         主页：角色资料卡、统计、每日精选、各功能区入口
- #/gallery  时光图库：按「全部 / 春 / 夏 / 秋 / 冬」筛选，点击放大（灯箱，支持 ← → 键）
- #/media    影音资源：三卷「会动的碎片」在线播放 + 主题音乐《魔法时间的童话》循环播放
- #/about    角色设定：熙叆与聆淅的完整设定、向日葵国度的世界观
- #/read     聆熙童话：《魔法时间的童话》全文在线阅读（可调字号、记住阅读进度）
- #/board    留言板：访客留言（走 GitHub Issues，不用注册本站账号）

【素材与生成】
- 缩略图（thumbs/ 480px、preview/ 1600px，WebP）、data/photos.json、js/photos.js
  全部由脚本生成，**请勿手改**。
- 目前共 38 枚时光碎片（编号 001 起，按原始文件的拍摄/修改时间排序）。
- 新增照片的标准流程：
    1) 把新图放进 D:\24436\Documents\熙叆\
    2) node tools/rebuild-gallery.js   → 重建 data/manifest.json
    3) node tools/generate.js          → 生成缩略图 + 图库数据
    4) node tools/build-online.js      → 重建在线版 online/
    5) node tools/build-apk2.js        → 重建安卓安装包
  generate.js 会按 data/manifest.json 里的 i 编号命名缩略图（i=34 即 thumbs/034.webp），
  所以**只追加、不要中途删改已有编号**，否则图库里会出现错位。

【想发布到网上？】
本站是纯静态站，可直接上传任意静态托管（GitHub Pages / Cloudflare Pages 等）。
「online/」目录是用 tools/build-online.js 生成的在线版（素材精简、路径站内化、带 SEO 信息），
可直接整目录上传。
原始素材（原图 / 原片 / wav 原声）留在「熙叆」文件夹里，没有放进站内，
所以线上不提供「原图 / 原片」下载，只有精简版图库、480p 影像与 m4a 音乐。

【想装到手机上？】
站点已打包成安卓 App：Lingxi-Garden-v1.2.apk（Android 7.0+，完全离线）。
整站素材都内置在安装包里，装好即用，不依赖浏览器和网络。
安装步骤、内容清单和重新打包的方法见「APK安装说明.txt」。

  重新打包：node tools/build-online.js && node tools/build-apk2.js
  拆包复检：node tools/apk2-verify.js
  ⚠ 重打包必须用同一把签名密钥（tools/lingxi.keystore），否则旧版无法覆盖升级。

【其他】
- 图库照片按时间排序，与《熙叆物语》里的「时光碎片」一一对应（编号即碎片号）。
- 主题音乐《魔法时间的童话》由原 wav 转换而来，游戏与本站共用。

愿魔法的时间，永远与你同在。
