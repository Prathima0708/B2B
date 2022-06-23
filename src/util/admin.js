import * as bcrypt from "bcryptjs";
export const admins = [
  {
    id: 1,
    name: "Sam L. Lankford",
    image: "https://i.ibb.co/ZTWbx5z/team-1.jpg",
    email: "sam@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "505-771-8879",
    role: "Delivery Person",
    joiningData: new Date(),
  },
  {
    id: 2,
    name: "Dorothy R. Brown",
    image: "https://i.ibb.co/d294W8Y/team-4.jpg",
    email: "dorothy@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "708-628-3122",
    role: "Security Guard",
    joiningData: new Date(),
  },
  {
    id: 3,
    name: "Alice B. Porter",
    image: "https://i.ibb.co/m5B0hK4/team-8.jpg",
    email: "alice@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "708-488-9728",
    role: "Driver",
    joiningData: new Date(),
  },
  {
    id: 4,
    name: "Corrie H. Cates",
    image: "https://i.ibb.co/SNN7JCX/team-6.jpg",
    email: "corrie@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "914-623-6873",
    role: "Accountant",
    joiningData: new Date(),
  },
  {
    id: 5,
    name: "Shawn E. Palmer",
    image: "https://i.ibb.co/GWVWYNn/team-7.jpg",
    email: "shawn@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "949-202-2913",
    role: "Manager",
    joiningData: new Date(),
  },
  {
    id: 6,
    name: "Stacey J. Meikle",
    image: "https://i.ibb.co/XjwBLcK/team-2.jpg",
    email: "stacey@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "616-738-0407",
    role: "CEO",
    joiningData: new Date(),
  },
  {
    id: 7,
    name: "Marion V. Parker",
    image: "https://i.ibb.co/3zs3H7z/team-5.jpg",
    email: "marion@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "713-675-8813",
    role: "Admin",
    joiningData: new Date(),
  },
  {
    id: 8,
    name: "Admin",
    image: "https://i.ibb.co/WpM5yZZ/9.png",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345678"),
    phone: "360-943-7332",
    role: "Admin",
    joiningData: new Date(),
  },
];
