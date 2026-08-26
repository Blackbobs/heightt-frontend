// src/components/dashboard/DashboardHeader.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { User } from "@/lib/api/users";
import { useAuthStore } from "@/store/auth-store";
import {
  useUnreadNotificationCount,
  useMarkAllNotificationsAsRead,
} from "@/hooks/queries/useCommunication";
import { toast } from "sonner";

interface DashboardHeaderProps {
  pageTitle?: string;
  user?: User | null;
  onNotificationClick?: () => void;
}

export function DashboardHeader({
  pageTitle = "Dashboard",
  user: propUser,
  onNotificationClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardRoot = pathname === "/dashboard";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user from auth store if not provided as prop
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearUser = useAuthStore((state) => state.clearUser);

  const user = propUser || authUser;

  // Get unread notification count
  const { data: unreadCount = 0, isLoading: isLoadingUnread } =
    useUnreadNotificationCount();

  // Mark all as read mutation
  const markAllAsRead = useMarkAllNotificationsAsRead();

  // Handle notification click
  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      router.push("/notifications");
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllAsRead.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      router.push("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials
  const getInitials = () => {
    if (!user?.profile) return "U";
    const firstName = user.profile.firstName || "";
    const lastName = user.profile.lastName || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (!user?.profile) return "User";
    const firstName = user.profile.firstName || "";
    const lastName = user.profile.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    return user.username || user.email?.split("@")[0] || "User";
  };

  const displayName = getDisplayName();
  const firstName = displayName.split(" ")[0];

  // Get user role/status
  const getUserRole = () => {
    if (!user) return "User";
    return user.status === "ACTIVE" ? "Member" : "Pending";
  };

  // Get avatar color based on user ID or name
  const getAvatarColor = () => {
    const colors = [
      "from-[#1a5cff] to-[#4a7aff]",
      "from-[#7c3aed] to-[#a78bfa]",
      "from-[#ec4899] to-[#f472b6]",
      "from-[#14b8a6] to-[#2dd4bf]",
      "from-[#f59e0b] to-[#fbbf24]",
    ];
    const index = user?.id ? user.id.length % colors.length : 0;
    return colors[index];
  };

  return (
    <header className="px-5 lg:px-7 py-3.5 bg-[#f8f9fc] lg:bg-white border-b border-[#e8ecf1] flex-shrink-0 sticky top-0 z-10">
      {isDashboardRoot ? (
        /* Root Dashboard Header: Greeting on Left, Bell & Profile on Right */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Mobile greeting on root dashboard */}
            <div className="lg:hidden flex items-center gap-1.5 text-[1.15rem] font-bold text-[#1a1a2e]">
              Hi, <span className="text-[#1a5cff]">{firstName || "User"}</span>
            </div>

            {/* Page title - Desktop */}
            <h2 className="hidden lg:block text-[1.05rem] font-semibold text-[#1a1a2e]">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-[38px] h-[38px] rounded-full border-none bg-white flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#f0f2f5] transition-colors relative"
                onClick={handleNotificationClick}
                aria-label="Notifications"
              >
                <Bell className="w-[18px] h-[18px] text-[#1a1a2e]" />

                {/* Unread count badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#ef4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Quick actions on notification hover - optional */}
              {unreadCount > 0 && (
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#1a5cff] hover:text-[#4a7aff] px-2 py-1"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1.5 cursor-pointer group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Profile menu"
              >
                <div
                  className={`w-[38px] h-[38px] rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-semibold text-[0.8rem] transition-opacity hover:opacity-90`}
                >
                  {getInitials()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#6b7280] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] min-w-[220px] bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e8ecf1] py-1.5 z-50">
                  {/* User Info */}
                  <div className="px-4 py-2.5 border-b border-[#e8ecf1]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-semibold text-[0.7rem]`}
                      >
                        {getInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a2e] truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-[#6b7280] truncate">
                          {user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 bg-[#e8ecf1] text-[#6b7280] rounded-full">
                        {getUserRole()}
                      </span>
                      {user?.status === "ACTIVE" && (
                        <CheckCircle className="w-3 h-3 text-[#10b981]" />
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/dashboard/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#1a1a2e] hover:bg-[#f8f9fc] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#6b7280]" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/dashboard/settings");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#1a1a2e] hover:bg-[#f8f9fc] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#6b7280]" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#ef4444]" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Other Subpages: Back Button on Left, Centered Title, No Right Icons */
        <div className="relative flex items-center justify-between min-h-[38px]">
          {/* Left: Back button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/dashboard");
              }
            }}
            className="w-8 h-8 rounded-full bg-white border border-[#e8ecf1] hover:bg-[#f0f2f5] flex items-center justify-center text-[#1a1a2e] transition-colors cursor-pointer shadow-xs shrink-0 z-10"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#1a1a2e]" />
          </button>

          {/* Center: Page Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-[1.05rem] font-bold text-[#1a1a2e] truncate max-w-[70%]">
              {pageTitle}
            </h2>
          </div>

          {/* Right: Invisible spacer to balance left button */}
          <div className="w-8 h-8 shrink-0 pointer-events-none" />
        </div>
      )}
    </header>
  );
}