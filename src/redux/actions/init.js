import {APP_INITIAL_SETTINGS} from '../../config/urls';
import {
  apiGet,
  apiPost,
  getItem,
  removeItem,
  saveShortCodeData,
  saveUserAddress,
  setAppData,
  setItem,
} from '../../utils/utils';
import {LIST_OF_CMS, CMS_PAGE_DETAIL} from '../../config/urls';
import store from '../store';
import types from '../types';
import {changeLaguage} from '../../constants/lang';
import {I18nManager} from 'react-native';
const {dispatch} = store;
import RNRestart from 'react-native-restart';

export function initApp(
  data = {},
  headers = {},
  reload = false,
  primary_curreny,
  primary_language,
  refreshlang = false,
) {
  return new Promise((resolve, reject) => {
    console.log(
      data,
      headers,
      reload,
      primary_curreny,
      primary_language,
      refreshlang,
      'allDataHeader>>>>',
    );
    console.log(headers, 'headersheadersheaders');
    apiPost(APP_INITIAL_SETTINGS, data, headers)
      .then(async (res) => {
        console.log(res,'header response shashi')
        let data = res?.data;

        const currencies = !!data?.currencies
          ? data?.currencies.map((x) => {
              return {
                id: x?.currency?.id,
                label: x?.currency?.name,
                value: x?.currency?.name,
                symbol: x?.currency?.symbol,
                iso_code: x?.currency?.iso_code,
              };
            })
          : {};

        const languages = !!data?.languages
          ? data?.languages.map((x) => {
              return {
                id: x?.language?.id,
                label: x?.language?.nativeName || x?.language?.name,
                value: x?.language?.nativeName || x?.language?.name,
                sort_code: x?.language?.sort_code,
              };
            })
          : {};

        let fontSizeData = {};
        fontSizeData['regular'] = data?.profile?.preferences?.regular_font;
        fontSizeData['medium'] = data?.profile?.preferences?.medium_font;
        fontSizeData['bold'] = data?.profile?.preferences?.bold_font;

        let appStyle = {
          fontSizeData: {
            regular: data?.profile?.preferences?.regular_font,
            medium: data?.profile?.preferences?.medium_font,
            bold: data?.profile?.preferences?.bold_font,
          },
          tabBarLayout: data?.profile?.preferences?.tab_bar_style,
          homePageLayout: data?.profile?.preferences?.home_page_style,
        };

        let themeColorsData = {};
        themeColorsData['primary_color'] =
          data?.profile?.preferences?.primary_color;
        themeColorsData['secondary_color'] =
          data?.profile?.preferences?.secondary_color;

        let currenciesData = {};
        currenciesData['all_currencies'] = currencies;
        currenciesData['primary_currency'] =
          reload &&
          primary_curreny?.id &&
          data?.currencies.find((x) => x?.currency?.id == primary_curreny?.id)
            ? primary_curreny
            : data?.currencies
            ? data?.currencies.filter((x) => x?.is_primary)[0]?.currency
            : {};

        let languagesData = {};
        languagesData['all_languages'] = languages;
        languagesData['primary_language'] =
          reload &&
          primary_language?.id &&
          data?.languages.find((x) => x?.language?.id == primary_language?.id)
            ? primary_language
            : data?.languages
            ? data?.languages.filter((x) => x?.is_primary)[0]?.language
            : {};

        let appData = {
          appData: data,
          themeColors: themeColorsData,
          appStyle: appStyle,
          businessType: data.profile.preferences.business_type,
        };

        // setPrimaryCurrency

        if (reload) {
          setItem('setPrimaryCurrent', currenciesData);
          setCurrentcy(currenciesData);
        } else {
          const getPrimaryCurrency = await getItem('setPrimaryCurrent');
          if (getPrimaryCurrency) {
            setCurrentcy(getPrimaryCurrency);
          } else {
            setItem('setPrimaryCurrent', currenciesData);
            setCurrentcy(currenciesData);
          }
        }

        //Set Language
        if (reload) {
          setItem('setPrimaryLanguage', languagesData);
          setLanguage(languagesData);
          // refreshScreen(languagesData?.primary_language?.sort_code);
        } else {
          const getPrimaryLanguage = await getItem('setPrimaryLanguage');

          if (getPrimaryLanguage) {
            if (refreshlang) {
              changeLaguage(getPrimaryLanguage?.primary_language?.sort_code);
            }
            if (
              refreshlang &&
              getPrimaryLanguage?.primary_language?.sort_code == 'ar'
            ) {
              I18nManager.forceRTL(true);
              // alert(JSON.stringify(I18nManager), 'I18nManager');
            }
            setLanguage(getPrimaryLanguage);
          } else {
            let primaryLang = data?.languages.filter((x) => x.is_primary)[0]
              ?.language;

            // alert(JSON.stringify(I18nManager), 'I18nManager');
            setItem('setPrimaryLanguage', languagesData);
            setLanguage(languagesData);
            changeLaguage(languagesData?.primary_language?.sort_code);

            if (primaryLang.sort_code == 'ar') {
              if (!I18nManager.isRTL) {
                I18nManager.forceRTL(true);
                RNRestart.Restart();
              }
            }
          }
        }

        setAppData(appData).then((suc) => {
          dispatch({
            type: types.APP_INIT,
            payload: appData,
          });
          resolve(res);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Set Currency
export function setCurrentcy(data = {}) {
  dispatch({
    type: types.SET_CURRENCY,
    payload: data,
  });
}

//Set Language
export function setLanguage(data = {}) {
  dispatch({
    type: types.SET_LANGUAGE,
    payload: data,
  });
}

//Update Currency
export function updateCurrency(data = {}) {
  dispatch({
    type: types.UPDATE_CURRENCY,
    payload: data,
  });
}

//Update Language
export function updateLanguage(data = {}) {
  dispatch({
    type: types.UPDATE_LANGAUGE,
    payload: data,
  });
}

//Update Language
export function saveAllUserAddress(data = {}) {
  saveUserAddress(data).then((suc) => {
    dispatch({
      type: types.SAVE_ALL_ADDRESS,
      payload: data,
    });
  });
}

//Save your short code
export function saveShortCode(data = {}) {
  saveShortCodeData(data).then((suc) => {
    dispatch({
      type: types.SAVE_SHORT_CODE,
      payload: data,
    });
  });
}

//Get List of payment method
export function getListOfAllCmsLinks(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LIST_OF_CMS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get CMS page detail
export function getCmsPageDetail(data = {}, headers = {}) {
  console.log(data, 'datadatadatadata');
  return new Promise((resolve, reject) => {
    apiPost(CMS_PAGE_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function setAppTheme(res) {
  setItem('theme', JSON.stringify(res));
  if (res) {
    dispatch({
      type: types.THEME,
      payload: true,
    });
  } else {
    dispatch({
      type: types.THEME,
      payload: false,
    });
  }
}

export function setToggle(res) {
  setItem('istoggle', JSON.stringify(res));
  dispatch({
    type: types.THEME_TOGGLE,
    payload: res,
  });
}

export const addSearchResults = (txt) => {
  dispatch({
    type: types.ADD_SEARCH_TEXT,
    payload: txt,
  });
};
export const deleteSearchResults = () => {
  removeItem('searchResult');
  dispatch({
    type: types.DELETE_SEARCH_TEXT,
    payload: {},
  });
};
