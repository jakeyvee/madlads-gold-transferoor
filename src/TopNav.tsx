import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import { useRpcStore } from './store';
import { defaultEnvRpcUrl } from './utils';
import { Connection } from '@solana/web3.js';

const image = require('../public/images/metacamp-logo.png');

const TopNav = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDefaultRpc, setIsDefaultRpc] = useState(true);
    const [customRpcUrl, setCustomRpcUrl] = useState<string>('');

    const handleSetDefaultRpcUrl = () => {
        setIsDefaultRpc(true);
        useRpcStore.setState({ rpcConnection: new Connection(defaultEnvRpcUrl) });
    };

    const handleSetCustomRpcUrl = () => {
        setIsDefaultRpc(false);
        useRpcStore.setState({ rpcConnection: new Connection(customRpcUrl) });
    };

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
                    <div className="hidden md:flex md:flex-row items-center gap-x-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsSettingsOpen((value) => !value)}
                                className="z-10 border h-12 border-transparent text-white px-6 flex items-center justify-center rounded-md bg-amber-500 hover:bg-amber-400"
                            >
                                <div className="hidden md:block">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 16 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.71971 1.2926L6.41471 2.9726C6.11846 3.06573 5.83097 3.18635 5.55971 3.32761L4.14971 2.35761L2.33979 4.16753L3.31479 5.57252C3.17292 5.84439 3.05355 6.13003 2.95979 6.42753L1.27979 6.73252V9.29252L2.95979 9.59751C3.05354 9.89564 3.17729 10.18 3.31979 10.4525L2.33979 11.8575L4.14971 13.6674L5.5547 12.6974C5.82719 12.8399 6.11657 12.9587 6.4147 13.0524L6.71969 14.7324H9.27969L9.58468 13.0524C9.88218 12.9587 10.1678 12.8393 10.4397 12.6974L11.8447 13.6674L13.6546 11.8575L12.6796 10.4525C12.8208 10.1813 12.9415 9.89878 13.0346 9.60252L14.7196 9.29252V6.73252L13.0346 6.42753C12.9415 6.1319 12.8252 5.84815 12.6846 5.57753L13.6546 4.16753L11.8447 2.35761L10.4397 3.32761C10.1678 3.18574 9.88218 3.06636 9.58468 2.9726L9.27969 1.2926H6.71971ZM7.9997 4.9726C9.67842 4.9726 11.0397 6.33385 11.0397 8.0126C11.0397 9.69135 9.67846 11.0526 7.9997 11.0526C6.32095 11.0526 4.95971 9.69135 4.95971 8.0126C4.95971 6.33385 6.32095 4.9726 7.9997 4.9726Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </div>
                            </button>
                            <ul
                                aria-label="dropdown-list"
                                className={`wallet-adapter-dropdown-list w-max ${
                                    isSettingsOpen ? 'wallet-adapter-dropdown-list-active' : 'false'
                                }`}
                                role="menu"
                            >
                                <span className="text-lg font-bold  text-white px-5">RPC Endpoint</span>
                                <div
                                    className="flex items-center space-x-4 cursor-pointer px-5"
                                    onClick={handleSetDefaultRpcUrl}
                                >
                                    {isDefaultRpc ? (
                                        <div>
                                            <input type="checkbox" className="hidden" checked={false} />
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17Z"
                                                    fill="url(#paint0_linear_4842_28073)"
                                                ></path>
                                                <defs>
                                                    <linearGradient
                                                        id="paint0_linear_4842_28073"
                                                        x1="3.64948"
                                                        y1="-3"
                                                        x2="21.9982"
                                                        y2="-0.81258"
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop stop-color="#FCC00A"></stop>
                                                        <stop offset="1" stop-color="#4EBAE9"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    ) : (
                                        <div>
                                            <input type="checkbox" className="hidden" checked={false} />
                                            <svg
                                                className="block"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
                                                    fill="white"
                                                    fill-opacity="0.35"
                                                ></path>
                                            </svg>
                                        </div>
                                    )}

                                    <p className="text-black-75 dark:text-white-75 text-sm">Helius RPC</p>
                                </div>
                                <div className="flex items-center space-x-4 px-5">
                                    {!isDefaultRpc ? (
                                        <div>
                                            <input type="checkbox" className="hidden" />
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17Z"
                                                    fill="url(#paint0_linear_4842_28073)"
                                                ></path>
                                                <defs>
                                                    <linearGradient
                                                        id="paint0_linear_4842_28073"
                                                        x1="3.64948"
                                                        y1="-3"
                                                        x2="21.9982"
                                                        y2="-0.81258"
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop stop-color="#FCC00A"></stop>
                                                        <stop offset="1" stop-color="#4EBAE9"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    ) : (
                                        <div>
                                            <input type="checkbox" className="hidden" />
                                            <svg
                                                className="block"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
                                                    fill="white"
                                                    fill-opacity="0.35"
                                                ></path>
                                            </svg>
                                        </div>
                                    )}
                                    <p className="text-black-75 dark:text-white-75 text-sm">Custom RPC</p>
                                </div>
                                <div className="relative px-5">
                                    <input
                                        className="rounded-md pr-16 items-center bg-gray-900 text-sm text-white placeholder:text-white-35 w-full text-left px-4 py-3.5"
                                        placeholder="Custom RPC URL"
                                        value={customRpcUrl}
                                        onChange={(e) => setCustomRpcUrl(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSetCustomRpcUrl}
                                        className="absolute top-1/2 -translate-y-1/2 right-8 text-xs rounded-[4px] bg-white text-black-50 px-2 py-1 dark:text-white-35 dark:bg-jupiter-dark"
                                    >
                                        Save
                                    </button>
                                </div>
                            </ul>
                        </div>
                        <WalletMultiButton className="!bg-gradient-to-r from-sky-500 via-blue-600 !to-purple-700 hover:from-sky-400 !rounded-lg" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
