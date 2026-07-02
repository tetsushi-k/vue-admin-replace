# Vue フロントエンド設計

## 技術選定

### Vue 3 + Composition API + TypeScript

- 単一ファイルコンポーネントで UI とロジックを局所化
- TypeScript で API レスポンス型を明示
- Composition API で Pinia との連携を簡潔に保つ

### Element Plus

**選定理由:**

- `el-table`, `el-pagination`, `el-select`, `el-date-picker` が業務画面向けに揃っている
- ローディング（`v-loading`）・空状態（`el-empty`）が標準提供
- 日本語ロケール対応が容易

### Pinia

**選定理由:**

- 検索条件・一覧データ・loading / error を一箇所で管理
- コンポーネント間の props バケツリレーを避ける
- テスト時に store をモックしやすい

## コンポーネント分割

```
OrderListView.vue        # ページ全体・ルーティング連携
├── OrderFilterBar.vue   # ステータス・日付範囲フィルタ
├── OrderTable.vue       # 一覧表示・ステータスバッジ
└── OrderPagination.vue  # ページ切り替え
```

### 責務

| コンポーネント | 責務 |
|---------------|------|
| OrderFilterBar | フィルタ UI、store 更新、search emit |
| OrderTable | props で受け取った orders の表示、空状態 |
| OrderPagination | meta に基づくページ切り替え emit |
| OrderListView | store 呼び出し、認証ガード、レイアウト |

## legacy との差分（改善点）

| 項目 | legacy (jQuery) | Vue 3 |
|------|-----------------|-------|
| DOM 生成 | 文字列連結 | 宣言的テンプレート |
| フィルタ変更 | `window.location` フルリロード | API 再取得のみ |
| 状態管理 | グローバル変数 + localStorage | Pinia store |
| ローディング | 手動 show/hide | `v-loading` + store.loading |
