import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Switch,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import flag1 from '../../images/flag1.png';
import next from '../../images/next.png';
import flag2 from '../../images/flag2.png';
import bar from '../../images/bar.png';
import bot from '../../images/bot.png';
import bot1 from '../../images/bot1.png';
import robot from '../../images/robot.png';
import stack from '../../images/stack.png';
import wallet from '../../images/wallet.png';
import language from '../../images/language.png';
import table from '../../images/table.png';
import user from '../../images/user.png';
import sun from '../../images/sun.png';
import night from '../../images/night.png';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import bell2 from '../../images/bell2.png';
import {LogoutPopup} from '../../components/LogoutPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logout from '../../images/logout.png';
import money from '../../images/money.png';
import insurance from '../../images/insurance.png';
import terms from '../../images/terms.png';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import RNRestart from 'react-native-restart';
import '../../translation/index';
import {onPostAIDataApi} from '../../services/Api';
import {LoginPopup} from '../../components/LoginPopup';
import {useTheme} from '../../utils/ThemeProvider';
import {portraitStyles, landscapeStyles} from './styles';
import useOrientation from '../../components/OrientationComponent';

const SettingScreen = ({navigation}) => {
  const {theme, setCustomHeaderColor, toggleTheme, colorTheme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t, i18n} = useTranslation();
  // const notificationCount = useSelector(state => state.notificationCount);
  const getMenuList = useSelector(state => state.getMenuList);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('ProfileScreen');
  const [notificationCount, setNotificationCount] = useState(0);
  const [firstValue, setFirstValue] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);

  const languageList = [t('english'), t('vietnamese')];
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      getProfileData();
    });
    return subscribe;
  }, [navigation]);

  const getProfileData = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      if (language == 'en') {
        setFirstValue('English');
      } else if (language == 'vs') {
        setFirstValue('Tiếng Việt');
      }
      const token = await AsyncStorage.getItem('accessToken');
      if (token !== null) {
        setAuthToken(token);
      }
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const selectedScreen = await AsyncStorage.getItem('selectedScreen');
      if (selectedScreen) {
        setSelectedValue(selectedScreen);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const onPressButton = item => {
    if (item == 'PROFILE') {
      navigation.navigate('ProfileScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'MY_BOT') {
      navigation.navigate('MyBotScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'PMS') {
      navigation.navigate('PMSScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'PLANS') {
      navigation.navigate('PlanScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'ARBITRAGE') {
      navigation.navigate('ArbitrageScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'ARBITRAGE_BOT') {
      navigation.navigate('ArbitrageBot');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'WALLET') {
      navigation.navigate('WalletScreen');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'SPOT_BALANCE') {
      navigation.navigate('SpotBalance');
      AsyncStorage.setItem('selectedScreen', item);
    } else if (item == 'PRICE_ALERT') {
      navigation.navigate('UserAlert');
      AsyncStorage.setItem('selectedScreen', item);
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
      RNRestart.restart();
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: COLORS.white,
        }}
      />
      <View style={[styles.container, {backgroundColor: theme.appBackground}]}>
        <View style={styles.headerView}>
          <Header
            title={t('setting')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            onPress={() => navigation.openDrawer()}
            notificationCount={notificationCount}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(14)}}>
            {getMenuList.map((item, index) => {
              if (
                item != 'CRYPTO' &&
                item != 'BOT_STATUS' &&
                item != 'ANALYTICS' &&
                item != 'AI_PRICE_PREDICTION' &&
                item != 'AI_STATUS' &&
                item != 'SPOT_PMS' &&
                item != 'PLANS__NOW_PAYMENT_GATEWAY'
              ) {
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionView,
                      {
                        backgroundColor:
                          selectedValue == item ? COLORS.primary : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      authToken != ''
                        ? onPressButton(item)
                        : setLoginPopupVisible(true);
                    }}>
                    <View style={styles.profileData}>
                      <Image
                        style={[
                          styles.nextImage2,
                          {
                            tintColor:
                              selectedValue == item
                                ? COLORS.white
                                : COLORS.black,
                          },
                        ]}
                        source={
                          item == 'PROFILE'
                            ? user
                            : item == 'MY_BOT'
                            ? bot1
                            : item == 'PMS'
                            ? bar
                            : item == 'ARBITRAGE'
                            ? table
                            : item == 'ARBITRAGE_BOT'
                            ? robot
                            : item == 'WALLET'
                            ? wallet
                            : item == 'SPOT_BALANCE'
                            ? money
                            : item == 'PRICE_ALERT'
                            ? bell2
                            : stack
                        }
                      />
                      <Text
                        style={[
                          styles.activeText1,
                          {
                            color:
                              selectedValue == item
                                ? COLORS.white
                                : COLORS.black,
                          },
                        ]}>
                        {item == 'PROFILE'
                          ? t('profile')
                          : item == 'MY_BOT'
                          ? t('my_bot')
                          : item == 'PMS'
                          ? t('future_pms')
                          : item == 'PLANS'
                          ? t('plans')
                          : item == 'ARBITRAGE'
                          ? t('arbitrage')
                          : item == 'WALLET'
                          ? t('wallet')
                          : item == 'ARBITRAGE_BOT'
                          ? t('arbitrage_bot')
                          : item == 'SPOT_BALANCE'
                          ? t('spot_balance')
                          : item == 'PRICE_ALERT'
                          ? t('indicator_alert')
                          : item}
                      </Text>
                    </View>
                    <View style={styles.logoutButton}>
                      <Image
                        source={next}
                        style={[
                          styles.nextImage1,
                          {
                            tintColor:
                              selectedValue == item
                                ? COLORS.white
                                : COLORS.black,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }
            })}

            <TouchableOpacity
              style={[
                styles.optionView,
                {
                  backgroundColor:
                    selectedValue == 'TERMS_USE'
                      ? COLORS.primary
                      : COLORS.white,
                },
              ]}
              onPress={() => {
                navigation.navigate('PrivacyScreen', {from: 'terms'});
                // Linking.openURL('https://indicatorleads.com/terms-of-use');
                AsyncStorage.setItem('selectedScreen', 'TERMS_USE');
              }}>
              <View style={styles.profileData}>
                <Image
                  style={[
                    styles.nextImage2,
                    {
                      tintColor:
                        selectedValue == 'TERMS_USE'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                  source={terms}
                />
                <Text
                  style={[
                    styles.activeText1,
                    {
                      color:
                        selectedValue == 'TERMS_USE'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}>
                  {`${t('terms_use')} (EULA)`}
                </Text>
              </View>
              <View style={styles.logoutButton}>
                <Image
                  source={next}
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'TERMS_USE'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionView,
                {
                  backgroundColor:
                    selectedValue == 'PRIVACY' ? COLORS.primary : COLORS.white,
                },
              ]}
              onPress={() => {
                Linking.openURL('https://indicatorleads.com/privacy-policy');
                // navigation.navigate('PrivacyScreen', {from: 'privacy'});
                AsyncStorage.setItem('selectedScreen', 'PRIVACY');
              }}>
              <View style={styles.profileData}>
                <Image
                  style={[
                    styles.nextImage2,
                    {
                      tintColor:
                        selectedValue == 'PRIVACY'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                  source={insurance}
                />
                <Text
                  style={[
                    styles.activeText1,
                    {
                      color:
                        selectedValue == 'PRIVACY'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}>
                  {t('privacy_policy')}
                </Text>
              </View>
              <View style={styles.logoutButton}>
                <Image
                  source={next}
                  style={[
                    styles.nextImage1,
                    {
                      tintColor:
                        selectedValue == 'PRIVACY'
                          ? COLORS.white
                          : COLORS.black,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.optionView}>
              <View style={styles.profileData}>
                <Image style={styles.nextImage2} source={language} />
                <Text style={[styles.activeText1]}>{t('language')}</Text>
              </View>
              <View style={styles.logoutButton}>
                <SelectDropdown
                  data={languageList}
                  onSelect={(selectedItem, index) => {
                    if (selectedItem == t('english')) {
                      setFirstValue('English');
                      i18n.changeLanguage('en');
                      AsyncStorage.setItem('language', 'en');
                      // RNRestart.restart();
                    } else if (selectedItem == t('Vietnamese')) {
                      setFirstValue('Tiếng Việt');
                      i18n.changeLanguage('vs');
                      AsyncStorage.setItem('language', 'vs');
                      // RNRestart.restart();
                    }
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultButtonText={firstValue}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    if (
                      selectedItem == 'Tiếng Anh' ||
                      selectedItem == 'English'
                    ) {
                      // setFirstValue('English');
                      return 'English';
                    } else if (
                      selectedItem == t('Vietnamese') ||
                      selectedItem == 'Tiếng Việt'
                    ) {
                      // setFirstValue('Tiếng Việt');
                      return 'Tiếng Việt';
                    }
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  renderCustomizedRowChild={(item, index, isSelected) => {
                    console.log(item);
                    return (
                      <View style={styles.dropdownView}>
                        <Image
                          style={styles.selecterIcon}
                          source={item == t('english') ? flag1 : flag2}
                        />
                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                      </View>
                    );
                  }}
                  buttonStyle={styles.dropdown2BtnStyle}
                  buttonTextStyle={styles.dropdown2BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Image
                        source={isOpened ? arrowUp : down}
                        style={styles.imageIcon}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown2DropdownStyle}
                  // rowTextStyle={styles.dropdown2RowTxtStyle}
                />
              </View>
            </View>
            {authToken != '' ? (
              <TouchableOpacity
                style={styles.optionView}
                onPress={() => setModalVisible(true)}>
                <View style={styles.profileData}>
                  <Image
                    style={[styles.nextImage2, {tintColor: COLORS.errorColor}]}
                    source={logout}
                  />
                  <Text
                    style={[styles.activeText1, {color: COLORS.errorColor}]}>
                    {t('Logout')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </View>
      </View>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => onLogoutFun()}
      />
      <LoginPopup
        isPortrait={isPortrait}
        modelVisible={loginPopupVisible}
        setModelVisible={setLoginPopupVisible}
        firstButtonClick={() => {
          setLoginPopupVisible(false);
          navigation.navigate('RegistrationScreen');
        }}
        secondButtonClick={() => {
          setLoginPopupVisible(false);
          navigation.navigate('LoginScreen');
        }}
      />
    </View>
  );
};

export default SettingScreen;
