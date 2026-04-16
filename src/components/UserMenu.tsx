"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Iniciar Sesión
        </Link>
        <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
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
          <Settings className="h-4 w-4" />
          Admin
        </Link>
      )}
      <Link href="/account" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        {session.user?.name}
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
      >
        <LogOut className="h-3.5 w-3.5" /> Salir
      </button>
    </div>
  );
}
