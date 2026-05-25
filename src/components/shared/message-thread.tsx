"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendBookingMessage } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

export type ThreadMessage = Message & {
  sender?: { id: string; name: string };
};

interface MessageThreadProps {
  bookingId: string;
  messages: ThreadMessage[];
  currentUserId: string;
  disabled?: boolean;
}

export function MessageThread({
  bookingId,
  messages,
  currentUserId,
  disabled = false,
}: MessageThreadProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleSubmit(formData: FormData) {
    const text = String(formData.get("message") ?? "");
    setError(null);
    startTransition(async () => {
      const result = await sendBookingMessage(bookingId, text);
      if (!result.success) {
        setError(result.error);
        return;
      }
      (document.getElementById(`message-form-${bookingId}`) as HTMLFormElement)?.reset();
      router.refresh();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm">
      <div className="max-h-80 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation about this event.
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {!isMine && (
                    <p className="mb-1 text-xs font-medium opacity-80">
                      {msg.sender?.name ?? "Participant"}
                    </p>
                  )}
                  <p>{msg.message}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px] opacity-70",
                      isMine ? "text-right" : "text-left"
                    )}
                  >
                    {new Date(msg.created_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form
        id={`message-form-${bookingId}`}
        action={handleSubmit}
        className="flex flex-col gap-2 border-t p-4"
      >
        <Textarea
          name="message"
          placeholder={
            disabled ? "Messaging closed for this booking." : "Write a message…"
          }
          rows={2}
          required
          disabled={pending || disabled}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={pending || disabled}
          className="self-end"
        >
          {pending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
