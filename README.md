# Minemap Explorer

Next.js 15 と React 19、TypeScript を用いたマインクラフトワールド閲覧アプリです。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで <http://localhost:3000> を開きます。

## プロジェクト方針

- `presentation/components/ui` に shadcn/ui の基本コンポーネントを配置
- 新規 UI 部品は `src/presentation/components` 以下に追加
- `domain` / `application` / `infrastructure` / `presentation` の構造を維持

## 概要

- マインクラフトワールドをリアルタイム取得して 3D 表示
- 一人称視点と俯瞰マップビューを切り替え
- Three.js または Babylon.js での実装を比較検討
- Next.js 15 + React 19 を活かしたパフォーマンス最適化
- ハザードマップに適した簡潔なビジュアル表現
- Vercel 無料プランでの運用制限の整理

調査完了後、開発フローとサンプル実装をご提案します。
