"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
          Iniciar Sesión
        </Link>
        <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
          Registrarse
        </Link>
      </div>
    );
  }

  const isAdmin = (session.user as any)?.role === "admin";

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Link href="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Admin
        </Link>
      )}
      <Link href="/account" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
        {session.user?.name}
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
      >
        Salir
      </button>
    </div>
  );
}
