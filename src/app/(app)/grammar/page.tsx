import { requireUser } from "@/lib/auth";
import { getAllGrammarLessons } from "@/lib/queries";
import { getCurrentDay } from "@/services/stats";
import { GrammarAcademy } from "@/components/grammar-academy";

export const metadata = {
  title: "Grammar Academy · أكاديمية القواعد الإنجليزية | English90",
  description: "Comprehensive English Grammar curriculum with detailed formulas, Arabic explanations, and interactive quizzes for every day.",
};

export default async function GrammarPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const user = await requireUser();
  const { day: dayParam } = await searchParams;

  const [lessons, currentDay] = await Promise.all([
    getAllGrammarLessons(),
    getCurrentDay(user.id),
  ]);

  const requestedDay = dayParam ? parseInt(dayParam, 10) : undefined;
  const initialDay = requestedDay && !isNaN(requestedDay) ? requestedDay : currentDay;

  return (
    <div className="w-full">
      <GrammarAcademy
        lessons={lessons}
        initialDay={initialDay}
        currentDay={currentDay}
      />
    </div>
  );
}
