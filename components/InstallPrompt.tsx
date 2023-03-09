import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdIosShare as Share } from "react-icons/md";

const InstallPrompt: React.FC = () => {
  const [iOSIsInstalled, setiOSIsInstalled] = useState(true);
  const [adding, setAdding] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    var isSafari = true; ///^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setiOSIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches || !isSafari
    );
  }, []);

  if (iOSIsInstalled || closed) return <></>;

  return (
    <Flex
      bg="purple.900"
      p={1}
      alignContent="center"
      position="fixed"
      bottom="0"
      zIndex={1000}
      w="100vw"
    >
      <Text bg="purple.600" color="white" p={1} borderRadius={10} m="auto">
        Install as app: Tap <Share style={{ display: "inline-block" }} /> and
        select &quot;Add to Home Screen&quot;
      </Text>
      <Button bg="purple.900" color="white" onClick={() => setClosed(true)}>
        X
      </Button>
    </Flex>
  );
};

export default InstallPrompt;
