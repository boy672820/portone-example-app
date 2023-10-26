import React, { useEffect } from 'react';
import './App.css';
import config from './config';
import * as PortOne from '@portone/browser-sdk/v2';

function App() {
  const handlePayment = () => {
    PortOne.requestPayment({
      storeId: config.portone.storeId,
      paymentId: '1',
      channelKey: config.portone.channelKey,
      isTestChannel: true,
      totalAmount: 100,
      orderName: '테스트 주문',
      payMethod: 'CARD',
      currency: 'CURRENCY_KRW',
      pgProvider: 'PG_PROVIDER_HTML5_INICIS',
    });
  };

  return (
    <div className='App'>
      <button type='button' onClick={handlePayment}>
        결제하기
      </button>
    </div>
  );
}

export default App;
