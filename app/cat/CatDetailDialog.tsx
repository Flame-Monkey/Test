"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { unit as Cat } from "@/types/cat";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCat: Cat | null;
  currentLevel: number;
  setCurrentLevel: (v: number) => void;
  getRarityColor: (rarity: string) => string;
  getTargetColor: (target: string | undefined) => string;
  getEffectColor: (effect: string | undefined) => string;
}

export default function CatDetailDialog({
  isOpen,
  onOpenChange,
  selectedCat,
  currentLevel,
  setCurrentLevel,
  getRarityColor,
  getTargetColor,
  getEffectColor,
}: Props) {
  if (!selectedCat) return null;

  /* ------------------- 계산 ------------------- */
  const baseLevel = 1;
  const levelDiff = currentLevel - baseLevel;

  const calculatedHP = selectedCat.Hp; // CSV 기반: 레벨 보정 아직 없음
  const calculatedAttack = selectedCat.Atk;

  /* ------------------- 한글 변환 ------------------- */
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
    WeakResist: "공격력 다운 저항",
    StopResist: "멈춤 저항",
    SlowResist: "느리게 저항",
    KBResist: "넉백 저항",
    WaveResist: "파동 저항",
    VolcanoResist: "열파 저항",
    WarpResist: "워프 저항",
    CurseResist: "저주 저항",
    PoisonResist: "독 저항",
  };

  const toKo = (map: Record<string, string>, key: string) =>
    map[key] ?? key;
  const paddedId = selectedCat.Id.toString().padStart(3, "0");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">

            {/* Title */}
            <Link href={`/cat/${selectedCat.Id.toString().padStart(3, "0")}`}>
              <div>
                <DialogTitle className="text-blue-600 cursor-pointer hover:underline">
                  {selectedCat.Name}
                </DialogTitle>
              </div>
            </Link>

            {/* Level Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">레벨</span>

              <button
                onClick={() => setCurrentLevel(Math.max(1, currentLevel - 10))}
                className="w-10 h-8 rounded bg-white border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors text-xs"
              >
                -10
              </button>

              <button
                onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
                className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center"
              >
                -
              </button>

              <Input
                type="number"
                min={1}
                max={999}
                value={currentLevel}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) setCurrentLevel(Math.max(1, Math.min(999, v)));
                }}
                className="w-14 h-8 text-center"
              />

              <button
                onClick={() => setCurrentLevel(Math.min(999, currentLevel + 1))}
                className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center"
              >
                +
              </button>

              <button
                onClick={() => setCurrentLevel(Math.min(999, currentLevel + 10))}
                className="w-10 h-8 rounded bg-white border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors text-xs"
              >
                +10
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* ------------------------------------- */}
        {/* MAIN CONTENT */}
        {/* ------------------------------------- */}

        <div className="space-y-6 mt-4">

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">ID</p>
              <p>{selectedCat.Id}</p>
            </div>

            <div>
              <p className="text-gray-600 mb-1">등급</p>
              <Badge className={getRarityColor(selectedCat.Rarity)}>
                {selectedCat.Rarity}
              </Badge>
            </div>
          </div>

          {/* Targets */}
          <div>
            <p className="text-gray-600 mb-2">타겟 속성</p>
            <div className="flex flex-wrap gap-2">
              {selectedCat.Targets.map((t, i) => (
                <Badge key={i} className={getTargetColor(t)}>
                  {toKo(targetKo, t)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <p className="text-gray-600 mb-2">효과</p>
            <div className="flex flex-wrap gap-2">
              {selectedCat.Affects.map((e, i) => (
                <Badge key={i} className={getEffectColor(e)}>
                  {toKo(affectKo, e)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t pt-4">
            <h4 className="mb-4">스탯 정보 (레벨 {currentLevel})</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">HP</p>
                <p className="text-red-600">{calculatedHP}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격력</p>
                <p className="text-orange-600">{calculatedAttack}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">사거리</p>
                <p className="text-blue-600">{selectedCat.Range}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">속도</p>
                <p className="text-green-600">{selectedCat.Speed}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">코스트</p>
                <p className="text-yellow-600">{selectedCat.Price}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">재생산</p>
                <p className="text-purple-600">{selectedCat.RespawnHalf}</p>
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="border-t pt-4">
            <h4 className="mb-3">특수 능력</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCat.Abilities.map((ab, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {toKo(abilityKo, ab)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
