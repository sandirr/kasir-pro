import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

export default function Confirmation(props) {
  const {
    show,
    onClose,
    onAgree = () => null,
    title = "Konfirmasi",
    desc = "Apa Anda yakin ?",
    isLoading,
    children = null,
    agreeText = "Lanjutkan",
    cancelText = "Batal",
    agreeColor = "green",
    testid = "",
  } = props;

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      size="xl"
      data-testid={`${testid}-modal`}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight="normal" borderBottom="1px solid #eee">
          {title}
        </ModalHeader>
        <ModalCloseButton size="sm" data-testid={`${testid}-modal-btn-close`} />
        <ModalBody pb="8" pt="4" data-testid={`${testid}-modal-body`}>
          <Text fontSize="sm" whiteSpace="pre-wrap">
            {desc}
          </Text>
          {children}
        </ModalBody>
        <ModalFooter
          justifyContent="space-between"
          borderTop="1px solid #eee"
          data-testid={`${testid}-modal-footer`}
        >
          <Button
            leftIcon={<IoClose />}
            size="sm"
            onClick={onClose}
            data-testid={`${testid}-modal-btn-close`}
          >
            {cancelText}
          </Button>
          <Button
            leftIcon={<CheckIcon />}
            colorScheme={agreeColor}
            size="sm"
            onClick={onAgree}
            isLoading={isLoading}
            data-testid={`${testid}-modal-btn-agree`}
          >
            {agreeText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
