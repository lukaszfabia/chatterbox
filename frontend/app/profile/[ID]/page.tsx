"use client";

import { User } from "@/lib/models/user";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BioSection from "@/components/profile/bio";
import ActionButtons from "@/components/profile/buttons";
import WhoAmI from "@/components/profile/whoami";
import UserAvatar from "../../../components/profile/avatar";
import Cover from "../../../components/profile/cover";
import { useProfile } from "@/context/profile-context";
import NotFound404 from "@/app/not-found";
import { useParams } from "next/navigation";

export default function Profile() {
  const { ID } = useParams();
  const { isLoading, error, fetchByID, currUserProfile } = useProfile();
  const isOnline = true;
  const [isMe, setIsMe] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currUserProfile) {
      setIsMe(ID === currUserProfile.id);
    } else {
      setIsMe(false);
    }
  }, [currUserProfile])

  useEffect(() => {
    // case when auth and handle when he goes on his profile and other profile
    if (ID && currUserProfile) {
      if (ID === currUserProfile.id) {
        setUser(currUserProfile);
      } else {
        fetchByID(ID.toString()).then((user) => {
          setUser(user);
        });
      }
    }
    // case when anon goes on the site and search with url bar 
    if (ID && !currUserProfile) {
      fetchByID(ID.toString()).then((user) => {
        setUser(user);
      });
    }
  }, [ID, currUserProfile, fetchByID]);

  if (error) {
    return <NotFound404 />;
  }

  return (
    <motion.div
      className="md:max-w-2xl min-h-screen sm:max-w-xl max-w-lg mx-auto mt-20 bg-background rounded-t-xl border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Cover url={user?.backgroundURL} isLoading={isLoading || !user} />
        <UserAvatar user={user} isOnline={isOnline} isLoading={isLoading || !user} />
      </div>

      <div className="px-4 pt-16 pb-8">
        <WhoAmI
          firstName={user?.firstName}
          lastName={user?.lastName}
          username={user?.username || ''}
          isLoading={isLoading || !user}
        />

        <BioSection
          createdAt={user?.createdAt}
          bio={user?.bio}
          isLoading={isLoading || !user}
        />

        <ActionButtons userID={user?.id} isMe={isMe} isLoading={isLoading || !user} />
      </div>
    </motion.div>
  );
}
