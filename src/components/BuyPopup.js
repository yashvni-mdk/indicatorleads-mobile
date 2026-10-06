import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import SelectDropdown from 'react-native-select-dropdown';
import arrowUp from '../images/arrowUp.png';
import down from '../images/down.png';
import {onGetPlanCoinApi} from '../services/Api';
import {useTranslation} from 'react-i18next';

export function BuyPopup({
  modelVisible,
  setModelVisible,
  onPress,
  isLoading,
  setSelectedItem,
}) {
  const {t} = useTranslation();
  const [coinList, setCoinList] = useState([]);
  const [firstValue, setFirstValue] = useState('');

  useEffect(() => {
    getPlanCoinData();
  }, []);

  const getPlanCoinData = async () => {
    try {
      let value = '';
      const response = await onGetPlanCoinApi();
      if (response.data) {
        for (const key in response.data) {
          coinList.push(response.data[key]);
          if (value == '') {
            value = response.data[key];
            console.log('Get Coin::', response.data[key]);
          }
        }
        setSelectedItem(value);
        setFirstValue(value);
      } else {
        console.log('Err', response);
      }
    } catch (err) {
      console.log('Err', err);
    }
  };

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
          <Text style={styles.referralTitleText}>{t('buy_now')}</Text>
          <Text style={styles.referralTitleText1}>{t('select_coin')}</Text>
          <SelectDropdown
            data={coinList}
            onSelect={(selectedItem, index) => {
              setSelectedItem(selectedItem);
            }}
            defaultButtonText={firstValue}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
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
            rowTextStyle={styles.dropdown2RowTxtStyle}
          />
          <TouchableOpacity style={styles.linkButton} onPress={onPress}>
            {isLoading ? (
              <ActivityIndicator size={'small'} color={COLORS.white} />
            ) : (
              <Text style={styles.linkText}>{t('make_payment')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: hp(33),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    paddingTop: hp(3),
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
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: '100%',
    marginLeft: wp(5),
    marginTop: hp(3),
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
    width: '40%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(3),
    marginTop: hp(4),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  dropdown2BtnStyle: {
    width: '91%',
    height: hp(5.5),
    backgroundColor: COLORS.lightWhite,
    borderRadius: 8,
    alignSelf: 'center',
    marginRight: wp(2),
    marginTop: hp(1.5),
  },
  dropdown2BtnTxtStyle: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(2),
    textAlign: 'left',
  },
  dropdown2DropdownStyle: {
    backgroundColor: COLORS.lightPrimary1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowTxtStyle: {
    color: '#FFF',
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(2),
    textAlign: 'left',
    paddingLeft: wp(2),
  },
  imageIcon: {
    width: wp(4),
    height: hp(3),
    resizeMode: 'contain',
  },
});

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';
// import SelectDropdown from 'react-native-select-dropdown';
// import arrowUp from '../images/arrowUp.png';
// import down from '../images/down.png';
// import {onGetPlanCoinApi} from '../services/Api';
// export function BuyPopup({
//   modelVisible,
//   setModelVisible,
//   onPress,
//   isLoading,
//   setSelectedItem,
// }) {
//   const [coinList, setCoinList] = useState([]);
//   const [firstValue, setFirstValue] = useState('');

//   useEffect(() => {
//     getPlanCoinData();
//   }, []);

//   const getPlanCoinData = async () => {
//     try {
//       let value = '';
//       const response = await onGetPlanCoinApi();
//       if (response.data) {
//         for (const key in response.data) {
//           coinList.push(response.data[key]);
//           if (value == '') {
//             value = response.data[key];
//             console.log('Get Coin::', response.data[key]);
//           }
//         }
//         setSelectedItem(value);
//         setFirstValue(value);
//       } else {
//         console.log('Err', response);
//       }
//     } catch (err) {
//       console.log('Err', err);
//     }
//   };

//   return (
//     <Modal
//       isVisible={modelVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       deviceWidth={wp(100)}
//       onBackdropPress={() => setModelVisible(false)}>
//       <View style={styles.container}>
//         <Text style={styles.referralTitleText}>Buy Now</Text>
//         <Text style={styles.referralTitleText1}>Select Coin</Text>
//         <SelectDropdown
//           data={coinList}
//           onSelect={(selectedItem, index) => {
//             setSelectedItem(selectedItem);
//           }}
//           defaultButtonText={firstValue}
//           buttonTextAfterSelection={(selectedItem, index) => {
//             return selectedItem;
//           }}
//           rowTextForSelection={(item, index) => {
//             return item;
//           }}
//           buttonStyle={styles.dropdown2BtnStyle}
//           buttonTextStyle={styles.dropdown2BtnTxtStyle}
//           renderDropdownIcon={isOpened => {
//             return (
//               <Image
//                 source={isOpened ? arrowUp : down}
//                 style={styles.imageIcon}
//               />
//             );
//           }}
//           dropdownIconPosition={'right'}
//           dropdownStyle={styles.dropdown2DropdownStyle}
//           rowTextStyle={styles.dropdown2RowTxtStyle}
//         />
//         <TouchableOpacity style={styles.linkButton} onPress={onPress}>
//           {isLoading ? (
//             <ActivityIndicator size={'small'} color={COLORS.white} />
//           ) : (
//             <Text style={styles.linkText}>Make Payment</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     height: hp(33),
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//     paddingTop: hp(3),
//   },
//   referralTitleText: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.primary,
//     width: '100%',
//     marginLeft: wp(3),
//   },
//   referralTitleText1: {
//     fontSize: hp(2.2),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//     width: '100%',
//     marginLeft: wp(5),
//     marginTop: hp(3),
//   },
//   referralView: {
//     width: '94%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 0.5,
//     borderColor: COLORS.lightGreyColor,
//     marginVertical: hp(3),
//     borderRadius: 8,
//     paddingVertical: hp(2),
//     paddingHorizontal: wp(2),
//     alignSelf: 'center',
//   },
//   referralText: {
//     fontSize: hp(1.6),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//   },
//   linkButton: {
//     width: '40%',
//     height: hp(5.5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginRight: wp(3),
//     marginTop: hp(4),
//   },
//   linkText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.white,
//   },
//   dropdown2BtnStyle: {
//     width: '91%',
//     height: hp(5.5),
//     backgroundColor: COLORS.lightWhite,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginRight: wp(2),
//     marginTop: hp(1.5),
//   },
//   dropdown2BtnTxtStyle: {
//     color: COLORS.black,
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     fontSize: hp(2),
//     textAlign: 'left',
//   },
//   dropdown2DropdownStyle: {
//     backgroundColor: COLORS.lightPrimary1,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   dropdown2RowTxtStyle: {
//     color: '#FFF',
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     fontSize: hp(2),
//     textAlign: 'left',
//     paddingLeft: wp(2),
//   },
//   imageIcon: {
//     width: wp(4),
//     height: hp(3),
//     resizeMode: 'contain',
//   },
// });
