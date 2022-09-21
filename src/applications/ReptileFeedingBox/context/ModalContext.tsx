import React, { FC, useState, createContext } from 'react';
type ModalContext = {
  ModalToggle: boolean
  toggleModal: () => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContext>({} as ModalContext);

export const ModalProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ModalToggle, setModalToggle] = useState(false);
  const toggleModal = () => {
    setModalToggle(!ModalToggle);
  };
  const closeModal = () => {
    setModalToggle(false);
  };

  return (
    <ModalContext.Provider value={{ ModalToggle, toggleModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
