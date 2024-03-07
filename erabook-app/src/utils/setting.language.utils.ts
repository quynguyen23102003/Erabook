import i18next from 'i18next';
import {storageKey} from '../redux/types';
import {LanguageKey} from '../translations/constants';
import {appStorage} from '../redux/storeAndStorage/mmkv';

export const changeLanguage = async (language: LanguageKey) => {
  await i18next.changeLanguage(language);
  appStorage.set(storageKey.language, language);
};
