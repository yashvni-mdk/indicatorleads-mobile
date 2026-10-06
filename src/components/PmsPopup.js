import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';

export function PmsPopup({
  modelVisible,
  setModelVisible,
  activeStatus,
  pageTitle,
}) {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="fade"
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
          <Text style={styles.leverageText3}>
            {activeStatus ? t('congratulations') : t('sorry')}
          </Text>
          <Text style={styles.leverageText4}>
            {/* {t('future_pms_is')} */}
            {pageTitle}
            <Text
              style={[
                styles.activeText,
                {color: activeStatus ? COLORS.greenColor : COLORS.errorColor},
              ]}>
              {activeStatus ? ` ${t('Activated')}` : ` ${t('Deactivated')}`}
            </Text>
          </Text>
          {/* <View style={styles.logoutButtonView}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => setModelVisible(false)}>
              <Text style={styles.linkText}>{t('Small_cancel')}</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '88%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: hp(4),
    // marginLeft: -wp(2.5),
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
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
  },
  referralView: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    marginVertical: hp(3),
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    marginLeft: wp(4.5),
  },
  referralText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  linkCopyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
  },
  copyIcon: {
    height: hp(3),
    width: wp(4.5),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  stepText: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  desTitleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.apiError,
    textAlign: 'center',
  },
  leverageText3: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
    textAlign: 'center',
  },
  leverageText4: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
    textAlign: 'center',
    marginTop: hp(1.5),
  },
  activeText: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    textAlign: 'center',
  },
  linkButton: {
    width: '27%',
    height: hp(4),
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
    marginTop: hp(2),
    width: '100%',
  },
});
