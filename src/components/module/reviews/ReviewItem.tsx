"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReviewForm from "./CreateReview";
import { IBaseEvent } from "@/types/event.types";
import { TResponseReviewData } from "@/types/review.types";
import { IBaseUser } from "@/types/user.types";
import { deleteReview, updateReview } from "@/actions/review.actions";
import { toast } from "react-toastify";

interface ReviewItemProps {
  user: IBaseUser;
  review: TResponseReviewData<{ user: IBaseUser; event: IBaseEvent }>;
  event: IBaseEvent;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  depth?: number;
  maxDepth?: number;
}

export default function ReviewItem({
  user,
  review,
  event,
  activeReplyId,
  setActiveReplyId,
  depth = 0,
  maxDepth = 2, // Facebook-style max nested reply
}: ReviewItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Add state and handler for editing the review comment
  const [editComment, setEditComment] = useState(review.comment || "");
  const [editRating, setEditRating] = useState(review.rating || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdate = async () => {
    if (!editComment.trim()) {
      // Prefer better user feedback via toast or alert
      alert("Comment cannot be empty.");
      return;
    }
    setIsUpdating(true);
    try {
      const toastId=toast.loading("review updating...")
      const result = await updateReview(review.id, {
        comment: editComment,
        rating: editRating,
      });
  
      if (result?.success) {
        toast.dismiss(toastId)
        toast.success("review updated successfully")
        setIsEditing(false);
        router.refresh?.();
        return
      } else {
        toast.dismiss(toastId)
        toast.error("review updated failed")
        setIsEditing(false);
        router.refresh?.();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update review");
    } finally {
      setIsUpdating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }
   
    try {
      const toastId=toast.loading("review deleting...")
      const result = await deleteReview(review.id);
      setIsDeleting(true);
      if (result?.success) {
        toast.dismiss(toastId)
        toast.success(result.message || "review message delete successfully")        
        router.refresh?.();
        return
      } else {
        toast.dismiss(toastId)
        toast.error(result.message || "review delete failed")        
        router.refresh?.();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Safe replies
  const replies = review.replies || [];

  const canReply = depth < maxDepth;
  const isOwner = user?.id === review.user?.id;

  return (
    <div
      className={`flex gap-3 mt-3 ${depth > 0 ? "ml-8" : ""} 
      sm:gap-4 sm:mt-4 xs:gap-2 xs:mt-2 xs:flex-col xs:items-start`}
      style={{ alignItems: "flex-start" }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-9 h-9 xs:w-8 xs:h-8 rounded-full overflow-hidden bg-gray-200 relative">
          <Image
            src={review.user?.image || "/default.png"}
            alt={review.user?.name || "User"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        {/* Review Bubble */}
        <div
          className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl min-w-0 w-full
          sm:px-4 sm:py-2 xs:px-2 xs:py-1"
        >
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <span className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
              {review.user?.name || "User"}
            </span>
            {review.rating && (
              <span className="text-orange-500 text-xs sm:text-sm font-medium ml-1">
                {review.rating.toFixed(1)}
              </span>
            )}
          </div>
          {isEditing ? (
            <div>
              <input
                className="mt-0 w-full text-xs sm:text-sm px-2 py-1 border rounded"
                value={editComment}
                onChange={(e) => {
                  setEditComment(e.target.value);
                }}
              />
              <button onClick={() => handleUpdate()}>save</button>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-200 mt-0 text-xs sm:text-sm break-words">
              {review.comment}
            </p>
          )}
        </div>

        {/* Actions like Facebook style: small, subtle, row, spaced out, on the side (bottom left of bubble) */}
        <div className="flex gap-3 mt-1 pl-1 xs:gap-2 xs:mt-0.5 xs:pl-0 flex-wrap">
          {canReply && (
            <button
              className="text-[11px] sm:text-xs text-blue-500 font-semibold hover:underline focus:outline-none"
              style={{ fontSize: "10.5px" }}
              onClick={() =>
                setActiveReplyId(activeReplyId === review.id ? null : review.id)
              }
            >
              Reply
            </button>
          )}
          {isOwner && (
            <>
              <button
                className="text-[11px] sm:text-xs text-gray-500 font-semibold hover:underline focus:outline-none"
                style={{ fontSize: "10.5px" }}
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                Edit
              </button>
              {/* Delete button can go here if needed */}

              <button
                className="text-[11px] sm:text-xs text-gray-500 font-semibold hover:underline focus:outline-none"
                style={{ fontSize: "10.5px" }}
                onClick={() => {
                  handleDelete()
                }}
              >
                {isDeleting?"ddelete...":"delete"}
              </button>
            </>
          )}
        </div>

        {/* Reply Form */}
        {activeReplyId === review.id && (
          <div className="mt-1 xs:mt-0.5 w-full">
            <ReviewForm parentId={review.id} eventId={event.id} />
          </div>
        )}

        {/* Nested Replies */}
        {replies.length > 0 && (
          <div className="ml-6 pl-4 border-l border-gray-200 dark:border-gray-700 xs:ml-2 xs:pl-2">
            {replies.map((reply) => (
              <ReviewItem
                key={reply.id}
                user={user}
                review={reply as any}
                event={event}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
