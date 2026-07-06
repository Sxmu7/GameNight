export type Lang = "de" | "en" | "es";

export type Duration = "kurz" | "mittel" | "lang";

export interface GameTranslation {
  name: string;
  rule: string;
}

export interface Game {
  id: string;
  categoryId: string;
  minPlayers: number;
  maxPlayers: number;
  duration: Duration;
  intensity: 1 | 2 | 3 | 4 | 5;
  equipment: string[];
  onlineCapable: boolean;
  onlineReason: Record<Lang, string>;
  isPlaceholder: boolean;
  translations: Record<Lang, GameTranslation>;
}

export interface Category {
  id: string;
  icon: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
}
