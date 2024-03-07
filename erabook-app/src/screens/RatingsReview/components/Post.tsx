import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {Comment} from '@services/types';
import moment from 'moment';
import {Divider} from 'react-native-paper';
import {Popins} from '@components/popins';

const Post: React.FC<Comment> = ({
  comment,
  rating,
  author: {avatarUrl, username},
  postDate,
}) => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  if (!comment) {
    return;
  }
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        {/* info user */}
        <View style={styles.userInfo}>
          {avatarUrl ? (
            <Image source={{uri: avatarUrl}} style={styles.profileImage} />
          ) : (
            <AntDesign name="user" color={colors.text} size={30} />
          )}
          <View>
            <Text style={styles.postTitle}>{username}</Text>
            <Text numberOfLines={1} style={styles.timestampText}>
              {moment().fromNow()}
            </Text>
          </View>
        </View>

        {/* rating */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
          <View style={[styles.button]}>
            <View style={{flexDirection: 'row', alignItems: 'center', left: 4}}>
              <Icon1
                name="star"
                style={{
                  color: colors.primary,
                }}
                size={14}
              />
              <Text style={[styles.txtReviewText]}>{rating.toString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* comment */}
      <Text style={styles.postText}>{comment}</Text>

      <Divider style={{backgroundColor: colors.border}} />
      {/* like */}
      {/* <View style={styles.iconBar}>
        <View style={[styles.iconsLeft]}>
          <TouchableOpacity>
            <AntDesign
              onPress={onLikePress}
              name={isLiked ? 'heart' : 'hearto'}
              style={[styles.icon]}
              color={isLiked ? '#F89300' : colors.text}
              size={22}
            />
          </TouchableOpacity>

          <Text style={styles.likesText}>
            {isLiked ? favorites + 1 : favorites}
          </Text>
        </View>
      </View> */}
    </View>
  );
};

export default Post;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      borderBottomColor: 'gray',
      borderBottomWidth: 0.1,
    },
    content: {
      width: Dimensions.get('window').width, // Đảm bảo rằng nội dung của mỗi trang sẽ có chiều rộng bằng chiều rộng của cửa sổ
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
    userInfo: {
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 100,
    },
    postTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    icon: {
      marginLeft: 10,
      bottom: 35,
    },
    postText: {
      fontSize: 13,
      margin: 10,
      fontFamily: Popins[400],
      left: 8,
      bottom: 8,
      color: colors.text,
    },
    iconBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 15,
    },
    iconsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    likesText: {
      fontFamily: Popins[400],
      fontSize: 14,
      left: 10,
      paddingVertical: 2,
      bottom: 32,
      color: colors.text,
    },
    button: {
      borderWidth: 2,
      borderColor: colors.primary,
      paddingHorizontal: 10,
      borderRadius: 30,
      width: 65,
    },
    txtReviewIcon: {
      color: colors.primary,
      fontFamily: Popins[700],
      fontSize: 17,
      alignItems: 'center',
      marginRight: 5,
    },
    txtReviewText: {
      color: colors.primary,
      fontFamily: Popins[500],
      fontSize: 17,
      alignSelf: 'center',
      marginLeft: 8,
      top: 2,
    },
    timestamp: {
      color: 'gray',
      fontSize: 12,
    },
    timestampContainer: {
      color: colors.textDescription,
    },
    timestampText: {
      color: colors.text,
      flex: 1,
      fontSize: 12,
    },
  });
