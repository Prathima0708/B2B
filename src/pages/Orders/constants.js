export const GET_ORDERS_LIST_URL = '/b2b/orders/vendor-orders';
export const GET_ORDERS_LIST_SELLER_URL = '/b2b/orders/seller-orders';
export const GET_PRODUCT_LIST_OF_STORE_URL = '/store-product';
export const PUT_ORDER_URL = '/b2b/orders/';

export const GET_ORDERS_LIST_URL_B2C = '/b2c/order/by-store-id';
export const PUT_ORDER_URL_B2C = '/b2c/order/';

export const GET_STORE_USER = '/users/store-users';
export const PICKER_STRING = 'PICKER';
export const ROLE_ID_PICKER = 6;
export const ROLE_ID_DRIVER = 7;

export const ASSIGN_PICKER = '/b2b/orders/assign-picker'
export const ASSIGN_PICKER_B2C = '/b2c/order/assign-picker'
export const ASSIGN_DRIVER_B2C = '/b2c/order/assign-driver'

export const ASSIGN_DRIVER_B2B_VENDOR = '/b2b/orders/assign-driver'
export const ASSIGN_DRIVER_B2B_SELLER = '/b2b/orders/seller-orders/assign-driver'

export const GET_WAREHOUSE_LIST_URL = '/b2b/warehouse';

export const sampleData = {
    "orders": {
      "content": [
        {
          "orderId": 1,
          "cartId": 1,
          "items": [
            {
              "productId": 4,
              "variantId": 5,
              "orderQuantity": 1,
              "unitPrice": 2,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 1,
              "unitPrice": 12,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 4,
              "variantId": 7,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "CANCELLED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "CANCELLED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 1,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {},
          "deliveryLocationPoint": {
            "latitude": 0,
            "longitude": 0
          },
          "deliveryDate": "2022-05-01",
          "deliverySlotStartTime": "2022-05-01T22:00:58.935+00:00",
          "deliverySlotEndTime": "2022-05-02T04:30:58.935+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 12,
          "cartId": 12,
          "items": [
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 1,
              "unitPrice": 12,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 2,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {},
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-04-30",
          "deliverySlotStartTime": "2022-04-30T19:30:46.543+00:00",
          "deliverySlotEndTime": "2022-05-01T00:30:46.543+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 14,
          "cartId": 15,
          "items": [
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 1,
              "unitPrice": 12,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 6,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 1,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {},
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-04-30",
          "deliverySlotStartTime": "2022-04-30T19:30:23.117+00:00",
          "deliverySlotEndTime": "2022-05-01T00:30:23.117+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 13,
          "cartId": 13,
          "items": [
            {
              "productId": 4,
              "variantId": 5,
              "orderQuantity": 0,
              "unitPrice": 2,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 0,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 7,
              "orderQuantity": 0,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 0,
              "unitPrice": 12,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 1,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {},
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-04-30",
          "deliverySlotStartTime": "2022-04-30T19:30:51.632+00:00",
          "deliverySlotEndTime": "2022-05-01T00:30:51.632+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 11,
          "cartId": 11,
          "items": [
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 2,
              "unitPrice": 12,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 1,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {},
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-05-01",
          "deliverySlotStartTime": "2022-05-01T19:30:33.883+00:00",
          "deliverySlotEndTime": "2022-05-01T20:00:33.883+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 15,
          "cartId": 1,
          "items": [
            {
              "productId": 4,
              "variantId": 7,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 1,
              "unitPrice": 12,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 5,
              "orderQuantity": 1,
              "unitPrice": 2,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 0,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": 2,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {
            "latitude": 23.16900676310665,
            "longitude": 75.79722046852112,
            "vendorDetails": {
              "name": "string"
            },
            "customerDetails": {
              "name": "Samvit Jain",
              "phone": "9487560056"
            },
            "deliveryAddress": {
              "type": "HOME",
              "title": "Ujjain",
              "street": "Ucuv",
              "building": "Yfy",
              "latitude": 23.16900676310665,
              "longitude": 75.79722046852112,
              "flat_address": "Ufu",
              "floor_number": "Xycy",
              "additional_info": "{\"coordinates\":{\"latitude\":23.1689524,\"longitude\":75.7972338},\"addressLine\":\"61, 11, near अपना स्वीट्‍स, Azad Nagar, Sant Nagar, उज्जैन, मध्य प्रदेश 456010, India\",\"countryName\":\"India\",\"countryCode\":\"IN\",\"featureName\":\"11\",\"postalCode\":\"456010\",\"locality\":\"उज्जैन\",\"subLocality\":\"Sant Nagar\",\"adminArea\":\"मध्य प्रदेश\",\"subAdminArea\":\"उज्जैन जिला\",\"thoroughfare\":null,\"subThoroughfare\":null}"
            }
          },
          "deliveryLocationPoint": {
            "latitude": 23.16900676310665,
            "longitude": 75.79722046852112
          },
          "deliveryDate": "2022-05-09",
          "deliverySlotStartTime": "2022-05-09T03:30:51.037+00:00",
          "deliverySlotEndTime": "2022-05-09T10:00:51.037+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 17,
          "cartId": 1,
          "items": [
            {
              "productId": 4,
              "variantId": 7,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 4,
              "variantId": 5,
              "orderQuantity": 1,
              "unitPrice": 2,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 1,
              "variantId": 1,
              "orderQuantity": 1,
              "unitPrice": 12,
              "discount": 0,
              "status": "CANCELLED"
            },
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 1,
              "unitPrice": 4,
              "discount": 0,
              "status": "CANCELLED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "CANCELLED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": null,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {
            "latitude": 23.16900676310665,
            "longitude": 75.79722046852112,
            "vendorDetails": {
              "name": "string"
            },
            "customerDetails": {
              "phone": "9487560056"
            },
            "deliveryAddress": {
              "type": "HOME",
              "title": "Ujjain",
              "street": "Ucuv",
              "building": "Yfy",
              "latitude": 23.16900676310665,
              "longitude": 75.79722046852112,
              "flat_address": "Ufu",
              "floor_number": "Xycy",
              "additional_info": "{\"coordinates\":{\"latitude\":23.1689524,\"longitude\":75.7972338},\"addressLine\":\"61, 11, near अपना स्वीट्‍स, Azad Nagar, Sant Nagar, उज्जैन, मध्य प्रदेश 456010, India\",\"countryName\":\"India\",\"countryCode\":\"IN\",\"featureName\":\"11\",\"postalCode\":\"456010\",\"locality\":\"उज्जैन\",\"subLocality\":\"Sant Nagar\",\"adminArea\":\"मध्य प्रदेश\",\"subAdminArea\":\"उज्जैन जिला\",\"thoroughfare\":null,\"subThoroughfare\":null}"
            }
          },
          "deliveryLocationPoint": {
            "latitude": 23.16900676310665,
            "longitude": 75.79722046852112
          },
          "deliveryDate": "2022-05-09",
          "deliverySlotStartTime": "2022-05-09T03:30:58.633+00:00",
          "deliverySlotEndTime": "2022-05-09T10:00:58.633+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 20,
          "cartId": 16,
          "items": [
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 2,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 5,
              "orderQuantity": 6,
              "unitPrice": 2,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 7,
              "orderQuantity": 4,
              "unitPrice": 4,
              "discount": 0,
              "status": "PLACED"
            },
            {
              "productId": 4,
              "variantId": 9,
              "orderQuantity": 1,
              "unitPrice": 5,
              "discount": 0,
              "status": "PLACED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 2,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "PLACED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": null,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {
            "latitude": 23.169006763,
            "longitude": 75.797220469,
            "vendorDetails": {
              "name": "string"
            },
            "customerDetails": {
              "name": "Samvit Jain",
              "phone": "9487560056"
            },
            "deliveryAddress": {
              "type": "HOME",
              "title": "Ujjain",
              "street": "Ucuv",
              "building": "Yfy",
              "latitude": 23.169006763,
              "longitude": 75.797220469,
              "flat_address": "Ufu",
              "floor_number": "Xycy",
              "additional_info": "{\"coordinates\":{\"latitude\":23.1689524,\"longitude\":75.7972338},\"addressLine\":\"61, 11, near अपना स्वीट्‍स, Azad Nagar, Sant Nagar, उज्जैन, मध्य प्रदेश 456010, India\",\"countryName\":\"India\",\"countryCode\":\"IN\",\"featureName\":\"11\",\"postalCode\":\"456010\",\"locality\":\"उज्जैन\",\"subLocality\":\"Sant Nagar\",\"adminArea\":\"मध्य प्रदेश\",\"subAdminArea\":\"उज्जैन जिला\",\"thoroughfare\":null,\"subThoroughfare\":null}"
            }
          },
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-05-07",
          "deliverySlotStartTime": "2022-05-07T19:30:12.656+00:00",
          "deliverySlotEndTime": "2022-05-08T00:30:12.656+00:00",
          "paymentStatus": null,
          "paymentLink": null
        },
        {
          "orderId": 19,
          "cartId": 17,
          "items": [
            {
              "productId": 4,
              "variantId": 8,
              "orderQuantity": 2,
              "unitPrice": 4,
              "discount": 0,
              "status": "CANCELLED"
            }
          ],
          "paymentMode": "OFFLINE",
          "userId": 6,
          "despatchDate": null,
          "deliveryNote": null,
          "status": "CANCELLED",
          "invoiceAddress": null,
          "invoiceId": null,
          "paymentId": null,
          "pickerId": null,
          "driverId": null,
          "storeId": 1,
          "deliveryLocation": {
            "latitude": 23.169006763,
            "longitude": 75.797220469,
            "vendorDetails": {
              "name": "string"
            },
            "customerDetails": {
              "name": "Sandeep Sharma",
              "phone": "7479024343"
            },
            "deliveryAddress": {
              "type": "HOME",
              "title": "Ujjain",
              "street": "Ucuv",
              "building": "Yfy",
              "latitude": 23.169006763,
              "longitude": 75.797220469,
              "flat_address": "Ufu",
              "floor_number": "Xycy",
              "additional_info": "{\"coordinates\":{\"latitude\":23.1689524,\"longitude\":75.7972338},\"addressLine\":\"61, 11, near अपना स्वीट्‍स, Azad Nagar, Sant Nagar, उज्जैन, मध्य प्रदेश 456010, India\",\"countryName\":\"India\",\"countryCode\":\"IN\",\"featureName\":\"11\",\"postalCode\":\"456010\",\"locality\":\"उज्जैन\",\"subLocality\":\"Sant Nagar\",\"adminArea\":\"मध्य प्रदेश\",\"subAdminArea\":\"उज्जैन जिला\",\"thoroughfare\":null,\"subThoroughfare\":null}"
            }
          },
          "deliveryLocationPoint": {
            "latitude": 23.169006763,
            "longitude": 75.797220469
          },
          "deliveryDate": "2022-05-08",
          "deliverySlotStartTime": "2022-05-08T19:30:08.509+00:00",
          "deliverySlotEndTime": "2022-05-08T20:00:08.509+00:00",
          "paymentStatus": null,
          "paymentLink": null
        }
      ],
      "pageable": {
        "sort": {
          "empty": true,
          "sorted": false,
          "unsorted": true
        },
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 20,
        "paged": true,
        "unpaged": false
      },
      "number": 0,
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "size": 20,
      "numberOfElements": 20,
      "first": true,
      "last": true,
      "empty": false
    }
  } 
  
