import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function InfoPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'default';

  const content: Record<string, { title: string; body: ReactNode }> = {
    work: {
      title: 'Trabaja con Nosotros',
      body: (
        <div className="space-y-4">
          <p>En <strong>Senderos</strong>, somos un equipo impulsado por dos grandes pasiones: la tecnología y la naturaleza. Este proyecto nació del deseo de conectar a las personas con el medio ambiente a través de una plataforma digital intuitiva y moderna.</p>
          <p>Buscamos desarrolladores, diseñadores y creadores de contenido que compartan nuestro entusiasmo por el senderismo y la conservación ambiental. Trabajamos de forma remota, organizamos rutas de equipo y fomentamos un equilibrio saludable entre la vida laboral y la aventura al aire libre.</p>
          <p>Si te emociona la idea de construir herramientas que ayuden a otros a descubrir el mundo, ¡queremos conocerte!</p>
          <p className="italic text-white/60">(Esta es una página de demostración con información ficticia para el proyecto de desarrollo web).</p>
        </div>
      ),
    },
    privacy: {
      title: 'Política de Privacidad',
      body: (
        <div className="space-y-4">
          <p>En Senderos, nos tomamos muy en serio tu privacidad (aunque seamos una web ficticia). A continuación, detallamos cómo NO gestionamos tus datos:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Recopilación de datos:</strong> Solo guardamos las rutas que visitas en tus sueños.</li>
            <li><strong>Uso de la información:</strong> Utilizamos tus datos para enviarte señales de humo virtuales.</li>
            <li><strong>Compartir datos:</strong> No compartimos tus datos con terceros, a menos que sean ardillas del bosque.</li>
            <li><strong>Derechos del usuario:</strong> Tienes derecho a olvidar que leíste esto.</li>
          </ul>
          <p className="italic text-white/60">(Información legal ficticia con fines demostrativos).</p>
        </div>
      ),
    },
    cookies: {
      title: 'Política de Cookies',
      body: (
        <div className="space-y-4">
          <p>Nuestra política de cookies es simple: nos encantan, especialmente las de chocolate.</p>
          <p>En cuanto a las cookies digitales:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Usamos cookies estrictamente necesarias para que la web no se desmorone como una galleta mojada en leche.</li>
            <li>No usamos cookies de rastreo porque preferimos seguir rastros en el bosque.</li>
          </ul>
          <p>Al continuar navegando, aceptas que te entre hambre de galletas.</p>
          <p className="italic text-white/60">(Información legal ficticia con fines demostrativos).</p>
        </div>
      ),
    },
    legal: {
      title: 'Acuerdo Legal',
      body: (
        <div className="space-y-4">
          <p>Bienvenido al Acuerdo Legal de Senderos.</p>
          <p>1. <strong>Uso del sitio:</strong> Al usar este sitio, aceptas que es un proyecto académico y no una agencia de viajes real.</p>
          <p>2. <strong>Responsabilidad:</strong> No nos hacemos responsables si te pierdes en una ruta (física o digitalmente). Lleva siempre mapa y brújula.</p>
          <p>3. <strong>Propiedad Intelectual:</strong> Todo el código pertenece a David Ramos, pero las montañas pertenecen a todos.</p>
          <p>4. <strong>Modificaciones:</strong> Nos reservamos el derecho de cambiar este acuerdo cada vez que cambie el viento.</p>
          <p className="italic text-white/60">(Información legal ficticia con fines demostrativos).</p>
        </div>
      ),
    },
    default: {
      title: 'Información',
      body: <p>Selecciona una opción del pie de página para ver más información.</p>,
    },
  };

  const page = content[type] || content.default;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-gradient-to-br from-primary-light to-primary-dark">
        <section className="max-w-3xl mx-auto py-16 px-6 text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
          <div className="text-white text-sm leading-[1.8] text-left">
            {page.body}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
