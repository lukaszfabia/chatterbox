"use client";

import { GetDummyUser, User } from "@/lib/models/user";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BioSection from "@/components/profile/bio";
import ActionButtons from "@/components/profile/buttons";
import WhoAmI from "@/components/profile/whoami";
import UserAvatar from "../../../components/profile/avatar";
import Cover from "../../../components/profile/cover";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const isOnline = true;
  const isMe = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(GetDummyUser());
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="md:max-w-2xl min-h-screen sm:max-w-xl max-w-lg mx-auto mt-20 bg-background rounded-t-xl border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Cover url={user?.backgroundURL} isLoading={isLoading} />
        <UserAvatar user={user} isOnline={isOnline} isLoading={isLoading} />
      </div>

      <div className="px-4 pt-16 pb-8">
        <WhoAmI
          firstName={user?.firstName}
          lastName={user?.lastName}
          username={user?.username || ''}
          isLoading={isLoading}
        />

        <BioSection
          createdAt={user?.createdAt}
          bio={user?.bio}
          isLoading={isLoading}
        />

        <ActionButtons isMe={isMe} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}