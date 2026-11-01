"use client";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon, ChartLineData02Icon, File01Icon, LibraryIcon, LockIcon, NoteEditIcon, PlayCircleIcon, StarIcon, Task01Icon,
} from "@hugeicons/core-free-icons";

/** The site's icon set (Hugeicons outline), referenced by name so server pages can use it too. */
const SET: Record<string, IconSvgElement> = {
  play: PlayCircleIcon,
  file: File01Icon,
  note: NoteEditIcon,
  library: LibraryIcon,
  chart: ChartLineData02Icon,
  lock: LockIcon,
  done: CheckmarkCircle02Icon,
  star: StarIcon,
  exam: Task01Icon,
};

export type IconName = keyof typeof SET;

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return <HugeiconsIcon icon={SET[name]} size={size} strokeWidth={1.6} className={className} aria-hidden="true" />;
}
