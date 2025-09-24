import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';


const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const handleNavigation = (path:string) => {
        setIsOpen(false);
    };

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    }

    return (
        <div className="h-16 flex-none bg-green-500 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center py-3">
                <Link to="/">
                    <span className="text-2xl font-bold text-white">Gerenciador de Gastos</span>
                </Link>

                <div className="md:hidden text-3xl text-white font-bold"
                onClick={() => setIsOpen(!isOpen)}>
                    =
                </div>

                <nav className="hidden md:flex">
                    <ul className="flex space-x-6 text-white">
                        <li>
                            <Link to="/"
                               className={`hover:border-b-2 border-white ${isActive('/') ? 'border-b-2 font-bold' : ''}`}>

                                visão geral
                            </Link>
                        </li>

                        <li>
                            <Link to="/lancamentos"
                                className={`hover:border-b-2 border-white ${isActive('/lancamentos') ? 'border-b-2 font-bold' : ''}`}>

                                lançamento
                            </Link>
                        </li>

                        <li>
                            <Link to="/limites"
                               className={`hover:border-b-2 border-white ${isActive('/limites') ? 'border-b-2 font-bold' : ''}`}>

                                limites
                            </Link>
                        </li>

                        <li>
                            <Link to="/relatorios"
                                className={`hover:border-b-2 border-white ${isActive('/relatorios') ? 'border-b-2 font-bold' : ''}`}>

                                relatórios
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* menu mobile */}
            {isOpen && (
                <div className="md:hidden bg-green-500 text-white py-4 px-8">
                    <ul className="flex flex-col space-y-4">
                        <li className="block">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-green-600 rounded">
                                Visão Geral
                            </Link>
                        </li>
                        <li className="block">
                            <Link to="/lancamentos" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-green-600 rounded">
                                Lançamentos
                            </Link>
                        </li>
                        <li className="block">
                            <Link to="/limites" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-green-600 rounded">
                                Limites
                            </Link>
                        </li>
                        <li className="block">
                            <Link to="/relatorios" onClick={() => setIsOpen(false)} className="block py-2 hover:bg-green-600 rounded">
                                Relatórios
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Navbar;