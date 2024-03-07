import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { AppThemeColors, useAppTheme } from '@themes/theme.config'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Popins } from '@components/popins'

interface Props {
    title: string,
    setText: React.Dispatch<React.SetStateAction<string>>
}

export const TextInputChangePassword: React.FC<Props> = ({ title, setText }) => {
    const [isUnlock, setUnlock] = useState(false);
    const { colors } = useAppTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.groupTxt}>
            <Text style={styles.text}>{title}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput defaultValue={''} onChangeText={(Text) => { setText(Text), setUnlock(false) }} secureTextEntry={!isUnlock} style={[styles.text, { fontSize: 18, fontFamily: Popins[600], flex: 1 }]} />
                <TouchableOpacity onPress={() => { isUnlock ? setUnlock(false) : setUnlock(true) }} style={styles.btn}>
                    <FontAwesome5
                        name={isUnlock ? 'eye-slash' : 'eye'}
                        size={20}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
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
        marginBottom: 26,
        flexDirection: 'column',
        height: 80
    },
    btn: {
        bottom: 0,
        right: 0,
        padding: 12,
        zIndex: 1,
    }
})