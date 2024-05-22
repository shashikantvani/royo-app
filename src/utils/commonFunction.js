import {Keyboard} from 'react-native';
import { API_BASE_URL } from '../config/urls';
import {openCamera, openPicker} from './imagePicker';

const cameraHandler = async (data, option) => {
  Keyboard.dismiss();
  //this condition use for open camera
  if (data == 0) {
    let options = {
      ...option,
    };
    try {
      const res = await openCamera(options);
      if (res) {
        return res;
      }
    } catch (err) {
      // console.log(err, 'err');
    }
  }
  //this condition use for open gallery
  else if (data == 1) {
    let options = {
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.5,
      cropperCircleOverlay: true,
      ...option,
    };
    // console.log(options, 'odfsdfsdfsdfsdfsf');
    try {
      const res = await openPicker(options);
      // if (res && (res.sourceURL || res.path)) {
      //   // return Platform.OS == 'ios' ? res.data : res.path;
      //   return res
      // }
      if (res) {
        return res;
      }
    } catch (err) {
      // console.log(err, 'err');
    }
  } else {
    return null;
  }
};

const toFixed = (n, fixed) => {
  if (n > 0)
    return `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];
  else return n;
};

const commaFormater = (num) => {
  return num.toString().replace(/^[+-]?\d+/, function (int) {
    return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  });
};
const currencyNumberFormatter = (number, digitAfterDecimal = 2) => {
  let newFormatedDecimalNumber = toFixed(number, digitAfterDecimal);
  return commaFormater(newFormatedDecimalNumber);
};

export function getImageUrl(url1, url2, dimentions) {
  // console.log(`${url1}${dimentions}${url2}`, "Url")
  return `${url1}${dimentions}${url2}`;
}

export const ifDataExist = (data) => {
  if (data && data !== null) {
    return true;
  }
  return false;
};

export const getSubDomain = () =>{
  return API_BASE_URL.split('/')[3]
}

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


export {cameraHandler, currencyNumberFormatter};
