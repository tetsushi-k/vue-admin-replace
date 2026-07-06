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
| Phase 2 | gateway 統一ドメイン、legacy customers 維持、認証トークン統一、受注詳細モーダル（Vue のみ） |
| Phase 3（将来） | CSV エクスポート、一括更新、他画面の Vue 化 |

### 共存期間の運用

**Phase 1（別ポート比較）**

- `legacy-frontend/`（port 8081）: Before として残す
- `frontend-vue/`（port 5173）: After として新規開発
- ユーザーは URL で切り替えて比較可能

**Phase 2 以降（本番想定の同一ドメイン）**

- **推奨入口**: `http://localhost`（gateway nginx :80）
- パス振り分け:
  - `/` および Vue ルート → frontend-vue
  - `/legacy/*` → legacy-frontend（未移行画面）
  - `/api/*` → Laravel API
- **未移行画面**: customers は legacy のみ（Vue 化しない）。段階移行の証拠として維持
- **認証**: localStorage キー `admin_token` を legacy / Vue で共有
- 別ポート直アクセス（`:8081` / `:5173` / `:8000`）は比較用に残す

## 移行判断の理由

1. **リスク低減**: API を先に固定し、フロントのみ差し替える
2. **比較可能**: 同一データ・同一 API で Before/After を並べられる
3. **段階的**: 一覧画面から着手し、他画面へ横展開しやすい
4. **本番再現**: gateway で 1 ドメイン運用を開発環境でも検証し、移行期の再ログイン問題を軽減

## 完了条件

### Phase 1

- [x] legacy / vue 双方から受注一覧が閲覧できる
- [x] jQuery 版はフィルタでフルリロード、Vue 版はリロードなし
- [x] admin ロールのみアクセス可能

### Phase 2（gateway 統一）

- [x] `http://localhost` から Vue / legacy / API に到達できる
- [x] `/orders`（Vue）と `/legacy/customers.html`（legacy）を相互遷移できる
- [x] `admin_token` で legacy ↔ Vue のログイン状態が共有される
- [x] legacy orders（Before 比較）は維持、customers は legacy のみ
- [x] `make test` 成功、aidlc-docs / README と実装が一致
