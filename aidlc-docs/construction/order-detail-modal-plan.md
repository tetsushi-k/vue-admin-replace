# 実装計画: 受注詳細モーダル（Phase 2）

## 設計判断（承認済み）

| 項目 | 決定 |
|------|------|
| データ源 | 一覧 API の行データ（詳細 API は追加しない） |
| 対象 | `frontend-vue/` のみ |
| UI | Element Plus `el-dialog` |
| 状態管理 | 親コンポーネント（`OrderListView`）で `selectedOrder` を保持。Pinia は拡張しない |

## 実装順序

1. `OrderDetailModal.vue` を新規作成
2. `OrderTable.vue` に行クリック emit を追加
3. `OrderListView.vue` でモーダル開閉・選択 order を管理
4. Vitest 追加・拡張
5. README / aidlc-docs 整合

## 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `frontend-vue/src/components/OrderDetailModal.vue` | 新規。`el-dialog` で受注詳細表示 |
| `frontend-vue/src/components/OrderTable.vue` | `@row-click` → `row-click` emit |
| `frontend-vue/src/views/OrderListView.vue` | `selectedOrder` / モーダル表示制御 |
| `frontend-vue/src/components/OrderDetailModal.spec.ts` | 新規。表示項目・閉じる動作 |
| `frontend-vue/src/components/OrderTable.spec.ts` | 行クリック emit のテスト追加 |
| `aidlc-docs/` | migration-plan, audit, 本ファイル |
| `README.md` | 動作確認手順を追記 |

## 変更しないもの

- `legacy-frontend/` — Before 比較のため現状維持
- Laravel API — `GET /api/admin/orders` のみ（境界固定）
- `orderStore` — 一覧取得ロジックは Phase 1 のまま

## 完了確認

```bash
make test
```

手動確認（Vue SPA http://localhost:5173）:

1. admin でログインし受注一覧を表示
2. 任意の行をクリック → 詳細モーダルが開き、id / 顧客名 / 金額 / ステータス / 注文日時が表示される
3. モーダルを閉じる
4. フィルタ・ページネーションが従来どおり動作する
