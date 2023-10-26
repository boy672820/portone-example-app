export interface IConfig {
  portone: {
    storeId: string;
    channelKey: string;
  };
}

const config: IConfig = {
  portone: {
    storeId: process.env.REACT_APP_PORTONE_STORE_ID,
    channelKey: process.env.REACT_APP_PORTONE_CHANNEL_KEY,
  },
};

export default config;
