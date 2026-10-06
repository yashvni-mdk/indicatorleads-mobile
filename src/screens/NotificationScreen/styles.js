import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  dataActiveView: {
    width: wp(100),
    height: hp(11),
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    // alignItems: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: COLORS.lightPrimary,
    paddingVertical: hp(1.5),
    // borderRadius: wp(2),
    // marginBottom: hp(1),
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.white,
  },
  verticalView: {
    // height: hp(6),
    // justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
  },
  horizontalView: {
    height: hp(3.5),
    width: '100%',
    flexDirection: 'row',
  },
  dataText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.apiError,
  },
  dataText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.apiError,
  },
  desText: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.darkGreen,
  },
  dateText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsRegular,
    color: COLORS.apiError,
    width: '100%',
  },
  readAllText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greyColor,
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
    borderRadius: wp(2),
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: hp(2),
  },
  loaderView: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
