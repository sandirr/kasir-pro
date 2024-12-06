import {
  Avatar,
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Image,
  Text,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SlideFade,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import reactLogo from "assets/react.svg";
import { IoLogOut } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import { auth, firestore } from "utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getLocalWorkbench } from "utils/storage";
import useCloudinaryUpload from "custom-hooks/upload-file";
import useLogout from "custom-hooks/logout";

const roles = {
  1: "Super Admin",
  2: "Admin",
  3: "Kasir",
};

export default function AppLayout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { uploadPendingImages } = useCloudinaryUpload();
  const { handleLogout } = useLogout();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");

  const workbench = getLocalWorkbench();

  const getUser = () => {
    try {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const userRef = doc(firestore, "users", currentUser?.uid);
          const res = await getDoc(userRef);
          if (res.exists()) setUser(res.data());
        }
        if (currentUser.uid && workbench) {
          if (currentUser.uid === workbench.owner) {
            setRole(roles["1"]);
          } else {
            const me =
              workbench.employees?.find(
                (em) => em.email === currentUser.email,
              ) || {};
            setRole(roles[me.role || "3"]);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  window.addEventListener("online", async () => {
    await uploadPendingImages();
  });

  const appContext = useMemo(
    () => ({
      user,
      workbench,
      role,
    }),
    [user, workbench, role],
  );

  const profile = useMemo(
    () => (
      <Flex alignItems={"center"} direction={"column"} gap="2" mb="4">
        <Avatar
          name="Dan Abrahmov"
          src={user?.photoURL}
          size="xl"
          border="1px solid"
        />
        <Text fontWeight="bold" fontSize="sm">
          {user.name}
        </Text>
        <Text mt="-2" fontSize="sm">
          {role}
        </Text>
        <Link>
          <Text fontSize="sm">Edit Profil</Text>
        </Link>
      </Flex>
    ),
    [user, role],
  );

  const menus = [
    {
      name: "Transaksi",
      path: "",
    },
    {
      name: "Riwayat",
      path: "history",
    },
    {
      name: "Laporan",
      path: "report",
    },
    {
      name: "Pengaturan",
      path: "settings",
    },
  ];

  return (
    <>
      <Box
        as="nav"
        boxShadow={"md"}
        className="sticky"
        top="1"
        zIndex="sticky"
        bg={useColorModeValue("white", "gray.900")}
      >
        <Container maxW={"9xl"}>
          <Flex justifyContent={"space-between"} alignItems={"center"} py="2">
            <Image
              src={reactLogo}
              className="logo"
              alt="Vite logo"
              width={["8", "10", "12"]}
            />

            {/* Navigation */}
            {isMobile ? (
              <IconButton
                aria-label="Open Menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={onOpen}
              />
            ) : (
              <>
                <Flex gap={["8", "12", "16"]}>
                  {menus.map((menu) => (
                    <NavLink to={menu.path} key={menu.path}>
                      {menu.name}
                    </NavLink>
                  ))}
                </Flex>
                <Flex alignItems={"center"} gap="4">
                  <IconButton onClick={toggleColorMode} variant="ghost">
                    {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                  </IconButton>
                  <Popover>
                    <PopoverTrigger>
                      <Avatar
                        name="Dan Abrahmov"
                        src={user?.photoURL}
                        size="md"
                        border="1px solid"
                        cursor="pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent p="4">
                      {profile}
                      <Button
                        leftIcon={<IoLogOut />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                      >
                        Keluar
                      </Button>
                    </PopoverContent>
                  </Popover>
                </Flex>
              </>
            )}
          </Flex>
        </Container>

        {/* Drawer for Mobile Navigation */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <Flex direction="column" gap="4" mt="4">
                {profile}
                {menus.map((menu) => (
                  <NavLink to={menu.path} onClick={onClose} key={menu.path}>
                    {menu.name}
                  </NavLink>
                ))}

                <FormControl display="flex" alignItems="center" gap="2">
                  <Switch
                    id="email-alerts"
                    colorScheme="orange"
                    checked={colorMode === "light"}
                    onChange={() => toggleColorMode()}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" fontSize={"sm"}>
                    {colorMode === "dark" ? "Mode Gelap" : "Mode Terang"}
                  </FormLabel>
                </FormControl>

                <Button
                  leftIcon={<IoLogOut />}
                  colorScheme="red"
                  variant="outline"
                  mt="4"
                  size="sm"
                  onClick={handleLogout}
                >
                  Keluar
                </Button>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      <SlideFade in as="main">
        <Container maxW="9xl" py="4">
          <Outlet context={appContext} />
        </Container>
      </SlideFade>
    </>
  );
}
