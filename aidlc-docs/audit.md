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
| PA-08 | 開発入口 | gateway nginx `:80` を推奨 | 別ポートのまま | 本番の 1 ドメイン + パス振り分けを開発でも再現。面談デモで「段階移行」を説明しやすい | Proxy |
| PA-09 | 認証トークンキー | `admin_token` に統一 | フロント別キー維持（`legacy_token` / `vue_token`） | 同一 `localhost` オリジンで legacy ↔ Vue 遷移時の再ログインを避ける。旧キーは初回読み込みで移行 | Proxy |
| PA-10 | customers 画面 | legacy のみ（静的 + jQuery） | Vue 化 / API 追加 | 未移行画面の存在をデモするため。新機能は Vue 側のみに足す方針と整合 | Proxy |
| PA-11 | 別ポート直アクセス | 維持（`:8081` / `:5173` / `:8000`） | gateway のみに制限 | Before/After 比較と単体デバッグに有用。README で推奨入口と開発用を区別 | Proxy |
| PA-12 | 詳細モーダルのデータ源 | 一覧 API の行データ | 詳細 API 追加 | API 境界固定を維持、Phase 2 はフロントのみ | Proxy |

## レビュー日

- 2026-07-02: Phase 1 初回実装完了時に記録
- 2026-07-06: Phase 2 gateway 統一ドメイン実装時に PA-08〜PA-11 を追記
- 2026-07-06: Phase 2 詳細モーダル着手時に PA-12 を記録
