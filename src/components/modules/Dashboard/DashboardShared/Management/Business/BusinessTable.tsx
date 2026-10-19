/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition, useState } from "react";
import { getBusinessColumns } from "./BusinessColumns";
import BusinessDetailsModal from "./BusinessDetailsModal";
import BusinessUpdateModal from "./BusinessUpdateModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PatientsTableProps {
  businesses: any[];
  role?: string;
}

const BusinessTable = ({ businesses, role }: PatientsTableProps) => {
  const t = useTranslations("owner.business");
  const [isPending, startTransition] = useTransition();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);

  const router = useRouter();

  return (
    <>
      <ManagementTable
        data={businesses || []}
        columns={getBusinessColumns(role === "OWNER" || role === "SUPER_ADMIN" ? t : undefined)}
        getRowKey={(business) => business.id}
        onView={(business) => {
          setSelectedBusiness(business);
          startTransition(() => {
            setDetailsOpen(true);
          });
        }}
        onEdit={(business) => {
          setSelectedBusiness(business);
          setUpdateOpen(true);
        }}
        isRefreshing={isPending}
      />

      <BusinessDetailsModal
        open={detailsOpen}
        slug={selectedBusiness?.slug || ""}
        role={role}
        onOpenChange={setDetailsOpen}
      />

      <BusinessUpdateModal
        key={selectedBusiness?.id}
        open={updateOpen}
        business={selectedBusiness}
        role={role}
        onOpenChange={setUpdateOpen}
        onSuccess={() => {
          setUpdateOpen(false);
          router.refresh();
        }}
      />
    </>
  );
};

export default BusinessTable;
