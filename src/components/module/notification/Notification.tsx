"use client";

import { useEffect, useState } from "react";
import { Bell, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getUserNotificationsAction } from "@/actions/notification";
import { updateInvitationStatusAction } from "@/actions/invitation.actions";
import { toast } from "react-toastify";

import { TNotification } from "@/types/notification.type";
import { IBaseUser } from "@/types/user.types";
import { IBaseEvent } from "@/types/event.types";
import { TInvitation } from "@/types/invitation.types";
import { createParticipant } from "@/actions/participant.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TNotif = TNotification<{
  user: IBaseUser;
  event: IBaseEvent;
  invitation: TInvitation;
}>;

export function NavbarNotifications() {
  const [notifications, setNotifications] = useState<TNotif[]>([]);
  const [responding, setResponding] = useState<string | null>(null);
  const router = useRouter();

  // Fetch notifications function
  const fetchNotifications = async () => {
    try {
      const res = await getUserNotificationsAction();
      const safeData = Array.isArray(res?.data) ? res.data : [];
      setNotifications(
        safeData.filter(
          (n): n is TNotif =>
            !!n &&
            typeof n === "object" &&
            (n as any).invitation !== undefined
        )
      );
    } catch (err) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle invitation status actions
  const handleNotificationAction = async ({
    id,
    status,
  }: {
    id: string;
    status: "ACCEPTED" | "DECLINED";
  }) => {
    setResponding(id);
    const loadingToastId = toast.loading("Updating invitation status...");
    try {
      const res = await updateInvitationStatusAction({ id, status });
      toast.dismiss(loadingToastId);
      await fetchNotifications();
      if (res?.success) {
        toast.success(
          res?.message || "Invitation status updated successfully.",
          { autoClose: 4000 }
        );
      } else {
        toast.error(res?.message || "Failed to update invitation status.", {
          autoClose: 4000,
        });
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(error?.message || "An unexpected error occurred.");
    } finally {
      setResponding(null);
    }
  };

  // Handle paid event registration
  const handleAddParticipant = async (
    eventId: string,
    invitationId: string
  ) => {
    const toastId = toast.loading("Registering attendance...");
    try {
      const res = await createParticipant(eventId);
      if (res.success) {
        await handleNotificationAction({
          id: invitationId,
          status: "ACCEPTED",
        });
        toast.dismiss(toastId);
        toast.success("You have been added as a participant!");
        if (res.data?.paymentUrl) {
          router.push(res.data.paymentUrl);
        } else {
          router.push(`/events/${eventId}`);
        }
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Failed to add participant.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to add participant.");
      console.error(err);
    }
  };

  const count = notifications?.length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative outline-none rounded-full transition focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          width: 40, height: 40, // Responsive sizing w/ min requirements
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Open notifications"
      >
        <span className="relative flex items-center justify-center w-14 h-7">
          <Bell
            size={20}
            strokeWidth={2.1}
            style={{
              color: "var(--muted-foreground)",
              transition: "color 0.18s",
            }}
            className="group-hover:text-[var(--accent)]"
            aria-label="Notifications"
          />
          {count > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 text-xs font-bold rounded-full shadow"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                border: "2px solid var(--card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                zIndex: 10,
              }}
              aria-label={`You have ${count} unread notifications`}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] max-h-[875px] rounded-xl shadow-2xl border p-0 overflow-hidden"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--card-foreground)",
        }}
        align="end"
      >
        <div
          className="px-4 py-3 border-b text-sm font-semibold sticky top-0 z-10"
          style={{
            borderColor: "var(--border)",
            background: "var(--card)",
            color: "var(--card-foreground)",
          }}
        >
          Notifications
        </div>

        <div className="max-h-[290px] overflow-y-auto px-0">
          {count === 0 ? (
            <div className="py-10 flex flex-col gap-2 items-center justify-center text-center">
              <Bell
                size={28}
                style={{
                  color: "var(--muted-foreground)",
                  marginBottom: 4,
                }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-normal"
                style={{ color: "var(--muted-foreground)" }}
              >
                No new notifications
              </span>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {notifications.map((n) => {
                const user = (n as any).user as IBaseUser | undefined;
                const event = (n as any).invitation.event as
                  | IBaseEvent
                  | undefined;
                const invitation = (n as any).invitation as
                  | TInvitation
                  | undefined;

                return (
                  <li
                    key={n.id}
                    className="
                      flex gap-3 py-3 px-4 items-start rounded-lg 
                      transition hover:bg-[var(--accent)]/[0.10] cursor-pointer
                    "
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      {user?.image ? (
                        // Avatar w/ fallback
                        <img
                          src={user.image}
                          className="w-9 h-9 rounded-full object-cover border"
                          style={{
                            background: "var(--muted)",
                            borderColor: "var(--border)",
                          }}
                          alt={user?.name || "User avatar"}
                        />
                      ) : (
                        <UserCircle
                          className="w-8 h-8"
                          style={{
                            color: "var(--muted-foreground)",
                          }}
                          aria-label="User avatar"
                        />
                      )}
                    </div>

                    <div className="flex-1 text-sm min-w-0">
                      <div className="flex flex-wrap items-center gap-x-1.5 font-medium mb-0.5">
                        <span style={{ color: "var(--foreground)" }}>
                          {user?.name || "Someone"}
                        </span>
                        <span
                          className="inline-block mx-1 text-xs font-normal"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          invited you to
                        </span>
                        {event?.id && (
                          <Link
                            href={`/events/${event.id}`}
                            className="underline underline-offset-2"
                            style={{
                              color: "var(--primary)",
                              transition: "color 0.18s",
                            }}
                            tabIndex={0}
                          >
                            {event?.title ? event.title : "event"}
                          </Link>
                        )}
                      </div>

                      <div
                        className="text-xs leading-[1.5] mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {n.message}
                      </div>

                      {event?.priceType === "PAID" ? (
                        <Button
                          size="sm"
                          
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            width: "auto",
                            minWidth: 100,
                            marginTop: 4,
                            fontWeight: 600,
                          }}
                          disabled={responding === invitation?.id}
                          onClick={() =>
                            handleAddParticipant(
                              event.id,
                              invitation?.id as string
                            )
                          }
                        >
                          Pay & Accept
                        </Button>
                      ) : (
                        invitation?.status === "PENDING" && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                            
                              style={{
                                background: "var(--primary)",
                                color: "var(--primary-foreground)",
                                fontWeight: 600,
                              }}
                              disabled={responding === invitation?.id}
                              onClick={() =>
                                handleNotificationAction({
                                  id: invitation.id,
                                  status: "ACCEPTED",
                                })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              style={{
                                background: "transparent",
                                color: "var(--muted-foreground)",
                                border: "1px solid var(--border)",
                                fontWeight: 600,
                              }}
                              disabled={responding === invitation?.id}
                              onClick={() =>
                                handleNotificationAction({
                                  id: invitation.id,
                                  status: "DECLINED",
                                })
                              }
                            >
                              Decline
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}