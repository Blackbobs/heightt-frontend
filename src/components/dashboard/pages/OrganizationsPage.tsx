// src/components/dashboard/pages/OrganizationsPage.tsx

"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Search,
  Loader2,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useBrowseOrganizations,
  useJoinOrganization,
} from "@/hooks/queries/useOrganizations";
import { useUserOrganizations } from "@/hooks/queries/useUser";
import { useCurrentUser } from "@/hooks/queries/useUser";
import {
  useAcademicSessions,
  type AcademicSession,
} from "@/hooks/queries/useAcademicSessions";
import { useAuthStore } from "@/store/auth-store";
import { Organization } from "@/lib/api/organizations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { toast } from "sonner";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

const TYPE_LABELS: Record<string, string> = {
  ASSOCIATION: "Association",
  CLUB: "Club",
  DEPARTMENT: "Department",
  FACULTY: "Faculty",
  INSTITUTION: "Institution",
  LEVEL: "Level",
  RELIGIOUS: "Religious",
  SPORTS: "Sports",
  SPECIAL: "Special",
};

export function OrganizationsPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { user: authUser } = useAuthStore();

  const currentUser = user || authUser;

  const institutionId = currentUser?.studentProfile?.institutionId || "";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"browse" | "joined">("browse");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Fetch academic sessions to get current session
  const { data: sessionsData } = useAcademicSessions(institutionId);
  const currentSession = sessionsData?.find(
    (session: AcademicSession) =>
      session.scope === "INSTITUTION" && session.isCurrent,
  );

  const { data: joinedData, isLoading: isLoadingJoined } =
    useUserOrganizations();
  const joinedOrgs = useMemo(() => joinedData || [], [joinedData]);

  const { data, isLoading, isFetching, isError, refetch } = useBrowseOrganizations({
    institutionId,
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  });

  const joinMutation = useJoinOrganization();

  const joinedOrgIds = useMemo(
    () => new Set(joinedOrgs.map((m) => m.organizationId)),
    [joinedOrgs],
  );

  const browseOrgs = useMemo(() => data?.organizations || [], [data?.organizations]);

  const filteredBrowse = useMemo(() => {
    if (!debouncedSearch) return browseOrgs;
    const q = debouncedSearch.toLowerCase();
    return browseOrgs.filter(
      (org: Organization) =>
        org.name?.toLowerCase().includes(q) ||
        org.slug?.toLowerCase().includes(q) ||
        org.description?.toLowerCase().includes(q),
    );
  }, [browseOrgs, debouncedSearch]);

  const totalOrganizations = data?.meta.total ?? browseOrgs.length;
  const totalPages = Math.max(1, data?.meta.totalPages ?? 1);

  const handleJoin = async (org: Organization) => {
    setJoiningId(org.id);
    try {
      await joinMutation.mutateAsync({
        organizationId: org.id,
        sessionId: currentSession?.id,
      });
      toast.success(`Successfully joined ${org.name}`);
      // Refetch joined organizations
      refetch();
    } catch {
      toast.error('Failed to join organization. Please try again.');
    } finally {
      setJoiningId(null);
    }
  };

  const isLoadingPage =
    userLoading || (tab === "browse" ? isLoading : isLoadingJoined);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading your profile" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading your profile...
          </span>
        </div>
      </div>
    );
  }

  if (!institutionId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Institution not set</p>
            <p className="text-sm mt-1">
              Complete your onboarding to browse organizations at your
              institution.
            </p>
            <button
              onClick={() => (window.location.href = "/onboarding")}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
            >
              Complete Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading organizations" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading organizations...
          </span>
        </div>
      </div>
    );
  }

  if (isError && tab === "browse") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-300">
        <p className="font-semibold">Error loading organizations</p>
        <p className="text-sm">Something went wrong. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#131B2E]">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-[#2563EB]" />
            <span className="text-[0.65rem] font-semibold text-[#64748B] uppercase tracking-wide">
              Available
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#0B1020] dark:text-white">
            {totalOrganizations}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#131B2E]">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-[0.65rem] font-semibold text-[#64748B] uppercase tracking-wide">
              Joined
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#0B1020] dark:text-white">
            {joinedOrgs.length}
          </p>
        </div>
      </div>


      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search organizations…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-[#0B1020] outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563EB] dark:border-slate-800 dark:bg-[#131B2E] dark:text-white dark:placeholder:text-slate-500"
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB] animate-spin" />
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {(["browse", "joined"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all capitalize",
              tab === t
                ? "bg-[#2563EB] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-800 dark:bg-[#131B2E] dark:text-slate-300",
            )}
          >
            {t === "browse" ? "Browse" : "My Organizations"}
          </button>
        ))}
      </div>

      {/* Organization list */}
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-[#131B2E]">
        {tab === "browse" ? (
          filteredBrowse.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-8 h-8 text-[#c8d0db] mb-2" />
              <p className="text-[0.82rem] font-medium text-[#64748B]">
                No organizations found
              </p>
              <p className="text-[0.65rem] text-[#b0bac8] mt-1">
                Try adjusting your search or check back later.
              </p>
            </div>
          ) : (
            filteredBrowse.map((org: Organization) => {
              const isJoined = joinedOrgIds.has(org.id);
              const isJoining = joiningId === org.id;

              return (
                <div
                  key={org.id}
                  className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-slate-900/70"
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] dark:bg-[#2563EB]/15">
                    <Building2 className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] font-semibold text-[#0B1020] dark:text-white">
                      {org.name}
                    </p>
                    {org.description && (
                      <p className="text-[0.68rem] text-[#64748B] mt-0.5 line-clamp-2">
                        {org.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[0.58rem] font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-blue-300">
                        {TYPE_LABELS[org.type] || org.type}
                      </span>
                      <span className="text-[0.58rem] text-[#64748B]">
                        {org.scope?.replace(/_/g, " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {isJoined ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[0.65rem] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoin(org)}
                      disabled={isJoining}
                      className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 rounded-full shrink-0 border-none cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {isJoining ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      Join
                    </button>
                  )}
                </div>
              );
            })
          )
        ) : joinedOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#64748B]">
              You haven&apos;t joined any organizations yet
            </p>
            <button
              onClick={() => setTab("browse")}
              className="mt-3 text-[0.75rem] font-semibold text-[#2563EB] bg-transparent border-none cursor-pointer hover:underline"
            >
              Browse organizations →
            </button>
          </div>
        ) : (
          joinedOrgs.map((membership) => {
            const org = membership.organization;
            const isPending = membership.status === "PENDING";

            return (
              <div
                key={membership.id}
                className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-slate-900/70"
              >
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-semibold text-[#0B1020] dark:text-white">
                    {org?.name || "Organization"}
                  </p>
                  {org?.description && (
                    <p className="text-[0.68rem] text-[#64748B] mt-0.5 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                  <p className="text-[0.58rem] text-[#64748B] mt-1">
                    Joined{" "}
                    {membership.joinedAt
                      ? new Date(membership.joinedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2.5 py-1.5 rounded-full shrink-0",
                    isPending
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
                  )}
                >
                  {isPending ? (
                    <>
                      <Clock className="w-3 h-3" />
                      Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      {tab === "browse" && totalPages > 1 && (
        <nav className="flex items-center justify-between gap-3" aria-label="Organization pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40 dark:border-slate-800 dark:bg-[#131B2E] dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs font-medium text-[#64748B]">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages || isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40 dark:border-slate-800 dark:bg-[#131B2E] dark:text-slate-300"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
