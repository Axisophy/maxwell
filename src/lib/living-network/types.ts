export type TaxonRank =
  | "domain"
  | "kingdom"
  | "phylum"
  | "class"
  | "order"
  | "family"
  | "genus"
  | "species";

export interface Taxon {
  id: string;                           // URL-safe slug: "animalia", "chordata"
  name: string;                         // Display name: "Animalia"
  rank: TaxonRank;

  // Hierarchy
  parentId: string | null;
  childIds: string[];

  // External IDs (for API lookups)
  ottId?: number;                       // Open Tree of Life ID

  // Status
  isExtinct: boolean;

  // Stats
  speciesCount?: number;
  childGroupCount?: number;             // Number of phyla (if kingdom), classes (if phylum), etc.

  // Temporal
  firstAppearance?: {
    period: string;                     // "Cambrian"
    periodSlug: string;                 // "cambrian" - for linking
    mya: number;                        // 538
  };
  lastAppearance?: {                    // Only for extinct groups
    period: string;
    periodSlug: string;
    mya: number;
  };

  // Content
  commonName?: string;                  // "Animals"
  description: string;

  // Display
  color: string;                        // Hex colour

  // For notable members
  notableMembers?: NotableMember[];
}

export interface NotableMember {
  id: string;
  name: string;
  commonName?: string;
  imageUrl?: string;
  description?: string;
  isExtinct?: boolean;
}

export interface TreeNode {
  id: string;
  name: string;
  rank: TaxonRank;
  isExtinct: boolean;
  speciesCount?: number;
  color: string;
  children?: TreeNode[];
}
