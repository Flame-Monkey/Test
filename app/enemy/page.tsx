// app/enemy/page.tsx
import EnemyCatsPage from "./EnemyCatsPage";
import { loadAllEnemies } from "@/lib/enemyLoader";

export const dynamic = "force-static";

export default function EnemyPage() {
  const enemies = loadAllEnemies();  // unit[] 형태

  return <EnemyCatsPage enemies={enemies} />;
}
