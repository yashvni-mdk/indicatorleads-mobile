import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Switch,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import Header from '../../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import check from '../../../images/check.png';
import {
  onGetAdminFilterCommonApi,
  onGetAllUserDataApi,
  onUserDeleteApi,
} from '../../../services/Api';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import copy from '../../../images/copy.png';
import Clipboard from '@react-native-clipboard/clipboard';
import deleteIcon from '../../../images/delete.png';
import {DeleteUserPopup} from '../../../components/DeleteUserPopup';

const strategyArray = ['SILVER'];

const UsersScreen = ({navigation}) => {
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(false);
  const [inactiveVisible, setInactiveVisible] = useState(false);
  const [planActiveVisible, setPlanActiveVisible] = useState(false);
  const [planInactiveVisible, setPlanInactiveVisible] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [buyStrategy, setBuyStrategy] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

  useEffect(() => {
    notificationDataGet();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const notificationDataGet = async () => {
    try {
      const response = await onGetAllUserDataApi();
      if (response.data.results.length > 0) {
        setAllUserData(response.data.results);
        setFilterHistory(response.data.results);
        setNextUrl(response.data.next);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('notification::', err);
    }
  };

  const onCategoryFilterImplement = async text => {
    try {
      let url = `super-admin/auth/user/?page_size=100&${
        search1 != '' ? `email=${search1}&` : ''
      }is_active=${text == 'active' ? true : false}${
        planActiveVisible || planInactiveVisible
          ? `&user_current_package=${planActiveVisible ? true : false}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setAllUserData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onCategoryWithoutFilterImplement = async text => {
    try {
      let url = `super-admin/auth/user/?page_size=100&${
        search1 != '' ? `email=${search1}&` : ''
      }${
        planActiveVisible || planInactiveVisible
          ? `user_current_package=${planActiveVisible ? true : false}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setAllUserData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onFilterHandle = from => {
    if (from == 'active') {
      if (activeVisible) {
        onCategoryWithoutFilterImplement();
        setActiveVisible(false);
      } else {
        onCategoryFilterImplement('active');
        setActiveVisible(true);
      }
      setInactiveVisible(false);
    } else if (from == 'inactive') {
      setActiveVisible(false);
      if (inactiveVisible) {
        onCategoryWithoutFilterImplement();
        setInactiveVisible(false);
      } else {
        onCategoryFilterImplement('inactive');
        setInactiveVisible(true);
      }
    } else if (from == 'plan_active') {
      setPlanInactiveVisible(false);
      if (planActiveVisible) {
        onPlanWithoutFilterImplement();
        setPlanActiveVisible(false);
      } else {
        onPlanFilterImplement('plan_active');
        setPlanActiveVisible(true);
      }
    } else if (from == 'plan_inactive') {
      setPlanActiveVisible(false);
      if (planInactiveVisible) {
        onPlanWithoutFilterImplement();
        setPlanInactiveVisible(false);
      } else {
        onPlanFilterImplement('plan_inactive');
        setPlanInactiveVisible(true);
      }
    }
  };

  const onPlanFilterImplement = async text => {
    try {
      let url = `super-admin/auth/user/?page_size=100&${
        search1 != '' ? `email=${search1}&` : ''
      }${
        activeVisible || inactiveVisible
          ? `is_active=${activeVisible ? true : false}`
          : ''
      }&user_current_package=${text == 'plan_active' ? true : false}`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setAllUserData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onPlanWithoutFilterImplement = async text => {
    try {
      let url = `super-admin/auth/user/?page_size=100&${
        search1 != '' ? `email=${search1}&` : ''
      }${
        activeVisible || inactiveVisible
          ? `is_active=${activeVisible ? true : false}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setAllUserData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  // super-admin/auth/user/?page_size=100&is_active=true&user_current_package=true
  // https://signal.indicatorleads.com/super-admin/auth/user/?page_size=100&email=tes&is_active=true&user_current_package=true

  const maskText = text => {
    if (text?.length > 1) {
      return text[0] + '*'.repeat(text.length - 1);
    } else {
      return text; // Return the text as is if it only has one character
    }
  };

  const handleSearch = text => {
    setSearch1(text);
    if (text !== '') {
      onSearchFilterImplement(text);
      setRefresh(!refresh);
    } else {
      onSearchFilterImplement('');
      setRefresh(!refresh);
    }
  };

  const onSearchFilterImplement = async text => {
    try {
      let url = `super-admin/auth/user/?page_size=100&${
        text != '' ? `email=${text}&` : ''
      }${
        activeVisible || inactiveVisible
          ? `is_active=${activeVisible ? true : false}`
          : ''
      }${
        planActiveVisible || planInactiveVisible
          ? `&user_current_package=${planActiveVisible ? true : false}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setAllUserData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onDeleteUser = async id => {
    try {
      const response = await onUserDeleteApi(id);
      if (response.data) {
        setAllUserData(prevData => {
          return prevData.filter(item => item.id != id);
        });
        setFilterHistory(prevData => {
          return prevData.filter(item => item.id != id);
        });
        console.log('response>>', response.data);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  useEffect(() => {
    let dataVisible = false;
    allUserData.map(item => {
      if (item.userSelect) {
        dataVisible = true;
      }
    });
    if (dataVisible) {
      setDeleteButtonVisible(true);
    } else {
      setDeleteButtonVisible(false);
    }
  }, [allUserData]);

  const handleAllCheck = async () => {
    try {
      setAllUserData(prevData => {
        return prevData.map(item => {
          return {
            ...item,
            userSelect: !checkBox ? true : false,
          };
        });
      });
      setCheckBox(!checkBox);
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onHandleCheck = async index => {
    try {
      setAllUserData(prevData => {
        return prevData.map((item, index1) => {
          if (index == index1) {
            return {
              ...item,
              userSelect: !item.userSelect ? true : false,
            };
          }
          return item;
        });
      });
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onAllDeleteData = async () => {
    try {
      let sortData = [];
      allUserData.map(async item => {
        if (item.userSelect) {
          const response = await onUserDeleteApi(item.id);
          if (response.data) {
            console.log('All Delete Successful::', response.data);
          }
        } else {
          sortData.push(item);
        }
      });
      setAllUserData(sortData);
      setFilterHistory(sortData);
    } catch (err) {
      console.log('All Delete Error::', err);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: COLORS.white,
        }}
      />
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Header
            title={'All Users'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(4)}}>
            <TextInput
              value={search1}
              onChangeText={text => handleSearch(text)}
              placeholder={'Search...'}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              autoCapitalize="none"
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                disabled={deleteButtonVisible ? false : true}
                style={[
                  styles.filterButton,
                  {opacity: deleteButtonVisible ? 1 : 0.5},
                ]}
                onPress={() => onAllDeleteData()}>
                <Text style={styles.filterText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, {marginLeft: wp(4)}]}
                onPress={() => setFilterVisible(!filterVisible)}>
                <Text style={styles.filterText}>Filters</Text>
              </TouchableOpacity>
              {filterVisible && (
                <View style={styles.filterVisibleView}>
                  <Text style={styles.indicatorText}>Activity Status</Text>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('active')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: activeVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.optionView}
                    onPress={() => onFilterHandle('inactive')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: inactiveVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>Inactive</Text>
                  </TouchableOpacity>

                  <Text style={[styles.indicatorText, {marginTop: hp(1)}]}>
                    Plan Status
                  </Text>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('plan_active')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: planActiveVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.optionView}
                    onPress={() => onFilterHandle('plan_inactive')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: planInactiveVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>Inactive</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View
              style={[
                styles.activeView1,
                {
                  width:
                    allUserData.length > 1
                      ? '99%'
                      : allUserData.length == 0
                      ? '99%'
                      : wp(65),
                },
              ]}>
              <View style={styles.titleActiveView1}>
                <View style={[styles.optionTitleView]}>
                  <TouchableOpacity
                    onPress={() => handleAllCheck()}
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: checkBox
                          ? COLORS.greenColor
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Joining Date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Last Login'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.mainViewDesign1]}>
                  <Text style={styles.titleText4}>{'Email'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.mainViewDesign1]}>
                  <Text style={styles.titleText4}>{'Password'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'User Type'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Wallet\nBalance'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Active plan'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Plan Upgrade'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Status'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'API'}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={allUserData}
                extraData={allUserData}
                nestedScrollEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{paddingRight: hp(2)}}
                initialNumToRender={allUserData.length}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View key={0} style={styles.ListEmptyView}>
                    <View style={styles.subEmptyView}>
                      <Text style={styles.emptyText}>
                        {'No record available'}
                      </Text>
                    </View>
                  </View>
                )}
                renderItem={({item, index}) => {
                  return (
                    <View
                      key={item.ticker}
                      activeOpacity={1}
                      style={[
                        styles.dataHistoryView,
                        {
                          backgroundColor:
                            index % 2 === 0
                              ? COLORS.lightPrimary
                              : COLORS.lightPrimary3,
                          borderTopRightRadius:
                            allUserData.length - 1 == index ? wp(3) : 0,
                          borderBottomRightRadius:
                            allUserData.length - 1 == index ? wp(3) : 0,
                        },
                      ]}>
                      <View style={[styles.optionTitleView]}>
                        <TouchableOpacity
                          onPress={() => onHandleCheck(index)}
                          style={[
                            styles.checkBoxView,
                            {
                              backgroundColor: item.userSelect
                                ? COLORS.greenColor
                                : COLORS.white,
                            },
                          ]}>
                          <Image style={styles.rightImage} source={check} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.optionTitleView}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.created_at).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                      <View style={styles.optionTitleView}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.updated_at).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                      <View style={styles.optionTitleView1}>
                        <Text style={[styles.dataHistoryText]}>
                          <TouchableOpacity
                            onPress={() => Clipboard.setString(item?.email)}>
                            <Image source={copy} style={styles.copyImage} />
                          </TouchableOpacity>
                          {item.email}
                        </Text>
                      </View>
                      <View style={styles.optionTitleView1}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.show_password ? (
                            <TouchableOpacity
                              onPress={() =>
                                Clipboard.setString(item?.show_password)
                              }>
                              <Image source={copy} style={styles.copyImage} />
                            </TouchableOpacity>
                          ) : null}
                          {maskText(item?.show_password)}
                        </Text>
                      </View>
                      <View style={styles.optionTitleView}>
                        <Text style={[styles.dataHistoryText]}>
                          {item.user_type}
                        </Text>
                      </View>
                      <View style={[styles.optionTitleView]}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.binance_credentials?.binance_balance}
                        </Text>
                      </View>
                      <View style={[styles.optionTitleView]}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.user_current_package?.name}
                        </Text>
                      </View>
                      <View style={[styles.optionTitleView]}>
                        <SelectDropdown
                          data={strategyArray}
                          onSelect={(selectedItem, index) => {
                            setBuyStrategy(selectedItem);
                            console.log('gert Value:::', selectedItem);
                          }}
                          defaultValue={buyStrategy}
                          defaultButtonText={'-'}
                          renderCustomizedRowChild={(item, index, isSelected) => {
                            return (
                              <View style={styles.dropdownView}>
                                <Text style={styles.dropdownItemTxtStyle}>
                                  {item}
                                </Text>
                              </View>
                            );
                          }}
                          rowStyle={styles.dropdownView}
                          buttonStyle={styles.dropdown2BtnStyle}
                          buttonTextStyle={styles.dropdown2BtnTxtStyle}
                          dropdownIconPosition={'right'}
                          dropdownStyle={styles.dropdown2DropdownStyle}
                        />
                      </View>
                      <View style={styles.optionTitleView}>
                        <Switch
                          trackColor={{
                            false: item.is_active ? COLORS.greenColor : COLORS.errorColor,
                            true: item.is_active ? COLORS.greenColor : COLORS.errorColor,
                          }}
                          thumbColor={item.is_active ? '#f4f3f4' : '#f4f3f4'}
                          ios_backgroundColor={COLORS.errorColor}
                          onValueChange={() => {}}
                          value={item.is_active}
                        />
                      </View>
                      <View style={[styles.optionTitleView]}>
                        <Text
                          style={[
                            styles.dataHistoryText,
                            {
                              color: !item?.binance_credentials?.api_exist
                                ? COLORS.errorColor
                                : COLORS.greenColor,
                            },
                          ]}>
                          {item?.binance_credentials?.api_exist ? 'YES' : 'NO'}
                        </Text>
                      </View>
                      <View style={[styles.optionTitleView]}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedId(item.id);
                            setDeleteVisible(true);
                          }}>
                          <Image
                            style={styles.deleteImage}
                            source={deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <DeleteUserPopup
        modelVisible={deleteVisible}
        setModelVisible={setDeleteVisible}
        onPress={() => onDeleteUser(selectedId)}
      />
    </View>
  );
};

export default UsersScreen;
