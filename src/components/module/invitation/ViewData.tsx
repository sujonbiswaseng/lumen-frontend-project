import React from 'react'

const ViewInvitationData = ({viewMode,viewData}:{viewMode:any,viewData:any}) => {
  return (
    <div>

{viewMode && viewData && (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-xl px-4 sm:px-6 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center border border-blue-100 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 shadow-inner overflow-hidden">
          {viewData?.event?.images ? (
            <img
              src={viewData.event.images[0]}
              alt={viewData?.event?.title ?? "Event"}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-5xl text-blue-200"><svg width={50} height={50} viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#E0E7FF"/><text x="50%" y="55%" textAnchor="middle" fill="#64748b" fontSize="11" dy=".3em">🎫</text></svg></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 font-bold text-2xl text-indigo-900 truncate">{viewData?.event?.title || "-"}</h3>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M15 2v2m-6-2v2m-5 4h16M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" stroke="#6366F1" strokeWidth={1.3}/></svg>
              </span>
              <span className="font-medium text-gray-600">
                {viewData?.event?.date
                ? new Date(viewData.event.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M21 10.5V6a2 2 0 0 0-2-2h-2M3 6a2 2 0 0 1 2-2h2M3 18v-3M16 18h2a2 2 0 0 0 2-2v-2M3 10.5V18c0 1.1.9 2 2 2h2M12 8v4l3 2" stroke="#6366F1" strokeWidth={1.3}/></svg>
              </span>
              <span className="font-medium text-gray-600">{viewData?.event?.venue || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-[15px]">
        <div>
          <span className="text-gray-500 font-medium">Invitation ID:</span>
          <span className="block mt-0.5 font-mono text-sm text-gray-700 select-all bg-gray-50 rounded px-2 py-1">{viewData?.id || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Status:</span>
          <span
            className={[
              "inline-block ml-2 px-2 py-[2px] rounded font-semibold text-xs border",
              viewData.status === "PENDING"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : viewData.status === "ACCEPTED"
                ? "bg-green-50 text-green-700 border-green-200"
                : viewData.status === "DECLINED"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-50 text-gray-500 border"
            ].join(" ")}
          >
            {viewData?.status}
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Inviter:</span>
          <span className="block mt-0.5 text-gray-800 font-semibold">{viewData?.invitee?.name ?? viewData?.inviterId ?? "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Invitee:</span>
          <span className="block mt-0.5 text-gray-800 font-semibold">{viewData?.invitee?.name ?? viewData?.inviteeId ?? "-"}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-gray-500 font-medium">Created At:</span>
          <span className="block mt-0.5">{viewData?.createdAt
            ? new Date(viewData.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })
            : "-"}</span>
        </div>
      </div>
    </div>
  )}
        
    </div>
  )
}

export default ViewInvitationData