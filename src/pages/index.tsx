import {
  Alert,
  AlertDescription,
  CloseButton,
  Collapse,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Link as ChakraLink,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { graphql, Link as GatsbyLink, PageProps } from "gatsby";
import { Fragment, ReactElement } from "react";
import { TbMoon, TbPlayerPlay, TbSun, TbVolume } from "react-icons/tb";
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

    allSound(sort: [{ group: ASC }, { name: ASC }]) {
      nodes {
        icon
        name
        group
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
  const sounds = props.data.allSound.nodes as Queries.Sound[];

  return (
    <VStack
      w={"full"}
      p={{ base: 4, md: 6 }}
      spacing={16}
      bg={useColorModeValue("white", "black")}
    >
      <NavBar title={props.data.site!.siteMetadata.title} />
      <PrototypeWarning />
      <SoundCatalogue sounds={sounds} />
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

interface SoundCatalogueProps {
  readonly sounds: Queries.Sound[];
}

function SoundCatalogue(props: SoundCatalogueProps): ReactElement {
  const groupedSounds = props.sounds.reduce((accumulator, sound) => {
    if (accumulator.has(sound.group)) {
      accumulator.get(sound.group)!.push(sound);
    } else {
      accumulator.set(sound.group, [sound]);
    }

    return accumulator;
  }, new Map<string, Queries.Sound[]>());

  return (
    <VStack w={"full"} maxW={"maxContentWidth"} spacing={16}>
      {Array.from(groupedSounds.entries()).map(([group, sounds]) => (
        <VStack w={"full"} align={"flex-start"} spacing={8}>
          <Heading key={`SoundGroup#${group}`} as={"h2"} px={2} size={"md"}>
            {group}
          </Heading>
          <SimpleGrid
            w={"full"}
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            justifyItems={"center"}
            spacingX={8}
            spacingY={6}
          >
            {sounds.map((sound) => (
              <Sound key={`Sound#${sound.id}`} sound={sound} />
            ))}
          </SimpleGrid>
        </VStack>
      ))}
    </VStack>
  );
}

interface SoundProps {
  readonly sound: Queries.Sound;
}

function Sound(props: SoundProps): ReactElement {
  return (
    <VStack
      w={"full"}
      maxW={64}
      p={6}
      spacing={4}
      rounded={"2xl"}
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
    >
      <Image
        src={props.sound.icon}
        aria-hidden={true}
        boxSize={{ base: 20, md: 24 }}
        filter={useColorModeValue(
          "invert(57%) sepia(63%) saturate(488%) hue-rotate(106deg) brightness(94%) contrast(88%)",
          "invert(39%) sepia(80%) saturate(424%) hue-rotate(106deg) brightness(96%) contrast(91%)"
        )}
      />

      <Heading as={"h3"} size={"xs"}>
        {props.sound.name}
      </Heading>
      {/* padding right is needed because otherwise, the slider thumb overflows the container */}
      <HStack w={"full"} pr={2} spacing={4}>
        <IconButton
          icon={<Icon as={TbPlayerPlay} boxSize={5} />}
          aria-label={`play ${props.sound.name}`}
          size={"sm"}
          colorScheme={"primary"}
          variant={"outline"}
          isRound={true}
        />
        <Slider
          aria-label={`volume slider for ${props.sound.name}`}
          colorScheme={"primary"}
          min={0}
          max={1}
          step={0.01}
          defaultValue={1}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={5} color={"primary.500"}>
            <TbVolume />
          </SliderThumb>
        </Slider>
      </HStack>
    </VStack>
  );
}
