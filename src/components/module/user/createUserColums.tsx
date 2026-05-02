import { motion } from "framer-motion";
import CopyableId from "@/components/shared/CopyId";

// Global badge/label component for status/role - reusable, color via props
const Badge = ({
  bg,
  fg,
  children,
  minWidth = "min-w-[56px]",
  px = "px-3",
  py = "py-1",
  fontSize = "text-xs",
  className = "",
  uppercase = false,
}: {
  bg: string;
  fg: string;
  children: React.ReactNode;
  minWidth?: string;
  px?: string;
  py?: string;
  fontSize?: string;
  className?: string;
  uppercase?: boolean;
}) => (
  <span
    className={`
      inline-flex items-center justify-center
      rounded border border-border font-semibold
      transition-colors whitespace-nowrap
      ${uppercase ? "uppercase" : ""}
      ${minWidth} ${px} ${py} ${fontSize}
      ${className}
    `}
    style={{
      background: `var(${bg})`,
      color: `var(${fg})`,
      letterSpacing: uppercase ? "0.045em" : "0.01em",
      lineHeight: "1.22",
    }}
  >
    {children}
  </span>
);

// Avatar cell (circle image or fallback)
const UserAvatar = ({ src, alt }: { src?: string; alt?: string }) => (
  <div
    className={`
      flex items-center justify-center
      w-10 h-10 rounded-full 
      overflow-hidden mx-auto
      bg-input border border-border
      transition-shadow duration-300
      shadow-sm
    `}
    style={{ minWidth: 36, minHeight: 36 }}
  >
    {src ? (
      <motion.img
        layoutId={`user-avatar-${src}`}
        src={src}
        alt={alt || "Profile"}
        className="object-cover w-full h-full pointer-events-none select-none"
        draggable={false}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.19 } }}
      />
    ) : (
      <span
        className="flex items-center justify-center font-semibold text-muted-foreground text-sm select-none w-full h-full"
        style={{ fontStyle: "italic", letterSpacing: "0.01em" }}
      >
        --
      </span>
    )}
  </div>
);

export const createUserColumns = () => [
  {
    key: "id",
    label: "ID",
    render: (row: any) => (
      <motion.div
        className="flex items-center min-w-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.33, type: "spring", stiffness: 210 } }}
        exit={{ opacity: 0, y: 6, transition: { duration: 0.17 } }}
      >
        <CopyableId
          id={row.id}
          href={`/profile/${row.id}`}
          showShort={row.id?.slice(0, 8)}
          className="font-mono text-xs sm:text-sm rounded transition-colors px-1.5 py-0.5 bg-card text-card-foreground ring-1 ring-border"
        />
      </motion.div>
    ),
  },
  {
    key: "image",
    label: "Profile",
    render: (row: any) => (
      <UserAvatar src={row.image} alt={row.name} />
    ),
  },
  {
    key: "name",
    label: "Name",
    render: (row: any) => (
      <span
        className={`
          block truncate font-medium transition-colors
          max-w-[17ch] sm:text-base text-sm
          ${row.name ? "text-foreground" : "text-muted-foreground italic font-normal"}
        `}
        title={row.name || ""}
        style={{
          minWidth: 0,
        }}
      >
        {row.name ? row.name : <span className="text-xs">--</span>}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (row: any) => (
      <span
        className="block truncate font-normal text-muted-foreground transition-colors max-w-[18ch] sm:text-sm text-xs"
        title={row.email || ""}
      >
        {row.email}
      </span>
    ),
  },
  {
    key: "role",
    label: "Role",
    render: (row: any) => {
      let bg = "--muted";
      let fg = "--muted-foreground";
      let text = row.role || "Unknown";
      if (row.role === "ADMIN") {
        bg = "--primary";
        fg = "--primary-foreground";
        text = "Admin";
      } else if (row.role === "USER") {
        bg = "--secondary";
        fg = "--secondary-foreground";
        text = "User";
      } else if (row.role === "MANAGER") {
        bg = "--accent";
        fg = "--accent-foreground";
        text = "Manager";
      }
      return (
        <Badge
          bg={bg}
          fg={fg}
          minWidth="min-w-[56px]"
          px="px-3"
          py="py-1"
          fontSize="text-xs"
          uppercase
        >
          {text}
        </Badge>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: any) => {
      let bg = "--input";
      let fg = "--muted-foreground";
      let text = row.status || "--";
      if (row.status === "ACTIVE" || row.status === true) {
        bg = "--secondary";
        fg = "--secondary-foreground";
        text = "Active";
      } else if (row.status === "INACTIVE" || row.status === false) {
        bg = "--muted";
        fg = "--muted-foreground";
        text = "Inactive";
      } else if (row.status === "BLOCKED") {
        bg = "--accent";
        fg = "--accent-foreground";
        text = "Blocked";
      } else if (row.status === "DELETED") {
        bg = "--muted";
        fg = "--muted-foreground";
        text = "Deleted";
      }
      return (
        <Badge
          bg={bg}
          fg={fg}
          minWidth="min-w-[64px]"
          px="px-3"
          py="py-1"
          fontSize="text-xs"
        >
          {text}
        </Badge>
      );
    },
  },
  {
    key: "emailVerified",
    label: "Verified",
    render: (row: any) => {
      const isVerified = !!row.emailVerified;
      return (
        <Badge
          bg={isVerified ? "--primary" : "--muted"}
          fg={isVerified ? "--primary-foreground" : "--muted-foreground"}
          minWidth="min-w-[56px]"
          px="px-2"
          py="py-1"
          fontSize="text-xs"
          uppercase
        >
          {isVerified ? "Yes" : "No"}
        </Badge>
      );
    },
  },
];