import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { Popins } from '@components/popins';
import { CheckBox } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface titleRadio {
    title: string;
    onSelect: (selected: boolean) => void;
    initialChecked?: boolean;
}
const RadioFilter: React.FC<titleRadio> = ({ title, onSelect, initialChecked = false }) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const [checked, setChecked] = React.useState(initialChecked);
    const toggleCheckbox = () => {
        setChecked(!checked);
        onSelect(!checked);
    }
    useEffect(() => {
        setChecked(initialChecked);
    }, [initialChecked]);
    return (
        <View style={styles.container}>
            <Pressable style={[styles.container,
            {
                borderTopWidth: 0,
                paddingTop: 0,
                paddingBottom: 0
            }]}
            onPress={toggleCheckbox}>
                <CheckBox
                    checked={checked}
                    onPress={toggleCheckbox}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="#F89300"
                    uncheckedColor={colors.primary}
                    containerStyle={{
                        marginRight: 0,
                        padding: 0,
                        backgroundColor: colors.backgroundInputSearch,
                        marginLeft: 0,
                        borderRadius: 10
                    }}
                />
                <Text style={styles.title}>{title}</Text>
            </Pressable>
        </View>
    )
}

export default RadioFilter

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.googleButton,
        borderTopColor: colors.backgroundCategory,
        borderTopWidth: 2,
        paddingTop: 5,
        paddingBottom: 5
    },
    title: {
        fontFamily: Popins[500],
        fontSize: 16,
        color: colors.text,
        marginLeft: 16
    },
})