import { Image, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ItemBookProps } from "./EbookItem2";
import { AppThemeColors, useAppTheme } from "themes/theme.config";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Popins } from "components/popins";
import Icon1 from "react-native-vector-icons/FontAwesome";
import ItemCategory from "./ItemCategory";
import { useTranslation } from "react-i18next";
import { OtherTranslationKey, RoutesTranslationKey } from "@translations/constants";
import { useNavigation } from "@react-navigation/native";
import { RootStackName, RootStackProps } from "@navigator/types";

export interface ItemCategoryProps {
    title: string
}


const EbookItem3: React.FC<ItemBookProps> = ({ widthForImage, heightForImage, heightForText, onLayout, ...props }) => {
    const onItemLayout = (event: LayoutChangeEvent) => {
        onLayout && onLayout(event);
    }
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
    const navigation = useNavigation<RootStackProps>();
    const onPressDetail = () => {
        console.log('onPressDetail');
        navigation.navigate(RootStackName.EbookScreenDetail, { ebookId: props.item._id });
      };

    return (
        <TouchableOpacity style={styles.container}
        onPress={onPressDetail}>
            <Image
                source={{ uri: props.item.coverImage }}
                style={{ width: widthForImage, height: heightForImage, borderRadius: 16, overflow: 'hidden', marginRight: 10 }}
                resizeMode='cover' />
            <View style={styles.contents}>
                <Text
                    onLayout={onItemLayout}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={[styles.textTitle, heightForText > 0 && { height: heightForText }]}>{props.item.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 15 }}>
                    <Icon1 name="star-half-empty" style={styles.icon} size={18} />
                    <Text
                        style={[styles.text500, { marginRight: 12, marginLeft: 5 }]}>{props.item.rating.average.toString().substring(0, 3)}</Text>
                </View>
                {
                    props.item.price === 0 || props.item.price === null
                        ? (
                            <Text style={styles.text500}>{t(OtherTranslationKey.Free)}</Text>
                        ) : (
                            <Text style={styles.text500}>${props.item.price}</Text>
                        )
                }

                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 10
                }}>
                    {
                        props.item.genres?.map((item, index) => {
                            return (
                                <ItemCategory key={index} title={item.name} />
                            );
                        })
                    }
                </View>
                {/*<FlatList*/}
                {/*    renderItem={renderItem}*/}
                {/*    keyExtractor={(item) => item.index.toString()}*/}
                {/*    data={DataCategory}*/}
                {/*    contentContainerStyle={styles.listContentContainer}*/}
                {/*    numColumns={3}*/}
                {/*    columnWrapperStyle={{ gap: 10 }}*/}
                {/*/>*/}
            </View>
        </TouchableOpacity>
    )
}
export default EbookItem3

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: colors.background,
        flexDirection: 'row',
        paddingBottom: 15
    },
    contents: {
        flex: 1,
        flexDirection: 'column',
    },
    textTitle: {
        color: colors.text,
        fontFamily: Popins[600],
        top: 2,
        fontSize: 16
    },
    icon: {
        color: colors.textItem,
    },
    text500: {
        color: colors.textItem,
        fontFamily: Popins[500],
        top: 2,
    },
    listContentContainer: {
        paddingTop: 15
    }
})
