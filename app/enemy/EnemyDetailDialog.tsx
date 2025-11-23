"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { unit } from "@/types/cat";
import Link from "next/link";

/* ---------- 한글 변환 ---------- */
const targetKo: Record<string, string> = {
  Red: "빨간적",
  Floating: "떠있는적",
  Black: "검은적",
  Metal: "메탈적",
  Angel: "천사",
  Alien: "에이리언",
  Zombie: "좀비",
  Relic: "고대종",
  Demon: "악마",
  White: "무속성",
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

const toKo = (map: Record<string, string>, key: string) => map[key] ?? key;

/* ---------- 스타일 통일 EnemyDialog ---------- */
export default function EnemyDetailDialog({
  isOpen,
  onOpenChange,
  enemy,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  enemy: unit | null;
}) {
  if (!enemy) return null;
  const paddedId = enemy.Id.toString().padStart(3, "0");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Link href={`/enemy/${paddedId}`}>
              <DialogTitle className="text-blue-600 cursor-pointer hover:underline">
                {enemy.Name}
              </DialogTitle>
            </Link>
          </div>
        </DialogHeader>

        {/* ---------------------------------------------- */}
        {/* MAIN CONTENT (CatDetailDialog 스타일과 동일) */}
        {/* ---------------------------------------------- */}

        <div className="space-y-6 mt-4">

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">ID</p>
              <p>{enemy.Id}</p>
            </div>

            <div>
              <p className="text-gray-600 mb-1">진화/폼</p>
              <p>{enemy.Form}</p>
            </div>
          </div>

          {/* Targets */}
          <div>
            <p className="text-gray-600 mb-2">속성</p>
            <div className="flex flex-wrap gap-2">
              {enemy.Targets.map((t, i) => (
                <Badge key={i}>{toKo(targetKo, t)}</Badge>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <p className="text-gray-600 mb-2">효과</p>
            <div className="flex flex-wrap gap-2">
              {enemy.Affects.map((e, i) => (
                <Badge key={i}>{toKo(affectKo, e)}</Badge>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="border-t pt-4">
            <h4 className="mb-3">특수 능력</h4>
            <div className="flex flex-wrap gap-2">
              {enemy.Abilities.map((ab, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {toKo(abilityKo, ab)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t pt-4">
            <h4 className="mb-4">스탯</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">HP</p>
                <p className="text-red-600">{enemy.Hp}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격력</p>
                <p className="text-orange-600">{enemy.Atk}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">사거리</p>
                <p className="text-blue-600">{enemy.Range}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">속도</p>
                <p className="text-green-600">{enemy.Speed}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">넉백</p>
                <p className="text-purple-600">{enemy.Heatback}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격 간격</p>
                <p>{enemy.Tba}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">재생산</p>
                <p>{enemy.RespawnHalf}</p>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
