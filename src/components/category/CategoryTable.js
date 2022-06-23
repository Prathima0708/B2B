import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import hasPermission, { PAGE_CATEGORY_LIST } from "../login/hasPermission";

import CategoryDrawer from "../drawer/CategoryDrawer";
import EditDeleteButton from "../table/EditDeleteButton";
import MainDrawer from "../drawer/MainDrawer";
import MainModal from "../modal/MainModal";
import React from "react";
import { defaultImage } from "../../utils/constants";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const CategoryTable = ({ categories }) => {
  const { serviceId, handleModalOpen, handleUpdate, serviceParentId } = useToggleDrawer();
  const getCategories = (children) => {
    if (children.length === 0) return "-";
    const subCategoryName = [];
    children.map((child) => subCategoryName.push(child.name));
    return subCategoryName.join(", ");
  };

  const showChildrenCategories = (id) => {
    let categoryHeader = document.getElementById(id + "-category-by-id-header");
    // let categoryRow = document.getElementById('category-by-id'+id);

    if (categoryHeader != null) {
      document.getElementById(id + "-category-by-id-header").style.display =
        categoryHeader.style.display === "revert" ? "none" : "revert";
      document.getElementById(id + "-category-by-id-header").style.animation =
        categoryHeader.style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      // document.getElementById('category-by-id'+id).style.display = categoryRow.style.display === "revert" ? "none" : "revert";
      // document.getElementById('category-by-id'+id).style.animation = categoryRow.style.display === "revert" ? 'fadeIn 2s' : 'fadeOut 2s';
      const nodeList = document.querySelectorAll("#category-by-id" + id);
      for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].style.display = nodeList[i].style.display === "revert" ? "none" : "revert";
        nodeList[i].style.animation = nodeList[i].style.display === "revert" ? "fadeIn 2s" : "fadeOut 2s";
      }
    }
  };

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        <CategoryDrawer id={serviceId} parentId={serviceParentId} />
      </MainDrawer>

      <TableBody>
        {categories?.map((parent) => {
          return (
            <>
              <TableRow
                key={parent.id}
                onClick={() => {
                  showChildrenCategories(parent.id);
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-semibold uppercase text-xs">{parent.id}</TableCell>
                <TableCell>
                  <Avatar
                    className="hidden mr-3 md:block bg-gray-50 p-1"
                    src={parent.imageUrl ? parent.imageUrl : defaultImage}
                    alt={parent.name}
                  />
                </TableCell>
                <TableCell className="text-sm">{parent.rank}</TableCell>
                <TableCell className="text-sm">{parent.name}</TableCell>
                <TableCell className="text-sm">{getCategories(parent.children)}</TableCell>
                {(hasPermission(PAGE_CATEGORY_LIST, "update") ||
                  hasPermission(PAGE_CATEGORY_LIST, "delete")) && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <EditDeleteButton
                      id={parent.id}
                      permissionPage={PAGE_CATEGORY_LIST}
                      handleUpdate={handleUpdate}
                      handleModalOpen={handleModalOpen}
                      product={null}
                      parentId={parent.id}
                    />
                  </TableCell>
                )}
              </TableRow>
              {parent.children.length ? (
                <TableRow
                  id={parent.id + "-category-by-id-header"}
                  className={
                    "bg-gray-200 dark:bg-gray-700  text-xs hidden delay-150 " + parent.id + "-category-by-id"
                  }
                >
                  <TableCell>ID</TableCell>
                  <TableCell>ICON</TableCell>
                  <TableCell>RANK</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>{""}</TableCell>
                  {(hasPermission(PAGE_CATEGORY_LIST, "update") ||
                    hasPermission(PAGE_CATEGORY_LIST, "delete")) && <TableCell>ACTIONS</TableCell>}
                </TableRow>
              ) : null}
              {parent.children.length
                ? parent.children.map((child, id) => (
                    <TableRow
                      id={"category-by-id" + parent.id}
                      className={
                        "bg-gray-200 dark:bg-gray-700  text-xs hidden delay-150 " +
                        parent.id +
                        "-category-by-id"
                      }
                    >
                      <TableCell>{child.id}</TableCell>
                      <TableCell>
                        <Avatar
                          className="hidden mr-3 md:block bg-gray-50 p-1"
                          src={
                            child.imageUrl
                              ? child.imageUrl
                              : "https://5.imimg.com/data5/SELLER/Default/2021/5/GH/WC/ZY/127199812/fresh-mango-fruits-500x500.jpg"
                          }
                          alt={parent.name}
                        />
                      </TableCell>
                      <TableCell>{child.rank}</TableCell>
                      <TableCell>{child.name}</TableCell>
                      <TableCell>{""}</TableCell>
                      {(hasPermission(PAGE_CATEGORY_LIST, "update") ||
                        hasPermission(PAGE_CATEGORY_LIST, "delete")) && (
                        <TableCell>
                          <EditDeleteButton
                            id={child.id}
                            permissionPage={PAGE_CATEGORY_LIST}
                            handleUpdate={handleUpdate}
                            handleModalOpen={handleModalOpen}
                            product={null}
                            parentId={parent.id}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                : null}
            </>
          );
        })}
      </TableBody>
    </>
  );
};

export default CategoryTable;
