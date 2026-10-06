import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import {COLORS, Fonts} from '../../../utils/index';

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
  },
  mainView: {
    flex: 0.9,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  searchText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingLeft: wp(3),
    width: '92%',
    paddingVertical: Platform.OS == 'ios' ? hp(0.8) : hp(0.4),
    alignSelf: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: wp(1.5),
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: hp(1),
  },
  headingView: {
    width: '100%',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  heading1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '27%',
  },
  headingText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.primary,
  },
  coinText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.titleText,
  },
  coinText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  amountText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  arrowImage: {
    width: wp(5),
    height: hp(1),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  imageView: {
    width: wp(4),
    height: hp(3),
    resizeMode: 'contain',
    marginLeft: wp(2),
    tintColor: COLORS.blueColor,
  },
  imageView1: {
    width: wp(4),
    height: hp(3),
    resizeMode: 'contain',
    marginLeft: wp(2),
    tintColor: COLORS.errorColor,
  },
});

export default styles;
