import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Nama harus diisi"),
});

export default function CategoryForm(props) {
  const {
    addNew,
    toggleForm,
    handleAddNewCategory,
    handleUpdateCategory,
    category,
  } = props;
  const initialValues = {
    name: "",
  };

  return (
    <Modal isOpen={addNew} onClose={toggleForm}>
      <ModalOverlay />
      <Formik
        initialValues={category || initialValues}
        validationSchema={validationSchema}
        onSubmit={category ? handleUpdateCategory : handleAddNewCategory}
      >
        {({ errors, touched, values, handleChange, isSubmitting }) => (
          <Form>
            <ModalContent maxW="sm">
              <ModalHeader fontSize="md">
                {category ? "Edit" : "Tambah"} Kategori
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={3}>
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
                </Stack>
              </ModalBody>
              <ModalFooter gap="4">
                <Button colorScheme="gray" onClick={toggleForm}>
                  Batal
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                >
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
