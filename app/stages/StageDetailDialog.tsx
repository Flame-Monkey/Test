"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import type { Stage } from "@/lib/stageLoader";
import type { unit as Enemy } from "@/types/cat";

export interface StageDetailDialogProps {
  stage: Stage | null;
  enemies: Enemy[];
  onSelectEnemy: (enemy: Enemy, mult: number) => void;
  onOpenChange: (open: boolean) => void;
}

export default function StageDetailDialog({
  stage,
  enemies,
  onSelectEnemy,
  onOpenChange,
}: StageDetailDialogProps) {
  if (!stage) return null;

  const isOpen = !!stage;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-600">
            {stage.Name ?? stage.Name}
          </DialogTitle>
        </DialogHeader>

        {/* 스테이지 기본 정보 */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <p className="text-gray-500">ID</p>
            <p>{stage.MapId}</p>
          </div>

          <div>
            <p className="text-gray-500">통솔력</p>
            <p>{stage.Energy}</p>
          </div>

          <div>
            <p className="text-gray-500">기지 HP</p>
            <p>{stage.BaseHp}</p>
          </div>

          <div>
            <p className="text-gray-500">길이</p>
            <p>{stage.Length}</p>
          </div>
        </div>

        {/* 적 리스트 */}
        <h3 className="text-green-600 mb-2">출몰 적</h3>

        <div className="space-y-2">
          {stage.Enemies.map((line, i) => {
            const en = enemies.find((e) => e.Id === line.EnemyId);
            if (!en) return null;

            const mult = line.Magnification ?? 100;

            return (
              <div
                key={i}
                className="cursor-pointer"
                onClick={() => onSelectEnemy(en, mult)}
              >
                <Card className="p-3 hover:bg-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{en.Name}</span>
                      <span className="text-gray-500 ml-2 text-sm">
                        (ID {en.Id})
                      </span>
                    </div>

                    <Badge variant="outline">{mult}%</Badge>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
