import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';

export function LoginPopup({
  modelVisible,
  setModelVisible,
  firstButtonClick,
  secondButtonClick,
  isPortrait,
}) {
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => {
        setModelVisible(!modelVisible);
      }}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModelVisible(!modelVisible);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.referralTitleText1}>
            {'You need to be logged in to access this page or feature.'}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={firstButtonClick}>
              <Text style={styles.linkText}>{'Registration'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={secondButtonClick}>
              <Text style={styles.cancelText}>{'Login'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const portraitStyles = StyleSheet.create({
  feedbackValue: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  extraView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '95%',
    height: hp(18),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingTop: hp(2),
    alignSelf: 'center',
  },
  referralTitleText: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.black,
    marginHorizontal: wp(3),
    marginTop: hp(1),
  },
  referralTitleText1: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.black,
    width: '94%',
    marginHorizontal: wp(4),
  },
  clickHere: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  linkButton: {
    minWidth: wp(30),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingHorizontal: wp(3),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  cancelButton: {
    width: wp(30),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: 5,
    marginLeft: wp(3),
  },
  cancelText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.primary,
  },
  buttonView: {
    width: '96%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: hp(2),
  },
});

const landscapeStyles = StyleSheet.create({
  feedbackValue: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  extraView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '50%',
    height: hp(18),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingTop: hp(2),
    alignSelf: 'center',
  },
  referralTitleText: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.black,
    marginHorizontal: wp(3),
    marginTop: hp(1),
  },
  referralTitleText1: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.black,
    width: '94%',
    marginHorizontal: wp(2),
  },
  clickHere: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  linkButton: {
    minWidth: wp(10),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingHorizontal: wp(2),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  cancelButton: {
    width: wp(10),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    borderRadius: 5,
    marginLeft: wp(1),
  },
  cancelText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.primary,
  },
  buttonView: {
    width: '96%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: hp(2),
  },
});
