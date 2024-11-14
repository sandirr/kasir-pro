import { Box, Tab, TabIndicator, TabList, Tabs } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <Box>
      <Tabs
        variant="unstyled"
        overflowX="auto"
        className="hide-scroll-bar"
        whiteSpace="nowrap"
      >
        <TabList>
          <Tab fontSize="sm">Sistem Kasir</Tab>
          <Tab fontSize="sm" as={Link} to="products">
            Produk
          </Tab>
          <Tab fontSize="sm">Pegawai</Tab>
          <Tab fontSize="sm">Nilai Default</Tab>
          <Tab fontSize="sm">Diskon</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
      </Tabs>
      <Outlet />
    </Box>
  );
}
