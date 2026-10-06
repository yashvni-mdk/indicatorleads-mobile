import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {COLORS, Fonts} from '../../utils';
import pic1 from '../../images/pic1.jpg';
import {hasNotch} from 'react-native-device-info';
import {
  onGetBalanceApi,
  onPostAIDataApi,
  onPostDeleteAccountApi,
  onUpdateProfileApi,
} from '../../services/Api';
import ImagePicker from 'react-native-image-crop-picker';
import copy from '../../images/copy.png';
import Clipboard from '@react-native-clipboard/clipboard';
import CountryPicker from 'react-native-country-picker-modal';
import {LogoutPopup} from '../../components/LogoutPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchBalance,
  fetchBinanceApiError,
  fetchUserDataSuccess,
} from '../../redux/reducer';
import {PlanExpirePopup} from '../../components/PlanExpirePopup';
import {useTranslation} from 'react-i18next';
import {DeletePopup} from '../../components/DeletePopup';
import {useTheme} from '../../utils/ThemeProvider';
import {portraitStyles, landscapeStyles} from './styles';
import useOrientation from '../../components/OrientationComponent';

const ProfileScreen = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user_data = useSelector(state => state.user_data);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [country, setCountry] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [binanceApi, setBinanceApi] = useState('');
  const [binanceKey, setBinanceKey] = useState('');
  const [binanceApi1, setBinanceApi1] = useState('');
  const [binanceKey1, setBinanceKey1] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [referal, setReferal] = useState('');
  const [referalCopy, setReferalCopy] = useState(false);
  const [binanceCopy, setBinanceCopy] = useState(false);
  const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [planExpire, setPlanExpire] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileVisible, setProfileVisible] = useState(true);
  const [activePackage, setActivePackage] = useState(1);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const onSelect = country => {
    console.log('Get Selected Country', country);
    setCountryCode(country.callingCode[0]);
    setCountry(country);
  };
  //   const handleCountryPicker = () => {
  //     setCountryPickerVisibility(true); // Open the CountryPicker when the dropDownContainer is pressed
  // };

  // const handleCountrySelect = (country) => {
  //   console.log("Get Value::", country);
  //     setSelectedCountry(country.name); // Set the selected country in state
  //     setCountryPickerVisibility(false); // Close the CountryPicker
  // };

  useEffect(() => {
    getProfileData();
    onActivePackage();
  }, []);

  const onActivePackage = async () => {
    const data = await AsyncStorage.getItem('timePeriod');
    console.log('get Active Package>>>>', parseFloat(data));
    setActivePackage(parseFloat(data));
  };

  const getProfileData = async () => {
    try {
      console.log('get Token>>>', user_data);
      setProfileVisible(true);
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      // const response = await onGetProfileApi();
      // console.log('Get PRofile Data::', response.data);
      if (user_data?.avatar) {
        let url = `https://signal.indicatorleads.com${user_data?.avatar}`;
        const filename = url.substring(url.lastIndexOf('/') + 1);
        const fileExtension = url.substring(url.lastIndexOf('.') + 1);
        const mimeTypes = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          // Add more mappings as needed
        };

        let mimeType = mimeTypes[fileExtension.toLowerCase()];
        let avatarObject = {
          uri: url,
          name: filename,
          type: mimeType,
        };
        setAvatar(avatarObject);
      }
      setProfileVisible(false);
      if (user_data?.binance_api?.length > 8) {
        setBinanceApi1(user_data?.binance_api);
        const firstFour = user_data?.binance_api.substring(0, 4);
        const lastFour = user_data?.binance_api.substring(
          user_data?.binance_api.length - 4,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_api.length - 8); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceApi(maskedString);
      } else if (user_data?.binance_api?.length >= 4) {
        setBinanceApi1(user_data?.binance_api);
        const firstFour = user_data?.binance_api.substring(0, 1);
        const lastFour = user_data?.binance_api.substring(
          user_data?.binance_api.length - 1,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_api.length - 2); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceApi(maskedString);
      } else {
        setBinanceApi(user_data?.binance_api);
      }
      if (user_data?.binance_secret_key?.length > 8) {
        setBinanceKey1(user_data?.binance_secret_key);
        const firstFour = user_data?.binance_secret_key.substring(0, 4);
        const lastFour = user_data?.binance_secret_key.substring(
          user_data?.binance_secret_key.length - 4,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_secret_key.length - 8); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceKey(maskedString);
      } else if (user_data?.binance_secret_key?.length > 4) {
        setBinanceKey1(user_data?.binance_secret_key);
        const firstFour = user_data?.binance_secret_key.substring(0, 1);
        const lastFour = user_data?.binance_secret_key.substring(
          user_data?.binance_secret_key.length - 1,
        );
        // Generating the 'x' string to mask the middle characters
        const middleMask = 'x'.repeat(user_data?.binance_secret_key.length - 2); // Subtracting 8 to account for the first and last four characters

        // Constructing the masked string
        const maskedString = firstFour + middleMask + lastFour;
        setBinanceKey(maskedString);
      } else {
        setBinanceKey(user_data?.binance_secret_key);
      }
      if (
        user_data?.contact_number != 'null' &&
        user_data?.contact_number != 'nxxl'
      ) {
        setMobileNumber(user_data?.contact_number);
      }
      if (user_data?.dial_code) {
        setCountryCode(user_data?.dial_code);
      }
      if (user_data?.email) {
        setEmail(user_data?.email);
      }
      if (user_data?.first_name) {
        setFirstName(user_data?.first_name);
      }
      if (user_data?.last_name) {
        setLastName(user_data?.last_name);
      }
      if (user_data?.referal_code) {
        setReferal(user_data?.referal_code);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const openProfileImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        multiple: false, // Allow selecting only one image
        compressImageQuality: 0.5,
      });

      if (image && image.path) {
        if (image && image.path) {
          var filename = image.path.substring(image.path.lastIndexOf('/') + 1);
          let imageData = {
            uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
            type: image.mime,
            name: Platform.OS === 'ios' ? image.filename : filename,
          };
          setAvatar(imageData);

          console.log('Selected image:', avatar);
        }
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const onUpdateData = async () => {
    try {
      const firstFour1 = binanceApi ? binanceApi.substring(0, 4) : '';
      const lastFour1 = binanceApi
        ? binanceApi.substring(binanceApi.length - 4)
        : '';
      const firstFour = binanceApi1 ? binanceApi1.substring(0, 4) : '';
      const lastFour = binanceApi1
        ? binanceApi1.substring(binanceApi1.length - 4)
        : '';
      const firstFourKey1 = binanceKey ? binanceKey.substring(0, 4) : '';
      const lastFourKey1 = binanceKey
        ? binanceKey.substring(binanceKey.length - 4)
        : '';
      const firstFourKey = binanceKey1 ? binanceKey1.substring(0, 4) : '';
      const lastFourKey = binanceKey1
        ? binanceKey1.substring(binanceKey1.length - 4)
        : '';
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      if (binanceApi) {
        if (firstFour == firstFour1 && lastFour == lastFour1) {
          formData.append('binance_api', binanceApi1);
        } else {
          formData.append('binance_api', binanceApi);
        }
      }
      if (binanceKey) {
        if (firstFourKey == firstFourKey1 && lastFourKey == lastFourKey1) {
          formData.append('binance_secret_key', binanceKey1);
        } else {
          formData.append('binance_secret_key', binanceKey);
        }
      }
      formData.append('dial_code', countryCode);
      formData.append('contact_number', mobileNumber);
      if (avatar && avatar?.uri) {
        formData.append('avatar', avatar);
      }
      const response = await onUpdateProfileApi(formData);
      if (response.status === 201) {
        showMessage({
          message: t('profile_data_update_successfully'),
          type: 'success',
          duration: 3000,
        });
        dispatch(fetchUserDataSuccess(response.data));
        setButtonVisible(false);
        try {
          const balanceResponse = await onGetBalanceApi();
          if (balanceResponse.data) {
            console.log('onGetBalanceApi Data>>>>', balanceResponse.data);
            dispatch(fetchBinanceApiError(''));
            dispatch(fetchBalance(balanceResponse.data));
          }
        } catch (err) {
          console.log('onGetBalanceApi::', err.response.data.detail);
          if (err?.response?.data?.detail) {
            dispatch(fetchBinanceApiError(err?.response?.data?.detail));
          } else {
            dispatch(fetchBinanceApiError('error'));
          }
        }
      } else {
        showMessage({
          message: t('something_is_wrong_please_try_again'),
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
        console.log('Error:das', response.data);
      }
    } catch (err) {
      if (err?.response?.status == 413) {
        showMessage({
          message: t('image_size_is_to_large'),
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: t('something_is_wrong_please_try_again'),
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      console.log('Error:', err);
    }
  };

  const onLogoutFun = async () => {
    try {
      let raw = JSON.stringify({
        firewall_token: '',
      });
      const response = await onPostAIDataApi(raw);
      AsyncStorage.setItem('accessToken', '');
      AsyncStorage.setItem('refreshToken', '');
      AsyncStorage.setItem('selectedScreen', '');
      AsyncStorage.setItem('Notify', '');
      setModalVisible(false);
      navigation.replace('SplashScreen');
    } catch (err) {
      console.log('err', err);
    }
  };

  const onDeleteHandle = async () => {
    try {
      let raw = JSON.stringify({});
      const response = await onPostDeleteAccountApi(raw);
      if (response.data) {
        console.log('get Response', response.data);
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
        AsyncStorage.setItem('selectedScreen', '');
        AsyncStorage.setItem('Notify', '');
        setModalDeleteVisible(false);
        navigation.replace('LoginScreen');
      }
    } catch (err) {
      console.log('Error::', err.response.data);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View style={[styles.container, {backgroundColor: theme.appBackground}]}>
        <View
          style={{
            width: '100%',
            height: hasNotch() ? hp(5) : 0,
            backgroundColor: COLORS.white,
          }}
        />
        <View style={styles.headerView}>
          {/* <SubHeader title={'Profile'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={t('profile')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            backVisible={true}
            notificationCount={notificationCount}
            onPress={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(10)}}>
            <View style={styles.firstView}>
              {avatar && avatar.uri ? (
                <Image source={{uri: avatar.uri}} style={styles.profileRound} />
              ) : profileVisible ? (
                <Image
                  source={{uri: avatar?.uri}}
                  style={styles.profileRound}
                />
              ) : (
                <Image source={pic1} style={styles.profileImage} />
              )}
              <View
                style={{
                  marginVertical: isPortrait ? hp(2) : hp(0.5),
                  width: '75%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: isPortrait ? hp(8) : hp(5),
                }}>
                <Text
                  style={styles.linkText}
                  onPress={() => {
                    setReferalCopy(true);
                    Clipboard.setString(
                      `https://indicatorleads.com/login?referralId=${referal}`,
                    );
                    showMessage({
                      message: t('successfully_copied'),
                      type: 'success',
                      duration: 3000,
                    });
                  }}>
                  {`https://indicatorleads.com/login?referralId=${referal}  `}
                  {referal != '' && (
                    <TouchableOpacity
                      onPress={() => {
                        setReferalCopy(true);
                        Clipboard.setString(
                          `https://indicatorleads.com/login?referralId=${referal}`,
                        );
                        showMessage({
                          message: t('successfully_copied'),
                          type: 'success',
                          duration: 3000,
                        });
                      }}>
                      <Image
                        source={copy}
                        style={{
                          height: hp(2),
                          width: wp(4),
                          resizeMode: 'contain',
                          tintColor: referalCopy
                            ? COLORS.greenColor
                            : COLORS.white,
                          marginTop: hp(2),
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </Text>
              </View>
              <Text style={styles.activeText}>{t('active')}</Text>
              <Text style={styles.joinDate}> Joined: 2023-03-15 13:02:29 </Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.logoutText}>{t('Logout')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.secondView}>
              <Text style={styles.updateProfileText}>
                {t('update_profile')}
              </Text>
              <View style={styles.browserView}>
                {avatar && avatar.uri ? (
                  <Image
                    source={{uri: avatar?.uri}}
                    style={styles.profileRound}
                  />
                ) : profileVisible ? (
                  <Image
                    source={{uri: avatar?.uri}}
                    style={styles.profileRound}
                  />
                ) : (
                  <Image source={pic1} style={styles.profileRound} />
                )}
                <TouchableOpacity
                  onPress={() => openProfileImagePicker()}
                  style={[
                    styles.browseButton,
                    {opacity: buttonVisible ? 1 : 0.5},
                  ]}
                  disabled={!buttonVisible}>
                  <Text style={styles.browseText}>{t('browse')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.emailPlaceHolder}>{t('first_name')}</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <Text style={styles.emailPlaceHolder}>{t('last_name')}</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <Text style={styles.emailPlaceHolder}>{t('email_address')}</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  editable={false}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>{t('binance_api')}</Text>
              <Text style={styles.browseText1}>
                {'[Please Enter IP 213.199.48.54]'}
                {binanceCopy ? (
                  <Text
                    onPress={() => {
                      setBinanceCopy(true);
                      Clipboard.setString(`213.199.48.54`);
                    }}
                    style={{
                      fontSize: hp(1.8),
                      color: COLORS.greenColor,
                      fontFamily: Fonts.FONTS.PoppinsSemiBold,
                      marginLeft: wp(4),
                    }}>
                    {`  ${t('copied')}`}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setBinanceCopy(true);
                      Clipboard.setString(`213.199.48.54`);
                    }}>
                    <Image
                      source={copy}
                      style={{
                        height: hp(2),
                        width: wp(4),
                        resizeMode: 'contain',
                        tintColor: COLORS.black,
                        marginLeft: wp(2),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={binanceApi}
                  onChangeText={text => {
                    setBinanceApi(text);
                  }}
                  numberOfLines={1}
                  editable={buttonVisible}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>
                {t('binance_secret_key')}
              </Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={binanceKey}
                  onChangeText={text => {
                    setBinanceKey(text);
                  }}
                  numberOfLines={1}
                  editable={buttonVisible}
                  style={styles.textInput}
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.emailPlaceHolder}>{t('country_code')}</Text>
              <View style={styles.textInputView}>
                <TouchableOpacity
                  disabled={!buttonVisible}
                  onPress={() =>
                    setCountryPickerVisibility(!isCountryPickerVisible)
                  }>
                  <Text style={styles.textInput}>
                    {`${countryCode}` || 'Select Country'}
                  </Text>
                </TouchableOpacity>
                {/* <TextInput
                  value={countryCode}
                  keyboardType={'number-pad'}
                  onChangeText={text => {
                    setCountryCode(text);
                  }}
                  editable={buttonVisible}
                  style={styles.textInput}
                /> */}
                {isCountryPickerVisible && ( // Render CountryPicker conditionally based on isCountryPickerVisible
                  <CountryPicker
                    visible={isCountryPickerVisible}
                    onClose={() => setCountryPickerVisibility(false)}
                    onSelect={onSelect}
                    withCloseButton
                    withCallingCode
                    withFilter
                    containerButtonStyle={{backgroundColor: COLORS.white}}
                  />
                )}
              </View>
              <Text style={styles.emailPlaceHolder}>{t('mobile_number')}</Text>
              <View style={styles.textInputView}>
                <TextInput
                  value={mobileNumber}
                  onChangeText={text => {
                    setMobileNumber(text);
                  }}
                  keyboardType={'number-pad'}
                  editable={buttonVisible}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.EditView}>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: !buttonVisible
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
                  onPress={() => {
                    activePackage > 0
                      ? setButtonVisible(true)
                      : setPlanExpire(true);
                  }}
                  disabled={buttonVisible}>
                  <Text
                    style={[
                      styles.editText,
                      {color: !buttonVisible ? COLORS.white : COLORS.iconColor},
                    ]}>
                    {t('edit')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onUpdateData()}
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: buttonVisible
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
                  disabled={!buttonVisible}>
                  <Text
                    style={[
                      styles.editText,
                      {color: buttonVisible ? COLORS.white : COLORS.iconColor},
                    ]}>
                    {t('update')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton1}
              onPress={() => setModalDeleteVisible(true)}>
              <Text style={[styles.editText1]}>{'Delete Account'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => onLogoutFun()}
      />
      <PlanExpirePopup
        modelVisible={planExpire}
        setModelVisible={setPlanExpire}
        title={t('to_edit_your_profile_please_purchase_a_plan')}
        firstButtonTitle={t('cancel')}
        firstButtonClick={() => setPlanExpire(false)}
      />
      <DeletePopup
        modelVisible={modalDeleteVisible}
        setModelVisible={setModalDeleteVisible}
        onPress={() => onDeleteHandle()}
      />
    </View>
  );
};

export default ProfileScreen;
