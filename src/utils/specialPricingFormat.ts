/**
 * Formats a specificDate value for display. Handles both a plain
 * "YYYY-MM-DD" string and a full ISO datetime string
 * (e.g. "2026-07-17T00:00:00.000Z"), which is how it currently comes
 * back from the API.
 */
export const formatSpecialPricingDate = (rawDate: string): string => {
  const datePart = rawDate.split("T")[0];
  const date = new Date(`${datePart}T00:00:00`);

  if (Number.isNaN(date.getTime())) return rawDate;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Converts a 24h "HH:mm" value to a friendly 12h "h:mm AM/PM" string.
 * Also tolerates a full ISO datetime string by extracting the HH:mm part.
 */
const to12Hour = (rawTime: string): string => {
  const timePart = rawTime.includes("T")
    ? rawTime.split("T")[1]?.slice(0, 5)
    : rawTime;

  if (!timePart) return rawTime;

  const [hoursStr, minutesStr] = timePart.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return rawTime;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatSpecialPricingTimeRange = (
  start: string,
  end: string,
): string => `${to12Hour(start)} – ${to12Hour(end)}`;