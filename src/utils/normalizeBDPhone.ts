export const normalizeBdPhone = (phone: string) => {
  if (!phone) return phone;

  let cleaned = phone.trim();

  // remove spaces, dashes, etc.
  cleaned = cleaned.replace(/[\s-]/g, "");

  // +8801XXXXXXXXX → 01XXXXXXXXX
  if (cleaned.startsWith("+880")) {
    return "0" + cleaned.slice(4);
  }

  // 8801XXXXXXXXX → 01XXXXXXXXX
  if (cleaned.startsWith("880")) {
    return "0" + cleaned.slice(3);
  }

  // already 01XXXXXXXXX → return as is
  if (cleaned.startsWith("01")) {
    return cleaned;
  }

  return cleaned;
};