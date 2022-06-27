import hasPermission from "../components/login/hasPermission";
import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Products = lazy(() => import("../pages/Products"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const Attribute = lazy(() => import("../pages/Attribute"));
const AppConfig = lazy(() => import("../pages/AppConfig/AppConfig"));
const UserStore = lazy(() => import("../pages/UserStore/UserStore"));
const Category = lazy(() => import("../pages/Category"));
const Brand = lazy(() => import("../pages/Brand"));
const Staff = lazy(() => import("../pages/Staff"));
const Customers = lazy(() => import("../pages/Customers"));
const CustomerOrder = lazy(() => import("../pages/CustomerOrder"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderInvoice = lazy(() => import("../pages/OrderInvoice"));
const Coupons = lazy(() => import("../pages/Coupons"));
const Roles = lazy(() => import("../pages/RolesPermission/Roles"));
const Permissions = lazy(() => import("../pages/RolesPermission/Permissions"));
const ManagePermissions = lazy(() =>
  import("../pages/RolesPermission/ManagePermissions")
);
const SlotList = lazy(() => import("../pages/SlotList"));
const Notification = lazy(() =>
  import("../pages/Notification/Notification.js")
);
const UserDetails = lazy(() => import("../pages/Users/UserDetails"));

const Page404 = lazy(() => import("../pages/404"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const Store = lazy(() => import("../pages/Store"));
const StoreList = lazy(() => import("../pages/StoreList"));
const Zone = lazy(() => import("../pages/Zones/Zone"));
const AddProductStore = lazy(() =>
  import("../pages/AddProductToStore/AddProduct")
);
const MyProduct = lazy(() => import("../pages/AddProductToStore/MyProduct"));
const UsersRole = lazy(() => import("../pages/Users/Users"));
const MyOrders = lazy(() => import("../pages/Orders/MyOrders"));
const MyOrdersDetails = lazy(() => import("../pages/Orders/MyOrdersDetails"));
const DeliveryExecutive = lazy(() =>
  import("../pages/DeliveryExecutive/DeliveryExecutive")
);
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const MyProductFromOrder = lazy(() =>
  import("../pages/Orders/MyProductFromOrder")
);
const MyOrdersB2C = lazy(() => import("../pages/Orders/B2C/MyOrders"));
const MyOrdersDetailsB2C = lazy(() =>
  import("../pages/Orders/B2C/MyOrdersDetailsB2C")
);
const MyProductFromOrderB2C = lazy(() =>
  import("../pages/Orders/B2C/MyProductFromOrderB2C")
);
const Warehouse = lazy(() => import("../pages/Warehouse/Warehouse"));

/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/notification",
    component: Notification,
  },
  {
    path: "/products/add",
    component: AddProduct,
  },
  {
    path: "/products/:id",
    component: AddProduct,
  },
  {
    path: "/driver",
    component: DeliveryExecutive,
  },
  {
    path: "/app/config",
    component: AppConfig,
  },
  {
    path: "/users/roles",
    component: UsersRole,
  },
  {
    path: "/users/:id/details",
    component: UserDetails,
  },
  {
    path: "/users/store",
    component: UserStore,
  },
  {
    path: "/category",
    component: Category,
  },
  {
    path: "/brand",
    component: Brand,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/customer-order/:id",
    component: CustomerOrder,
  },
  {
    path: "/our-staff",
    component: Staff,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/order/:id",
    component: OrderInvoice,
  },
  {
    path: "/coupons",
    component: Coupons,
  },
  {
    path: "/setting",
    component: EditProfile,
  },
  {
    path: "/attributes",
    component: Attribute,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
  {
    path: "/store/add",
    component: Store,
  },
  {
    path: "/store",
    component: StoreList,
  },
  {
    path: "/store/:id/zone/:zoneId/slots",
    component: SlotList,
  },
  {
    path: "/store/:id",
    component: Store,
  },

  {
    path: "/zone",
    component: Zone,
  },
  {
    path: "/add/product/store",
    component: AddProductStore,
  },
  {
    path: "/my/products",
    component: MyProduct,
  },
  {
    path: "/permission",
    component: Permissions,
  },
  {
    path: "/roles",
    component: Roles,
  },
  {
    path: "/permission/role/:id",
    component: ManagePermissions,
  },
  {
    path: "/myOrders",
    component: MyOrders,
  },
  {
    path: "/myOrders/details",
    component: MyOrdersDetails,
  },
  {
    path: "/myOrders/details/myProduct",
    component: MyProductFromOrder,
  },
  {
    path: "/b2c/myOrders",
    component: MyOrdersB2C,
  },
  {
    path: "/b2c/myOrders/details",
    component: MyOrdersDetailsB2C,
  },
  {
    path: "/b2c/myOrders/details/myProduct",
    component: MyProductFromOrderB2C,
  },
  // {
  //   path: "/warehouse",
  //   component: Warehouse,
  // },
];

if (process.env.REACT_APP_PRODUCT_ENV === "B2B") {
  routes.splice(2, 0, {
    path: "/warehouse",
    component: Warehouse,
  });
  routes.join();
}

/**B2B Seller orders (ware house to Store => Assign driver (Not picker)) */
if (process.env.REACT_APP_PRODUCT_ENV === "B2B") {
  routes.push({
    path: "/b2b/sellerOrder",
    component: MyOrders,
  });
}
const accessibleRoutes = routes.filter((route) =>
  hasPermission(route.path, "page")
);
accessibleRoutes.push({
  path: "/dashboard",
  component: Dashboard,
});

export default accessibleRoutes;
