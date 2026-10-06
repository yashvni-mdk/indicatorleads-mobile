import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
// import Modal from 'react-native-modal';

export function CommonPopup({
  modelVisible,
  setModelVisible,
  link,
  onPress,
  title,
  firstButtonTitle,
  secondButtonTitle,
  firstButtonClick,
  secondButtonClick,
}) {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="slide"
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
          <View>
            <Text style={styles.referralTitleText1}>{t('delete_coin')}</Text>
            <Text style={styles.referralTitleText}>{title}</Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={firstButtonClick}>
              <Text style={styles.cancelText}>{firstButtonTitle}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={secondButtonClick}>
              <Text style={styles.linkText}>{secondButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    height: hp(21),
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
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    width: '100%',
    marginLeft: wp(3),
  },
  linkButton: {
    width: wp(30),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginLeft: wp(4),
  },
  linkText: {
    fontSize: hp(1.8),
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
    borderRadius: 8,
  },
  cancelText: {
    fontSize: hp(1.8),
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


// import React from 'react';
// import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';

// export function CommonPopup({
//   modelVisible,
//   setModelVisible,
//   link,
//   onPress,
//   title,
//   firstButtonTitle,
//   secondButtonTitle,
//   firstButtonClick,
//   secondButtonClick,
// }) {
//   return (
//     <Modal
//       isVisible={modelVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       onBackdropPress={() => setModelVisible(false)}>
//       <View style={styles.container}>
//         <View>
//           <Text style={styles.referralTitleText1}>Delete Coin</Text>
//           <Text style={styles.referralTitleText}>{title}</Text>
//         </View>
//         <View style={styles.buttonView}>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={firstButtonClick}>
//             <Text style={styles.cancelText}>{firstButtonTitle}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.linkButton}
//             onPress={secondButtonClick}>
//             <Text style={styles.linkText}>{secondButtonTitle}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     height: hp(21),
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//     justifyContent: 'space-between',
//     paddingTop: hp(2),
//   },
//   referralTitleText: {
//     fontSize: hp(1.9),
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     color: COLORS.black,
//     marginLeft: wp(3),
//     marginTop: hp(1),
//   },
//   referralTitleText1: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.primary,
//     width: '100%',
//     marginLeft: wp(3),
//   },
//   linkButton: {
//     width: wp(30),
//     height: hp(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     marginLeft: wp(4),
//   },
//   linkText: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsBold,
//     color: COLORS.white,
//   },
//   cancelButton: {
//     width: wp(30),
//     height: hp(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.white,
//     borderWidth: 0.5,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//   },
//   cancelText: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsBold,
//     color: COLORS.primary,
//   },
//   buttonView: {
//     width: '96%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginBottom: hp(2),
//   },
// });
