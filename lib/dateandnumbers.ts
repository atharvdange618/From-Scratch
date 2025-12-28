export const formatExpiryDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "Expires in 1 day";
  return `Expires in ${diffDays} days`;
};

export const formatDateTimeIST = (date: string | number | Date): string => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const formatTimeIST = (date: Date | string | number) =>
  new Date(date).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

export const formatDateTimeLocal = (isoString: string | null | undefined) => {
  if (!isoString) return undefined;
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Format dates (Indian style: 11 Nov 2025)
 */
export const formatDate = (date: Date | string | number) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

/**
 * Format numbers in Indian style (1,23,456)
 */
export const formatNumber = (
  number: number | string,
  locale: string = "en-IN"
): string => {
  const num = Number(number);
  if (isNaN(num)) return "NaN";
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format relative time (e.g., "5 mins ago")
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
};
