"use client";

import { IBaseUser, TUpdateUserInput } from "@/types/user.types";
import { updateUserSchema } from "@/validations/user.validation";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import InfoRow from "../../shared/InfoRow";
import { Status, StatusIndicator, StatusLabel } from "../../ui/status";
import { deleteuserown, updateUserProfileAction } from "@/actions/user.actions";
import ShareProfileButton from "./profileshare";
import VerifyOtp from "@/components/auth/VerifyEmailOtp";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TNotification } from "@/types/notification.type";
import { IBaseEvent } from "@/types/event.types";

const fadeUpAnim = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.3, ease: "easeOut" },
};

function ProfileModal({
  user,
}: {
  user: IBaseUser;
}) {
  const router = useRouter();
  const [useinfo, setuserinfo] = useState<IBaseUser>({ ...user });
  const [isEmailverify, setisEmailverify] = useState(false);
  const [inputvalue, setinputvalue] = useState<Partial<TUpdateUserInput>>({});
  const [editfield, seteditfield] = useState<
    string | boolean | "bgimage" | "name" | "phone" | "isActive" | "image"
  >("");
  if (!user) {
    toast("user not found", { autoClose: 2000, theme: "colored" });
    router.push("/");
  }
  const defaultProfile =
    "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg";
    
  const handleUpdateUser = async <k extends keyof IBaseUser>(
    field: k,
    value: IBaseUser[k],
  ) => {
    if (value == null) {
      toast.error("Please provide a value", {
        theme: "colored",
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    const parseData = updateUserSchema.safeParse({ [field]: value });
    if (!parseData.success) {
      const errors = parseData.error.flatten().fieldErrors;
      Object.values(errors).forEach((err) => {
        if (err) {
          toast.error(err[1], {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      });
      return;
    }
    try {
      const toastid = toast.loading(`Updating user ${field}...`, {
        theme: "dark",
        position: "bottom-right",
        autoClose: 2000,
      });
      const res = await updateUserProfileAction({ [field]: value });
      toast.dismiss(toastid);
      if (res.error || !res.success) {
        toast.error(res.message || `User ${field} update failed`, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }
      toast.success(
        res.result?.message || `User ${field} updated successfully`,
        {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        },
      );
      setuserinfo((prev) => ({ ...prev, [field]: value }));
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  const handleDelete = async () => {
    const toastid = toast.loading("Deleting user account...");
    const res = await deleteuserown();
    toast.dismiss(toastid);
    if (res.error) {
      toast.error(res.message || "User account delete failed");
      return;
    }
    toast.success(res.result?.message || "User account deleted successfully");
    router.refresh();
    window.location.reload();
  };

  // Helper for status
  function UserStatusBadge() {
    const status = user.status;
    let text = "Unknown";
    let statusClass = "bg-muted text-muted-foreground";
    if (status === "ACTIVE") {
      text = "Active";
      statusClass = "bg-primary text-primary-foreground";
    } else if (status === "BLOCKED") {
      text = "Blocked";
      statusClass = "bg-secondary text-secondary-foreground";
    } else if (status === "DELETED") {
      text = "Deleted";
      statusClass = "bg-accent text-accent-foreground";
    }
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass} transition`}
      >
        {text}
        <span className="ml-2 text-muted-foreground">{user.status}</span>
      </span>
    );
  }

  return (
    <motion.section
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8 flex flex-col items-center"
      initial={fadeUpAnim.initial}
      animate={fadeUpAnim.animate}
      exit={fadeUpAnim.exit}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.4,
      }}
    >
      <div className="w-full max-w-2xl mx-auto bg-card shadow-lg rounded-2xl border border-border flex flex-col divide-y divide-border">

        {/* Profile header section */}
        <div
          className="relative flex flex-col md:flex-row gap-6 items-center justify-between p-6 border-b border-border bg-cover bg-center rounded-t-2xl"
          style={{ backgroundImage: useinfo.bgimage ? `url(${useinfo.bgimage})` : "none" }}
        >
          <div className="flex flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative">
              <Image
                src={useinfo.image || defaultProfile}
                alt="Profile photo"
                width={96}
                height={96}
                className="rounded-full border-4 border-background shadow-md object-cover w-24 h-24"
                priority
              />
              <AnimatePresence>
                {editfield !== "image" && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => seteditfield("image")}
                    className="absolute -bottom-2 -right-2 bg-card border border-border rounded-full shadow hover:bg-accent hover:text-accent-foreground focus:outline-none p-1 transition"
                    aria-label="Edit profile image"
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {editfield === "image" && (
                  <motion.div
                    initial={fadeUpAnim.initial}
                    animate={fadeUpAnim.animate}
                    exit={fadeUpAnim.exit}
                    
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-30 bg-card shadow-lg border border-border rounded-xl px-4 py-3 flex flex-col gap-2"
                  >
                    <Input
                      className="w-48 focus:ring-2 ring-primary focus:border-primary placeholder:text-muted-foreground"
                      onChange={(e) =>
                        setinputvalue({ ...inputvalue, image: e.target.value })
                      }
                      placeholder="Image URL"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="text-sm font-medium px-3 py-1 rounded bg-background border border-border hover:bg-secondary transition"
                        onClick={() => seteditfield("")}
                      >
                        Cancel
                      </button>
                      <button
                        className="text-sm font-medium px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                        onClick={() => {
                          handleUpdateUser("image", inputvalue.image as string);
                          seteditfield("");
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground font-medium text-base sm:text-lg">Name</Label>
                  {editfield !== "name" && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.97 }}
                      className="p-1 rounded hover:bg-accent transition"
                      onClick={() => seteditfield("name")}
                      aria-label="Edit name"
                    >
                      <Pencil className="w-4 h-4 text-secondary" />
                    </motion.button>
                  )}
                </div>
                {editfield !== "name" ? (
                  <p className="text-card-foreground font-semibold text-lg">{useinfo?.name}</p>
                ) : (
                  <motion.div
                    initial={fadeUpAnim.initial}
                    animate={fadeUpAnim.animate}
                    exit={fadeUpAnim.exit}
                   
                    className="flex gap-2 items-center"
                  >
                    <Input
                      onChange={(e) =>
                        setinputvalue({ ...inputvalue, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="w-40 focus:ring-2 ring-primary focus:border-primary placeholder:text-muted-foreground"
                    />
                    <button
                      className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                      onClick={() => {
                        handleUpdateUser("name", inputvalue.name as string);
                        seteditfield("");
                      }}
                    >
                      Save
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          {/* BG Image edit */}
          <div className="flex flex-col items-end w-full md:w-auto">
            {editfield !== "bgimage" ? (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => seteditfield("bgimage")}
                className="p-2 rounded hover:bg-accent ml-auto transition"
                aria-label="Edit background image"
              >
                <Pencil className="w-4 h-4 text-secondary" />
              </motion.button>
            ) : (
              <motion.div
                initial={fadeUpAnim.initial}
                animate={fadeUpAnim.animate}
                exit={fadeUpAnim.exit}
            
                className="flex gap-2 items-center bg-card px-2 py-2 border border-border rounded"
              >
                <Input
                  className="focus:ring-2 ring-primary placeholder:text-muted-foreground"
                  onChange={(e) =>
                    setinputvalue({ ...inputvalue, bgimage: e.target.value })
                  }
                  placeholder="Background image URL"
                />
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  onClick={() => {
                    handleUpdateUser("bgimage", inputvalue.bgimage as string);
                    seteditfield("");
                  }}
                >
                  Save
                </button>
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-background border border-border hover:bg-secondary transition"
                  onClick={() => seteditfield("")}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-card p-6 flex flex-col gap-6">
          {/* Email */}
          <InfoRow label="Email Address" value={user.email} />

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Label className="text-foreground">Phone</Label>
              {editfield !== "phone" && (
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-1 rounded hover:bg-accent transition"
                  onClick={() => seteditfield("phone")}
                  aria-label="Edit phone"
                >
                  <Pencil className="w-4 h-4 text-secondary" />
                </motion.button>
              )}
            </div>
            {editfield !== "phone" ? (
              <p className="text-card-foreground">{useinfo?.phone || "017********"}</p>
            ) : (
              <motion.div
                initial={fadeUpAnim.initial}
                animate={fadeUpAnim.animate}
                exit={fadeUpAnim.exit}
                
                className="flex gap-2 items-center"
              >
                <Input
                  onChange={(e) =>
                    setinputvalue({ ...inputvalue, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  className="w-44 focus:ring-2 ring-primary focus:border-primary placeholder:text-muted-foreground"
                />
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  onClick={() => {
                    handleUpdateUser("phone", inputvalue.phone as string);
                    seteditfield("");
                  }}
                >
                  Save
                </button>
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-background border border-border hover:bg-secondary transition"
                  onClick={() => seteditfield("")}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>

          <InfoRow label="Role" value={user.role as string} />

          {/* Status */}
          <div className="flex flex-col gap-1">
            <Label className="text-foreground">Status</Label>
            <UserStatusBadge />
          </div>

          {/* Email Verified */}
          <div className="flex flex-col gap-1">
            <Label className="text-foreground">Email Verified</Label>
            <div>
              {user.emailVerified ? (
                <Status variant="success">
                  <StatusIndicator />
                  <StatusLabel className="text-foreground">Yes</StatusLabel>
                </Status>
              ) : (
                <Status variant="error">
                  <StatusIndicator />
                  <StatusLabel className="text-foreground">No</StatusLabel>
                </Status>
              )}
            </div>
          </div>

          {/* isActive */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Label className="text-foreground">Active Status</Label>
              {editfield !== "isActive" && (
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-1 rounded hover:bg-accent transition"
                  onClick={() => seteditfield("isActive")}
                  aria-label="Edit active status"
                >
                  <Pencil className="w-4 h-4 text-secondary" />
                </motion.button>
              )}
            </div>
            {editfield !== "isActive" ? (
              <div>
                {useinfo.isActive ? (
                  <Status variant="success">
                    <StatusIndicator />
                    <StatusLabel className="text-foreground">Online</StatusLabel>
                  </Status>
                ) : (
                  <Status variant="error">
                    <StatusIndicator />
                    <StatusLabel className="text-foreground">Offline</StatusLabel>
                  </Status>
                )}
              </div>
            ) : (
              <motion.div
                initial={fadeUpAnim.initial}
                animate={fadeUpAnim.animate}
                exit={fadeUpAnim.exit}
               
                className="flex gap-2 items-center"
              >
                <Input
                  type="checkbox"
                  checked={typeof inputvalue.isActive === "boolean" ? inputvalue.isActive : useinfo.isActive}
                  onChange={(e) =>
                    setinputvalue((prev: any) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-6 h-6 accent-primary focus:ring-2 ring-primary"
                />
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  onClick={() => {
                    handleUpdateUser("isActive", inputvalue.isActive as boolean);
                    seteditfield("");
                  }}
                >
                  Save
                </button>
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-background border border-border hover:bg-secondary transition"
                  onClick={() => seteditfield("")}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>

          <InfoRow
            label="Created At"
            value={user.createdAt.toLocaleString().slice(0, 10)}
          />

          {/* Profile share */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Profile</h2>
            <ShareProfileButton userId={user.id} userName={user.name} />
          </div>

          {/* Account actions */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Account</h2>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-md shadow focus:outline-none bg-accent text-accent-foreground border border-[#eb5757] hover:bg-accent/80 transition"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </motion.button>
          </div>
        </div>
        {/* Email verification modal or action */}
        <AnimatePresence>
          {isEmailverify ? (
            <motion.div
              key="verify"
              initial={fadeUpAnim.initial}
              animate={fadeUpAnim.animate}
              exit={{ opacity: 0, y: 60, transition: { duration: 0.2 } }}
              
              className="p-6 bg-card rounded-b-2xl w-full"
            >
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={() => setisEmailverify(false)}
                  className="text-sm px-4 py-2 rounded hover:bg-muted transition text-muted-foreground"
                >
                  Close
                </button>
                <span className="text-sm text-muted-foreground font-medium">
                  Email Verification
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <VerifyOtp email={user.email} type="email-verification" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="trigger"
              initial={fadeUpAnim.initial}
              animate={fadeUpAnim.animate}
              exit={fadeUpAnim.exit}
              
              className="flex items-center justify-between px-6 py-4"
            >
              <Label className="text-sm sm:text-base text-foreground">
                Email verification pending?
              </Label>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-accent focus:outline-none transition"
                onClick={() => setisEmailverify(true)}
                aria-label="Start email verification"
              >
                <Send className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default ProfileModal;
