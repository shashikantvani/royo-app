import {
  HOMEPAGE_DATA_URL,
  SEARCH,
  SEARCH_BY_BRAND,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_VENDOR,
  GET_ADDRESS,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  SET_PRIMARY_ADDRESS,
  GETALLTEMPLCARDS,
  VENDOR_ALL,
  GETALLVENDORS,
  ADD_RIDER,
  GET_PRODUCT_ESTIMATION_WITH_ADDONS,
  GET_ESTIMATION,
  PICK_UP_LOCATION_SEARCH,
  GET_SUBCATEGORY_VENDORS,
} from '../../config/urls';
import {apiPost, setItem, getItem, apiGet} from '../../utils/utils';
import store from '../store';
import types from '../types';

const {dispatch} = store;

//Get Homme banners and Category data
export function homeData(data = {}, headers = {}, isShortCode = false) {
  console.log('Home Page Data')
  return new Promise((resolve, reject) => {
    apiPost(HOMEPAGE_DATA_URL, data, headers)
      .then((res) => {
        if (!isShortCode) {
          console.log('goesHere', res);
          dispatch({
            type: types.HOME_DATA,
            payload: res.data,
          });
        }
        resolve(res);
        console.log(res, "homepage")
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onGlobalSearch(query = '', data = {}, headers = {}) {
  console.log('search global');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function pickuplocationSearch(
  data = {},
  headers = {},
  isShortCode = false,
) {
  return new Promise((resolve, reject) => {
    apiPost(PICK_UP_LOCATION_SEARCH, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByCategory(query = '', data = {}, headers = {}) {
  console.log('search by category');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_CATEGORY + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByVendor(query = '', data = {}, headers = {}) {
  console.log('search by vendor');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_VENDOR + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByBrand(query = '', data = {}, headers = {}) {
  console.log('search by brand');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_BRAND + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function locationData(res) {
  console.log(res,'location data -->>');
  setItem('location', res);
  dispatch({
    type: types.LOCATION_DATA,
    payload: res,
  });
}
export function constLocationData(res) {
  dispatch({
    type: types.CONST_CUR_LOC,
    payload: res,
  });
}
export function profileAddress(res) {
  setItem('profileAddress', res)
    .then((suc) => {
      dispatch({
        type: types.PROFILE_ADDRESS,
        payload: res,
      });
    })
    .catch((err) => {});
}

// export function updateProfileAddress(res) {
//   setItem('profileAddress', res).then(suc=>{
//     dispatch({
//       type: types.PROFILE_ADDRESS,
//       payload: res,
//     });
//   }).catch(err=>{
//
//   })
// }

export const addAddress = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_ADDRESS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAddress = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ADDRESS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(DELETE_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const setPrimaryAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(SET_PRIMARY_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function dineInData(res) {
  setItem('dine_in_type', res);
  dispatch({
    type: types.DINE_IN_DATA,
    payload: res,
  });
}

//Get all temp ordres from driver
export const getAllTempOrders = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GETALLTEMPLCARDS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function vendorAll(query, data, headers = {}) {
  console.log('sending headers', data);
  return apiGet(VENDOR_ALL + query, data, headers);
}

//Get all vendors
export function getAllVendors(data = {}, headers = {}, isShortCode = false) {
  return new Promise((resolve, reject) => {
    apiGet(GETALLVENDORS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const saveSchduleTime = (data) => {
  dispatch({
    type: types.SAVE_SCHEDULE_TIME,
    payload: data,
  });
};

export const addRider = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_RIDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllRiderList = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(ADD_RIDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getProductEstimationWithAddons = (url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_ESTIMATION_WITH_ADDONS + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const productEstimation = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ESTIMATION, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubCategoryVendors = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_SUBCATEGORY_VENDORS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
