import { Badge, Input, Textarea } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import { FiTrash2 } from "react-icons/fi";
import InstantUploader from "../image-uploader/InstantUploader";
import LabelArea from "./LabelArea";

const ProductAttributeInput = ({
  displayName,
  description,
  mandatory,
  dataType,
  unitValue,
  requiredUnits,
  id,
  setProductAttributes,
  isVariant,
  index,
  currentValue,
}) => {
  const [enValue, setValue] = useState("");
  const [attributeId, setAttributeId] = useState(id);
  const [type, setType] = useState("text");
  const [jsonObject, setJsonObject] = useState([{ key: "", value: "" }]);
  const [jsonList, setJsonList] = useState([""]);

  useEffect(() => {
    if (dataType === "FLOAT" || dataType === "INTEGER") setType("number");
    if (dataType === "STRING") setType("text");
    if (currentValue) {
      if (dataType === "JSON_LIST") setJsonList(JSON.parse(currentValue.enValue));
      if (dataType === "JSON_OBJ") setJsonObject(JSON.parse(currentValue.enValue));
      if (dataType !== "JSON_LIST" && dataType !== "JSON_OBJ") setValue(currentValue.enValue);
      setAttributeId(currentValue.attributeId);
    }
    if (isVariant) {
      setValue(currentValue?.enValue);
    }
  }, []);

  const handleChange = (e) => {
    if (isVariant) {
      setProductAttributes((prevData) => {
        const attributeIndex = prevData[index].variantResource.findIndex((attr) => attr.attributeId === id);
        if (attributeIndex !== -1) {
          setValue(e.target.value);
          prevData[index].variantResource[attributeIndex] = {
            ...prevData[index].variantResource[attributeIndex],
            attributeId,
            enValue: e.target.value,
          };
          return [...prevData];
        } else {
          setValue(e.target.value);
          prevData[index].variantResource.push({ attributeId, enValue: e.target.value });
          return [...prevData];
        }
      });
    } else {
      setProductAttributes((prevData) => {
        const attributeIndex = prevData.findIndex((attr) => attr.attributeId === id);
        if (attributeIndex !== -1) {
          setValue(e.target.value);
          prevData[attributeIndex] = { ...prevData[attributeIndex], attributeId, enValue: e.target.value };
          return [...prevData];
        } else {
          setValue(e.target.value);
          return [...prevData, { attributeId, enValue: e.target.value }];
        }
      });
    }
  };

  const setProdAttr = (prevData) => {
    setProductAttributes((data) => {
      const attributeIndex = data.findIndex((attr) => attr.attributeId === id);
      if (attributeIndex !== -1) {
        if (dataType === "JSON_LIST")
          data[attributeIndex] = {
            ...data[attributeIndex],
            attributeId,
            enValue: JSON.stringify(...prevData.filter((fea) => fea.length > 0)),
          };
        else if (dataType === "JSON_OBJ")
          data[attributeIndex] = {
            ...data[attributeIndex],
            attributeId,
            enValue: JSON.stringify(
              ...prevData.filter((spec) => spec.key.length > 0 && spec.value.length > 0)
            ),
          };
        data[attributeIndex] = {
          ...data[attributeIndex],
          attributeId,
          enValue: JSON.stringify([...prevData]),
        };
        return [...data];
      } else return [...data, { attributeId, enValue: JSON.stringify([...prevData]) }];
    });
  };

  const renderJsonListInputs = () => {
    return (
      <>
        {jsonList.map((feature, i) => (
          <div
            key={`feature${i}`}
            className="col-span-8 sm:col-span-4"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Input
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white mb-1"
              name={`feature${i}`}
              required={mandatory}
              type="text"
              placeholder={description}
              value={feature}
              onChange={(e) =>
                setJsonList((prevData) => {
                  if (i === Number(e.target.name.slice(-1))) {
                    prevData[i] = e.target.value;
                    setProdAttr(prevData);
                    return [...prevData];
                  } else {
                    setProdAttr(prevData);
                    return [...prevData];
                  }
                })
              }
            />
            {i > 0 && i < jsonList.length && (
              <span className="ml-2 text-xl ">
                <Badge
                  className="cursor-pointer"
                  type="danger"
                  id={`delete${i}`}
                  onClick={(e) => {
                    setJsonList((prevData) => {
                      setProdAttr([...prevData.filter((fea, index) => index !== i)]);
                      return [...prevData.filter((fea, index) => index !== i)];
                    });
                  }}
                >
                  Delete
                </Badge>
              </span>
            )}
            {jsonList.length === i + 1 && (
              <span
                className="ml-2 text-xl "
                onClick={(e) => setJsonList((prevData) => [...prevData, (prevData[i + 1] = "")])}
              >
                <Badge className="cursor-pointer" type="success">
                  Add Feature
                </Badge>
              </span>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderJsonObjectInputs = () => {
    return (
      <>
        {jsonObject.map((spec, i) => (
          <div
            key={`spec${i}`}
            style={{ display: "flex", flexDirection: "column" }}
            className="col-span-8 sm:col-span-4 "
          >
            <Input
              name={`key${i}`}
              placeholder="Key"
              type="text"
              required={mandatory}
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white mb-2"
              value={spec.key}
              onChange={(e) =>
                setJsonObject((prevData) => {
                  if (i === Number(e.target.name.slice(-1))) {
                    prevData[i].key = e.target.value;
                    return [...prevData];
                  } else return [...prevData];
                })
              }
            />

            <div className=" mb-2">
              <Textarea
                name={`value${i}`}
                value={spec.value}
                rows="5"
                required={mandatory}
                placeholder="Value"
                className="border h-36 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white "
                style={{ alignSelf: "flex-end" }}
                onChange={(e) =>
                  setJsonObject((prevData) => {
                    if (i === Number(e.target.name.slice(-1))) {
                      prevData[i].value = e.target.value;
                      setProdAttr(prevData);
                      return [...prevData];
                    } else {
                      setProdAttr(prevData);
                      return [...prevData];
                    }
                  })
                }
              />
            </div>
            {i > 0 && i < jsonObject.length && (
              <span className="ml-2 text-xl">
                <Badge
                  className="cursor-pointer"
                  type="danger"
                  id={`delete${i}`}
                  onClick={(e) => {
                    setJsonObject((prevData) => {
                      setProdAttr([...prevData.filter((fea, index) => index !== i)]);
                      return [...prevData.filter((fea, index) => index !== i)];
                    });
                  }}
                >
                  Delete
                </Badge>
              </span>
            )}
            {jsonObject.length === i + 1 && (
              <span
                className="ml-2 text-xl"
                onClick={(e) =>
                  setJsonObject((prevData) => [...prevData, (prevData[i + 1] = { key: "", value: "" })])
                }
              >
                <Badge className="cursor-pointer" type="success">
                  Add Specification
                </Badge>
              </span>
            )}
          </div>
        ))}
      </>
    );
  };
  const renderImageUpload = () => {
    const setUrl = (url) => {
      setProductAttributes((prevData) => {
        const attributeIndex = prevData.findIndex((attr) => attr.attributeId === id);
        if (attributeIndex !== -1) {
          setValue(url);
          prevData[attributeIndex] = { ...prevData[attributeIndex], attributeId, enValue: url };
          return [...prevData];
        } else {
          setValue(url);
          return [...prevData, { attributeId, enValue: url }];
        }
      });
    };
    return (
      <div className="col-span-8 sm:col-span-4" style={{ display: "flex", flexDirection: "row" }}>
        {enValue ? (
          <div className="flex flex-row">
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 max-h-64 p-2"
              src={enValue}
              alt=""
            />
            <div className="ml-2 self-center text-red-700 text-xl cursor-pointer" onClick={() => setUrl("")}>
              <FiTrash2 />
            </div>
          </div>
        ) : (
          <InstantUploader setUrl={setValue} event={setUrl} currentUrl={enValue} />
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      {displayName && <LabelArea label={mandatory ? `${displayName} *` : displayName} />}
      {dataType === "JSON_LIST" && renderJsonListInputs()}
      {dataType === "JSON_OBJ" && renderJsonObjectInputs()}
      {dataType === "IMAGE_TYPE" && renderImageUpload()}
      {dataType !== "JSON_LIST" && dataType !== "JSON_OBJ" && dataType !== "IMAGE_TYPE" && (
        <div className="col-span-8 sm:col-span-4" style={{ display: "flex", flexDirection: "row" }}>
          <Input
            className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
            name="enValue"
            required={mandatory}
            type={type}
            placeholder={description}
            value={enValue}
            onChange={handleChange}
          />
          {requiredUnits && (
            <span className="ml-2 text-xl mt-2 text-grey-500 dark:text-white">{unitValue}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAttributeInput;
