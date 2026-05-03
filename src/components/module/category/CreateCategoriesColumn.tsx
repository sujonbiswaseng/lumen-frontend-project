import CopyId from "@/components/shared/CopyId";


// Short classnames for compact & professional table layout
const thClass =
  "text-xs font-bold px-2 py-2 bg-blue-50 dark:bg-indigo-950 text-indigo-900 dark:text-white border-b text-left";
const tdClass = "px-2 py-1 text-sm whitespace-nowrap align-middle";

export const createCategoryColumns = () => [
  {
    key: "id",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M9 9h6v6H9z" />
          </svg>
          ID
        </span>
      </span>
    ),
    render: (row: any) => (
      <div className={tdClass}>
        <CopyId
          id={row.id}
          href={`/category/${row.id}`}
          className="rounded px-1 py-0.5 text-blue-700 dark:text-indigo-300 font-mono hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
          showShort={row.id ? row.id.slice(0, 8) + "..." : "" as any}
          key={row.id}
        />
      </div>
    ),
  },
  {
    key: "adminId",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M6.2 19.2A8 8 0 1 1 17.8 19.2" />
          </svg>
          Admin
        </span>
      </span>
    ),
    render: (row: any) => (
      <div className={tdClass}>
        <CopyId
          id={row.adminId}
          href={`/profile/user/${row.adminId}`}
          className="rounded px-1 py-0.5 text-cyan-700 dark:text-cyan-200 font-mono hover:bg-cyan-100 dark:hover:bg-cyan-900 transition"
          showShort={row.adminId ? row.adminId.slice(0, 8) + "..." : "" as any}
          key={row.adminId}
        />
      </div>
    ),
  },
  {
    key: "name",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20v-7.586l7.293-7.293a1 1 0 0 1 1.414 0l7.293 7.293V20H4z" />
            <path d="M8 20v-5h8v5" />
          </svg>
          Name
        </span>
      </span>
    ),
    render: (row: any) => (
      <span className="font-medium text-gray-900 dark:text-white px-2 truncate block max-w-[110px]">{row.name}</span>
    ),
  },
  {
    key: "image",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="12.5" r="2.5" />
            <path d="M21 15.5l-5-4-3 3.5-2-2-5 5" />
          </svg>
          Img
        </span>
      </span>
    ),
    render: (row: any) => (
      <span className="flex items-center gap-1 px-2">
        {row.image ? (
          <>
            <img
              src={row.image}
              alt={row.name || "Category"}
              className="rounded w-7 h-7 object-cover border"
            />
           
          </>
        ) : (
          <span className="italic text-gray-300">—</span>
        )}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-1">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Created
        </span>
      </span>
    ),
    render: (row: any) => {
      const date = new Date(row.createdAt);
      return (
        <span className="rounded px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900 text-xs text-orange-700 dark:text-yellow-100 border">
          {isNaN(date.getTime())
            ? <span className="text-red-400">-</span>
            : date.toLocaleDateString(undefined, { year: "2-digit", month: "short", day: "numeric" })}
        </span>
      );
    },
  },
 
];