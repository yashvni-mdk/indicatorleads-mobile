import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {portraitStyles, landscapeStyles} from './styles';
import view from '../../images/view.png';
import hidden from '../../images/hidden.png';
import logo from '../../images/logo.png';
import {onLoginApi, onPostAIDataApi} from '../../services/Api';
import {ErrorComponent} from '../../components/ErrorComponent';
import {COLORS} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import {useTheme} from '../../utils/ThemeProvider';
import useOrientation from '../../components/OrientationComponent';

const LoginScreen = ({navigation}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const {theme} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = isPortrait ? portraitStyles : landscapeStyles;

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  const onLoginData = async () => {
    if (email === '') {
      setEmailError(true);
    } else if (password === '') {
      setPasswordError(true);
    } else {
      try {
        setIsLoading(true);
        let raw = JSON.stringify({
          email: email,
          password: password,
        });
        console.log('get request>>', raw);
        const response = await onLoginApi(raw);
        console.log('get Repsonse>>', response);
        if (response.status === 200) {
          setIsLoading(false);
          console.log('get Repsonse>>', response.data.access);
          AsyncStorage.setItem('accessToken', response.data.access);
          AsyncStorage.setItem('refreshToken', response.data.refresh);
          AsyncStorage.setItem('userRole', response.data.user_type);
          // onAllDataGet();
          // if (Platform.OS == 'android') {
          const fcmToken = await messaging().getToken();
          console.log('get FCMTOKEN::::', fcmToken);
          try {
            let raw = JSON.stringify({
              firewall_token: fcmToken,
            });
            const response = await onPostAIDataApi(raw);
          } catch (err) {
            console.log('Get FCM TOKEN:::', err);
          }
          // }
          RNRestart.restart();
          // navigation.replace('SplashScreen');
        } else {
          setApiError(true);
          setApiErrorMessage(t('invalid_credentials'));
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        setIsLoading(false);
        console.log('error::', error.response.data);
        if (error[0] == 'AxiosError: Network Error') {
          setApiError(true);
          setApiErrorMessage('Network Error');
          setIsLoading(false);
        } else if (
          error.response.data.detail ==
          'No active account found with the given credentials'
        ) {
          setApiError(true);
          setApiErrorMessage(t('invalid_credentials'));
          setIsLoading(false);
        } else {
          setApiError(true);
          setApiErrorMessage(t('server_issue_please_try_again_later'));
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.safeAreaStyle}>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.headerView}>
          <Text
            style={styles.homeText}
            onPress={() => navigation.navigate('PricePrediction')}>
            Home
          </Text>
        </View>
        <Image style={styles.logoImage} source={logo} />
        <Text style={[styles.textStyle, {color: theme.text}]}>
          {t('login')}
        </Text>
        {apiError && (
          <View style={styles.mainView}>
            <ErrorComponent errorMessage={apiErrorMessage} />
          </View>
        )}
        <View style={styles.mainView}>
          <Text style={styles.emailPlaceHolder}>{t('email_address')}</Text>
          <View style={styles.textInputView}>
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError(false);
                setApiError(false);
              }}
              placeholder="hello@example.com"
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {color: theme.text}]}
              keyboardType={'email-address'}
              textContentType={'none'}
              autoCapitalize={'none'}
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>
              {t('please_first_enter_email_address')}
            </Text>
          )}

          <Text style={styles.emailPlaceHolder}>{t('password')}</Text>
          <View
            style={[
              styles.textInputView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError(false);
                setApiError(false);
              }}
              placeholder="******"
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {width: '83%', color: theme.text}]}
              secureTextEntry={passwordVisible}
              textContentType={'none'}
            />
            <TouchableOpacity
              style={{width: '12%'}}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}>
              {passwordVisible ? (
                <Image
                  style={[styles.eyeIcon, {tintColor: theme.text}]}
                  source={hidden}
                />
              ) : (
                <Image
                  style={[styles.eyeIcon, {tintColor: theme.text}]}
                  source={view}
                />
              )}
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={styles.errorText}>
              {t('please_first_enter_password')}
            </Text>
          )}
          {/* <View style={styles.forgotView}> */}
          <Text
            style={styles.forgotPassword}
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}>
            {t('forget_password')}
          </Text>
          {/* </View> */}

          <TouchableOpacity
            style={[styles.buttonView, {opacity: isLoading ? 0.75 : 1}]}
            onPress={() => onLoginData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>{t('sign_me_in')}</Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.haveAnAccount, {color: theme.text}]}>
            {t('do_not_have_an_account')}
            <Text
              style={styles.signUpText}
              onPress={() => {
                setEmail('');
                setEmailError(false);
                setPassword('');
                setPasswordError(false);
                setApiError(false);
                navigation.navigate('RegistrationScreen');
              }}>
              {t('sign_up')}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
