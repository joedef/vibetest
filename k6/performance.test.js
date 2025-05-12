import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '15s', target: 10 },
    { duration: '15s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/testcases');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}