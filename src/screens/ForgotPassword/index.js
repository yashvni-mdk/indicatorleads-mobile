import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import logo from '../../images/logo.png';
import {onForgotPasswordApi} from '../../services/Api';
import {COLORS} from '../../utils';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../utils/ThemeProvider';

const ForgotPassword = ({navigation}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const onForgotPasswordData = async () => {
    if (email === '') {
      setErrorMessage(t('email_address_is_required'));
      setEmailError(true);
    } else if (!isEmailValid(email)) {
      setErrorMessage(t('enter_a_valid_email_address'));
      setEmailError(true);
    } else {
      try {
        setIsLoading(true);
        let raw = JSON.stringify({
          email: email,
        });

        const response = await onForgotPasswordApi(raw);
        console.log('get Repsonse>>', response.data);
        if (response.status === 200) {
          setIsLoading(false);
          navigation.navigate('LoginScreen');
        } else {
          setErrorMessage(t('enter_a_valid_email_address'));
          setEmailError(true);
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        console.log('error::', error.response.data.detail);
        setErrorMessage(error.response.data.detail);
        setEmailError(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.safeAreaStyle}>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Image style={styles.logoImage} source={logo} />
        <View style={styles.mainView}>
          <Text style={styles.emailPlaceHolder}>{t('email_address')}</Text>
          <View style={styles.textInputView}>
            <TextInput
              value={email}
              onChangeText={text => {
                if (emailError) {
                  if (isEmailValid(text)) {
                    setEmail(text);
                    setEmailError(false);
                  } else {
                    setEmail(text);
                  }
                } else {
                  setEmail(text);
                  setEmailError(false);
                }
              }}
              placeholder="hello@example.com"
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {color: theme.text}]}
              autoCapitalize="none"
            />
          </View>
          {emailError && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[styles.buttonView, {opacity: isLoading ? 0.75 : 1}]}
            onPress={() => onForgotPasswordData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>{t('submit')}</Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.haveAnAccount, {color: theme.text}]}>
            <Text
              style={styles.signUpText}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              {`${t('login')} `}
            </Text>
            /
            <Text
              style={styles.signUpText}
              onPress={() => {
                navigation.navigate('RegistrationScreen');
              }}>
              {` ${t('sign_up')}`}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
