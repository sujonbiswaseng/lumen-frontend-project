'use client'
import Image from "next/image";
import { Status, StatusIndicator, StatusLabel } from "./ui/status";
import { IBaseUser } from "@/types/user.types";
import InfoRow from "./infoRow";
import ShareProfileButton from "./module/user/profileshare";
function SingleProfile({user}:{user:IBaseUser}) {
  const singleuser =user as IBaseUser
  const defaultProfile = 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg';

  if (!user) return <p className="text-center p-4">User not found</p>;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <div
        className="relative h-48 w-full flex items-end p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${singleuser.bgimage || defaultProfile})` }}
      >
        <div className="flex items-end" style={{ minHeight: 180 }}>
          <Image
            src={singleuser.image || defaultProfile}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full border-2 border-white shadow-lg"
            style={{ minHeight: 100, minWidth: 100, objectFit: 'cover' }}
          />
        </div>
  
      </div>

      {/* Details */}
      <div className="divide-y">
        <div className="flex justify-between items-center px-6 py-2">
          <label className="text-sm text-gray-600 font-semibold">Name</label>
          <p className="text-gray-900">{singleuser.name}</p>
        </div>

        <InfoRow label="Email" value={singleuser.email} />

        <div className="flex justify-between items-center px-6 py-2">
              <label className="text-sm text-gray-600 font-semibold">phone</label>
          <p className="text-gray-900">{singleuser.phone || "N/A"}</p>
        </div>

        <InfoRow label="Role" value={singleuser.role as string} />

        <div className="flex justify-between items-center px-6 py-2">
               <label className="text-sm text-gray-600 font-semibold">status</label>
          {singleuser.status === "ACTIVE" && (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>ACTIVE</StatusLabel>
            </Status>
          )}
          {singleuser.status === "BLOCKED" && (
            <Status variant="error">
              <StatusIndicator />
              <StatusLabel>BLOCKED</StatusLabel>
            </Status>
          )}
          {singleuser.status === "DELETED" && (
            <Status variant="error">
              <StatusIndicator />
              <StatusLabel>DELETED</StatusLabel>
            </Status>
          )}
        </div>

        <div className="flex justify-between items-center px-6 py-2">
               <label className="text-sm text-gray-600 font-semibold">Email Verified</label>
          <Status variant={singleuser.emailVerified ? "success" : "error"}>
            <StatusIndicator />
            <StatusLabel>{singleuser.emailVerified ? "Yes" : "No"}</StatusLabel>
          </Status>
        </div>

        <div className="flex justify-between items-center px-6 py-2">
                 <label className="text-sm text-gray-600 font-semibold">online</label>
          <Status variant={singleuser.isActive ? "success" : "error"}>
            <StatusIndicator />
            <StatusLabel>{singleuser.isActive ? "Online" : "Offline"}</StatusLabel>
          </Status>
        </div>

        <InfoRow label="Created At" value={singleuser?.createdAt?.toString().slice(0, 10)} />
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Profile</h2>

          <ShareProfileButton userId={user.id} userName={user?.name || "unknown"} />
        </div>
      </div>
    </div>
  );
}

export default SingleProfile;