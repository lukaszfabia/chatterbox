import Link from "next/link";
import { Button } from "../ui/button";

export function Register() {
    return (
        <Button><Link href="/register">Sign Up</Link></Button>
    )
}