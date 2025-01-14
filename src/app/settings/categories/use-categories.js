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
import useCustomToast from "custom-hooks/toast";
import useConfirmation from "custom-hooks/confirmation";
import { useOutletContext } from "react-router-dom";

const useCategories = (initialPerPage = 10) => {
  const { showToast } = useCustomToast();
  const { showConfirmation, Confirmation } = useConfirmation();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
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
      setCategory(null);
    },
  });

  const ref = `users/${wb.owner}/workbench/${wb.id}/categories`;

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

  const fetchCategories = async (page = 1, search = "") => {
    setIsLoading(true);

    let categoryQuery = query(
      collection(firestore, ref),
      orderBy("name"),
      where("name", ">=", search),
      where("name", "<=", search + "\uf8ff"),
      limit(perPage),
    );

    if (page > 1 && pageSnapshots[page - 2]) {
      categoryQuery = query(categoryQuery, startAfter(pageSnapshots[page - 2]));
    }

    onSnapshot(categoryQuery, (snap) => {
      const docs = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setCategories(docs);

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
    fetchCategories(currentPage, searchTerm);
  }, [currentPage, perPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setPageSnapshots([]);
    fetchCategories(1, searchTerm);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const selectToUpdate = (p) => {
    console.log(p);
    setCategory(p);
    toggleForm();
  };

  const handleAddNewCategory = async (values, { resetForm }) => {
    const customId = Date.now();
    const categoryRef = doc(firestore, `${ref}/${customId}`);
    try {
      await dbPOST(categoryRef, {
        ...values,
        id: customId,
        created_at: serverTimestamp(),
      });
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Kategori berhasil ditambahkan",
      });
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal menambahkan kategori",
        status: "error",
      });
    }
  };

  const handleUpdateCategory = async (values, { resetForm }) => {
    const categoryRef = doc(firestore, ref, values.id);
    try {
      await dbUPDATE(categoryRef, {
        ...values,
        updated_at: serverTimestamp(),
      });
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Kategori berhasil diedit",
      });
    } catch (error) {
      console.error("Gagal mengedit kategori:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal mengedit kategori",
        status: "error",
      });
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = await showConfirmation({
      title: "Konfirmasi",
      desc: "Yakin ingin menghapus kategori ini?" + "\n" + category.name,
      agreeText: "Hapus",
      cancelText: "Batal",
      agreeColor: "red",
    });

    if (confirmed) {
      const categoryRef = doc(firestore, ref, category.id);
      await dbDELETE(categoryRef)
        .then(() => {
          showToast({
            title: "Sukses",
            description: "Kategori berhasil dihapus",
          });
        })
        .catch(() => {
          showToast({
            title: "Terjadi Kesalahan",
            description: "Gagal menghapus kategori",
            status: "error",
          });
        });
    }
  };

  return {
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
    addNew,
    toggleForm,
    handleAddNewCategory,
    category,
    selectToUpdate,
    handleUpdateCategory,
    Confirmation,
    handleDeleteCategory,
  };
};

export default useCategories;
