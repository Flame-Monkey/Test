"use client";

import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { unit as Cat } from "@/types/cat";

interface Props {
  cats: Cat[];
  onSelect: (cat: Cat) => void;

  getRarityColor: (rarity: string) => string;
  getTargetColor: (target: string | undefined) => string;
  getEffectColor: (effect: string | undefined) => string;
}

export default function CatsTable({
  cats,
  onSelect,
  getRarityColor,
  getTargetColor,
  getEffectColor,
}: Props) {
  /* -----------------------------------------------
      영어 ability / affect / target → 한글 변환 테이블
     ----------------------------------------------- */

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
    BaseDestroyer: "성파괴 특기",
    Critical: "크리티컬",
    MetalKiller: "메탈킬러",
    ZombieKiller: "좀비킬러",
    SoulStrike: "영혼 공격",
    BarrierBreak: "베리어브레이커",
    ShieldBreak: "실드브레이커",
    StrickAttack: "혼신의 일격",
    Bounty: "격파 시 돈 Up",
    Metallic: "메탈",
    MiniWave: "소파동",
    Wave: "파동",
    MiniVolcano: "소열파",
    Volcano: "열파",
    VolcanoCounter: "열파 카운터",
    Blast: "폭파",
    WaveBlocker: "파동 스토퍼",
    Summon: "소환",
    ColosusSlayer: "초생명체 특효",
    BehemothSlayer: "초수 특효",
    SageHunter: "초현자 특효",
    ImuWeak: "공격력 다운 무효",
    ImuKB: "넉백 무효",
    ImuStop: "멈춤 무효",
    ImuSlow: "느리게 무효",
    ImuWarp: "워프 무효",
    ImuCurse: "저주 무효",
    ImuPoison: "독 무효",
    ImuWave: "파동 무효",
    ImuVolcano: "열파 무효",
    ImuBlast: "폭파 무효",
    WeakResist: "공다 저항",
    StopResist: "멈춤 저항",
    SlowResist: "느리게 저항",
    KBResist: "넉백 저항",
    WaveResist: "파동 저항",
    VolcanoResist: "열파 저항",
    WarpResist: "워프 저항",
    CurseResist: "저주 저항",
    PoisonResist: "독 저항",
  };

  // 안전하게 한글 변환
  const toKo = (map: Record<string, string>, key: string) =>
    map[key] ?? key;

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed text-left">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-40">이름</TableHead>
              <TableHead className="w-32">등급</TableHead>
              <TableHead className="w-48">타겟</TableHead>
              <TableHead className="w-48">효과</TableHead>
              <TableHead className="w-60">능력</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cats.map((cat) => (
              <TableRow
                key={`${cat.Id}-${cat.Form}`}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelect(cat)}
              >
                <TableCell>{cat.Id}</TableCell>

                <TableCell>
                  <div className="font-semibold">{cat.Name}</div>
                </TableCell>

                <TableCell>
                  <Badge className={getRarityColor(cat.Rarity)}>
                    {cat.Rarity}
                  </Badge>
                </TableCell>

                {/* --- TARGETS (한글 라벨) --- */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cat.Targets.map((t, i) => (
                      <Badge key={i} className={getTargetColor(t)}>
                        {toKo(targetKo, t)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                {/* --- AFFECTS (한글 라벨) --- */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cat.Affects.map((e, i) => (
                      <Badge key={i} className={getEffectColor(e)}>
                        {toKo(affectKo, e)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                {/* --- ABILITIES (한글 라벨) --- */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cat.Abilities.map((ab, i) => (
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
