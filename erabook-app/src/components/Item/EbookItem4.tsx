import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, LayoutChangeEvent, Pressable } from 'react-native'
import React from 'react'
import { Popins } from '../popins'
import Icon1 from 'react-native-vector-icons/FontAwesome'
import { AppThemeColors, useAppTheme } from 'themes/theme.config';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';

export interface ItemBookProps extends IBook {
    widthForImage: number;
    heightForImage: number;
    onLayout: (event: LayoutChangeEvent) => void;
    heightForText: number;
}
const uri = "https://image.tmdb.org/t/p/original/49XUh6kIalLvbawnVwe6qQ12mVi.jpg"
const EbookItem4: React.FC<ItemBookProps> = ({ widthForImage, heightForImage, heightForText, onLayout, ...props }) => {
    const onItemLayout = (event: LayoutChangeEvent) => {
        onLayout && onLayout(event);
    }
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<RootStackProps>();
    const onPressDetail = () => {
        navigation.navigate(RootStackName.EbookScreenDetail);
    }
    return (
        <Pressable onPress={onPressDetail}
            style={[styles.container, { width: widthForImage}]}>
            {/* <View style={{ width: widthForImage, height: heightForImage, borderRadius: 16, borderWidth: 1, overflow:'hidden' }} /> */}
            <Image
                source={{ uri: uri }}
                style={{ width: widthForImage, height: heightForImage, borderRadius: 16, overflow: 'hidden' }}
                resizeMode='cover' />
            <View style={{flexDirection: 'column', backgroundColor: '#ffffff'}}>
                <View style={{ paddingHorizontal: 4, marginTop: 12, marginBottom: 8}}>
                    <Text
                        onLayout={onItemLayout}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[styles.textTitle, heightForText > 0 && { height: heightForText }]}
                        >{props.title}
                    </Text>
                </View>
                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', height: 120}}>
                    <Icon1 name="star-half-empty" style={styles.icon} size={18} />
                    <Text style={[styles.text500, { marginRight: 12, marginLeft: 5 }]}>{props.rating.average}</Text>
                    <Text style={styles.text500}>${props.price}</Text>
                </View>
            </View>
        </Pressable>
    )
}
export default EbookItem4

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        marginRight: 15
    },
    text: {
        color: colors.text,
    },
    textCenter: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    text500: {
        color: colors.textItem,
        fontFamily: Popins[500],
        top: 2,
    },
    textTitle: {
        color: colors.text,
        fontFamily: Popins[600],
        top: 2,
        fontSize: 14
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        color: colors.textItem,
    }
})
