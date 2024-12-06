import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  Button,
  Container,
  Heading,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoLogoGoogle } from "react-icons/io5";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firestore } from "utils/firebase";
import useCustomToast from "custom-hooks/toast";
import { setToken } from "utils/storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function App() {
  const [count, setCount] = useState(0);
  const { toggleColorMode } = useColorMode();
  const { showToast } = useCustomToast();
  const navigate = useNavigate();

  const handleLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        setToken(token);

        const user = result.user;

        const userRef = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          try {
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              created_at: serverTimestamp(),
            });
            navigate("/starter");
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode !== "auth/user-cancelled")
              showToast({
                title: errorCode,
                description: errorMessage,
                status: "error",
              });
          }
        } else {
          navigate("/starter");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode !== "auth/user-cancelled")
          showToast({
            title: errorCode,
            description: errorMessage,
            status: "error",
          });
      });
  };

  return (
    <Container maxW="5xl">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <Heading color="teal">Vite + React</Heading>
      <div className="card">
        <button onClick={toggleColorMode}>count is {count}</button>

        <Button size="sm" onClick={() => setCount(count + 1)}>
          Add
        </Button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>

        <Button
          colorScheme="blue"
          leftIcon={<Icon as={IoLogoGoogle} />}
          onClick={handleLoginWithGoogle}
        >
          Login
        </Button>
      </div>
      <p className="read-the-docs">
        <Outlet />
      </p>
    </Container>
  );
}

export default App;
