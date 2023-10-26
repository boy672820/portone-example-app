import React, { useEffect } from 'react';
import './App.css';
import config from './config';
import * as PortOne from '@portone/browser-sdk/v2';

const paymentId = '1';

function App() {
  const [imp, setImp] = React.useState<any>(null);

  const handlePayment = () => {
    PortOne.requestPayment({
      storeId: config.portone.storeId,
      paymentId,
      channelKey: config.portone.channelKey,
      isTestChannel: true,
      totalAmount: 100,
      orderName: '테스트 주문',
      payMethod: 'CARD',
      currency: 'CURRENCY_KRW',
      pgProvider: 'PG_PROVIDER_HTML5_INICIS',
    });
  };

  const handlePaymentOld = () => {
    imp.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: 'merchant_' + new Date().getTime(),
        name: '주문명:결제테스트',
        amount: 1,
        buyer_email: 'gildong@gmail.com',
        buyer_name: '홍길동',
        buyer_tel: '010-4242-4242',
        buyer_addr: '서울특별시 강남구 신사동',
        buyer_postcode: '01181',
      },
      (response: any) => {
        console.log(response);
      }
    );
  };

  useEffect(() => {
    if ((window as any)?.IMP) {
      const IMP = (window as any).IMP;

      IMP.init(config.portone.storeCode);
      setImp(IMP);
    }

    return () => {
      if (imp) {
        setImp(null);
      }
    };
  }, []);

  return (
    <div className='App'>
      <button type='button' onClick={handlePayment}>
        결제하기
      </button>
      <button type='button' onClick={handlePaymentOld}>
        (구)결제하기
      </button>
    </div>
  );
}

export default App;
