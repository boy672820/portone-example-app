import React, { useEffect } from 'react';
import './App.css';
import config from './config';
import axiosInstance from './utils/axios';

function App() {
  const [imp, setImp] = React.useState<any>(null);
  const [amount, setAmount] = React.useState<number>(1);
  const [paymentResult, setPaymentResult] = React.useState<any>(null);
  const [uid, setUid] = React.useState<string>('');

  const handlePreRequest = async () => {
    const response = await axiosInstance.post('/payments/prepare', { amount });
    setUid(response.data.merchant_uid);
  };

  const handleRequest = async () => {
    if (!imp) {
      alert('"1. 결제 사전 검증"을 먼저 진행 해주세요.');
      return;
    }

    imp.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: uid,
        name: '주문명:결제테스트',
        amount: 1,
        buyer_email: 'gildong@gmail.com',
        buyer_name: '홍길동',
        buyer_tel: '010-4242-4242',
        buyer_addr: '서울특별시 강남구 신사동',
        buyer_postcode: '01181',
      },
      (response: any) => {
        setPaymentResult(response.imp_uid);
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
      <div>
        <p>결제금액 설정하기</p>
        <input
          type='text'
          placeholder='결제금액'
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
          value={amount}
        />
      </div>
      <hr />
      <div>
        <button type='button' onClick={handlePreRequest}>
          1. 결제 사전 검증
        </button>
        <button type='button' onClick={handleRequest}>
          2. 결제 요청하기(v1)
        </button>
      </div>
      <div>
        <table>
          <tr>
            <th>merchant_uid</th>
            <td>{uid || '"1. 결제 사전 검증"을 진행 해주세요.'}</td>
          </tr>
          <tr>
            <th>imp_uid</th>
            <td>{paymentResult || '결제 대기 중'}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default App;
