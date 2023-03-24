import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Button,
  CloseButton,
  Collapse,
  Divider,
  Flex,
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
  LinkProps as ChakraLinkProps,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import useLocalStorage from "@rehooks/local-storage";
import {
  ConsoleLogger,
  ConsoleLogLevel,
  SoundPlayerManagerState,
  SoundPlayerState,
} from "@trynoice/january";
import {
  SoundPlayerManagerProvider,
  useSoundPlayer,
  useSoundPlayerManager,
  useSoundPlayerManagerConfig,
} from "@trynoice/january/react";
import { graphql, Link as GatsbyLink, PageProps } from "gatsby";
import {
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import {
  TbArrowsShuffle,
  TbInfoCircle,
  TbListSearch,
  TbMoon,
  TbPlayerPause,
  TbPlayerPlay,
  TbPlayerStop,
  TbRepeat,
  TbSearch,
  TbSettings,
  TbSun,
  TbVolume,
  TbVolume2,
  TbVolume3,
  TbX,
} from "react-icons/tb";
import { JanuaryCdnClient } from "../api/cdn";
import AppIcon from "../assets/app-icon";
import SocialCardImage from "../assets/social-card-image.png";
import Analytics from "../components/analytics";

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
        maxSilence
        sources {
          author {
            name
            url
          }

          license
          name
          url
        }
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

const cdnClient = new JanuaryCdnClient();
const logger = new ConsoleLogger(
  process.env.NODE_ENV === "production"
    ? ConsoleLogLevel.Warn
    : ConsoleLogLevel.Info
);

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
      spacing={0}
      bg={useColorModeValue("white", "black")}
    >
      <Analytics />
      <VStack as={"main"} w={"full"} p={{ base: 4, md: 6 }} spacing={16}>
        <NavBar title={props.data.site!.siteMetadata.title} />
        <PrototypeWarning />
        <SoundPlayerManagerProvider cdnClient={cdnClient} logger={logger}>
          <SoundDashboard groupedSounds={groupedSounds} />
        </SoundPlayerManagerProvider>
        <Footer />
      </VStack>
    </VStack>
  );
}

interface NavBarProps {
  readonly title: string;
}

function NavBar(props: NavBarProps): ReactElement {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorModeToggleLabel = `Toggle ${
    colorMode === "light" ? "Dark" : "Light"
  } mode`;

  return (
    <HStack
      as={"header"}
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
      <Tooltip label={colorModeToggleLabel} closeDelay={500} hasArrow={true}>
        <IconButton
          icon={
            <Icon
              as={colorMode === "light" ? TbMoon : TbSun}
              boxSize={5}
              color={useColorModeValue("primary.600", "primary.200")}
            />
          }
          aria-label={colorModeToggleLabel}
          onClick={toggleColorMode}
          isRound={true}
          variant={"ghost"}
          colorScheme={useColorModeValue("blackAlpha", "gray")}
        />
      </Tooltip>
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
  const {
    isOpen: isSettingsModalOpen,
    onOpen: onOpenSettingsModal,
    onClose: onCloseSettingsModal,
  } = useDisclosure();

  const { state, volume, setVolume, resume, pause, stop } =
    useSoundPlayerManager();

  const isIdle = state === SoundPlayerManagerState.Idle;
  const isPlaying = state === SoundPlayerManagerState.Playing;

  return (
    <HStack
      h={10}
      px={4}
      spacing={1}
      justifyContent={"center"}
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
      rounded={"full"}
    >
      <GlobalSoundControlButton
        label={"Settings"}
        icon={TbSettings}
        onClick={onOpenSettingsModal}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettingsModal}
      />

      <GlobalSoundControlButton
        label={`${isPlaying ? "Pause" : "Resume"} All Sounds`}
        icon={isPlaying ? TbPlayerPause : TbPlayerPlay}
        onClick={isPlaying ? pause : resume}
        isDisabled={isIdle}
      />

      <GlobalSoundControlButton
        label={"Stop All Sounds"}
        icon={TbPlayerStop}
        onClick={stop}
        isDisabled={isIdle}
      />

      <Tooltip label={"Main Volume"} closeDelay={500} hasArrow={true}>
        {/* Need to wrap in a flex because tooltip is not working with slider.
            Yes, tried the forward ref for the custom component as well.
            Horizontal padding is for offsetting the slider thumb overlap. */}
        <Flex w={"full"} px={3}>
          <VolumeSlider
            label={"Main Volume"}
            value={volume}
            onChange={setVolume}
          />
        </Flex>
      </Tooltip>
    </HStack>
  );
}

interface GlobalSoundControlButtonProps {
  readonly label: string;
  readonly icon: IconType;
  readonly onClick: () => void;
  readonly isDisabled?: boolean;
}

function GlobalSoundControlButton(
  props: GlobalSoundControlButtonProps
): ReactElement {
  return (
    <Tooltip label={props.label} closeDelay={500} hasArrow={true}>
      <IconButton
        icon={
          <Icon
            as={props.icon}
            boxSize={5}
            color={useColorModeValue("primary.500", "primary.200")}
          />
        }
        aria-label={props.label}
        isDisabled={props.isDisabled}
        onClick={props.onClick}
        variant={"ghost"}
        colorScheme={useColorModeValue("blackAlpha", "gray")}
        rounded={"none"}
      />
    </Tooltip>
  );
}

interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function SettingsModal(props: SettingsModalProps): ReactElement {
  const [fadeInSecondsLocal, setFadeInSecondsLocal] = useLocalStorage<number>(
    "fade-in-seconds",
    2
  );

  const [fadeOutSecondsLocal, setFadeOutSecondsLocal] = useLocalStorage<number>(
    "fade-out-seconds",
    2
  );

  const {
    setFadeInSeconds: setFadeInSecondsUpstream,
    setFadeOutSeconds: setFadeOutSecondsUpstream,
  } = useSoundPlayerManagerConfig();

  useEffect(
    () => setFadeInSecondsUpstream(fadeInSecondsLocal),
    [fadeInSecondsLocal]
  );

  useEffect(
    () => setFadeOutSecondsUpstream(fadeOutSecondsLocal),
    [fadeOutSecondsLocal]
  );

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered={true}
      size={{ base: "xs", sm: "sm", md: "md" }}
    >
      <ModalOverlay
        bg={useColorModeValue("blackAlpha.400", "whiteAlpha.300")}
        backdropFilter={"auto"}
        backdropBlur={"md"}
      />
      <ModalContent bg={useColorModeValue("white", "black")}>
        <ModalHeader fontWeight={"medium"}>Settings</ModalHeader>
        <ModalCloseButton rounded={"full"} />
        <ModalBody mb={4} as={VStack} spacing={8}>
          <FadeDurationSlider
            title={"Fade-in Duration"}
            value={fadeInSecondsLocal}
            onChange={setFadeInSecondsLocal}
          />
          <FadeDurationSlider
            title={"Fade-out Duration"}
            value={fadeOutSecondsLocal}
            onChange={setFadeOutSecondsLocal}
          />
          <Alert status={"info"} fontSize={"sm"}>
            <AlertIcon />
            We'll save these settings in this browser!
          </Alert>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface FadeDurationSliderProps {
  readonly title: string;
  readonly value: number;
  readonly onChange: (duration: number) => void;
}

function FadeDurationSlider(props: FadeDurationSliderProps): ReactElement {
  return (
    <VStack w={"full"} align={"flex-start"} spacing={4}>
      <Heading as={"h1"} fontSize={"lg"}>
        {props.title}
        <Badge
          ml={4}
          colorScheme={"primary"}
          fontSize={"md"}
          textTransform={"none"}
        >
          {props.value}s
        </Badge>
      </Heading>
      <Slider
        aria-label={`${props.title} slider`}
        value={props.value}
        onChange={props.onChange}
        min={0}
        max={30}
        step={1}
        colorScheme={"primary"}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
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
  const { state, volume, setVolume, play, stop } = useSoundPlayer(
    props.sound.id
  );

  const isBuffering = state === SoundPlayerState.Buffering;
  const isStopped =
    state === SoundPlayerState.Stopping || state === SoundPlayerState.Stopped;

  const {
    isOpen: isSoundInfoModalOpen,
    onOpen: onOpenSoundInfoModal,
    onClose: onCloseSoundInfoModal,
  } = useDisclosure();

  return (
    <VStack
      position={"relative"}
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
          icon={
            <Icon as={isStopped ? TbPlayerPlay : TbPlayerStop} boxSize={5} />
          }
          aria-label={`play ${props.sound.name}`}
          isLoading={isBuffering}
          onClick={isStopped ? play : stop}
          size={"sm"}
          colorScheme={"primary"}
          variant={"outline"}
          isRound={true}
        />
        <VolumeSlider
          label={`volume slider for ${props.sound.name}`}
          value={volume}
          onChange={setVolume}
        />
      </HStack>
      <IconButton
        icon={
          <Icon
            as={TbInfoCircle}
            boxSize={5}
            color={useColorModeValue("blackAlpha.500", "whiteAlpha.600")}
          />
        }
        aria-label={"view sound info"}
        onClick={onOpenSoundInfoModal}
        position={"absolute"}
        top={-1} // Offset the top margin applied by the Stack spacing!
        right={3}
        size={"sm"}
        variant={"ghost"}
        colorScheme={useColorModeValue("blackAlpha", "gray")}
        rounded={"full"}
      />
      <SoundInfoModal
        sound={props.sound}
        isOpen={isSoundInfoModalOpen}
        onClose={onCloseSoundInfoModal}
      />
    </VStack>
  );
}

interface VolumeSliderProps {
  readonly label: string;
  readonly value: number;
  readonly onChange: (volume: number) => void;
}

function VolumeSlider(props: VolumeSliderProps) {
  const [value, setValue] = useState(props.value);

  return (
    <Slider
      aria-label={props.label}
      colorScheme={"primary"}
      min={0}
      max={1}
      step={0.01}
      value={value}
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

interface SoundInfoModalProps {
  readonly sound: Queries.Sound;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function SoundInfoModal(props: SoundInfoModalProps): ReactElement {
  const isLooping = props.sound.maxSilence === 0;
  const primaryColor = useColorModeValue("primary.500", "primary.200");

  return (
    <Fragment>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered={true}
        size={{ base: "xs", sm: "md", md: "lg" }}
      >
        <ModalOverlay
          bg={useColorModeValue("blackAlpha.400", "whiteAlpha.300")}
          backdropFilter={"auto"}
          backdropBlur={"md"}
        />
        <ModalContent bg={useColorModeValue("white", "black")}>
          <ModalHeader fontWeight={"medium"}>{props.sound.name}</ModalHeader>
          <ModalCloseButton rounded={"full"} />
          <ModalBody as={VStack} align={"flex-start"} spacing={8}>
            <HStack spacing={4}>
              <Icon
                as={isLooping ? TbRepeat : TbArrowsShuffle}
                boxSize={6}
                color={primaryColor}
              />
              <Text>
                {isLooping
                  ? "This sound plays seamlessly."
                  : `This sound repeats once every ${formatSeconds(
                      props.sound.maxSilence
                    )}.`}
              </Text>
            </HStack>
            <VStack align={"flex-start"} spacing={4}>
              <Heading as={"h3"} size={"md"}>
                Media Sources
              </Heading>
              <OrderedList px={4} spacing={2}>
                {props.sound.sources.map((source) => (
                  <ListItem key={source.url}>
                    <ChakraLink
                      href={source.url}
                      isExternal={true}
                      color={primaryColor}
                    >
                      {source.name}
                    </ChakraLink>{" "}
                    by{" "}
                    <ChakraLink
                      href={source.author?.url}
                      isExternal={true}
                      color={primaryColor}
                    >
                      {source.author?.name}
                    </ChakraLink>
                    <br />
                    License:{" "}
                    <SpdxLicenseTitle
                      id={source.license}
                      isExternal={true}
                      color={primaryColor}
                    />
                  </ListItem>
                ))}
              </OrderedList>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={"primary"} onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

function formatSeconds(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = duration % 60;

  const hourStr = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteStr = mins > 0 ? `${mins} minute${mins > 1 ? "s" : ""}` : "";
  const secondStr = secs > 0 ? `${secs} second${secs > 1 ? "s" : ""}` : "";
  return `${hourStr} ${minuteStr} ${secondStr}`.trim().replace(/\s+/g, " ");
}

function Footer(): ReactElement {
  const year = new Date().getFullYear();
  const fg = useColorModeValue("blackAlpha.600", "whiteAlpha.700");

  return (
    <VStack w={"full"} spacing={6} pt={12} pb={2} fontSize={"sm"} color={fg}>
      <Divider color={fg} />
      <Stack
        as={"footer"}
        w={"full"}
        maxW={"maxContentWidth"}
        direction={{ base: "column", md: "row" }}
        align={"center"}
        spacing={{ base: 4, md: 20 }}
      >
        <Text w={"full"} textAlign={{ base: "center", md: "left" }}>
          &copy; {year}, all rights reserved.
          <Text as="span" fontWeight={"medium"}>
            {" "}
            Made with &hearts; in India.
          </Text>
          <br />
        </Text>
        <Text
          w={"full"}
          textAlign={{ base: "center", md: "right" }}
          fontSize={"xs"}
        >
          <ChakraLink href={"https://trynoice.com"} isExternal>
            Home
          </ChakraLink>
          <InlineDivider />
          <ChakraLink
            href={"https://github.com/trynoice/web-app-v0"}
            isExternal
          >
            GitHub
          </ChakraLink>
          <InlineDivider />
          <ChakraLink
            href={"https://thenounproject.com/icon/white-noise-1287855/"}
            isExternal
          >
            Logo by Juraj Sedlák
          </ChakraLink>
        </Text>
      </Stack>
    </VStack>
  );
}

function InlineDivider(): ReactElement {
  return (
    <Text as={"span"} mx={2}>
      |
    </Text>
  );
}

const SPDX_LICENSE_MAP: { [key: string]: { name: string; url: string } } = {
  "CC-BY-3.0": {
    name: "Creative Commons Attribution 3.0 Unported",
    url: "https://spdx.org/licenses/CC-BY-3.0.html",
  },
  "CC-BY-4.0": {
    name: "Creative Commons Attribution 4.0 International",
    url: "https://spdx.org/licenses/CC-BY-4.0.html",
  },
  "GPL-3.0-only": {
    name: "GNU General Public License v3.0 only",
    url: "https://spdx.org/licenses/GPL-3.0-only.html",
  },
};

interface SpdxLicenseTitleProps extends ChakraLinkProps {
  readonly id: string;
}

function SpdxLicenseTitle(props: SpdxLicenseTitleProps): ReactElement {
  const license = SPDX_LICENSE_MAP[props.id];
  if (license == null) {
    throw new Error(`SPDX_LICENSE_MAP does not contain key '${props.id}'`);
  }

  return (
    <ChakraLink {...props} href={license.url}>
      {license.name}
    </ChakraLink>
  );
}
