import { Image, ListRenderItem, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ImageTw, TextTw, TouchableOpacityTw, ViewTw } from '../../../types/type';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useTranslation } from 'react-i18next';
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import HeaderComponents from '../components/HeaderComponents';
import { Popins } from '@components/popins';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { deletePayMentThod, getPaymentMethod } from '@services/api.service';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ItemPayment from '../components/ItemPayment';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@redux/slice/app.slice';
import _, { set } from 'lodash';
import CustomBottomSheet from '@components/bottomsheet';
import { SettingItemMeno } from '../components/SettingItem';
import { RatioBottom } from '@components/button/RatioBottom';
import { Switch } from 'react-native-switch';
import { MotiView } from 'moti';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Dialog, Portal } from 'react-native-paper';
import { ButtonText } from '@components';


const PaymentMenthodsScreen: React.FC = () => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
    const navigation = useNavigation<RootStackProps>();
    const [payment, setPayment] = useState<IPaymentMethod[]>([]);
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [currentItem, setCurrentItem] = useState<IPaymentMethod | undefined>(undefined)
    const focus = useIsFocused();
    const [dialogVisible, setDialogVisible] = useState(false);

    const fetchPayment = useCallback(async () => {
        dispatch(setIsLoading(true));
        // if(payment === null) {
        const response: IPaymentMethod[] = await getPaymentMethod();
        setPayment(response);
        dispatch(setIsLoading(false));
        // }
    }, [])

    useEffect(() => {
        focus && fetchPayment();
    }, [focus]);


    const onItemPress = (item: IPaymentMethod) => {
        !visible && setVisible(true);
        setCurrentItem(item);
    }

    const renderItemPayment: ListRenderItem<IPaymentMethod> = ({ item }) => {
        return (
            <ItemPayment
                onPress={() => onItemPress(item)}
                {...item}
            />
        );
    };

    const handleToggle = useCallback(() => {
        setToggle(!toggle);
    }, [toggle])

    const handleDelete = useCallback(async () => {
        if (!currentItem) return;
        setVisible(false);
        setDialogVisible(false);
        const res = await deletePayMentThod(currentItem._id);
        if (res) {
            const translatedMessage = translate(OtherTranslationKey.DeleteSuccess);
            ToastAndroid.show(translatedMessage, ToastAndroid.SHORT);
            setPayment(payment.filter((item) => item._id !== currentItem._id));
        } else {
            const translatedMessage = translate(OtherTranslationKey.DeleteFail);
            ToastAndroid.show(translatedMessage, ToastAndroid.SHORT);
        }
    }, [currentItem])


    return (
        <View style={styles.container}>
            <HeaderComponents title={translate1(AccountScreenTranslationKey.PaymentMethods)} />
            <View style={{ paddingHorizontal: 16, marginBottom: 182 }}>
                <FlatList
                    data={payment}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={payment}
                    renderItem={renderItemPayment}
                />
            </View>
            <View style={styles.groupBtn}>
                <ButtonText
                    containerStyle={{ backgroundColor: colors.primary }}
                    onPress={() => navigation.navigate(RootStackName.AddPaymentMentthodScreen)}
                    labelStyle={{ color: 'white' }}
                    label={translate(OtherTranslationKey.Add)}
                />
            </View>
            <Portal>
                <Dialog
                    style={{ backgroundColor: colors.background }}
                    visible={dialogVisible}
                    onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title
                        style={{
                            color: colors.text,
                            fontSize: 20,
                            fontFamily: Popins['500'],
                        }}>
                        {translate(OtherTranslationKey.Delete)}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: colors.text, fontFamily: Popins['400'] }}>
                            {translate(OtherTranslationKey.DoYouWantToDelete)}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            textColor={colors.gray}
                            labelStyle={{ fontFamily: Popins['400'] }}
                            onPress={() => setDialogVisible(false)}>
                            {translate(AccountScreenTranslationKey.Cancel)}
                        </Button>
                        <Button
                            labelStyle={{ fontFamily: Popins['400'] }}
                            onPress={handleDelete}>
                            {translate(OtherTranslationKey.Delete)}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <CustomBottomSheet
                onClose={() => setVisible(false)}
                visible={visible}>
                <View style={styles.bsContainer}>
                    <View style={styles.bsButton}>
                        <Text style={styles.text600}>{translate(OtherTranslationKey.Active)}</Text>
                        <View style={{ alignItems: 'flex-start' }}>
                            <TouchableWithoutFeedback
                                onPress={handleToggle} >
                                <View style={styles.toggleContainer}>
                                    <MotiView
                                        style={styles.toggle}
                                        animate={{
                                            translateX: toggle ? 32 : 0,
                                            backgroundColor: toggle ? colors.primary : colors.primary + "70",
                                        }}
                                        transition={{
                                            type: 'timing',
                                            duration: 200
                                        }}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setDialogVisible(true)}
                        activeOpacity={0.6}
                        style={styles.bsButton}>
                        <Text style={styles.text600}>{translate(OtherTranslationKey.Delete)}</Text>
                        <FontAwesomeIcon icon={faTrash} color={"red"} />
                    </TouchableOpacity>
                </View>
            </CustomBottomSheet>
        </View>
    )
}

export default PaymentMenthodsScreen

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    toggle: {
        width: 32,
        height: 32,
        borderWidth: 2,
        backgroundColor: colors.primary,
        borderRadius: 50,
        borderColor: colors.backgroundSwitch,
    },
    toggleContainer: {
        backgroundColor: colors.backgroundSwitch,
        borderRadius: 50,
        height: 32,
        width: 64,
    },
    bsButton: {
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    bsContainer: {
        backgroundColor: colors.background,
        paddingBottom: 24
    },
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    groupBtn: {
        bottom: 0,
        position: 'absolute',
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
        fontSize: 16,
        marginLeft: 8
    },
})