import { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '../context/SidebarContext';

const useToggleDrawer = () => {
  const [serviceId, setServiceId] = useState('');
  const [serviceParentId, setServiceParentId] = useState('');
  const { toggleDrawer, isDrawerOpen, toggleModal } =
    useContext(SidebarContext);

  const handleUpdate = (id,parentId) => {
    setServiceId(id);
    setServiceParentId(parentId);
    toggleDrawer();
  };

  const handleModalOpen = (id,parentId) => {
    setServiceId(id);
    setServiceParentId(parentId);
    toggleModal();
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setServiceId();
      setServiceParentId();
    }
  }, [isDrawerOpen]);

  return {
    serviceId,
    handleModalOpen,
    handleUpdate,
    serviceParentId,
  };
};

export default useToggleDrawer;
