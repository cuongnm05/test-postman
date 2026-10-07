import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Cấu hình kịch bản Tải (Test Scenarios & Thresholds)
export const options = {
    stages: [
        { duration: '10s', target: 20 }, // Giai đoạn 1: Tăng dần lên 20 người dùng trong 10 giây
        { duration: '20s', target: 50 }, // Giai đoạn 2: Giữ tải đỉnh 50 người dùng trong 20 giây (Flash Sale)
        { duration: '10s', target: 0 },  // Giai đoạn 3: Giảm tải về 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // Quality Gate 1: 95% request phải < 500ms
        http_req_failed: ['rate<0.05'],    // Quality Gate 2: Tỷ lệ lỗi < 5%
    },
};

const BASE_URL = 'http://localhost:3000';

// 2. Kịch bản mô phỏng hành vi 1 người dùng mua hàng
export default function () {
    // Bước 1: Người dùng xem sản phẩm
    let resProducts = http.get(`${BASE_URL}/api/products`);
    check(resProducts, {
        'GET Products status 200': (r) => r.status === 200,
        'GET Products time < 200ms': (r) => r.timings.duration < 200,
    });
    sleep(1); // Người dùng dừng 1 giây suy nghĩ

    // Bước 2: Người dùng thêm sản phẩm vào giỏ hàng
    let payloadCart = JSON.stringify({ productId: 1, quantity: 1 });
    let params = { headers: { 'Content-Type': 'application/json' } };
    let resCart = http.post(`${BASE_URL}/api/cart`, payloadCart, params);
    check(resCart, {
        'POST Cart status 200': (r) => r.status === 200,
    });
    sleep(1);

    // Bước 3: Người dùng tiến hành Thanh toán (Checkout)
    let payloadCheckout = JSON.stringify({ cartId: 'CART_12345' });
    let resCheckout = http.post(`${BASE_URL}/api/checkout`, payloadCheckout, params);
    check(resCheckout, {
        'POST Checkout status 200': (r) => r.status === 200,
    });
    sleep(1);
}