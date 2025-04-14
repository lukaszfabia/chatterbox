"use client";

import { User } from "@/lib/dto/user";
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
import { useStatus } from "@/context/status-context";


export default function Profile() {
  const { ID } = useParams();
  const { isLoading, fetchByID, currUserProfile } = useProfile();
  const { fetchStatus, isConnected } = useStatus();
  const [isMe, setIsMe] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!ID) {
      setIsError(true);
      return;
    }

    if (currUserProfile && ID === currUserProfile.id) {
      setIsMe(true);
      setUser(currUserProfile);
    } else {
      setIsMe(false);
      fetchByID(ID.toString()).then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          setIsError(true);
        }
      }).catch(() => {
        setIsError(true);
      });
    }
  }, [ID, currUserProfile]);

  useEffect(() => {
    if (ID) {
      fetchStatus(ID.toString()).then((v) => {
        setStatus(v?.isOnline ?? false);
      }).catch(() => {
        setStatus(false);
      });
    }
  }, [ID]);

  if (isError) {
    return <NotFound404 />
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
        <UserAvatar user={user} isOnline={status} isLoading={isLoading || !user} />
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

        <ActionButtons user={user} isMe={isMe} isLoading={isLoading || !user} currentProfile={currUserProfile} />
      </div>
    </motion.div>
  );
}
