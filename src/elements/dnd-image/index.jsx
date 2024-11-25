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
import { IoCamera, IoCameraReverse, IoImage } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import { Camera } from "react-camera-pro";
import { dataURLToBlob } from "helpers";

export default function DnDImage({ onChange, image = null }) {
  const [preview, setPreview] = useState(() => image);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const camera = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removePreview = () => {
    setPreview(null);
    onChange("");
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setPreview(photo);
      onChange(dataURLToBlob(photo));
      setIsCameraOpen(false);
    }
  };

  return (
    <Box>
      <Button
        onClick={handleOpenCamera}
        colorScheme="orange"
        size="sm"
        mb="2"
        leftIcon={<Icon as={IoCamera} />}
      >
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
        <input {...getInputProps()} disabled={!!preview} />

        {preview ? (
          <Box position="relative" display="inline-block">
            <Image
              src={preview}
              alt="Preview"
              boxSize="320px"
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
            <Icon as={IoImage} boxSize={12} color="gray.400" />
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
