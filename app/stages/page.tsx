// "use client";

// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import Card from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
// import * as DialogPrimitive from '@radix-ui/react-dialog';
// import { XIcon } from 'lucide-react';
// import { cn } from '@/components/ui/utils';
// import { stages, enemies } from '@/data/mockData';
// import type { Stage, Enemy } from '@/types/common';

// export default function StagePage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedMapType, setSelectedMapType] = useState<string>('all');
//   const [selectedMapStage, setSelectedMapStage] = useState<string>('all');
//   const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedStar, setSelectedStar] = useState<number>(1);
//   const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
//   const [selectedEnemyMultiplier, setSelectedEnemyMultiplier] = useState<number>(100);
//   const [isEnemyDialogOpen, setIsEnemyDialogOpen] = useState(false);

//   // 속성별 색상 매핑
//   const getAttributeColor = (attr: string) => {
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

//   // 속성별 배지 색상 매핑
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

//   // 이름 색상 결정 (속성 개수에 따라)
//   const getNameColor = (attributes?: string[]) => {
//     if (!attributes || attributes.length === 0 || attributes.includes('없음')) {
//       return 'text-gray-700';
//     }
//     const validAttrs = attributes.filter(a => a !== '없음');
//     if (validAttrs.length === 0) return 'text-gray-700';
//     if (validAttrs.length === 1) return getAttributeColor(validAttrs[0]);
//     // 여러 속성이면 무지개색 그라데이션
//     return 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent';
//   };

//   const mapTypes = [
//     { value: 'all', label: '전체', color: 'gray' },
//     { value: '세계편', label: '세계편', color: 'blue' },
//     { value: '미래편', label: '미래편', color: 'purple' },
//     { value: '우주편', label: '우주편', color: 'indigo' },
//     { value: '마계편', label: '마계편', color: 'red' },
//     { value: '레전드 스토리', label: '레전드 스토리', color: 'yellow' },
//     { value: '신 레전드 스토리', label: '신 레전드 스토리', color: 'green' },
//     { value: '레전드 스토리 0', label: '레전드 스토리 0', color: 'orange' }
//   ];

//   const mapStages = [
//     { value: 'all', label: '전체', color: 'gray' },
//     { value: '1장', label: '1장', color: 'green' },
//     { value: '2장', label: '2장', color: 'blue' },
//     { value: '3장', label: '3장', color: 'purple' }
//   ];

//   const filteredStages = stages.filter((stage) => {
//     const matchesSearch = searchTerm === '' || stage.enemies.some(enemy => 
//       enemy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       enemy.nameKo.includes(searchTerm)
//     );
//     const matchesMapType = selectedMapType === 'all' || stage.mapType === selectedMapType;
//     const matchesMapStage = selectedMapStage === 'all' || !stage.mapStage || stage.mapStage === selectedMapStage;
    
//     return matchesSearch && matchesMapType && matchesMapStage;
//   });

//   const isLegendStory = (mapType: string) => {
//     return ['레전드 스토리', '신 레전드 스토리', '레전드 스토리 0'].includes(mapType);
//   };

//   const getEnemyMultiplier = (enemy: any, star: number) => {
//     if (!enemy.starMultipliers) return null;
//     const key = `star${star}` as 'star1' | 'star2' | 'star3' | 'star4';
//     return enemy.starMultipliers[key];
//   };

//   const getEnemyDetails = (enemyName: string): Enemy | null => {
//     return enemies.find(e => e.name === enemyName || e.nameKo === enemyName) || null;
//   };

//   const getColorClasses = (color: string, isSelected: boolean) => {
//     const colorMap: Record<string, { selected: string; hover: string }> = {
//       gray: { selected: 'bg-gray-500 text-white border-gray-500', hover: 'hover:bg-gray-100 hover:border-gray-400' },
//       red: { selected: 'bg-red-500 text-white border-red-500', hover: 'hover:bg-red-100 hover:border-red-400' },
//       orange: { selected: 'bg-orange-500 text-white border-orange-500', hover: 'hover:bg-orange-100 hover:border-orange-400' },
//       yellow: { selected: 'bg-yellow-500 text-white border-yellow-500', hover: 'hover:bg-yellow-100 hover:border-yellow-400' },
//       green: { selected: 'bg-green-500 text-white border-green-500', hover: 'hover:bg-green-100 hover:border-green-400' },
//       blue: { selected: 'bg-blue-500 text-white border-blue-500', hover: 'hover:bg-blue-100 hover:border-blue-400' },
//       purple: { selected: 'bg-purple-500 text-white border-purple-500', hover: 'hover:bg-purple-100 hover:border-purple-400' },
//       indigo: { selected: 'bg-indigo-500 text-white border-indigo-500', hover: 'hover:bg-indigo-100 hover:border-indigo-400' }
//     };
    
//     const colors = colorMap[color] || colorMap.gray;
//     return isSelected ? colors.selected : `bg-white border-gray-300 ${colors.hover}`;
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-green-600 mb-2">스테이지 정보</h2>
//         <p className="text-gray-600">냥코대전쟁의 모든 스테이지 정보를 확인하세요</p>
//       </div>

//       <Input
//         type="text"
//         placeholder="출몰 적으로 검색..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="max-w-md"
//       />

//       {/* Filters */}
//       <Card className="p-6">
//         <div className="space-y-6">
//           <div>
//             <h3 className="mb-4">맵 종류</h3>
//             <div className="flex flex-wrap gap-3">
//               {mapTypes.map((mapType) => (
//                 <button
//                   key={mapType.value}
//                   onClick={() => setSelectedMapType(mapType.value)}
//                   className={`px-4 py-2 rounded-lg border-2 transition-all ${getColorClasses(
//                     mapType.color,
//                     selectedMapType === mapType.value
//                   )}`}
//                 >
//                   {mapType.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className="mb-4">맵 단계</h3>
//             <div className="flex flex-wrap gap-3">
//               {mapStages.map((mapStage) => (
//                 <button
//                   key={mapStage.value}
//                   onClick={() => setSelectedMapStage(mapStage.value)}
//                   className={`px-4 py-2 rounded-lg border-2 transition-all ${getColorClasses(
//                     mapStage.color,
//                     selectedMapStage === mapStage.value
//                   )}`}
//                 >
//                   {mapStage.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Card>

//       <Card className="p-6">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>이름</TableHead>
//                 <TableHead>맵 종류</TableHead>
//                 <TableHead>맵 단계</TableHead>
//                 <TableHead>난이도</TableHead>
//                 <TableHead>통솔력</TableHead>
//                 <TableHead>출몰 적</TableHead>
//                 <TableHead>기지 HP</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredStages.map((stage) => (
//                 <TableRow 
//                   key={stage.id}
//                   className="cursor-pointer hover:bg-gray-50 transition-colors"
//                   onClick={() => {
//                     setSelectedStage(stage);
//                     setSelectedStar(1);
//                     setIsDialogOpen(true);
//                   }}
//                 >
//                   <TableCell>{stage.id}</TableCell>
//                   <TableCell>
//                     <div>
//                       <div>{stage.nameKo}</div>
//                       <div className="text-gray-500">{stage.name}</div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{stage.mapType}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     {stage.mapStage ? (
//                       <Badge variant="outline">{stage.mapStage}</Badge>
//                     ) : (
//                       <span className="text-gray-400">-</span>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{stage.difficulty}</Badge>
//                   </TableCell>
//                   <TableCell>{stage.deployLimit}</TableCell>
//                   <TableCell>
//                     <div className="flex flex-col gap-1 max-w-xs">
//                       {stage.enemies.map((enemy, idx) => (
//                         <div key={idx} className="flex justify-between items-center text-xs">
//                           <div>
//                             <Badge variant="secondary" className="text-xs">
//                               {enemy.nameKo}
//                             </Badge>
//                             <span className="text-gray-500 ml-1">
//                               {enemy.triggerType === 'time' 
//                                 ? `${enemy.triggerValue}초`
//                                 : `성 HP ${enemy.triggerValue}%`}
//                             </span>
//                           </div>
//                           {isLegendStory(stage.mapType) && enemy.starMultipliers && (
//                             <span className="text-yellow-600 ml-2">
//                               {enemy.starMultipliers.star1}%
//                             </span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell>{stage.baseHp.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>

//       <Card className="p-4 bg-green-50">
//         <p className="text-green-800">
//           <span className="font-medium">API 엔드포인트:</span> GET /api/stages
//         </p>
//         <p className="text-green-600 mt-2">총 {filteredStages.length}개의 스테이지</p>
//       </Card>

//       {/* Stage Detail Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={(open) => {
//         setIsDialogOpen(open);
//         // 스테이지 Dialog를 닫을 때 적 정보 Dialog도 함께 닫기
//         if (!open) {
//           setIsEnemyDialogOpen(false);
//         }
//       }}>
//         <DialogContent 
//           className={`max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
//             isEnemyDialogOpen ? '!left-[25%] !translate-x-[-50%] !z-[55]' : ''
//           }`}
//           onClick={(e) => {
//             // 스테이지 Dialog 내부 클릭 시 이벤트 전파 방지
//             e.stopPropagation();
//           }}
//         >
//           {selectedStage && (
//             <>
//               <DialogHeader>
//                 <DialogTitle className="text-green-600">
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
//                     <h3 className="mb-3 text-green-600">난이도 선택</h3>
//                     <div className="flex gap-2 flex-wrap">
//                       {[1, 2, 3, 4].map((star) => (
//                         <button
//                           key={star}
//                           onClick={() => setSelectedStar(star)}
//                           className={`px-4 py-2 rounded-lg border-2 transition-all ${
//                             selectedStar === star
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
//                 </div>

//                 {/* Enemy Spawns - Vertical */}
//                 <div>
//                   <h3 className="mb-3 text-green-600">출몰 적 정보</h3>
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
//                         //       ? getEnemyMultiplier(enemy, selectedStar) || 100
//                         //       : 100;
                            
//                         //     // Update enemy info without closing dialog
//                         //     setSelectedEnemy(enemyDetails);
//                         //     setSelectedEnemyMultiplier(multiplier);
                            
//                         //     // Only open if not already open
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
//                                 ? `${getEnemyMultiplier(enemy, selectedStar) || 100}%`
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
//                               ))
//                             }
//                           </div>
//                           <Badge variant="secondary" className="text-xs ml-auto">
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
//       {isEnemyDialogOpen && (
//         <DialogPrimitive.Root open={true} modal={false}>
//           <DialogPortal>
//             <DialogPrimitive.Content
//               className={cn(
//                 "bg-background fixed top-[50%] z-[60] grid w-full max-w-xl translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg",
//                 "left-[75%] translate-x-[-50%]"
//               )}
//               onClick={(e) => {
//                 // Dialog 내부 클릭 시 이벤트 전파 방지
//                 e.stopPropagation();
//               }}
//               onPointerDown={(e) => {
//                 e.stopPropagation();
//               }}
//               onPointerDownOutside={(e) => {
//                 e.preventDefault();
//               }}
//               onOpenAutoFocus={(e) => {
//                 // 자동 포커스 방지
//                 e.preventDefault();
//               }}
//             >
//             {selectedEnemy && (
//               <>
//                 <DialogHeader>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <DialogTitle className={getNameColor(selectedEnemy.attributes)}>
//                           {selectedEnemy.nameKo}
//                         </DialogTitle>
//                         {selectedEnemy.attributes && selectedEnemy.attributes.filter(a => a !== '없음').length > 0 && (
//                           <div className="flex gap-1">
//                             {selectedEnemy.attributes.filter(a => a !== '없음').map((attr, i) => (
//                               <Badge key={i} variant="outline" className={`text-xs ${getAttributeBadgeStyle(attr)}`}>
//                                 {attr}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <DialogDescription>
//                         {selectedEnemy.name}
//                       </DialogDescription>
//                     </div>
//                     <div className="text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
//                       <div className="text-xs text-gray-600">배율</div>
//                       <div className="text-lg">{selectedEnemyMultiplier}%</div>
//                     </div>
//                   </div>
//                 </DialogHeader>
                
//                 <div className="space-y-4 mt-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <p className="text-gray-600 mb-1">HP</p>
//                       <p>{Math.floor(selectedEnemy.hp * selectedEnemyMultiplier / 100).toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 mb-1">공격력</p>
//                       <p>{Math.floor(selectedEnemy.attack * selectedEnemyMultiplier / 100).toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 mb-1">사거리</p>
//                       <p>{selectedEnemy.range}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 mb-1">이동속도</p>
//                       <p>{selectedEnemy.speed}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 mb-1">넉백 횟수</p>
//                       <p>{selectedEnemy.knockbackCount}회</p>
//                     </div>
//                   </div>

//                   {selectedEnemy.abilities && selectedEnemy.abilities.length > 0 && (
//                     <div>
//                       <p className="text-gray-600 mb-1">능력</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedEnemy.abilities.map((ability, i) => (
//                           <Badge key={i} className="bg-red-500">{ability}</Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {selectedEnemy.effects && selectedEnemy.effects.filter(e => e !== '없음').length > 0 && (
//                     <div>
//                       <p className="text-gray-600 mb-1">효과</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedEnemy.effects.filter(e => e !== '없음').map((effect, i) => (
//                           <Badge key={i} variant="secondary">{effect}</Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <button 
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setIsEnemyDialogOpen(false);
//                     setSelectedEnemy(null);
//                   }}
//                   className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
//                 >
//                   <XIcon />
//                   <span className="sr-only">Close</span>
//                 </button>
//               </>
//             )}
//           </DialogPrimitive.Content>
//         </DialogPortal>
//       </DialogPrimitive.Root>
//       )}
//     </div>
//   );
// }
export default function p(){
  return "";
}