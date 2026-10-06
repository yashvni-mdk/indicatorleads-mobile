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
    width: '92%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(2),
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  searchText1: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: '99%',
    paddingVertical: Platform.OS == 'ios' ? hp(0.8) : hp(0.4),
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: COLORS.orange,
    borderRadius: wp(1.5),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(2),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  activeView1: {
    width: '99%',
    maxHeight: hp(42.5),
    minHeight: hp(9),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(3),
    borderRadius: wp(2),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  titleActiveView1: {
    width: '100%',
    height: hp(7),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  optionTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(45),
    justifyContent: 'center',
    height: hp(7),
  },
  titleText4: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginRight: wp(1),
  },
  upDownImage: {
    width: wp(3.5),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  titleText3: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
  },
  filterButton: {
    paddingVertical: Platform.OS == 'ios' ? hp(0.8) : hp(0.8),
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingHorizontal: wp(4),
    borderRadius: 5,
  },
  filterText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '99%',
  },
  dataFoundText: {
    paddingTop: 10,
    color: COLORS.darkGreen,
    fontSize: 16,
  },
  dataFoundView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowView1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    alignSelf: 'flex-end',
  },
  rowView2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '48%',
    alignSelf: 'center',
  },
  selectCoinText: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.9),
    marginBottom: hp(1),
  },
  titleText6: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    textAlign: 'center',
  },
  dataActiveView1: {
    width: '100%',
    height: hp(6),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dataText4: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default styles;
