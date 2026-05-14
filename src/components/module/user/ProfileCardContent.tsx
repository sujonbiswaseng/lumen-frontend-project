"use client";

import { IBaseUser, TUpdateUserInput } from "@/types/user.types";
import { updateUserSchema } from "@/validations/user.validation";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Status, StatusIndicator, StatusLabel } from "../../ui/status";
import { deleteuserown, updateUserProfileAction } from "@/actions/user.actions";
import ShareProfileButton from "./profileshare";
import VerifyOtp from "@/components/auth/VerifyEmailOtp";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UserStatus } from "@/types/user.types";
import InfoRow from "@/components/shared/InfoRow";

function formatUserDate(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const fadeUpAnim = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.3, ease: "easeOut" },
};

function ProfileModal({ user }: { user: IBaseUser }) {
  const router = useRouter();
  const [useinfo, setuserinfo] = useState<IBaseUser>({ ...user });
  const [isEmailverify, setisEmailverify] = useState(false);
  const [inputvalue, setinputvalue] = useState<Partial<Record<string, unknown>>>({});
  const [editfield, seteditfield] = useState<
    string | boolean | "bgimage" | "name" | "phone" | "isActive" | "image"
  >("");

  useEffect(() => {
    setuserinfo({ ...user });
  }, [user]);

  useEffect(() => {
    if (!user) {
      toast("user not found", { autoClose: 2000, theme: "colored" });
      router.push("/");
    }
  }, []); 

  const defaultProfile =
    "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg";

  const handleUpdateUser = async <K extends keyof TUpdateUserInput>(
    field: K,
    value: TUpdateUserInput[K],
  ) => {
    if (value == null) {
      toast.error("Please provide a value", {
        theme: "colored",
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    if (typeof value === "string" && value.trim() === "") {
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
      for (const msgs of Object.values(errors)) {
        if (msgs?.length) {
          toast.error(msgs[0], {
            position: "bottom-right",
            autoClose: 2500,
          });
        }
      }
      return;
    }
    const payload: Partial<TUpdateUserInput> = parseData.data;
    try {
      const toastid = toast.loading(`Updating user ${String(field)}...`, {
        theme: "dark",
        position: "bottom-right",
        autoClose: 2000,
      });
      const res = await updateUserProfileAction(payload);
      toast.dismiss(toastid);
      if (res.error || !res.success) {
        toast.error(res.message || `User ${String(field)} update failed`, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }
      toast.success(
        res.result?.message || `User ${String(field)} updated successfully`,
        {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        },
      );
      setuserinfo((prev) => {
        const next = { ...prev };
        if (payload.name !== undefined) next.name = payload.name as string;
        if (payload.phone !== undefined) next.phone = payload.phone as string;
        if (payload.image !== undefined) next.image = payload.image as string | null;
        if (payload.bgimage !== undefined) next.bgimage = payload.bgimage as string;
        if (payload.email !== undefined) next.email = payload.email as string;
        if (payload.isActive !== undefined) next.isActive = payload.isActive;
        return next;
      });
      router.refresh();
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

  // Status badge uses only allowed global classes
  function UserStatusBadge({ status }: { status: UserStatus | string }) {
    const key = String(status ?? "");
    const variants: Record<
      string,
      { label: string; className: string }
    > = {
      [UserStatus.ACTIVE]: {
        label: "Active",
        className: "border border-transparent bg-primary text-primary-foreground",
      },
      [UserStatus.INACTIVE]: {
        label: "Inactive",
        className: "border border-border bg-muted text-muted-foreground",
      },
      [UserStatus.BLOCKED]: {
        label: "Blocked",
        className: "border border-transparent bg-secondary text-secondary-foreground",
      },
      [UserStatus.DELETED]: {
        label: "Deleted",
        className: "border border-transparent bg-accent text-accent-foreground",
      },
    };
    const row = variants[key] ?? {
      label: key || "Unknown",
      className: "border border-border bg-muted text-muted-foreground",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition ${row.className}`}
      >
        {row.label}
      </span>
    );
  }

  return (
    <motion.section
      className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-4 sm:px-8 py-8"
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
      <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-lg flex flex-col divide-y divide-border">
        {/* Profile header */}
        <div
          className="relative flex flex-col md:flex-row gap-8 items-center justify-between p-6 border-b border-border bg-cover bg-center rounded-t-2xl"
          style={useinfo.bgimage ? { backgroundImage: `url(${useinfo.bgimage})` } : {}}
        >
          <div className="flex flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative">
              <Image
                src={useinfo.image || defaultProfile}
                alt="Profile photo"
                width={96}
                height={96}
                className="rounded-full border-4 border-background shadow object-cover w-24 h-24"
                priority
              />
              <AnimatePresence>
                {editfield !== "image" && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => seteditfield("image")}
                    className="absolute -bottom-2 -right-2 bg-card border border-border rounded-full shadow hover:bg-accent hover:text-accent-foreground focus:outline-none p-1"
                    aria-label="Edit profile image"
                    type="button"
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
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-30 bg-card border border-border rounded-xl px-4 py-3 shadow flex flex-col gap-2"
                  >
                    <Input
                      className="w-48 focus-visible:ring-2 ring-primary focus-visible:border-primary placeholder:text-muted-foreground"
                      onChange={(e) =>
                        setinputvalue({ ...inputvalue, image: e.target.value })
                      }
                      placeholder="Image URL"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="text-sm font-medium px-3 py-1 rounded bg-background border border-border hover:bg-secondary hover:text-secondary-foreground transition"
                        onClick={() => seteditfield("")}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="text-sm font-medium px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                        onClick={() => {
                          handleUpdateUser("image", inputvalue.image as string);
                          seteditfield("");
                        }}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground font-medium text-base sm:text-lg">Name</Label>
                {editfield !== "name" && (
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-1 rounded hover:bg-accent transition"
                    onClick={() => seteditfield("name")}
                    aria-label="Edit name"
                    type="button"
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
                    className="w-40 focus-visible:ring-2 ring-primary focus-visible:border-primary placeholder:text-muted-foreground"
                  />
                  <button
                    className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    onClick={() => {
                      handleUpdateUser("name", inputvalue.name as string);
                      seteditfield("");
                    }}
                    type="button"
                  >
                    Save
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          {/* Background image edit */}
          <div className="flex flex-col items-end w-full md:w-auto">
            {editfield !== "bgimage" ? (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => seteditfield("bgimage")}
                className="p-2 rounded hover:bg-accent ml-auto transition"
                aria-label="Edit background image"
                type="button"
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
                  className="focus-visible:ring-2 ring-primary placeholder:text-muted-foreground"
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
                  type="button"
                >
                  Save
                </button>
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-background border border-border hover:bg-secondary hover:text-secondary-foreground transition"
                  onClick={() => seteditfield("")}
                  type="button"
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
          <InfoRow label="Email Address" value={useinfo.email} />

          {/* Phone */}
          <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground font-medium text-base sm:text-lg">phone</Label>
                {editfield !== "phone" && (
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-1 rounded hover:bg-accent transition"
                    onClick={() => seteditfield("phone")}
                    aria-label="Edit phone"
                    type="button"
                  >
                    <Pencil className="w-4 h-4 text-secondary" />
                  </motion.button>
                )}
              </div>
              {editfield !== "phone" ? (
                <p className="text-card-foreground font-semibold text-lg">{useinfo?.phone}</p>
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
                    className="w-40 focus-visible:ring-2 ring-primary focus-visible:border-primary placeholder:text-muted-foreground"
                  />
                  <button
                    className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    onClick={() => {
                      handleUpdateUser("phone", inputvalue.phone as string);
                      seteditfield("");
                    }}
                    type="button"
                  >
                    Save
                  </button>
                </motion.div>
              )}
            </div>

          <InfoRow label="Role" value={String(useinfo.role ?? "")} />

          {/* Status */}
          <div className="flex flex-wrap items-center justify-between gap-1">
            <Label className="text-foreground">Status</Label>
            <UserStatusBadge status={useinfo.status} />
          </div>

          {/* Email Verified */}
          <div className="flex flex-wrap items-center justify-between gap-1">
            <Label className="text-foreground">Email Verified</Label>
            <div>
              {useinfo.emailVerified ? (
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
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Label className="text-foreground">Active Status</Label>
              {editfield !== "isActive" && (
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-1 rounded hover:bg-accent transition"
                  onClick={() => seteditfield("isActive")}
                  aria-label="Edit active status"
                  type="button"
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
                  checked={
                    typeof inputvalue.isActive === "boolean"
                      ? inputvalue.isActive
                      : useinfo.isActive
                  }
                  onChange={(e) =>
                    setinputvalue((prev: any) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-6 h-6 accent-primary focus-visible:ring-2 ring-primary"
                />
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  onClick={() => {
                    handleUpdateUser("isActive", inputvalue.isActive as boolean);
                    seteditfield("");
                  }}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="text-sm font-medium px-2 py-1 rounded bg-background border border-border hover:bg-secondary hover:text-secondary-foreground transition"
                  onClick={() => seteditfield("")}
                  type="button"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>

          <InfoRow label="Created At" value={formatUserDate(useinfo.createdAt)} />

          {/* Profile share */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Profile</h2>
            <ShareProfileButton userId={useinfo.id} userName={useinfo.name} />
          </div>

          {/* Account actions */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Account</h2>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-md shadow focus:outline-none bg-accent text-accent-foreground border border-border hover:bg-accent/80 transition"
              type="button"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </motion.button>
          </div>
        </div>

        {/* Email verification area */}
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
                  type="button"
                >
                  Close
                </button>
                <span className="text-sm text-muted-foreground font-medium">
                  Email Verification
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <VerifyOtp email={useinfo.email} type="email-verification" />
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
                type="button"
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
