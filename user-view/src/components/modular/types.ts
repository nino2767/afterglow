export interface EmotionChipType {
  emotion: string;
  axis: string;
}

export interface ModularItem {
  id: string;
  title: string;
  artist?: string;
  section: string;
  year?: string;
  docent_script: string;
  default_emotion_chips: EmotionChipType[];
  color?: string; // 스핀오프 배경 그라디언트용
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user" | "system";
  text: string;
  artworkId?: string;
  isStreaming?: boolean;
  emotionChips?: EmotionChipType[];
}
