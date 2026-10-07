import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '10s', target: 20 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';
  const params = { headers: { 'Content-Type': 'application/json' } };

  // 1. GET Products
  const resProducts = http.get(`${BASE_URL}/api/products`);
  check(resProducts, { 'GET Products status 200': (r) => r.status === 200 });

  // 2. POST Cart
  const cartPayload = JSON.stringify({ productId: 1, quantity: 2 });
  const resCart = http.post(`${BASE_URL}/api/cart`, cartPayload, params);
  check(resCart, { 'POST Cart status 200': (r) => r.status === 200 });

  // 3. POST Checkout (Bổ sung đầy đủ customerName và address hợp lệ)
  const checkoutPayload = JSON.stringify({
    cartId: 'CART_ACTIVE',
    customerName: 'Nguyen Van A',
    address: 'Hanoi, Vietnam'
  });
  const resCheckout = http.post(`${BASE_URL}/api/checkout`, checkoutPayload, params);
  check(resCheckout, { 'POST Checkout status 200': (r) => r.status === 200 });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}