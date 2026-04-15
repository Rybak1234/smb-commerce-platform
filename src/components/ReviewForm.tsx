"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded: () => void }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">Inicia sesión para dejar una reseña</p>
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">Escribe tu reseña</h3>
      <div>
        <p className="text-sm text-gray-600 mb-2">Tu calificación</p>
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
              <svg
                className={`w-7 h-7 transition-colors ${
                  star <= (hover || rating) ? "text-amber-400" : "text-gray-200"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
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
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
