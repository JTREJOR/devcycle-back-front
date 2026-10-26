"use client";

import { useState } from "react";
import { Button, IconButton, TextField } from "@vibe/core";
import { Robot, Close, Send } from "@vibe/icons";
import { useUiStore } from "@/store/uiStore";
import { useSendChatMessage } from "@/lib/queries";

export function CopilotChat() {
  const isOpen = useUiStore((s) => s.isChatOpen);
  const toggleChat = useUiStore((s) => s.toggleChat);
  const messages = useUiStore((s) => s.chatMessages);
  const addChatMessage = useUiStore((s) => s.addChatMessage);
  const selectedStageId = useUiStore((s) => s.selectedStageId);
  const [draft, setDraft] = useState("");
  const sendMessage = useSendChatMessage();

  function handleSend(text?: string) {
    const message = (text ?? draft).trim();
    if (!message) return;

    addChatMessage({
      id: `local-${Date.now()}`,
      role: "user",
      text: message,
      ts: new Date().toISOString(),
    });
    setDraft("");

    sendMessage.mutate(
      { message, context: selectedStageId ? { stageId: selectedStageId } : undefined },
      {
        onSuccess: (res) => {
          addChatMessage({ id: res.id, role: "assistant", text: res.text, ts: res.ts });
        },
      },
    );
  }

  return (
    <>
      <button
        type="button"
        className="fixed right-6 bottom-6 z-40 flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-linear-to-br from-brand-primary to-brand-accent text-white shadow-[0_6px_18px_rgba(131,49,119,0.35)] transition-transform duration-150 hover:scale-105"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        <Robot />
      </button>

      {isOpen && (
        <aside className="fixed top-header right-0 bottom-0 z-30 flex w-copilot max-w-screen flex-col border-l border-border-default bg-bg-card shadow-[-8px_0_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-border-default bg-linear-to-r from-brand-primary/8 to-transparent px-[18px] py-3.5">
            <strong>Asistente de portafolio</strong>
            <IconButton icon={Close} aria-label="Cerrar" size="small" kind="tertiary" onClick={toggleChat} />
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-[1.45] ${
                  m.role === "assistant"
                    ? "self-start rounded-tl-[2px] bg-[#f5f6f8] text-text-main"
                    : "self-end rounded-tr-[2px] bg-brand-primary text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="max-w-[85%] self-start rounded-xl rounded-tl-[2px] bg-[#f5f6f8] px-3.5 py-2.5 text-[13px] leading-[1.45] text-text-main">
                Escribiendo…
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {["¿Quién debe aprobar este paso?", "Ayúdame a llenar este formulario", "¿Qué sigue después de este paso?"].map(
              (s) => (
                <Button key={s} size="small" kind="tertiary" onClick={() => handleSend(s)}>
                  {s}
                </Button>
              ),
            )}
          </div>
          <div className="flex gap-2 border-t border-border-default px-4 py-3">
            <TextField
              placeholder="Escribe tu pregunta…"
              value={draft}
              onChange={(value) => setDraft(value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              size="small"
            />
            <IconButton icon={Send} aria-label="Enviar" onClick={() => handleSend()} disabled={!draft.trim()} />
          </div>
        </aside>
      )}
    </>
  );
}
