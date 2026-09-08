import { create } from "zustand";
import { ChatMessage } from "@devcycle/shared";

interface UiState {
  activeUserId: string;
  setActiveUserId: (id: string) => void;

  selectedStageId: string | null;
  setSelectedStageId: (id: string | null) => void;

  isChatOpen: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeUserId: "u-01",
  setActiveUserId: (id) => set({ activeUserId: id }),

  selectedStageId: null,
  setSelectedStageId: (id) => set({ selectedStageId: id }),

  isChatOpen: false,
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),

  chatMessages: [
    {
      id: "welcome",
      role: "assistant",
      text: "Hola, soy tu asistente de portafolio. Puedo ayudarte a llenar formularios, explicarte quién aprueba cada paso, o resumir un documento que subas. ¿En qué te ayudo?",
      ts: new Date().toISOString(),
    },
  ],
  addChatMessage: (message) => set((s) => ({ chatMessages: [...s.chatMessages, message] })),
}));
