const GET = "GET";
const POST = "POST";
const PATCH = "PATCH";
const PUT = "PUT";
const DELETE = "DELETE";

export const PAGE_USERS_STORES = "/users/store";
const GET_USER_STORES = "/api/v1/user_stores";
const ADD_USER_STORE = "/api/v1/user_stores";
const GET_USER_STORE = "/api/v1/user_store/{id}";
const UPDATE_USER_STORE = "/api/v1/user_store/{id}";
const DELETE_USER_STORE = "/api/v1/user_store/{id}";

export const PAGE_APP_CONFIG = "/app/config";
const GET_APP_CONFIGS = "/api/v1/app_configs";
const ADD_APP_CONFIG = "/api/v1/app_configs";
const UPDATE_APP_CONFIG = "/api/v1/app_configs/{id}";
const DELETE_APP_CONFIG = "/api/v1/app_configs/{id}";

export const PAGE_BRAND_LIST = "/brand";
const GET_BRANDS = "/api/v1/brands";
const GET_BRAND = "/api/v1/brands/{id}";
const ADD_BRAND = "/api/v1/brands";
const UPDATE_BRAND = "/api/v1/brands/{id}";
const DELETE_BRAND = "/api/v1/brands/{id}";

export const PAGE_CATEGORY_LIST = "/category";
const GET_CATEGORIES = "/api/v1/categories";
const GET_CATEGORY = "/api/v1/categories/{id}";
const ADD_CATEGORY = "/api/v1/categories";
const UPDATE_CATEGORY = "/api/v1/categories/{id}";
const DELETE_CATEGORY = "/api/v1/categories/{id}";

export const PAGE_PRODUCTS_LIST = "/products";
export const PAGE_PRODUCT_ADD = "/products/add";
export const PAGE_PRODUCT_UPDATE = "/products/:id";
const GET_PRODUCTS = "/api/v1/products";
const GET_PRODUCT_BY_ID = "/api/v1/products/{id}";
const ADD_OR_UPDATE_PRODUCT = "/api/v1/products/product-variant";
const TOGGLE_PRODUCT_DELETE = "/api/v1/products/toggle-delete/{id}";

const GET_PRODUCT_CATEGORY = "/api/v1/category-product/categories";
const ADD_PRODUCT_CATEGORY = "/api/v1/category-product";
const DELETE_PRODUCT_CATEGORY = "/api/v1/category-product/{id}";

export const PAGE_ZONE_LIST = "/zone";
const GET_ZONE_LIST = "/api/v1/location/getAllZones";
const EDIT_ZONE_STATUS = "/api/v1/location/changeStatus/{id}";
const ADD_ZONE = "/api/v1/location/zoneAdd";
const DELETE_ZONE = "/api/v1/location/deleteZone/{id}";

export const PAGE_STORE_ZONE_SLOT_LIST = "/store/:id/zone/:zoneId/slots";
const GET_STORE_ZONE_SLOT = "/api/v1/slots/get/{id}";
const ADD_STORE_ZONE_SLOT = "/api/v1/slots/add";
const UPDATE_STORE_ZONE_SLOT = "/api/v1/slots/update/{id}";
const TOGGLE_STORE_ZONE_SLOT_STATUS = "/api/v1/slots/changeStatus/{id}";

export const PAGE_STORE_LIST = "/store";
export const PAGE_STORE_ADD = "/store/add";
export const PAGE_STORE_UPDATE = "/store/:id";
const GET_STORES = "/api/v1/admin/all-stores";
const ADD_STORE = "/api/v1/admin/store";
const UPDATE_STORE = "/api/v1/admin/store";
const GET_STORE = "/api/v1/admin/by-id";
const TOGGLE_STORE_VERIFY = "/api/v1/admin/verify-store";
const GET_STORE_ZONES = "/api/v1/location/getZonesByStoreId";
const ADD_STORE_ZONE = "/api/v1/location/addZoneStore";
const DELETE_STORE_ZONE = "/api/v1/location/deleteZoneStore/{id}";

export const PAGE_ADD_PRODUCT_TO_STORE = "/add/product/store";
export const PAGE_MY_STORE_PRODUCT = "/my/products";
export const PAGE_MY_ORDERS = "/myOrders";
export const PAGE_B2C_ORDERS = "/b2c/myOrders";
const GET_STORE_PRODUCTS = "/api/v1/store-product";
const ADD_STORE_PRODUCT = "/api/v1/store-product";
const GET_PRODUCTS_TO_BE_ADD_TO_STORE = "/api/v1/store-product/to-add";
const UPDATE_STORE_PRODUCT = "/api/v1/store-product/edit-stock-price";
const DELETE_STORE_PRODUCT = "/api/v1/store-product/{id}";
const TOGGLE_STORE_PRODUCT_STATUS = "/api/v1/store-product/toggle-active";
const GET_MY_STORES = "/api/v1/users/my-stores";
const GET_MY_ORDERS = "/api/v1/b2b/orders/vendor-orders";
const GET_B2C_ORDERS = "/api/v1/b2c/order/by-store-id";
const ASSIGN_B2C_DRIVER = "/api/v1/b2c/order/assign-driver";
const ASSIGN_B2C_PICKER = "/api/v1/b2c/order/assign-picker";
const ASSIGN_B2B_DRIVER = "/api/v1/b2b/order/assign-driver";
const ASSIGN_B2B_PICKER = "/api/v1/b2b/order/assign-picker";

export const PAGE_PERMISSION_LIST = "/permission";
export const PAGE_ROLE_PERMISSION_MANAGEMENT = "/permission/role/:id";
const GET_PERMISSIONS = "/api/v1/permissions";
const ADD_PERMISSION = "/api/v1/permissions";
const GET_PERMISSION = "/api/v1/permissions/{id}";
const UPDATE_PERMISSION = "/api/v1/permissions/{id}";
const TOGGLE_PERMISSION_STATUS = "/api/v1/permissions/{id}/status";

export const PAGE_ROLES_LIST = "/roles";
const GET_ROLES = "/api/v1/roles";
const GET_ROLE = "/api/v1/roles/{id}";
const ADD_ROLE = "/api/v1/roles";
const UPDATE_ROLE = "/api/v1/roles/{id}";
const TOGGLE_ROLE_STATUS = "/api/v1/roles/{id}/status";
const SET_ROLE_PERMISSIONS = "/api/v1/roles/{id}/permissions";
const GET_ROLE_USERS = "/api/v1/roles/{id}/users";

const PAGE_SELLER_ORDERS = "/b2b/sellerOrder";
const GET_SELLER_ORDERS = "/api/v1/b2b/orders/seller-orders";

export const PAGE_SCHEMA_LIST = "/attributes";
const GET_ATTRIBUTES = "/api/v1/schema";
const GET_ATTRIBUTE = "/api/v1/schema/{id}";
const ADD_ATTRIBUTE = "/api/v1/schema";
const UPDATE_ATTRIBUTE = "/api/v1/schema/{id}";
const DELETE_ATTRIBUTE = "/api/v1/schema/{id}";

export const PAGE_USERS_LIST = "/users/roles";
const GET_USERS = "/api/v1/admin/users";

export const PAGE_USER_DETAILS = "/users/:id/details";
const GET_USER = "/api/v1/admin/users/{id}";
const GET_USER_DETAILS = "/api/v1/admin/users/{id}/user-details";
const UPDATE_USER_DETAILS = "/api/v1/admin/users/{id}/user-details";
const UPDATE_USER_ROLE = "/api/v1/admin/users/{id}/roles/{id}";

export const permissionList = {
  [PAGE_USERS_STORES]: {
    page: [
      {
        end_point: GET_USER_STORES,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_USER_STORE,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_USER_STORE,
        request_type: PUT,
      },
    ],
    delete: [
      {
        end_point: DELETE_USER_STORE,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_APP_CONFIG]: {
    page: [
      {
        end_point: GET_APP_CONFIGS,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_APP_CONFIG,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_APP_CONFIG,
        request_type: PUT,
      },
    ],
    delete: [
      {
        end_point: DELETE_APP_CONFIG,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_USERS_LIST]: {
    page: [
      {
        end_point: GET_USERS,
        request_type: GET,
      },
    ],
  },
  [PAGE_USER_DETAILS]: {
    page: [
      {
        end_point: GET_USER,
        request_type: GET,
      },
    ],
    moreInfo: [
      {
        end_point: GET_USER_DETAILS,
        request_type: GET,
      },
    ],
    update: [
      {
        end_point: UPDATE_USER_DETAILS,
        request_type: PATCH,
      },
    ],
    updateRole: [
      {
        end_point: UPDATE_USER_ROLE,
        request_type: PATCH,
      },
    ],
  },
  [PAGE_ZONE_LIST]: {
    page: [
      {
        end_point: GET_ZONE_LIST,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_ZONE,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: EDIT_ZONE_STATUS,
        request_type: PUT,
      },
    ],
    delete: [
      {
        end_point: DELETE_ZONE,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_PRODUCTS_LIST]: {
    page: [
      {
        end_point: GET_PRODUCTS,
        request_type: GET,
      },
      {
        end_point: GET_BRANDS,
        request_type: GET,
      },
      {
        end_point: GET_CATEGORIES,
        request_type: GET,
      },
    ],
    delete: [
      {
        end_point: TOGGLE_PRODUCT_DELETE,
        request_type: PUT,
      },
    ],
  },
  [PAGE_PRODUCT_ADD]: {
    page: [
      {
        end_point: GET_BRANDS,
        request_type: GET,
      },
      {
        end_point: GET_ATTRIBUTES,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_OR_UPDATE_PRODUCT,
        request_type: POST,
      },
    ],
  },
  [PAGE_BRAND_LIST]: {
    page: [
      {
        end_point: GET_BRANDS,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_BRAND,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_BRAND,
        request_type: PUT,
      },
      {
        end_point: GET_BRAND,
        request_type: GET,
      },
    ],
    delete: [
      {
        end_point: DELETE_BRAND,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_CATEGORY_LIST]: {
    page: [
      {
        end_point: GET_CATEGORIES,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_CATEGORY,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_CATEGORY,
        request_type: PUT,
      },
      {
        end_point: GET_CATEGORY,
        request_type: GET,
      },
    ],
    delete: [
      {
        end_point: DELETE_CATEGORY,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_PRODUCT_UPDATE]: {
    page: [
      {
        end_point: GET_PRODUCT_BY_ID,
        request_type: GET,
      },
      {
        end_point: GET_BRANDS,
        request_type: GET,
      },
      {
        end_point: GET_ATTRIBUTES,
        request_type: GET,
      },
    ],
    update: [
      {
        end_point: ADD_OR_UPDATE_PRODUCT,
        request_type: POST,
      },
    ],
    viewCategory: [
      {
        end_point: GET_PRODUCT_CATEGORY,
        request_type: GET,
      },
    ],
    addCategory: [
      {
        end_point: ADD_PRODUCT_CATEGORY,
        request_type: POST,
      },
    ],
    deleteCategory: [
      {
        end_point: DELETE_PRODUCT_CATEGORY,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_STORE_LIST]: {
    page: [
      {
        end_point: GET_STORES,
        request_type: GET,
      },
    ],
    update: [
      {
        end_point: TOGGLE_STORE_VERIFY,
        request_type: PUT,
      },
    ],
  },
  [PAGE_STORE_ADD]: {
    page: [
      {
        end_point: ADD_STORE,
        request_type: POST,
      },
    ],
  },
  [PAGE_STORE_UPDATE]: {
    page: [
      {
        end_point: GET_STORE,
        request_type: GET,
      },
    ],
    update: [
      {
        end_point: UPDATE_STORE,
        request_type: PUT,
      },
    ],
    viewZone: [
      {
        end_point: GET_STORE_ZONES,
        request_type: GET,
      },
    ],
    addZone: [
      {
        end_point: ADD_STORE_ZONE,
        request_type: POST,
      },
    ],
    deleteZone: [
      {
        end_point: DELETE_STORE_ZONE,
        request_type: DELETE,
      },
    ],
  },
  [PAGE_STORE_ZONE_SLOT_LIST]: {
    page: [
      {
        end_point: GET_STORE_ZONE_SLOT,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_STORE_ZONE_SLOT,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_STORE_ZONE_SLOT,
        request_type: PUT,
      },
    ],
    toggleStatus: [
      {
        end_point: TOGGLE_STORE_ZONE_SLOT_STATUS,
        request_type: PUT,
      },
    ],
  },
  [PAGE_ADD_PRODUCT_TO_STORE]: {
    page: [
      {
        end_point: GET_PRODUCTS_TO_BE_ADD_TO_STORE,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_STORE_PRODUCT,
        request_type: POST,
      },
    ],
  },
  [PAGE_MY_STORE_PRODUCT]: {
    page: [
      {
        end_point: GET_STORE_PRODUCTS,
        request_type: GET,
      },
    ],
    update: [
      {
        end_point: UPDATE_STORE_PRODUCT,
        request_type: POST,
      },
    ],
    updateStatus: [
      {
        end_point: TOGGLE_STORE_PRODUCT_STATUS,
        request_type: PUT,
      },
    ],
  },
  [PAGE_MY_ORDERS]: {
    page: [
      {
        end_point: GET_MY_ORDERS,
        request_type: GET,
      },
    ],
    assignDriver: [
      {
        end_point: ASSIGN_B2B_DRIVER,
        request_type: POST,
      },
    ],
    assignPicker: [
      {
        end_point: ASSIGN_B2B_PICKER,
        request_type: POST,
      },
    ],
  },
  [PAGE_SELLER_ORDERS]: {
    page: [
      {
        end_point: GET_SELLER_ORDERS,
        request_type: GET,
      },
    ],
  },
  [PAGE_B2C_ORDERS]: {
    page: [
      {
        end_point: GET_B2C_ORDERS,
        request_type: GET,
      },
    ],
    assignDriver: [
      {
        end_point: ASSIGN_B2C_DRIVER,
        request_type: POST,
      },
    ],
    assignPicker: [
      {
        end_point: ASSIGN_B2C_PICKER,
        request_type: POST,
      },
    ],
  },
  [PAGE_PERMISSION_LIST]: {
    page: [
      {
        end_point: GET_PERMISSIONS,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_PERMISSION,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_PERMISSION,
        request_type: PATCH,
      },
    ],
    toggleStatus: [
      {
        end_point: TOGGLE_PERMISSION_STATUS,
        request_type: PATCH,
      },
    ],
  },
  [PAGE_ROLES_LIST]: {
    page: [
      {
        end_point: GET_ROLES,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_ROLE,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_ROLE,
        request_type: PATCH,
      },
    ],
    toggleStatus: [
      {
        end_point: TOGGLE_ROLE_STATUS,
        request_type: PATCH,
      },
    ],
    getUsers: [
      {
        end_point: GET_ROLE_USERS,
        request_type: GET,
      },
    ],
  },
  [PAGE_ROLE_PERMISSION_MANAGEMENT]: {
    page: [
      {
        end_point: GET_ROLE,
        request_type: GET,
      },
    ],
    setRolePermissions: [
      {
        end_point: SET_ROLE_PERMISSIONS,
        request_type: POST,
      },
    ],
  },

  [PAGE_SCHEMA_LIST]: {
    page: [
      {
        end_point: GET_ATTRIBUTES,
        request_type: GET,
      },
    ],
    create: [
      {
        end_point: ADD_ATTRIBUTE,
        request_type: POST,
      },
    ],
    update: [
      {
        end_point: UPDATE_ATTRIBUTE,
        request_type: PUT,
      },
    ],
    delete: [
      {
        end_point: DELETE_ATTRIBUTE,
        request_type: DELETE,
      },
    ],
  },
};
let userPermissionList = localStorage.getItem("baqala-user") || [];
let role = null;
if (userPermissionList) {
  const user = JSON.parse(userPermissionList);
  userPermissionList = user?.role?.permissions || [
    {
      end_point: "/users/store",
      request_type: "GET",
    },
  ];
  role = user?.role?.role_key || null;
}
const hasPermission = (path = "/products", type = "page") => {
  if (!userPermissionList) return false;
  if (role === "SUPER_ADMIN") return true;
  const permission = permissionList[path] && permissionList[path][type];
  if (!permission) return false;
  return userPermissionList.some((item) => {
    return permission.some((item2) => {
      return (
        item2.end_point === item.end_point &&
        item2.request_type === item.request_type
      );
    });
  });
};

export default hasPermission;
