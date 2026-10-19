"use client";

import { LucideIcon, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

const ManagementPageHeader = ({
  title,
  description,
  action,
  children,
}: ManagementPageHeaderProps) => {
  const Icon = action?.icon || Plus;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase sm:normal-case sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3 self-start sm:self-center">
        {children}
        {action && (
          <Button 
            onClick={action.onClick}
            className="inline-flex items-center cursor-pointer gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Icon className="h-4 w-4 stroke-[2.5]" />
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManagementPageHeader;