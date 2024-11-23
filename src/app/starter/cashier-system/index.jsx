import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CashierSystem() {
  return (
    <Box py="4">
      <Heading fontSize="4xl" textAlign="center">
        Sistem Kasir/Toko
      </Heading>

      {/* Jika belum ada sistem kasir */}
      <Flex justifyContent="center">
        <Text textAlign="center" maxW="xl">
          Belum punya sistem kasir? Ini adalah kesempatan Anda untuk memulai!
          Setiap perjalanan besar dimulai dengan langkah pertama dan ini adalah
          langkah menuju kesuksesan bisnis Anda. 🚀
        </Text>
      </Flex>

      <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing={4} mt="4">
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
        >
          <Icon as={AddIcon} boxSize={8} />
          <Text mt="2" fontSize="sm">
            Tambah sistem kasir/toko
          </Text>
        </Flex>
        <Box
          boxShadow={"xl"}
          p="2"
          borderRadius="lg"
          bg={useColorModeValue("white", "gray.800")}
          border="1px solid"
          borderColor={useColorModeValue("white", "gray.800")}
          _hover={{
            border: "1px solid",
            borderColor: "blue.500",
          }}
          maxH="48"
        >
          <Stack>
            <Heading fontSize="md">Indoparah 1</Heading>
            <Flex gap="2">
              <Badge colorScheme="green">F&B</Badge>
              <Badge colorScheme="blue">Utama</Badge>
            </Flex>
            <Text fontSize="sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
              sunt ullam consequatur molestiae ea, aliquam repudiandae
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
