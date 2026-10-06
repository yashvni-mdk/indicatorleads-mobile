import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

export const portraitStyles = StyleSheet.create({
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
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
  },
  headingView1: {
    width: '100%',
    height: hp(7),
    paddingHorizontal: wp(4),
  },
  subDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  amountText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  coinText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.titleText,
  },
  amountText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.greenColor,
  },
  arrowImage: {
    width: wp(5),
    height: hp(1),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
});

export const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  headerView: {
    flex: 0.12,
    width: '100%',
  },
  mainView: {
    flex: 0.88,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  searchText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingLeft: wp(2),
    width: '92%',
    paddingVertical: Platform.OS == 'ios' ? hp(1) : hp(0.4),
    alignSelf: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: 5,
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
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
  },
  headingView1: {
    width: '100%',
    height: hp(7),
    paddingHorizontal: wp(4),
  },
  subDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  amountText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  coinText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.titleText,
  },
  amountText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.greenColor,
  },
  arrowImage: {
    width: wp(5),
    height: hp(1),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
});
