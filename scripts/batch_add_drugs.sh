#!/bin/bash
# 新薬一括追加バッチ（2023-2026年新有効成分内服薬）
# NotebookLM同時実行不可のため順次処理

cd "$(dirname "$0")/.."
LOG="logs/batch_add_$(date +%Y%m%d_%H%M%S).log"
ERR="logs/batch_errors.txt"

run() {
  local name="$1" json="$2" en="$3"
  echo "===== $name =====" | tee -a "$LOG"
  if PYTHONUTF8=1 python scripts/extract_pdf.py "$name" "$json" "$en" 2>&1 | tee -a "$LOG"; then
    echo "OK: $name" >> "$LOG"
  else
    echo "FAILED: $name" | tee -a "$ERR" "$LOG"
  fi
  echo "" >> "$LOG"
  sleep 3
}

echo "開始: $(date)" | tee "$LOG"

run ボルノレキサント  data/sleep_anxiety.json  vornorelexant
run リメゲパント      data/pain.json            rimegepant
run アトゲパント      data/pain.json            atogepant
run ベムペド酸        data/lifestyle.json       bempedoic_acid
run オザニモド        data/gi.json              ozanimod
run エトラシモド      data/gi.json              etrasimod
run リトレシチニブ    data/derma.json           ritlecitinib
run アコラミジス      data/hf.json              acoramidis
run パチロマー        data/renal.json           patiromer
run ボクロスポリン    data/immune.json          voclosporin
run エステトロール    data/gyneco.json          estetrol
run ドロスピレノン    data/gyneco.json          drospirenone
run リンザゴリクス    data/gyneco.json          linzagolix
run テコビリマット    data/antivirals.json      tecovirimat
run レナカパビル      data/antivirals.json      lenacapavir
run ヒスチジン亜鉛    data/nutrition.json       zinc_histidine
run ジピリダモール    data/blood.json           dipyridamole

echo "完了: $(date)" | tee -a "$LOG"
echo "ログ: $LOG"
