import { useDisclosure } from "@chakra-ui/react";
import useCustomToast from "custom-hooks/toast";
import useCloudinaryUpload from "custom-hooks/upload-file";
import { doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { dbUPDATE, firestore } from "utils/firebase";
import { clearWorkbench } from "utils/storage";

export default function useWorkbench() {
  const { user, workbench: wb, owner } = useOutletContext();
  const [workbench, setWorkbench] = useState(() => wb);
  const { uploadFile } = useCloudinaryUpload();
  const { showToast } = useCustomToast();

  const navigate = useNavigate();
  const goToStarter = () => {
    clearWorkbench();
    navigate("/starter");
  };

  const {
    isOpen: isOpenForm,
    onClose: closeForm,
    onOpen: openForm,
  } = useDisclosure({
    onClose: () => {
      setWorkbench(null);
    },
  });

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

  return {
    isOpenForm,
    closeForm,
    workbench,
    openForm,
    handleEditWorkbench,
    goToStarter,
    owner,
  };
}
