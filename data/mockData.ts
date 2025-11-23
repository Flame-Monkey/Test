import { MonthlyMission } from '@/types/common';
import { stages } from '@/data/mockDataStages';

// stages는 ./mockDataStages.ts에서 import됨
export { stages };

export const monthlyMissions: MonthlyMission = {
  month: '2025년 11월',
  missions: [
    {
      id: 1,
      description: 'Clear 10 stages',
      descriptionKo: '스테이지 10개 클리어',
      reward: '냥캔 30개',
      completed: false
    },
    {
      id: 2,
      description: 'Defeat 100 enemies',
      descriptionKo: '적 100마리 처치',
      reward: '레어 티켓 1개',
      completed: false
    },
    {
      id: 3,
      description: 'Watch 5 ads',
      descriptionKo: '광고 5개 시청',
      reward: '냥캔 50개',
      completed: false
    },
    {
      id: 4,
      description: 'Upgrade 3 cats to level 10',
      descriptionKo: '냥코 3마리 레벨 10으로 업그레이드',
      reward: 'XP 10000',
      completed: false
    },
    {
      id: 5,
      description: 'Complete daily missions 7 days',
      descriptionKo: '일일 미션 7일 완료',
      reward: '레어 티켓 2개',
      completed: false
    }
  ]
};
