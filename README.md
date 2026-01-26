# TaskBoard

社内タスク管理（カンバン）＋作業時間計測（タイマー）＋可視化（グラフ）を統合した、ポートフォリオ向けフロントエンドアプリです。  
チーム（Project）と個人（Personal）のタスクを同じ仕組みで扱い、Focus/Calendar/Dashboard で「今・期間・工数」を見える化します。

---

## 特徴（Features）
- カンバン（ToDo / Doing / Done）＋ドラッグ&ドロップ
- タスク：担当者・期限・ラベル・コメント（想定）
- Focus：現在抱えているタスク（進行中/期限近い/期限超過）を集約表示
- カレンダー：期限/開始/完了を表示（予定）
- タイマー：タスクごとの作業時間を記録（Start/Stop）
- 可視化：作業時間を棒グラフ / 折れ線グラフで表示

---

## Tech Stack / 使用技術
### Frontend
- React + TypeScript
- Vite

### Libraries
- @dnd-kit（Drag & Drop）
- recharts（Charts）
- date-fns（Date utility）

### Styling
- CSS Modules

---
## AI Support / 生成AIの活用について

本プロジェクトの設計・実装を進めるにあたり、以下の生成AIを補助的に活用しました。  
（※最終的な設計判断・実装・調整はすべて自分で行っています）

- **ChatGPT**：要件整理、設計（データ構造・コンポーネント分割・フロー）、実装手順の検討
- **Gemini**：仕様の言語化、UI/動線のアイデア整理、文章の推敲
- **Claude**：コードレビュー観点の整理、実装の改善案（可読性・保守性）検討

活用方針：
- 目的は「効率化」と「品質向上」であり、**そのままのコピペではなく**、提案内容を理解した上で取捨選択・修正して反映しています。
- 実装時は動作確認・整合性チェックを行い、要件に合う形に最適化しています。

## Why this stack / 技術選定理由
- **React + TypeScript**：コンポーネント設計と型安全で拡張しやすい
- **Vite**：開発が高速で、フロント主体の制作に最適
- **CSS Modules**：スタイル衝突を防ぎつつ、構造が整理しやすい
- **dnd-kit / recharts**：企業評価ポイント（DnD / 可視化）を実装しやすい

---

## Architecture / 設計方針（v1）
- フロントエンド完結（バックエンド無し）
- すべてのタスクは **1つの配列 `tasks`** で管理し、属性で判別
- 永続化：localStorage
- 別タブ同期：`storage` イベント（擬似リアルタイム）

---

## Data Structure / データ構造（Schema）
v1 はシンプルさ優先で `tasks: Task[]` の1配列で管理します。

```ts
export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  id: string;              // UUID
  title: string;           // タスク名
  status: TaskStatus;      // todo / doing / done
  projectId: string | null;// 所属プロジェクト（個人用は null）
  totalTime: number;       // 累積作業時間（秒）
  isFocus: boolean;        // Focusリストに入れるか
};
