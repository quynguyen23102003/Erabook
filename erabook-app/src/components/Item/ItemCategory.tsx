import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppThemeColors, useAppTheme } from 'themes/theme.config';
import { Popins } from 'components/popins';
import { ItemCategoryProps } from './EbookItem3';

const ItemCategory: React.FC<ItemCategoryProps> = ({ ...props }) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    return (
        <TouchableOpacity style={styles.btn}>
            <Text style={styles.txt}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ItemCategory

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    btn: {
        flex: 0,
        padding: 7,
        backgroundColor: colors.backgroundCategory,
        borderRadius: 5,
        marginEnd: 10,
        marginBottom: 10,
    },
    txt: {
        fontSize: 9,
        fontFamily: Popins[500],
        color: colors.textItem,
    },
})