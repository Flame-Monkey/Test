import * as fs from "fs";
import * as path from "path";

import { unit as Enemy, trait, affect, ability, attackType } from "@/types/cat";

// ──────────────────────────────────────────────
// 파일 경로
// ──────────────────────────────────────────────
const ENEMY_CSV = "./data/t_unit.csv";
const ENEMY_NAME_FILE = "./data/EnemyName.txt";
const ENEMY_DESC_FILE = "./data/EnemyExplanation.txt";

// ──────────────────────────────────────────────
// 이름 로드
// EnemyName.txt
// 형식:   000    멍뭉이
//         001    낼름이
//         002    놈놈놈
// ...
// ──────────────────────────────────────────────
function loadEnemyNames(): Map<number, string> {
    const txt = fs.readFileSync(ENEMY_NAME_FILE, "utf8").replace(/\r/g, "");
    const map = new Map<number, string>();

    const lines = txt
        .split("\n")
        .map(x => x.trim())
        .filter(x => x.length > 0);

    for (const line of lines) {
        const cols = line.split("\t");
        if (cols.length < 2) continue;

        const id = parseInt(cols[0]);
        const name = cols[1].trim();

        map.set(id, name);
    }
    return map;
}

// ──────────────────────────────────────────────
// 설명 로드
// EnemyExplanation.txt
// 형식:   000   설명...
//         001   설명...
// ──────────────────────────────────────────────
function loadEnemyDescriptions(): Map<number, string> {
    const txt = fs.readFileSync(ENEMY_DESC_FILE, "utf8").replace(/\r/g, "");
    const map = new Map<number, string>();

    const lines = txt
        .split("\n")
        .map(x => x.trim());

    for (const line of lines) {
        if (!line.includes("\t")) continue;
        const [numStr, ...descParts] = line.split("\t");

        const id = parseInt(numStr);
        const desc = descParts.join("\t").trim();

        map.set(id, desc);
    }

    return map;
}

// ──────────────────────────────────────────────
// trait/affect/ability/attackType logic
// (unit과 동일하게 사용)
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

function getEnemyAffects(values: number[]): affect[] {
    const out: affect[] = [];
    const add = (cond: boolean, name: affect) => { if (cond) out.push(name); };

    add(values[27] > 0, "Slow");
    add(values[25] > 0, "Stop");
    add(values[24] > 0, "Knockback");
    add(values[37] > 0, "Weak");
    add(values[30] > 0, "MassiveDamage");
    add(values[81] > 0, "InsaneDamage");
    add(values[23] > 0, "Good");
    add(values[29] > 0, "Resistant");
    add(values[80] > 0, "InsanelyTough");
    add(values[92] > 0, "Curse");
    add(values[32] > 0, "Only");
    add(values[75] > 0, "Warp");
    add(values[84] > 0, "ImuATK");

    return out;
}

function getEnemyAbilities(values: number[]): ability[] {
    const out: ability[] = [];
    const add = (cond: boolean, name: ability) => { if (cond) out.push(name); };

    add(values[40] > 0, "AtkUp");
    add(values[42] > 0, "LETHAL");
    add(values[34] > 0, "BaseDestroyer");
    add(values[31] > 0, "Critical");
    add(values[112] > 0, "MetalKiller");
    add(values[52] > 0, "ZombieKiller");
    add(values[98] > 0, "SoulStrike");
    add(values[70] > 0, "BarrierBreak");
    add(values[95] > 0, "ShieldBreak");
    add(values[82] > 0, "StrickAttack");
    add(values[33] > 0, "Bounty");
    add(values[43] > 0, "Metallic");

    add(values[94] > 0, "MiniWave");
    add(values[35] > 0 && values[94] === 0, "Wave");
    add(values[108] > 0, "MiniVolcano");
    add(values[86] > 0 && values[108] === 0, "Volcano");
    add(values[109] > 0, "VolcanoCounter");
    add(values[113] > 0, "Blast");
    add(values[47] > 0, "WaveBlocker");

    add(values[110] > 0, "Summon");

    add(values[97] > 0, "ColosusSlayer");
    add(values[105] > 0, "BehemothSlayer");
    add(values[111] > 0, "SageHunter");

    // 무효
    add(values[51] > 0, "ImuWeak");
    add(values[48] > 0, "ImuKB");
    add(values[49] > 0, "ImuStop");
    add(values[50] > 0, "ImuSlow");
    add(values[75] > 0, "ImuWarp");
    add(values[79] > 0, "ImuCurse");
    add(values[90] > 0, "ImuPoison");
    add(values[46] > 0, "ImuWave");
    add(values[91] > 0, "ImuVolcano");
    add(values[116] > 0, "ImuBlast");

    return out;
}

function getEnemyAttackTypes(values: number[]): attackType[] {
    const out: attackType[] = [];
    if (values[12] === 1) out.push("range");

    const ldr = values[45];
    if (ldr !== 0) out.push(ldr < 0 ? "omni" : "long");

    if (out.length === 0) out.push("single");

    return out;
}

// ──────────────────────────────────────────────
// CSV 전체 로드
// Enemy는 t_unit.csv 한 파일에 줄로 모두 존재
// ──────────────────────────────────────────────
export function loadAllEnemies(): Enemy[] {
    const nameMap = loadEnemyNames();
    const descMap = loadEnemyDescriptions();

    const lines = fs
        .readFileSync(ENEMY_CSV, "utf8")
        .replace(/\r/g, "")
        .split("\n")
        .filter(l => l.trim().length > 0);

    const enemies: Enemy[] = [];

    for (let id = 0; id < lines.length; id++) {
        const line = lines[id];
        const pure = line.split("//")[0].trim();
        const values = pure.split(",").map(v => parseInt(v.trim()));

        while (values.length < 120) values.push(0);

        const name = nameMap.get(id) ?? `Enemy ${id}`;
        const description = descMap.get(id) ?? "";

        const traits: trait[] = [];
        for (const key in traitMap) {
            const idx = parseInt(key);
            if (values[idx] === 1) traits.push(traitMap[idx]);
        }

        enemies.push({
            Id: id,
            Name: name,
            Form: 0,
            Descriptiont: description,
            Image: null,
            Rarity: "unknown",

            Targets: traits,
            AttackType: getEnemyAttackTypes(values),
            Affects: getEnemyAffects(values),
            Abilities: getEnemyAbilities(values),

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
        });
    }

    return enemies;
}
