import { Box, Tab, TabIndicator, TabList, Tabs } from "@chakra-ui/react";
import { Link, Outlet, useOutletContext } from "react-router-dom";

export default function Settings() {
  const context = useOutletContext();
  return (
    <Box>
      <Tabs
        variant="unstyled"
        overflowX="auto"
        className="hide-scroll-bar"
        whiteSpace="nowrap"
      >
        <TabList>
          <Tab fontSize="sm" as={Link} to="workbench">
            Sistem Kasir
          </Tab>
          <Tab fontSize="sm" as={Link} to="category">
            Kategori
          </Tab>
          <Tab fontSize="sm" as={Link} to="products">
            Produk
          </Tab>
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
      <Outlet context={context} />
    </Box>
  );
}
