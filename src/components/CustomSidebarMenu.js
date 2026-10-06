import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import logout from '../images/logout.png';
import logo from '../images/logo.png';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogoutPopup} from './LogoutPopup';

const CustomSidebarMenu = ({props}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: Platform.OS == 'android' ? hp(12) : hp(8),
          justifyContent: 'center',
        }}>
        <Image source={logo} style={styles.sideMenuProfileIcon} />
      </View>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        <DrawerItemList {...props} />
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => {
            props.navigation.closeDrawer();
            setModalVisible(true);
          }}>
          <Image source={logout} style={styles.iconStyle} />
          <Text
            style={{
              fontSize: hp(2.1),
              fontFamily: Fonts.FONTS.PoppinsMedium,
              color: COLORS.textColor,
              marginLeft: wp(2),
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => {
          setModalVisible(false);
          AsyncStorage.setItem('accessToken', '');
          AsyncStorage.setItem('refreshToken', '');
          AsyncStorage.setItem('userRole', '');
          props.navigation.navigate('LoginScreen');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'contain',
    width: wp(15),
    height: hp(8),
    marginLeft: wp(5),
  },
  iconStyle: {
    width: wp(6),
    height: hp(3),
    resizeMode: 'contain',
    marginLeft: wp(1),
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
});

export default CustomSidebarMenu;
