"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link";
import { useAccount } from 'wagmi';

const Header = () => {
    const { address, isConnected } = useAccount();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 shadow-lg">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    
                    {/* Левая часть с навигацией */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link 
                                    href="/"
                                    className="rounded-md px-3 py-2 text-base font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    Campaigns
                                </Link>
                                
                                {isConnected && address && (
                                    <Link 
                                        href={`/dashboard/${address}`}
                                        className="rounded-md px-3 py-2 text-base font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - кнопка подключения кошелька */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;