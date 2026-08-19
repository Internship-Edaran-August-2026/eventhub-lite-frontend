import { cn } from "@/lib/utils";

const AVATAR_PALETTE = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-cyan-500",
];

function colorForNickname(nickname: string): string {
  const hash = Array.from(nickname).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

interface PlayerAvatarProps {
  nickname: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSNAME: Record<NonNullable<PlayerAvatarProps["size"]>, string> = {
  sm: "size-6 text-[0.65rem]",
  md: "size-9 text-sm",
  lg: "size-14 text-lg",
};

export function PlayerAvatar({ nickname, size = "md", className }: PlayerAvatarProps) {
  const initials = nickname.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        colorForNickname(nickname),
        SIZE_CLASSNAME[size],
        className
      )}
      title={nickname}
    >
      {initials}
    </div>
  );
}
