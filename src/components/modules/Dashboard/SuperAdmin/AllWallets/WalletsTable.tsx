/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getWalletColumns } from "./WalletsColumns";
import WeeklyPaymentModal from "../WeeklyPaymentToOwners/WeeklyPayment";
import SettleFeeModal from "../SettleFeeManual/SettleFeeManual";
import { useTranslations } from "next-intl";

interface WalletsTableProps {
  wallets: any[];
}

const WalletsTable = ({ wallets }: WalletsTableProps) => {
  const t = useTranslations("admin.wallets");
  const walletT = useTranslations("wallet");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedRecordWallet, setSelectedRecordWallet] = useState<any | null>(
    null,
  );
  const [selectedSettleWallet, setSelectedSettleWallet] = useState<any | null>(
    null,
  );

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <ManagementTable
        data={wallets || []}
        columns={getWalletColumns(t, walletT)}
        getRowKey={(wallet) => wallet.walletId || wallet.id}
        onRecordPayment={(wallet) => setSelectedRecordWallet(wallet)}
        onSettleFee={(wallet) => setSelectedSettleWallet(wallet)}
        isRefreshing={isPending}
      />

      {/* Record Payment Modal */}
      {selectedRecordWallet && (
        <WeeklyPaymentModal
          isOpen={!!selectedRecordWallet}
          onClose={() => setSelectedRecordWallet(null)}
          businessId={selectedRecordWallet.businessId}
          businessName={selectedRecordWallet.business?.name}
          onSuccess={handleRefresh}
        />
      )}

      {/* Settle App Fee Modal */}
      {selectedSettleWallet && (
        <SettleFeeModal
          isOpen={!!selectedSettleWallet}
          onClose={() => setSelectedSettleWallet(null)}
          businessId={selectedSettleWallet.businessId}
          businessName={selectedSettleWallet.business?.name}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
};

export default WalletsTable;
