# Proxy Approval 記録（Audit）

主要設計判断と承認根拠を記録する。

| ID | 判断 | 選択 | 却下した代替案 | 根拠 | 承認 |
|----|------|------|---------------|------|------|
| PA-01 | フロント移行方式 | API 固定 + フロント並行 | ビッグバン全面書き換え | リスク低減、比較可能 | Proxy（本リポジトリ実装で検証） |
| PA-02 | UI ライブラリ | Element Plus | Vuetify, Naive UI | 業務テーブル部品が揃っている | Proxy |
| PA-03 | 状態管理 | Pinia | Vuex, composable のみ | 検索条件 + 一覧 + loading を一元管理 | Proxy |
| PA-04 | 認証方式 | Sanctum Bearer | Session Cookie | SPA / legacy 双方から同一方式で利用 | Proxy |
| PA-05 | legacy フィルタ | フルリロード維持 | AJAX 化 | Before 比較のため意図的アンチパターンを残す | Proxy |
| PA-06 | DB（本番想定） | MySQL 8.0 | PostgreSQL | Docker 標準構成、Laravel デフォルト親和性 | Proxy |
| PA-07 | テスト DB | SQLite in-memory（PHPUnit） | MySQL テストコンテナ | 高速・CI 向き | Proxy |
| PA-08 | 詳細モーダルのデータ源 | 一覧 API の行データ | 詳細 API 追加 | API 境界固定を維持、Phase 2 はフロントのみ | Proxy |

## レビュー日

- 2026-07-02: Phase 1 初回実装完了時に記録
- 2026-07-06: Phase 2 詳細モーダル着手時に PA-08 を記録
