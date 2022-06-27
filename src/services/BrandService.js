import requests from "./httpService";

const BrandService = {
  getAllBrands() {
    return requests.get("/brands");
  },

  // getCategoryById(id) {
  //   return requests.get(`/categories/${id}`);
  // },

  // addCategory(body) {
  //   return requests.post("/category/add", body);
  // },

  // updateCategory(id, body) {
  //   return requests.put(`/category/${id}`, body);
  // },

  // updateStatus(id, body) {
  //   return requests.put(`/category/status/${id}`, body);
  // },

  // deleteCategory(id, body) {
  //   return requests.patch(`/categories/${id}`, body);
  // },
};

export default BrandService;
