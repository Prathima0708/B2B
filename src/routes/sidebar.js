import {
  FiBook,
  FiGitBranch,
  FiGrid,
  FiHome,
  FiList,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
  FiSidebar,
  FiSliders,
  FiTriangle,
  FiUserCheck,
} from "react-icons/fi";

import { AiFillNotification } from "react-icons/ai";
import { GiConverseShoe } from "react-icons/gi";

import { RiUserSettingsLine } from "react-icons/ri";
import hasPermission from "../components/login/hasPermission";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
let sidebar = [
  // {
  //   path: "/dashboard", // the url
  //   icon: FiGrid, // icon
  //   name: "Dashboard", // name that appear in Sidebar
  // },
  {
    path: "/app/config",
    icon: FiGitBranch,
    name: "App Config",
  },
  {
    path: "/users/store",
    icon: FiTriangle,
    name: "User Store",
  },
  {
    path: "/users/roles",
    icon: FiUserCheck,
    name: "Users",
  },
  {
    path: "/notification",
    icon: AiFillNotification,
    name: "Notifications",
  },
  // {
  //   path: '/myOrders',
  //   icon: FiBook,
  //   name: 'My Orders',
  // },
  // {
  //   path: '/b2c/myOrders',
  //   icon: FiSidebar,
  //   name: 'B2C Orders',
  // },
  // {
  //   path: "/driver",
  //   icon: FiTruck,
  //   name: "Driver Executive",
  // },
  {
    path: "/category",
    icon: FiList,
    name: "Category",
  },
  {
    path: "/brand",
    icon: GiConverseShoe,
    name: "Brand",
  },
  {
    path: "/products",
    icon: FiShoppingBag,
    name: "Products",
  },
  {
    path: "/attributes",
    icon: FiSliders,
    name: "Attributes",
  },
  // {
  //   path: "/warehouse",
  //   icon: FiHome,
  //   name: "Warehouse",
  // },
  {
    path: "/store",
    icon: FiShoppingCart,
    name: "Store",
  },
  {
    path: "/zone",
    icon: FiMapPin,
    name: "Zone",
  },
  // {
  //   path: "/roles-permission",
  //   icon: RiUserSettingsLine,
  //   name: "Roles & Permission",
  // },
  {
    path: "/permission",
    icon: RiUserSettingsLine,
    name: "Roles & Permission",
    subMenu: [
      {
        path: "/permission",
        icon: FiMapPin,
        name: "Manage Permission",
      },
      {
        path: "/roles",
        icon: FiMapPin,
        name: "Roles",
      },
    ],
  },
  {
    path: "/add/product/store",
    icon: FiShoppingBag,
    name: "My Store",
    subMenu: [
      {
        path: "/add/product/store",
        icon: FiMapPin,
        name: "Add Product To Store",
      },
      {
        path: "/my/products",
        icon: FiMapPin,
        name: "My Product",
      },
      {
        path:
          process.env.REACT_APP_PRODUCT_ENV === "B2B"
            ? "/myOrders"
            : "/b2c/myOrders",
        icon: FiBook,
        name:
          process.env.REACT_APP_PRODUCT_ENV === "B2B"
            ? "My Orders"
            : "B2C Orders",
      },
      // {
      //   path: '/b2c/myOrders',
      //   icon: FiSidebar,
      //   name: 'B2C Orders',
      // },
    ],
  },

  // {
  //   path: '/orders',
  //   icon: FiCompass,
  //   name: 'Orders',
  // },
  // {
  //   path: '/coupons',
  //   icon: FiGift,
  //   name: 'Coupons',
  // },
  // {
  //   path: '/our-staff',
  //   icon: FiUser,
  //   name: 'Our Staff',
  // },
  // {
  //   path: '/setting',
  //   icon: FiSettings,
  //   name: 'Setting',
  // },
];

/** WareHouse case in B2B, should be hidden in case of B2C*/
if (process.env.REACT_APP_PRODUCT_ENV === "B2B") {
  sidebar.splice(2, 0, {
    path: "/warehouse",
    icon: FiHome,
    name: "Warehouse",
  });
  sidebar.join();
}

/**B2B Seller orders (ware house to Store => Assign driver (Not picker)) */
if (process.env.REACT_APP_PRODUCT_ENV === "B2B") {
  sidebar.splice(12, 0, {
    path: "/b2b/sellerOrder",
    icon: FiSidebar,
    name: "Seller Orders",
  });
  sidebar.join();
}

const accessibleSidebar = sidebar
  .map((item) => {
    const menu = item.subMenu
      ? item.subMenu.filter((subItem) => hasPermission(subItem.path, "page"))
      : [];
    const { subMenu, ...rest } = item;
    let data = {
      ...rest,
      hasPermission: hasPermission(item.path, "page"),
    };
    if (menu.length > 0) data.subMenu = menu;
    return data;
  })
  .filter((item) => item.hasPermission);

accessibleSidebar.unshift({
  path: "/dashboard", // the url
  icon: FiGrid, // icon
  name: "Dashboard", // name that appear in Sidebar
});
export default accessibleSidebar;
