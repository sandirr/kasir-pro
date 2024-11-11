import { IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { IoReceipt } from "react-icons/io5";

function FloatingActionButton({ icon = IoReceipt, ...rest }) {
  return (
    <IconButton
      colorScheme="green"
      borderRadius="full"
      position="fixed"
      bottom="20px"
      right="20px"
      width="56px"
      height="56px"
      boxShadow="lg"
      zIndex="1000"
      size="sm"
      icon={<Icon as={icon} boxSize={5} />}
      {...rest}
    ></IconButton>
  );
}

export default FloatingActionButton;
