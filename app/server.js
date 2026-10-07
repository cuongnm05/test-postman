const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/products', (req, res) => {
    setTimeout(() => {
        res.status(200).json([
            { id: 1, name: "Laptop Dell XPS 15", price: 1500 },
            { id: 2, name: "iPhone 15 Pro Max", price: 1200 },
            { id: 3, name: "Tai nghe Sony WH-1000XM5", price: 350 }
        ]);
    }, 50);
});

app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Thông tin giỏ hàng không hợp lệ" });
    }
    setTimeout(() => {
        res.status(200).json({ message: "Đã thêm vào giỏ hàng", cartId: "CART_ACTIVE" });
    }, 50);
});

app.post('/api/checkout', (req, res) => {
    const { cartId, customerName, address } = req.body;
    
    // Boundary & Input Validation
    if (!customerName || customerName.length < 2) {
        return res.status(400).json({ error: "Tên khách hàng phải từ 2 ký tự trở lên" });
    }
    if (!address) {
        return res.status(400).json({ error: "Địa chỉ không được để trống" });
    }

    setTimeout(() => {
        res.status(200).json({ message: "Đặt hàng thành công!", orderId: "ORD_" + Date.now() });
    }, 150);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server E-Commerce running on http://localhost:${PORT}`);
});