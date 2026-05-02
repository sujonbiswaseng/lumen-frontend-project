import CopyableId from "@/components/shared/CopyId";


export const createUserColumns = () => [
  {
    key: "id",
    label: "ID",
    render: (row: any) => (
      <div
        className="flex items-center"
        style={{
          minWidth: "0",
        }}
      >
        <CopyableId
          id={row.id}
          href={`/profile/${row.id}`}
          showShort={row.id?.slice(0, 8)}
        />
      </div>
    ),
  },
  {
    key: "image",
    label: "Profile",
    render: (row: any) => (
      <div
        className="flex items-center justify-center"
        style={{
          width: "2.5rem",
          height: "2.5rem",
          minWidth: "2.25rem",
          minHeight: "2.25rem",
          borderRadius: "9999px",
          background: row.image ? "var(--input)" : "var(--muted)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        {row.image ? (
          <img
            src={row.image}
            alt={row.name || "Profile"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "9999px",
              userSelect: "none",
              pointerEvents: "none",
              minWidth: "100%",
              minHeight: "100%",
              transition: "transform 0.2s",
              background: "var(--input)",
            }}
            draggable={false}
          />
        ) : (
          <span
            className="flex items-center justify-center font-bold"
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.85rem",
              width: "100%",
              height: "100%",
              userSelect: "none",
            }}
          >
            --
          </span>
        )}
      </div>
    ),
  },

  {
    key: "name",
    label: "Name",
    render: (row: any) => (
      <span
        className="block truncate font-medium transition-colors"
        style={{
          color: row.name ? "var(--foreground)" : "var(--muted-foreground)",
          fontSize: "1rem",
          fontStyle: row.name ? "normal" : "italic",
          maxWidth: "17ch",
          minWidth: 0,
        }}
        title={row.name || ""}
      >
        {row.name ? row.name : (
          <span className="text-xs font-normal" style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>--</span>
        )}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (row: any) => (
      <span
        className="block truncate font-normal transition-colors"
        style={{
          color: "var(--muted-foreground)",
          fontSize: "0.93rem",
          maxWidth: "18ch",
        }}
        title={row.email || ""}
      >
        {row.email}
      </span>
    ),
  },
  // Role – Professional badge, token-based, uppercase, clear hierarchy
  {
    key: "role",
    label: "Role",
    render: (row: any) => {
      let bg = "";
      let fg = "";
      let text = "";
      switch (row.role) {
        case "ADMIN":
          bg = "var(--primary)";
          fg = "var(--primary-foreground)";
          text = "Admin";
          break;
        case "USER":
          bg = "var(--secondary)";
          fg = "var(--secondary-foreground)";
          text = "User";
          break;
        case "MANAGER":
          bg = "var(--accent)";
          fg = "var(--accent-foreground)";
          text = "Manager";
          break;
        default:
          bg = "var(--muted)";
          fg = "var(--muted-foreground)";
          text = row.role || "Unknown";
      }
      return (
        <span
          className="inline-flex items-center justify-center rounded font-semibold uppercase transition-colors border"
          style={{
            minWidth: "64px",
            padding: "0.25rem 0.75rem",
            background: bg,
            color: fg,
            border: "1px solid var(--border)",
            fontSize: "0.78rem",
            letterSpacing: "0.03em",
            lineHeight: 1.25,
          }}
        >
          {text}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: any) => {
      let bg = "";
      let fg = "";
      let text = "";
      switch (row.status) {
        case "ACTIVE":
        case true:
          bg = "var(--secondary)";
          fg = "var(--secondary-foreground)";
          text = "Active";
          break;
        case "INACTIVE":
        case false:
          bg = "var(--muted)";
          fg = "var(--muted-foreground)";
          text = "Inactive";
          break;
        case "BLOCKED":
          bg = "var(--accent)";
          fg = "var(--accent-foreground)";
          text = "Blocked";
          break;
        case "DELETED":
          bg = "var(--muted)";
          fg = "var(--muted-foreground)";
          text = "Deleted";
          break;
        default:
          bg = "var(--input)";
          fg = "var(--muted-foreground)";
          text = row.status || "--";
      }
      return (
        <span
          className="inline-flex items-center justify-center rounded font-semibold transition-colors border"
          style={{
            minWidth: "64px",
            padding: "0.25rem 0.75rem",
            background: bg,
            color: fg,
            border: "1px solid var(--border)",
            fontSize: "0.78rem",
            letterSpacing: "0.01em",
            lineHeight: 1.25,
          }}
        >
          {text}
        </span>
      );
    },
  },
  {
    key: "emailVerified",
    label: "Verified",
    render: (row: any) => {
      const isVerified = !!row.emailVerified;
      return (
        <span
          className="inline-flex items-center justify-center rounded font-semibold uppercase transition-colors border"
          style={{
            minWidth: "56px",
            padding: "0.22rem 0.55rem",
            background: isVerified ? "var(--primary)" : "var(--muted)",
            color: isVerified ? "var(--primary-foreground)" : "var(--muted-foreground)",
            border: "1px solid var(--border)",
            fontSize: "0.74rem",
            letterSpacing: "0.045em",
            lineHeight: 1.16,
          }}
        >
          {isVerified ? "Yes" : "No"}
        </span>
      );
    },
  },
];