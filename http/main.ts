import http from 'http';
import axios from 'axios';
import { ulid } from 'ulid';
import 'dotenv/config';

interface IConfig {
  apiKey: string;
  secret: string;
}

export const config: IConfig = {
  apiKey: process.env.PORTONE_API_KEY as string,
  secret: process.env.PORTONE_SECRET as string,
};

const axiosInstance = axios.create({
  baseURL: 'https://api.iamport.kr',
});

async function getHttpInstance() {
  try {
    const response = await axiosInstance.post('/users/getToken', {
      imp_key: config.apiKey,
      imp_secret: config.secret,
    });

    const accessToken = response.data.response.access_token;

    if (!accessToken) {
      throw new Error('토큰 발급에 실패했습니다.');
    }

    axiosInstance.defaults.headers.common['Authorization'] =
      'Bearer ' + accessToken;

    return axiosInstance;
  } catch (e) {
    throw new Error('토큰 발급에 실패했습니다. 서버를 재시작 해주세요.');
  }
}

export async function main() {
  const axios = await getHttpInstance();

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.url === '/payments/prepare' && req.method === 'POST') {
      req.on('data', (buffer: Buffer) => {
        const data = JSON.parse(buffer.toString());

        if (typeof data?.amount !== 'number') {
          res.statusCode = 400;
          res.end('Bad Request');
          return;
        }

        axios
          .post('/payments/prepare', {
            merchant_uid: ulid(),
            amount: data.amount,
          })
          .then(({ data }) => {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                orderId: data.response.merchant_uid,
                amount: data.response.amount,
              })
            );
          })
          .catch((e) => {
            console.error('에러 발생', e);
            res.writeHead(500);
            res.end('Internal Server Error');
          });
      });
    }

    if (req.url === '/payments/complete' && req.method === 'POST') {
      req.on('data', (buffer: Buffer) => {
        const data = JSON.parse(buffer.toString());

        if (
          typeof data?.orderId !== 'string' ||
          typeof data?.paymentId !== 'string'
        ) {
          res.statusCode = 400;
          res.end('Bad Request');
          return;
        }

        axios
          .get(`/payments/${data.paymentId}`)
          .then((response) => {
            if (response.data.response.merchant_uid !== data.orderId) {
              res.statusCode = 403;
              res.end('잘못된 결제 정보입니다.');
              return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response.data));
          })
          .catch((e) => {
            console.error('에러 발생', e);
            res.writeHead(500);
            res.end('Internal Server Error');
          });
      });
    }
  });

  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
}

main()
  .then(() => {
    console.log('Server is ready');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
