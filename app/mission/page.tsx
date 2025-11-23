// "use client";

// import { useState, useMemo, useEffect, useRef } from 'react';
// import Card from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Plus, Target, X, Check, Search } from 'lucide-react';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { enemies } from '@/data/mockData';
// import { stages } from '@/data/mockDataStages';
// import type { Stage, Enemy } from '@/types/common';

// interface Mission {
//   id: number;
//   mapType: string;
//   star: number;
//   enemyName: string;
// }

// export default function MonthlyMissionPage() {
//   const [selectedMapType, setSelectedMapType] = useState<string>('세계편');
//   const [selectedStar, setSelectedStar] = useState<number>(1);
//   const [selectedEnemy, setSelectedEnemy] = useState<string>('');
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [missions, setMissions] = useState<Mission[]>([]);
//   const [sortBy, setSortBy] = useState<'energy' | 'time'>('energy');
//   const searchInputRef = useRef<HTMLInputElement>(null);
  
//   // Stage Detail Dialog
//   const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedStageStarLevel, setSelectedStageStarLevel] = useState<number>(1);
  
//   // Enemy Detail Dialog
//   const [selectedEnemyDetail, setSelectedEnemyDetail] = useState<Enemy | null>(null);
//   const [selectedEnemyMultiplier, setSelectedEnemyMultiplier] = useState<number>(100);
//   const [isEnemyDialogOpen, setIsEnemyDialogOpen] = useState(false);

//   const mapTypes = ['세계편', '미래편', '우주편', '레전드'];
//   const stars = [1, 2, 3, 4];

//   // Popover가 열릴 때 자동으로 input에 포커스
//   useEffect(() => {
//     if (searchOpen) {
//       setTimeout(() => {
//         const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
//         if (input) {
//           input.focus();
//         }
//       }, 0);
//     }
//   }, [searchOpen]);

//   const addMission = () => {
//     if (selectedMapType && selectedEnemy) {
//       const newMission: Mission = {
//         id: Date.now(),
//         mapType: selectedMapType,
//         star: selectedStar,
//         enemyName: selectedEnemy
//       };
//       setMissions([...missions, newMission]);
//     }
//   };

//   const removeMission = (id: number) => {
//     setMissions(missions.filter(m => m.id !== id));
//   };

//   // 추천 스테이지: 추가한 미션에 포함된 적이 나오는 스테이지들
//   const recommendedStages = useMemo(() => {
//     if (missions.length === 0) return [];

//     const missionEnemies = new Set(missions.map(m => m.enemyName));
    
//     return stages.filter(stage => {
//       return stage.enemies.some(enemy => 
//         missionEnemies.has(enemy.name) || missionEnemies.has(enemy.nameKo)
//       );
//     });
//   }, [missions]);

//   // 미션별로 그룹화된 추천 스테이지
//   const stagesByMission = useMemo(() => {
//     return missions.map(mission => {
//       let matchingStages = stages.filter(stage => {
//         // 1. 맵 종류 필터
//         let mapTypeMatches = false;
//         if (mission.mapType === '레전드') {
//           // 레전드 선택 시 모든 레전드 스토리 관련 맵 포함
//           mapTypeMatches = ['레전드 스토리', '신 레전드 스토리', '레전드 스토리 0'].includes(stage.mapType);
//         } else {
//           mapTypeMatches = stage.mapType === mission.mapType;
//         }
        
//         if (!mapTypeMatches) return false;
        
//         // 2. 단계/장 필터 (레전드 스토리는 mapStage가 없으므로 체크하지 않음)
//         const isLegend = ['레전드 스토리', '신 레전드 스토리', '레전드 스토리 0'].includes(stage.mapType);
//         if (!isLegend && stage.mapStage) {
//           const expectedStage = `${mission.star}장`;
//           if (stage.mapStage !== expectedStage) return false;
//         }
        
//         // 3. 적 필터
//         return stage.enemies.some(enemy => 
//           enemy.name === mission.enemyName || enemy.nameKo === mission.enemyName
//         );
//       });
      
//       // 정렬 적용
//       matchingStages = [...matchingStages].sort((a, b) => {
//         if (sortBy === 'energy') {
//           return (a.deployLimit || 0) - (b.deployLimit || 0);
//         } else {
//           // time이 없는 경우 큰 값으로 처리하여 뒤로 보냄
//           const timeA = a.time || 999999;
//           const timeB = b.time || 999999;
//           return timeA - timeB;
//         }
//       });
      
//       return {
//         mission,
//         stages: matchingStages
//       };
//     });
//   }, [missions, sortBy]);

//   const getEnemyDetails = (enemyName: string): Enemy | null => {
//     return enemies.find(e => e.name === enemyName || e.nameKo === enemyName) || null;
//   };

//   const isLegendStory = (mapType: string) => {
//     return ['레전드 스토리', '신 레전드 스토리', '레전드 스토리 0'].includes(mapType);
//   };

//   const canSelectStar4 = (mapType: string) => {
//     return mapType === '레전드';
//   };

//   const getEnemyMultiplier = (enemy: any, star: number) => {
//     if (!enemy.starMultipliers) return null;
//     const key = `star${star}` as 'star1' | 'star2' | 'star3' | 'star4';
//     return enemy.starMultipliers[key];
//   };

//   const getAttributeColorSingle = (attr: string) => {
//     const colorMap: Record<string, string> = {
//       '빨강': 'text-red-600',
//       '떠있음': 'text-sky-500',
//       '메탈': 'text-gray-500',
//       '무속성': 'text-gray-700',
//       '천사': 'text-yellow-400',
//       '흑': 'text-purple-600',
//       '좀비': 'text-green-600',
//       '에일리언': 'text-pink-500',
//       '없음': 'text-gray-600'
//     };
//     return colorMap[attr] || 'text-gray-600';
//   };

//   const getAttributeBadgeStyle = (attr: string) => {
//     const styleMap: Record<string, string> = {
//       '빨강': 'bg-red-100 text-red-700 border-red-300',
//       '떠있음': 'bg-sky-100 text-sky-700 border-sky-300',
//       '메탈': 'bg-gray-100 text-gray-700 border-gray-300',
//       '무속성': 'bg-gray-50 text-gray-600 border-gray-200',
//       '천사': 'bg-yellow-100 text-yellow-700 border-yellow-300',
//       '흑': 'bg-purple-100 text-purple-700 border-purple-300',
//       '좀비': 'bg-green-100 text-green-700 border-green-300',
//       '에일리언': 'bg-pink-100 text-pink-700 border-pink-300',
//       '없음': 'bg-gray-50 text-gray-500 border-gray-200'
//     };
//     return styleMap[attr] || 'bg-gray-100 text-gray-600';
//   };

//   const getNameColor = (attributes?: string[]) => {
//     if (!attributes || attributes.length === 0 || attributes.includes('없음')) {
//       return 'text-gray-700';
//     }
//     const validAttrs = attributes.filter(a => a !== '없음');
//     if (validAttrs.length === 0) return 'text-gray-700';
//     if (validAttrs.length === 1) return getAttributeColorSingle(validAttrs[0]);
//     return 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent';
//   };

//   const getAttributeColor = (attributes?: string[]) => {
//     if (!attributes || attributes.length === 0) return 'text-gray-700';
//     const attr = attributes[0];
//     const colorMap: Record<string, string> = {
//       '빨강': 'text-red-600',
//       '떠있음': 'text-blue-400',
//       '메탈': 'text-gray-600',
//       '무속성': 'text-gray-700',
//       '천사': 'text-yellow-500',
//       '흑': 'text-purple-700',
//       '좀비': 'text-purple-900',
//       '에일리언': 'text-blue-600',
//       '없음': 'text-gray-700'
//     };
//     return colorMap[attr] || 'text-gray-700';
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-indigo-600 mb-2">월간 미션 유틸리티</h2>
//         <p className="text-gray-600">적을 추가하고 해당 적이 나오는 스테이지를 확인하세요</p>
//       </div>

//       {/* 선택 영역 - Full Width */}
//       <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//           {/* 스테이지 종류 - 2x2 버튼 */}
//           <div className="md:col-span-3">
//             <label className="text-sm text-gray-700 mb-3 block">스테이지 종류</label>
//             <div className="grid grid-cols-2 gap-2">
//               {mapTypes.map(type => (
//                 <Button
//                   key={type}
//                   variant={selectedMapType === type ? 'default' : 'outline'}
//                   onClick={() => setSelectedMapType(type)}
//                   className="h-12"
//                 >
//                   {type}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* 단계 - 2x2 버튼 */}
//           <div className="md:col-span-2">
//             <label className="text-sm text-gray-700 mb-3 block">단계</label>
//             <div className="grid grid-cols-2 gap-2">
//               {stars.map(star => (
//                 <Button
//                   key={star}
//                   variant={selectedStar === star ? 'default' : 'outline'}
//                   onClick={() => setSelectedStar(star)}
//                   className="h-12"
//                   disabled={!selectedMapType || (star === 4 && !canSelectStar4(selectedMapType))}
//                 >
//                   {star}성
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* 적 검색 - Combobox */}
//           <div className="md:col-span-5">
//             <label className="text-sm text-gray-700 mb-3 block">적 이름</label>
//             <Popover open={searchOpen} onOpenChange={setSearchOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={searchOpen}
//                   className="w-full justify-between h-12"
//                 >
//                   {selectedEnemy ? (
//                     <span className={getAttributeColor(getEnemyDetails(selectedEnemy)?.attributes)}>
//                       {selectedEnemy}
//                     </span>
//                   ) : (
//                     <span className="text-gray-500">적 검색...</span>
//                   )}
//                   <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-[400px] p-0" align="start">
//                 <Command shouldFilter>
//                   <CommandInput placeholder="적 이름 검색..." />
//                   <CommandList>
//                     <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
//                     <CommandGroup>
//                       {enemies.map(enemy => (
//                         <CommandItem
//                           key={enemy.id}
//                           value={enemy.nameKo}
//                           keywords={[enemy.name, enemy.nameKo]}
//                           onSelect={() => {
//                             setSelectedEnemy(enemy.nameKo);
//                             setSearchOpen(false);
//                           }}
//                         >
//                           <Check
//                             className={`mr-2 h-4 w-4 ${
//                               selectedEnemy === enemy.nameKo ? 'opacity-100' : 'opacity-0'
//                             }`}
//                           />
//                           <span className={getAttributeColor(enemy.attributes)}>
//                             {enemy.nameKo}
//                           </span>
//                           <span className="text-gray-500 ml-2">({enemy.name})</span>
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* 추가 버튼 */}
//           <div className="md:col-span-2">
//             <label className="text-sm text-gray-700 mb-3 block opacity-0">추가</label>
//             <Button 
//               onClick={addMission} 
//               disabled={!selectedMapType || !selectedEnemy}
//               className="w-full h-12 gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               추가
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* 7:3 레이아웃 */}
//       <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
//         {/* 왼쪽 70% - 추천 스테이지 */}
//         <div className="lg:col-span-7">
//           <Card className="p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Target className="w-5 h-5 text-indigo-600" />
//               <h3 className="text-indigo-600">추천 스테이지</h3>
              
//               {/* 정렬 옵션 - 우측 정렬 */}
//               {missions.length > 0 && (
//                 <div className="flex gap-2 ml-auto">
//                   <Button
//                     variant={sortBy === 'energy' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setSortBy('energy')}
//                   >
//                     통솔력 적은 순
//                   </Button>
//                   <Button
//                     variant={sortBy === 'time' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setSortBy('time')}
//                   >
//                     시간 빠른 순
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {missions.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
//                 <p>미션을 추가하면 추천 스테이지가 표시됩니다</p>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {stagesByMission.map(({ mission, stages: matchingStages }) => {
//                   const enemyDetails = getEnemyDetails(mission.enemyName);
                  
//                   return (
//                     <div key={mission.id} className="border-b pb-4 last:border-b-0">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Badge className="bg-indigo-500">{mission.mapType}</Badge>
//                         <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
//                           {mission.star}성
//                         </Badge>
//                         <span className={`font-medium ${getAttributeColor(enemyDetails?.attributes)}`}>
//                           {mission.enemyName}
//                         </span>
//                         <span className="text-gray-400 text-sm ml-auto">
//                           {matchingStages.length}개 스테이지
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         {matchingStages.map(stage => (
//                           <Card 
//                             key={stage.id} 
//                             className="p-4 hover:shadow-md transition-shadow cursor-pointer"
//                             // onClick={() => {
//                             //   setSelectedStage(stage);
//                             //   setSelectedStageStarLevel(1);
//                             //   setIsDialogOpen(true);
//                             // }}
//                           >
//                             <div className="flex items-start justify-between mb-2">
//                               <div>
//                                 <div className="font-medium text-gray-900">{stage.nameKo}</div>
//                                 <div className="text-sm text-gray-500">{stage.name}</div>
//                               </div>
//                               <div className="text-yellow-600">{stage.difficulty}</div>
//                             </div>
//                             <div className="flex items-center gap-2 text-sm mb-2">
//                               <Badge variant="outline" className="text-xs">
//                                 {stage.mapType}
//                               </Badge>
//                               {stage.mapStage && (
//                                 <Badge variant="outline" className="text-xs bg-gray-50">
//                                   {stage.mapStage}
//                                 </Badge>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
//                               <span className="flex items-center gap-1">
//                                 <span className="text-indigo-600">통솔력:</span> {stage.deployLimit}
//                               </span>
//                               {stage.time && (
//                                 <span className="flex items-center gap-1">
//                                   <span className="text-blue-600">시간:</span> {stage.time}초
//                                 </span>
//                               )}
//                             </div>
//                             <div className="text-xs text-gray-600">
//                               적: {stage.enemies.map(e => e.nameKo).join(', ')}
//                             </div>
//                           </Card>
//                         ))}
//                       </div>

//                       {matchingStages.length === 0 && (
//                         <p className="text-sm text-gray-500 italic">해당 적이 나오는 스테이지가 없습니다</p>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </Card>
//         </div>

//         {/* 오른쪽 30% - 현재 미션 목록 */}
//         <div className="lg:col-span-3">
//           <Card className="p-6 sticky top-24">
//             <h3 className="text-indigo-600 mb-4">현재 미션</h3>
            
//             {missions.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <Plus className="w-8 h-8 mx-auto mb-2 opacity-30" />
//                 <p className="text-sm">추가된 미션이 없습니다</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {missions.map(mission => {
//                   const enemyDetails = getEnemyDetails(mission.enemyName);
                  
//                   return (
//                     <Card key={mission.id} className="p-3 bg-white hover:bg-gray-50 transition-colors">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-1 flex-wrap">
//                             <Badge className="bg-indigo-500 text-xs">
//                               {mission.mapType}
//                             </Badge>
//                             <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
//                               {mission.star}성
//                             </Badge>
//                           </div>
//                           <div className={`font-medium text-sm truncate ${getAttributeColor(enemyDetails?.attributes)}`}>
//                             {mission.enemyName}
//                           </div>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeMission(mission.id)}
//                           className="h-8 w-8 p-0 flex-shrink-0"
//                         >
//                           <X className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </Card>
//                   );
//                 })}

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setMissions([])}
//                   className="w-full mt-4"
//                 >
//                   전체 삭제
//                 </Button>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>

//       {/* Stage Detail Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={(open) => {
//         setIsDialogOpen(open);
//         if (!open) {
//           setIsEnemyDialogOpen(false);
//         }
//       }}>
//         <DialogContent 
//           className={`max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
//             isEnemyDialogOpen ? '!left-[25%] !translate-x-[-50%] !z-[55]' : ''
//           }`}
//           onClick={(e) => {
//             e.stopPropagation();
//           }}
//         >
//           {selectedStage && (
//             <>
//               <DialogHeader>
//                 <DialogTitle className="text-indigo-600">
//                   {selectedStage.nameKo} ({selectedStage.name})
//                 </DialogTitle>
//                 <DialogDescription>
//                   스테이지 상세 정보
//                 </DialogDescription>
//               </DialogHeader>
              
//               <div className="space-y-6 mt-4">
//                 {/* Star Difficulty Selector for Legend Stories */}
//                 {isLegendStory(selectedStage.mapType) && (
//                   <div>
//                     <h3 className="mb-3 text-indigo-600">난이도 선택</h3>
//                     <div className="flex gap-2 flex-wrap">
//                       {[1, 2, 3, 4].map((star) => (
//                         <button
//                           key={star}
//                           onClick={() => setSelectedStageStarLevel(star)}
//                           className={`px-4 py-2 rounded-lg border-2 transition-all ${
//                             selectedStageStarLevel === star
//                               ? 'bg-yellow-500 text-white border-yellow-500'
//                               : 'bg-white border-gray-300 hover:bg-yellow-100 hover:border-yellow-400'
//                           }`}
//                         >
//                           ⭐ {star}성
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Basic Info */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-gray-600 mb-1">ID</p>
//                     <p>{selectedStage.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">맵 종류</p>
//                     <Badge variant="outline">{selectedStage.mapType}</Badge>
//                   </div>
//                   {selectedStage.mapStage && (
//                     <div>
//                       <p className="text-gray-600 mb-1">맵 단계</p>
//                       <Badge variant="outline">{selectedStage.mapStage}</Badge>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-gray-600 mb-1">난이도</p>
//                     <Badge variant="outline" className="text-yellow-600">{selectedStage.difficulty}</Badge>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">통솔력</p>
//                     <p>{selectedStage.deployLimit.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">기지 HP</p>
//                     <p>{selectedStage.baseHp.toLocaleString()}</p>
//                   </div>
//                   {selectedStage.time && (
//                     <div>
//                       <p className="text-gray-600 mb-1">제한 시간</p>
//                       <p>{selectedStage.time}초</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Enemy Spawns */}
//                 <div>
//                   <h3 className="mb-3 text-indigo-600">출몰 적 정보</h3>
//                   <div className="space-y-3">
//                     {selectedStage.enemies.map((enemy, idx) => (
//                       <Card 
//                         key={idx} 
//                         className="p-4 bg-gray-50 border-2 cursor-pointer hover:bg-gray-100 transition-all"
//                         // onClick={(e) => {
//                         //   e.stopPropagation();
//                         //   const enemyDetails = getEnemyDetails(enemy.name);
//                         //   if (enemyDetails) {
//                         //     const multiplier = isLegendStory(selectedStage.mapType) 
//                         //       ? getEnemyMultiplier(enemy, selectedStageStarLevel) || 100
//                         //       : 100;
                            
//                         //     setSelectedEnemyDetail(enemyDetails);
//                         //     setSelectedEnemyMultiplier(multiplier);
                            
//                         //     if (!isEnemyDialogOpen) {
//                         //       setIsEnemyDialogOpen(true);
//                         //     }
//                         //   }
//                         // }}
//                       >
//                         <div className="flex items-center justify-between gap-4">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span className={`font-medium ${getNameColor(getEnemyDetails(enemy.name)?.attributes)}`}>
//                               {enemy.nameKo}
//                             </span>
//                             <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
//                               {isLegendStory(selectedStage.mapType) 
//                                 ? `${getEnemyMultiplier(enemy, selectedStageStarLevel) || 100}%`
//                                 : '100%'}
//                             </Badge>
//                             {getEnemyDetails(enemy.name)?.attributes && 
//                               getEnemyDetails(enemy.name)!.attributes.filter(a => a !== '없음').map((attr, i) => (
//                                 <Badge 
//                                   key={i}
//                                   variant="outline" 
//                                   className={`text-xs ${getAttributeBadgeStyle(attr)}`}
//                                 >
//                                   {attr}
//                                 </Badge>
//                               ))}
//                           </div>
//                           <Badge variant="secondary" className="text-xs">
//                             {enemy.triggerType === 'time' 
//                               ? `${enemy.triggerValue}초`
//                               : `성 HP ${enemy.triggerValue}%`}
//                           </Badge>
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Enemy Detail Dialog */}
//       <Dialog open={isEnemyDialogOpen} onOpenChange={setIsEnemyDialogOpen}>
//         <DialogContent 
//           className="max-w-xl max-h-[90vh] overflow-y-auto !left-[75%] !translate-x-[-50%] !z-[60]"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {selectedEnemyDetail && (
//             <>
//               <DialogHeader>
//                 <DialogTitle className={`flex items-center gap-2 ${getNameColor(selectedEnemyDetail.attributes)}`}>
//                   🐕 {selectedEnemyDetail.nameKo}
//                 </DialogTitle>
//                 <DialogDescription>
//                   {selectedEnemyDetail.name}
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="space-y-4 mt-4">
//                 {/* Attributes */}
//                 {selectedEnemyDetail.attributes && selectedEnemyDetail.attributes.length > 0 && (
//                   <div>
//                     <p className="text-gray-600 mb-2">속성</p>
//                     <div className="flex gap-2 flex-wrap">
//                       {selectedEnemyDetail.attributes.map((attr, idx) => (
//                         <Badge 
//                           key={idx} 
//                           variant="outline" 
//                           className={getAttributeBadgeStyle(attr)}
//                         >
//                           {attr}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Stats with Multiplier */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-gray-600 mb-1">체력 (HP)</p>
//                     <p className="text-red-600">{Math.round(selectedEnemyDetail.hp * selectedEnemyMultiplier / 100).toLocaleString()}</p>
//                     {selectedEnemyMultiplier !== 100 && (
//                       <p className="text-xs text-gray-500">기본: {selectedEnemyDetail.hp.toLocaleString()}</p>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">공격력 (ATK)</p>
//                     <p className="text-orange-600">{Math.round(selectedEnemyDetail.attack * selectedEnemyMultiplier / 100).toLocaleString()}</p>
//                     {selectedEnemyMultiplier !== 100 && (
//                       <p className="text-xs text-gray-500">기본: {selectedEnemyDetail.attack.toLocaleString()}</p>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">사거리</p>
//                     <p>{selectedEnemyDetail.range}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">이동속도</p>
//                     <p>{selectedEnemyDetail.speed}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">넉백 횟수</p>
//                     <p>{selectedEnemyDetail.knockbackCount}회</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 mb-1">배율</p>
//                     <p className="text-yellow-600">{selectedEnemyMultiplier}%</p>
//                   </div>
//                 </div>

//                 {/* Abilities */}
//                 {selectedEnemyDetail.abilities && selectedEnemyDetail.abilities.length > 0 && (
//                   <div>
//                     <p className="text-gray-600 mb-2">특수 능력</p>
//                     <div className="flex gap-2 flex-wrap">
//                       {selectedEnemyDetail.abilities.map((ability, idx) => (
//                         <Badge key={idx} className="bg-indigo-100 text-indigo-700 border border-indigo-300">
//                           {ability}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Effects */}
//                 {selectedEnemyDetail.effects && selectedEnemyDetail.effects.filter(e => e !== '없음').length > 0 && (
//                   <div>
//                     <p className="text-gray-600 mb-2">효과</p>
//                     <div className="flex gap-2 flex-wrap">
//                       {selectedEnemyDetail.effects.filter(e => e !== '없음').map((effect, idx) => (
//                         <Badge key={idx} className="bg-purple-100 text-purple-700 border border-purple-300">
//                           {effect}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

export default function p(){
  return "";
}