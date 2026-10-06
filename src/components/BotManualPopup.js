import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';

export function BotManualPopup({
  modalVisible,
  setModalVisible,
  onPress,
  dailyLoss,
  setDailyLoss,
  dailyProfit,
  setDailyProfit,
  botConfig,
  setBotConfig,
  FinishOnPress,
}) {
  const {t} = useTranslation();
  const [errorShow, setErrorShow] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.container]}>
          <View style={styles.firstStepView}>
            <Text style={styles.titleText}>{t('manual_bot_setting')}</Text>
            <View style={styles.leverageView}>
              <Text style={styles.leverageText}>{t('daily_profit')}</Text>
              <TextInput
                value={dailyProfit}
                onChangeText={text => setDailyProfit(text)}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
              />
            </View>
            <View style={styles.leverageView}>
              <Text style={styles.leverageText}>{t('daily_loss')}</Text>
              <TextInput
                value={dailyLoss}
                onChangeText={text => setDailyLoss(text)}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
              />
            </View>
            {errorShow && (
              <Text style={[styles.errorText, {marginTop: hp(1)}]}>
                {t('value_should_lie_between_1_10')}
              </Text>
            )}
            <View style={styles.buttonView}>
              <View style={[styles.listingView, {marginTop: hp(3)}]}>
                <Text style={[styles.manualText, {marginRight: wp(2)}]}>
                  {t('manual')}
                </Text>
                <Switch
                  trackColor={{
                    false: COLORS.errorColor,
                    true: COLORS.greenColor,
                  }}
                  thumbColor={botConfig ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => setBotConfig(!botConfig)}
                  value={!botConfig}
                />
              </View>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (
                    parseFloat(dailyProfit) > 0 &&
                    parseFloat(dailyLoss) > 0 &&
                    parseFloat(dailyProfit) < 10 &&
                    parseFloat(dailyLoss) < 10
                  ) {
                    setErrorShow(false);
                    onPress();
                  } else {
                    setErrorShow(true);
                  }
                }}>
                {FinishOnPress ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>{t('finish')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    // minHeight: hp(25),
    // maxHeight: hp(60),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: hp(1.5),
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
  nextButton: {
    width: '30%',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: hp(3),
    marginRight: wp(3),
  },
  nextText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  firstStepView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leverageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6),
    marginTop: hp(2),
  },
  leverageText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.titleText,
  },
  leverageTextInput: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingVertical: Platform.OS == 'ios' ? hp(0.5) : hp(0),
    width: wp(18),
    borderWidth: 0.5,
    borderColor: COLORS.errorColor,
    marginLeft: wp(3),
    borderRadius: 5,
    paddingHorizontal: wp(2),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '96%',
    marginLeft: wp(4),
  },
  listingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  titleText: {
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.titleText,
  },
  errorText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  manualText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
});

// import React, {useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Switch,
// } from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';

// export function BotManualPopup({
//   modalVisible,
//   setModalVisible,
//   onPress,
//   dailyLoss,
//   setDailyLoss,
//   dailyProfit,
//   setDailyProfit,
//   botConfig,
//   setBotConfig,
// }) {
//   const [errorShow, setErrorShow] = useState(false);

//   return (
//     <Modal
//       isVisible={modalVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       onBackdropPress={() => setModalVisible(false)}>
//       <View
//         style={[
//           styles.container,
//           {
//             height: hp(35),
//           },
//         ]}>
//         <View style={styles.firstStepView}>
//           <Text style={styles.titleText}>{'Manual Bot Setting'}</Text>
//           <View style={styles.leverageView}>
//             <Text style={styles.leverageText}>{'Daily Profit %'}</Text>
//             <TextInput
//               value={dailyProfit}
//               onChangeText={text => setDailyProfit(text)}
//               style={styles.leverageTextInput}
//               keyboardType={'number-pad'}
//             />
//           </View>
//           <View style={styles.leverageView}>
//             <Text style={styles.leverageText}>{'Daily Loss %'}</Text>
//             <TextInput
//               value={dailyLoss}
//               onChangeText={text => setDailyLoss(text)}
//               style={styles.leverageTextInput}
//               keyboardType={'number-pad'}
//             />
//           </View>
//           {errorShow && (
//             <Text style={[styles.errorText, {marginTop: hp(1)}]}>
//               {`Value Should lie between 1-10`}
//             </Text>
//           )}
//           <View style={styles.buttonView}>
//             <View style={[styles.listingView, {marginTop: hp(3)}]}>
//               <Text style={[styles.manualText, {marginRight: wp(2)}]}>
//                 {'Manual'}
//               </Text>
//               <Switch
//                 trackColor={{
//                   false: COLORS.errorColor,
//                   true: COLORS.greenColor,
//                 }}
//                 thumbColor={botConfig ? '#f4f3f4' : '#f4f3f4'}
//                 ios_backgroundColor={COLORS.errorColor}
//                 onValueChange={() => setBotConfig(!botConfig)}
//                 value={!botConfig}
//               />
//             </View>
//             <TouchableOpacity
//               style={styles.nextButton}
//               onPress={() => {
//                 if (
//                   parseFloat(dailyProfit) > 0 &&
//                   parseFloat(dailyLoss) > 0 &&
//                   parseFloat(dailyProfit) < 10 &&
//                   parseFloat(dailyLoss) < 10
//                 ) {
//                   setErrorShow(false);
//                   onPress();
//                 } else {
//                   setErrorShow(true);
//                 }
//               }}>
//               <Text style={styles.nextText}>Finish</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     minHeight: hp(32),
//     maxHeight: hp(65),
//     backgroundColor: COLORS.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//   },
//   nextButton: {
//     width: '30%',
//     height: hp(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginTop: hp(3),
//     marginRight: wp(3),
//   },
//   nextText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.white,
//   },
//   firstStepView: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   leverageView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: hp(6),
//     marginTop: hp(2),
//   },
//   leverageText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.titleText,
//   },
//   leverageTextInput: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//     height: hp(6),
//     width: wp(26),
//     borderWidth: 0.5,
//     borderColor: COLORS.errorColor,
//     marginLeft: wp(3),
//     borderRadius: 5,
//     paddingHorizontal: wp(2),
//   },
//   buttonView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '96%',
//     marginLeft: wp(4),
//   },
//   listingView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: hp(1),
//   },
//   titleText: {
//     fontSize: hp(2.6),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.titleText,
//   },
//   errorText: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.errorColor,
//   },
//   manualText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.black,
//   },
// });
