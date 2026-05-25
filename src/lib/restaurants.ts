/** @deprecated Import from @/lib/queries/restaurants or @/lib/data/restaurants */
export {
  getRestaurantById,
  getRestaurants,
  isMockRestaurant,
  isBookableRestaurant,
  listRestaurantsForDiscover,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  getActiveRestaurants,
  getRestaurantsByCity,
} from "@/lib/queries/restaurants";

export {
  enrichRestaurant,
  getFilteredRestaurants,
  discoverRestaurants,
  rankRestaurants,
  computeMatchScore,
  getPerfectForLabel,
} from "@/lib/discover/restaurant-discovery";
