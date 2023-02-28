import { Text } from "@chakra-ui/react";
import { graphql, PageProps } from "gatsby";
import { Fragment, ReactElement } from "react";
import SocialCardImage from "../assets/social-card-image.png";

export const pageQuery = graphql`
  query Home {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;

export function Head(props: PageProps<Queries.HomeQuery>): React.ReactElement {
  const { title, description, siteUrl } = props.data.site!.siteMetadata;
  const image = `${siteUrl}${SocialCardImage}`;

  return (
    <Fragment>
      <html lang="en" />
      <title>{title}</title>
      <meta name={"description"} content={description} />

      <meta property={"og:site_name"} content={title} />
      <meta property={"og:type"} content={"website"} />
      <meta property={"og:image"} content={image} />
      <meta property={"og:title"} content={title} />
      <meta property={"og:description"} content={description} />

      <meta name={"twitter:card"} content={"summary_large_image"} />
      <meta name={"twitter:creator"} content={"@trynoice"} />
      <meta name={"twitter:site"} content={"@trynoice"} />
      <meta name={"twitter:image"} content={image} />
      <meta name={"twitter:title"} content={title} />
      <meta name={"twitter:description"} content={description} />
    </Fragment>
  );
}

export default function Home(): ReactElement {
  return <Text>Hello, world!</Text>;
}
