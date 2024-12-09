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
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { dbDELETE, dbPOST, dbUPDATE, firestore } from "utils/firebase";
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
  const { uploadFile } = useCloudinaryUpload();

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
      productQuery = query(productQuery, startAfter(pageSnapshots[page - 2]));
    }

    onSnapshot(productQuery, (snap) => {
      const docs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(docs);

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

  const selectToUpdate = (p) => {
    setProduct(p);
    toggleForm();
  };

  const handleAddNewProduct = async (values, { resetForm }) => {
    const customId = Date.now();
    const productRef = doc(firestore, `${ref}/${customId}`);
    let image = "";
    if (values.image) {
      image = await uploadFile(values.image, ref, "image");
    }
    try {
      await dbPOST(productRef, {
        ...values,
        id: customId,
        image,
        price_after_discount: values.price - values.discount,
        created_at: serverTimestamp(),
      });
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Produk berhasil ditambahkan",
      });
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
      image = await uploadFile(values.image, productRef, "image");
    }
    try {
      await dbUPDATE(productRef, {
        ...values,
        image,
        price_after_discount: values.price - values.discount,
        updated_at: serverTimestamp(),
      });
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
      await dbDELETE(productRef)
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
