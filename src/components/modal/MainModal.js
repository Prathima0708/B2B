import { Button, Modal, ModalBody, ModalFooter } from "@windmill/react-ui";
import React, { useContext } from "react";
import { notifyError, notifySuccess } from "../../utils/toast";

import AdminServices from "../../services/AdminServices";
import CategoryServices from "../../services/CategoryServices";
import CouponServices from "../../services/CouponServices";
import { FiTrash2 } from "react-icons/fi";
import ProductServices from "../../services/ProductServices";
import { SidebarContext } from "../../context/SidebarContext";
import UserServices from "../../services/UserServices";
import axios from "axios";
import { coreServiceBaseUrl } from "../../utils/backendUrls";
import { useLocation } from "react-router-dom";

const MainModal = ({ id }) => {
  const { isModalOpen, closeModal, setIsUpdate } = useContext(SidebarContext);
  const location = useLocation();

  const handleDelete = async () => {
    if (location.pathname === "/products") {
      ProductServices.deleteProduct(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      // notifySuccess('Product Deleted Successfully!');
      closeModal();
    }

    if (location.pathname === "/category") {
      // CategoryServices.deleteCategory(id)
      //   .then((res) => {
      //     setIsUpdate(true);
      //     notifySuccess(res.message);
      //   })
      //   .catch((err) => notifyError(err.message));
      // // notifySuccess('Category Deleted Successfully!');
      await axios
        .delete(`${coreServiceBaseUrl}/categories/${id}`)
        .then(() => {
          notifySuccess("Category Deleted Successfully");
          return setIsUpdate(true);
        })
        .catch((err) => console.log(err));

      closeModal();
    }
    if (location.pathname === "/attributes") {
      // CategoryServices.deleteCategory(id)
      //   .then((res) => {
      //     setIsUpdate(true);
      //     notifySuccess(res.message);
      //   })
      //   .catch((err) => notifyError(err.message));
      // // notifySuccess('Category Deleted Successfully!');
      await axios
        .delete(`${coreServiceBaseUrl}/schema/${id}`)
        .then(() => {
          notifySuccess("Attribute Deleted Successfully");
          return setIsUpdate(true);
        })
        .catch((err) => console.log(err));

      closeModal();
    }
    if (location.pathname === "/brand") {
      await axios
        .delete(`${coreServiceBaseUrl}/brands/${id}`)
        .then(() => {
          notifySuccess("Brand Deleted Successfully");
          return setIsUpdate(true);
        })
        .catch((err) => console.log(err));

      closeModal();
    }
    if (location.pathname === "/customers") {
      UserServices.deleteUser(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      // notifySuccess('Customer Deleted Successfully!');
      closeModal();
    }

    if (location.pathname === "/coupons") {
      CouponServices.deleteCoupon(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      // notifySuccess('Coupon Deleted Successfully!');
      closeModal();
    }
    if (location.pathname === "/our-staff") {
      AdminServices.deleteStaff(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      // notifySuccess('Staff Deleted Successfully!');
      closeModal();
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-1">Are You Sure! Want to Delete This Record?</h2>
          <p>
            Do you really want to delete these records? You can't view this in your list anymore if you
            delete!
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            layout="outline"
            onClick={closeModal}
          >
            No, Keep It
          </Button>
          <Button onClick={handleDelete} className="w-full sm:w-auto">
            Yes, Delete It
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(MainModal);
