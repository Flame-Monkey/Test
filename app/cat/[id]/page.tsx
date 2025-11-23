import { notFound } from "next/navigation";
import { loadCatsById } from "@/lib/catsLoader";
import Image from "next/image";
import { loadAllCats } from "@/lib/loadcats";

interface PageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    const cats = loadAllCats();
    return cats.map(cat => ({
        id: cat.Id.toString().padStart(3, "0"),
    }));
}

export default async function CatDetailPage({ params }: PageProps) {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
        notFound();
    }

    // id에 해당하는 모든 폼 불러오기
    const cats = loadCatsById(numericId);

    if (!cats || cats.length === 0) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans leading-relaxed">
            {/* Header */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <a
                        href="/cat"
                        className="inline-block mb-4 text-white/90 hover:text-white transition-colors"
                    >
                        ← 켓 목록으로 돌아가기
                    </a>

                    <div className="text-4xl font-bold">
                        유닛 #{numericId}
                    </div>
                    <div className="text-lg opacity-80">
                        {cats[0].Name}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
                {cats.map((cat, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden"
                    >
                        {/* Form Header */}
                        <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
                            <div className="text-xl font-bold">
                                {cat.Name} — {cat.Formt + 1}단계
                            </div>
                            <div className="text-gray-600 text-sm">
                                Form {cat.Formt}
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left — Image + Description */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center">
                                    {cat.Image ? (
                                        <Image
                                            src={cat.Image}
                                            alt={cat.Name}
                                            width={220}
                                            height={220}
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            (이미지 없음)
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        설명
                                    </div>
                                    <div
                                        className="text-gray-800 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: cat.Descriptiont }}
                                    />
                                </div>
                            </div>

                            {/* Right — Stats */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        기본 스탯
                                    </div>
                                    <ul className="text-gray-800 text-sm space-y-1">
                                        <li>HP: {cat.Hp}</li>
                                        <li>공격력: {cat.Atk}</li>
                                        <li>사거리: {cat.Range}</li>
                                        <li>속도: {cat.Speed}</li>
                                        <li>재생산: {cat.RespawnHalf / 2}</li>
                                        <li>TBA(공격 간격): {cat.Tba}</li>
                                        <li>선딜: {cat.PreAttackframe}</li>
                                        <li>폭: {cat.Width}</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        공격 타입
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.AttackType.map((t, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        속성(Target traits)
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.Targets.map((t, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        특수 능력(Abilities)
                                    </div>
                                    {cat.Abilities.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {cat.Abilities.map((a, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">
                                            (능력 없음)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
