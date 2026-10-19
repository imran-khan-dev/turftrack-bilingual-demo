/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import SpecialPlayerModal from "./SpecialPlayerModal";
import { useTranslations } from "next-intl";

const PlayersManagementHeader = ({ businesses, managerView = false, ownerView = false }: { businesses: any; managerView?: boolean; ownerView?: boolean }) => {
  const t = useTranslations("manager.playerManagement");
  const translatedView = managerView || ownerView;
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <ManagementPageHeader
        title={translatedView ? t("title") : "Players Management"}
        description={translatedView ? t("description") : "Manage and track players on your business."}
        action={{
          label: translatedView ? t("addSpecial") : "Manual Special Entry",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <SpecialPlayerModal
        open={isDialogOpen}
        onOpenChange={(open) => {
          startTransition(() => {
            setIsDialogOpen(open);
          });
        }}
        businesses={businesses || []}
        onSuccess={() => {
          startTransition(() => {
            router.refresh();
            setIsDialogOpen(false);
          });
        }}
        isManual={true}
        managerView={translatedView}
      />
    </>
  );
};

export default PlayersManagementHeader;
