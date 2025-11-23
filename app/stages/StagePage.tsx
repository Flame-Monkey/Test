"use client";

import { useState } from "react";

import type { Stage } from "@/lib/stageLoader";
import type { unit as Enemy } from "@/types/cat";
import StageFilters from "./StageFilters";
import StageTable from "./StageTable";
import StageDetailDialog from "./StageDetailDialog";
import EnemyDetailDialog from "../enemy/EnemyDetailDialog";

interface StagePageProps {
  stages: Stage[];
  enemies: Enemy[];
}

export default function StagePage({ stages, enemies }: StagePageProps) {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isEnemyDialog, setIsEnemyDialog] = useState(false);
  const [enemyMultiplier, setEnemyMultiplier] = useState(100);

  return (
    <div className="space-y-6">
      <StageFilters />

      <StageTable
        stages={stages}
        enemies={enemies}
        onSelectStage={setSelectedStage}
      />

      <StageDetailDialog
        stage={selectedStage}
        enemies={enemies}
        onSelectEnemy={(enemy: Enemy, mult: number) => {
          setSelectedEnemy(enemy);
          setEnemyMultiplier(mult);
          setIsEnemyDialog(true);
        }}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedStage(null);
            setIsEnemyDialog(false);
          }
        }}
      />

      <EnemyDetailDialog
        isOpen={isEnemyDialog}
        onOpenChange={setIsEnemyDialog}
        enemy={selectedEnemy}
        multiplier={enemyMultiplier}
      />
    </div>
  );
}
