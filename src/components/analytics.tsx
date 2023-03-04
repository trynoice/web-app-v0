import {
  Box,
  Button,
  Collapse,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import useLocalStorage from "@rehooks/local-storage";
import { ReactElement, useEffect } from "react";

enum AnalyticsConsentStatus {
  granted = "granted",
  denied = "denied",
}

export default function Analytics(): ReactElement {
  const [consentStatus, setConsentStatus] =
    useLocalStorage<AnalyticsConsentStatus | null>("analytics-consent", null);

  useEffect(() => {
    const scriptElementId = "gtag.js";
    if (
      consentStatus === AnalyticsConsentStatus.granted &&
      document.getElementById(scriptElementId) == null
    ) {
      const tag = "G-Z9713ZC7PG";
      gtag("config", tag, {
        debug_mode: process.env.NODE_ENV !== "production",
      });

      const script = document.createElement("script");
      script.id = scriptElementId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${tag}`;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return (
    <AnalyticsConsent
      isOpen={consentStatus == null}
      onDenied={() => setConsentStatus(AnalyticsConsentStatus.denied)}
      onGranted={() => setConsentStatus(AnalyticsConsentStatus.granted)}
    />
  );
}

interface AnalyticsConsentProps {
  isOpen: boolean;
  onDenied: () => void;
  onGranted: () => void;
}

function AnalyticsConsent(props: AnalyticsConsentProps): ReactElement {
  return (
    <Box
      as={Collapse}
      in={props.isOpen}
      animateOpacity
      w={"full"}
      bg={useColorModeValue("blackAlpha.200", "whiteAlpha.300")}
    >
      <Stack
        maxW={"maxContentWidth"}
        mx={"auto"}
        p={{ base: 4, md: 6 }}
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-end", md: "center" }}
        justifyContent={"center"}
        spacing={{ base: 4, md: 8 }}
        fontSize={"sm"}
      >
        <Text>
          We use cookies to measure traffic and improve your experience. By
          clicking 'Accept', you consent to the use of cookies. For more
          information, please see our{" "}
          <ChakraLink
            href={"https://trynoice.com/privacy-policy"}
            color={"primary.400"}
            isExternal
          >
            Privacy Policy
          </ChakraLink>
          .
        </Text>
        <HStack spacing={4}>
          <Button size={"sm"} px={4} rounded={"full"} onClick={props.onDenied}>
            Reject
          </Button>
          <Button
            size={"sm"}
            px={4}
            rounded={"full"}
            colorScheme={"primary"}
            onClick={props.onGranted}
          >
            Accept
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
