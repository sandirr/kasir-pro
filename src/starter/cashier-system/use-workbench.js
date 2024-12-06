import { useDisclosure } from "@chakra-ui/react";
import useConfirmation from "custom-hooks/confirmation";
import useCustomToast from "custom-hooks/toast";
import useCloudinaryUpload from "custom-hooks/upload-file";
import {
  collectionGroup,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { dbDELETE, dbPOST, dbUPDATE, firestore } from "utils/firebase";
import { setLocalWorkbench } from "utils/storage";

export default function useWorkbench() {
  const user = useOutletContext();
  const [workbenches, setWorkbenches] = useState([]);
  const [workbench, setWorkbench] = useState(null);
  const { uploadFile } = useCloudinaryUpload();
  const { showToast } = useCustomToast();
  const { showConfirmation, Confirmation } = useConfirmation();
  const navigate = useNavigate();

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
      where("accessible_emails", "array-contains", user.email),
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
    try {
      const workbenchRef = doc(
        firestore,
        `users/${user.uid}/workbench/${Date.now()}`,
      );

      let logo = "";
      if (values.logo) {
        logo = await uploadFile(
          values.logo,
          `users/${user.uid}/workbench/${Date.now()}`,
          "logo",
        );
      }
      await dbPOST(workbenchRef, {
        ...values,
        logo,
        owner: user.uid,
        owner_email: user.email,
        accessible_emails: [
          user.email,
          ...values.employees.map((emp) => emp.email.toLowerCase()),
        ],
      });
      closeForm();
      resetForm();
      showToast({
        title: "Sukses",
        description: "Toko berhasil ditambahkan",
      });
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
    try {
      const workbenchRef = doc(
        firestore,
        `users/${user.uid}/workbench/${values.id}`,
      );

      let logo = values.logo;
      if (values.logo instanceof File || values.logo instanceof Blob) {
        logo = await uploadFile(
          values.logo,
          `users/${user.uid}/workbench/${values.id}`,
          "logo",
        );
      }
      await dbUPDATE(workbenchRef, {
        ...values,
        logo,
        accessible_emails: [
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
      await dbDELETE(workbenchRef)
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

  const handleEnterTheSystem = (wb) => {
    setLocalWorkbench(wb);
    navigate("/app", { replace: true });
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
    handleEnterTheSystem,
  };
}
