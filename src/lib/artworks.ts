import { getCollection, type CollectionEntry } from "astro:content";

/**
 * A type alias for an artwork collection entry for better readability.
 */
type Artwork = CollectionEntry<"artwork">;

/**
 * Defines the shape of the object containing lists of unique artwork attributes.
 */
export type ArtworkAttributes = {
  tags: string[];
  years: number[];
  mediums: string[];
};

/**
 * A generic utility to filter out falsy values and return a unique, sorted array.
 * It handles both numbers and strings correctly.
 * @param items - An array of strings or numbers to process.
 * @returns A new array containing the unique, sorted, and truthy items.
 */
const getUniqueSorted = <T extends string | number>(items: T[]): T[] => {
  const uniqueItems = [...new Set(items.filter(Boolean))];

  // Sort numbers numerically and strings lexicographically.
  uniqueItems.sort((a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a - b; // Ascending numerical sort
    }
    return String(a).localeCompare(String(b)); // Ascending string sort
  });

  return uniqueItems;
};

/**
 * Extracts and collates unique, sorted attributes from a list of artworks.
 * @param artworks - An array of artwork collection entries.
 * @returns An object containing arrays of unique tags, years (newest first), and mediums.
 */
export function getAttrsList(artworks: Artwork[]): ArtworkAttributes {
  // Use flatMap to efficiently extract and flatten nested arrays of tags and mediums.
  const allTags = artworks.flatMap((artwork) => artwork.data.tags || []);
  const allMediums = artworks.flatMap((artwork) => artwork.data.medium || []);

  // Use map and a type guard to safely extract years.
  const allYears = artworks
    .map((artwork) => artwork.data.year)
    .filter((y): y is number => y != null);

  return {
    tags: getUniqueSorted(allTags),
    years: getUniqueSorted(allYears).reverse(), // Reverse to show newest years first
    mediums: getUniqueSorted(allMediums),
  };
}

/**
 * Fetches all artworks from the Astro content collection, filtering out any drafts.
 * @returns A promise that resolves to an array of non-draft artwork entries.
 */
export async function getAllArtworks(): Promise<Artwork[]> {
  return await getCollection("artwork", (artwork) => !artwork.data.isDraft);
}

/**
 * Groups a list of artworks by their year of creation.
 * Artworks without a specified year are placed in an "undated" group.
 * @param artworks - An array of artwork collection entries.
 * @returns A record object where each key is a year (or "undated") and the value is an array of artworks from that year.
 */
export function groupArtworksByYear(
  artworks: Artwork[],
): Record<string, Artwork[]> {
  return artworks.reduce<Record<string, Artwork[]>>((acc, artwork) => {
    const year = artwork.data.year?.toString() || "undated";
    // This is a concise way to initialize the array if it doesn't exist and push the item.
    (acc[year] = acc[year] || []).push(artwork);
    return acc;
  }, {});
}
