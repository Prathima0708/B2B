import { FiTrash2 } from "react-icons/fi";
import React from "react";

const ExistingImageDisplay = ({ url, setFormData, nonDelete = false }) => {
  return (
    <aside className="flex flex-row flex-wrap mt-4">
      <div className="flex flex-col">
        <img
          className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 h-auto min-w-64 max-h-64 p-2"
          src={url}
          alt="product"
        />
        {!nonDelete && (
          <div
            className="mt-2 self-center text-red-700 text-xl cursor-pointer"
            onClick={() => {
              setFormData((prevData) => ({
                url: "",
                formData: false,
                previewUrl: "",
                deletedImageUrl: prevData.url,
              }));
            }}
          >
            <FiTrash2 />
          </div>
        )}
      </div>
    </aside>
  );
};

export default ExistingImageDisplay;
