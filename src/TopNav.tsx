import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import image from '../public/images/metacamp-logo.png';
import React, { useState } from 'react';

const TopNav = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <nav className="bg-slate-900 border-b border-slate-800 fixed z-30 w-full ">
            <div className="mx-auto max-w-screen-xl px-3 py-3 lg:px-0">
                <div className="flex items-center justify-between">
                    <div className="flex w-full md:w-fit items-center justify-between">
                        <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
                            {' '}
                            <div
                                className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                                onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
                            >
                                <svg
                                    className="h-8 w-8 text-gray-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <ul className="MENU-LINK-MOBILE-OPEN flex flex-col justify-between">
                                <li className="my-3 flex justify-center">
                                    <WalletMultiButton className="!bg-gradient-to-r from-sky-500 via-blue-600 !to-purple-700 hover:from-sky-400 !rounded-lg" />
                                </li>
                            </ul>
                        </div>
                        <a href="/" className="text-xl font-bold flex items-center lg:ml-2.5">
                            <img src={image} className="h-7 md:h-8 mr-2" alt="metacamp Logo" />
                        </a>
                        <button
                            id="toggleSidebarMobile"
                            aria-expanded="true"
                            aria-controls="sidebar"
                            onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
                            className="lg:hidden text-gray-600 -mr-1 hover:text-gray-400 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="hidden md:block flex items-center">
                        <WalletMultiButton className="!bg-gradient-to-r from-sky-500 via-blue-600 !to-purple-700 hover:from-sky-400 !rounded-lg" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
