import LocalizedStrings from 'react-native-localization';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import en from './en';
import ar from './ar';
import es from './es';
import de from './de';
import fr from './fr';
import tr from './tr';
import sv from './sv';
import zh from './zh';
import ru from './ru';
import pt from './pt';
import vi from './vi';
import hi from './hi';
import ne from './ne';
import es_elcheragio from './es_elcheragio';
import es_heybuddy from './es_heybuddy';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import es_sabroson from './es_sabroson';


//Spanish fils

const spanishfile = () => {
  switch (DeviceInfo.getBundleId()) {
    case appIds?.elcheregio:
      return es_elcheragio;
      case appIds?.heyBuddy:
        return es_heybuddy;
      case appIds?.sabroson:
        return es_sabroson;
    default:
      return es;
  }
};

let strings = new LocalizedStrings({
  en: en,
  ar: ar,
  es: spanishfile(),
  de: de,
  fr: fr,
  tr: tr,
  sv: sv,
  zh: zh,
  ru: ru,
  pt: pt,
  vi: vi,
  hi: hi,
  ne:ne,
});
export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
