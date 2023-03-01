import {
  Alert,
  AlertDescription,
  CloseButton,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Spacer,
  useColorMode,
  useColorModeValue,
  useDisclosure,
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

export default function Home(
  props: PageProps<Queries.HomeQuery>
): ReactElement {
  return (
    <VStack
      w={"full"}
      p={{ base: 4, md: 6 }}
      spacing={12}
      bg={useColorModeValue("white", "black")}
    >
      <NavBar title={props.data.site!.siteMetadata.title} />
      <PrototypeWarning />
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
      px={{ base: 6, md: 8 }}
      py={{ base: 3, md: 4 }}
      rounded={{ base: "2xl", md: "3xl" }}
      bg={useColorModeValue("primary.50", "primary.900")}
    >
      <ChakraLink
        as={GatsbyLink}
        to={"/"}
        aria-label={"Go to homepage"}
        title={props.title}
        color={useColorModeValue("primary.900", "primary.50")}
        _hover={{ color: "primary.400" }}
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

function PrototypeWarning(): ReactElement {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Collapse in={isOpen}>
      <Alert
        maxW={"3xl"}
        rounded={"xl"}
        status={"warning"}
        variant={"left-accent"}
      >
        <AlertDescription px={4} py={2} fontSize={"sm"}>
          This is an early prototype of a web application for Noice. It
          showcases our free sound library with fundamental playback features,
          allowing us to evaluate our web-based sound engine. If you encounter
          unexpected behaviour, please inform us about it at{" "}
          <ChakraLink
            href={"mailto:trynoiceapp@gmail.com"}
            color={"primary.400"}
          >
            trynoiceapp@gmail.com
          </ChakraLink>
          .
        </AlertDescription>
        <CloseButton
          alignSelf={"flex-start"}
          position={"relative"}
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
    </Collapse>
  );
}
