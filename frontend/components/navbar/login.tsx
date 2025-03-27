import Link from "next/link";
import { Button } from "../ui/button";

export default function Login() {
    return (
        <Button variant="outline"><Link href="/login">Login</Link></Button>
    )
}