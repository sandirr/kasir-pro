import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoCamera, IoCameraReverse } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import { Camera } from "react-camera-pro";

export default function DnDImage() {
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const camera = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log("File uploaded:", file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removePreview = () => {
    setPreview(null);
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      console.log(photo);
      setPreview(photo);
      setIsCameraOpen(false);
    }
  };

  return (
    <Box>
      <Button onClick={handleOpenCamera} colorScheme="orange" size="sm" mb="2">
        Buka Kamera
      </Button>

      {isCameraOpen && (
        <Modal isOpen={isCameraOpen}>
          <ModalOverlay />
          <ModalContent maxW="5xl" height="80%">
            <ModalBody>
              <Camera
                ref={camera}
                errorMessages={{
                  noCameraAccessible:
                    "Tidak ada perangkat kamera yang dapat diakses. Silakan hubungkan kamera Anda atau coba browser yang berbeda.",
                  permissionDenied:
                    "Izin ditolak. Silakan muat ulang dan berikan izin untuk mengakses kamera.",
                  switchCamera:
                    "Tidak memungkinkan untuk beralih ke kamera lain karena hanya ada satu perangkat video yang dapat diakses.",
                  canvas: "Canvas tidak didukung.",
                }}
              />
            </ModalBody>
            <ModalFooter gap="4">
              <Button onClick={() => setIsCameraOpen(false)} colorScheme="blue">
                Keluar
              </Button>
              <Button
                onClick={() => {
                  camera.current.switchCamera();
                }}
                colorScheme="blue"
              >
                <IoCameraReverse />
              </Button>
              <Button
                onClick={handleTakePhoto}
                colorScheme="blue"
                leftIcon={<Icon as={IoCamera} />}
              >
                Ambil Foto
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="md"
        p={6}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: "blue.500" }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <Box position="relative" display="inline-block">
            <Image
              src={preview}
              alt="Preview"
              boxSize="200px"
              objectFit="cover"
            />
            <IconButton
              position="absolute"
              top="0"
              right="0"
              onClick={removePreview}
              colorScheme="red"
              borderRadius="full"
              size="sm"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <VStack spacing={4}>
            <Icon as={IoCamera} boxSize={12} color="gray.400" />
            {isDragActive ? (
              <Text>Letakkan gambar di sini!</Text>
            ) : (
              <Text>
                Seret & letakkan gambar di sini, atau klik untuk mengunggah
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
