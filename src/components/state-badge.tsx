import { Badge } from "./ui";
import { VocabularyStateLabel, VocabularyStateStyle, type VocabularyState } from "@/lib/states";

/**
 * A word's learning state as a pill: a status dot plus its name. Colour is never the only
 * signal (the text says what it means), and the tinted backgrounds are the same everywhere a
 * state is shown. The dot is hollow for "not learned yet" and solid once the word is in play,
 * so progress reads even without colour.
 */
export function StateBadge({ state, className = "" }: { state: string; className?: string }) {
  const key = (state in VocabularyStateStyle ? state : "UNLEARNED") as VocabularyState;
  const started = key !== "UNLEARNED";
  return (
    <Badge className={`${VocabularyStateStyle[key]} ${className}`.trim()}>
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${started ? "bg-current" : "ring-[1.5px] ring-inset ring-current"}`}
      />
      {VocabularyStateLabel[key]}
    </Badge>
  );
}
