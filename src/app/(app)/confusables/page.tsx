import { requireUser } from "@/lib/auth";
import { getAllConfusableGroups } from "@/lib/queries";
import { getCurrentDay } from "@/services/stats";
import { ConfusablesAcademy } from "@/components/confusables-academy";

export const metadata = {
  title: "Confusables · الكلمات المتشابهة في الإنجليزية | English90",
  description:
    "دليلك الشامل لفك الاشتباك بين الكلمات والتعبيرات المتشابهة في الإنجليزية مثل make و do، like و love، مع أمثلة وقواعد واختبارات تفاعلية.",
};

export default async function ConfusablesPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; category?: string }>;
}) {
  const user = await requireUser();
  const { slug, category } = await searchParams;

  const [groups, currentDay] = await Promise.all([
    getAllConfusableGroups(),
    getCurrentDay(user.id),
  ]);

  return (
    <div className="w-full">
      <ConfusablesAcademy
        groups={groups}
        initialSlug={slug}
        initialCategory={category}
        currentDay={currentDay}
      />
    </div>
  );
}
