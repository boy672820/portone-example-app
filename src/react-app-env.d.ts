/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_PORTONE_STORE_ID: string;
    REACT_APP_PORTONE_CHANNEL_KEY: string;
  }
}
