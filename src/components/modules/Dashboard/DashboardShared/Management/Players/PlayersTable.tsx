/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition, useState } from "react";
import { createPlayersColumns } from "./PlayersColumns";
import SpecialPlayerModal from "./SpecialPlayerModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PlayersTableProps {
  players: any[];
  businesses: any[];
  managerView?: boolean;
  ownerView?: boolean;
}

const PlayersTable = ({ players, businesses, managerView = false, ownerView = false }: PlayersTableProps) => {
  const t = useTranslations("manager.playerManagement");
  const translatedView = managerView || ownerView;
  const columns = createPlayersColumns(translatedView ? (key) => t(key as never) : undefined);
  const [isPending, startTransition] = useTransition();
  const [specialPlayerModal, setSpecialPlayerModal] = useState(false);
  const [player, setPlayer] = useState(null);
  const router = useRouter();

  return (
    <>
      <ManagementTable
        data={players || []}
        columns={columns}
        getRowKey={(player) => player.id}
        isRefreshing={isPending}
        isPlayers={true}
        onToggleSpecial={(player) => {
          setSpecialPlayerModal(true);
          setPlayer(player);
        }}
      />

      <SpecialPlayerModal
        open={specialPlayerModal}
        onOpenChange={(open) => {
          startTransition(() => {
            setSpecialPlayerModal(open);
          });
        }}
        player={player}
        businesses={businesses || []}
        onSuccess={() => {
          startTransition(() => {
            router.refresh();
            setSpecialPlayerModal(false);
          });
        }}
        isManual={false}
        managerView={translatedView}
      />
    </>
  );
};

export default PlayersTable;
