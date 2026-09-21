import { Badge } from "./ui";
import { VocabularyStateLabel, VocabularyStateStyle, type VocabularyState } from "@/lib/states";

/**
 * A word's learning state as a pill: a status dot plus its name. Colour is never the only
 * signal (the dot repeats the text colour, the text says what it means), and the tinted
 * backgrounds are the same everywhere a state is shown.
 */
export function StateBadge({ state, className = "" }: { state: string; className?: string }) {
  const key = (state in VocabularyStateStyle ? state : "UNLEARNED") as VocabularyState;
  return (
    <Badge className={`${VocabularyStateStyle[key]} ${className}`.trim()}>
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {VocabularyStateLabel[key]}
    </Badge>
  );
}
