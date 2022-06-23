import { FiTrash2, FiUploadCloud } from "react-icons/fi";
import React, { useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";

const Uploader = ({ setFormData }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    maxSize: 5000000,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) => {
          const filename = file.name.split(".");
          const newFile = new File([file], `${filename[0]}_${uuid()}.${filename.slice(-1)}`, {
            type: file.type,
          });
          return Object.assign(newFile, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
  });

  useEffect(() => {
    if (files.length === 0) return;
    const formData = new FormData();
    formData.append("file", files[0]);
    setFormData((prevData) => {
      return { ...prevData, formData, previewUrl: files[0]?.preview };
    });
  }, [files]);
  return (
    <div className="w-full text-center">
      {!files[0] ? (
        <div
          className="px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <span className="mx-auto flex justify-center">
            <FiUploadCloud className="text-3xl text-green-500" />
          </span>
          <p className="text-l mt-2 text-gray-400">Drag your image here</p>
          <em className="text-xs text-gray-400">(Only *.jpeg and *.png images will be accepted)</em>
        </div>
      ) : (
        <aside className="flex flex-row flex-wrap mt-4">
          <div className="flex flex-col">
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 max-h-64 p-2"
              src={files[0].preview}
              alt="product"
            />
            <div
              className="mt-2 self-center text-red-700 text-xl cursor-pointer"
              onClick={() => {
                setFiles("");
                setFormData(() => ({
                  url: "",
                  formData: false,
                  previewUrl: "",
                  deletedImageUrl: "",
                }));
              }}
            >
              <FiTrash2 />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Uploader;
