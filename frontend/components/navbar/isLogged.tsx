"use client";

import { Separator } from "@radix-ui/react-separator"
import Login from "./login"
import Profile from "./profile"
import { Register } from "./register"

export default function IsLogged() {
    // use hook to check is logged 
    const isLogged = false

    if (isLogged) {
        return <Profile />
    }


    return (
        <>
            <Login />
            <Separator orientation="vertical" />
            <Register />
        </>
    )
}