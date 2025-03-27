import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="md:px-0 px-5">
            {children}
        </div>
    )
}