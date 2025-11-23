import { loadAllEnemies } from "./enemyLoader";
import { loadAllCats } from "./loadcats"; 
import { unit } from "@/types/cat";

// ID에 해당하는 1~4폼 유닛만 골라 반환
export function loadCatsById(id: number): unit[] {
    const all = loadAllCats();
    return all.filter(c => c.Id === id);
}
export function loadEnemiesById (id: number): unit[] {
    const all = loadAllEnemies();
    return all.filter(e => e.Id === id);
}