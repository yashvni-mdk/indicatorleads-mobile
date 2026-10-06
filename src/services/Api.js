import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

export default class Api {
  static baseUrl1 = Config.BASE_URL;
}

export const sendPushNotification = async (token, title, body, sound) => {
  const FIREBASE_API_KEY = Config.FIREBASE_API_KEY;

  const message = {
    registration_ids: [token],
    notification: {
      title: title,
      body: body,
      vibrate: 1,
      sound: sound,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });
  console.log('Get Respomse Notification:::::', JSON.stringify(message));
  let response = await fetch(Config.NOTIFICATION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  // console.log("=><*", response);
  response = await response.json();
  //  console.log("=><*", response);
};

export const onLoginApi = async requestData => {
  const url = Api.baseUrl1 + 'auth/login/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onRegistrationApi = async requestData => {
  console.log('get requestData>>', requestData);
  const url = Api.baseUrl1 + 'auth/register/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onForgotPasswordApi = async requestData => {
  const url = Api.baseUrl1 + 'auth/forgot-password/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetProfileApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/profile/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateProfileApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/profile/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBalanceApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Token>>', token);
  const url = Api.baseUrl1 + 'customer/bot-trading/account-details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetHistoryDetailApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetExtraHistoryApi = async url => {
  const token = await AsyncStorage.getItem('accessToken');
  // const url = Api.baseUrl1 + `customer/bot-trading/history-trade-detail/`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMarqueeApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/context/marquee-tag/?page_for=crypto&is_active=True';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetLastLeadApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/latest/last-lead/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBotLastLeadApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/latest/custom/last-lead/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAutoManualDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/crypto-default-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAutoManualDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/crypto-default-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMarketSentiDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/context/market-sentimate/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAnalyticsDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/context/analytics/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPackageDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/packages/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActivePackageDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/packages/active-details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPaymentDetailsDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetExtraPaymentDetailsDataApi = async url => {
  const token = await AsyncStorage.getItem('accessToken');
  // const url = Api.baseUrl1 + 'customer/payment/details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/future-tickers/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostBotTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBotTickerDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCryptoTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlists/';
  console.log('get Value>>>', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBotStickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlists/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBinanceDataApi = async () => {
  const url = 'https://api.binance.com/api/v3/ticker/24hr';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostBotTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlist/bot-config/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTickerConfigDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBotTickerConfigDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlist/bot-config/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBotTickerConfigDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/custom/mainwatchlist/bot-config/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActiveBotStausApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActivePMSApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/pms-active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPMSHistoryDetailApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/pms-history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFuturePriceApi = async () => {
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/futureprice-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAuthFuturePriceApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token != null) {
    const url = Api.baseUrl1 + 'super-admin/bot-trading/spotprice-1d-ai-bot-status-send/';
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  } else {
    const url = Api.baseUrl1 + 'super-admin/bot-trading/spotprice-1d-ai-bot-status-send/';
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
};

export const onGetPercentStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/percent-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFavoriteStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostFavoriteStatusApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostNotificationStatusApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/trends-notiication-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetNotificationStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/trends-notiication-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteFavoriteDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteNotificationDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'customer/bot-trading/trends-notiication-ai-bot-status/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPlanCoinApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/ticker-payment-accept/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetIndicatortBotApi = async () => {
  const url = Api.baseUrl1 + 'super-admin/bot-trading/indicator-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSentimentApi = async () => {
  const url = Api.baseUrl1 + 'super-admin/bot-trading/sentiment-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetvolumePathApi = async () => {
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/crypto-thirty-day-volume/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAIDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAIDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostGenerateInvoiceApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/generate-invoice/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostGenerateWalletApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/payment/wallet-generate-invoice/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetMenuApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/menu-injection/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSplashLogoApi = async () => {
  const url = Api.baseUrl1 + 'unauth/context/company-drawer/';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetNotificationListApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/notifications/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostNotificationListApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/dashboard/notifications/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTransactionListApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `auth/wallet/transactions/`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostWithdrawApi = async body => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `auth/wallet/widthdraw/`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetHistoryDetailAIStatusApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/ai-history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetActiveAIStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/ai-active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetExtraHistoryAIStatusApi = async url => {
  const token = await AsyncStorage.getItem('accessToken');
  // const url = Api.baseUrl1 + `customer/bot-trading/history-trade-detail/`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAIAutoManualDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/crypto-default-ai-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAIAutoManualDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/dashboard/crypto-default-ai-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCustomerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/customer-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCustomerDetailsDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/active-package/user-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetLastPriceDataApi = async () => {
  const url = 'https://fapi.binance.com/fapi/v1/premiumIndex';
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotBalanceApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/spot-account-details/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotTickers = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/spot-tickers/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostSpotPMSApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'api/v1/pms/spot-tradingveiw/alert/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotPMSHistoryApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/spot-pms-history-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotPMSActiveApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/spot-pms-active-trade-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminDashboardApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/dashboard/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminNotificationApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/dashboard/notifications/?type=indicator-signal-notification&page_size=100';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminSettingApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/indicator-data/setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminSettingApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/indicator-data/setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminSpotPMSHistoryApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&page=1&age_size=20';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminFilterSpotPMSHistoryApi = async filter => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&page=1&age_size=20&${filter}`;
  console.log('Get URL::::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminFilterCommonApi = async filter => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + filter;
  console.log('Get URL::::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminTickerSettingApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/indicator-data/ticker-setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminIndicatorDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/indicator-data/create-alert/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetVindexTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/vindex-symbols/?currency=DONG&exchange=ALL';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetIndiaTickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/indian-symbols/?currency=INR&exchange=ALL';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetUSATickerDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/usa-symbols/?currency=USDT&exchange=ALL';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminAnalyticsDataApi = async from => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/context/analytics/?page_for=${from}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminAnalyticsApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/context/analytics/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteAdminAnalyticsDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/context/analytics/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetWebNotificationDataApi = async from => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/context/marquee-tag/?page_for=${from}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostWebNotificationApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/context/marquee-tag/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteWebNotificationDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/context/marquee-tag/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTransactionDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'auth/wallet/transactions/?transaction_type=referral&wallet_address_null=false&is_filled=true';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onRequestTransactionDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/auth/wallet/transactions/?transaction_type=referral&wallet_address_null=false&is_filled=false';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTransactionApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/auth/wallet/transactions/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .patch(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotPMSActiveDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=taken&trade_status=pending';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostCancelActivePMSApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `super-admin/bot-trading/pms-remove-single-active-trade/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminFuturePMSHistoryApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=pms-bot&trade_status=square-off';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminFuturePMSActiveDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=pms-bot&trade_status=taken&trade_status=pending';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetWelcomeDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/context/welcome-contain-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetTutorialDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/tutorial/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostTutorialDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'auth/tutorial/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminMyBotHistoryApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=custom-webhook-bot&trade_status=square-off';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminMyBotActiveDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=custom-webhook-bot&trade_status=taken&trade_status=pending';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminAIActiveDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=ai-webhook-bot&trade_status=taken&trade_status=pending';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminAIHistoryDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/bot-trading/active-trading-bot/?bot_type=ai-webhook-bot&trade_status=square-off';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostDeleteAccountApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('get Error::', token);
  const url = Api.baseUrl1 + 'auth/deactivate/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminIndicatorAlertDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/indicator-data/ticker-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteIndicatorAlertDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    `super-admin/bot-trading/indicator-data/ticker-setting/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPutIndicatorAlertApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const url =
    Api.baseUrl1 +
    `super-admin/bot-trading/indicator-data/ticker-setting/${id}/`;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
    // axios
    //   .put(url, requestData, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then(res => resolve(res))
    //   .catch(err => reject(err));
  });
};

export const onPostPmsConfigApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('get Error::', token);
  const url = Api.baseUrl1 + 'super-admin/api/v1/pms/tradingveiw/alert/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPmsLastLeadsApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/pms-latest/last-lead/?page=1';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminTickerConfigDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/dashboard/mainwatchlist/bot-config/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotPmsLastLeadsApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/admin-spotpms-latest/last-lead/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostSpotPmsConfigApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('get Error::', token);
  const url = Api.baseUrl1 + 'super-admin/api/v1/spot-pms/tradingveiw/alert/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFutureYahooTickerApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/future-yahoo-tickers/?currency=USDT';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotYahooTickerApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token != null) {
    const url =
      Api.baseUrl1 + 'super-admin/dashboard/spot-yahoo-tickers/?currency=USDT';
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  } else {
    const url =
      Api.baseUrl1 + 'super-admin/dashboard/spot-yahoo-tickers/?currency=USDT';
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
};

export const onGetSpotPriceStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/spotprice-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAuth4hPriceStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token != null) {
    const url =
      Api.baseUrl1 + 'super-admin/bot-trading/spotprice-4h-ai-bot-status-send/';
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  } else {
    const url =
      Api.baseUrl1 + 'super-admin/bot-trading/spotprice-4h-ai-bot-status-send/';
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
};

export const onGetFavoriteAnalyticsApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/analytics-ai-to-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostFavoriteAnalyticsApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'customer/bot-trading/analytics-ai-to-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteFavoriteAnalyticsApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/analytics-ai-to-wishlist//delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostCryptoDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-default-alert-condition/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCryptoDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-default-alert-condition/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAICryptoDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAICryptoDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetVolumeCryptoApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/crypto-thirty-day-volume/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetHighLowDetailsCryptoApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/bot-trading/crypto-ohcl-detail/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDepositDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/payment/invoice-deposite/?payment_status=confirmed&payment_by=NOW_PAYMENT_GATEWAY';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetPlanDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/packages/all-available-package/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostPlanDataApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/packages/all-available-package/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPutPlanApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const url =
    Api.baseUrl1 + `super-admin/packages/all-available-package/${id}/`;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const onGetFavoriteAdminApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostFavoriteAdminApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteFavoriteAdminApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/favorite-predection-wishlist/delete/';
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostApplePayApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/payment/apple-pay/wallet-generate-invoice/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostCustomerTickerSettingApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/indicator-data/ticker-setting/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetCustomerIndicatorAlertDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'customer/bot-trading/indicator-data/ticker-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onCustomerDeleteIndicatorAlertDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `customer/bot-trading/indicator-data/ticker-setting/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onCustomerPutIndicatorAlertApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const url =
    Api.baseUrl1 + `customer/bot-trading/indicator-data/ticker-setting/${id}/`;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const onGetNotificationAlertDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/combined-alerts/?page_size=100';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetNotificationSettingDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/api/v2/combined-alerts-settings/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostNotificationSettingApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/api/v2/combined-alerts-settings/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAllUserDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'super-admin/auth/user/?page_size=100&';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUserDeleteApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `super-admin/auth/user/${id}/`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminFourDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpot4hPriceStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/spotprice-4h-ai-bot-status-send/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpot1hPriceStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/spotprice-1h-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminFourDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminOneDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition-1h/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminOneDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/api/v2/crypto-ai-new-bot-alert-condition-1h/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminCustomDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/api/v2/custom/crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminCustomDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/api/v2/custom/crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpotCustomPriceStatusApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/bot-trading/custom/spotprice-4h-ai-bot-status/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAdminTradeDefaultApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/api/v2/custom/master-crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPostAdminTradeDefaultApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    'super-admin/api/v2/custom/master-crypto-ai-new-bot-alert-condition-4h/';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onPutBannerApi = async (id, requestData) => {
  const token = await AsyncStorage.getItem('accessToken');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const url = Api.baseUrl1 + `unauth/context/company-drawer/update/${id}/`;
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: requestData,
      redirect: 'follow',
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const onTradingSetting = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + 'super-admin/dashboard/admin-crypto-default-bot-setting/';
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
