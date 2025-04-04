"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UserRow from "@/components/explore/row";
import { useEffect, useState } from "react";
import { UserRowSkeleton } from "@/components/explore/row-skeleton";
import { User } from "@/lib/models/user";
import { useProfile } from "@/context/profile-context";
import { useAuth } from "@/context/auth-context";



export default function Explore() {
    const [phrase, setPhrase] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const { fetchProfiles, currUserProfile } = useProfile();

    useEffect(() => {
        fetchProfiles().then((users) => {
            setUsers(users);
        });
    }, [])


    const filteredUsers = users.filter((user: User) => {
        const p = phrase.toLowerCase()
        return (
            user.username.toLowerCase().includes(p) ||
            user.email.toLowerCase().includes(p) ||
            (user.bio && user.bio.toLowerCase().includes(p))
        )
    });

    const isLoading = false;

    return (
        <section className="md:max-w-5xl min-h-screen max-w-xl mx-auto mt-20 bg-background rounded-t-xl px-5 md:px-20">
            <div className="space-y-4">
                <h1 className="md:text-4xl text-2xl font-extrabold">Explore new people</h1>
                <p className="text-muted-foreground">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse in earum nam ad commodi quod beatae sit voluptatibus dicta id quis itaque, reiciendis hic maiores blanditiis, rerum maxime iusto nemo!</p>
            </div>

            <div className="mt-3 flex gap-2">
                <Input
                    type="text"
                    placeholder="Find new people..."
                    onChange={(e) => setPhrase(e.target.value)}
                    value={phrase}
                />
                <Button variant="outline">
                    <Search />
                </Button>
            </div>

            {isLoading ? (
                <>
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                    <UserRowSkeleton />
                </>
            ) : (
                filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserRow user={user} key={`${user.id}-${user.email}`} />
                    ))
                ) : (
                    <div className="mt-8 text-center text-muted-foreground">
                        No users found matching your search
                    </div>
                )
            )}
        </section>
    );
}