"use client";

import { useState } from "react";
import type { unit as Enemy } from "@/types/cat";

import EnemyFiltersPanel from "./FiltersPanelEnemy";
import EnemiesTable from "./EnemiesTable";
import EnemyDetailDialog from "./EnemyDetailDialog";

export default function EnemyCatsPage({ enemies }: { enemies: Enemy[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(["all"]);
  const [attributeFilterMode, setAttributeFilterMode] = useState<"OR" | "AND">("OR");

  const [selectedEffects, setSelectedEffects] = useState<string[]>(["all"]);
  const [effectFilterMode, setEffectFilterMode] = useState<"OR" | "AND">("OR");

  const [selectedAbilities, setSelectedAbilities] = useState<string[]>(["all"]);
  const [abilityFilterMode, setAbilityFilterMode] = useState<"OR" | "AND">("OR");

  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMagnification, setCurrentMagnification] = useState(100);


  /* ------------------ 필터 옵션 ------------------ */

  const attributes = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: '빨간적', label: '빨간적', color: 'red' },
    { value: '떠있는적', label: '떠있는적', color: 'green' },
    { value: '검은적', label: '검은적', color: 'black' },
    { value: '메탈적', label: '메탈적', color: 'slate' },
    { value: '천사', label: '천사', color: 'yellow' },
    { value: '에이리언', label: '에이리언', color: 'sky' },
    { value: '좀비', label: '좀비', color: 'purple' },
    { value: '고대종', label: '고대종', color: 'emerald' },
    { value: '악마', label: '악마', color: 'blue-900' },
    { value: '무속성', label: '무속성', color: 'stone' }
  ];

  const effects = [
    { group: "1", value: 'all', label: '전체' },
    { group: "1", value: '없음', label: '없음' },
    { group: "1", value: '움직임을느리게한다', label: '움직임을 느리게 한다' },
    { group: "1", value: '움직임을멈춘다', label: '움직임을 멈춘다' },
    { group: "1", value: '날려버린다', label: '날려버린다' },
    { group: "1", value: '공격력다운', label: '공격력다운' },

    { group: "2", value: '초데미지', label: '초 데미지' },
    { group: "2", value: '극데미지', label: '극 데미지' },
    { group: "2", value: '엄청강하다', label: '엄청 강하다' },
    { group: "2", value: '맷집이좋다', label: '맷집이 좋다' },
    { group: "2", value: '초맷집이좋다', label: '초 맷집이 좋다' },
    { group: "2", value: '저주', label: '저주' },
    { group: "2", value: '공격무효', label: '공격 무효' },
    { group: "2", value: '공격타겟한정', label: '공격 타겟 한정' },
    { group: "2", value: '워프', label: '워프' },
  ];

  const abilities = [
    { group: "1", value: '전체', label: '전체' },
    { group: "1", value: '없음', label: '없음' },
    { group: "1", value: '공격력 업', label: '공격력 업' },
    { group: "1", value: '살아남는다', label: '살아남는다' },
    { group: "1", value: '성 파괴가 특기', label: '성 파괴가 특기' },
    { group: "1", value: '크리티컬', label: '크리티컬' },
    { group: "1", value: '메탈 킬러', label: '메탈 킬러' },
    { group: "1", value: '좀비 킬러', label: '좀비 킬러' },
    { group: "1", value: '영혼 공격', label: '영혼 공격' },
    { group: "1", value: '베리어 브레이커', label: '베리어 브레이커' },
    { group: "1", value: '쉴드 브레이커', label: '쉴드 브레이커' },
    { group: "1", value: '혼신의 일격', label: '혼신의 일격' },

    { group: "2", value: '격파시 머니 up', label: '격파시 머니 up' },
    { group: "2", value: '메탈', label: '메탈' },
    { group: "2", value: '소파동', label: '소파동' },
    { group: "2", value: '파동 공격', label: '파동 공격' },
    { group: "2", value: '소열파', label: '소열파' },
    { group: "2", value: '열파 공격', label: '열파 공격' },
    { group: "2", value: '열파 카운터', label: '열파 카운터' },
    { group: "2", value: '폭파 공격', label: '폭파 공격' },
    { group: "2", value: '파동스토퍼', label: '파동스토퍼' },
    { group: "2", value: '소환', label: '소환' },

    { group: "3", value: '개체공격', label: '개체공격' },
    { group: "3", value: '범위곻격', label: '범위곻격' },
    { group: "3", value: '원거리공격', label: '원거리공격' },
    { group: "3", value: '전방위공격', label: '전방위공격' },

    { group: "4", value: '초생명체 특효', label: '초생명체 특효' },
    { group: "4", value: '초수 특효', label: '초수 특효' },
    { group: "4", value: '초현자 특효', label: '초현자 특효' },

    { group: "5", value: '공격력 다운 무효', label: '공격력 다운 무효' },
    { group: "5", value: '날려버린다 무효', label: '날려버린다 무효' },
    { group: "5", value: '움직임을 멈춘다 무효', label: '움직임을 멈춘다 무효' },
    { group: "5", value: '움직임을 느리게 한다 무효', label: '움직임을 느리게 한다 무효' },
    { group: "5", value: '워프 무효', label: '워프 무효' },
    { group: "5", value: '고대의 저주 무효', label: '고대의 저주 무효' },
    { group: "5", value: '독 데미지 무효', label: '독 데미지 무효' },
    { group: "5", value: '파동 데미지 무효', label: '파동 데미지 무효' },
    { group: "5", value: '열파 데미지 무효', label: '열파 데미지 무효' },
    { group: "5", value: '폭파 데미지 무효', label: '폭파 데미지 무효' },

    { group: "6", value: '공격력 다운 저항', label: '공격력 다운 저항' },
    { group: "6", value: '움직임을 멈춘다 저항', label: '움직임을 멈춘다 저항' },
    { group: "6", value: '움직임을 느리게 한다 저항', label: '움직임을 느리게 한다 저항' },
    { group: "6", value: '날려버린다 저항', label: '날려버린다 저항' },
    { group: "6", value: '파동 데미지 저항', label: '파동 데미지 저항' },
    { group: "6", value: '열파 데미지 저항', label: '열파 데미지 저항' },
    { group: "6", value: '워프 저항', label: '워프 저항' },
    { group: "6", value: '고대의 저주 저항', label: '고대의 저주 저항' },
    { group: "6", value: '독 데미지 저항', label: '독 데미지 저항' },

    { group: "7", value: '기본 체력 업', label: '기본 체력 업' },
    { group: "7", value: '기본 공격력 업', label: '기본 공격력 업' },
    { group: "7", value: '이동 속도 업', label: '이동 속도 업' },
    { group: "7", value: '넉백 횟수 증가', label: '넉백 횟수 증가' },
    { group: "7", value: '생산 코스트 할인', label: '생산 코스트 할인' },
    { group: "7", value: '생산 스피드 업', label: '생산 스피드 업' },
    { group: "7", value: '공격 간격 단축', label: '공격 간격 단축' },
  ];

  /* ------------------ 토글 유틸 ------------------ */

  const toggleMulti = (value: string, setter: any) => {
    setter((prev: string[]) => {
      if (value === "all") return ["all"];

      const withoutAll = prev.filter((v) => v !== "all");

      if (withoutAll.includes(value)) {
        const next = withoutAll.filter((v) => v !== value);
        return next.length === 0 ? ["all"] : next;
      }

      return [...withoutAll, value];
    });
  };

  /* ------------------ 필터링 ------------------ */
  const filteredEnemies = enemies.filter((enemy) => {
    const matchesSearch =
      enemy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enemy.Descriptiont.includes(searchTerm);

    const matchesAttribute =
      selectedAttributes.includes("all") ||
      (attributeFilterMode === "OR"
        ? selectedAttributes.some((v) => enemy.Targets.includes(v as any))
        : selectedAttributes.every((v) => enemy.Targets.includes(v as any)));

    const matchesEffect =
      selectedEffects.includes("all") ||
      (effectFilterMode === "OR"
        ? selectedEffects.some((v) => enemy.Affects.includes(v as any))
        : selectedEffects.every((v) => enemy.Affects.includes(v as any)));

    const matchesAbility =
      selectedAbilities.includes("all") ||
      (abilityFilterMode === "OR"
        ? selectedAbilities.some((v) => enemy.Abilities.includes(v as any))
        : selectedAbilities.every((v) => enemy.Abilities.includes(v as any)));


    return matchesSearch && matchesAttribute && matchesEffect && matchesAbility;
  });

  /* ------------------ 색상 유틸 ------------------ */

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { selected: string; hover: string }> = {
      gray: { selected: "bg-gray-500 text-white border-gray-500", hover: "hover:bg-gray-100 hover:border-gray-400" },
      red: { selected: "bg-red-500 text-white border-red-500", hover: "hover:bg-red-100 hover:border-red-400" },
      sky: { selected: "bg-sky-500 text-white border-sky-500", hover: "hover:bg-sky-100 hover:border-sky-400" },
      slate: { selected: "bg-slate-500 text-white border-slate-500", hover: "hover:bg-slate-100 hover:border-slate-400" },
      yellow: { selected: "bg-yellow-500 text-white border-yellow-500", hover: "hover:bg-yellow-100 hover:border-yellow-400" },
      purple: { selected: "bg-purple-500 text-white border-purple-500", hover: "hover:bg-purple-100 hover:border-purple-400" },
      emerald: { selected: "bg-emerald-600 text-white border-emerald-600", hover: "hover:bg-emerald-100 hover:border-emerald-400" },
      cyan: { selected: "bg-cyan-500 text-white border-cyan-500", hover: "hover:bg-cyan-100 hover:border-cyan-400" },
      stone: { selected: "bg-stone-500 text-white border-stone-500", hover: "hover:bg-stone-100 hover:border-stone-400" },
    };

    const c = colorMap[color] || colorMap.gray;
    return isSelected ? c.selected : `bg-white border-gray-300 ${c.hover}`;
  };

  const getAttributeColor = (attr: string) => ({
    빨강: "bg-red-500 text-white",
    떠있음: "bg-sky-500 text-white",
    메탈: "bg-slate-500 text-white",
    무속성: "bg-stone-400 text-black",
    천사: "bg-yellow-400 text-black",
    흑: "bg-purple-600 text-white",
    좀비: "bg-emerald-700 text-white",
    에일리언: "bg-cyan-500 text-white",
    없음: "bg-gray-200 text-gray-600",
  }[attr] || "bg-gray-200 text-gray-600");

  const getEffectColor = (effect: string) => ({
    느리게한다: "bg-blue-500 text-white",
    멈추게한다: "bg-purple-500 text-white",
    공격력다운: "bg-orange-500 text-white",
    없음: "bg-gray-200 text-gray-600",
  }[effect] || "bg-gray-200 text-gray-600");

  return (
    <div className="space-y-6">
      <EnemyFiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        attributes={attributes}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        attributeFilterMode={attributeFilterMode}
        setAttributeFilterMode={setAttributeFilterMode}
        effects={effects}
        selectedEffects={selectedEffects}
        setSelectedEffects={setSelectedEffects}
        effectFilterMode={effectFilterMode}
        setEffectFilterMode={setEffectFilterMode}
        abilities={abilities}
        selectedAbilities={selectedAbilities}
        setSelectedAbilities={setSelectedAbilities}
        abilityFilterMode={abilityFilterMode}
        setAbilityFilterMode={setAbilityFilterMode}
        getColorClasses={getColorClasses}
        toggleMulti={toggleMulti}
      />

      <EnemiesTable
        enemies={filteredEnemies}
        onSelect={(enemy) => {
          setSelectedEnemy(enemy);
          setIsDialogOpen(true);
        }}
      />

      <EnemyDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        enemy={selectedEnemy}               // ✔ 변경됨
      />
    </div>
  );
}
