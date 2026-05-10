import { Megaphone, Pin } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HubCard } from "../shared/HubCard";
import { Username } from "@/components/community/Username";
import { AnnouncementRow } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

export function AnnouncementBar({
  announcement,
  isAdmin,
  announcementDraft,
  setAnnouncementDraft,
  createAnnouncement,
}: {
  announcement?: AnnouncementRow | null;
  isAdmin: boolean;
  announcementDraft: string;
  setAnnouncementDraft: (val: string) => void;
  createAnnouncement: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <HubCard className="overflow-hidden p-0">
      <div className="border border-transparent bg-gradient-to-r from-amber-200/70 via-cyan-200/70 to-violet-200/70 p-[1px] dark:from-amber-400/30 dark:via-cyan-400/30 dark:to-violet-400/30">
        <div className="rounded-[1.4rem] bg-white/90 p-5 dark:bg-slate-950/85">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
              <Pin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  Admin announcement
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                  Pinned
                </span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                {announcement?.title || "Community update"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {announcement?.content ||
                  "Mọi thông báo quan trọng của cộng đồng sẽ xuất hiện ở đây."}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                <Username
                  userId={announcement?.created_by}
                  name={announcement?.author_name || "Admin"}
                />{" "}
                · {formatTimeAgo(announcement?.created_at)}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <form
              onSubmit={createAnnouncement}
              className="mt-4 flex gap-2 rounded-2xl bg-slate-100/80 p-2 dark:bg-white/[0.06]"
            >
              <Textarea
                value={announcementDraft}
                onChange={(event) => setAnnouncementDraft(event.target.value)}
                placeholder="Đăng thông báo cho toàn cộng đồng..."
                className="min-h-10 resize-none rounded-xl border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-amber-400"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                aria-label="Đăng announcement"
              >
                <Megaphone className="h-4 w-4" />
              </Button>
            </form>
          ) : null}
        </div>
      </div>
    </HubCard>
  );
}
