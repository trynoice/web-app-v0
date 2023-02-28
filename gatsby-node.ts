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

      type SoundGroup implements Node {
        id: String!
        name: String!
      }

      type Sound implements Node {
        id: String!
        group: SoundGroup! @link
        name: String!
        icon: String!
        maxSilence: Int!
        segments: [SoundSegment]
        sources: [SoundSource]
      }

      type SoundSegment {
        name: String!
        isFree: Boolean!
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
  manifest.groups.forEach((group) => {
    createNode({
      ...group,
      internal: {
        type: "SoundGroup",
        contentDigest: createContentDigest(group),
      },
    });
  });

  manifest.sounds
    .filter((sound) => sound.segments.some((segment) => segment.isFree))
    .forEach((sound) => {
      createNode({
        id: sound.id,
        group: sound.groupId,
        name: sound.name,
        icon: sound.icon,
        maxSilence: sound.maxSilence,
        segments: sound.segments,
        sources: sound.sources,
        internal: {
          type: "Sound",
          contentDigest: createContentDigest(sound),
        },
      });
    });
};
