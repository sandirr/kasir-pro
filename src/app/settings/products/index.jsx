/* eslint-disable react-hooks/exhaustive-deps */
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { firestore } from "firebase";
import {
  query,
  limit,
  startAfter,
  orderBy,
  getDocs,
  where,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ProductsMng() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageSnapshots, setPageSnapshots] = useState([]); // To store last document of each page
  const perPage = 10;

  // Calculate total pages based on the total count of products matching the search
  const calculateTotalPages = async (search) => {
    const countQuery = search
      ? query(
          collection(
            firestore,
            "users/testing/workbench/iou0P0iz4roB7IkpYVgN/products",
          ),
          where("name", ">=", search),
          where("name", "<=", search + "\uf8ff"),
        )
      : collection(
          firestore,
          "users/testing/workbench/iou0P0iz4roB7IkpYVgN/products",
        );

    const snapshot = await getCountFromServer(countQuery);
    setTotalPages(Math.ceil(snapshot.data().count / perPage));
  };

  // Fetch products with pagination and optional search
  const fetchProducts = async (page = 1, search = "") => {
    setIsLoading(true);

    let productQuery = query(
      collection(
        firestore,
        "users/testing/workbench/iou0P0iz4roB7IkpYVgN/products",
      ),
      orderBy("name"),
      where("name", ">=", search),
      where("name", "<=", search + "\uf8ff"),
      limit(perPage),
    );

    if (page > 1 && pageSnapshots[page - 2]) {
      // Start after the last document of the previous page
      productQuery = query(productQuery, startAfter(pageSnapshots[page - 2]));
    }

    const snap = await getDocs(productQuery);
    const docs = snap.docs.map((doc) => doc.data());
    setProducts(docs);
    setIsLoading(false);

    // Store the last document snapshot for future pages
    if (snap.docs.length > 0) {
      const newPageSnapshots = [...pageSnapshots];
      newPageSnapshots[page - 1] = snap.docs[snap.docs.length - 1];
      setPageSnapshots(newPageSnapshots);
    }
  };

  useEffect(() => {
    calculateTotalPages(searchTerm); // Calculate pages based on current search term
    fetchProducts(currentPage, searchTerm); // Fetch data when page or search changes
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
    setPageSnapshots([]); // Clear snapshots for a fresh search
    fetchProducts(1, e.target.value);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box>
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
        <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
          Tambah Produk
        </Button>
      </Flex>

      {/* Search Input */}
      <Flex my="4">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
        />
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
    </Box>
  );
}
