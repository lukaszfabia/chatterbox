"use client";

import { appDetails } from "@/config/config";
import { ModeToggle } from "../toggle";
import Link from "next/link";
import IsLogged from "./isLogged";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { "link": "chat", "content": "Messages" },
    { "link": "explore", "content": "Explore" },
    { "link": "docs", "content": "Docs" },
];


function Brand() {
    return (
        <div>
            <Link href="/">
                <h1 className="font-extrabold md:text-2xl sm:text-xl text-lg">
                    {appDetails.title}
                </h1>
            </Link>
        </div>
    )
}

function DesktopLinks() {
    return (
        <ul className="hidden md:flex gap-7">
            {links.map((e) => (
                <li className="underline-animation hover:underline-animation" key={e.link}>
                    <Link href={`/${e.link}`}>{e.content}</Link>
                </li>
            ))}
        </ul>
    )
}

function ActionButtons() {
    return (
        <div className="hidden md:flex space-x-5">
            <IsLogged />
            <ModeToggle />
        </div>

    )
}

function MobileBurgerButton({ setIsOpen, isOpen }: { setIsOpen: (isOpen: boolean) => void, isOpen: boolean }) {
    return (

        <div className="md:hidden space-x-2">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
            <ModeToggle />
        </div>)
}


function BurgerMenu({ setIsOpen, isOpen }: { setIsOpen: (isOpen: boolean) => void, isOpen: boolean }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="md:hidden absolute top-[70px] left-0 w-full p-5 shadow-lg z-50 backdrop-blur-xl"
                >
                    <ul className="flex flex-col gap-4">
                        {links.map((e) => (
                            <li key={e.link} className="text-lg">
                                <Link href={`/${e.link}`} onClick={() => setIsOpen(false)}>
                                    {e.content}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col mt-5 gap-2">
                        <IsLogged />
                        <div className="max-md:hidden">
                            <ModeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <header className="p-5 backdrop-blur-2xl min-h-[70px] fixed w-full left-0 top-0 z-50">
            <nav className="flex justify-between px-5 items-center bg-transparent">
                <Brand />

                <DesktopLinks />

                <ActionButtons />

                <MobileBurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            </nav>

            <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </header>
    );
}
