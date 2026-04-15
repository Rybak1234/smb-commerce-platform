"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDate, getInitials } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  createdAt: string;
  user: { name: string | null };
  answers: { id: string; answer: string; createdAt: string; user: { name: string | null }; helpful: number }[];
}

interface ProductQAProps {
  productId: string;
  questions: Question[];
  onRefresh?: () => void;
}

export function ProductQA({ productId, questions, onRefresh }: ProductQAProps) {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, question: newQuestion }),
      });
      if (!res.ok) throw new Error();
      setNewQuestion("");
      setShowForm(false);
      toast.success("Pregunta enviada");
      onRefresh?.();
    } catch {
      toast.error("Error al enviar la pregunta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    if (!newAnswer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer: newAnswer }),
      });
      if (!res.ok) throw new Error();
      setNewAnswer("");
      setAnsweringId(null);
      toast.success("Respuesta enviada");
      onRefresh?.();
    } catch {
      toast.error("Error al enviar la respuesta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Preguntas y Respuestas ({questions.length})
        </h3>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          Hacer una Pregunta
        </Button>
      </div>

      {showForm && (
        <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
          <Textarea placeholder="Escribe tu pregunta sobre este producto..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} rows={3} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmitQuestion} disabled={submitting || !newQuestion.trim()}>Enviar</Button>
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No hay preguntas todavía. ¡Sé el primero en preguntar!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="space-y-3 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(q.user.name || "U")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{q.user.name || "Usuario"}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(q.createdAt)}</span>
                  </div>
                  <p className="text-sm mt-1">{q.question}</p>
                </div>
              </div>

              {q.answers.length > 0 && (
                <div className="ml-11 space-y-3">
                  {q.answers.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{getInitials(a.user.name || "U")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{a.user.name || "Usuario"}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                        </div>
                        <p className="text-sm mt-1">{a.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {answeringId === q.id ? (
                <div className="ml-11 space-y-2">
                  <Textarea placeholder="Escribe tu respuesta..." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={2} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setAnsweringId(null)}>Cancelar</Button>
                    <Button size="sm" onClick={() => handleSubmitAnswer(q.id)} disabled={submitting || !newAnswer.trim()}>Responder</Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="ml-11" onClick={() => setAnsweringId(q.id)}>
                  Responder
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
