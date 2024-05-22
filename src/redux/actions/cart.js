import {
  GET_CART_DETAIL,
  REMOVE_CART_PRODUCTS,
  UPDATE_CART,
  CLEAR_CART,
  GET_ALL_PROMO_CODES,
  VERIFY_PROMO_CODE,
  REMOVE_PROMO_CODE,
  PLACE_ORDER,
  LIST_OF_PAYMENTS,
  GETWEBURL,
  GET_ALL_PROMO_CODES_CAB_ORDER,
  VERIFY_PROMO_CODE_CAB_ORDER,
  VENDOR_TABLE_CART,
  SCHEDULE_ORDER,
  CART_PRODUCT_SCHEDULE,
  TIP_AFTER_ORDER,
  VALIDATE_PROMO_CODE,
  GET_ALL_PROMO_CODES_FOR_PRODUCTLIST,
  LAST_ADDED,
  DIFFERENT_ADD_ONS,
  VENDOR_SLOTS,
  GET_PAYMENT_INTENT,
  CONFIRM_PAYMENT_INTENT,
  GET_PRODUCT_FAQS,
  UPDATE_PRODUCT_FAQS_CART,
  GET_CATEGORY_KYC_DOCUMENT,
  SUBMIT_CATEGORY_KYC,
  ORDER_AFTER_PAYMENT,
  PAYTABURL,
  CANCELPAYTABURL,
  FLUTTERWAVEURL,
  SDKPAYMENTWAVEURL,
  SDKPAYMENTCANCELWAVEURL,
  VENDOR_DROPOFF_SLOTS,
  ADD_PRESCRIPTIONS,
  DELETE_PRESCRIPTION,
} from '../../config/urls';
import {
  apiGet,
  apiPost,
  removeItem,
  saveSelectedAddress,
  setItem,
} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

export const saveAddress = (data) => {
  console.log(data, 'data>>>>data>>>data');
  saveSelectedAddress(data).then((suc) => {
    dispatch({
      type: types.SELECTED_ADDRESS,
      payload: data,
    });
  });
};

//Get Cart Detail
export function getCartDetail(url, data = {}, headers = {}) {
  console.log(GET_CART_DETAIL+url,data,headers,"headers");
  return new Promise((resolve, reject) => {
    apiGet(GET_CART_DETAIL + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const increaseDecreaseItemQty = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const cartItemQty = (data) => {
  setItem('cartItemCount', data).then((suc) => {
    dispatch({
      type: types.CART_ITEM_COUNT,
      payload: data,
    });
  });
};

//remove product from cart
export const removeProductFromCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_CART_PRODUCTS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//remove product from cart
export const clearCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(CLEAR_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes
export const getAllPromoCodes = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes for product list
export const getAllPromoCodesForProductList = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES_FOR_PRODUCTLIST, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes for cab
export const getAllPromoCodesForCaB = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Verify Promo code

export const verifyPromocode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Verify Promo code for cab orders

export const verifyPromocodeForCabOrders = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Remove Promo code

export const removePromoCode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Plce order code

export const placeOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(PLACE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get List of payment method
export function getListOfPaymentMethod(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LIST_OF_PAYMENTS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get List of payment method
export function openPaymentWebUrl(query = '', data = {}, headers = {}) {
  console.log('payment++ query', GETWEBURL+query);
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiGet(GETWEBURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function openPaymentWebUrlPost(query = '', data = {}, headers = {}) {
  console.log('payment++ query', query);
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiPost(GETWEBURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function vendorTableCart(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(VENDOR_TABLE_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const scheduledOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(SCHEDULE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const cartProductSchedule = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(CART_PRODUCT_SCHEDULE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// tip after order

export const tipAfterOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(TIP_AFTER_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Validate Promo code

export const validatePromocode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VALIDATE_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkLastAdded = (data, headers = {}) => {
  console.log('data', data);
  return new Promise((resolve, reject) => {
    apiPost(LAST_ADDED, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const differentAddOns = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(DIFFERENT_ADD_ONS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkVendorSlots = (data, headers = {}) => {
  return apiGet(VENDOR_SLOTS + data, {}, headers);
};

//Get List of payment method
export function getStripePaymentIntent(data = {}, headers = {}) {
  // console.log("payment++ query", query)
  return new Promise((resolve, reject) => {
    apiPost(GET_PAYMENT_INTENT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getProductFaqs = (query, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_FAQS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateProductFAQs = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_PRODUCT_FAQS_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Confirm payment intent stripe
export function confirmPaymentIntentStripe(data = {}, headers = {}) {
  // console.log("payment++ query", query)
  return new Promise((resolve, reject) => {
    apiPost(CONFIRM_PAYMENT_INTENT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getCategoryKycDocument = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_CATEGORY_KYC_DOCUMENT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const submitCategoryKYC = (
  data,
  headers = {
    'Content-Type': 'multipart/form-data',
  },
) => {
  return new Promise((resolve, reject) => {
    apiPost(SUBMIT_CATEGORY_KYC, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderSuccessPayment = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ORDER_AFTER_PAYMENT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Paytab card payment method
export function openPaytabUrl(data = {}, headers = {}) {
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiPost(PAYTABURL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Cancel Paytab card payment method
export function cancelPaytabUrl(data = {}, headers = {}) {
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiPost(CANCELPAYTABURL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//FLutterWave

//Flutter wave card payment method
export function openSdkUrl(query = '', data = {}, headers = {}) {
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiPost(SDKPAYMENTWAVEURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Cancel Flutter wave card payment method
export function cancelSdkUrl(query = '', data = {}, headers = {}) {
  console.log('payment++ data', data);
  return new Promise((resolve, reject) => {
    apiPost(SDKPAYMENTCANCELWAVEURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Vendor DropOff slots
export function getVendorDropoffSlots(url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(VENDOR_DROPOFF_SLOTS + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Add Prescriptions
export function addPrescriptions(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ADD_PRESCRIPTIONS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Delete  Prescriptions
export function deletePrescriptions(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DELETE_PRESCRIPTION, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
