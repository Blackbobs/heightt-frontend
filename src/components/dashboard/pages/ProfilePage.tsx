'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Clock3, GraduationCap, Mail, School, User as UserIcon } from 'lucide-react';
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
  const { data: user, isLoading, isError, refetch } = useCurrentUser();

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
  const academicLevel = student?.currentAcademicLevel?.name || academicLevelValue;

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
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#30343A] dark:bg-[#191B1E] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-extrabold text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">{fullName}</h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {[academicLevel, department?.name].filter(Boolean).join(' • ')}
            </p>
            {student?.matricNumber && (
              <p className="mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Matric: {student.matricNumber}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
              isVerified
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
            }`}>
            {isVerified ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
            {isVerified ? 'Verified student' : 'Verification pending'}
          </div>
        </div>
      </section>

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

export default ProfilePage;
