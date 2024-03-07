import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { ImageTw } from '../../../types/type';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Popins } from '@components/popins';

const ItemPayment: React.FC<IPaymentMethod> = ({ ...props }) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);

    const checkType = (props: IPaymentMethod) => {
        var uri;
        switch (props._type) {
            case 'gpay':
                uri = 'https://tse4.mm.bing.net/th?id=OIP.Gu1NStDpNVmWisgSKKBzewHaEK&pid=Api&P=0&h=180';
                break;
            case 'visa':
                uri = 'https://accgroup.vn/wp-content/uploads/2022/08/unnamed-1-1.png';
                break;
            case 'mastercard':
                uri = 'https://media.wired.com/photos/5926dea77034dc5f91bece36/master/w_1600%2Cc_limit/Mastercard3-1.jpg';
                break;
            case 'momo':
                uri = 'https://tse2.mm.bing.net/th?id=OIP.ebhi_K7Lj29CjUlFv0323AAAAA&pid=Api&P=0&h=180';
                break;
            case 'zalopay':
                uri = 'https://tse4.mm.bing.net/th?id=OIP.dqBGQAVmIM35FLHSndWGLwHaHa&pid=Api&P=0&h=180';
                break;
            default:
                uri = 'https://play-lh.googleusercontent.com/bDCkDV64ZPT38q44KBEWgicFt2gDHdYPgCHbA3knlieeYpNqbliEqBI90Wr6Tu8YOw';
                break;
        }
        return uri;
    }

    const formatBankNumber = (cardNumber: string) => {
        let hideNumber = '**** **** **** ****';
        return hideNumber.slice(0, -4) + cardNumber.slice(-4);
    };

    return (
        <View style={styles.groupPay}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ImageTw className='grow-0 w-12 h-12 rounded-full mr-4' source={{ uri: checkType(props) }} />
                <Text style={styles.txtName} >{formatBankNumber(props.cardNumber)}</Text>
                <TouchableOpacity onPress={() => props.onPress && props.onPress()}>
                    <Text style={styles.txtConnected}>Connected</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ItemPayment

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    txtName: {
        color: colors.text,
        fontFamily: Popins[600],
        fontSize: 16,
        lineHeight: 24,
        flexGrow: 1,
    },
    txtConnected: {
        flexGrow: 0,
        color: colors.primary,
        fontFamily: Popins[600],
        fontSize: 16,
        lineHeight: 24,
    },
    groupPay: {
        borderBottomWidth: 0.8,
        borderBottomColor: colors.backgroundCategory,
        paddingVertical: 20
    }
})