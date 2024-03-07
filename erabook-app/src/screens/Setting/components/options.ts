import { SettingIcon } from "../../../assets/Icon";
import { AccountScreenTranslationKey } from "../../../translations/constants";
import { ThemeKey } from "../../../redux/slice/setting.slice";
export interface OptionSetting {
  payment: TOptionsSetting[];
  account: TOptionsSetting[];
  others: TOptionsSetting[];
}

export enum SettingIdType {
  payment = "payment",
  personalInfo = "personalInfo",
  notification = "notification",
  preferences = "preferences",
  security = "security",
  language = "language",
  darkMode = "darkMode",
  helpCenter = "helpCenter",
  aboutErabook = "aboutErabook",
  logout = "logout"
}

export type TOptionsSetting = {
  id: SettingIdType;
  title: AccountScreenTranslationKey;
  icon: any;
  bgLightColor: string;
  iconLightColor: string;
  bgDarkColor: string;
  iconDarkColor: string;
  onPress?: () => void;
}
export const OptionsSettingScreen: OptionSetting = {
  payment: [
    {
      id: SettingIdType.payment,
      title: AccountScreenTranslationKey.PaymentMethods,
      icon: SettingIcon.paymentMethod,
      bgLightColor: "rgba(82, 221, 173, 0.1)",
      iconLightColor: "#49c199",
      bgDarkColor: "rgba(82, 221, 173, 0.1)",
      iconDarkColor: "#5af1be",
    }
  ],
  account: [
    {
      id: SettingIdType.personalInfo,
      title: AccountScreenTranslationKey.PersonalInfo,
      icon: SettingIcon.personalInfo,
      bgLightColor: "rgba(81, 138, 254, 0.1)",
      iconLightColor: "#4372d0",
      bgDarkColor: "rgba(81, 138, 254, 0.1)",
      iconDarkColor: "#518afe",
    },
    {
      id: SettingIdType.notification,
      title: AccountScreenTranslationKey.Notification,
      icon: SettingIcon.notification,
      bgLightColor: "rgba(255, 110, 119, 0.1)",
      iconLightColor: "#da5d65",
      bgDarkColor: "rgba(255, 110, 119, 0.1)",
      iconDarkColor: "#ff6e77",
    },
    {
      id: SettingIdType.preferences,
      title: AccountScreenTranslationKey.Preferences,
      icon: SettingIcon.preferences,
      bgLightColor: "rgba(115, 85, 255, 0.1)",
      iconLightColor: "#654cde",
      bgDarkColor: "rgba(115, 85, 255, 0.1)",
      iconDarkColor: "#7355ff"
    },
    {
      id: SettingIdType.security,
      title: AccountScreenTranslationKey.Security,
      icon: SettingIcon.security,
      bgLightColor: "rgba(66, 218, 165, 0.1)",
      iconLightColor: "#31ab82",
      bgDarkColor: "rgba(66, 218, 165, 0.1)",
      iconDarkColor: "#42daa5"
    },
    {
      id: SettingIdType.language,
      title: AccountScreenTranslationKey.Language,
      icon: SettingIcon.language,
      bgLightColor: "rgba(251, 165, 38, 0.1)",
      iconLightColor: "#e19422",
      bgDarkColor: "rgba(251, 165, 38, 0.1)",
      iconDarkColor: "#FF9F0A"
    },
    {
      id: SettingIdType.darkMode,
      title: AccountScreenTranslationKey.DarkMode,
      icon: SettingIcon.darkMode,
      bgLightColor: "rgba(47,51,56,0.1)",
      iconLightColor: "#3a3a3a",
      bgDarkColor: "rgba(73, 80, 87,0.1)",
      iconDarkColor: "#FFFFFF"
    }
  ],
  others: [
    {
      id: SettingIdType.helpCenter,
      title: AccountScreenTranslationKey.HelpCenter,
      icon: SettingIcon.helpCenter,
      bgLightColor: "rgba(82, 221, 173,0.1)",
      iconLightColor: "#45bc93",
      bgDarkColor: "rgba(82, 221, 173,0.1)",
      iconDarkColor: "#52ddad"
    },
    {
      id: SettingIdType.aboutErabook,
      title: AccountScreenTranslationKey.AboutErabook,
      icon: SettingIcon.aboutErabook,
      bgLightColor: "rgba(251, 165, 38, 0.1)",
      iconLightColor: "#FF9500",
      bgDarkColor: "rgba(251, 165, 38, 0.1)",
      iconDarkColor: "#FF9F0A"
    },
    {
      id: SettingIdType.logout,
      title: AccountScreenTranslationKey.Logout,
      icon: SettingIcon.logout,
      bgLightColor: "rgba(255, 110, 119, 0.1)",
      iconLightColor: "#ce636d",
      bgDarkColor: "rgba(255, 110, 119, 0.1)",
      iconDarkColor: "#ff7a86"
    }
  ]
};

export interface RadioOption {
  id: ThemeKey;
  title: string;
  checked: boolean;
}

export const ChangeThemeOptions: RadioOption[] = [
  {
    id: ThemeKey.Light,
    title: AccountScreenTranslationKey.Light,
    checked: false
  },
  {
    id: ThemeKey.Dark,
    title: AccountScreenTranslationKey.Dark,
    checked: false
  },
  {
    id: ThemeKey.SystemDefault,
    title: AccountScreenTranslationKey.SystemDefault,
    checked: true
  }
];
