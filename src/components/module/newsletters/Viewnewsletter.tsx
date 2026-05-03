import React from "react";
import { format } from "date-fns";
import CopyableId from "@/components/shared/CopyId";

interface ViewHighLightDataProps {
  viewData: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
}

const ViewHighLightData: React.FC<ViewHighLightDataProps> = ({ viewData }) => {
  if (!viewData) return null;

  const { id, title, content, createdAt, updatedAt, user } = viewData;

  return (
    <div className="px-4 md:px-10 py-4 space-y-8">
      {/* Highlight Overview */}
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-1 tracking-tight">
          Highlight Details
        </h2>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          <li className="flex justify-between py-1">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Highlight ID</span>
            <span className="font-mono text-gray-900 dark:text-gray-100 break-all">{id}</span>
          </li>
          <li className="flex justify-between py-1">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Title</span>
            <span className="text-gray-900 dark:text-gray-100">{title ?? "-"}</span>
          </li>
          <li className="flex justify-between py-1">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Created At</span>
            <span className="text-gray-900 dark:text-gray-100">
              {createdAt ? format(new Date(createdAt), "dd/MM/yyyy HH:mm") : "-"}
            </span>
          </li>
          <li className="flex justify-between py-1">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Updated At</span>
            <span className="text-gray-900 dark:text-gray-100">
              {updatedAt ? format(new Date(updatedAt), "dd/MM/yyyy HH:mm") : "-"}
            </span>
          </li>
        </ul>
        <div>
          <span className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-0.5">Content</span>
          <div className="text-base text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 whitespace-pre-line">{content}</div>
        </div>
      </section>

      {/* User Info */}
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-sky-800 dark:text-sky-200 mb-1 tracking-tight">
          User Details
        </h2>
        <div className="flex items-center gap-6">
          {user?.image && (
            <img
              src={user.image}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border shadow"
            />
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Name</span>
              <div className="text-gray-900 dark:text-gray-100">{user?.name ?? "-"}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Email</span>
              <div className="text-gray-900 dark:text-gray-100 break-all">{user?.email ?? "-"}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">User ID</span>
              <CopyableId id={user?.id} href={`/profile/${user?.id}`} showShort={user?.id as any}></CopyableId>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewHighLightData;