"use client";

import { Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ShareProfileButtonProps {
  userId: string;
  userName: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ["easeOut"] as any } }, 
};

export default function ShareProfileButton({
  userId,
  userName,
}: ShareProfileButtonProps) {
  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${userName}'s Profile`,
          text: `Check out ${userName}'s profile`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard", {
          theme: "colored",
          autoClose: 2000,
        });
      }
    } catch {
      toast.error("Something went wrong while sharing", {
        theme: "colored",
        autoClose: 2000,
      });
    }
  };

  return (
    <motion.div
      {...fadeIn}
      className="w-full flex justify-end mb-2 mt-2 ml-2"
    >
      <Button
        type="button"
        variant="default"
        size="sm"
        className={`
          flex items-center gap-2
          rounded-lg
          px-5 py-2.5
          font-semibold
          transition-all
          bg-primary text-primary-foreground
          hover:bg-accent hover:text-accent-foreground
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          shadow-md hover:shadow-lg
          active:scale-95
        `}
        aria-label={`Share ${userName}'s Profile`}
        onClick={handleShare}
      >
        <Share2 size={18} className="stroke-current" />
        <span className="text-sm md:text-base font-medium">Share Profile</span>
      </Button>
    </motion.div>
  );
}