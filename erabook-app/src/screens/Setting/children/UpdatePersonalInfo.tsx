import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { HeaderInfor } from "../components/HeaderInfor";
import { useAppSelector } from "../../../redux/storeAndStorage/persist";
import HeaderComponents from "../components/HeaderComponents";
import { useTranslation } from "react-i18next";
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey, Step5ScreenTranslationKey } from "@translations/constants";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import { Popins } from "@components/popins";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootStackProps } from "@navigator/types";
import { addUserData } from "@redux/slice/user.slice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { setIsLoading } from "@redux/slice/app.slice";
import { getUserInfo, updateUserInfo } from "@services/api.service";
import { ButtonText, CustomTextInput } from "@components";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { ViewTw } from '../../../types/type'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Modal, Portal } from "react-native-paper";
import LottieView from "lottie-react-native";
import { lottie } from "@assets/Icon";

interface UpdateInfoFormValues {
  avatarUrl?: string,
  fullName?: string,
  phoneAddress?: string,
}
type MediaTypeOptions = {
  mediaType: 'photo',
  quality: 0.5,
}


const UpdatePersonalInfo: React.FC = () => {
  const user = useAppSelector(state => state.root.user.userInfo);
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackProps>();
  const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const { t } = useTranslation(RoutesTranslationKey.step5Route);
  const [imageUser, setImageUser] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const captureImage = async () => {
    try {
      const options: MediaTypeOptions = {
        mediaType: 'photo',
        quality: 0.5,
      };
      const result = await launchCamera(options);
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const formdata = new FormData();
        if (imageUri) {
          const fileName = imageUri.split('/').pop();
          formdata.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName || 'image.jpg',
          });
          setImageUser(imageUri);
        }
        console.log("Captured image URI:", formdata);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };
  const libraryImage = async () => {
    try {
      const options: MediaTypeOptions = {
        mediaType: 'photo',
        quality: 0.5,
      };
      const result = await launchImageLibrary(options);
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const formdata = new FormData();
        if (imageUri) {
          const fileName = imageUri.split('/').pop();
          formdata.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName || 'image.jpg',
          });
          setImageUser(imageUri);
        }
        console.log("Captured image URI:", formdata);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatarUrl: user?.avatarUrl,
      fullName: user?.fullName,
      phoneAddress: user?.phoneAddress,
    },
  });

  const onSubmit: SubmitHandler<UpdateInfoFormValues> = async data => {
    try {
      dispatch(setIsLoading(true));
      if (user) {
        const formData = new FormData();

        if (imageUser) {
          // Use 'file' as the field name
          formData.append('file', {
            uri: imageUser,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
        }

        if (data.fullName) {
          formData.append('fullName', data.fullName);
        }

        if (data.phoneAddress) {
          formData.append('phoneAddress', data.phoneAddress);
        }

        const response: any = await updateUserInfo(formData);

        if (response) {
        } else {
          const userInfo = await getUserInfo();
          if (userInfo) {
            dispatch(addUserData(userInfo));
          }
          setModalVisible(false);
        }
      }
    } catch (error) {
      console.log('onSubmit', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  const onCloseModalPress = () => {
    setModalVisible(true);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderComponents title={translate1(AccountScreenTranslationKey.UpdateInfo)} />
      <TouchableOpacity onPress={libraryImage}>
        <View>
          <ViewTw className='w-screen my-4 justify-center items-center'>
            <Image style={[{ width: 96, height: 96, padding: 0, borderRadius: 50 }]} source={imageUser ? { uri: imageUser } : { uri: user?.avatarUrl || `https://ui-avatars.com/api/?font-size=0.35&name=${user?.username}&background=0D8ABC&color=fff&rounded=true&bold=true&size=128` }}></Image>
            <TouchableOpacity style={{ marginLeft: 20, marginTop: -20, position: 'absolute', backgroundColor: colors.primary, width: 24, height: 24, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
              onPress={captureImage}>
              <Ionicons name="camera" size={16} color={colors.text} />
            </TouchableOpacity>
          </ViewTw>
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Portal>
          <Modal
            visible={!modalVisible}
            onDismiss={() => setModalVisible(true)}
            contentContainerStyle={styles.modalContainer}>
            <LottieView
              loop={false}
              autoPlay={true}
              style={{ width: '40%', aspectRatio: 1 }}
              source={lottie.success}
            />
            <Text style={styles.modalTitle}>
              {t(OtherTranslationKey.Successfullyupdated)}
            </Text>
            <ButtonText
              onPress={onCloseModalPress}
              label={t(OtherTranslationKey.Close)}
              labelStyle={{ color: colors.textSecondary }}
              style={{ width: '100%' }}
              containerStyle={styles.btnModal}
            />
          </Modal>
        </Portal>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const borderColor = errors.fullName ? 'red' : colors.primary;
            return (
              <CustomTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                cursorColor={colors.primary}
                label={translate(OtherTranslationKey.Fullname)}
                style={[styles.input, { borderColor }]}
              />
            );
          }}
          name="fullName"
        />
        <View style={{ height: 30, justifyContent: 'center' }}>
          {errors.fullName && (
            <Text style={styles.textError}>
              {t(Step5ScreenTranslationKey.thisIsRequired)}
            </Text>
          )}
        </View>

        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^0\d{9}$/,
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const borderColor = errors.phoneAddress ? 'red' : colors.primary;
            return (
              <CustomTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                cursorColor={colors.primary}
                label={translate(OtherTranslationKey.PhoneNumber)}
                style={[styles.input, { borderColor }]}
              />
            );
          }}
          name="phoneAddress"
        />
        <View style={{ height: 30, justifyContent: 'center' }}>
          {errors.phoneAddress && (
            <Text style={styles.textError}>
              {t(Step5ScreenTranslationKey.thisIsRequired)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.groupBtn}>
        <ButtonText
          containerStyle={{ backgroundColor: colors.primary }}
          onPress={handleSubmit(onSubmit)}
          labelStyle={{ color: 'white' }}
          label={translate(OtherTranslationKey.Save)}
        />
      </View>
    </View>
  )
}

export default UpdatePersonalInfo

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  text: {
    fontFamily: Popins[500],
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 5
  },
  groupTxt: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    marginBottom: 26
  },
  groupBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.backgroundCategory,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    flexDirection: 'row'
  },
  text500: {
    color: '#ffffff',
    fontFamily: Popins[500],
    fontSize: 16,
    marginLeft: 8
  },
  content: {
    marginHorizontal: 16,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundCategory,
    marginVertical: 12,
    paddingVertical: 12
  },
  textError: {
    color: 'red',
    fontSize: 14,
    fontFamily: Popins['400'],
  },
  input: {
    borderColor: colors.primary,
    borderBottomWidth: 1,
    color: colors.text,
    fontSize: 16,
    fontFamily: Popins['600'],
  },
  modalContainer: {
    backgroundColor: colors.background,
    padding: 16,
    margin: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.primary,
    fontFamily: Popins['600'],
    fontSize: 20,
    marginTop: 10,
  },
  btnModal: {
    backgroundColor: colors.secondary,
    marginTop: 10,
  },
})
