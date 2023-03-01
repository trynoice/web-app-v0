import { GatsbyNode } from "gatsby";
import { getLibraryManifest } from "./src/api/cdn";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions: { createTypes } }) =>
    createTypes(`
      type Site {
        siteMetadata: SiteMetadata!
      }

      type SiteMetadata {
        title: String!
        description: String!
        siteUrl: String!
      }

      type Sound implements Node {
        id: String!
        group: String!
        name: String!
        icon: String!
        maxSilence: Int!
        sources: [SoundSource!]!
        tags: [String!]!
      }

      type SoundSource {
        name: String!
        url: String!
        license: String!
        author: SoundSourceAuthor
      }

      type SoundSourceAuthor {
        name: String!
        url: String!
      }
    `);

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const manifest = await getLibraryManifest();
  const groups = manifest.groups.reduce((accumulator, group) => {
    accumulator.set(group.id, group.name);
    return accumulator;
  }, new Map<string, string>());

  const tags = manifest.tags.reduce((accumulator, tag) => {
    accumulator.set(tag.id, tag.name);
    return accumulator;
  }, new Map<string, string>());

  manifest.sounds
    .filter((sound) => sound.segments.some((segment) => segment.isFree))
    .forEach((sound) => {
      createNode({
        id: sound.id,
        group: groups.get(sound.groupId)!,
        name: sound.name,
        icon: sound.icon,
        maxSilence: sound.maxSilence,
        sources: sound.sources,
        tags: sound.tags.map((tagId) => tags.get(tagId)!),
        internal: {
          type: "Sound",
          contentDigest: createContentDigest(sound),
        },
      });
    });
};
