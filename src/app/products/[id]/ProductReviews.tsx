"use client";

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import StarRating from "@/components/StarRating";

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  userName: string;
  createdAt: string;
}

export default function ProductReviews({ productId, initialReviews }: { productId: string; initialReviews: ReviewData[] }) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleReviewAdded = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(data.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userName: r.user?.name || "Usuario",
      createdAt: r.createdAt,
    })));
  };

  return (
    <div className="space-y-4">
      <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-gray-400 text-sm">Sé el primero en dejar una reseña</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
