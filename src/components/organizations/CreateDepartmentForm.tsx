"use client";

import { FormEvent, useState } from "react";
import { institutionsApi } from "@/lib/api/institutions";

const LEVEL_COUNTS = [4, 5, 6, 7] as const;

interface CreateDepartmentFormProps {
  facultyId: string;
  onCreated?: (department: unknown) => void;
}

export function CreateDepartmentForm({
  facultyId,
  onCreated,
}: CreateDepartmentFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [promotionType, setPromotionType] = useState<"AUTOMATIC" | "MANUAL">(
    "AUTOMATIC",
  );
  const [numberOfLevels, setNumberOfLevels] = useState<4 | 5 | 6 | 7>(4);
  const [levelNames, setLevelNames] = useState<string[]>(() =>
    Array(4).fill(""),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeLevelCount = (value: string) => {
    const count = Number(value) as 4 | 5 | 6 | 7;
    setNumberOfLevels(count);
    setLevelNames((current) =>
      Array.from({ length: count }, (_, index) => current[index] || ""),
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const names = levelNames.map((label) => label.trim());
    const hasNames = names.some(Boolean);
    if (!name.trim() || !code.trim() || !facultyId) {
      setError("Name, code, and faculty are required.");
      return;
    }
    if (
      hasNames &&
      (names.length !== numberOfLevels || names.some((label) => !label))
    ) {
      setError(
        `Provide exactly ${numberOfLevels} level names, or leave all names empty.`,
      );
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const department = await institutionsApi.createDepartment({
        name: name.trim(),
        code: code.trim(),
        facultyId,
        promotionType,
        numberOfLevels,
        ...(hasNames ? { customLevelNames: names } : {}),
      });
      onCreated?.(department);
    } catch {
      setError("Could not create the department. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">
        Department name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Computer Science"
        />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Code
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="CSC"
        />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Promotion type
        <select
          value={promotionType}
          onChange={(event) =>
            setPromotionType(event.target.value as "AUTOMATIC" | "MANUAL")
          }
          className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Number of levels
        <select
          value={numberOfLevels}
          onChange={(event) => changeLevelCount(event.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2"
        >
          {LEVEL_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </label>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">
          Level names{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </p>
        {levelNames.map((label, index) => (
          <input
            key={index}
            value={label}
            onChange={(event) =>
              setLevelNames((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index ? event.target.value : item,
                ),
              )
            }
            className="block w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder={`${(index + 1) * 100} Level`}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create department"}
      </button>
    </form>
  );
}
