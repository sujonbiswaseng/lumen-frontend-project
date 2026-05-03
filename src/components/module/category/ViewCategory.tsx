import React from "react";

// Category type based on provided structure
interface Category {
  id: string;
  adminId: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  meals: any[];
  user?: any;   
}

const ViewCategoryData = ({
  viewMode,
  viewData,
}: {
  viewMode: boolean;
  viewData?: Category;
}) => {
  return (
    <div>
      {viewMode && viewData && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl px-4 sm:px-6 py-6 space-y-8 overflow-y-scroll">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center border border-blue-100 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 shadow-inner overflow-hidden">
              {viewData.image ? (
                <img
                  src={viewData.image}
                  alt={viewData.name || "Category"}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-5xl text-blue-200">
                  <svg width={50} height={50} viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" fill="#E0E7FF" />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="11"
                      dy=".3em"
                    >
                      🍕
                    </text>
                  </svg>
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 font-bold text-2xl text-indigo-900 truncate">
                {viewData.name || "-"}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Created At:
                  </span>
                  <span className="font-medium text-gray-600">
                    {viewData.createdAt
                      ? new Date(viewData.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Updated At:
                  </span>
                  <span className="font-medium text-gray-600">
                    {viewData.updatedAt
                      ? new Date(viewData.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-[15px]">
            <div>
              <span className="text-gray-500 font-medium">Category ID:</span>
              <span className="block mt-0.5 font-mono text-sm text-gray-700 select-all bg-gray-50 rounded px-2 py-1">
                {viewData.id || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Admin ID:</span>
              <span className="block mt-0.5 text-gray-800 font-semibold">
                {viewData.adminId || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Meals Count:</span>
              <span className="block mt-0.5">
                {Array.isArray(viewData.meals) ? viewData.meals.length : 0}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Admin Name:</span>
              <span className="block mt-0.5">
                {viewData.user?.name ?? "-"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500 font-medium">Admin Email:</span>
              <span className="block mt-0.5">
                {viewData.user?.email ?? "-"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategoryData;