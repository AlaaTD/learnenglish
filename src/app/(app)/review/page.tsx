import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDifficultWords } from "@/lib/queries";
import { VocabularyCard } from "@/components/vocabulary-card";
import { EmptyState, PageHeader, Tag } from "@/components/ui";

export const metadata = { title: "Difficult Words · الكلمات الصعبة" };

export default async function DifficultWordsPage() {
  const user = await requireUser();
  const [words, settings] = await Promise.all([
    getDifficultWords(user.id),
    db.userSettings.findUnique({ where: { userId: user.id } }),
  ]);
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;
  const autoplayAudio = settings?.autoplayAudio ?? false;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Difficult Words · الكلمات الصعبة"
        description="الكلمات التي قمت بتمييزها كصعبة للتركيز عليها ومراجعتها في أي وقت."
        actions={
          words.length > 0 ? (
            <Tag tone="accent">
              ⭐ {words.length} {words.length === 1 ? "word" : "words"}
            </Tag>
          ) : null
        }
      />

      {words.length === 0 ? (
        <EmptyState
          title="قائمة الكلمات الصعبة فارغة"
          action={{ href: "/vocabulary", label: "تصفح الكلمات" }}
        >
          عندما تجد أي كلمة صعبة أثناء تعلمك، اضغط على زر النجمة ⭐ بجانب الكلمة لحفظها هنا والرجوع إليها في أي وقت.
        </EmptyState>
      ) : (
        <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <VocabularyCard
              key={word.id}
              word={word}
              audioRate={audioRate}
              autoplayAudio={autoplayAudio}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
}
