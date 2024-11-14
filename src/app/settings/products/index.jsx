import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import useProducts from "./useProducts";
import DnDImage from "elements/dnd-image";

export default function ProductsMng() {
  const {
    products,
    currentPage,
    isLoading,
    totalPages,
    searchTerm,
    handleSearch,
    goToPage,
    perPage,
    setPerpage,
    setSearchTerm,
  } = useProducts(10);

  const { isOpen: addNew, onToggle: toggleAddNew } = useDisclosure();

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mt="2"
        gap="2"
        flexWrap="wrap"
      >
        <Heading as="h2" fontSize="xl">
          Manajemen Produk
        </Heading>
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={toggleAddNew}
        >
          Tambah Produk
        </Button>
      </Flex>

      {/* Search Input */}
      <Flex my="4" justifyContent="space-between">
        <Flex>
          <Select
            size="sm"
            value={perPage}
            onChange={({ target }) => setPerpage(target.value)}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </Select>
        </Flex>
        <Flex gap="2">
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            size="sm"
          />
          <IconButton size="sm" colorScheme="blue" onClick={handleSearch}>
            <Search2Icon />
          </IconButton>
        </Flex>
      </Flex>

      <TableContainer mt="2">
        <Table size="sm">
          <Thead>
            <Tr>
              <Td>No</Td>
              <Td>Nama</Td>
              <Td>Gambar</Td>
              <Td>Harga</Td>
              <Td>Diskon</Td>
              <Td>Harga Setelah Diskon</Td>
              <Td>Stok (unit)</Td>
              <Td>Kategori</Td>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product, index) => (
              <Tr key={index}>
                <Td>{index + 1 + (currentPage - 1) * perPage}</Td>
                <Td>{product.name}</Td>
                <Td>{product.image}</Td>
                <Td>{product.price}</Td>
                <Td>{product.discount}</Td>
                <Td>{product.price_after_discount}</Td>
                <Td>
                  {product.stock} ({product.unit})
                </Td>
                <Td>{product.category}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Flex justifyContent="center" mt="4">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          isDisabled={currentPage === 1 || isLoading}
          size="sm"
        >
          Previous
        </Button>
        <Box mx="4" alignSelf="center" fontSize="sm">
          Page {currentPage} of {totalPages}
        </Box>
        <Button
          onClick={() => goToPage(currentPage + 1)}
          isDisabled={currentPage === totalPages || isLoading}
          size="sm"
        >
          Next
        </Button>
      </Flex>

      <Modal isOpen={addNew} onClose={toggleAddNew}>
        <ModalOverlay />
        <ModalContent maxW="5xl">
          <ModalHeader fontSize="md">Tambah Produk</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Flex flexWrap="wrap" gap="4">
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Nama
                  </Text>
                  <Input size="sm" />
                </Box>
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Kategori
                  </Text>
                  <Select size="sm" placeholder="Pilih Kategori">
                    <option>A</option>
                    <option>B</option>
                  </Select>
                </Box>
              </Flex>
              <Flex flexWrap="wrap" gap="4">
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Harga
                  </Text>
                  <Input size="sm" type="number" />
                </Box>
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Diskon
                  </Text>
                  <InputGroup size="sm">
                    <Input type="number" />
                    <InputRightAddon fontSize="sm">0%</InputRightAddon>
                  </InputGroup>
                </Box>
              </Flex>
              <Flex flexWrap="wrap" gap="4">
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Stok
                  </Text>
                  <Input size="sm" type="number" />
                </Box>
                <Box flex={1}>
                  <Text as="label" fontSize="sm">
                    Unit
                  </Text>
                  <Select size="sm" placeholder="Pilih Unit">
                    <option>Porsi</option>
                    <option>Kotak</option>
                    <option>Bungkus</option>
                    <option>Roll</option>
                    <option>Pcs</option>
                    <option>Kg</option>
                    <option>Liter</option>
                  </Select>
                </Box>
              </Flex>
              <DnDImage />
            </Stack>
          </ModalBody>
          <ModalFooter gap="4">
            <Button colorScheme="gray" onClick={toggleAddNew}>
              Batal
            </Button>
            <Button colorScheme="blue">Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
