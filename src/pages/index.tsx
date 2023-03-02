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
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as ChakraLink,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { graphql, Link as GatsbyLink, PageProps } from "gatsby";
import { Fragment, ReactElement, useMemo, useRef, useState } from "react";
import {
  TbListSearch,
  TbMoon,
  TbPlayerPlay,
  TbSearch,
  TbSun,
  TbVolume,
  TbVolume2,
  TbVolume3,
  TbX,
} from "react-icons/tb";
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
        id
        icon
        name
        group
        tags
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
  const groupedSounds = (props.data.allSound.nodes as Queries.Sound[]).reduce(
    (accumulator, sound) => {
      if (accumulator.has(sound.group)) {
        accumulator.get(sound.group)!.push(sound);
      } else {
        accumulator.set(sound.group, [sound]);
      }

      return accumulator;
    },
    new Map<string, Queries.Sound[]>()
  );

  return (
    <VStack
      w={"full"}
      minH={"100vh"}
      p={{ base: 4, md: 6 }}
      spacing={16}
      bg={useColorModeValue("white", "black")}
    >
      <NavBar title={props.data.site!.siteMetadata.title} />
      <PrototypeWarning />
      <SoundDashboard groupedSounds={groupedSounds} />
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
          onClick={onClose}
          alignSelf={"flex-start"}
          position={"relative"}
          right={-1}
          top={-1}
          rounded={"full"}
        />
      </Alert>
    </Collapse>
  );
}

interface SoundDashboardProps {
  readonly groupedSounds: Map<string, Queries.Sound[]>;
}

function SoundDashboard(props: SoundDashboardProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredSounds = useMemo(
    () => filterGroupedSounds(props.groupedSounds, searchQuery),
    [searchQuery]
  );

  return (
    <Fragment>
      <SimpleGrid
        w={"full"}
        maxW={{ base: "xs", md: "2xl" }}
        columns={{ base: 1, md: 2 }}
        spacingX={12}
        spacingY={6}
      >
        <GlobalSoundControls />
        <SearchInput onChange={setSearchQuery} />
      </SimpleGrid>

      {filteredSounds.size > 0 ? (
        <SoundCatalogue groupedSounds={filteredSounds} />
      ) : (
        <VStack
          w={"full"}
          maxW={"lg"}
          spacing={4}
          color={useColorModeValue("gray.400", "gray.500")}
          textAlign={"center"}
        >
          <Icon as={TbListSearch} boxSize={12} />
          <Heading as={"h3"} size={"lg"}>
            No results found!
          </Heading>
          <Text>
            Oops! No sound matches your search criteria. Try refining your
            search or check back later for new additions.
          </Text>
        </VStack>
      )}
    </Fragment>
  );
}

function filterGroupedSounds(
  input: Map<string, Queries.Sound[]>,
  searchQuery: string
): Map<string, Queries.Sound[]> {
  searchQuery = searchQuery.toLowerCase().trim();
  if (searchQuery.length === 0) {
    return input;
  }

  const result = new Map<string, Queries.Sound[]>();
  input.forEach((sounds, group) => {
    const filteredSounds = sounds.filter(
      (sound) =>
        sound.name.toLowerCase().includes(searchQuery) ||
        sound.group.toLowerCase().includes(searchQuery) ||
        sound.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );

    if (filteredSounds.length > 0) {
      result.set(group, filteredSounds);
    }
  });

  return result;
}

function GlobalSoundControls(): ReactElement {
  return (
    <HStack
      h={10}
      pl={{ base: 3, md: 6 }}
      pr={{ base: 9, md: 12 }}
      spacing={4}
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
      rounded={"full"}
    >
      <Tooltip label={"Resume all sounds"}>
        <IconButton
          icon={<Icon as={TbPlayerPlay} boxSize={5} />}
          aria-label={"resume all sounds"}
          isDisabled={true}
          variant={"ghost"}
          colorScheme={"primary"}
          rounded={"full"}
        />
      </Tooltip>
      <VolumeSlider
        label={"master volume"}
        isDisabled={true}
        onChange={() => undefined}
      />
    </HStack>
  );
}

interface SearchInputProps {
  readonly onChange: (value: string) => void;
}

function SearchInput(props: SearchInputProps): ReactElement {
  const fieldRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setEmpty] = useState(true);
  const handleChange = (value: string) => {
    setEmpty(value.length === 0);
    props.onChange(value);
  };

  return (
    <InputGroup bg={"none"}>
      <InputLeftElement pointerEvents={"none"}>
        <Icon
          as={TbSearch}
          color={useColorModeValue("blackAlpha.600", "whiteAlpha.700")}
        />
      </InputLeftElement>
      <Input
        ref={fieldRef}
        type={"text"}
        placeholder={"Search sounds"}
        onChange={(event) => handleChange(event.target.value)}
        border={"none"}
        rounded={"full"}
        bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
        _placeholder={{
          color: useColorModeValue("blackAlpha.500", "whiteAlpha.600"),
        }}
      />
      <InputRightElement hidden={isEmpty}>
        <Icon
          as={TbX}
          onClick={() => {
            if (fieldRef.current != null) fieldRef.current.value = "";
            handleChange("");
          }}
          title={"Clear"}
          color={useColorModeValue("blackAlpha.600", "whiteAlpha.700")}
          cursor={"pointer"}
        />
      </InputRightElement>
    </InputGroup>
  );
}

interface SoundCatalogueProps {
  readonly groupedSounds: Map<string, Queries.Sound[]>;
}

function SoundCatalogue(props: SoundCatalogueProps): ReactElement {
  return (
    <VStack w={"full"} maxW={"maxContentWidth"} spacing={16}>
      {Array.from(props.groupedSounds.entries()).map(([group, sounds]) => (
        <VStack
          key={`SoundGroup#${group}`}
          w={"full"}
          align={"flex-start"}
          spacing={8}
        >
          <Heading as={"h2"} px={2} size={"md"}>
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
        <VolumeSlider
          label={`volume slider for ${props.sound.name}`}
          onChange={() => undefined}
        />
      </HStack>
    </VStack>
  );
}

interface VolumeSliderProps {
  readonly label: string;
  readonly onChange: (volume: number) => void;
  readonly isDisabled?: boolean;
}

function VolumeSlider(props: VolumeSliderProps) {
  const [value, setValue] = useState(1);

  return (
    <Slider
      aria-label={props.label}
      isDisabled={props.isDisabled}
      colorScheme={"primary"}
      min={0}
      max={1}
      step={0.01}
      defaultValue={1}
      onChange={(value) => {
        props.onChange(value);
        setValue(value);
      }}
    >
      <SliderTrack bg={useColorModeValue("blackAlpha.300", "whiteAlpha.400")}>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={5} color={"primary.500"}>
        {value === 0 ? (
          <TbVolume3 />
        ) : value < 0.5 ? (
          <TbVolume2 />
        ) : (
          <TbVolume />
        )}
      </SliderThumb>
    </Slider>
  );
}
