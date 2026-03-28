/**
 * Format a date to a relative time string (e.g., "2m ago", "Yesterday at 3:45 PM")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24 && isSameDay(now, d)) {
    return timeStr;
  }
  if (diffDays === 1 || isYesterday(now, d)) {
    return `Yesterday at ${timeStr}`;
  }
  if (diffDays < 7) {
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    return `${dayName} at ${timeStr}`;
  }

  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
    }) + ` at ${timeStr}`
  );
}

/**
 * Format date for date dividers
 */
export function formatDateDivider(date) {
  const now = new Date();
  const d = new Date(date);

  if (isSameDay(now, d)) {
    return "Today";
  }
  if (isYesterday(now, d)) {
    return "Yesterday";
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get date key for grouping messages (YYYY-MM-DD format)
 */
export function getDateKey(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(now, date) {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, date);
}
