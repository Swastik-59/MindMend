"use client";

import { Moon, PanelLeft, Sun, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { TextAnimate } from "./magicui/text-animate";
import { Switch } from "./ui/switch";
import clsx from "clsx";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/hooks/useThemeProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useStore } from "@/lib/store/zustand";


type MenuItem = {
  label: string;
  variant?:
  | "default"
  | "ghost"
  | "outline"
  | "link"
  | "destructive"
  | "secondary";
  action: (router: ReturnType<typeof useRouter>, uid: string | null) => void;
};

const uid = localStorage.getItem("user_uid");

const menuItems: MenuItem[] = [
  {
    label: "Progress",
    variant: "default",
    action: (router) => {
      if (uid) {
        router.replace(`/${uid}/progress`);
      }
    },
  },
  {
    label: "Chat",
    variant: "secondary",
    action: (router) => {
      if (uid) {
        router.replace(`/${uid}/chat`);
      }
    },
  },
];

// Sidebar Content Component (DRY principle)
function SidebarContent({
  uid,
  router,
  theme,
  toggleTheme,
  useBrowserTTS,
  setUseBrowserTTS,
  onItemClick,
}: {
  uid: string | null;
  router: ReturnType<typeof useRouter>;
  theme: string;
  toggleTheme: () => void;
  useBrowserTTS: boolean;
  setUseBrowserTTS: (value: boolean) => void;
  onItemClick?: () => void;
}) {
  const animatedTitle = useMemo(
    () => (
      <TextAnimate
        as="h2"
        by="word"
        animation="fadeIn"
        duration={1}
        className="text-2xl font-bold text-primary"
      >
        Dashboard
      </TextAnimate>
    ),
    []
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="space-y-6">
        {animatedTitle}
        <nav className="space-y-3">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.variant}
              className="w-full justify-start"
              onClick={() => {
                item.action(router, uid);
                onItemClick?.();
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="pt-4 border-t border-border">
          <Button
            onClick={() => {
              toggleTheme();
              onItemClick?.();
            }}
            variant="ghost"
            className="flex items-center gap-3 w-full justify-start text-sm"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>

      {/* Voice Engine Control */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            {useBrowserTTS ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            Voice Engine
          </span>
          <Switch checked={useBrowserTTS} onCheckedChange={setUseBrowserTTS} />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const useBrowserTTS = useStore((state) => state.useBrowserTTS);
  const setUseBrowserTTS = useStore((state) => state.setUseBrowserTTS);

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const cookieUid = Cookies.get("uid");
    setUid(cookieUid || null);
  }, []);

  const closeSidebar = () => setIsOpen(false);

  // Close sidebar when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && window.innerWidth >= 1024) {
        const sidebar = document.querySelector(".desktop-sidebar");
        const toggle = document.querySelector(".desktop-toggle");

        if (
          sidebar &&
          toggle &&
          !sidebar.contains(event.target as Node) &&
          !toggle.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="drawer z-40 sticky top-0">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="drawer-content p-4">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost bg-muted text-primary drawer-button hover:bg-muted/80 desktop-toggle"
        >
          <PanelLeft className="h-5 w-5" />
        </label>
      </div>

      <div className="drawer-side pointer-events-none">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className={clsx(
            "drawer-overlay transition-all",
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
        />
        <div
          className={clsx(
            "menu bg-background text-text min-h-full w-80 p-6 space-y-6 shadow-xl border-r border-border backdrop-blur-md transition-transform duration-300 flex flex-col justify-between desktop-sidebar",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent
            uid={uid}
            router={router}
            theme={theme}
            toggleTheme={toggleTheme}
            useBrowserTTS={useBrowserTTS}
            setUseBrowserTTS={setUseBrowserTTS}
            onItemClick={closeSidebar}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
