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
import { useParams, useRouter } from "next/navigation";
import { useStatus } from "@/context/status-context";
import { ParamValue } from "next/dist/server/request/params";
import { useChat } from "@/context/chat-context";


export default function Profile() {
  const { ID } = useParams();
  const router = useRouter();
  const { isLoading, fetchByID, currUserProfile } = useProfile();
  const { fetchStatus, isConnected } = useStatus();
  const [isMe, setIsMe] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { initConversation } = useChat();

  const fetchData = (ID: ParamValue) => {
    if (!ID) {
      setIsError(true);
      return;
    }

    fetchByID(ID.toString()).then((user) => {
      if (user) {
        setUser(user);
        if (user?.id) {
          fetchStatus(user.id).then((v) => {
            console.log("[status] fetched for user:", user.id, v?.isOnline);
            setStatus(v?.isOnline ?? false);
          }).catch((e) => {
            console.error("Status fetch error:", e);
            setStatus(false);
          });
        }
      } else {
        setIsError(true);
      }
    });
  };



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
    if (!currUserProfile) {
      fetchData(ID);
    }
  }, [ID, currUserProfile, fetchByID]);

  if (isError) {
    return <NotFound404 />
  }

  const handleNewConv = () => {
    if (user && currUserProfile) {
      initConversation(currUserProfile, user);
      router.push(`/messages`)
    }
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
        <UserAvatar user={user} isOnline={isMe ? isConnected : status} isLoading={isLoading || !user} />
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

        <ActionButtons user={user} isMe={isMe} isLoading={isLoading || !user} handleNewConversation={handleNewConv} />
      </div>
    </motion.div>
  );
}
