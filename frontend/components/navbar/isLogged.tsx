"use client";

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
        <div className="md:flex-row flex-col space-x-2">
            <Login />
            <Register />
        </div>
    )
}