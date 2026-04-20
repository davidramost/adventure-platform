import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-dark py-12 px-[5%]">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        {/* Left column */}
        <div className="md:w-1/4 text-center md:text-left space-y-2">
          <Link
            to="/info?type=work"
            className="block text-white no-underline text-sm italic leading-relaxed hover:underline"
          >
            Trabaja con nosotros
          </Link>
          <p className="text-white text-sm italic m-0">adventure@gmail.ko</p>
          <p className="text-white text-sm italic m-0">Av. del doce de Octubre 23</p>
          <p className="text-white text-sm italic m-0">C.P 14001</p>
        </div>

        {/* Center - Logo */}
        <div className="md:w-1/2 flex justify-center items-center">
          <Link to="/">
            <img src="/Img/the_logo.png" alt="Logo" className="w-32 h-auto" />
          </Link>
        </div>

        {/* Right column */}
        <div className="md:w-1/4 text-center md:text-right space-y-2">
          <Link
            to="/info?type=privacy"
            className="block text-white no-underline text-sm italic leading-relaxed hover:underline"
          >
            Políticas de privacidad
          </Link>
          <Link
            to="/info?type=cookies"
            className="block text-white no-underline text-sm italic leading-relaxed hover:underline"
          >
            Políticas de cookies
          </Link>
          <Link
            to="/info?type=legal"
            className="block text-white no-underline text-sm italic leading-relaxed hover:underline"
          >
            Acuerdo Legal
          </Link>
          <p className="text-white text-sm m-0 mt-2">&copy; David Ramos</p>
        </div>
      </div>
    </footer>
  );
}
