import {initReactI18next} from 'react-i18next';
import * as resources from './resources';
import i18next from 'i18next';
import {storageKey} from '../redux/types';
import {LanguageKey} from './constants';
import {appStorage} from '../redux/storeAndStorage/mmkv';

export const languages = Object.keys(Object.values(resources)[0]);
export const defaultNS = languages[0];
export const defaultLanguage =
  (appStorage.getString(storageKey.language) as LanguageKey) ||
  LanguageKey.English;

if (appStorage.getString(storageKey.language) === undefined) {
  appStorage.set(storageKey.language, defaultLanguage);
}

i18next
  .use(initReactI18next)
  .init({
    defaultNS,
    resources: {
      ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value,
        }),
        {},
      ),
    },
    lng: LanguageKey.English,
    fallbackLng: LanguageKey.English,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  })
  .then();

export default i18next;
