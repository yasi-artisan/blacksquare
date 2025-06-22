import { getEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";

const SITE_SETTINGS_ID = "site";

/**
 * Type for site settings
 */
export type SiteSettings = CollectionEntry<"settings">["data"];

/**
 * Cache for the site settings to avoid repeated database queries
 */
let settingsCache: SiteSettings | null = null;

/**
 * Get site settings from the settings collection
 *
 * @param id - The ID of the settings entry (defaults to 'site')
 * @returns The site settings object
 */
export async function getSiteSettings(
  id: string = SITE_SETTINGS_ID
): Promise<SiteSettings> {
  // Return cached settings if available
  if (settingsCache) {
    return settingsCache;
  }

  try {
    // Get the settings entry from the content collection
    const settingsEntry = await getEntry("settings", id);

    if (!settingsEntry) {
      throw new Error(`Settings with ID "${id}" not found`);
    }

    // Cache the settings for future calls
    settingsCache = settingsEntry.data;

    return settingsEntry.data;
  } catch (error) {
    console.error(`Error loading site settings (${id}):`, error);

    return {
      sitename: "BlackSquare Gallery",
      contact: {
        email: "info@blacksquaregallery.com",
      },
    };
  }
}

/**
 * Clear the settings cache
 * Useful when settings may have changed during development
 */
export function clearSettingsCache(): void {
  settingsCache = null;
}

/**
 * Helper function to get a feature flag value
 *
 * @param featureName - The name of the feature to check
 * @param settings - Optional settings object (will be fetched if not provided)
 * @returns Boolean indicating if the feature is enabled
 */
export async function isFeatureEnabled(
  featureName: keyof NonNullable<SiteSettings["features"]>,
  settings?: SiteSettings
): Promise<boolean> {
  const siteSettings = settings || (await getSiteSettings());

  if (!siteSettings.features) {
    return false;
  }

  return !!siteSettings.features[featureName];
}
