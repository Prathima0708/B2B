import { Input, Label, Select } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import { Checkbox } from "@material-ui/core";
import Scrollbars from "react-custom-scrollbars";
import axios from "axios";
import { coreServiceBaseUrl } from "../../utils/backendUrls";
import { notifyError } from "../../utils/toast";

const Filter = ({ active, brand, category }) => {
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [brandFilterText, setBrandFilterText] = useState("");
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryFilterText, setCategoryFilterText] = useState("");

  useEffect(async () => {
    await axios
      .get(`${coreServiceBaseUrl}/brands`)
      .then(({ data }) => setBrandList([...data.result]))
      .catch(() => notifyError("Unable to get all brands"));

    await axios
      .get(`${coreServiceBaseUrl}/categories`)
      .then(({ data }) => setCategoryList([...data.result]))
      .catch(() => notifyError("Unable to get all categories"));
  }, []);

  const renderActiveStatusFilter = () => {
    return (
      <Label className=" my-2">
        <span>Active Status</span>
        <Select
          className="mt-1"
          value={active.filter}
          onChange={(e) => active.setFilter(e.target.value)}
          name="filter"
        >
          <option value="">All Products</option>
          <option value="?is-active=true">Active Products</option>
          <option value="?is-active=false">Inactive Products</option>
        </Select>
      </Label>
    );
  };

  const renderBrandCheckboxFilter = () => {
    return (
      <div className="border-green-500 border-2 rounded-md flex flex-col  my-2 ">
        <div
          className="w-full  h-12  flex items-center justify-between px-1 cursor-pointer "
          onClick={() => {
            setCategoryExpanded(false);
            setBrandExpanded(!brandExpanded);
          }}
        >
          <div className="">
            <span className="text-gray-700 dark:text-gray-300">
              Filter By Brand
            </span>
          </div>
          <Checkbox
            checked={brandExpanded}
            color="info"
            style={{ color: "green" }}
          />
        </div>
        {brandExpanded && (
          <>
            <Input
              className="border h-8 text-sm focus:outline-none w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white align-center"
              label=" Seller Price"
              name="brandFilterText"
              type="text"
              placeholder="Search Brand"
              value={brandFilterText}
              onChange={(e) => setBrandFilterText(e.target.value)}
            />
            {brandList.length > 0 &&
              brandList
                .filter(
                  ({ name }) =>
                    name.toLowerCase().includes(brandFilterText) ||
                    brandFilterText.length === 0
                )
                .map(({ id, name }) => (
                  <div
                    key={id}
                    className="w-full flex items-center justify-between px-4"
                    //   onClick={(e) => setBrandExpanded(!brandExpanded)}
                  >
                    <div className="">
                      <span className="text-gray-700 dark:text-gray-300">
                        {name}
                      </span>
                    </div>
                    <Checkbox
                      checked={brandExpanded}
                      color="info"
                      style={{ color: "green" }}
                    />
                  </div>
                ))}
          </>
        )}
      </div>
    );
  };

  const renderCategoryCheckboxFilter = () => {
    return (
      <div className="border-green-500 border-2 rounded-md flex flex-col  my-2">
        <div
          className="w-full  h-12  flex items-center justify-between px-1 cursor-pointer "
          onClick={() => {
            setBrandExpanded(false);
            setCategoryExpanded(!categoryExpanded);
          }}
        >
          <div className="">
            <span className="text-gray-700 dark:text-gray-300">
              Filter By Category
            </span>
          </div>
          <Checkbox
            checked={categoryExpanded}
            color="info"
            style={{ color: "green" }}
          />
        </div>
        {categoryExpanded && (
          <>
            <Input
              className="border h-8 text-sm focus:outline-none w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white align-center"
              label=" Seller Price"
              name="categoryFilterText"
              type="text"
              placeholder="Search Category"
              value={categoryFilterText}
              onChange={(e) => setCategoryFilterText(e.target.value)}
            />
            {categoryList.length > 0 &&
              categoryList
                .filter(
                  ({ name }) =>
                    name.toLowerCase().includes(categoryFilterText) ||
                    categoryFilterText.length === 0
                )
                .map(({ id, name }) => (
                  <div
                    key={id}
                    className="w-full flex items-center justify-between px-4"
                    //   onClick={(e) => setBrandExpanded(!brandExpanded)}
                  >
                    <div className="">
                      <span className="text-gray-700 dark:text-gray-300">
                        {name}
                      </span>
                    </div>
                    <Checkbox
                      checked={categoryExpanded}
                      color="info"
                      style={{ color: "green" }}
                    />
                  </div>
                ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className=" w-2/5 border-gray-400 rounded-md mr-4 border-2 p-2 "
      style={{ minHeight: "500px" }}
    >
      <Scrollbars>
        {/* <PageTitle>Filters</PageTitle> */}
        {active && renderActiveStatusFilter()}
        {brand && renderBrandCheckboxFilter()}
        {category && renderCategoryCheckboxFilter()}
      </Scrollbars>
    </div>
  );
};

export default Filter;
