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
} from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import reactLogo from "assets/react.svg";
import { IoLogOut } from "react-icons/io5";
import { useMemo } from "react";

export default function AppLayout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const profile = useMemo(
    () => (
      <Flex alignItems={"center"} direction={"column"} gap="2" mb="4">
        <Avatar
          name="Dan Abrahmov"
          src="https://bit.ly/dan-abramov"
          size="xl"
        />
        <Link>
          <Text fontSize="sm">Edit Profil</Text>
        </Link>
      </Flex>
    ),
    [],
  );

  return (
    <>
      <Box as="nav" boxShadow={"md"}>
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
                  <NavLink>Transaksi</NavLink>
                  <NavLink>Riwayat</NavLink>
                  <NavLink>Laporan</NavLink>
                  <NavLink>Pengaturan</NavLink>
                </Flex>
                <Flex alignItems={"center"} gap="4">
                  <IconButton onClick={toggleColorMode} variant="ghost">
                    {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                  </IconButton>
                  <Popover>
                    <PopoverTrigger>
                      <Avatar
                        name="Dan Abrahmov"
                        src="https://bit.ly/dan-abramov"
                        size="md"
                      />
                    </PopoverTrigger>
                    <PopoverContent p="4">
                      {profile}
                      <Button
                        leftIcon={<IoLogOut />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
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
                <NavLink onClick={onClose}>Transaksi</NavLink>
                <NavLink onClick={onClose}>Riwayat</NavLink>
                <NavLink onClick={onClose}>Laporan</NavLink>
                <NavLink onClick={onClose}>Pengaturan</NavLink>

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
                >
                  Keluar
                </Button>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      <Box as="main" py="2">
        <Container maxW="9xl">
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
