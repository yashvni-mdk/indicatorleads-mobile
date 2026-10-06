import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';

export function WithdrawRequestPopup({
  modelVisible,
  setModelVisible,
  onPress,
  address,
  setAddress,
  title,
  errorVisible,
}) {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => setModelVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModelVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.referralTitleText}>{title}</Text>
          <Text style={styles.addressText}>Address</Text>
          <TextInput
            value={address}
            onChangeText={text => setAddress(text)}
            style={styles.searchText1}
          />
          <View style={styles.logoutButtonView}>
            <TouchableOpacity style={styles.linkButton} onPress={onPress}>
              <Text style={styles.linkText}>{'Submit'}</Text>
            </TouchableOpacity>
          </View>
          {errorVisible && (
            <Text style={styles.errorText}>
              {'Please enter first address.'}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '94%',
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  referralTitleText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    marginLeft: wp(3),
    textAlign: 'center',
  },
  referralTitleText1: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(1.8),
    marginLeft: wp(5),
    marginTop: hp(2),
  },
  referralView: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.lightGreyColor,
    marginVertical: hp(3),
    borderRadius: 8,
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  referralText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  linkButton: {
    width: '25%',
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  linkButton1: {
    width: '30%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(2),
  },
  linkText: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  linkText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  logoutButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
  },
  addressText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    width: '90%',
    marginTop: hp(3),
    alignSelf: 'center',
  },
  searchText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.black,
    width: '90%',
    paddingVertical: Platform.OS == 'ios' ? hp(0.8) : hp(0.5),
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.greyColor,
    borderRadius: wp(1.5),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(2),
    marginTop: hp(1),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  errorText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
    marginLeft: wp(5),
  },
});
