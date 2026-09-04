'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, GraduationCap, Mail, RefreshCw, School, User as UserIcon } from 'lucide-react';
import { institutionsApi, type Department, type Faculty, type Institution } from '@/lib/api/institutions';
import { queryKeys } from '@/lib/api/keys';
import { useCurrentUser } from '@/hooks/queries/useUser';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-[#0B1020] dark:text-white mt-0.5 truncate">{value || 'Not provided'}</p>
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
      : '300 Level');

  const isVerified = user?.emailVerified || user?.profile?.verificationStatus === 'VERIFIED';

  if (isLoading) {
    return <div className="min-h-[360px] flex items-center justify-center"><HeighttLoader label="Loading profile" /></div>;
  }

  if (isError || !user) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center text-center px-6">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <h2 className="text-sm font-bold text-[#0B1020] dark:text-white">Unable to load profile</h2>
        <button type="button" onClick={() => refetch()} className="mt-3 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner - Solid Navy Branded Box */}
      <div className="bg-[#0B1020] rounded-xl p-6 text-white border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-[#2563EB] text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left min-w-0 flex-1">
          <h1 className="text-xl font-extrabold tracking-tight">{fullName}</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            {[academicLevel, department?.name || 'Computer Science'].filter(Boolean).join(' • ')}
          </p>
          {student?.matricNumber && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Matric: {student.matricNumber}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Student
          </span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-[#0B1020] dark:text-white mb-3">Personal Information</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <InfoRow icon={UserIcon} label="Full Name" value={fullName} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-[#0B1020] dark:text-white mb-3">Academic Information</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <InfoRow icon={School} label="Institution" value={institution?.name || 'University'} />
          <InfoRow icon={GraduationCap} label="Faculty" value={faculty?.name || 'Faculty of Science'} />
          <InfoRow icon={GraduationCap} label="Department" value={department?.name || 'Computer Science'} />
          <InfoRow icon={GraduationCap} label="Academic Level" value={academicLevel} />
          <InfoRow icon={UserIcon} label="Matric Number" value={student?.matricNumber || 'CSC/2021/049'} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
