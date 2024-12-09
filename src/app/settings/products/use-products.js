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
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
  // doc,
  // setDoc,
  // collectionGroup,
} from "firebase/firestore";
import { firestore } from "utils/firebase";
import { useDisclosure } from "@chakra-ui/react";
import useCloudinaryUpload from "custom-hooks/upload-file";
import useCustomToast from "custom-hooks/toast";
import useConfirmation from "custom-hooks/confirmation";
import { useOutletContext } from "react-router-dom";

const useProducts = (initialPerPage = 10) => {
  const { showToast } = useCustomToast();
  const { showConfirmation, Confirmation } = useConfirmation();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageSnapshots, setPageSnapshots] = useState([]);
  const [perPage, setPerpage] = useState(() => initialPerPage);

  const { workbench: wb } = useOutletContext();

  const {
    isOpen: addNew,
    onToggle: toggleForm,
    onClose: closeForm,
  } = useDisclosure({
    onClose: () => {
      setProduct(null);
    },
  });
  const ref = `users/${wb.owner}/workbench/${wb.id}/products`;

  // user/{owner identifier}/workbench/{workbench id}/products

  // Calculate total pages based on the total count of products matching the search
  const calculateTotalPages = async (search) => {
    const countQuery = search
      ? query(
          collection(firestore, ref),
          where("name", ">=", search),
          where("name", "<=", search + "\uf8ff"),
        )
      : collection(firestore, ref);

    const snapshot = await getCountFromServer(countQuery);
    setTotalPages(Math.ceil(snapshot.data().count / perPage));
  };

  // Fetch products with pagination and optional search
  const fetchProducts = async (page = 1, search = "") => {
    setIsLoading(true);

    let productQuery = query(
      collection(firestore, ref),
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
      const docs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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

  // const ref = "products";

  // // Calculate total pages based on the total count of products matching the search
  // const calculateTotalPages = async (search) => {
  //   const countQuery = search
  //     ? query(
  //         collectionGroup(firestore, ref),
  //         where("name", ">=", search),
  //         where("name", "<=", search + "\uf8ff"),
  //       )
  //     : collectionGroup(firestore, ref);

  //   const snapshot = await getCountFromServer(countQuery);
  //   setTotalPages(Math.ceil(snapshot.data().count / perPage));
  // };

  // // Fetch products with pagination and optional search
  // const fetchProducts = async (page = 1, search = "") => {
  //   setIsLoading(true);

  //   let productQuery = query(
  //     collectionGroup(firestore, ref),
  //     orderBy("name"),
  //     where("name", ">=", search),
  //     where("name", "<=", search + "\uf8ff"),
  //     limit(perPage),
  //   );

  //   if (page > 1 && pageSnapshots[page - 2]) {
  //     // Start after the last document of the previous page
  //     productQuery = query(productQuery, startAfter(pageSnapshots[page - 2]));
  //   }

  //   onSnapshot(productQuery, (snap) => {
  //     const docs = snap.docs.map((doc) => doc.data());
  //     setProducts(docs);

  //     // Store the last document snapshot for future pages
  //     if (snap.docs.length > 0) {
  //       const newPageSnapshots = [...pageSnapshots];
  //       newPageSnapshots[page - 1] = snap.docs[snap.docs.length - 1];
  //       setPageSnapshots(newPageSnapshots);
  //     }
  //   });

  //   setIsLoading(false);
  // };

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

  const selectToUpdate = (p) => {
    setProduct(p);
    toggleForm();
  };

  const { uploadFile } = useCloudinaryUpload();

  const handleAddNewProduct = async (values, { resetForm }) => {
    const productsRef = collection(firestore, ref);
    let image = "";
    if (values.image) {
      image = await uploadFile(values.image);
    }
    try {
      const res = await addDoc(productsRef, {
        ...values,
        image,
        price_after_discount: values.price - values.discount,
        created_at: serverTimestamp(),
      });
      if (res.id) {
        closeForm();
        resetForm();
        showToast({
          title: "Sukses",
          description: "Produk berhasil ditambahkan",
        });
      }
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal menambahkan produk",
        status: "error",
      });
    }
  };

  const handleUpdateProduct = async (values, { resetForm }) => {
    const productRef = doc(firestore, ref, values.id);
    let image = values.image;
    if (values.image instanceof File || values.image instanceof Blob) {
      image = await uploadFile(values.image);
    }
    try {
      await setDoc(
        productRef,
        {
          ...values,
          image,
          price_after_discount: values.price - values.discount,
          updated_at: serverTimestamp(),
        },
        { merge: true },
      );
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Produk berhasil diedit",
      });
    } catch (error) {
      console.error("Gagal mengedit produk:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal mengedit produk",
        status: "error",
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = await showConfirmation({
      title: "Konfirmasi",
      desc: "Yakin ingin menghapus produk ini?" + "\n" + product.name,
      agreeText: "Hapus",
      cancelText: "Batal",
      agreeColor: "red",
    });

    if (confirmed) {
      const productRef = doc(firestore, ref, product.id);
      await deleteDoc(productRef)
        .then(() => {
          showToast({
            title: "Sukses",
            description: "Produk berhasil dihapus",
          });
        })
        .catch(() => {
          showToast({
            title: "Terjadi Kesalahan",
            description: "Gagal menghapus produk",
            status: "error",
          });
        });
    }
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
    addNew,
    toggleForm,
    handleAddNewProduct,
    product,
    selectToUpdate,
    handleUpdateProduct,
    Confirmation,
    handleDeleteProduct,
  };
};

export default useProducts;
