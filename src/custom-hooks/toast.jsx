import { useToast } from "@chakra-ui/react";

export default function useCustomToast() {
  const toast = useToast();

  const showToast = (param) => {
    toast({
      status: param.status ?? "success",
      duration: 9000,
      isClosable: true,
      position: "top-right",
      variant: "left-accent",
      ...param,
    });
  };

  return {
    showToast,
  };
}
