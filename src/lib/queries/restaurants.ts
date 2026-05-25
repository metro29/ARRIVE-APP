import { resolveCityContextForRequest } from "@/lib/geo/cityContext";
import {
  getRestaurantById as getRestaurantByIdData,
  getRestaurantByIdAdmin,
  getActiveRestaurantsForMetro,
  getActiveRestaurants,
  getRestaurantsByCity,
  isMockRestaurant,
  isBookableRestaurant,
  listAllRestaurantsAdmin,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
} from "@/lib/data/restaurants";

export {
  getFilteredRestaurants,
  rankRestaurants,
  discoverRestaurants,
  enrichRestaurant,
  computeMatchScore,
  getPerfectForLabel,
} from "@/lib/discover/restaurant-discovery";

export {
  getRestaurantByIdAdmin,
  getRestaurantsByCity,
  getActiveRestaurants,
  listAllRestaurantsAdmin,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  isBookableRestaurant,
};

export async function getRestaurants() {
  const { city } = await resolveCityContextForRequest();
  return getActiveRestaurantsForMetro(city);
}

/** @deprecated Use getRestaurants */
export const listRestaurantsForDiscover = getRestaurants;

export async function getRestaurantById(id: string) {
  const { city } = await resolveCityContextForRequest();
  return getRestaurantByIdData({ id, citySlug: city });
}

export async function getRestaurantByIdForBooking(id: string) {
  return getRestaurantByIdData({ id, includeInactive: true });
}

export { isMockRestaurant };
