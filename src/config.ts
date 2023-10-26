export interface IConfig {
  portone: {
    storeId: string;
    storeCode: string;
    channelKey: string;
  };
}

const config: IConfig = {
  portone: {
    storeId: process.env.REACT_APP_PORTONE_STORE_ID,
    storeCode: process.env.REACT_APP_PORTONE_STORE_CODE,
    channelKey: process.env.REACT_APP_PORTONE_CHANNEL_KEY,
  },
};

export default config;
