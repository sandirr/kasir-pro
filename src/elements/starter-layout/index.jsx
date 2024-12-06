import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Badge,
  Button,
  Avatar,
  FormControl,
  Switch,
  FormLabel,
  useColorMode,
  Stack,
} from "@chakra-ui/react";
import useLogout from "custom-hooks/logout";
import useCloudinaryUpload from "custom-hooks/upload-file";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiHome, FiMenu, FiMessageCircle, FiTag } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { NavLink, Outlet } from "react-router-dom";
import { auth, firestore } from "utils/firebase";

const LinkItems = [
  { name: "Sistem Kasir/Toko", icon: FiHome, path: "" },
  { name: "Berlangganan", icon: FiTag, path: "pricing" },
  {
    name: (
      <>
        Konsultasi{" "}
        <Badge colorScheme="green" size="sm" ml="2">
          GRATIS
        </Badge>
      </>
    ),
    icon: FiMessageCircle,
    path: "consult",
  },
];

export default function Starter() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState({});
  const { uploadPendingImages } = useCloudinaryUpload();

  const getUser = () => {
    try {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const userRef = doc(firestore, "users", currentUser?.uid);
          const res = await getDoc(userRef);
          if (res.exists()) setUser(res.data());
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

  return (
    <Box minH="100vh" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "flex" }}
        user={user}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} user={user} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet context={user} />
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, user, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { handleLogout } = useLogout();
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      {...rest}
    >
      {/* Bagian Header */}
      <Box flex={1}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Biz Pro
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} to={link.path}>
            {link.name}
          </NavItem>
        ))}
      </Box>

      {/* Bagian Footer */}
      <Stack m="4">
        <FormControl display="flex" alignItems="center" gap="2" mb="4">
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
        <Flex mb="4">
          <Avatar src={user.photoURL} />
          <Box ml="3">
            <Text fontWeight="bold">{user?.name}</Text>
          </Box>
        </Flex>
        <Button
          leftIcon={<IoLogOut />}
          colorScheme="red"
          variant="outline"
          width="full"
          size="sm"
          onClick={handleLogout}
        >
          Keluar
        </Button>
      </Stack>
    </Box>
  );
};

const NavItem = ({ icon, children, to, ...rest }) => {
  return (
    <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        as={NavLink}
        to={to}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Biz Pro
      </Text>
    </Flex>
  );
};
