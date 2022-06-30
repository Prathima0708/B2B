import { Badge, Button, Input, Select } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import hasPermission, {
  PAGE_PRODUCT_UPDATE,
} from "../components/login/hasPermission";
import { notifyError, notifySuccess } from "../utils/toast";
import { useHistory, useParams } from "react-router-dom";

import ExistingImageDisplay from "../components/image-uploader/ExistingImageDisplay";
import { Grid } from "@mui/material";
import LabelArea from "../components/form/LabelArea";
import Loading from "../components/preloader/Loading";
import MapProductToCategory from "../components/category/MapProductToCategory";
import PageTitle from "../components/Typography/PageTitle";
import ProductAttributeInput from "../components/form/ProductAttributeInput";
import ProductBrand from "../components/product/ProductBrand";
import ReactTagInput from "@pathofdev/react-tag-input";
import Uploader from "../components/image-uploader/Uploader";

import apiService from "../utils/apiService";
import { assetServiceBaseUrl } from "../utils/backendUrls";
import axios from "axios";
import { uploaderUtil } from "../utils/uploaderUtil";

const AddProduct = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState();
  const [count, setCount] = useState(null);
  const [productName, setProductName] = useState("");
  const [tags, setTags] = useState([]);
  const [schemas, setSchemas] = useState([]);
  const [productResource, setProductResource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([
    {
      variantName: "",
      marketPrice: "",
      currency: "QAR",
      measure: "",
      deleted: false,
      variantResource: [],
    },
  ]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const unitsOptions = ["kgs", "gms", "ltrs", "ml", "packets", "bags"];
  const [unit, setUnit] = useState("kgs");
  const [tax, setTax] = useState({ gst: 0 });
  const [thumbnailImageFormData, setThumbnailImageFormData] = useState({
    url: "",
    formData: false,
    previewUrl: "",
    deletedImageUrl: "",
  });
  const currencyOption = ["QAR", "INR"];

  const history = useHistory();
  const [update, setUpdate] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (id) {
      setLoading(true);
      await apiService
        .get("b2b", "/schema")
        .then((data) => {
          setSchemas(data.data.result);
          return data.data.result;
        })
        .then(async () => {
          await apiService.get("b2b", `/products/${id}`).then((data) => {
            const { result } = data.data;
            setProductName(result.name);
            setBrand(() => result.brand?.id);
            setTimeout(() => {
              setCount(new Date());
            }, 1000);
            if (result.tags) setTags(result.tags.split(","));
            if (result.tax?.gst) setTax({ gst: result.tax.gst });
            if (result.thumbnailImage)
              setThumbnailImageFormData({
                url: result.thumbnailImage,
                formData: false,
                previewUrl: "",
                deletedImageUrl: "",
              });
            const prodRes = [];
            result.resources &&
              result.resources
                .filter((res) => res !== null)
                .forEach((res) => {
                  prodRes.push({
                    id: res.id,
                    attributeId: res.attributeId,
                    enValue: res.enValue,
                  });
                });
            setProductResource(prodRes);
            const prodVar = [];
            result.variants.forEach((variant) => {
              const varRes = [];
              variant.resources &&
                variant.resources
                  .filter((a) => a !== null)
                  .forEach((res) =>
                    varRes.push({
                      id: res.id,
                      attributeId: res.attributeId,
                      enValue: res.enValue,
                    })
                  );
              return prodVar.push({
                id: variant.id,
                deleted: variant?.deleted || false,
                variantName: variant?.name,
                marketPrice: variant?.marketPrice,
                measure: variant?.measure,
                currency: variant?.currency,
                variantResource: varRes,
              });
            });
            setVariants(prodVar);
          });
        })
        .then(() => setLoading(false));
    } else {
      await apiService.get("b2b", "/schema").then((data) => {
        setSchemas(data.data.result);
        return data.data.result;
      });
    }
  }, [update]);

  const handleFormSubmitLevel = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    if (!brand) {
      notifyError("Please select a brand");
      setSubmitLoader(false);
      return;
    }
    if (variants.length > 1) {
      const variantNames = new Set(
        variants.map((variant) => variant.variantName)
      );
      if (variantNames.size < variants.length) {
        notifyError("Variant names cannot be repeated");
        setSubmitLoader(false);
        return;
      }
    }
    if (id) {
      if (!thumbnailImageFormData.url && !thumbnailImageFormData.formData) {
        setSubmitLoader(false);
        return notifyError("Thumbnail image is required");
      }
      let tag;
      if (tags.length > 1) tag = tags.join(",");
      else tag = tags[0];
      const payload = {
        id: Number(id),
        name: productName,
        brandId: Number(brand),
        tags: tag,
        tax: { gst: 0 },
        unit,
        resources: [],
        variants: [],
      };
      if (thumbnailImageFormData.url)
        payload.thumbnailImage = thumbnailImageFormData.url;
      if (thumbnailImageFormData.formData)
        payload.thumbnailImage = await uploaderUtil(
          thumbnailImageFormData.formData
        );
      if (thumbnailImageFormData.deletedImageUrl.length > 0) {
        await axios.delete(
          `${assetServiceBaseUrl}/delete/by-url?url=${thumbnailImageFormData.deletedImageUrl}`
        );
      }
      productResource.forEach(({ attributeId, enValue, id }) => {
        const obj = {
          enValue,
          attributeId,
          delete: false,
        };
        if (id) {
          obj.id = id;
          if (!enValue) obj.delete = true;
          return payload.resources.push(obj);
        } else {
          if (!enValue) return;
          return payload.resources.push(obj);
        }
      });
      variants.forEach(
        ({
          id,
          variantName,
          marketPrice,
          currency,
          measure,
          variantResource,
          deleted = false,
        }) => {
          const variant = {
            name: variantName,
            marketPrice: Number(marketPrice),
            currency,
            measure: Number(measure),
            deleted,
            resource: [],
          };
          if (id) {
            variant.id = id;
          }

          variantResource.forEach(({ attributeId, enValue, id }) => {
            const obj = {
              attributeId,
              enValue,
              delete: false,
            };
            if (id) {
              obj.id = id;
              if (!enValue) obj.delete = true;
              return variant.resource.push(obj);
            } else {
              if (!enValue) return;
              return variant.resource.push(obj);
            }
          });
          return payload.variants.push(variant);
        }
      );
      await apiService
        .post("b2b", `/products/product-variant`, payload)
        .then(() => {
          notifySuccess("Product updated successfully");
          setUpdate(!update);
        })
        .catch((err) =>
          notifyError(err.response.data.errorMessage || "Something went wrong")
        );
      setSubmitLoader(false);
    } else {
      if (!thumbnailImageFormData.formData) {
        setSubmitLoader(false);
        return notifyError("Thumbnail image is required");
      }
      let tag;
      if (tags.length > 1) tag = tags.join(",");
      else tag = tags[0];
      const payloadNew = {
        name: productName,
        tags,
        brandId: Number(brand),
        tags: tag,
        tax: { gst: 0 },
        unit,
        resources: [],
        variants: [],
      };
      payloadNew.thumbnailImage = await uploaderUtil(
        thumbnailImageFormData.formData
      );
      productResource.forEach(({ attributeId, enValue }) => {
        if (!enValue) return;
        return payloadNew.resources.push({
          enValue,
          attributeId,
          delete: false,
        });
      });
      variants.forEach(
        ({ variantName, marketPrice, currency, measure, variantResource }) => {
          const variant = {
            name: variantName,
            marketPrice: Number(marketPrice),
            currency,
            measure,
            deleted: false,
            resource: [],
          };
          variantResource.forEach(({ attributeId, enValue }) => {
            if (!enValue) return;
            return variant.resource.push({
              attributeId,
              enValue,
              delete: false,
            });
          });
          return payloadNew.variants.push(variant);
        }
      );
      await apiService
        .post("b2b", `/products/product-variant`, payloadNew)
        .then((data) => {
          notifySuccess("Product added successfully");
          history.push(`/products/${data.data.result.id}`);
        })
        .catch((err) =>
          notifyError(err.response.data.errorMessage || "Something went wrong")
        );
      setSubmitLoader(false);
    }
  };

  const getVariants = () => {
    return variants.map((variant, i) => (
      <div className="p-3 my-1 border rounded-md border-gray-100 dark:border-gray-600">
        <Grid container spacing={3}>
          <Grid item lg={3} md={6} sm={6} xs={12} className="">
            <LabelArea label="Variant Name *" />
            <div className="col-span-8 sm:col-span-4">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="Variant Name"
                name={`variant${i}`}
                key={`variant${i}`}
                type="text"
                required
                placeholder="Enter variant name"
                value={variant.variantName}
                onChange={(e) => {
                  setVariants((prevData) => {
                    if (i === Number(e.target.name.slice(-1))) {
                      prevData[i].variantName = e.target.value;
                      return [...prevData];
                    } else return [...prevData];
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} className="">
            <LabelArea label="Market Price *" />
            <div className="col-span-8 sm:col-span-4">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="Market Price"
                name={`variant${i}`}
                key={`variant${i}`}
                type="text"
                required
                placeholder="Enter market price "
                value={variant.marketPrice}
                onChange={(e) => {
                  setVariants((prevData) => {
                    if (i === Number(e.target.name.slice(-1))) {
                      prevData[i].marketPrice = e.target.value.replace(
                        /[^0-9]/gi,
                        ""
                      );
                      return [...prevData];
                    } else return [...prevData];
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} className="">
            <LabelArea label="Currency" />
            <div className="col-span-8 sm:col-span-4">
              <Select
                onChange={(e) => {
                  setVariants((prevData) => {
                    if (i === Number(e.target.name.slice(-1))) {
                      prevData[i].currency = e.target.value;
                      return [...prevData];
                    } else return [...prevData];
                  });
                }}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                name={`variant${i}`}
                key={`variant${i}`}
                value={variant.currency}
              >
                {currencyOption.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </div>
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12} className="">
            <LabelArea label="Measure *" />
            <div className="col-span-8 sm:col-span-4 flex flex-row">
              <Input
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                label="Measure"
                required
                name={`variant${i}`}
                key={`variant${i}`}
                type="text"
                placeholder="Enter product measure "
                value={variant.measure}
                onChange={(e) => {
                  setVariants((prevData) => {
                    if (i === Number(e.target.name.slice(-1))) {
                      prevData[i].measure = e.target.value.replace(
                        /[^0-9]/gi,
                        ""
                      );
                      return [...prevData];
                    } else return [...prevData];
                  });
                }}
              />
              <div className=" self-center">
                <span className=" text-gray-700 dark:text-gray-300">{` ${unit}`}</span>
              </div>
            </div>
          </Grid>
        </Grid>
        {schemas
          .filter((schema) => schema.isVariant)
          .sort((attr) => attr.rank)
          .map((schema) => (
            <>
              <ProductAttributeInput
                key={schema.id}
                id={schema.id}
                setProductAttributes={setVariants}
                titleName={schema.titleName}
                displayName={schema.displayName}
                description={schema.description}
                mandatory={schema.mandatory}
                dataType={schema.dataType}
                requiredUnits={schema.requiredUnits}
                unitValue={schema.unitValue}
                isVariant={true}
                // edit={true}
                index={i}
                currentValue={
                  variants[i].variantResource?.filter(
                    (vr) => vr.attributeId === schema.id
                  )[0]
                    ? variants[i].variantResource.filter(
                        (vr) => vr.attributeId === schema.id
                      )[0]
                    : null
                }
              />
            </>
          ))}
        <div className="mb-10">
          <>
            {id ? (
              <>
                {i < variants.length && (
                  <span className="ml-2 text-xl">
                    <Badge
                      className="cursor-pointer"
                      type={variants[i].deleted ? `warning` : `danger`}
                      id={`delete${i}`}
                      onClick={(e) => {
                        if (id) {
                          setVariants((prevData) => {
                            if (prevData[i].id) {
                              prevData[i].deleted = !prevData[i].deleted;
                              return [...prevData];
                            } else {
                              return [
                                ...variants.filter((index) => index !== i),
                              ];
                            }
                          });
                        } else {
                          setVariants(variants.filter((index) => index !== i));
                        }
                      }}
                    >
                      {variants[i].deleted ? `Restore` : `Delete`}
                    </Badge>
                  </span>
                )}
              </>
            ) : (
              <>
                {i > 0 && i < variants.length && (
                  <span className="ml-2 text-xl">
                    <Badge
                      className="cursor-pointer"
                      type={variants[i].deleted ? `warning` : `danger`}
                      id={`delete${i}`}
                      onClick={() => {
                        if (id) {
                          setVariants((prevData) => {
                            if (prevData[i].id) {
                              prevData[i].deleted = !prevData[i].deleted;
                              return [...prevData];
                            } else {
                              return [
                                ...variants.filter((index) => index !== i),
                              ];
                            }
                          });
                        } else {
                          setVariants(variants.filter((index) => index !== i));
                        }
                      }}
                    >
                      {variants[i].deleted ? `Restore` : `Delete`}
                    </Badge>
                  </span>
                )}
              </>
            )}
          </>
          {variants.length === i + 1 && (
            <>
              <span
                className="ml-2 text-xl "
                onClick={() =>
                  setVariants((prevData) => [
                    ...prevData,
                    (prevData[i + 1] = {
                      variantName: "",
                      marketPrice: "",
                      currency: "QAR",
                      variantResource: [],
                    }),
                  ])
                }
              >
                <Badge className="cursor-pointer" type="success">
                  Add Variant
                </Badge>
              </span>
              <span
                className="ml-2 text-xl "
                onClick={() =>
                  setVariants((prevData) => [
                    ...prevData,
                    (prevData[i + 1] = {
                      variantName: prevData[i].variantName,
                      marketPrice: prevData[i].marketPrice,
                      currency: prevData[i].currency,
                      variantResource: [
                        ...prevData[i].variantResource.map(
                          ({ id, ...rest }) => rest
                        ),
                      ],
                    }),
                  ])
                }
              >
                <Badge className="cursor-pointer">Copy Variant</Badge>
              </span>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <>
      <PageTitle>{id ? `Update Product` : `Add product`}</PageTitle>
      <p className=" text-gray-700 dark:text-gray-300 text-xs -mt-6">
        * Required
      </p>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          {id && (
            <>
              {hasPermission(PAGE_PRODUCT_UPDATE, "viewCategory") && (
                <MapProductToCategory productId={id} />
              )}
            </>
          )}
          <form onSubmit={handleFormSubmitLevel} className="block">
            <Grid container spacing={3}>
              <Grid item lg={5} md={6} sm={6} xs={12} className="">
                <LabelArea label="Brand *" />
                <Select
                  onChange={(e) => setBrand(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="brand"
                  value={brand}
                >
                  <option defaultValue hidden>
                    Select Brand
                  </option>
                  <ProductBrand />
                </Select>
              </Grid>
              <Grid item lg={5} md={6} sm={6} xs={12} className="">
                <LabelArea label="Product Title/Name *" />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    label="Product Name"
                    name="productName"
                    type="text"
                    required
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid item lg={2} md={6} sm={6} xs={12} className="">
                <LabelArea label="Unit" />
                <div className="col-span-8 sm:col-span-4">
                  <Select
                    onChange={(e) => setUnit(e.target.value)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="unit"
                    value={unit}
                  >
                    {unitsOptions.map((un) => (
                      <option key={un} value={un}>
                        {un}
                      </option>
                    ))}
                  </Select>
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} className="">
                {/* <LabelArea label="Tax" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  label="Tax percentage"
                  name="tax"
                  type="text"
                  placeholder="Enter product tax"
                  value={tax.gst}
                  onChange={(e) => setTax({ gst: e.target.value })}
                /> 
              </div>*/}
                <LabelArea label="Product Tag" />
                <div className="col-span-8 sm:col-span-4">
                  <ReactTagInput
                    placeholder="Product Tag (Write then press enter to add new tag )"
                    tags={tags}
                    onChange={(newTags) => setTags(newTags)}
                  />
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} className="">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Thumbnail Image *" />
                  <div className="col-span-8 sm:col-span-4">
                    {thumbnailImageFormData.url ? (
                      <ExistingImageDisplay
                        setFormData={setThumbnailImageFormData}
                        url={thumbnailImageFormData.url}
                      />
                    ) : (
                      <Uploader setFormData={setThumbnailImageFormData} />
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="py-8 flex-grow w-full ">
              {schemas
                .filter((schema) => !schema.isVariant)
                .sort((attr) => attr.rank)
                .map((schema) => (
                  <ProductAttributeInput
                    key={schema.id}
                    id={schema.id}
                    setProductAttributes={setProductResource}
                    titleName={schema.titleName}
                    displayName={schema.displayName}
                    description={schema.description}
                    mandatory={schema.mandatory}
                    dataType={schema.dataType}
                    requiredUnits={schema.requiredUnits}
                    unitValue={schema.unitValue}
                    currentValue={
                      id &&
                      productResource.filter(
                        (pr) => pr.attributeId === schema.id
                      )[0]
                        ? productResource.filter(
                            (pr) => pr.attributeId === schema.id
                          )[0]
                        : null
                    }
                  />
                ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 m-1">
              Product variants
            </p>
            <div className=" py-8 flex-grow w-full ">{getVariants()}</div>
            {hasPermission(PAGE_PRODUCT_UPDATE, "update") && (
              <div
                className="w-full md:w-56 lg:w-56 xl:w-56 mb-10"
                style={{ width: "100%" }}
              >
                {!submitLoader ? (
                  <Button type="submit" className="w-full rounded-md h-12">
                    Submit
                  </Button>
                ) : (
                  <Loading loading={submitLoader} />
                )}
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default AddProduct;
