import React, { useEffect } from 'react';
import './App.css';
import config from './config';
import axiosInstance from './utils/axios';

interface Order {
  amount: number;
  apply_num: string;
  buyer_addr: string;
  buyer_email: string;
  buyer_name: string;
  buyer_postcode: string;
  buyer_tel: string;
  card_name: string;
  card_number: string;
  currency: string;
  name: string;
  paid_at: number;
  pay_method: string;
}

function App() {
  const [imp, setImp] = React.useState<any>('null');
  const [amount, setAmount] = React.useState<number>(1);
  const [paymentId, setPaymentId] = React.useState<any>('imp_393569662428');
  const [orderId, setOrderId] = React.useState<string>(
    '01HDZSAES2ED2TME002R023F75'
  );
  const [order, setOrder] = React.useState<Order | null>(null);

  const handlePreRequest = async () => {
    const response = await axiosInstance.post('/payments/prepare', { amount });
    setOrderId(response.data.orderId);
  };

  const handleRequest = async () => {
    if (!imp || !orderId) {
      alert('"1. 결제 사전 검증"을 먼저 진행 해주세요.');
      return;
    }

    imp.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: orderId,
        name: '주문명:결제테스트',
        amount: 1,
        buyer_email: 'gildong@gmail.com',
        buyer_name: '홍길동',
        buyer_tel: '010-4242-4242',
        buyer_addr: '서울특별시 강남구 신사동',
        buyer_postcode: '01181',
      },
      (response: any) => {
        setPaymentId(response.imp_uid);
      }
    );
  };

  const handleComplete = async () => {
    if (!orderId || !paymentId) {
      alert('이전 단계를 진행해주세요.');
      return;
    }

    try {
      const { data } = await axiosInstance.post('/payments/complete', {
        orderId,
        paymentId,
      });

      setOrder(data.response);
    } catch (e: any) {
      if (e.response.status === 403) {
        alert('잘못된 결제 정보입니다. 주문번호 또는 결제 금액이 다릅니다.');
      } else {
        alert('알 수 없는 에러가 발생했습니다.');
      }
    }
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
        <div>
          <button type='button' onClick={handlePreRequest}>
            1. 결제 사전 검증
          </button>
          <p>
            결제 가격을 정합니다. <br />
            정해진 가격으로 결제를 진행할 예정이기 때문에, <br />
            결제 전 결제할 금액을 서버로 미리 전달해야 합니다.(미리 결제 내역을
            검증하는 과정)
          </p>
        </div>
        <div>
          <button type='button' onClick={handleRequest}>
            2. 결제 요청하기(포트원 라이브러리 v1)
          </button>
          <p>
            사전에 검증 받은 결제 금액으로 포트원 라이브러리를 통한 결제를
            진행합니다. <br />
            결제 요청을 하기 위해서는{' '}
            <b>주문번호(merchant_uid)와 결제 고유번호(imp_uid)</b>가 필요합니다.
            <br />*
            <b>
              <i>주문번호</i>
            </b>
            는 서버에서 생성한 무결성이 보장되는 고유한 값이어야 합니다.
            <br />*
            <b>
              <i>결제 고유번호</i>
            </b>
            는 포트원 API에서 지급하는 고유한 값입니다.
          </p>
        </div>
      </div>
      <div>
        <button type='button' onClick={handleComplete}>
          3. 결제 완료하기
        </button>
        <p>
          요청 결과로 받은 결제 주문번호와 고유번호를 서버로 전달합니다. <br />
          이를 통해 서버에서 결제 완료 처리를 진행해야 합니다.
        </p>
      </div>

      <hr />

      <h3>결제 정보</h3>
      <div>
        <table>
          <tbody>
            <tr>
              <th>주문번호(merchant_uid)</th>
              <td>
                <input
                  type='text'
                  value={orderId || ''}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>결제 고유번호(imp_uid)</th>
              <td>
                <input
                  type='text'
                  value={paymentId || ''}
                  onChange={(e) => setPaymentId(e.target.value)}
                />
              </td>
            </tr>
            {order && (
              <>
                <tr>
                  <th>결제 방법</th>
                  <td>{order.pay_method}</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>{order.buyer_addr}</td>
                </tr>
                <tr>
                  <th>이름</th>
                  <td>{order.buyer_name}</td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td>{order.buyer_email}</td>
                </tr>
                <tr>
                  <th>전화번호</th>
                  <td>{order.buyer_tel}</td>
                </tr>
                <tr>
                  <th>결제 카드정보</th>
                  <td>
                    ({order.card_name}) {order.card_number}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
