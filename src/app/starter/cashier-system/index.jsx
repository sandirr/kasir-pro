import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CashierSystemForm from "./form";
import useWorkbench from "./use-workbench";
import { useOutletContext } from "react-router-dom";

export default function CashierSystem() {
  const workbanchUtils = useWorkbench();
  const {
    workbenches,
    openForm,
    selectToUpdate,
    Confirmation,
    handleDeleteWorkbench,
  } = workbanchUtils;
  const cardBg = useColorModeValue("white", "gray.800");
  const user = useOutletContext();

  const checkOwnership = (wb) => {
    if (wb.owner === user.uid) {
      return "Pemilik";
    }

    if (wb.employees.find((emp) => emp.email === user.email)) {
      const role = wb.employees.find((emp) => emp.email === user.email).role;

      if (role == 1) {
        return "Super Admin";
      } else if (role == 2) {
        return "Admin";
      } else {
        return "Kasir";
      }
    }
  };
  return (
    <Box py="4">
      {Confirmation}
      <Heading fontSize="4xl" textAlign="center">
        Sistem Kasir/Toko
      </Heading>

      <Flex justifyContent="center">
        <Text textAlign="center" maxW="2xl">
          Ini adalah kesempatan Anda untuk memulai! Setiap perjalanan besar
          dimulai dengan langkah pertama dan ini adalah langkah menuju
          kesuksesan bisnis Anda. 🚀
        </Text>
      </Flex>

      <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing={4} mt="8">
        <Flex
          textAlign="center"
          direction="column"
          alignItems="center"
          justifyContent="center"
          border="1px dashed"
          _hover={{
            borderColor: "blue.500",
          }}
          borderRadius="lg"
          cursor="pointer"
          userSelect="none"
          minH="32"
          onClick={openForm}
        >
          <Icon as={AddIcon} boxSize={8} />
          <Text mt="2" fontSize="sm">
            Tambah sistem kasir/toko
          </Text>
        </Flex>
        {workbenches.map((wb) => (
          <Box
            key={wb.id}
            boxShadow={"xl"}
            p="2"
            borderRadius="lg"
            bg={cardBg}
            border="1px solid"
            borderColor={cardBg}
            _hover={{
              border: "1px solid",
              borderColor: "blue.500",
            }}
            maxH="48"
          >
            <Stack>
              <Box>
                <Heading fontSize="md">{wb.name}</Heading>
                <Text fontSize="sm">Status: {checkOwnership(wb)}</Text>
              </Box>
              <Flex gap="2">
                <Badge colorScheme="green">{wb.type}</Badge>
                <Badge colorScheme="blue">Utama</Badge>
              </Flex>
              <Text fontSize="sm">{wb.address}</Text>
              <Flex gap="2">
                <Button w="full" size="sm" variant="outline" colorScheme="blue">
                  Masuk
                </Button>
                <IconButton
                  size="sm"
                  colorScheme="orange"
                  onClick={() => selectToUpdate(wb)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteWorkbench(wb)}
                >
                  <DeleteIcon />
                </IconButton>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      <CashierSystemForm {...workbanchUtils} />
    </Box>
  );
}
