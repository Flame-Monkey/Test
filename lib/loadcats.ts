import * as fs from "fs";
import * as path from "path";
import { unit, trait, attackType, affect, ability } from "@/types/cat";

// 경로 설정
const UNIT_DIR = "./data/unit";
const NAME_FILE = "./data/UnitName.txt";
const DESC_FILE = "./data/UnitExplanation.txt";

// ──────────────────────────────────────────────
// 유닛 설명 로드
// ──────────────────────────────────────────────
function loadDescriptions(): Map<number, string[]> {
    const txt = fs.readFileSync(DESC_FILE, "utf8").replace(/\r/g, "");
    const map = new Map<number, string[]>();

    const lines = txt
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    for (const line of lines) {
        const cols = line.split("\t");

        if (cols.length < 2) continue;

        const num = parseInt(cols[0]);
        const descList = cols.slice(1).map(s => s.trim());

        map.set(num, descList);
    }

    return map;
}

// ──────────────────────────────────────────────
// 유닛 이름 로드
// ──────────────────────────────────────────────
function loadUnitNames(): Map<number, string[]> {
    const txt = fs.readFileSync(NAME_FILE, "utf8").replace(/\r/g, "");
    const map = new Map<number, string[]>();

    const lines = txt.split("\n").filter(l => l.trim().length > 0);

    for (const line of lines) {
        const cols = line.split("\t");
        if (cols.length < 2) continue;

        const num = parseInt(cols[0]);
        const names = cols.slice(1).filter(n => n.length > 0);

        map.set(num, names);
    }

    return map;
}

// ──────────────────────────────────────────────
// trait / ability / affect / attackType (기존 그대로)
// ──────────────────────────────────────────────
const traitMap: Record<number, trait> = {
    10: "Red",
    16: "Floating",
    17: "Black",
    18: "Metal",
    19: "White",
    20: "Angel",
    21: "Alien",
    22: "Zombie",
    78: "Relic",
    96: "Demon",
};


export function getAffects(values: number[]): affect[] {
    const out: affect[] = [];
    const add = (cond: boolean, name: affect) => { if (cond) out.push(name); };

    add(values[27] > 0, "Slow");          // 느리게한다
    add(values[25] > 0, "Stop");          // 멈춘다
    add(values[24] > 0, "Knockback");     // 날려버린다
    add(values[37] > 0, "Weak");          // 공격력 다운
    add(values[30] > 0, "MassiveDamage"); // 초데미지
    add(values[81] > 0, "InsaneDamage");  // 극데미지
    add(values[23] > 0, "Good");          // 엄청 강하다
    add(values[29] > 0, "Resistant");     // 맷집이 좋다
    add(values[80] > 0, "InsanelyTough"); // 초맷집이 좋다
    add(values[92] > 0, "Curse");         // 저주
    add(values[32] > 0, "Only");          // 공격 타겟 한정
    add(values[75] > 0, "Warp");          // 워프
    add(values[84] > 0, "ImuATK");        // 공격무효

    return out;
}

export function getAbilities(values: number[]): ability[] {
    const out: ability[] = [];
    const add = (cond: boolean, name: ability) => { if (cond) out.push(name); };

    // 기본 능력
    add(values[40] > 0, "AtkUp");         // 공격력 업
    add(values[42] > 0, "LETHAL");        // 살아남는다
    add(values[34] > 0, "BaseDestroyer"); // 성 파괴
    add(values[31] > 0, "Critical");      // 크리티컬
    add(values[112] > 0, "MetalKiller");  // 메탈 킬러
    add(values[52] > 0, "ZombieKiller");  // 좀비 킬러
    add(values[98] > 0, "SoulStrike");    // 영혼 공격
    add(values[70] > 0, "BarrierBreak");  // 베리어 브레이커
    add(values[95] > 0, "ShieldBreak");   // 실드 브레이커
    add(values[82] > 0, "StrickAttack");  // 혼신의 일격
    add(values[33] > 0, "Bounty");        // 격파시 머니 UP
    add(values[43] > 0, "Metallic");      // 메탈 몸

    // 파동·열파·폭파 계열 (주의: 여러 플래그 연동)
    add(values[94] > 0, "MiniWave");      // 소파동
    add(values[35] > 0 && values[94] === 0, "Wave"); // 파동 (소파동 아닌 경우)
    add(values[108] > 0, "MiniVolcano");  // 소열파 (MiniVolcano 플래그)
    add(values[86] > 0 && values[108] === 0, "Volcano"); // 열파
    add(values[109] > 0, "VolcanoCounter"); // 열파 카운터
    add(values[113] > 0, "Blast");        // 폭파
    add(values[47] > 0, "WaveBlocker");   // 파동 스토퍼

    // 소환 계열
    add(values[110] > 0, "Summon");       // 소환

    // 초생명체 특효 계열
    add(values[97] > 0, "ColosusSlayer");
    add(values[105] > 0, "BehemothSlayer");
    add(values[111] > 0, "SageHunter");

    // 무효 계열
    add(values[51] > 0, "ImuWeak");
    add(values[48] > 0, "ImuKB");
    add(values[49] > 0, "ImuStop");
    add(values[50] > 0, "ImuSlow");
    add(values[75] > 0, "ImuWarp");     // 워프 무효는 워프와 같은 인덱스
    add(values[79] > 0, "ImuCurse");
    add(values[90] > 0, "ImuPoison");
    add(values[46] > 0, "ImuWave");
    add(values[91] > 0, "ImuVolcano");
    add(values[116] > 0, "ImuBlast");
    return out;
}

function getAttackTypes(values: number[]): attackType[] {
    const out: attackType[] = [];
    if (values[12] === 1) out.push("range");

    const ldr = values[45];
    if (ldr !== 0) out.push(ldr < 0 ? "omni" : "long");

    if (out.length === 0) out.push("single");

    return out;
}

// ──────────────────────────────────────────────
// CSV 하나 파싱
// ──────────────────────────────────────────────
function loadOneCSV(num: number, form: number, name: string, descMap: Map<number, string[]>): unit | null {
    const dir = path.join(UNIT_DIR, num.toString().padStart(3, "0"));
    const csvPath = path.join(dir, `unit${num.toString().padStart(3, "0")}.csv`);

    if (!fs.existsSync(csvPath)) return null;

    const lines = fs
        .readFileSync(csvPath, "utf8")
        .replace(/\r/g, "")
        .split("\n")
        .filter(l => l.trim().length > 0);

    if (form >= lines.length) return null;

    const line = lines[form];
    const pure = line.split("//")[0].trim();
    const values = pure.split(",").map(v => parseInt(v.trim()));

    while (values.length < 120) values.push(0);

    const traits: trait[] = [];
    for (const idx in traitMap) {
        const i = parseInt(idx);
        if (values[i] === 1) traits.push(traitMap[i]);
    }

    // ⬇⬇⬇ 설명 필드 할당
    const descList = descMap.get(num) ?? [];
    const description = descList[form] ?? "";

    return {
        Id: num,
        Name: name,
        Form: form,
        Descriptiont: description,   // ⭐추가⭐
        Image: null,
        Rarity: "unknown",

        Targets: traits,
        AttackType: getAttackTypes(values),
        Affects: getAffects(values),
        Abilities: getAbilities(values),

        Price: values[6],
        Hp: values[0],
        Atk: values[3],
        Speed: values[2],
        Heatback: values[1],
        Tba: values[4] * 2,
        PreAttackframe: values[13],
        RespawnHalf: values[7] * 2,
        Range: values[5],
        Width: values[9],
    };
}

// ──────────────────────────────────────────────
// 전체 유닛 로드
// ──────────────────────────────────────────────
export function loadAllCats(): unit[] {
    const nameMap = loadUnitNames();
    const descMap = loadDescriptions();

    const arr: unit[] = [];

    for (const [num, names] of nameMap.entries()) {
        for (let form = 0; form < names.length; form++) {
            const c = loadOneCSV(num, form, names[form], descMap);
            if (c) arr.push(c);
        }
    }

    return arr;
}
