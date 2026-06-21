import type { Stat } from "../../domain/discipline.ts";
import { HpStatChip } from "./HpStatChip.tsx";
import { ManaStatChip } from "./ManaStatChip.tsx";
import { XpStatChip } from "./XpStatChip.tsx";

export interface StatChipProps {
  stat: Stat;
  amount: number;
  completed?: boolean;
}

export function StatChip({ stat, amount, completed }: StatChipProps) {
  switch (stat) {
    case "hp":
      return <HpStatChip amount={amount} completed={completed} />;
    case "mana":
      return <ManaStatChip amount={amount} completed={completed} />;
    case "xp":
      return <XpStatChip amount={amount} completed={completed} />;
  }
}
