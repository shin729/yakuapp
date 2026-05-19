# yakuapp pending.md 毎朝自動チェック&修正スクリプト
# Windows タスクスケジューラから毎日 9:00 に実行される

$projectDir = "C:\Users\biets\OneDrive\Desktop\claude関連\yakuapp"
$logDir     = Join-Path $projectDir "logs"
$logFile    = Join-Path $logDir ("pending_check_" + (Get-Date -Format "yyyy-MM-dd") + ".log")
$claudeExe  = "C:\Users\biets\.local\bin\claude.exe"

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Set-Location $projectDir

$prompt = @'
checks/pending.md の未対応項目（- [ ]）を確認し、修正できるものはデータファイルを修正してください。

作業手順:
1. checks/pending.md を読み込み、- [ ] で始まる未対応項目を列挙する
2. 各項目を以下の方針で対応する:
   - 欠損確認: null値が意図的か確認（NNT行なし等）→ 意図的nullなら [x] にして「意図的null確定」と記録
   - 網羅: data/<domain>.json への薬剤追加 → 追加実施 → [x] に更新
   - 統一感: フィールド値の表記を他薬と統一 → 修正実施 → [x] に更新
   - 販売中止チェック: 販売継続を確認 → [x] に更新
   - インフラ: JSONパースエラー疑い → python で json.load() 検証し結果を記録
3. 修正した場合は checks/pending.md の該当行を [x] に変更し（対応日: 今日の日付, 内容）を追記
4. data/*.json を修正した場合は Python で JSON バリデーション必須
5. 変更がある場合は git commit（メッセージ例: fix: pending.mdの未対応項目を修正）

注意事項:
- NNTが定義されていないドメイン（steroid, antibiotics, antifungals, antivirals, endocrine）では NNT=null は意図的 → 修正不要
- brand欄は単一ブランド（先発品1つ）が原則
- evidence_urlは全件null（意図的） → 修正不要
- JSONを修正する際は必ず python -c "import json; json.load(open(...))" でバリデーション
'@

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== $ts 開始 ===" | Out-File -FilePath $logFile -Encoding utf8 -Append

& $claudeExe -p $prompt --dangerously-skip-permissions 2>&1 |
    Out-File -FilePath $logFile -Encoding utf8 -Append

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== $ts 終了 ===" | Out-File -FilePath $logFile -Append -Encoding utf8
