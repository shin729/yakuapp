"""sleep_anxiety.json 抗不安薬・気分安定薬グループの妊娠・授乳情報を強化
LactMed/PubMed/ACOG等の最新エビデンスに基づきcaution追記・pregnancy/lactation記号を更新"""
import json

PATH = "data/sleep_anxiety.json"

TANDOSPIRONE = "【妊娠・授乳】ヒトでの妊娠・授乳中の安全性データに乏しい（系統的な症例報告なし）。同系統アザピロン系のブスピロンもデータが限られており、必要時はエビデンスの豊富なSSRI等への変更を優先検討。"
ALPRAZOLAM = "【妊娠・授乳】BZD系の口唇裂リスクは現代のメタ解析で否定的。授乳はLactMedで「使用可能」と評価されるが、新生児・早産児への反復使用では鎮静等の報告がありロラゼパム等の短時間作用型が望ましい。単回使用後は授乳再開に待機不要。"
ETIZOLAM = "【妊娠・授乳】チエノジアゼピン系（BZD類似構造）。ヒトでの系統的な妊娠・授乳データに乏しい。授乳婦の症例報告は限定的（他剤併用例で乳児への重大な影響報告なし）。データ不足のためエビデンスの豊富なBZD系への変更を優先検討。"
LITHIUM = "【妊娠・授乳】妊娠初期はEbstein奇形リスク増加のため添付文書上禁忌（絶対リスクは低いが胎児心エコーでのスクリーニング推奨）。授乳は近年「厳重な乳児モニタリング下では安全に行いうる」との報告が増加（乳児血中リチウム濃度・甲状腺機能・腎機能の定期測定が前提、PMID:35673836）。"
VALPROATE = "【妊娠・授乳】神経管閉鎖障害（1〜5%）・顔面奇形・心血管奇形・認知機能障害との関連が確立しており妊婦には禁忌（妊娠可能な女性への投与は必要最小限に）。授乳は母乳中移行が少なく、AAP・WHOは授乳中も安全な薬剤の一つに位置づけ（41母児ペアの研究で重大な影響は血小板減少・貧血の1例のみ）。"
CARBAMAZEPINE = "【妊娠・授乳】顔貌異常・指爪低形成・神経管閉鎖障害（0.5〜1%）との関連が報告され妊婦は原則禁忌（葉酸補充を考慮）。授乳は母乳中移行が比較的少なく「子宮内より授乳中の方が安全性が高い」とされるが、傾眠・哺乳不良の観察は必要。"
LAMOTRIGINE = "【妊娠・授乳】抗てんかん薬の中では催奇形性リスクが低く、大規模研究で重大な先天異常との関連は認められず双極性障害の妊娠中維持療法の選択肢の一つ。授乳では乳児血中濃度が母体の35〜50%に達するため無呼吸・発疹・傾眠・哺乳不良に注意（発疹出現時は授乳中断しSJS等の重篤な皮疹を除外。これまで重篤な皮疹の報告例なし）。"

# index(0始まり): (新pregnancy, 新lactation, 追記テキスト)
UPDATES = {
    13: ("×", "×", TANDOSPIRONE),       # タンドスピロン
    15: ("△", "△", ALPRAZOLAM),         # アルプラゾラム
    17: ("×", "×", ETIZOLAM),           # エチゾラム
    48: ("×", "△", LITHIUM),            # リチウム
    49: ("×", "△", VALPROATE),          # バルプロ酸
    50: ("×", "△", CARBAMAZEPINE),      # カルバマゼピン
    51: ("△", "△", LAMOTRIGINE),        # ラモトリギン
    63: ("×", "△", LITHIUM),            # 炭酸リチウム
    64: ("×", "△", VALPROATE),          # バルプロ酸ナトリウム
    65: ("×", "△", CARBAMAZEPINE),      # カルバマゼピン
    69: ("△", "△", LAMOTRIGINE),        # ラモトリギン
    70: ("×", "△", LITHIUM),            # 炭酸リチウム（うつ相）
    71: ("×", "△", VALPROATE),          # バルプロ酸ナトリウム（うつ相）
}

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

for idx, (preg, lact, note) in UPDATES.items():
    d = data[idx]
    d["caution"] = d["caution"].rstrip("。") + "。 ／ " + note
    d["pregnancy"] = preg
    d["lactation"] = lact
    print(f"#{idx+1} {d['name']}: pregnancy={preg} lactation={lact}")

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("done")
