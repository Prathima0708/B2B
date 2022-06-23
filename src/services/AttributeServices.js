import requests from "./httpService";

const AttributeService = {
  getAllAttributes() {
    return requests.get("/schema");
  },
  getAttributesById(id) {
    return requests.get(`/schema/${id}`);
  },
};

export default AttributeService;
