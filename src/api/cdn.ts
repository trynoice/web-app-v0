export const CDN_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://cdn.trynoice.com"
    : "https://cdn.staging.trynoice.com";

export interface LibraryManifest {
  /**
   * An UNIX timestamp with millisecond resolution of the instant when the sound library was last updated.
   */
  updatedAt: number;
  /**
   * A path relative to `library-manifest.json`, where individual segments are accessible at `${segmentsBasePath}/${sound.id}/${segment.name}.m3u8`.
   */
  segmentsBasePath: string;
  /**
   * A list of groups for categorising sounds.
   */
  groups: SoundGroup[];
  /**
   * A list of tags for declaring keywords related to sounds.
   */
  tags: SoundTag[];
  /**
   * A list of definitions available sounds in the library.
   */
  sounds: Sound[];
}

export interface SoundGroup {
  /**
   * A unique stable snake-cased identifier for a group.
   */
  id: string;
  /**
   * A user-presentable name for this group.
   */
  name: string;
}

export interface SoundTag {
  /**
   * A unique stable snake-cased identifier for a tag.
   */
  id: string;
  /**
   * A user-presentable name for this tag.
   */
  name: string;
}

export interface Sound {
  /**
   * A unique stable snake-cased identifier for a sound.
   */
  id: string;
  /**
   * ID of an existing `Group` to which this sound belongs.
   */
  groupId: string;
  /**
   * A user-presentable name for this sound.
   */
  name: string;
  /**
   * A SVG data URI containing a user-presentable icon for this sound.
   */
  icon: string;
  /**
   * The upper limit (in seconds) for the amount of silence to add in-between segments for non-contiguous sounds. Clients should randomly choose the length of silence in this range to add after each segment. Moreover, clients must treat sounds as contiguous if `maxSilence` is set to 0.
   */
  maxSilence: number;
  /**
   * A list of segments for this sound.
   */
  segments: SoundSegment[];
  /**
   * IDs of existing `Tag`s that associate with this sound.
   */
  tags: string[];
  /**
   * A list of details attributing original clip sources, author and license.
   */
  sources: SoundSource[];
}

export interface SoundSegment {
  /**
   * Clients should use it to find a segment at `${segmentsBasePath}/${sound.id}/${segment.name}.m3u8` path. If the sound is non-discrete, client can find bridge segments by appending source segment's name to destination segment's name, e.g. `raindrops_light_raindrops_heavy.m3u8`.
   */
  name: string;
  /**
   * A hint whether a segment is available to unsubscribed users. If a user attempts to access resources despite this hint being `false`, the CDN server must return HTTP 403.
   */
  isFree: boolean;
}

export interface SoundSource {
  /**
   * Name of the source clip(s).
   */
  name: string;
  /**
   * URL of the source clip.
   */
  url: string;
  /**
   * SPDX license code for the source clip.
   */
  license: string;
  author?: {
    /**
     * Name of the author of the source clip.
     */
    name: string;
    /**
     * URL of the author of the source clip.
     */
    url: string;
  };
}

/**
 * Retrieves the LibraryManifest from the CDN.
 */
export async function getLibraryManifest(): Promise<LibraryManifest> {
  const response = await fetch(`${CDN_ENDPOINT}/library/library-manifest.json`);

  return await response.json();
}
