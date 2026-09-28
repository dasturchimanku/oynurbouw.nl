import { Bath, ChefHat, House, HousePlus, Grid3x3, Layers, PaintRoller, BrickWall } from "lucide-react";
import type { ServiceIcon as IconName } from "@/lib/services";

const icons = {
  bath: Bath,
  kitchen: ChefHat,
  house: House,
  extension: HousePlus,
  tiles: Grid3x3,
  plaster: BrickWall,
  paint: PaintRoller,
  floor: Layers,
} as const;

export function ServiceIcon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  const Icon = icons[name] ?? House;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
