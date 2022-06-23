import { Card, Input } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import hasPermission, { PAGE_CATEGORY_LIST, PAGE_PRODUCT_UPDATE } from "../login/hasPermission";

import CategoryItem from "./CategoryItem";
import Loading from "../preloader/Loading";
import PageTitle from "../Typography/PageTitle";
import apiService from "../../utils/apiService";

const MapProductToCategory = ({ productId }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  useEffect(() => {
    setFilterText((prevData) => prevData);
    setLoading(true);
    apiService.get("b2b", "/categories", null).then((data) => {
      const categoryArray = [];
      data.data.result.forEach(({ id, name, children }) => {
        categoryArray.push({ id, name });
        children.forEach(({ id, name }) => {
          categoryArray.push({ id, name });
        });
      });
      setAllCategories([...categoryArray]);
      if (filterText.length === 0) setFilteredCategories(categoryArray);
      else
        setFilteredCategories(
          categoryArray.filter((ac) => ac.name.toLowerCase().includes(filterText.toLowerCase()))
        );
    });
    apiService
      .get("b2b", `/category-product/categories?productId=${productId}`)
      .then((data) => setProductCategories(data.data.result));
    setLoading(false);
    if (filterText.length === 0) return setFilteredCategories(allCategories);
    setFilteredCategories(
      allCategories.filter((ac) => ac.name.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [update]);
  useEffect(() => {
    setFilterText((prevData) => prevData);
    if (filterText.length === 0) return setFilteredCategories(allCategories);
    setFilteredCategories(
      allCategories.filter((ac) => ac.name.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [filterText]);
  return (
    <div className=" mb-10">
      <PageTitle>Map product to category</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 p-4 w-full  border-gray-600 border-2 mb-5">
        <p className="text-gray-700 dark:text-gray-300 m-1">Mapped categories</p>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div className="flex flex-row flex-wrap">
            {allCategories.map((category) => {
              const [isMapped = false] = productCategories.filter((pc) => pc.category.id === category.id);
              return (
                <CategoryItem
                  key={category.id}
                  categoryId={category.id}
                  productId={productId}
                  name={category.name}
                  mapped={isMapped}
                  imageUrl={category.imageUrl}
                  update={setUpdate}
                  display={isMapped}
                />
              );
            })}
          </div>
        )}
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 p-4 w-full  border-gray-600 border-2">
        <p className="text-gray-700 dark:text-gray-300 m-1">Categories</p>
        <div className="grid gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <div className="col-span-8 sm:col-span-4">
            <Input
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
              label="Search category"
              name="filterText"
              type="text"
              placeholder="Search category"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div className="flex flex-row flex-wrap">
            {filteredCategories.map((category) => {
              const [isMapped = false] = productCategories.filter((pc) => pc.category.id === category.id);
              if (isMapped) return null;
              return (
                <CategoryItem
                  key={category.id}
                  categoryId={category.id}
                  productId={productId}
                  name={category.name}
                  mapped={isMapped}
                  imageUrl={category.imageUrl}
                  update={setUpdate}
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MapProductToCategory;
