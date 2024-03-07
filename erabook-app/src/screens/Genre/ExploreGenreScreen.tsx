import { Dimensions, ListRenderItem, StyleSheet, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppThemeColors, useAppTheme } from "themes/theme.config";
import { useAppSelector } from "@redux/storeAndStorage/persist";
import GenreItem from "@components/Item/GenreItem";
import GenreHeader from "./GenreHeader";

const { width } = Dimensions.get('screen');

const ExploreGenreScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const genreList = useAppSelector((state) => state.root.genre.genreList);
    const renderItem: ListRenderItem<IGenre> = ({ item }) => {
        return (
            <View style={{ flex: 1 }}>
                <GenreItem width={(width / 2) - 28} _id={item._id} name={item.name} coverImage={item.coverImage} description={item.description} />
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <GenreHeader />
            <FlatList
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                data={genreList}
                extraData={genreList}
                contentContainerStyle={styles.listContentContainer}
                numColumns={2}
            />
        </View>
    )
}

export default ExploreGenreScreen

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContentContainer: {
        marginHorizontal: 16,
        gap: 12
    }
})

