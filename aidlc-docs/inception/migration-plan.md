# jQuery → Vue 段階移行計画

## 背景

EC 受注管理画面は長年 jQuery で運用されてきた。UI 改修のたびに DOM 操作が複雑化し、フィルタ変更のたびにページ全体をリロードする実装が残っている。

## 方針

### API 境界を固定する

- バックエンド API（`GET /api/admin/orders` ほか）は **変更しない**
- legacy（jQuery）と Vue を **同一 API** で並行稼働させる
- 認証は Laravel Sanctum の Bearer トークンで統一

### 段階リプレイス

| フェーズ | 内容 |
|---------|------|
| Phase 1 | 受注一覧の検索・フィルタ・ページネーションを Vue 化 |
| Phase 2 | 受注詳細モーダル（Vue 側のみ、一覧行データを表示） |
| Phase 3（将来） | CSV エクスポート、一括更新、編集画面等 |

### 共存期間の運用

- `legacy-frontend/`（port 8081）: Before として残す
- `frontend-vue/`（port 5173）: After として新規開発
- ユーザーは URL で切り替えて比較可能

## 移行判断の理由

1. **リスク低減**: API を先に固定し、フロントのみ差し替える
2. **比較可能**: 同一データ・同一 API で Before/After を並べられる
3. **段階的**: 一覧画面から着手し、他画面へ横展開しやすい

## 完了条件（Phase 1）

- [x] legacy / vue 双方から受注一覧が閲覧できる
- [x] jQuery 版はフィルタでフルリロード、Vue 版はリロードなし
- [x] admin ロールのみアクセス可能

## Phase 2: 受注詳細モーダル

### スコープ

- **対象**: `frontend-vue/` のみ。`legacy-frontend/` は変更しない
- **UI**: Element Plus `el-dialog`
- **データ源**: 一覧 API（`GET /api/admin/orders`）の行データをそのまま使う。詳細 API（`GET /api/admin/orders/{id}`）は追加しない
- **表示項目**: id, customer_name, amount, status, ordered_at（一覧と同じ）

### 完了条件（Phase 2）

- [x] 受注一覧テーブルの行クリックで詳細モーダルが開く
- [x] モーダルを閉じられる
- [x] フィルタ・ページネーションの既存動作は維持
- [x] Vitest で行クリック・表示項目を検証
- [x] `make test` が成功する
