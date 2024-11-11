import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import FloatingActionButton from "elements/floating-button";
import { useEffect } from "react";
import { IoExpand, IoRemove } from "react-icons/io5";

export default function Transaction(props) {
  const { isOpen: isOpenTransaction, onToggle: onToggleTransaction } =
    useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    console.log("effect");
  }, []);
  useEffect(() => {
    console.log("effect props");
  }, [props]);
  console.log("render level");

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={isOpenTransaction ? [12, 12, 8, 8] : 12}>
          <Heading fontSize="xl">Katalog Produk</Heading>

          <SimpleGrid
            columns={isOpenTransaction ? [1, 2, 3, 4, 5] : [1, 2, 3, 6, 7]}
            spacing="4"
            mt="4"
          >
            <Box
              shadow="lg"
              borderWidth={1}
              borderRadius="md"
              p="2"
              cursor="pointer"
              userSelect="none"
              // borderColor={"blue.200"}
            >
              <Heading fontSize="lg">Rendang</Heading>
              <Image
                src="https://www.astronauts.id/blog/wp-content/uploads/2023/03/Resep-Rendang-Daging-Sapi-Untuk-Lebaran-Gurih-dan-Nikmat-1024x683.jpg"
                width="100%"
                height={120}
                objectFit="cover"
                borderRadius="md"
                mt="2"
              />
              <Box
                mt="2"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text fontSize="md" fontWeight="bold">
                  Rp 12.000.000
                </Text>
                <Text fontSize="xs">Tersedia: 8 porsi</Text>
              </Box>
              <InputGroup size="xs" colorScheme="blue" mt="2">
                <InputLeftAddon as={IconButton}>
                  <MinusIcon />
                </InputLeftAddon>
                <Input textAlign={"center"} />
                <InputRightAddon as={IconButton}>
                  <AddIcon />
                </InputRightAddon>
              </InputGroup>
            </Box>
          </SimpleGrid>
        </GridItem>

        {isOpenTransaction && (
          <Hide below="md">
            <GridItem colSpan={4}>
              <Flex
                direction={"column"}
                justifyContent={"center"}
                height="90vh"
              >
                <Box
                  borderRadius="md"
                  borderTopEndRadius={"3xl"}
                  borderBottomLeftRadius={"3xl"}
                  height="90%"
                  p="4"
                  border="1px solid"
                  borderColor="gray.300"
                  overflow="auto"
                  position="relative"
                >
                  <TableContainer minH="100%">
                    <Table size="sm" variant="striped" colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th textTransform="none">Produk</Th>
                          <Th textTransform="none">Harga (Rp & Qty)</Th>
                          <Th textTransform="none">Total (Rp)</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Rendang</Td>
                          <Td>20K (x3)</Td>
                          <Td>60K</Td>
                        </Tr>
                        <Tr>
                          <Td>Rendang</Td>
                          <Td>20K (x3)</Td>
                          <Td>60K</Td>
                        </Tr>
                        <Tr>
                          <Td>Pajak</Td>
                          <Td>11%</Td>
                          <Td>60K</Td>
                        </Tr>
                        <Tr>
                          <Td colSpan={2} fontWeight="bold">
                            Total
                          </Td>
                          <Td fontWeight="bold">60K</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Pembayaran</Td>
                          <Td colSpan={2}>
                            <InputGroup size="xs">
                              <InputLeftElement>Rp</InputLeftElement>
                              <Input
                                placeholder="Jika Tunai"
                                borderColor="gray"
                              />
                            </InputGroup>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td colSpan={2} fontWeight="bold">
                            Kembalian
                          </Td>
                          <Td fontWeight="bold">60K</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    <Table size="sm" colorScheme="gray" mt="2">
                      <Tbody>
                        <Tr>
                          <Td>Tipe Pesanan</Td>
                          <Td colSpan={2}>
                            <Flex gap="4">
                              <Badge colorScheme="blue">Dine In</Badge>
                              <Badge>Take Away</Badge>
                            </Flex>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Nomor Meja</Td>
                          <Td colSpan={2}>
                            <Input size="xs" placeholder="Jika Dine In" />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Nama Pemesan</Td>
                          <Td colSpan={2}>
                            <Input size="xs" placeholder="Opsional" />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Ref. Pembayaran</Td>
                          <Td colSpan={2}>
                            <Input size="xs" placeholder="Jika Bukan Tunai" />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Catatan</Td>
                          <Td colSpan={2}>
                            <Textarea
                              size="xs"
                              rows={1}
                              placeholder="Opsional"
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>

                  <Box position="sticky" bottom="0" left="0" right="0">
                    <Button colorScheme="green" width="full">
                      Rp 128.000
                    </Button>
                    <Flex justifyContent="flex-end" gap="3" mt="2">
                      <Tooltip label="Perbesar">
                        <IconButton size="xs">
                          <IoExpand />
                        </IconButton>
                      </Tooltip>
                      <Tooltip label="Perkecil">
                        <IconButton size="xs" onClick={onToggleTransaction}>
                          <IoRemove />
                        </IconButton>
                      </Tooltip>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </GridItem>
          </Hide>
        )}
      </Grid>

      {!isOpenTransaction && (
        <FloatingActionButton onClick={onToggleTransaction} />
      )}
    </>
  );
}
