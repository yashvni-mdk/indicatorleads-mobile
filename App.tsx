import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import HomeScreen from './src/screens/HomeScreen';
import MyBotScreen from './src/screens/MyBotScreen';
import BotStatusScreen from './src/screens/BotStatusScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import PricePrediction from './src/screens/PricePrediction';
import PMSScreen from './src/screens/PMSScreen';
import ArbitrageScreen from './src/screens/ArbitrageScreen';
import ArbitrageBot from './src/screens/ArbitrageBot';
import PlanScreen from './src/screens/PlanScreen';
import chart from './src/images/chart.png';
import bar from './src/images/bar.png';
import bot from './src/images/bot.png';
import bot1 from './src/images/bot1.png';
import robot from './src/images/robot.png';
import robot1 from './src/images/robot1.png';
import stack from './src/images/stack.png';
import sync from './src/images/analytics.png';
import letter from './src/images/letter.png';
import f from './src/images/f.png';
import table from './src/images/table.png';
import chart1 from './src/images/chart1.png';
import activity from './src/images/activity.png';
import setting from './src/images/setting.png';
import notification from './src/images/notification.png';
import one from './src/images/one.png';
import openBook from './src/images/openBook.png';
import alert from './src/images/alert.png';
import warning from './src/images/warning.png';
import people from './src/images/people.png';
import bonus from './src/images/bonus.png';
import four from './src/images/four.png';
import zoom from './src/images/zoom.png';
import notificationBell from './src/images/notificationBell.png';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './src/components/Pixel';
import CustomSidebarMenu from './src/components/CustomSidebarMenu';
import {COLORS, Fonts} from './src/utils';
import NotificationScreen from './src/screens/NotificationScreen';
import messaging from '@react-native-firebase/messaging';
import SettingScreen from './src/screens/SettingScreen';
import TabBarComponent from './src/components/TabBarComponent';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {hasNotch} from 'react-native-device-info';
import LoadingScreen from './src/screens/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onGetNotificationListApi} from './src/services/Api';
import WalletScreen from './src/screens/WalletScreen';
import AIStatusScreen from './src/screens/AIStatusScreen';
import i18n from './src/translation/index';
import {I18nextProvider} from 'react-i18next';
import WiFiScreen from './src/screens/WiFiScreen';
import SpotBalance from './src/screens/SpotBalance';
import SpotPMS from './src/screens/SpotPMS';
import DashboardScreen from './src/screens/AdminScreens/DashboardScreen';
import IndicatorScreen from './src/screens/AdminScreens/IndicatorScreen';
import IndicatorNotification from './src/screens/AdminScreens/IndicatorNotification';
import AnalyticsAdmin from './src/screens/AdminScreens/AnalyticsAdmin';
import WebNotification from './src/screens/AdminScreens/WebNotification';
import WithdrawalHistory from './src/screens/AdminScreens/WithdrawalHistory';
import WithdrawalRequest from './src/screens/AdminScreens/WithdrawalRequest';
import DepositScreen from './src/screens/AdminScreens/DepositScreen';
import ManagePlans from './src/screens/AdminScreens/ManagePlans';
import SpotPmsHistory from './src/screens/AdminScreens/SpotPmsHistory';
import SpotPmsActive from './src/screens/AdminScreens/SpotPmsActive';
import SpotPmsConfig from './src/screens/AdminScreens/SpotPmsConfig';
import FuturePmsHistory from './src/screens/AdminScreens/FuturePmsHistory';
import FuturePmsActive from './src/screens/AdminScreens/FuturePmsActive';
import FuturePmsConfig from './src/screens/AdminScreens/FuturePmsConfig';
import MyBotHistory from './src/screens/AdminScreens/MyBotHistory';
import MyBotActive from './src/screens/AdminScreens/MyBotActive';
import AMBotHistory from './src/screens/AdminScreens/AMBotHistory';
import AMBotActive from './src/screens/AdminScreens/AMBotActive';
import AIHistoryScreen from './src/screens/AdminScreens/AIHistoryScreen';
import AIActiveScreen from './src/screens/AdminScreens/AIActiveScreen';
import OneScreen from './src/screens/AdminScreens/OneScreen';
import IndicatorAlertScreen from './src/screens/AdminScreens/IndicatorAlertScreen';
import AIConfigScreen from './src/screens/AdminScreens/AIConfigScreen';
import BotConfigScreen from './src/screens/AdminScreens/BotConfigScreen';
import UsersScreen from './src/screens/AdminScreens/UsersScreen';
import TradingViewScreen from './src/screens/AdminScreens/TradingViewScreen';
import FourScreen from './src/screens/AdminScreens/FourScreen';
import AdminNotification from './src/screens/AdminScreens/AdminNotification';
import PrivacyScreen from './src/screens/PrivacyScreen';
import UserAlert from './src/screens/UserAlert';
import CustomScreen from './src/screens/AdminScreens/CustomScreen';
import OneDScreen from './src/screens/AdminScreens/OneDScreen';
import {ThemeProvider} from './src/utils/ThemeProvider';
import {useTheme} from './src/utils/ThemeProvider';
import useOrientation from './src/components/OrientationComponent';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// const TabBar = ({state, navigation, descriptors}) => {
//   return (
//     <TabBarComponent
//       state={state}
//       navigation={navigation}
//       descriptors={descriptors}
//     />
//   );
// };

const TabStack = () => {
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="PricePrediction"
      // tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: isPortrait ? Platform.OS == 'ios' ? hp(7.5) : hp(7.5) : hp(9),
          backgroundColor: theme.background,
          borderColor: COLORS.lightWhite,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Platform.OS == 'ios' ? isPortrait ? hasNotch() ? hp(3.3) : 0 : hp(1.5) : 0,
          position: 'absolute',
          bottom: hp(3),
          left: wp(3),
          right: wp(3),
          borderRadius: hp(4),
          shadowColor: COLORS.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 3,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={chart}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AIStatusScreen"
        component={AIStatusScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                    marginLeft: -wp(3),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView2,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={robot1}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="BotStatusScreen"
        component={BotStatusScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                    marginLeft: -wp(6),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView1,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={bot}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="PricePrediction"
        component={PricePrediction}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.AIRoundView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : COLORS.lightPrimary1,
                    borderWidth: 2,
                    borderColor: focused
                      ? COLORS.lightPrimary2
                      : COLORS.lightWhite,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: hp(3.5),
                    color: focused ? COLORS.primary : COLORS.white,
                    fontFamily: Fonts.FONTS.PoppinsBold,
                  }}>
                  AI
                </Text>
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="SpotPMS"
        component={SpotPMS}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                    marginLeft: wp(6),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView1,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={letter}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                    marginLeft: wp(3),
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={sync}
                />
              </View>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <View
                style={[
                  styles.bottomView,
                  {
                    backgroundColor: focused
                      ? COLORS.lightPrimary3
                      : theme.background,
                  },
                ]}>
                <Image
                  style={[
                    styles.imageView,
                    {tintColor: focused ? COLORS.primary : theme.bottomIcon},
                  ]}
                  source={setting}
                />
              </View>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function SettingStack() {
  return (
    <Stack.Navigator initialRouteName="SettingScreen">
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlanScreen"
        component={PlanScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArbitrageBot"
        component={ArbitrageBot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArbitrageScreen"
        component={ArbitrageScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PMSScreen"
        component={PMSScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="MyBotScreen"
        component={MyBotScreen}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyBotScreen"
        component={MyBotScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SpotBalance"
        component={SpotBalance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserAlert"
        component={UserAlert}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          minWidth: Platform.OS == 'ios' ? '65%' : '64%',
          marginRight: Platform.OS == 'ios' ? wp(1) : -wp(7),
          opacity: 1,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerActiveBackgroundColor: COLORS.lightPrimary3,
        drawerLabelStyle: {
          fontSize: hp(2.2),
          fontFamily: Fonts.FONTS.PoppinsMedium,
          marginLeft: -wp(3),
          width: wp(50),
        },
      }}
      drawerContent={props => <CustomSidebarMenu props={props} />}>
      <Drawer.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Dashboard',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={chart}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="UsersScreen"
        component={UsersScreen}
        options={{
          headerShown: false,
          drawerLabel: 'All Users',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={people}
            />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="AIConfigScreen"
        component={AIConfigScreen}
        options={{
          headerShown: false,
          drawerLabel: 'AI Config',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="AIActiveScreen"
        component={AIActiveScreen}
        options={{
          headerShown: false,
          drawerLabel: 'AI Active',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AIHistoryScreen"
        component={AIHistoryScreen}
        options={{
          headerShown: false,
          drawerLabel: 'AI History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot1}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="BotConfigScreen"
        component={BotConfigScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Auto Bot Config',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AMBotActive"
        component={AMBotActive}
        options={{
          headerShown: false,
          drawerLabel: 'A/M Bot Active',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AMBotHistory"
        component={AMBotHistory}
        options={{
          headerShown: false,
          drawerLabel: 'A/M Bot History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot1}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MyBotActive"
        component={MyBotActive}
        options={{
          headerShown: false,
          drawerLabel: 'My Bot Active',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MyBotHistory"
        component={MyBotHistory}
        options={{
          headerShown: false,
          drawerLabel: 'My Bot History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={table}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FuturePmsConfig"
        component={FuturePmsConfig}
        options={{
          headerShown: false,
          drawerLabel: 'Future PMS Config',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bar}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FuturePmsActive"
        component={FuturePmsActive}
        options={{
          headerShown: false,
          drawerLabel: 'Future PMS Active',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={chart1}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FuturePmsHistory"
        component={FuturePmsHistory}
        options={{
          headerShown: false,
          drawerLabel: 'Future PMS History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={activity}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="SpotPmsConfig"
        component={SpotPmsConfig}
        options={{
          headerShown: false,
          drawerLabel: 'Spot PMS Config',
          drawerIcon: ({focused}) => (
            <Text
              style={{
                fontSize: hp(2.2),
                color: focused ? COLORS.primary : COLORS.iconColor,
                fontFamily: Fonts.FONTS.PoppinsBold,
                marginTop: 1,
              }}>
              SP
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="SpotPmsActive"
        component={SpotPmsActive}
        options={{
          headerShown: false,
          drawerLabel: 'Spot PMS Active',
          drawerIcon: ({focused}) => (
            <Text
              style={{
                fontSize: hp(2.2),
                color: focused ? COLORS.primary : COLORS.iconColor,
                fontFamily: Fonts.FONTS.PoppinsBold,
              }}>
              SA
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="SpotPmsHistory"
        component={SpotPmsHistory}
        options={{
          headerShown: false,
          drawerLabel: 'Spot PMS History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={table}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ManagePlans"
        component={ManagePlans}
        options={{
          headerShown: false,
          drawerLabel: 'Manage Plans',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={activity}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="DepositScreen"
        component={DepositScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Deposit',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={sync}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="WithdrawalRequest"
        component={WithdrawalRequest}
        options={{
          headerShown: false,
          drawerLabel: 'Withdrawal Request',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bonus}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="WithdrawalHistory"
        component={WithdrawalHistory}
        options={{
          headerShown: false,
          drawerLabel: 'Withdrawal History',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={robot}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="WebNotification"
        component={WebNotification}
        options={{
          headerShown: false,
          drawerLabel: 'Web Notification',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={stack}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AnalyticsAdmin"
        component={AnalyticsAdmin}
        options={{
          headerShown: false,
          drawerLabel: 'Analytics',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={openBook}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AIConfigScreen"
        component={AIConfigScreen}
        options={{
          headerShown: false,
          drawerLabel: 'One-D',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={one}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="OneScreen"
        component={OneScreen}
        options={{
          headerShown: false,
          drawerLabel: 'One',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={one}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FourScreen"
        component={FourScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Four',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={four}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="CustomScreen"
        component={CustomScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Custom',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={zoom}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="IndicatorScreen"
        component={IndicatorScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Indicator',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={notification}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="IndicatorNotification"
        component={IndicatorNotification}
        options={{
          headerShown: false,
          drawerLabel: 'Indicator Notification',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={alert}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="AdminNotification"
        component={AdminNotification}
        options={{
          headerShown: false,
          drawerLabel: 'Notification',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={notificationBell}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="IndicatorAlertScreen"
        component={IndicatorAlertScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Indicator Alert',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={warning}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="TradingViewScreen"
        component={TradingViewScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Trading View PMS',
          drawerIcon: ({focused}) => (
            <Image
              style={{
                tintColor: focused ? COLORS.primary : COLORS.iconColor,
                width: wp(5),
                height: hp(3),
                resizeMode: 'contain',
              }}
              source={bar}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('Get Message:::>>', remoteMessage);
      const notification = await onGetNotificationListApi();
      if (notification.data) {
        let strNotify = notification.data.results;
        let count = 0;
        strNotify.map((item, index) => {
          if (item.recive == false) {
            count = count + 1;
          }
        });
        AsyncStorage.setItem('notificationCount', JSON.stringify(count));
      }
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LoadingScreen"
                component={LoadingScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="TabStack"
                component={TabStack}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MyDrawer"
                component={MyDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PlanScreen"
                component={PlanScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ArbitrageBot"
                component={ArbitrageBot}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ArbitrageScreen"
                component={ArbitrageScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PMSScreen"
                component={PMSScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="WalletScreen"
                component={WalletScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="WiFiScreen"
                component={WiFiScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MyBotScreen"
                component={MyBotScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SpotBalance"
                component={SpotBalance}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            {/* <RemotePushController /> */}
            <FlashMessage position={'top'} />
          </NavigationContainer>
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  bottomView: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView1: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: wp(12.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  AIRoundView: {
    width: hp(9.5),
    height: hp(9.5),
    borderRadius: hp(9.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    width: wp(5.5),
    height: hp(3),
    resizeMode: 'contain',
  },
  imageView1: {
    width: wp(6.5),
    height: hp(3),
    resizeMode: 'contain',
  },
  imageView2: {
    width: wp(6.5),
    height: hp(4),
    resizeMode: 'contain',
  },
  imageView3: {
    width: wp(5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
});
