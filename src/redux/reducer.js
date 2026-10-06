export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA-SUCCESS';
export const FETCH_BALANCE_DATA_SUCCESS = 'FETCH_BALANCE_DATA_SUCCESS';
export const FETCH_SETTING_DATA = 'FETCH_SETTING_DATA';
export const FETCH_MARQUEE_DATA = 'FETCH_MARQUEE_DATA';
export const FETCH_LAST_LEAD_DATA = 'FETCH_LAST_LEAD_DATA';
export const FETCH_AUTOMANUAL_DATA = 'FETCH_AUTOMANUAL_DATA';
export const FETCH_AI_AUTOMANUAL_DATA = 'FETCH_AI_AUTOMANUAL_DATA';
export const FETCH_TICKER_DATA = 'FETCH_TICKER_DATA';
export const FETCH_BINANCE_DATA = 'FETCH_BINANCE_DATA';
export const FETCH_FAVORITE_DATA = 'FETCH_FAVORITE_DATA';
export const FETCH_NOTIFICATION_DATA = 'FETCH_NOTIFICATION_DATA';
export const FETCH_FUTURE_PRICE_DATA = 'FETCH_FUTURE_PRICE_DATA';
export const FETCH_AUTH_FUTURE_PRICE_DATA = 'FETCH_AUTH_FUTURE_PRICE_DATA';
export const FETCH_AUTH_4H_PRICE_DATA = 'FETCH_AUTH_4H_PRICE_DATA';
export const FETCH_PERCENTAGE_STATUS_DATA = 'FETCH_PERCENTAGE_STATUS_DATA';
export const FETCH_ANALYTICS_COIN_DATA = 'FETCH_ANALYTICS_COIN_DATA';
export const FETCH_BOT_LAST_LEAD_DATA = 'FETCH_BOT_LAST_LEAD_DATA';
export const PRICE_PREDICATION_DATA = 'PRICE_PREDICATION_DATA';
export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';
export const GET_MENU_LIST = 'GET_MENU_LIST';
export const GET_NOTIFICATION_LIST = 'GET_NOTIFICATION_LIST';
export const GET_HISTORY_LIST = 'GET_HISTORY_LIST';
export const GET_STATUS_HISTORY_LIST = 'GET_STATUS_HISTORY_LIST';
export const GET_PMS_HISTORY_LIST = 'GET_PMS_HISTORY_LIST';
export const GET_AI_ACTIVE_LIST = 'GET_AI_ACTIVE_LIST';
export const GET_BOT_ACTIVE_LIST = 'GET_BOT_ACTIVE_LIST';
export const GET_PMS_ACTIVE_LIST = 'GET_PMS_ACTIVE_LIST';
export const GET_SPOT_BALANCE_LIST = 'GET_SPOT_BALANCE_LIST';
export const GET_SPOT_OPEN_ORDER_LIST = 'GET_SPOT_OPEN_ORDER_LIST';
export const GET_SPOT_CLOSE_ORDER_LIST = 'GET_SPOT_CLOSE_ORDER_LIST';
export const GET_ADMIN_DASHBOARD = 'GET_ADMIN_DASHBOARD';
export const GET_ADMIN_NOTIFICATION = 'GET_ADMIN_NOTIFICATION';
export const GET_ADMIN_SETTING = 'GET_ADMIN_SETTING';
export const GET_ADMIN_SPOT_PMS_HISTORY = 'GET_ADMIN_SPOT_PMS_HISTORY';
export const GET_ADMIN_ANALYTICS_CRYPTO = 'GET_ADMIN_ANALYTICS_CRYPTO';
export const GET_ADMIN_ANALYTICS_INDIA = 'GET_ADMIN_ANALYTICS_INDIA';
export const GET_ADMIN_ANALYTICS_USA = 'GET_ADMIN_ANALYTICS_USA';
export const GET_ADMIN_ANALYTICS_VINDEX = 'GET_ADMIN_ANALYTICS_VINDEX';
export const GET_WEB_NOTIFICATION_CRYPTO = 'GET_WEB_NOTIFICATION_CRYPTO';
export const GET_WEB_NOTIFICATION_INDIA = 'GET_WEB_NOTIFICATION_INDIA';
export const GET_WEB_NOTIFICATION_USA = 'GET_WEB_NOTIFICATION_USA';
export const GET_WEB_NOTIFICATION_VINDEX = 'GET_WEB_NOTIFICATION_VINDEX';
export const GET_ADMIN_SPOT_PMS_ACTIVE = 'GET_ADMIN_SPOT_PMS_ACTIVE';
export const GET_ADMIN_FUTURE_PMS_HISTORY = 'GET_ADMIN_FUTURE_PMS_HISTORY';
export const GET_ADMIN_FUTURE_PMS_ACTIVE = 'GET_ADMIN_FUTURE_PMS_ACTIVE';
export const GET_BINANCE_API_ERROR = 'GET_BINANCE_API_ERROR';
export const GET_ADMIN_MY_BOT_HISTORY = 'GET_ADMIN_MY_BOT_HISTORY';
export const GET_ADMIN_MY_BOT_ACTIVE = 'GET_ADMIN_MY_BOT_ACTIVE';
export const GET_ADMIN_AI_HISTORY = 'GET_ADMIN_AI_HISTORY';
export const GET_ADMIN_AI_ACTIVE = 'GET_ADMIN_AI_ACTIVE';
export const GET_ADMIN_INDICATOR_ALERT = 'GET_ADMIN_INDICATOR_ALERT';
export const GET_ADMIN_PMS_LAST_LEADS = 'GET_ADMIN_PMS_LAST_LEADS';
export const GET_ADMIN_SPOT_PMS_LAST_LEADS = 'GET_ADMIN_SPOT_PMS_LAST_LEADS';
export const GET_ADMIN_FUTURE_YAHOO_TICKER = 'GET_ADMIN_FUTURE_YAHOO_TICKER';
export const GET_ADMIN_SPOT_PRICE_STATUS = 'GET_ADMIN_SPOT_PRICE_STATUS';
export const GET_SPOT_YAHOO_TICKER = 'GET_SPOT_YAHOO_TICKER';
export const GET_ADMIN_4H_SPOT_PRICE_STATUS = 'GET_ADMIN_4H_SPOT_PRICE_STATUS';
export const GET_ADMIN_1H_SPOT_PRICE_STATUS = 'GET_ADMIN_1H_SPOT_PRICE_STATUS';
export const GET_ADMIN_CUSTOM_SPOT_DATA = 'GET_ADMIN_CUSTOM_SPOT_DATA';

export const fetchUserDataSuccess = user_data => {
  return {
    type: FETCH_USER_DATA_SUCCESS,
    payload: user_data,
  };
};

export const fetchBalance = balanceData => {
  return {
    type: FETCH_BALANCE_DATA_SUCCESS,
    payload: balanceData,
  };
};

export const fetchSttingData = settingData => {
  return {
    type: FETCH_SETTING_DATA,
    payload: settingData,
  };
};

export const fetchMarqueeData = marqueeData => {
  return {
    type: FETCH_MARQUEE_DATA,
    payload: marqueeData,
  };
};

export const fetchLastLeadData = lastLeadData => {
  return {
    type: FETCH_LAST_LEAD_DATA,
    payload: lastLeadData,
  };
};

export const fetchAutoManualData = autoManualData => {
  return {
    type: FETCH_AUTOMANUAL_DATA,
    payload: autoManualData,
  };
};

export const fetchAIAutoManualData = aiAutoManualData => {
  return {
    type: FETCH_AI_AUTOMANUAL_DATA,
    payload: aiAutoManualData,
  };
};

export const fetchTickerData = tickerData => {
  return {
    type: FETCH_TICKER_DATA,
    payload: tickerData,
  };
};

export const fetchBinanceData = tickerData => {
  return {
    type: FETCH_BINANCE_DATA,
    payload: tickerData,
  };
};

export const fetchFavoriteData = favoriteData => {
  return {
    type: FETCH_FAVORITE_DATA,
    payload: favoriteData,
  };
};

export const fetchNotificationData = notificationData => {
  return {
    type: FETCH_NOTIFICATION_DATA,
    payload: notificationData,
  };
};

export const fetchFuturePriceData = futurePriceData => {
  return {
    type: FETCH_FUTURE_PRICE_DATA,
    payload: futurePriceData,
  };
};

export const fetchAuthFuturePriceData = authFuturePriceData => {
  return {
    type: FETCH_AUTH_FUTURE_PRICE_DATA,
    payload: authFuturePriceData,
  };
};

export const fetchAuth4hPriceData = auth4hPriceData => {
  return {
    type: FETCH_AUTH_4H_PRICE_DATA,
    payload: auth4hPriceData,
  };
};

export const fetchPercentageStatusData = percentageStatusData => {
  return {
    type: FETCH_PERCENTAGE_STATUS_DATA,
    payload: percentageStatusData,
  };
};

export const fetchAnalyticsData = analyticsCoinData => {
  return {
    type: FETCH_ANALYTICS_COIN_DATA,
    payload: analyticsCoinData,
  };
};

export const fetchBotLeadData = botLastLeadData => {
  return {
    type: FETCH_BOT_LAST_LEAD_DATA,
    payload: botLastLeadData,
  };
};

export const fetchPricePredicationData = pricePredicationData => {
  return {
    type: PRICE_PREDICATION_DATA,
    payload: pricePredicationData,
  };
};

export const fetchNotificationCount = notificationCount => {
  return {
    type: NOTIFICATION_COUNT,
    payload: notificationCount,
  };
};

export const fetchMenuList = getMenuList => {
  return {
    type: GET_MENU_LIST,
    payload: getMenuList,
  };
};

export const fetchNotificationList = getNotificationList => {
  return {
    type: GET_NOTIFICATION_LIST,
    payload: getNotificationList,
  };
};

export const fetchHistoryList = getHistoryList => {
  return {
    type: GET_HISTORY_LIST,
    payload: getHistoryList,
  };
};

export const fetchAIStatusHistoryList = getAIStatusHistoryList => {
  return {
    type: GET_STATUS_HISTORY_LIST,
    payload: getAIStatusHistoryList,
  };
};

export const fetchPMSHistoryList = getPMSHistoryList => {
  return {
    type: GET_PMS_HISTORY_LIST,
    payload: getPMSHistoryList,
  };
};

export const fetchAIActiveList = getAIActiveList => {
  return {
    type: GET_AI_ACTIVE_LIST,
    payload: getAIActiveList,
  };
};

export const fetchBotActiveList = getBotActiveList => {
  return {
    type: GET_BOT_ACTIVE_LIST,
    payload: getBotActiveList,
  };
};

export const fetchPmsActiveList = getPmsActiveList => {
  return {
    type: GET_PMS_ACTIVE_LIST,
    payload: getPmsActiveList,
  };
};

export const fetchSpotBalanceList = getSpotBalanceList => {
  return {
    type: GET_SPOT_BALANCE_LIST,
    payload: getSpotBalanceList,
  };
};

export const fetchSpotOpenOrderList = getSpotOpenOrderList => {
  return {
    type: GET_SPOT_OPEN_ORDER_LIST,
    payload: getSpotOpenOrderList,
  };
};

export const fetchSpotCloseOrderList = getSpotCloseOrderList => {
  return {
    type: GET_SPOT_CLOSE_ORDER_LIST,
    payload: getSpotCloseOrderList,
  };
};

export const fetchAdminDashboardList = getAdminDashboardList => {
  return {
    type: GET_ADMIN_DASHBOARD,
    payload: getAdminDashboardList,
  };
};

export const fetchAdminNotificationList = getAdminNotificationList => {
  return {
    type: GET_ADMIN_NOTIFICATION,
    payload: getAdminNotificationList,
  };
};

export const fetchAdminSettingList = getAdminSettingList => {
  return {
    type: GET_ADMIN_SETTING,
    payload: getAdminSettingList,
  };
};

export const fetchAdminSpotSpmHistoryList = getAdminSpotSpmHistory => {
  return {
    type: GET_ADMIN_SPOT_PMS_HISTORY,
    payload: getAdminSpotSpmHistory,
  };
};

export const fetchAdminAnalyticsCryptoList = getAdminAnalyticsCrypto => {
  return {
    type: GET_ADMIN_ANALYTICS_CRYPTO,
    payload: getAdminAnalyticsCrypto,
  };
};

export const fetchAdminAnalyticsIndiaList = getAdminAnalyticsIndia => {
  return {
    type: GET_ADMIN_ANALYTICS_INDIA,
    payload: getAdminAnalyticsIndia,
  };
};

export const fetchAdminAnalyticsUsaList = getAdminAnalyticsUsa => {
  return {
    type: GET_ADMIN_ANALYTICS_USA,
    payload: getAdminAnalyticsUsa,
  };
};

export const fetchAdminAnalyticsVindexList = getAdminAnalyticsVindex => {
  return {
    type: GET_ADMIN_ANALYTICS_VINDEX,
    payload: getAdminAnalyticsVindex,
  };
};

export const fetchAdminWebNotificationCryptoList = getWebNotificationCrypto => {
  return {
    type: GET_WEB_NOTIFICATION_CRYPTO,
    payload: getWebNotificationCrypto,
  };
};

export const fetchAdminWebNotificationIndiaList = getWebNotificationIndia => {
  return {
    type: GET_WEB_NOTIFICATION_INDIA,
    payload: getWebNotificationIndia,
  };
};

export const fetchAdminWebNotificationUsaList = getWebNotificationUsa => {
  return {
    type: GET_WEB_NOTIFICATION_USA,
    payload: getWebNotificationUsa,
  };
};

export const fetchAdminWebNotificationVindexList = getWebNotificationVindex => {
  return {
    type: GET_WEB_NOTIFICATION_VINDEX,
    payload: getWebNotificationVindex,
  };
};

export const fetchAdminSpotSpmActiveList = getAdminSpotSpmActive => {
  return {
    type: GET_ADMIN_SPOT_PMS_ACTIVE,
    payload: getAdminSpotSpmActive,
  };
};

export const fetchAdminFuturePmsHistoryList = getAdminFuturePmsHistory => {
  return {
    type: GET_ADMIN_FUTURE_PMS_HISTORY,
    payload: getAdminFuturePmsHistory,
  };
};

export const fetchAdminFuturePmsActiveList = getAdminFuturePmsActive => {
  return {
    type: GET_ADMIN_FUTURE_PMS_ACTIVE,
    payload: getAdminFuturePmsActive,
  };
};

export const fetchBinanceApiError = getBinanceApiError => {
  return {
    type: GET_BINANCE_API_ERROR,
    payload: getBinanceApiError,
  };
};

export const fetchAdminMyBotHistoryList = getAdminMyBotHistory => {
  return {
    type: GET_ADMIN_MY_BOT_HISTORY,
    payload: getAdminMyBotHistory,
  };
};

export const fetchAdminMyBotActiveList = getAdminMyBotActive => {
  return {
    type: GET_ADMIN_MY_BOT_ACTIVE,
    payload: getAdminMyBotActive,
  };
};

export const fetchAdminAIHistoryList = getAdminAIHistory => {
  return {
    type: GET_ADMIN_AI_HISTORY,
    payload: getAdminAIHistory,
  };
};

export const fetchAdminAIActiveList = getAdminAIActive => {
  return {
    type: GET_ADMIN_AI_ACTIVE,
    payload: getAdminAIActive,
  };
};

export const fetchAdminIndicatorAlertList = getAdminIndicatorAlert => {
  return {
    type: GET_ADMIN_INDICATOR_ALERT,
    payload: getAdminIndicatorAlert,
  };
};

export const fetchAdminPmsLastLead = getAdminPmsLastLead => {
  return {
    type: GET_ADMIN_PMS_LAST_LEADS,
    payload: getAdminPmsLastLead,
  };
};

export const fetchAdminSpotPmsLastLead = getAdminSpotPmsLastLead => {
  return {
    type: GET_ADMIN_SPOT_PMS_LAST_LEADS,
    payload: getAdminSpotPmsLastLead,
  };
};

export const fetchAdminFutureYahooTicker = getAdminFutureYahooTicker => {
  return {
    type: GET_ADMIN_FUTURE_YAHOO_TICKER,
    payload: getAdminFutureYahooTicker,
  };
};

export const fetchAdminSpotPriceStatus = getAdminSpotPriceStatus => {
  return {
    type: GET_ADMIN_SPOT_PRICE_STATUS,
    payload: getAdminSpotPriceStatus,
  };
};

export const fetchAdmin4hSpotPriceStatus = getAdmin4hSpotPriceStatus => {
  return {
    type: GET_ADMIN_4H_SPOT_PRICE_STATUS,
    payload: getAdmin4hSpotPriceStatus,
  };
};

export const fetchAdmin1hSpotPriceStatus = getAdmin1hSpotPriceStatus => {
  return {
    type: GET_ADMIN_1H_SPOT_PRICE_STATUS,
    payload: getAdmin1hSpotPriceStatus,
  };
};

export const fetchSpotYahooTicker = getSpotYahooTicker => {
  return {
    type: GET_SPOT_YAHOO_TICKER,
    payload: getSpotYahooTicker,
  };
};

export const fetchAdminCustomPrice = getAdminCustomPrice => {
  return {
    type: GET_ADMIN_CUSTOM_SPOT_DATA,
    payload: getAdminCustomPrice,
  };
};

// Initial State
const initialState = {
  user_data: null,
  balanceData: null,
  settingData: null,
  marqueeData: [],
  lastLeadData: [],
  autoManualData: null,
  aiAutoManualData: null,
  tickerData: [],
  binanceData: [],
  favoriteData: [],
  notificationData: [],
  futurePriceData: [],
  authFuturePriceData: [],
  percentageStatusData: [],
  analyticsCoinData: [],
  botLastLeadData: [],
  pricePredicationData: [],
  notificationCount: 0,
  getMenuList: [],
  getNotificationList: [],
  getHistoryList: [],
  getAIStatusHistoryList: [],
  getPMSHistoryList: [],
  getAIActiveList: [],
  getBotActiveList: [],
  getPmsActiveList: [],
  getSpotBalanceList: [],
  getSpotOpenOrderList: [],
  getSpotCloseOrderList: [],
  auth4hPriceData: [],
  getAdminDashboardList: [],
  getAdminNotificationList: [],
  getAdminSettingList: null,
  getAdminSpotSpmHistory: [],
  getAdminAnalyticsCrypto: [],
  getAdminAnalyticsIndia: [],
  getAdminAnalyticsUsa: [],
  getAdminAnalyticsVindex: [],
  getWebNotificationCrypto: [],
  getWebNotificationIndia: [],
  getWebNotificationUsa: [],
  getWebNotificationVindex: [],
  getAdminSpotSpmActive: [],
  getAdminFuturePmsHistory: [],
  getAdminFuturePmsActive: [],
  getBinanceApiError: '',
  getAdminMyBotHistory: [],
  getAdminMyBotActive: [],
  getAdminAIActive: [],
  getAdminAIHistory: [],
  getAdminIndicatorAlert: [],
  getAdminPmsLastLead: [],
  getAdminSpotPmsLastLead: [],
  getAdminFutureYahooTicker: [],
  getAdminSpotPriceStatus: [],
  getSpotYahooTicker: [],
  getAdmin4hSpotPriceStatus: [],
  getAdmin1hSpotPriceStatus: [],
  getAdminCustomPrice: [],
};

// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        user_data: action.payload,
      };
    case FETCH_BALANCE_DATA_SUCCESS:
      return {
        ...state,
        balanceData: action.payload,
      };
    case FETCH_SETTING_DATA:
      return {
        ...state,
        settingData: action.payload,
      };
    case FETCH_MARQUEE_DATA:
      return {
        ...state,
        marqueeData: action.payload,
      };
    case FETCH_LAST_LEAD_DATA:
      return {
        ...state,
        lastLeadData: action.payload,
      };
    case FETCH_AUTOMANUAL_DATA:
      return {
        ...state,
        autoManualData: action.payload,
      };
    case FETCH_AI_AUTOMANUAL_DATA:
      return {
        ...state,
        aiAutoManualData: action.payload,
      };
    case FETCH_TICKER_DATA:
      return {
        ...state,
        tickerData: action.payload,
      };
    case FETCH_BINANCE_DATA:
      return {
        ...state,
        binanceData: action.payload,
      };
    case FETCH_FAVORITE_DATA:
      return {
        ...state,
        favoriteData: action.payload,
      };
    case FETCH_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
    case FETCH_FUTURE_PRICE_DATA:
      return {
        ...state,
        futurePriceData: action.payload,
      };
    case FETCH_AUTH_FUTURE_PRICE_DATA:
      return {
        ...state,
        authFuturePriceData: action.payload,
      };
    case FETCH_AUTH_4H_PRICE_DATA:
      return {
        ...state,
        auth4hPriceData: action.payload,
      };
    case FETCH_PERCENTAGE_STATUS_DATA:
      return {
        ...state,
        percentageStatusData: action.payload,
      };
    case FETCH_ANALYTICS_COIN_DATA:
      return {
        ...state,
        analyticsCoinData: action.payload,
      };
    case FETCH_BOT_LAST_LEAD_DATA:
      return {
        ...state,
        botLastLeadData: action.payload,
      };
    case PRICE_PREDICATION_DATA:
      return {
        ...state,
        pricePredicationData: action.payload,
      };
    case NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.payload,
      };
    case GET_MENU_LIST:
      return {
        ...state,
        getMenuList: action.payload,
      };
    case GET_NOTIFICATION_LIST:
      return {
        ...state,
        getNotificationList: action.payload,
      };
    case GET_HISTORY_LIST:
      return {
        ...state,
        getHistoryList: action.payload,
      };
    case GET_STATUS_HISTORY_LIST:
      return {
        ...state,
        getAIStatusHistoryList: action.payload,
      };
    case GET_PMS_HISTORY_LIST:
      return {
        ...state,
        getPMSHistoryList: action.payload,
      };
    case GET_AI_ACTIVE_LIST:
      return {
        ...state,
        getAIActiveList: action.payload,
      };
    case GET_BOT_ACTIVE_LIST:
      return {
        ...state,
        getBotActiveList: action.payload,
      };
    case GET_PMS_ACTIVE_LIST:
      return {
        ...state,
        getPmsActiveList: action.payload,
      };
    case GET_SPOT_BALANCE_LIST:
      return {
        ...state,
        getSpotBalanceList: action.payload,
      };
    case GET_SPOT_OPEN_ORDER_LIST:
      return {
        ...state,
        getSpotOpenOrderList: action.payload,
      };
    case GET_SPOT_CLOSE_ORDER_LIST:
      return {
        ...state,
        getSpotCloseOrderList: action.payload,
      };
    case GET_ADMIN_DASHBOARD:
      return {
        ...state,
        getAdminDashboardList: action.payload,
      };
    case GET_ADMIN_NOTIFICATION:
      return {
        ...state,
        getAdminNotificationList: action.payload,
      };
    case GET_ADMIN_SETTING:
      return {
        ...state,
        getAdminSettingList: action.payload,
      };
    case GET_ADMIN_SPOT_PMS_HISTORY:
      return {
        ...state,
        getAdminSpotSpmHistory: action.payload,
      };
    case GET_ADMIN_ANALYTICS_CRYPTO:
      return {
        ...state,
        getAdminAnalyticsCrypto: action.payload,
      };
    case GET_ADMIN_ANALYTICS_INDIA:
      return {
        ...state,
        getAdminAnalyticsIndia: action.payload,
      };
    case GET_ADMIN_ANALYTICS_USA:
      return {
        ...state,
        getAdminAnalyticsUsa: action.payload,
      };
    case GET_ADMIN_ANALYTICS_VINDEX:
      return {
        ...state,
        getAdminAnalyticsVindex: action.payload,
      };
    case GET_WEB_NOTIFICATION_CRYPTO:
      return {
        ...state,
        getWebNotificationCrypto: action.payload,
      };
    case GET_WEB_NOTIFICATION_INDIA:
      return {
        ...state,
        getWebNotificationIndia: action.payload,
      };
    case GET_WEB_NOTIFICATION_USA:
      return {
        ...state,
        getWebNotificationUsa: action.payload,
      };
    case GET_WEB_NOTIFICATION_VINDEX:
      return {
        ...state,
        getWebNotificationVindex: action.payload,
      };
    case GET_ADMIN_SPOT_PMS_ACTIVE:
      return {
        ...state,
        getAdminSpotSpmActive: action.payload,
      };
    case GET_ADMIN_FUTURE_PMS_HISTORY:
      return {
        ...state,
        getAdminFuturePmsHistory: action.payload,
      };
    case GET_ADMIN_FUTURE_PMS_ACTIVE:
      return {
        ...state,
        getAdminFuturePmsActive: action.payload,
      };
    case GET_BINANCE_API_ERROR:
      return {
        ...state,
        getBinanceApiError: action.payload,
      };
    case GET_ADMIN_MY_BOT_HISTORY:
      return {
        ...state,
        getAdminMyBotHistory: action.payload,
      };
    case GET_ADMIN_MY_BOT_ACTIVE:
      return {
        ...state,
        getAdminMyBotActive: action.payload,
      };
    case GET_ADMIN_AI_HISTORY:
      return {
        ...state,
        getAdminAIHistory: action.payload,
      };
    case GET_ADMIN_AI_ACTIVE:
      return {
        ...state,
        getAdminAIActive: action.payload,
      };
    case GET_ADMIN_INDICATOR_ALERT:
      return {
        ...state,
        getAdminIndicatorAlert: action.payload,
      };
    case GET_ADMIN_PMS_LAST_LEADS:
      return {
        ...state,
        getAdminPmsLastLead: action.payload,
      };
    case GET_ADMIN_SPOT_PMS_LAST_LEADS:
      return {
        ...state,
        getAdminSpotPmsLastLead: action.payload,
      };
    case GET_ADMIN_FUTURE_YAHOO_TICKER:
      return {
        ...state,
        getAdminFutureYahooTicker: action.payload,
      };
    case GET_ADMIN_SPOT_PRICE_STATUS:
      return {
        ...state,
        getAdminSpotPriceStatus: action.payload,
      };
    case GET_ADMIN_4H_SPOT_PRICE_STATUS:
      return {
        ...state,
        getAdmin4hSpotPriceStatus: action.payload,
      };
    case GET_ADMIN_1H_SPOT_PRICE_STATUS:
      return {
        ...state,
        getAdmin1hSpotPriceStatus: action.payload,
      };
    case GET_SPOT_YAHOO_TICKER:
      return {
        ...state,
        getSpotYahooTicker: action.payload,
      };
    case GET_ADMIN_CUSTOM_SPOT_DATA:
      return {
        ...state,
        getAdminCustomPrice: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
