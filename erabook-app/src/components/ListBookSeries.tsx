import { Dimensions, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import { Popins } from "./popins";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import EbookItem4 from "./Item/EbookItem4";
import { useAppSelector } from "redux/storeAndStorage/persist";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import { useNavigation } from "@react-navigation/native";
import { RootStackProps } from "@navigator/types";

interface headerItemProps {
    title: string,
}
const { width } = Dimensions.get("window");
export const ListBookSeries: React.FC<headerItemProps> = ({ title }) => {
    const { bookList } = useAppSelector(state => state.root.book);
    const app = useAppSelector((state) => state.root);
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<RootStackProps>();

    const widthForImage = useMemo(() => {
        return (width - 42) / 2;
    }, [])
    const heightForImage = useMemo(() => {
        return (widthForImage * 17) / 11
    }, [])


    const [heightForText, setHeightForText] = useState(0);
    const onItemLayout = (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        if (height > heightForText) {
            setHeightForText(height);
        }
    }

    const renderHeader = useMemo(() => {
        return (
          <TouchableOpacity style={styles.header}>
              <Text style={[{ fontSize: 20, color: colors.text, fontFamily: Popins[700], top: 2.1 }]}>{title}</Text>
              <View>
                  <Icon name="arrow-right" style={{ color: colors.primary }} size={26} />
              </View>
            </TouchableOpacity>
        )
    }, [app.setting.themeColor]);

    const renderItem: ListRenderItem<IBook> = ({ item }) => {
        return (
            <View>
                <EbookItem4 onLayout={onItemLayout} heightForText={heightForText} widthForImage={widthForImage} heightForImage={heightForImage}{...item} />
            </View>
        )
    };
    return (
      <View>
          {renderHeader}
            <FlashList
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                estimatedItemSize={200}
                data={bookList}
                horizontal={true}
                contentContainerStyle={{paddingLeft: 24}}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}
const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    text700: {
        color: colors.text,
        fontFamily: Popins[700],
        top: 2.1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16
    }
})
