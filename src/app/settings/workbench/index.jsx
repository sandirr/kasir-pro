import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Formik, Form, ErrorMessage, Field, FieldArray } from "formik";
import * as Yup from "yup";
import useWorkbench from "./use-workbench";
import DnDImage from "elements/dnd-image";
import { DeleteIcon } from "@chakra-ui/icons";

const descriptions = {
  "F&B":
    "F&B (Food & Beverage) cocok untuk bisnis yang bergerak di bidang makanan dan minuman, seperti restoran, kafe, warung makan, catering, atau kedai kopi.",
  Retail:
    "Retail cocok untuk usaha yang menjual barang atau produk fisik, seperti toko pakaian, elektronik, perlengkapan rumah tangga, atau minimarket.",
};

export default function Workbench() {
  const { goToStarter, workbench, handleEditWorkbench, owner } = useWorkbench();

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
    <>
      <Flex py="2" justifyContent="space-between" alignItems="center">
        <Heading as="h2" fontSize="xl">
          Manajemen Sistem Kasir
        </Heading>
        <Button size="sm" colorScheme="blue" onClick={goToStarter}>
          Pilih Sistem Kasir
        </Button>
      </Flex>
      <Formik
        initialValues={workbench}
        validationSchema={validationSchema}
        onSubmit={handleEditWorkbench}
      >
        {({ setFieldValue, values, isSubmitting, dirty }) => (
          <Form>
            <SimpleGrid columns={[1, 1, 2]} spacing={4} mt="3" mb="16">
              <Box>
                <Heading as="h3" fontSize="lg" mb="4" fontStyle="italic">
                  Data Toko
                </Heading>
                <Stack spacing={4}>
                  <Text>
                    Pemilik: {owner.name} ({owner.email})
                  </Text>
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
                </Stack>
              </Box>
              <Box>
                <Heading as="h3" fontSize="lg" mb="4" fontStyle="italic">
                  Data Pegawai
                </Heading>
                <FieldArray name="employees">
                  {({ push, remove }) => (
                    <Stack spacing={4}>
                      {values.employees.map((cashier, index) => (
                        <Flex key={index} alignItems="center" gap="2">
                          <Stack spacing={2} flex={1}>
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
                          </Stack>
                          <IconButton
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Flex>
                      ))}
                      <Button
                        mt={2}
                        size="sm"
                        onClick={() => push({ email: "", role: "" })}
                      >
                        Tambah Pegawai
                      </Button>
                    </Stack>
                  )}
                </FieldArray>
              </Box>
            </SimpleGrid>

            {dirty && (
              <Box position="fixed" bottom={0} left={0} right={0} py="4">
                <Container maxW="9xl">
                  <Flex justifyContent="flex-end" mt="2">
                    <Button
                      colorScheme="green"
                      size="sm"
                      type="submit"
                      isLoading={isSubmitting}
                      isDisabled={!dirty}
                      px="12"
                    >
                      Simpan Perubahan
                    </Button>
                  </Flex>
                </Container>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
}
