import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import DnDImage from "elements/dnd-image";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Nama harus diisi"),
  category: Yup.string().required("Kategori harus diisi"),
  price: Yup.number()
    .required("Harga harus diisi")
    .min(0, "Harga tidak boleh kurang dari 0"),
  stock: Yup.number()
    .required("Stok harus diisi")
    .min(0, "Stok tidak boleh kurang dari 0"),
  unit: Yup.string().required("Satuan harus diisi"),
  discount: Yup.mixed().test(
    "validate-discount",
    "Diskon tidak valid: tidak boleh kurang dari 0 dan tidak boleh lebih dari harga",
    function (value) {
      if (value === null || value === "") {
        return true;
      }
      const { price } = this.parent;
      return Number(value) >= 0 && Number(value) <= Number(price);
    },
  ),
});

export default function AddProduct(props) {
  const {
    addNew,
    toggleForm,
    handleAddNewProduct,
    handleUpdateProduct,
    product,
  } = props;
  const initialValues = {
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    discount: 0,
    image: null,
  };

  return (
    <Modal isOpen={addNew} onClose={toggleForm}>
      <ModalOverlay />
      <Formik
        initialValues={product || initialValues}
        validationSchema={validationSchema}
        onSubmit={product ? handleUpdateProduct : handleAddNewProduct}
      >
        {({ errors, touched, values, handleChange, setFieldValue }) => (
          <Form>
            <ModalContent maxW="5xl">
              <ModalHeader fontSize="md">
                {product ? "Edit" : "Tambah"} Produk
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={3}>
                  <Flex flexWrap="wrap" gap="4">
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Nama
                      </Text>
                      <Input
                        size="sm"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                      {errors.name && touched.name && (
                        <Text fontSize="xs" color="red.500">
                          {errors.name}
                        </Text>
                      )}
                    </Box>
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Kategori
                      </Text>
                      <Select
                        size="sm"
                        placeholder="Pilih Kategori"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </Select>
                      {errors.category && touched.category && (
                        <Text fontSize="xs" color="red.500">
                          {errors.category}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <Flex flexWrap="wrap" gap="4">
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Harga
                      </Text>
                      <Input
                        size="sm"
                        type="number"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                      />
                      {errors.price && touched.price && (
                        <Text fontSize="xs" color="red.500">
                          {errors.price}
                        </Text>
                      )}
                    </Box>
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Diskon
                      </Text>
                      <InputGroup size="sm">
                        <Input
                          type="number"
                          name="discount"
                          value={values.discount}
                          onChange={handleChange}
                        />
                        <InputRightAddon fontSize="sm">
                          {Math.round((values.discount / values.price) * 100) ||
                            0}
                          %
                        </InputRightAddon>
                      </InputGroup>
                      {errors.discount && touched.discount && (
                        <Text fontSize="xs" color="red.500">
                          {errors.discount}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <Flex flexWrap="wrap" gap="4">
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Stok
                      </Text>
                      <Input
                        size="sm"
                        type="number"
                        name="stock"
                        value={values.stock}
                        onChange={handleChange}
                      />
                      {errors.stock && touched.stock && (
                        <Text fontSize="xs" color="red.500">
                          {errors.stock}
                        </Text>
                      )}
                    </Box>
                    <Box flex={1}>
                      <Text as="label" fontSize="sm">
                        Unit
                      </Text>
                      <Select
                        size="sm"
                        placeholder="Pilih Unit"
                        name="unit"
                        value={values.unit}
                        onChange={handleChange}
                      >
                        <option value="porsi">Porsi</option>
                        <option value="kotak">Kotak</option>
                        <option value="bungkus">Bungkus</option>
                        <option value="roll">Roll</option>
                        <option value="pcs">Pcs</option>
                        <option value="kg">Kg</option>
                        <option value="liter">Liter</option>
                      </Select>
                      {errors.unit && touched.unit && (
                        <Text fontSize="xs" color="red.500">
                          {errors.unit}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <DnDImage
                    onChange={(file) => setFieldValue("image", file)}
                    image={values.image}
                  />
                </Stack>
              </ModalBody>
              <ModalFooter gap="4">
                <Button colorScheme="gray" onClick={toggleForm}>
                  Batal
                </Button>
                <Button colorScheme="blue" type="submit">
                  Simpan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
