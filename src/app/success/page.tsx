"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  return (
    <div className="text-center py-20 animate-fade-up">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>
      <h1 className="text-3xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
        Tu orden ha sido procesada correctamente. Recibirás un correo de confirmación en breve.
      </p>
      <p className="text-sm text-muted-foreground/70 mb-8">Gracias por tu compra</p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition font-medium"
        >
          <ShoppingBag className="h-4 w-4" /> Seguir comprando
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 border text-foreground px-6 py-3 rounded-lg hover:bg-muted transition font-medium"
        >
          <Package className="h-4 w-4" /> Ver órdenes
        </Link>
      </div>
    </div>
  );
}
