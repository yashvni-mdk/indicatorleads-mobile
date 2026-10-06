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
import {portraitStyles, landscapeStyles} from './styles';
import view from '../../images/view.png';
import hidden from '../../images/hidden.png';
import logo from '../../images/logo.png';
import {onRegistrationApi} from '../../services/Api';
import {ErrorComponent} from '../../components/ErrorComponent';
import {COLORS} from '../../utils';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useTheme} from '../../utils/ThemeProvider';
import useOrientation from '../../components/OrientationComponent';

const RegistrationScreen = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;

  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [referralError, setReferralError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = password => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onRegistrationData = async () => {
    if (email === '') {
      setErrorMessage(t('email_address_is_required'));
      setEmailError(true);
    } else if (password === '') {
      setErrorMessage(t('password_is_required'));
      setPasswordError(true);
    } else if (!isPasswordValid(password)) {
      setPasswordError(true);
      setErrorMessage(t('password_must_be_at_least_8'));
    } else {
      try {
        setIsLoading(true);
        let raw = JSON.stringify({
          email: email,
          password: password,
          referal_code: referral,
        });

        let raw1 = JSON.stringify({
          email: email,
          password: password,
        });

        const response = await onRegistrationApi(referral != '' ? raw : raw1);
        console.log('get Repsonse>>', response.data);
        if (response.status === 201) {
          setIsLoading(false);
          showMessage({
            message: 'Your account register successfully. please verify your account from your mail.',
            type: 'success',
            duration: 3000,
          });
          navigation.navigate('LoginScreen');
        } else {
          setApiError(true);
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        console.log('error::', error.response.data);
        if (error.response.data['email'] !== undefined) {
          setErrorMessage(error.response.data['email'][0]);
          setEmailError(true);
          setIsLoading(false);
        } else if (error.response.data['password'] !== undefined) {
          setErrorMessage(error.response.data['password'][0]);
          setPasswordError(true);
          setIsLoading(false);
        } else if (error.response.data['referal_code'] !== undefined) {
          setErrorMessage(error.response.data['referal_code'][0]);
          setReferralError(true);
          setIsLoading(false);
        } else {
          setApiError(true);
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
          {t('sign_up_your_account')}
        </Text>
        {apiError && (
          <View style={styles.mainView}>
            <ErrorComponent errorMessage={t('invalid_credentials')} />
          </View>
        )}
        <View style={styles.mainView}>
          <Text style={styles.emailPlaceHolder}>
            {`${t('email_address')}*`}
          </Text>
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
              autoCapitalize="none"
            />
          </View>
          {emailError && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Text style={styles.emailPlaceHolder}>{`${t('password')}*`}</Text>
          <View
            style={[
              styles.textInputView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                if (passwordError) {
                  if (isPasswordValid(text)) {
                    setPassword(text);
                    setPasswordError(false);
                    setApiError(false);
                  } else {
                    setPassword(text);
                    setApiError(false);
                  }
                } else {
                  setPassword(text);
                  setApiError(false);
                  setPasswordError(false);
                }
              }}
              placeholderTextColor={COLORS.greyColor}
              placeholder="******"
              style={[styles.textInput, {width: '83%', color: theme.text}]}
              autoCapitalize="none"
              secureTextEntry={passwordVisible}
            />
            <TouchableOpacity
              style={{width: '9%'}}
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
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <Text style={styles.emailPlaceHolder}>
            {`${t('referral_id')} (optional)`}
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              value={referral}
              onChangeText={text => {
                setReferral(text);
                setReferralError(false);
                setApiError(false);
              }}
              placeholder={t('referral_id')}
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {color: theme.text}]}
              autoCapitalize="none"
            />
          </View>
          {referralError && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[styles.buttonView, {opacity: isLoading ? 0.75 : 1}]}
            onPress={() => onRegistrationData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>{t('sign_me_up')}</Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.haveAnAccount, {color: theme.text}]}>
            {t('already_have_an_account')}
            <Text
              style={styles.signUpText}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              {t('sign_in')}
            </Text>
          </Text>
          <Text style={styles.messageText}>
            {
              '*registering will enable to purchase from any of their supported devices.'
            }
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationScreen;
