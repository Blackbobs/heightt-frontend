'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, GraduationCap, Loader2, Mail, RefreshCw, School, User as UserIcon } from 'lucide-react';
import { institutionsApi, type Department, type Faculty, type Institution } from '@/lib/api/institutions';
import { queryKeys } from '@/lib/api/keys';
import { useCurrentUser } from '@/hooks/queries/useUser';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#fafbff] transition-colors">
      <div className="w-8 h-8 rounded-[8px] bg-[#f0f2f5] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#6b7a8f]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.62rem] text-[#7a8ba3] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e] mt-0.5 truncate">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

function normaliseList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return [];
}

export function ProfilePage() {
  const { data: user, isLoading, isError, refetch, isFetching } = useCurrentUser();

  const student = user?.studentProfile;
  const institutionId = student?.institutionId || '';
  const facultyId = student?.facultyId || '';

  const { data: institution } = useQuery<Institution>({
    queryKey: queryKeys.institutions.one(institutionId),
    queryFn: () => institutionsApi.getInstitution(institutionId),
    enabled: Boolean(institutionId),
    staleTime: 10 * 60 * 1000,
  });
  const { data: facultiesResponse } = useQuery({
    queryKey: queryKeys.institutions.faculties(institutionId),
    queryFn: () => institutionsApi.getFacultiesByInstitution(institutionId),
    enabled: Boolean(institutionId && facultyId),
    staleTime: 10 * 60 * 1000,
  });
  const { data: departmentsResponse } = useQuery({
    queryKey: queryKeys.institutions.departments(facultyId),
    queryFn: () => institutionsApi.getDepartmentsByFaculty(facultyId),
    enabled: Boolean(facultyId && student?.departmentId),
    staleTime: 10 * 60 * 1000,
  });

  const faculty = normaliseList<Faculty>(facultiesResponse).find((item) => item.id === facultyId);
  const department = normaliseList<Department>(departmentsResponse).find((item) => item.id === student?.departmentId);

  const fullName = useMemo(() => {
    if (!user) return '';
    return [user.profile?.firstName, user.profile?.middleName, user.profile?.lastName].filter(Boolean).join(' ') || user.username;
  }, [user]);
  const initials = useMemo(() => {
    const first = user?.profile?.firstName?.[0] || user?.username?.[0] || '';
    const last = user?.profile?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'U';
  }, [user]);
  const academicLevelValue = student?.currentAcademicLevelId;
  const academicLevel = student?.currentAcademicLevel?.name ||
    (academicLevelValue && /^\d{3}$/.test(academicLevelValue)
      ? `${academicLevelValue} Level`
      : undefined);
  const verificationStatus = user?.profile?.verificationStatus || student?.verificationStatus;
  const isVerified = user?.emailVerified || verificationStatus === 'VERIFIED';

  if (isLoading) {
    return <div className="min-h-[360px] flex items-center justify-center" aria-label="Loading profile"><Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" /></div>;
  }
  if (isError || !user) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center text-center px-6">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <h2 className="text-base font-bold text-[#1a1a2e]">We couldn’t load your profile</h2>
        <p className="text-sm text-[#7a8ba3] mt-1">Check your connection and try again.</p>
        <button type="button" onClick={() => refetch()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1a5cff] px-4 py-2.5 text-sm font-semibold text-white">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[22px] px-6 py-8 text-white relative overflow-hidden text-center">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center text-[1.6rem] font-extrabold mx-auto mb-4">{initials}</div>
        <h1 className="text-[1.25rem] font-extrabold tracking-tight">{fullName}</h1>
        <p className="text-[0.72rem] text-white/70 mt-1">{[academicLevel, department?.name].filter(Boolean).join(' · ') || user.username}</p>
        {student?.matricNumber && <p className="text-[0.68rem] text-white/50 mt-0.5">Matric No: {student.matricNumber}</p>}
        <div className="inline-flex items-center gap-1.5 mt-4 bg-white/15 px-4 py-1.5 rounded-full">
          {isVerified ? <CheckCircle2 className="w-3 h-3 text-emerald-300" /> : <AlertCircle className="w-3 h-3 text-amber-300" />}
          <span className="text-[0.68rem] font-semibold text-white">{isVerified ? 'Verified account' : 'Verification pending'} · Since {new Date(user.createdAt).getFullYear()}</span>
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h2 className="text-[0.9rem] font-semibold text-[#1a1a2e]">Personal Information</h2>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          <InfoRow icon={UserIcon} label="Full Name" value={fullName} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
        </div>
      </div>

      <div>
        <h2 className="text-[0.9rem] font-semibold text-[#1a1a2e] mb-3">Academic Information</h2>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          <InfoRow icon={School} label="Institution" value={institution?.name} />
          <InfoRow icon={GraduationCap} label="Faculty" value={faculty?.name} />
          <InfoRow icon={GraduationCap} label="Department" value={department?.name} />
          <InfoRow icon={GraduationCap} label="Academic Level" value={academicLevel} />
          <InfoRow icon={UserIcon} label="Matric Number" value={student?.matricNumber} />
        </div>
      </div>
    </div>
  );
}
