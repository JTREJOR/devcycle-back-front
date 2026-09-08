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
        className="copilot-fab"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        <Robot />
      </button>

      {isOpen && (
        <aside className="copilot-panel">
          <div className="copilot-panel__header">
            <strong>Asistente de portafolio</strong>
            <IconButton icon={Close} aria-label="Cerrar" size="small" kind="tertiary" onClick={toggleChat} />
          </div>
          <div className="copilot-panel__messages">
            {messages.map((m) => (
              <div key={m.id} className={`copilot-message copilot-message--${m.role}`}>
                {m.text}
              </div>
            ))}
            {sendMessage.isPending && <div className="copilot-message copilot-message--assistant">Escribiendo…</div>}
          </div>
          <div className="copilot-panel__suggestions">
            {["¿Quién debe aprobar este paso?", "Ayúdame a llenar este formulario", "¿Qué sigue después de este paso?"].map(
              (s) => (
                <Button key={s} size="small" kind="tertiary" onClick={() => handleSend(s)}>
                  {s}
                </Button>
              ),
            )}
          </div>
          <div className="copilot-panel__input">
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
