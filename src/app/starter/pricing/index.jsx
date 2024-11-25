import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  Container,
  Divider,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaCheckCircle, FaRegTimesCircle } from "react-icons/fa";

const options = [
  {
    id: 1,
    desc: "1 sistem kasir/toko",
    icon: FaCheckCircle,
    color: "green.500",
  },
  { id: 2, desc: "1 pegawai kasir", icon: FaCheckCircle, color: "green.500" },
  { id: 3, desc: "2 kategori produk", icon: FaCheckCircle, color: "green.500" },
  {
    id: 4,
    desc: "5 produk per kategori",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 5,
    desc: "50 transaksi per hari",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 6,
    desc: "laporan penjualan, transaksi, dan shift kasir",
    icon: FaRegTimesCircle,
    color: "red",
  },
  { id: 7, desc: "share katalog produk", icon: FaRegTimesCircle, color: "red" },
  { id: 8, desc: "gunakan logo sendiri", icon: FaRegTimesCircle, color: "red" },
];

const options2 = [
  {
    id: 1,
    desc: "50 sistem kasir/toko",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 2,
    desc: "unlimited pegawai kasir",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 3,
    desc: "unlimited kategori produk",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 4,
    desc: "unlimited produk per kategori",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 5,
    desc: "unlimited transaksi per hari",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 6,
    desc: "laporan penjualan, transaksi, dan shift kasir",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 7,
    desc: "share katalog produk",
    icon: FaCheckCircle,
    color: "green.500",
  },
  {
    id: 8,
    desc: "gunakan logo sendiri",
    icon: FaCheckCircle,
    color: "green.500",
  },
];

function PriceWrapper(props) {
  const { children } = props;

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

export default function Pricing() {
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box py={8}>
      <Container maxW="2xl">
        <VStack spacing={2} textAlign="center">
          <Heading as="h1" fontSize="4xl">
            Rencanakan sesuai kebutuhan Anda
          </Heading>
          <Text fontSize="lg" color={"gray.500"}>
            Mulailah dengan paket gratis. Untuk merasakan keunggulan dan layanan
            yang lebih baik tanpa batasan, berlangganan dan jadikan bisnis anda
            lebih pro.
          </Text>
        </VStack>
      </Container>

      <Stack spacing={4} width={"100%"} direction={"column"} mt="4">
        <Divider />
        <PackageTier
          scrollToBottom={scrollToBottom}
          title={"Hobi"}
          active
          typePlan="Gratis"
          options={options}
        />
        <Divider />
        <PackageTier
          scrollToBottom={scrollToBottom}
          title={"Berlangganan"}
          checked={true}
          typePlan="Sesuai Kebutuhan"
          options={options2}
        />
      </Stack>

      <SimpleGrid
        columns={[1, 1, 2, 3]}
        spacing={4}
        py={10}
        mt="12"
        ref={bottomRef}
      >
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl" textAlign="center">
              Tunas <Badge colorScheme="red">3 Bulan</Badge>
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                Rp
              </Text>
              <Text fontSize="4xl" fontWeight="900">
                33.000
              </Text>
              <Text fontSize="2xl" color="gray.500">
                /bulan
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("gray.50", "gray.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="green" variant="outline">
                Berlangganan
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>
        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                bg={useColorModeValue("green.300", "green.700")}
                px={3}
                py={1}
                color={useColorModeValue("gray.900", "gray.300")}
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Paling Populer
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl" textAlign="center">
                Tumbuh <Badge colorScheme="red">6 Bulan</Badge>
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  Rp
                </Text>
                <Text fontSize="4xl" fontWeight="900">
                  30.000
                </Text>
                <Text fontSize="2xl" color="gray.500">
                  /bulan
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue("gray.50", "gray.700")}
              py={4}
              borderBottomRadius={"xl"}
            >
              <Box w="80%" pt={7}>
                <Button w="full" colorScheme="green">
                  Berlangganan
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl" textAlign="center">
              Pro <Badge colorScheme="red">12 Bulan</Badge>
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                Rp
              </Text>
              <Text fontSize="4xl" fontWeight="900">
                25.000
              </Text>
              <Text fontSize="2xl" color="gray.500">
                /bulan
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("gray.50", "gray.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="green" variant="outline">
                Berlangganan
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>
      </SimpleGrid>
    </Box>
  );
}

const PackageTier = ({
  title,
  options,
  typePlan,
  scrollToBottom,
  active = false,
}) => {
  return (
    <Stack
      p={3}
      py={3}
      justifyContent={{
        base: "flex-start",
        lg: "space-around",
      }}
      direction={{
        base: "column",
        lg: "row",
      }}
      alignItems={{ md: "center" }}
    >
      <Box>
        <Heading size={"md"}>{title}</Heading>
        {active && <Badge colorScheme="blue">Aktif</Badge>}
      </Box>
      <List spacing={3} textAlign="start">
        {options.map((desc) => (
          <ListItem key={desc.id}>
            <ListIcon as={desc.icon} color={desc.color} />
            {desc.desc}
          </ListItem>
        ))}
      </List>
      <Heading fontSize="lg">{typePlan}</Heading>
      <Stack>
        <Button size="md" colorScheme="green" onClick={scrollToBottom}>
          Pilih Paket
        </Button>
      </Stack>
    </Stack>
  );
};
