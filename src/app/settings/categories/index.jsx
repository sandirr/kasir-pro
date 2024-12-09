import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";

export default function CategoriesMng() {
  const { workbench: wb } = useOutletContext();
  return (
    <Box>
      <Flex py="2" justifyContent="space-between" alignItems="center">
        <Heading as="h2" fontSize="xl">
          Manajemen Kategori
        </Heading>
        <Button size="sm" colorScheme="blue" leftIcon={<AddIcon />}>
          Tambah Kategori
        </Button>
      </Flex>
      {wb.name}
    </Box>
  );
}
