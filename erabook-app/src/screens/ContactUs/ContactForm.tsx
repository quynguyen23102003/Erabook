import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import Mailer from 'react-native-mail';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {Popins} from 'components/popins';
import {color} from '@rneui/base';
import {
  AccountScreenTranslationKey,
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import HeaderComponents from '@screens/Setting/components/HeaderComponents';
import {useTranslation} from 'react-i18next';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const {t: translate1} = useTranslation(RoutesTranslationKey.accountRoute);
  const {t: translate2} = useTranslation(OtherTranslationKey.ContactForm);

  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
  const {colors} = useAppTheme();
  const styles = useStyles(colors);

  const sendEmail = () => {
    Mailer.mail(
      {
        subject: 'Feedback from My App',
        recipients: ['tuthithutrang2003@gmail.com'],
        body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        isHTML: false,
      },
      (error, event) => {
        if (error) {
          Alert.alert('Error', 'Could not send email. Please try again later.');
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setNameError(!name ? 'Please enter your name.' : '');
      setEmailError(!email ? 'Please enter your email.' : '');
      setMessageError(!message ? 'Please enter your message.' : '');
      return;
    } else {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to send this feedback?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Send',
            onPress: () => sendEmail(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponents title={translate1(OtherTranslationKey.Contactus)} />

      <Text style={styles.title} >
         {translate1(OtherTranslationKey.ContactForm)}
      
      </Text>
      <Image
        source={require('../ContactUs/asset/contact_ss.png')}
        style={styles.imageStyle}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor={colors.gray}
        value={name}
        onChangeText={text => {
          setName(text);
          setNameError('');
        }}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor={colors.gray}
        value={email}
        onChangeText={text => {
          setEmail(text);
          setEmailError('');
        }}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="Your Message"
        placeholderTextColor={colors.gray}
        value={message}
        onChangeText={text => {
          setMessage(text);
          setMessageError('');
        }}
        multiline
      />
      {messageError ? (
        <Text style={styles.errorText}>{messageError}</Text>
      ) : null}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.text600}>{t(OtherTranslationKey.Submit)}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ContactForm;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 30,
      backgroundColor: colors.white,
    },
    input: {
      borderColor: colors.primary,
      borderBottomWidth: 1,
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
      marginBottom: 20,
      paddingVertical: 12,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    groupBtn: {
      width: '100%',
      marginTop: 20,
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      shadowColor: color.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text600: {
      color: colors.white,
      fontFamily: Popins[600],
      fontSize: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: Popins['600'],
      color: colors.primary,
      marginBottom: 25,
      marginTop: 15,
      textAlign: 'center',
    },
    placeholder: {
      color: colors.backgroundCategory,
    },
    errorText: {
      color: colors.red,
      fontSize: 14,
      marginBottom: 5,
    },
    imageStyle: {
      width: '100%',
      height: 200,
      resizeMode: 'cover', // or 'contain' based on your preference
      borderRadius: 10, // adjust the border radius as needed
      marginBottom: 20, // add some spacing below the image
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });
