/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useState, useTransition } from "react";
import { createBookingsColumns } from "./BookingsColumns";
import InvoiceModal from "./InvoiceModal";
import BookingDetailsModal from "./BookingDetailsModal";
import CancelBookingModal from "./CancelBookingModal";
import RescheduleBookingDrawer from "../Reschedule/RescheduleBookingDrawer";
import { useTranslations } from "next-intl";

interface PatientsTableProps {
  bookings: any[];
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

const BookingsTable = ({ bookings, playerView = false, managerView = false, ownerView = false }: PatientsTableProps) => {
  const playerT = useTranslations("player.bookingsList");
  const translated = playerView || managerView || ownerView;
  const columns = createBookingsColumns(translated ? (key) => playerT(key as never) : undefined);
  const [isPending, startTransition] = useTransition();
  const [selectedBookingIdInvoice, setSelectedBookingIdInvoice] = useState<
    string | null
  >(null);
  const [selectedBookingIdView, setSelectedBookingIdView] = useState<
    string | null
  >(null);

  const [selectedBookingIdCancel, setSelectedBookingIdCancel] = useState<
    string | null
  >(null);

  const [selectedBookingIdReschedule, setSelectedBookingIdReschedule] =
    useState<any | null>(null);

  return (
    <>
      <ManagementTable
        data={bookings || []}
        columns={columns}
        getRowKey={(booking) => booking.id}
        onView={(booking) => setSelectedBookingIdView(booking.id)}
        onInvoice={(booking) => setSelectedBookingIdInvoice(booking.id)}
        isRefreshing={isPending}
        isBookings={true}
        onRescheduleBooking={(booking) =>
          setSelectedBookingIdReschedule(booking)
        }
        onCancelBooking={(booking) => setSelectedBookingIdCancel(booking.id)}
      />

      <InvoiceModal
        bookingId={selectedBookingIdInvoice}
        isOpen={!!selectedBookingIdInvoice}
        onClose={() => setSelectedBookingIdInvoice(null)}
        playerView={playerView}
        managerView={managerView}
        ownerView={ownerView}
      />
      <BookingDetailsModal
        bookingId={selectedBookingIdView}
        isOpen={!!selectedBookingIdView}
        onClose={() => setSelectedBookingIdView(null)}
        playerView={playerView}
        managerView={managerView}
        ownerView={ownerView}
      />

      <CancelBookingModal
        bookingId={selectedBookingIdCancel}
        isOpen={!!selectedBookingIdCancel}
        onClose={() => setSelectedBookingIdCancel(null)}
        playerView={playerView}
        managerView={managerView}
        ownerView={ownerView}
      />

      <RescheduleBookingDrawer
        isOpen={!!selectedBookingIdReschedule}
        onClose={() => {
          setSelectedBookingIdReschedule(null);
          setSelectedBookingIdReschedule(null);
        }}
        bookingId={selectedBookingIdReschedule?.id}
        managerView={managerView}
        ownerView={ownerView}
        playerView={playerView}
        onSuccess={() => {
          startTransition(() => {
            setSelectedBookingIdReschedule(null);
          });
        }}
      />
    </>
  );
};

export default BookingsTable;
