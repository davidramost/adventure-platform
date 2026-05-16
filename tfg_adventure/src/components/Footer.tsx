import {Link} from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-primary-dark py-3 px-[5%]">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
                {/* Left column */}
                <div className="md:w-1/4 text-center md:text-left flex flex-col gap-2">
                    <Link
                        to="/info?type=work"
                        className="block text-white no-underline text-[12px] leading-relaxed hover:underline"
                    >
                        Trabaja con nosotros
                    </Link>
                    <p className="text-white text-[12px]">adventure@gmail.com</p>
                    <p className="text-white text-[12px]">Av. del doce de Octubre 23</p>
                    <p className="text-white text-[12px]">C.P 14001</p>
                </div>

                {/* Center - Logo */}
                <div className="md:w-1/2 flex justify-center items-center">
                    <button
                        onClick={() => window.scrollTo(0, 0)}
                        className="bg-transparent border-none cursor-pointer p-0"
                        aria-label="Volver al principio"
                    >
                        <img src="/Img/the_logo.png" alt="Logo" className="w-32 h-auto"/>
                    </button>
                </div>

                {/* Right column */}
                <div className="md:w-1/4 text-center md:text-right flex flex-col gap-2">
                    <Link
                        to="/info?type=privacy"
                        className="block text-white no-underline text-[12px] leading-relaxed hover:underline"
                    >
                        Políticas de privacidad
                    </Link>
                    <Link
                        to="/info?type=cookies"
                        className="block text-white no-underline text-[12px] leading-relaxed hover:underline"
                    >
                        Políticas de cookies
                    </Link>
                    <Link
                        to="/info?type=legal"
                        className="block text-white no-underline text-[12px] leading-relaxed hover:underline"
                    >
                        Acuerdo Legal
                    </Link>
                    <p className="text-white text-[12px]">© Adventure {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}
