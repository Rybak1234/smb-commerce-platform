"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded: () => void }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="text-center py-6 bg-muted/50 rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">Inicia sesión para dejar una reseña</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Selecciona una calificación");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() || null }),
      });
      if (res.ok) {
        toast.success("¡Reseña publicada!");
        setRating(0);
        setComment("");
        onReviewAdded();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al publicar");
      }
    } catch {
      toast.error("Error al publicar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-5 space-y-4">
      <h3 className="font-semibold">Escribe tu reseña</h3>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Tu calificación</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con este producto... (opcional)"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none bg-background"
        />
      </div>
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
