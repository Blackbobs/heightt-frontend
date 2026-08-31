// src/components/dashboard/pages/OrganizationsPage.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useCurrentUser();
  const { user: authUser } = useAuthStore();

  const currentUser = user || authUser;

  const institutionId = currentUser?.studentProfile?.institutionId || "";

  console.log("OrganizationsPage - currentUser:", currentUser);
  console.log("OrganizationsPage - institutionId:", institutionId);

  useEffect(() => {
    refetchUser();
  }, []);

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
  const joinedOrgs = joinedData || [];

  const { data, isLoading, isFetching, isError, error, refetch } = useBrowseOrganizations({
    institutionId,
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const joinMutation = useJoinOrganization();

  const joinedOrgIds = useMemo(
    () => new Set(joinedOrgs.map((m) => m.organizationId)),
    [joinedOrgs],
  );

  const browseOrgs = data?.organizations || [];

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
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading your profile...
          </span>
        </div>
      </div>
    );
  }

  if (!institutionId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
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
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading organizations...
          </span>
        </div>
      </div>
    );
  }

  if (isError && tab === "browse") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
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
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-[#1a5cff]" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">
              Available
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">
            {totalOrganizations}
          </p>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">
              Joined
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">
            {joinedOrgs.length}
          </p>
        </div>
      </div>


      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search organizations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a5cff] animate-spin" />
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
                ? "bg-[#1a5cff] text-white"
                : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]",
            )}
          >
            {t === "browse" ? "Browse" : "My Organizations"}
          </button>
        ))}
      </div>

      {/* Organization list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {tab === "browse" ? (
          filteredBrowse.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-8 h-8 text-[#c8d0db] mb-2" />
              <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
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
                  className="flex items-start gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#1a5cff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] font-semibold text-[#1a1a2e]">
                      {org.name}
                    </p>
                    {org.description && (
                      <p className="text-[0.68rem] text-[#7a8ba3] mt-0.5 line-clamp-2">
                        {org.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[0.58rem] font-semibold px-2 py-0.5 rounded-full bg-[#eef3ff] text-[#1a5cff]">
                        {TYPE_LABELS[org.type] || org.type}
                      </span>
                      <span className="text-[0.58rem] text-[#7a8ba3]">
                        {org.scope?.replace(/_/g, " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {isJoined ? (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoin(org)}
                      disabled={isJoining}
                      className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-white bg-[#1a5cff] hover:bg-[#0f4ad0] px-3 py-1.5 rounded-full shrink-0 border-none cursor-pointer disabled:opacity-60 transition-colors"
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
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
              You haven&apos;t joined any organizations yet
            </p>
            <button
              onClick={() => setTab("browse")}
              className="mt-3 text-[0.75rem] font-semibold text-[#1a5cff] bg-transparent border-none cursor-pointer hover:underline"
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
                className="flex items-start gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors"
              >
                <div className="w-10 h-10 rounded-[12px] bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-semibold text-[#1a1a2e]">
                    {org?.name || "Organization"}
                  </p>
                  {org?.description && (
                    <p className="text-[0.68rem] text-[#7a8ba3] mt-0.5 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                  <p className="text-[0.58rem] text-[#7a8ba3] mt-1">
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
                      ? "text-amber-700 bg-amber-50"
                      : "text-emerald-700 bg-emerald-50",
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8ecf1] bg-white px-3 py-2 text-xs font-semibold text-[#6b7a8f] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs font-medium text-[#7a8ba3]">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages || isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8ecf1] bg-white px-3 py-2 text-xs font-semibold text-[#6b7a8f] disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
