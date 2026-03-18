import type { Metadata } from "next"
import "./globals.css"
import Header from "@/src/components/Header"
import { type ReactNode } from "react"
import { Providers } from "./providers"

export const metadata: Metadata = {
    title: "Crowdfunding Platform",
    description: "Decentralized crowdfunding for innovative projects",
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-slate-100 min-h-screen">
                <Providers>
                    <Header />
                    {props.children}
                </Providers>
            </body>
        </html>
    )
}