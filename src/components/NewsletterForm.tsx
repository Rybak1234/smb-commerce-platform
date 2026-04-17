"use client";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit() {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Ingresa un email valido");
      return;
    }
    toast.success("Suscrito exitosamente. Recibirás nuestras ofertas.");
    setEmail("");
  }

  return (
    <div className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 px-4 py-3 rounded-xl bg-background border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
      />
      <button
        onClick={handleSubmit}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg shadow-primary/20"
      >
        Suscribirse
      </button>
    </div>
  );
}
