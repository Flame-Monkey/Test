export interface EnemySpawn {
  name: string;
  nameKo: string;
  triggerType: 'time' | 'baseHp';
  triggerValue: number; // seconds for time, percentage for baseHp
  starMultipliers?: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
  };
}

export interface Stage {
  id: number;
  name: string;
  nameKo: string;
  difficulty: string;
  enemies: EnemySpawn[];
  baseHp: number;
  deployLimit: number; // 통솔력
  energy?: number; // 스테이지 진입 통솔력
  time?: number; // 스테이지 제한 시간 (초)
  mapType: '세계편' | '미래편' | '우주편' | '마계편' | '레전드 스토리' | '신 레전드 스토리' | '레전드 스토리 0';
  mapStage?: '1장' | '2장' | '3장';
}

export interface MonthlyMission {
  month: string;
  missions: {
    id: number;
    description: string;
    descriptionKo: string;
    reward: string;
    completed: boolean;
  }[];
}

export type theme = "black" | "blue" | "cyan" | "red" | "green";