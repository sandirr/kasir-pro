import {
  Alert,
  AlertIcon,
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
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import DnDImage from "elements/dnd-image";

const descriptions = {
  "F&B":
    "F&B (Food & Beverage) cocok untuk bisnis yang bergerak di bidang makanan dan minuman, seperti restoran, kafe, warung makan, catering, atau kedai kopi.",
  Retail:
    "Retail cocok untuk usaha yang menjual barang atau produk fisik, seperti toko pakaian, elektronik, perlengkapan rumah tangga, atau minimarket.",
};

export default function CashierSystemForm(props) {
  const {
    isOpenForm,
    closeForm,
    handleAddWorkbench,
    handleEditWorkbench,
    workbench,
  } = props;
  const initialValues = {
    name: "",
    address: "",
    type: "",
    logo: "",
    employees: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Nama harus diisi."),
    address: Yup.string().required("Alamat harus diisi."),
    type: Yup.string().required("Tipe harus dipilih."),
    logo: Yup.mixed().test(
      "fileType",
      "Logo harus berupa file gambar",
      (value) => {
        if (!value) return true;
        return (
          value instanceof File ||
          value instanceof Blob ||
          typeof value === "string"
        );
      },
    ),
    employees: Yup.array().of(
      Yup.object({
        email: Yup.string()
          .email("Email tidak valid")
          .required("Email harus diisi atau hapus pegawai."),
        role: Yup.number().required("Role harus dipilih atau hapus pegawai."),
      }),
    ),
  });

  return (
    <Modal isOpen={isOpenForm} onClose={closeForm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{workbench ? "Edit" : "Tambah"} Sistem Kasir</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={workbench || initialValues}
          validationSchema={validationSchema}
          onSubmit={workbench ? handleEditWorkbench : handleAddWorkbench}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  <Box>
                    <Text as="label" fontSize="sm">
                      Logo
                    </Text>
                    <DnDImage
                      image={values.logo}
                      onChange={(file) => setFieldValue("logo", file)}
                    />
                    <ErrorMessage
                      name="logo"
                      component={Text}
                      fontSize="xs"
                      color="red.500"
                    />
                  </Box>
                  <Box>
                    <Text as="label" fontSize="sm">
                      Nama
                    </Text>
                    <Field
                      as={Input}
                      name="name"
                      size="sm"
                      placeholder="Nama Toko/Kedai/Warung"
                    />
                    <ErrorMessage
                      name="name"
                      component={Text}
                      fontSize="xs"
                      color="red.500"
                    />
                  </Box>
                  <Box>
                    <Text as="label" fontSize="sm">
                      Alamat
                    </Text>
                    <Field as={Textarea} name="address" size="sm" rows="3" />
                    <ErrorMessage
                      name="address"
                      component={Text}
                      fontSize="xs"
                      color="red.500"
                    />
                  </Box>
                  <Box>
                    <Text as="label" fontSize="sm">
                      Tipe
                    </Text>
                    <Field
                      as={Select}
                      name="type"
                      size="sm"
                      onChange={(e) => {
                        setFieldValue("type", e.target.value);
                      }}
                    >
                      <option value="">Pilih Tipe</option>
                      <option value="F&B">F&B</option>
                      <option value="Retail">Retail</option>
                    </Field>
                    <ErrorMessage
                      name="type"
                      component={Text}
                      fontSize="xs"
                      color="red.500"
                    />
                  </Box>

                  {values.type && (
                    <Alert status="info" fontSize="sm">
                      <AlertIcon />
                      <Text>{descriptions[values.type]}</Text>
                    </Alert>
                  )}

                  <Box>
                    <Text as="label" fontSize="sm">
                      Pegawai
                    </Text>
                    <FieldArray name="employees">
                      {({ push, remove }) => (
                        <Box>
                          {values.employees.map((cashier, index) => (
                            <Stack key={index} spacing={2} mb={4}>
                              <Box>
                                <Field
                                  as={Input}
                                  name={`employees[${index}].email`}
                                  size="sm"
                                  placeholder="Email Kasir"
                                />
                                <ErrorMessage
                                  name={`employees[${index}].email`}
                                  component={Text}
                                  fontSize="xs"
                                  color="red.500"
                                />
                              </Box>
                              <Box>
                                <Field
                                  as={Select}
                                  name={`employees[${index}].role`}
                                  size="sm"
                                >
                                  <option value="">Pilih Role</option>
                                  <option value="1">Super Admin</option>
                                  <option value="2">Admin</option>
                                  <option value="3">Kasir</option>
                                </Field>
                                <ErrorMessage
                                  name={`employees[${index}].role`}
                                  component={Text}
                                  fontSize="xs"
                                  color="red.500"
                                />
                              </Box>
                              <Button
                                size="xs"
                                colorScheme="red"
                                onClick={() => remove(index)}
                              >
                                Hapus Pegawai
                              </Button>
                            </Stack>
                          ))}
                          <Button
                            mt={2}
                            size="sm"
                            onClick={() => push({ email: "", role: "" })}
                          >
                            Tambah Pegawai
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Box>
                </Stack>
              </ModalBody>
              <ModalFooter gap="4">
                <Button type="button" onClick={closeForm}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
