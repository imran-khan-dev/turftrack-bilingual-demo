/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition } from "react";
import { getBusinessStatementColumns } from "./BusinessStatementColumns";
import { useTranslations } from "next-intl";

interface PatientsTableProps {
  data: any[];
}

const BusinessStatementTable = ({ data }: PatientsTableProps) => {
  const t = useTranslations("owner.statement");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <ManagementTable
        data={data || []}
        columns={getBusinessStatementColumns(t)}
        getRowKey={(data) => data.id}
        isRefreshing={isPending}
        isBookings={false}
      />
    </>
  );
};

export default BusinessStatementTable;
