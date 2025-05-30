import React from 'react';
import styled from 'styled-components';
import { IoCloseOutline } from "react-icons/io5";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

function ImageModal({ isOpen, onClose, imageUrl, alt }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <IoCloseOutline size={40} />
        </CloseButton>
        <ModalImage src={imageUrl} alt={alt} />
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImageModal; 