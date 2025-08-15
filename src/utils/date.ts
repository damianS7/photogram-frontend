export function dateUtils() {
  function toDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  }

  function toDatetime(dateStr: string): string {
    const date = new Date(dateStr);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return {
    toDate,
    toDatetime,
  };
}
