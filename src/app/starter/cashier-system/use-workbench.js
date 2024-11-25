import { useDisclosure } from "@chakra-ui/react";
import useConfirmation from "custom-hooks/confirmation";
import useCustomToast from "custom-hooks/toast";
import useCloudinaryUpload from "custom-hooks/upload-file";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { firestore } from "utils/firebase";

export default function useWorkbench() {
  const user = useOutletContext();
  const [workbenches, setWorkbenches] = useState([]);
  const [workbench, setWorkbench] = useState(null);
  const { uploadFile } = useCloudinaryUpload();
  const { showToast } = useCustomToast();
  const { showConfirmation, Confirmation } = useConfirmation();

  const {
    isOpen: isOpenForm,
    onClose: closeForm,
    onOpen: openForm,
  } = useDisclosure({
    onClose: () => {
      setWorkbench(null);
    },
  });

  const getWorkbenches = () => {
    const workbenchQuery = query(
      collectionGroup(firestore, "workbench"),
      where("accessibleEmails", "array-contains", user.email),
    );

    onSnapshot(workbenchQuery, (workbenchSnap) => {
      setWorkbenches(
        workbenchSnap.docs.map((wb) => ({
          id: wb.id,
          ...wb.data(),
        })),
      );
    });
  };

  useEffect(() => {
    if (user?.email) {
      getWorkbenches();
    }
  }, [user]);

  const selectToUpdate = (w) => {
    setWorkbench(w);
    openForm();
  };

  const handleAddWorkbench = async (values, { resetForm }) => {
    const workbenchRef = collection(firestore, `users/${user.uid}/workbench`);

    let logo = "";
    if (values.logo) {
      logo = await uploadFile(values.logo);
    }
    try {
      const res = await addDoc(workbenchRef, {
        ...values,
        logo,
        created_at: serverTimestamp(),
        owner: user.uid,
        owner_email: user.email,
        accessibleEmails: [
          user.email,
          ...values.employees.map((emp) => emp.email.toLowerCase()),
        ],
      });
      if (res.id) {
        closeForm();
        resetForm();
        showToast({
          title: "Sukses",
          description: "Toko berhasil ditambahkan",
        });
      }
    } catch (error) {
      console.error("Gagal menambahkan toko:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal menambahkan toko",
        status: "error",
      });
    }
  };

  const handleEditWorkbench = async (values, { resetForm }) => {
    const workbenchRef = doc(
      firestore,
      `users/${user.uid}/workbench`,
      values.id,
    );

    let logo = values.logo;
    if (values.logo instanceof File || values.logo instanceof Blob) {
      logo = await uploadFile(values.logo);
    }
    try {
      await updateDoc(workbenchRef, {
        ...values,
        logo,
        updated_at: serverTimestamp(),
        accessibleEmails: [
          user.email,
          ...values.employees.map((emp) => emp.email.toLowerCase()),
        ],
      });
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Toko berhasil diedit",
      });
    } catch (error) {
      console.error("Gagal mengedit toko:", error);
      showToast({
        title: "Terjadi Kesalahan",
        description: "Gagal mengedit toko",
        status: "error",
      });
    }
  };

  const handleDeleteWorkbench = async (wb) => {
    const confirmed = await showConfirmation({
      title: "Konfirmasi",
      desc: "Yakin ingin menghapus toko ini?" + "\n" + wb.name,
      agreeText: "Hapus",
      cancelText: "Batal",
      agreeColor: "red",
    });

    if (confirmed) {
      const workbenchRef = doc(firestore, `users/${user.uid}/workbench`, wb.id);
      await deleteDoc(workbenchRef)
        .then(() => {
          showToast({
            title: "Sukses",
            description: "Toko berhasil dihapus",
          });
        })
        .catch(() => {
          showToast({
            title: "Terjadi Kesalahan",
            description: "Gagal menghapus toko",
            status: "error",
          });
        });
    }
  };

  return {
    workbenches,
    isOpenForm,
    closeForm,
    workbench,
    openForm,
    selectToUpdate,
    handleAddWorkbench,
    handleEditWorkbench,
    Confirmation,
    handleDeleteWorkbench,
  };
}
