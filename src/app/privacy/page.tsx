export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Politica de Privacidad</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>En SurtiBolivia nos comprometemos a proteger tu privacidad. Esta politica describe como recopilamos y utilizamos tu informacion personal.</p>
        <h2 className="text-lg font-semibold text-foreground">Informacion que Recopilamos</h2>
        <p>Recopilamos informacion que nos proporcionas directamente, como tu nombre, email y direccion al crear una cuenta o realizar un pedido.</p>
        <h2 className="text-lg font-semibold text-foreground">Uso de la Informacion</h2>
        <p>Utilizamos tu informacion para procesar pedidos, mejorar nuestros servicios y enviarte comunicaciones relevantes.</p>
        <h2 className="text-lg font-semibold text-foreground">Proteccion de Datos</h2>
        <p>Implementamos medidas de seguridad para proteger tu informacion personal contra acceso no autorizado.</p>
      </div>
    </div>
  );
}
