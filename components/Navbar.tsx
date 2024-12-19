"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Wallet, Cat } from 'lucide-react'


export const Navbar = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false)

    const handleWalletClick = () => {
        setIsWalletConnected(!isWalletConnected) // 切换钱包连接状态
        alert(isWalletConnected ? 'Wallet disconnected' : 'Wallet connected')
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 opacity-95">
            <nav className="bg-orange-500/60 backdrop-blur-lg border-b border-orange-600/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <Image
                                src="/img/lg64.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto rounded-sm"
                            />
                            <span className="ml-2 text-base font-['Press_Start_2P'] tracking-wider text-white text-purple-200">CYBERPET</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            {/* 只在钱包连接时显示 My Pets 按钮 */}
                            {isWalletConnected && (
                                <Button
                                    onClick={() => alert('My Pets clicked')}
                                    className="font-bold p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none text-white/100 hover:text-white transition-colors"
                                    variant="ghost"
                                >
                                    <Cat className="h-4 w-4" />
                                    My Pets
                                </Button>
                            )}

                            <Button
                                onClick={handleWalletClick}
                                className="p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none text-white/100 hover:text-white transition-colors font-bold"
                                variant="ghost"
                            >
                                <Wallet className="h-4 w-4" />
                                {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

