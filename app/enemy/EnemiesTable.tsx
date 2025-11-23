"use client";

import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { unit } from "@/types/cat";

/* ---------------------- 한글 변환 맵 ---------------------- */

const targetKo: Record<string, string> = {
  Red: "빨간적",
  Floating: "떠있는적",
  Black: "검은적",
  Metal: "메탈적",
  White: "무속성",
  Angel: "천사",
  Alien: "에이리언",
  Zombie: "좀비",
  Relic: "고대종",
  Demon: "악마",
};

const affectKo: Record<string, string> = {
  Slow: "느리게 한다",
  Stop: "멈춘다",
  Knockback: "날려버린다",
  Weak: "공격력 다운",
  MassiveDamage: "초 데미지",
  InsaneDamage: "극 데미지",
  Good: "엄청 강하다",
  Resistant: "맷집이 좋다",
  InsanelyTough: "초 맷집이 좋다",
  Curse: "저주",
  Only: "타겟 한정",
  Warp: "워프",
  ImuATK: "공격 무효",
};

const abilityKo: Record<string, string> = {
  AtkUp: "공격력 업",
  LETHAL: "살아남는다",
  BaseDestroyer: "성 파괴 특기",
  Critical: "크리티컬",
  MetalKiller: "메탈 킬러",
  ZombieKiller: "좀비 킬러",
  SoulStrike: "영혼 공격",
  BarrierBreak: "베리어 브레이커",
  ShieldBreak: "실드 브레이커",
  StrickAttack: "혼신의 일격",
  Bounty: "격파시 머니 업",
  Metallic: "메탈",
  MiniWave: "소파동",
  Wave: "파동 공격",
  MiniVolcano: "소열파",
  Volcano: "열파",
  VolcanoCounter: "열파 카운터",
  Blast: "폭파 공격",
  WaveBlocker: "파동 스토퍼",
  Summon: "소환",
  ColosusSlayer: "초생명체 특효",
  BehemothSlayer: "초수 특효",
  SageHunter: "초현자 특효",

  ImuWeak: "공격력 다운 무효",
  ImuKB: "날려버림 무효",
  ImuStop: "멈춤 무효",
  ImuSlow: "느리게 무효",
  ImuWarp: "워프 무효",
  ImuCurse: "저주 무효",
  ImuPoison: "독 데미지 무효",
  ImuWave: "파동 무효",
  ImuVolcano: "열파 무효",
  ImuBlast: "폭파 무효",
};

/* ---------------------- 변환 함수 ---------------------- */

function toKo(map: Record<string, string>, key: string) {
  return map[key] ?? key;
}

/* ---------------------- 색상 유틸 ---------------------- */

function getTargetColor(t: string) {
  return {
    Red: "bg-red-500 text-white",
    Floating: "bg-sky-400 text-white",
    Black: "bg-black text-white",
    Metal: "bg-slate-600 text-white",
    Angel: "bg-yellow-400 text-black",
    Alien: "bg-blue-500 text-white",
    Zombie: "bg-purple-600 text-white",
    Relic: "bg-emerald-700 text-white",
    Demon: "bg-red-800 text-white",
    White: "bg-stone-400 text-black",
  }[t] || "bg-gray-200 text-gray-700";
}

function getEffectColor(e: string) {
  return {
    Slow: "bg-blue-500 text-white",
    Stop: "bg-purple-600 text-white",
    Knockback: "bg-orange-500 text-white",
    Weak: "bg-amber-500 text-white",
    MassiveDamage: "bg-red-600 text-white",
    InsaneDamage: "bg-red-700 text-white",
    Good: "bg-green-500 text-white",
    Resistant: "bg-green-700 text-white",
    InsanelyTough: "bg-green-900 text-white",
    Curse: "bg-indigo-600 text-white",
    Warp: "bg-cyan-500 text-white",
    Only: "bg-gray-400 text-white",
    ImuATK: "bg-gray-700 text-white",
  }[e] || "bg-gray-200 text-gray-700";
}

/* ---------------------- 테이블 본문 ---------------------- */

export default function EnemiesTable({
  enemies,
  onSelect,
}: {
  enemies: unit[];
  onSelect: (enemy: unit) => void;
}) {
  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed text-left">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-40">이름</TableHead>
              <TableHead className="w-40">속성</TableHead>
              <TableHead className="w-40">효과</TableHead>
              <TableHead className="w-60">능력</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {enemies.map((enemy) => (
              <TableRow
                key={`${enemy.Id}-${enemy.Form}`}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelect(enemy)}
              >
                <TableCell>{enemy.Id}</TableCell>

                <TableCell>
                  <div className="font-semibold">{enemy.Name}</div>
                </TableCell>

                {/* TARGETS */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {enemy.Targets.map((t, i) => (
                      <Badge key={i} className={getTargetColor(t)}>
                        {toKo(targetKo, t)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                {/* AFFECTS */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {enemy.Affects.map((e, i) => (
                      <Badge key={i} className={getEffectColor(e)}>
                        {toKo(affectKo, e)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                {/* ABILITIES */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {enemy.Abilities.map((ab, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {toKo(abilityKo, ab)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
