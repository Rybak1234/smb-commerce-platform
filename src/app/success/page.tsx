import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-gray-500 mb-6">
        Tu orden ha sido procesada correctamente. Recibirás un correo de confirmación.
      </p>
      <Link
        href="/"
        className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
