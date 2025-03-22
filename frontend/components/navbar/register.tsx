import Link from "next/link";
import { Button } from "../ui/button";

export function Register() {
    return (
        <Link href="/register"><Button>Sign Up</Button></Link>
    )
}