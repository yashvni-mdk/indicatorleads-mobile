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
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
// import Modal from 'react-native-modal';

export function WithdrawPopup({
  modelVisible,
  setModelVisible,
  amount,
  setAmount,
  address,
  setAddress,
  onPress,
  errorVisible,
  errorMessage,
  loading,
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
          <Text style={styles.referralTitleText2}>{t('withdrawal')}</Text>
          <View style={[styles.referralView1, {marginVertical: hp(2)}]}>
            <Text style={styles.referralText}>{t('amount')}</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={styles.textInput}
              keyboardType={'number-pad'}
            />
          </View>
          <View style={styles.referralView1}>
            <Text style={styles.referralText}>{t('Address')}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.textInput}
            />
          </View>
          {errorVisible && <Text style={styles.errorText}>{errorMessage}</Text>}
          <View style={styles.logoutButtonView}>
            <TouchableOpacity
              style={styles.linkButton1}
              onPress={() => setModelVisible(false)}>
              <Text style={styles.linkText1}>{t('Small_cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={onPress}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.linkText}>{t('submit')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '94%',
    paddingVertical: hp(3),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
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
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    width: '100%',
    marginLeft: wp(3),
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
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(23),
  },
  referralTitleText2: {
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
    alignSelf: 'center',
    textAlign: 'center',
  },
  referralView1: {
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  referralText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  linkButton: {
    width: '30%',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  linkButton1: {
    width: '30%',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginRight: wp(2),
  },
  linkText: {
    fontSize: hp(2),
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
  textInput: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(62),
    paddingVertical: Platform.OS == 'ios' ? hp(0.6) : hp(0.1),
    justifyContent: 'center',
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
    borderWidth: 0.5,
    marginLeft: wp(1),
    borderColor: COLORS.greyColor,
  },
  errorText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
    textAlign: 'right',
    marginRight: wp(4),
    marginTop: hp(1),
  },
});
