import { AddIcon, DeleteIcon, EditIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
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
import useCategories from "./use-categories";
import CategoryForm from "./form";

export default function CategoriesMng() {
  const categoryUtils = useCategories(10);
  const {
    categories,
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
    handleDeleteCategory,
  } = categoryUtils;
  return (
    <Box>
      {Confirmation}
      <Flex py="2" justifyContent="space-between" alignItems="center">
        <Heading as="h2" fontSize="xl">
          Manajemen Kategori
        </Heading>
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={toggleForm}
        >
          Tambah Kategori
        </Button>
      </Flex>

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
            placeholder="Cari nama kategori..."
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
              <Td isNumeric>Aksi</Td>
            </Tr>
          </Thead>
          <Tbody>
            {!categories?.length ? (
              <Tr>
                <Td colSpan={9} textAlign="center">
                  Belum Ada Data Produk
                </Td>
              </Tr>
            ) : (
              categories.map((category, index) => (
                <Tr key={index}>
                  <Td>{index + 1 + (currentPage - 1) * perPage}</Td>
                  <Td>{category.name}</Td>
                  <Td isNumeric>
                    <ButtonGroup size="sm">
                      <Tooltip label="Edit">
                        <IconButton
                          colorScheme="teal"
                          onClick={() => selectToUpdate(category)}
                        >
                          <Icon as={EditIcon} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip label="Hapus">
                        <IconButton
                          colorScheme="red"
                          onClick={() => handleDeleteCategory(category)}
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

      <CategoryForm {...categoryUtils} />
    </Box>
  );
}
