import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@redux/storeAndStorage/persist';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import React, { useCallback, useEffect, useMemo } from 'react';
import { fetchGenres } from '@redux/actions/genre.actions';
import { RootStackName, RootStackProps } from '@navigator/types';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { Popins } from '@components/popins';
import { Dimensions, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import GenreItem from "@components/Item/GenreItem";

interface headerItemProps {
  width?: number,
  title: string,
  tileContainerStyle?: StyleProp<TextStyle>,
  tileStyle?: StyleProp<TextStyle>,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle>
}

export const ListGenreSeries: React.FC<headerItemProps> = (
  {
    title,
    style,
    tileStyle,
    tileContainerStyle,
    containerStyle,
    ...props
  }
) => {

  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.root);
  const genreList = useAppSelector(state => state.root.genre.genreList);
  const navigation = useNavigation<RootStackProps>();

  const { width } = Dimensions.get("window");



  useEffect(() => {
    // dispatch(fetchGenres());
  }, [dispatch]);

  const onPressExplore = () => {
    navigation.navigate(RootStackName.ExploreGenreScreen);
  }

  const renderHeader = useMemo(() => {
    return (
      <TouchableOpacity
        style={[tileContainerStyle, styles.header]}
        onPress={onPressExplore}>
        <Text style={[
          tileStyle,
          styles.text700,
          {
            fontSize: 16,
            color: colors.text
          }]}>{title}</Text>
        <View>
          <Icon name="arrow-right" style={{ color: colors.primary }} size={26} />
        </View>
      </TouchableOpacity>
    )
  }, [app.setting.themeColor, tileStyle, tileContainerStyle]);

  const renderItem = ({ item }: { item: IGenre }) => {
    return (
      <GenreItem key={item._id} width={props.width || width * 0.4} {...item} />
    )
  };

  // const renderHeader = useMemo(() => {
  //   return (
  //     <TouchableOpacity
  //       style={[tileContainerStyle, styles.header]}
  //       onPress={onPressExplore}>
  //       <Text
  //         style={[
  //           tileStyle,
  //           styles.text700,
  //           {
  //             fontSize: 16,
  //             color: colors.text,
  //           },
  //         ]}>
  //         {title}
  //       </Text>
  //       <View>
  //         <Icon name="arrow-right" style={{color: colors.primary}} size={26} />
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }, [
  //   colors.primary,
  //   colors.text,
  //   onPressExplore,
  //   styles.header,
  //   styles.text700,
  //   tileContainerStyle,
  //   tileStyle,
  //   title,
  // ]);

  // const renderItem = ({item}: {item: IGenre}) => {
  //   return <GenreItem key={item._id} {...item} />;
  // };

  // const renderHeader = useMemo(() => {
  //   return (
  //     <TouchableOpacity
  //       style={[tileContainerStyle, styles.header]}
  //       onPress={onPressExplore}>
  //       <Text
  //         style={[
  //           tileStyle,
  //           styles.text700,
  //           {
  //             fontSize: 16,
  //             color: colors.text,
  //           },
  //         ]}>
  //         {title}
  //       </Text>
  //       <View>
  //         <Icon name="arrow-right" style={{color: colors.primary}} size={26} />
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }, [app.setting.themeColor, tileStyle, tileContainerStyle]);

  // const renderItem = ({item}: {item: IGenre}) => {
  //   return <GenreItem key={item._id} {...item} />;
  // };

  return (
    <View style={[style, { flexDirection: 'row' }]}>
      <View style={{ rowGap: 8 }}>
        <View>{renderHeader}</View>
        <ScrollView
          contentContainerStyle={[
            containerStyle,
            {
              alignItems: 'center',
              gap: 12,
            },
          ]}
          overScrollMode={'never'}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {genreList && genreList.map(item => renderItem({ item }))}
        </ScrollView>
      </View>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    text700: {
      color: colors.text,
      fontFamily: Popins[700],
      top: 2.1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
