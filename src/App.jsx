import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button, Heading, useColorMode } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div id="app">
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
        <Button colorScheme="brand">Ok</Button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        <Outlet />
      </p>
    </div>
  );
}

export default App;
