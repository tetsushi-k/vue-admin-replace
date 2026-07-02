# 実装計画（Construction）

## 実装順序

1. Docker Compose 骨格（app / db / legacy / frontend）
2. Laravel API + migration + factory + seeder
3. PHPUnit（認証・一覧・認可）
4. legacy-frontend（jQuery + nginx:8081）
5. frontend-vue（Element Plus + Pinia + Vitest）
6. aidlc-docs / README 整備
7. `make setup && make test` で E2E 確認

## API 実装

### エンドポイント

| Method | Path | 認可 |
|--------|------|------|
| POST | /api/login | 公開 |
| POST | /api/logout | 認証必須 |
| GET | /api/me | 認証必須 |
| GET | /api/admin/orders | admin のみ |

### 一覧クエリ

- `status`: pending / paid / shipped / cancelled
- `date_from`, `date_to`: YYYY-MM-DD
- `page`, `per_page`（default 20）
- ソート: `ordered_at` DESC 固定

## フロントエンド実装

### legacy-frontend

- 静的 HTML + jQuery CDN
- フィルタ submit → `window.location.search` でフルリロード（意図的アンチパターン）
- テーブル行は文字列連結で生成

### frontend-vue

- Vite dev server :5173
- Pinia `orderStore` で filters / orders / loading / error を管理
- フィルタ変更 → `applyFilters()` → API 再取得（リロードなし）

## テスト戦略

### PHPUnit

- `AuthApiTest`: login 成功 / 失敗
- `AdminOrderApiTest`: pagination, status, date, page フィルタ
- `AdminAuthorizationTest`: 401 / 403 / 200

### Vitest

- `OrderFilterBar.spec.ts`: emit / store 更新
- `orderStore.spec.ts`: API モック、loading 状態
- `OrderTable.spec.ts`: 行表示、空状態

## 完了確認

```bash
make setup
make test
```

- legacy: http://localhost:8081
- vue: http://localhost:5173
- API: http://localhost:8000
