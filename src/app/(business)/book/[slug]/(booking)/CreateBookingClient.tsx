/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { Business, BusinessField } from "@/types/business";
import { ICreateBookingPayload, SelectedSlot, Slot } from "@/types/booking";
import { useRouter, useSearchParams } from "next/navigation";
import { checkUserBusinessAccess } from "@/utils/checkUserBusinessAccess";
import { usePathname } from "next/navigation";
import CreateBookingPageSkeleton from "./CreateBookingPageSkeleton";
import BookingSidebar from "@/components/modules/Business/CreateBooking/BookingSidebar";
import SlotPicker from "@/components/modules/Business/CreateBooking/SlotPicker";
import BusinessInfoSection from "@/components/modules/Business/CreateBooking/BusinessInfoSection";
import AuthModal from "@/components/modules/Business/CreateBooking/AuthModal";
import InactiveAccountModal from "@/components/modules/Business/CreateBooking/InactiveModal";
import BusinessAccessDenied from "@/components/modules/Business/CreateBooking/BusinessAccessDenied";
import FieldSelector from "@/components/modules/Business/CreateBooking/FieldSelector";
import DateSelector from "@/components/modules/Business/CreateBooking/DateSelector";
import { createBooking } from "@/services/booking/createBooking";
import { toast } from "sonner";
import { formatLocalDate } from "@/utils/formatLocalDate";
import { getFieldAvailability } from "@/services/booking/getFieldAvailability";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  business: Business;
  fields: BusinessField[];
  user: any;
  isAuthority?: boolean;
}

export default function CreateBookingClient({
  business,
  fields,
  user,
  isAuthority,
}: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();

  const isLoggedIn = Boolean(user && user.id);

  const businessAccess =
    isLoggedIn && business?.id
      ? checkUserBusinessAccess(user, business.id)
      : false;

  const isUserActive = user?.isActive === "ACTIVE";

  const isActiveInBusiness = !isLoggedIn
    ? true
    : isAuthority
      ? true
      : businessAccess !== false && businessAccess?.status === "ACTIVE";

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [selectedField, setSelectedField] = useState<string>(
    fields[0]?.id || "",
  );
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [agreedToBusinessTerms, setAgreedToBusinessTerms] = useState(false);
  const [agreedToAppTerms, setAgreedToAppTerms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoading, setPageLoading] = useState(true);

  const currentPath =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const dates = useMemo(() => {
    const horizonDays = Number(business.bookingHorizonDays || 7);
    return Array.from({ length: horizonDays }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);

      return {
        dayName: d.toLocaleDateString(locale, { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString(locale, { month: "short" }),
        fullISO: formatLocalDate(d),
      };
    });
  }, [business.bookingHorizonDays, locale]);

  useEffect(() => {
    if (!business || !fields) return;

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [business, fields]);

  useEffect(() => {
    if (!selectedField) return;

    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const data = await getFieldAvailability({
          fieldId: selectedField,
          date: selectedDate,
        });

        setSlots(data?.data || []);
      } catch (error) {
        console.error("Availability Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedField, selectedDate, backendUrl]);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const toggleSlot = (slot: Slot, dateContext: string) => {
    // MODIFICATION: Intercept slot selection only when an authority interacts with it
    if (isAuthority) {
      setShowAuthModal(true);
      toast.error(
        t("authorityCannotBook"),
      );
      return;
    }

    const isAlreadySelected = selectedSlots.some(
      (s) =>
        s.date === dateContext &&
        s.fieldId === selectedField &&
        s.startTime === slot.startTime,
    );

    if (isAlreadySelected) {
      setSelectedSlots((prev) =>
        prev.filter(
          (s) =>
            !(
              s.date === dateContext &&
              s.fieldId === selectedField &&
              s.startTime === slot.startTime
            ),
        ),
      );
    } else {
      if (selectedSlots.length >= business.maxSlotsPerBooking) {
        setWarning(
          t("limitReached", { max: business.maxSlotsPerBooking }),
        );
        return;
      }

      setSelectedSlots((prev) => [
        ...prev,
        {
          fieldId: selectedField,
          date: dateContext,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
        },
      ]);
    }
  };

  const totalPrice = selectedSlots.reduce((acc, curr) => acc + curr.price, 0);

  const prepareBookingData = () => {
    const grouped = selectedSlots.reduce((acc: any, slot) => {
      const key = `${slot.fieldId}-${slot.date}`;

      if (!acc[key]) {
        acc[key] = {
          fieldId: slot.fieldId,
          date: slot.date,
          slots: [],
        };
      }

      acc[key].slots.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      return acc;
    }, {});

    return {
      bookingItems: Object.values(grouped),
    };
  };

  const handleCheckout = async () => {
    // MODIFICATION: Safety intercept on checkout button click for authority profiles
    if (isAuthority) {
      setShowAuthModal(true);
      toast.error(t("bookingForbidden"));
      return;
    }

    if (selectedSlots.length === 0) {
      setWarning(t("selectSlotBeforeCheckout"));
      return;
    }

    setCheckoutLoading(true);
    const payload = prepareBookingData();
    const cleanPayload = JSON.parse(JSON.stringify(payload));

    try {
      const response = await createBooking(
        cleanPayload as ICreateBookingPayload,
      );

      if (response.success) {
        router.push(
          `/book/${business.slug}/confirm?cartId=${response.data.cartId}&from=${encodeURIComponent(currentPath)}`,
        );
      } else {
        const errorMsg =
          response.message || t("checkoutSomethingWrong");
        setWarning(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Booking Checkout Error:", error);

      const safetyMsg =
        error?.message || t("networkRetry");
      toast.error(safetyMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (pageLoading) {
    return <CreateBookingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Access Denied layout only flags absolute non-authority structural bans */}
      {isLoggedIn === true && !isAuthority && isActiveInBusiness === false && (
        <BusinessAccessDenied business={business} />
      )}

      {isActiveInBusiness && (
        <main className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-12 overflow-hidden">
              <BusinessInfoSection business={business} />

              <FieldSelector
                fields={fields}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
              />

              <DateSelector
                dates={dates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <SlotPicker
                slots={slots}
                selectedSlots={selectedSlots}
                selectedDate={selectedDate}
                selectedField={selectedField}
                business={business}
                isLoading={isLoading}
                warning={warning}
                isLoggedIn={isLoggedIn}
                isUserActive={isUserActive}
                setShowAuthModal={setShowAuthModal}
                setShowInactiveModal={setShowInactiveModal}
                toggleSlot={toggleSlot}
              />
            </div>

            <BookingSidebar
              selectedSlots={selectedSlots}
              fields={fields}
              totalPrice={totalPrice}
              agreedToBusinessTerms={agreedToBusinessTerms}
              agreedToAppTerms={agreedToAppTerms}
              setAgreedToBusinessTerms={setAgreedToBusinessTerms}
              setAgreedToAppTerms={setAgreedToAppTerms}
              handleCheckout={handleCheckout}
              checkoutLoading={checkoutLoading}
              toggleSlot={toggleSlot}
            />
          </div>
        </main>
      )}

      <AuthModal
        show={showAuthModal}
        slug={business.slug}
        onClose={() => setShowAuthModal(false)}
      />

      <InactiveAccountModal
        show={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
      />
    </div>
  );
}
