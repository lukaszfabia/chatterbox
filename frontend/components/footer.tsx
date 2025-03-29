import { appDetails } from "@/config/config";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { Github, Instagram, Linkedin } from "lucide-react";
import { Input } from "./ui/input";

export default function Footer() {
    return (
        <footer className="md:p-5 p-4 mt-auto">
            <div className="md:px-5 px-3 py-5">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1">
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {appDetails.title}
                        </h4>
                        <p className="text-muted-foreground font-source-sans">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>

                    <div className="flex-1">
                        <div className="space-y-5">
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Excepturi quisquam rem ad quasi laudantium culpa temporibus
                                aliquam fugiat!
                            </p>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input type="email" placeholder="joe.doe@example.com" />
                                <Button type="submit">Subscribe</Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col items-center space-y-3">
                            <h5>FOLLOW US</h5>
                            <div className="flex gap-2">
                                <Github />
                                <Linkedin />
                                <Instagram />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-5">
                    <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-muted-foreground text-sm">
                        <p>&copy; 2025 {appDetails.title}. {appDetails.whoami}, {appDetails.based}. All rights Reserved</p>
                    </div>

                    <div className="text-sm font-medium leading-none">
                        <ul className="list-none flex md:gap-2 font-bold flex-col md:flex-row text-center">
                            <li>
                                <Link href="#">
                                    <Button variant="link">PRIVACY AND POLICY</Button>
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    <Button variant="link">TERMS AND CONDITIONS</Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div >
            </div >
        </footer >
    );
}
