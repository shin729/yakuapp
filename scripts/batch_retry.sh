#!/bin/bash
# 失敗9件の再試行バッチ
cd "$(dirname "$0")/.."
LOG="logs/batch_retry_$(date +%Y%m%d_%H%M%S).log"

run() {
  local name="$1" json="$2" en="$3"
  echo "===== $name =====" | tee -a "$LOG"
  PYTHONUTF8=1 python scripts/extract_pdf.py "$name" "$json" "$en" 2>&1 | tee -a "$LOG"
  echo "" >> "$LOG"
  sleep 3
}

echo "再試行開始: $(date)" | tee "$LOG"

run ボルノレキサント  data/sleep_anxiety.json  vornorelexant
run ベムペド酸        data/lifestyle.json       bempedoic_acid
run リトレシチニブ    data/derma.json           ritlecitinib
run パチロマー        data/renal.json           patiromer
run ボクロスポリン    data/immune.json          voclosporin
run エステトロール    data/gyneco.json          estetrol
run リンザゴリクス    data/gyneco.json          linzagolix
run テコビリマット    data/antivirals.json      tecovirimat
run レナカパビル      data/antivirals.json      lenacapavir

echo "再試行完了: $(date)" | tee -a "$LOG"
