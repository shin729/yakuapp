"""
validate_json.py — yakuapp JSON バリデーションスクリプト
使用方法:
  python scripts/validate_json.py              # 全 data/*.json を検証
  python scripts/validate_json.py data/gi.json # 特定ファイルのみ
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA_DIR = ROOT / "data"

REQUIRED_FIELDS = ["name", "brand", "category", "class"]

PMID_PATTERN = re.compile(r"PMID:\s*\d+")
EVIDENCE_EXEMPT = re.compile(
    r"国内|社内|データなし|不明|報告なし|n/a|添付文書|インタビューフォーム|ガイドライン|承認審査資料",
    re.IGNORECASE,
)
STAR_RANGE = set(range(1, 6))  # 1-5


def check_drug(drug: dict, idx: int) -> list[tuple[str, str]]:
    issues = []
    name = drug.get("name") or "（名前不明）"

    # ① 必須フィールド欠損 / null
    for f in REQUIRED_FIELDS:
        if f not in drug:
            issues.append(("ERROR", f"#{idx} {name} — 必須フィールド '{f}' が存在しない"))
        elif drug[f] is None:
            issues.append(("ERROR", f"#{idx} {name} — 必須フィールド '{f}' が null"))

    # ② 空文字列チェック（name/brand/category/class）
    for f in REQUIRED_FIELDS:
        if isinstance(drug.get(f), str) and drug[f].strip() == "":
            issues.append(("WARNING", f"#{idx} {name} — '{f}' が空文字列"))

    # ③ evidence 形式チェック
    ev = drug.get("evidence")
    if ev is not None:
        if isinstance(ev, str) and ev.strip() == "":
            issues.append(("WARNING", f"#{idx} {name} — evidence が空文字列"))
        elif isinstance(ev, str):
            if not PMID_PATTERN.search(ev) and not EVIDENCE_EXEMPT.search(ev):
                issues.append(
                    ("WARNING", f"#{idx} {name} — evidence に PMID なし: {ev[:70]}")
                )

    # ④ evidence_url が null 以外で http 始まりでない場合
    ev_url = drug.get("evidence_url")
    if ev_url is not None and isinstance(ev_url, str) and ev_url.strip():
        if not ev_url.startswith("http"):
            issues.append(
                ("WARNING", f"#{idx} {name} — evidence_url が不正なURL: {ev_url[:60]}")
            )

    # ⑤ efficacy_star の型・範囲チェック
    star = drug.get("efficacy_star")
    if star is not None:
        if not isinstance(star, int) or star not in STAR_RANGE:
            issues.append(
                ("WARNING", f"#{idx} {name} — efficacy_star 範囲外または非整数: {star!r}")
            )

    # ⑥ NNT の型チェック
    nnt = drug.get("NNT")
    if nnt is not None and not isinstance(nnt, (int, float)):
        issues.append(("WARNING", f"#{idx} {name} — NNT が数値でない: {nnt!r}"))

    return issues


def validate_file(path: Path) -> tuple[int, list[tuple[str, str]]]:
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return 0, [("ERROR", f"JSON パースエラー: {e}")]

    if not isinstance(data, list):
        return 0, [("ERROR", "ルートが配列でない")]

    all_issues: list[tuple[str, str]] = []
    for idx, drug in enumerate(data, start=1):
        if not isinstance(drug, dict):
            all_issues.append(("WARNING", f"#{idx} — 配列要素がオブジェクトでない"))
            continue
        all_issues.extend(check_drug(drug, idx))

    return len(data), all_issues


def main():
    if len(sys.argv) >= 2:
        targets = [Path(p) for p in sys.argv[1:]]
    else:
        targets = sorted(DATA_DIR.glob("*.json"))

    total_files = 0
    total_drugs = 0
    total_errors = 0
    total_warnings = 0

    for path in targets:
        if not path.exists():
            print(f"[{path.name}] ファイルが見つかりません: {path}")
            continue

        count, issues = validate_file(path)
        total_files += 1
        total_drugs += count

        errors = [i for i in issues if i[0] == "ERROR"]
        warnings = [i for i in issues if i[0] == "WARNING"]
        total_errors += len(errors)
        total_warnings += len(warnings)

        label = f"[{path.name}]"
        if not issues:
            print(f"{label} {count}件 — OK")
        else:
            flag = "ERROR" if errors else "WARNING"
            print(f"{label} {count}件 [{flag}]")
            for level, msg in issues:
                prefix = "  ERROR  " if level == "ERROR" else "  warning"
                print(f"{prefix}: {msg}")

    print()
    print("=" * 55)
    print(f"  チェック: {total_files}ファイル / {total_drugs}件")
    print(f"  ERROR  : {total_errors}件")
    print(f"  WARNING: {total_warnings}件")
    print("=" * 55)

    sys.exit(1 if total_errors > 0 else 0)


if __name__ == "__main__":
    main()
