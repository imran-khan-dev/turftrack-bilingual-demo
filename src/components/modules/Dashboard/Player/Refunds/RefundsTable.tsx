/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition } from "react";
import { useRefundColumns } from "./RefundsColumns";

interface PatientsTableProps {
  bookings: any[];
}

const RefundsTable = ({ bookings }: PatientsTableProps) => {
  const [isPending, startTransition] = useTransition();
  const refundColumns = useRefundColumns();

  return (
    <>
      <ManagementTable
        data={bookings || []}
        columns={refundColumns}
        getRowKey={(booking) => booking.id}
        isRefreshing={isPending}
        isBookings={true}
      />
    </>
  );
};

export default RefundsTable;
