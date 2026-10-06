import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';
import copy from '../images/copy.png';
import {useTranslation} from 'react-i18next';

export function WebhookPopup({
  modelVisible,
  setModelVisible,
  link,
  onPress,
  onPress1,
  link1,
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
          <Text style={styles.referralTitleText}>{t('your_webhook_link')}</Text>
          <Text style={[styles.stepText, {marginVertical: hp(1.5)}]}>
            {t('step_1')}
          </Text>
          <Text style={styles.desTitleText}>
            {t('copy_this_in_trading_view')}
          </Text>
          <View style={styles.linkCopyView}>
            <View style={styles.referralView}>
              <Text style={styles.referralText} numberOfLines={1}>
                {link}
              </Text>
            </View>
            <TouchableOpacity onPress={onPress}>
              <Image source={copy} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.stepText, {marginBottom: hp(1.5)}]}>
            {t('step_2')}
          </Text>
          <Text style={styles.desTitleText}>
            {t('copy_this_webhook_link_and_paste_in_trading_view')}
          </Text>
          <View style={styles.linkCopyView}>
            <View style={styles.referralView}>
              <Text style={styles.referralText} numberOfLines={1}>
                {link1}
              </Text>
            </View>
            <TouchableOpacity onPress={onPress1}>
              <Image source={copy} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    maxHeight: hp(50),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingTop: hp(2),
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
  linkButton: {
    width: '94%',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
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
});

// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Image,
//   // Modal,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';
// import copy from '../images/copy.png';

// export function WebhookPopup({
//   modelVisible,
//   setModelVisible,
//   link,
//   onPress,
//   onPress1,
//   link1,
// }) {
//   return (
//     <Modal
//       isVisible={modelVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       deviceWidth={wp(100)}
//       onBackdropPress={() => setModelVisible(false)}>
//       <View style={styles.container}>
//         <Text style={styles.referralTitleText}>Your Webhook Link</Text>
//         <Text style={[styles.stepText, {marginVertical: hp(1.5)}]}>Step 1</Text>
//         <Text style={styles.desTitleText}>Copy This In Trading View</Text>
//         <View style={styles.linkCopyView}>
//           <View style={styles.referralView}>
//             <Text style={styles.referralText} numberOfLines={1}>
//               {link}
//             </Text>
//           </View>
//           <TouchableOpacity onPress={onPress}>
//             <Image source={copy} style={styles.copyIcon} />
//           </TouchableOpacity>
//         </View>
//         <Text style={[styles.stepText, {marginBottom: hp(1.5)}]}>Step 2</Text>
//         <Text style={styles.desTitleText}>
//           Copy This Webhook Link and Paste in Trading View
//         </Text>
//         <View style={styles.linkCopyView}>
//           <View style={styles.referralView}>
//             <Text style={styles.referralText} numberOfLines={1}>
//               {link1}
//             </Text>
//           </View>
//           <TouchableOpacity onPress={onPress1}>
//             <Image source={copy} style={styles.copyIcon} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     height: hp(50),
//     backgroundColor: COLORS.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//   },
//   referralTitleText: {
//     fontSize: hp(2.6),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.apiError,
//   },
//   referralView: {
//     width: '85%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 0.5,
//     borderColor: COLORS.primary,
//     marginVertical: hp(3),
//     borderRadius: 8,
//     paddingVertical: hp(1),
//     paddingHorizontal: wp(2),
//     marginLeft: wp(4.5),
//   },
//   referralText: {
//     fontSize: hp(1.6),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//   },
//   linkButton: {
//     width: '94%',
//     height: hp(6),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//   },
//   linkText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsBold,
//     color: COLORS.white,
//   },
//   linkCopyView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '92%',
//   },
//   copyIcon: {
//     height: hp(3),
//     width: wp(4.5),
//     resizeMode: 'contain',
//     tintColor: COLORS.primary,
//   },
//   stepText: {
//     fontSize: hp(2.4),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.black,
//   },
//   desTitleText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     color: COLORS.apiError,
//     textAlign: 'center',
//   },
// });
