import React from 'react';

interface SectionTitleProps {
  title: string;
  linkLabel?: string;
}

export function SectionTitle({ title, linkLabel }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e]">{title}</h3>
      {linkLabel && (
        <button className="text-[0.7rem] font-medium text-[#1a5cff] cursor-pointer border-none bg-transparent hover:underline">
          {linkLabel}
        </button>
      )}
    </div>
  );
}
