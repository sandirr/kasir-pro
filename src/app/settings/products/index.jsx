import { AddIcon, DeleteIcon, EditIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import useProducts from "./use-products";
import ProductForm from "./form";

export default function ProductsMng() {
  const productUtils = useProducts(10);
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
    toggleForm,
    selectToUpdate,
    Confirmation,
    handleDeleteProduct,
  } = productUtils;

  return (
    <>
      {Confirmation}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        py="2"
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
          onClick={toggleForm}
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
            onChange={({ target }) => setPerpage(Number(target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </Flex>
        <Flex gap="2">
          <Input
            placeholder="Cari nama produk..."
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            size="sm"
            type="search"
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
              <Td isNumeric>Aksi</Td>
            </Tr>
          </Thead>
          <Tbody>
            {!products?.length ? (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  Belum Ada Data Produk
                </Td>
              </Tr>
            ) : (
              products.map((product, index) => (
                <Tr key={index}>
                  <Td>{index + 1 + (currentPage - 1) * perPage}</Td>
                  <Td>{product.name}</Td>
                  <Td>
                    <Image
                      src={product.image || "https://placehold.co/40x40"}
                      width={10}
                    />
                  </Td>
                  <Td>{product.price}</Td>
                  <Td>
                    {product.discount} (
                    {Math.round((product.discount / product.price) * 100)}%)
                  </Td>
                  <Td>{product.price_after_discount}</Td>
                  <Td>
                    {product.stock} ({product.unit})
                  </Td>
                  <Td>{product.category}</Td>
                  <Td isNumeric>
                    <ButtonGroup size="sm">
                      <Tooltip label="Edit">
                        <IconButton
                          colorScheme="teal"
                          onClick={() => selectToUpdate(product)}
                        >
                          <Icon as={EditIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip label="Hapus">
                        <IconButton
                          colorScheme="red"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Icon as={DeleteIcon} />
                        </IconButton>
                      </Tooltip>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

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

      <ProductForm {...productUtils} />
    </>
  );
}
