import {
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Spacer,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { graphql, Link as GatsbyLink, PageProps } from "gatsby";
import { Fragment, ReactElement } from "react";
import { TbMoon, TbSun } from "react-icons/tb";
import AppIcon from "../assets/app-icon";
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

const contentPaddingX = { base: 6, md: 8 };

export default function Home(
  props: PageProps<Queries.HomeQuery>
): ReactElement {
  return (
    <VStack
      w={"full"}
      p={{ base: 4, md: 6 }}
      spacing={0}
      bg={useColorModeValue("white", "black")}
    >
      <NavBar title={props.data.site!.siteMetadata.title} />
    </VStack>
  );
}

interface NavBarProps {
  readonly title: string;
}

function NavBar(props: NavBarProps): ReactElement {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack
      w={"full"}
      maxW={"maxContentWidth"}
      px={contentPaddingX}
      py={{ base: 3, md: 4 }}
      rounded={{ base: "2xl", md: "3xl" }}
      bg={useColorModeValue("primary.100", "primary.800")}
    >
      <ChakraLink
        as={GatsbyLink}
        to={"/"}
        aria-label={"Go to homepage"}
        title={props.title}
        color={useColorModeValue("primary.800", "primary.100")}
        _hover={{ color: useColorModeValue("primary.500", "primary.200") }}
      >
        <AppIcon w={{ base: 28, md: 32 }} h={"auto"} fill={"currentColor"} />
      </ChakraLink>
      <Spacer minW={4} />
      <IconButton
        icon={<Icon as={colorMode === "light" ? TbMoon : TbSun} boxSize={5} />}
        aria-label={"toggle color mode"}
        onClick={toggleColorMode}
        isRound={true}
        variant={"ghost"}
        colorScheme={"primary"}
      />
    </HStack>
  );
}
