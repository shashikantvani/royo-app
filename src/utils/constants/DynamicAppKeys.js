import { Platform } from 'react-native';

const shortCodes = {
  fawaz: '806be0',
};

const appIds = {
 
  fawaz: Platform.select({
    ios: 'com.fawaz',
    android: 'com.fawaz',
  }),
 
};

const socialKeys = {
  TWITTER_COMSUMER_KEY:
     'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET:
   
      'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, socialKeys, shortCodes };

