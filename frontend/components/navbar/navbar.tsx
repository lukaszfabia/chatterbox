import { appDetails } from "@/lib/config";
import { ModeToggle } from "../toggle";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"
import Login from "./login";
import { Register } from "./register";
import IsLogged from "./isLogged";



const links = [
    {
        "link": "messages",
        "content": "Messages"
    },
    {
        "link": "explore",
        "content": "Explore"
    },
    {
        "link": "docs",
        "content": "Docs"
    },

]



export default function Navbar() {
    return (
        <header className="p-5 backdrop-blur-2xl min-h-[70px]">
            <nav className="flex justify-between px-5 items-center">
                <div>
                    <h1 className="font-extrabold text-2xl">
                        {appDetails.title}
                    </h1>
                </div>

                <ul className="flex gap-7">
                    {links.map((e) =>
                        <li className="underline-animation hover:underline-animation" key={e.link}>
                            <Link href={`/${e.link}`}>{e.content}</Link>
                        </li>)}
                </ul>

                <div className="flex space-x-5">
                    <div className="flex space-x-2">
                        <IsLogged />
                    </div>
                    <ModeToggle />
                </div>
            </nav>
        </header>
    )
}
