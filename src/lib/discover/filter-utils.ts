import type { DiscoverFilters } from "@/types/discover";

export function groupSizeRangeMin(range: DiscoverFilters["group_size"]): number {
  switch (range) {
    case "1-5":
      return 1;
    case "6-12":
      return 6;
    case "13-25":
      return 13;
    case "25+":
      return 25;
    default:
      return 0;
  }
}
