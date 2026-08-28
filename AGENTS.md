# AGENTS.md

## 项目概述

一个网页版单人视频扑克（Video Poker）小游戏。玩法：下注 → 发 5 张牌 → 点击选牌保留 → 换牌 → 根据最终牌型结算倍率奖金；中奖后可继续「猜大小」翻倍奖金（猜错清零），或随时结算。黑/大王可当作任意一张不在手中的同色牌来凑最大牌型。

线上地址：https://xincici-poker.netlify.app/ （Netlify 部署）

## 技术栈

- **框架**：Vue 3（Composition API + `<script setup>`）
- **构建**：Vite（通过 resolutions 替换为 `rolldown-vite`）
- **样式**：SCSS + UnoCSS（presetUno / presetAttributify / presetIcons，图标用 carbon 和 mdi 集合）
- **PWA**：vite-plugin-pwa（autoUpdate，dev 下也启用）
- **依赖管理**：yarn

## 常用命令

```bash
yarn dev      # 启动开发服务器
yarn build    # 构建到 dist/
yarn preview # 预览构建产物
```

没有测试和 lint 配置。

## 目录结构

```
src/
├── main.js              # 入口，挂载 App 并注册 i18n 插件
├── App.vue              # 根组件（HelpDialog + MainGame）
├── plugins/i18n.js      # 自制 i18n（en/cn 双语，language ref + localStorage 持久化）
├── components/
│   ├── MainGame.vue     # 核心游戏逻辑：状态机、发牌、判牌、猜大小
│   ├── CardItem.vue     # 单张扑克牌（含牌背、hold 态、mini 模式）
│   ├── TopHeader.vue    # 顶部：主题切换、语言切换、猜大小开关、帮助入口
│   ├── RuleArea.vue     # 牌型倍率表 / 当前结果展示
│   └── HelpDialog.vue   # 帮助弹窗
└── utils/
    ├── constants.js     # localStorage key 常量（前缀 __poker_game）
    ├── rules.js         # 牌型倍率表 rulesList（同花顺 250x … 一对 1x）
    ├── bet.js           # 下注金额（1–100，localStorage 持久化）
    ├── dice.js          # 猜大小功能开关（全局 ref）
    └── theme.js         # 主题模式 auto/dark/light，auto 跟随系统
```

## 核心逻辑要点（都在 MainGame.vue）

- **游戏状态机**：`WAIT(0) → FIRST(1) → SECOND(2) → LOSE(3) / GUESS(4) / GUESS_LOSE(5)`，重置/结算回到 0。改交互逻辑时先理解这个状态流转。
- **牌的编码**：1–54 的数字，`numToCard` / `cardToNum` 在数字和 `[点数, 花色]` 间转换；53/54 是小王/大王（点数 14）。
- **牌型判定**：`getResult` 判 8 种赢的牌型（一对仅 8 及以上或 A 算赢）；`judgeResult` 处理大小王的穷举替换以取最大倍率。
- **猜大小**：A–6 小、8–K 大、7 平；猜对 `bonus <<= 1`，猜错进入 GUESS_LOSE 清零。
- **持久化**：总资产、下注、语言、主题、猜大小开关均存 localStorage，key 定义在 `utils/constants.js`。

## 约定与注意事项

- 注释和用户可见文案以中文为主；i18n 文案需同时维护 `src/plugins/i18n.js` 中的 `en` 和 `cn` 两份。
- 全局状态用模块级 `ref`/`reactive` 导出（bet.js、dice.js、theme.js 的模式），不使用 Pinia/Vuex。
- 主题通过 `document.body.classList` 的 `dark` 类 + CSS 变量（`--bg-color`、`--text-color`、`--border-color`、`--mask-color`、`--max-width`）实现，新样式应使用这些变量以兼容暗色模式。
- 动画期间用 `game.animating` 标志禁止并发操作，新增交互需遵循该守卫，参考现有按钮的 `:disabled` 写法。
