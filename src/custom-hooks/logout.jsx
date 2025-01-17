import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "utils/firebase";
import useCustomToast from "./toast";
import { clearStorage } from "utils/storage";

export default function useLogout() {
  const navigate = useNavigate();
  const { showToast } = useCustomToast();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        clearStorage();
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast({
          title: errorCode,
          description: errorMessage,
          status: "error",
        });
      });
  };

  return {
    handleLogout,
  };
}
