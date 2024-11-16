import Confirmation from "elements/confirmation";
import { useState, useCallback } from "react";

export default function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [resolvePromise, setResolvePromise] = useState(null);

  const showConfirmation = useCallback(async (newOptions) => {
    setOptions(newOptions || {});
    setIsOpen(true);
    return await new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(false);
  }, [resolvePromise]);

  const handleAgree = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(true);
  }, [resolvePromise]);

  const confirmationElement = isOpen ? (
    <Confirmation
      show={isOpen}
      onClose={handleClose}
      onAgree={handleAgree}
      {...options}
    />
  ) : null;

  return {
    Confirmation: confirmationElement,
    showConfirmation,
  };
}
