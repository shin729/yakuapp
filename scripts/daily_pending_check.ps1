# yakuapp pending.md 自動チェック&修正スクリプト
# Windows タスクスケジューラ（yakuapp_pending_check）から毎週月曜 9:00 に実行される
# ※2026-06-27にメンテナンス運用へ移行（毎日→毎週・実行可能な項目だけ対応／no-op記録はしない）
#   ファイル名は履歴上 daily_ のままだが実体は週次。頻度変更は Get-ScheduledTask/Set-ScheduledTask で。

$projectDir = "C:\Users\biets\OneDrive\Desktop\claude関連\yakuapp"
$logDir     = Join-Path $projectDir "logs"
$logFile    = Join-Path $logDir ("pending_check_" + (Get-Date -Format "yyyy-MM-dd") + ".log")
$claudeExe  = "C:\Users\biets\.local\bin\claude.exe"

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Set-Location $projectDir

$prompt = @'
yakuappはメンテナンス運用フェーズ（2026-06-27〜）。checks/pending.md の未対応項目（- [ ]）を確認し、
「実際に手を動かす価値がある項目だけ」を対応してください。no-op（確認したが問題なし）の項目は
記録を増やさず静かに片付けるのが方針です。

対応する価値が高い項目（優先）:
- 販売中止: 削除/注記が必要なら実施
- 網羅（新薬の抜け）: data/<domain>.json へ追加
- 誤記・明らかな不整合: 修正

低価値（増やさない）項目:
- 「意図的nullの再確認」「全件問題なし」等の no-op は、新たな確認ログを生成しない。
  既に [ ] で積まれているものは簡潔に [x] にするだけ（長い説明文を書かない）。
- 統一感の微修正は、明らかな実害がある時だけ。なければ触らない。

作業手順:
1. checks/pending.md の - [ ] 項目を列挙
2. 上記の優先項目のみ対応（データ修正 → [x] に更新し（対応日, 簡潔な内容）を追記）
3. 低価値項目は簡潔に [x] にするか、判断案件はそのまま残す（無理に消化しない）
4. data/*.json を修正したら必ず python で JSON バリデーション
   （PYTHONUTF8=1 python scripts/validate_json.py。ERROR0・WARNING25が基準）
5. 変更がある場合のみ git commit（例: fix: pending.md対応 / 何も無ければコミットしない）

注意事項:
- NNT未定義ドメイン（steroid, antibiotics, antifungals, antivirals, endocrine）の NNT=null は意図的
- brand欄は単一ブランド（先発品1つ）が原則 / evidence_url は全件null（意図的）
- 医療データのため、薬剤追加・販売中止判断は必ずWeb一次検証（撤回・捏造PMIDに注意）
- 生物学的製剤の妊娠harmonize（pending.md L430相当）は「要判断・保留」項目 → 触らない
'@

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== $ts 開始 ===" | Out-File -FilePath $logFile -Encoding utf8 -Append

& $claudeExe -p $prompt --dangerously-skip-permissions 2>&1 |
    Out-File -FilePath $logFile -Encoding utf8 -Append

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== $ts 終了 ===" | Out-File -FilePath $logFile -Append -Encoding utf8
