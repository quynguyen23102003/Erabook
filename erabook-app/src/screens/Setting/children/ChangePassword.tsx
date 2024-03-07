import {
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { HeaderInfor } from "../components/HeaderInfor";
import { useTranslation } from "react-i18next";
import { AccountScreenTranslationKey, CreatePasswordTranslationKey, OtherTranslationKey, RoutesTranslationKey } from "@translations/constants";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import HeaderComponents from "../components/HeaderComponents";
import { Popins } from "@components/popins";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { setIsLoading } from "@redux/slice/app.slice";
import { createNewPassword } from "@services/auth.service";
import { ButtonText, CustomTextInput } from "@components";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useAppSelector } from "@redux/storeAndStorage/persist";
import { addUserData } from "@redux/slice/user.slice";
import { useNavigation } from "@react-navigation/native";
import { RootStackProps } from "@navigator/types";
import { Modal, Portal } from "react-native-paper";
import LottieView from "lottie-react-native";
import axios, { AxiosError, isAxiosError } from "axios";
import { callApi } from "@services/axios.service";
import { EndPoint } from "@services/types";
import { lottie } from "@assets/Icon";
import { UpdatePassword } from "@services/api.service";

interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassord: string;
}

const ChangePassword: React.FC = () => {
    const dispatch = useDispatch();
    const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isOldPasswordHidden, setIsOldPasswordHidden] = useState(true);
    const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
    const { t } = useTranslation(RoutesTranslationKey.createPasswordRoute);
    const user = useAppSelector(state => state.root.user.userInfo);
    const navigation = useNavigation<RootStackProps>();
    const [isOldPassword, setIsOldPassword] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(true);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassord: '',
        },
    });
    const togglePasswordVisibility = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };
    const toggleOldPasswordVisibility = () => {
        setIsOldPasswordHidden(!isOldPasswordHidden);
    };
    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
    };
    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            if (user) {
                const response = await callApi().post(EndPoint.updatePassword, {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                });
                if (response.data && response.data.status === 'success') {
                    setIsOldPassword(true);
                    setModalVisible(false);
                } else {
                    setModalVisible(false);
                }
            }
        } catch (error) {
            setIsOldPassword(false);
            if (axios.isAxiosError(error)) {
                console.log('updatePassword error: ', error.response?.data);
            } else {
                console.log('updatePassword unexpected error: ', error);
            }
        }
    };
    const onCloseModalPress = () => {
        setModalVisible(true);
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
            <HeaderComponents title={translate1(AccountScreenTranslationKey.ChangePassword)} />
            <HeaderInfor link='' />
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
                        {t(OtherTranslationKey.Passwordchangedsuccessfully)}
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
            <Portal>
                <Modal
                    visible={!isOldPassword}
                    onDismiss={() => setIsOldPassword(true)}
                    contentContainerStyle={{
                        backgroundColor: colors.background,
                        padding: 20,
                        margin: 20,
                        borderRadius: 30,
                        alignItems: 'center',
                    }}>
                    <LottieView
                        loop={false}
                        autoPlay={true}
                        style={{ width: '30%', aspectRatio: 1 }}
                        source={require('../../../assets/lottie/error.json')}
                    />
                    <Text
                        style={{
                            color: 'red',
                            fontFamily: Popins['600'],
                            fontSize: 20,
                            marginTop: 10,
                        }}>
                        {translate(OtherTranslationKey.ChangePasswordFailed)}
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: Popins['400'],
                            fontSize: 16,
                            marginVertical: 10,
                        }}>
                        {translate(OtherTranslationKey.Theoldpasswordisincorrect)}
                    </Text>
                    <ButtonText
                        onPress={() => setIsOldPassword(true)}
                        label={translate(OtherTranslationKey.Agree)}
                        labelStyle={{ color: colors.textSecondary }}
                        style={{ width: '100%' }}
                        containerStyle={{
                            backgroundColor: colors.secondary,
                            marginTop: 10,
                        }}
                    />
                </Modal>
            </Portal>
            <View style={styles.content}>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: /^.{8,}$/,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => {
                        const borderColor = errors.oldPassword ? 'red' : colors.primary;
                        return (
                            <View>
                                <CustomTextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    cursorColor={colors.primary}
                                    label={t(CreatePasswordTranslationKey.OldPassword)}
                                    style={[styles.input, { borderColor }]}
                                    secureTextEntry={isOldPasswordHidden}
                                />
                                <TouchableOpacity
                                    onPress={toggleOldPasswordVisibility}
                                    style={styles.iconEye}>
                                    <FontAwesome5Icon
                                        name={isOldPasswordHidden ? 'eye-slash' : 'eye'}
                                        size={20}
                                        color={colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    name="oldPassword"
                />
                <View style={{ height: 30, justifyContent: 'center' }}>
                    {errors.oldPassword?.type === 'required' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.ThisIsRequired)}
                        </Text>
                    )}
                    {errors.oldPassword?.type === 'pattern' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.PasswordHasAt)}
                        </Text>
                    )}
                </View>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: /^.{8,}$/,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => {
                        const borderColor = errors.newPassword ? 'red' : colors.primary;
                        return (
                            <View>
                                <CustomTextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    cursorColor={colors.primary}
                                    label={t(CreatePasswordTranslationKey.NewPassword)}
                                    style={[styles.input, { borderColor }]}
                                    secureTextEntry={isPasswordHidden}
                                />
                                <TouchableOpacity
                                    onPress={togglePasswordVisibility}
                                    style={styles.iconEye}>
                                    <FontAwesome5Icon
                                        name={isPasswordHidden ? 'eye-slash' : 'eye'}
                                        size={20}
                                        color={colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    name="newPassword"
                />
                <View style={{ height: 30, justifyContent: 'center' }}>
                    {errors.newPassword?.type === 'required' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.ThisIsRequired)}
                        </Text>
                    )}
                    {errors.newPassword?.type === 'pattern' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.PasswordHasAt)}
                        </Text>
                    )}
                </View>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        validate: (value, formValues) => value === formValues.newPassword,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => {
                        const borderColor = errors.confirmPassord
                            ? 'red'
                            : colors.primary;
                        return (
                            <View>
                                <CustomTextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    cursorColor={colors.primary}
                                    label={t(CreatePasswordTranslationKey.ConfirmPassword)}
                                    style={[styles.input, { borderColor }]}
                                    secureTextEntry={isConfirmPasswordHidden}
                                />
                                <TouchableOpacity
                                    onPress={toggleConfirmPasswordVisibility}
                                    style={styles.iconEye}>
                                    <FontAwesome5Icon
                                        name={isConfirmPasswordHidden ? 'eye-slash' : 'eye'}
                                        size={20}
                                        color={colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    name="confirmPassord"
                />
                <View style={{ height: 30, justifyContent: 'center' }}>
                    {errors.confirmPassord?.type === 'required' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.ThisIsRequired)}
                        </Text>
                    )}
                    {errors.confirmPassord?.type === 'validate' && (
                        <Text style={styles.textError}>
                            {t(CreatePasswordTranslationKey.PasswordIsNot)}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.groupBtn}>
                <ButtonText
                    containerStyle={styles.btn}
                    onPress={handleSubmit(onSubmit)}
                    labelStyle={styles.text600}
                    label={translate(OtherTranslationKey.Save)}
                />
            </View>
        </View>

    )
}

export default ChangePassword

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    text600: {
        color: '#ffffff',
        fontFamily: Popins[600],
        fontSize: 15,
    },
    content: {
        marginHorizontal: 16,
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: colors.backgroundCategory,
        marginVertical: 12,
        paddingVertical: 12
    },
    input: {
        borderColor: colors.primary,
        borderBottomWidth: 1,
        color: colors.text,
        fontSize: 16,
        fontFamily: Popins['600'],
    },
    iconEye: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 12,
    },
    textError: {
        color: 'red',
        fontSize: 14,
        fontFamily: Popins['400'],
    },
    btnModal: {
        backgroundColor: colors.secondary,
        marginTop: 10,
    },
    modalContainer: {
        backgroundColor: colors.background,
        padding: 16,
        margin: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    text: {
        color: colors.text,
        fontFamily: Popins['400'],
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },

    modalTitle: {
        color: colors.primary,
        fontFamily: Popins['600'],
        fontSize: 20,
        marginTop: 10,
    },
})
