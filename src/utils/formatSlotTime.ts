export const formatSlotTime = (startStr: string, endStr: string) => {
  const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  try {
    return `${new Date(startStr).toLocaleTimeString("en-US", opts)} - ${new Date(endStr).toLocaleTimeString("en-US", opts)}`;
  } catch {
    return "Standard Time Windows";
  }
};