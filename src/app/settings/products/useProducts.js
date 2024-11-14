/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  query,
  limit,
  startAfter,
  orderBy,
  where,
  collection,
  getCountFromServer,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "firebase";

const useAction = (initialPerPage = 10) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageSnapshots, setPageSnapshots] = useState([]);
  const [perPage, setPerpage] = useState(() => initialPerPage);

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

    onSnapshot(productQuery, (snap) => {
      const docs = snap.docs.map((doc) => doc.data());
      setProducts(docs);

      // Store the last document snapshot for future pages
      if (snap.docs.length > 0) {
        const newPageSnapshots = [...pageSnapshots];
        newPageSnapshots[page - 1] = snap.docs[snap.docs.length - 1];
        setPageSnapshots(newPageSnapshots);
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    calculateTotalPages(searchTerm);
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, perPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setPageSnapshots([]);
    fetchProducts(1, searchTerm);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return {
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
  };
};

export default useAction;
