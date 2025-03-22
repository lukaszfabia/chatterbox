import Link from "next/link";
import { Button } from "../ui/button";

export default function Login() {
    return (
        <Link href="/login"><Button variant="outline">Login</Button></Link>
    )
}