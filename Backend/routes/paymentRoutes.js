const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const querystring = require('qs');
const dayjs = require('dayjs');
const Booking = require("../models/Booking");

router.post("/create-payment-url", async (req, res) => {
    const { bookingId, paymentMethod } = req.body;

    try {
        // 1. Lấy thông tin booking và kiểm tra
        const booking = await Booking.findById(bookingId)
            .populate('movieId', 'title')
            .populate('combos.comboId', 'name'); // ✅ Lấy thêm tên của combo
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt vé." });
        }
        if (booking.status !== 'pending' || booking.expireAt < new Date()) {
            return res.status(410).json({ message: "Thời gian giữ ghế đã hết hạn. Vui lòng chọn lại." });
        }

        const amount = booking.totalPrice;
        const movieTitle = booking.movieId.title;

        let payUrl = '';
        const orderId = booking._id.toString();
        let qrCodeUrl = '';
        // ✅ Làm sạch orderInfo để tránh lỗi với các cổng thanh toán
        const orderInfo = `Thanh toan ve xem phim ${movieTitle}`
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");

        const redirectUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment-success` : 'http://localhost:3000/payment-success';

        if (paymentMethod === 'momo') {
            // ✅ Kiểm tra các biến môi trường MoMo
            const partnerCode = process.env.MOMO_PARTNER_CODE;
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretKey = process.env.MOMO_SECRET_KEY;
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

            // Kiểm tra cấu hình
            if (!partnerCode || !accessKey || !secretKey) {
                console.error("❌ Thiếu thông tin cấu hình MoMo trong file .env");
                return res.status(500).json({
                    message: "Lỗi cấu hình hệ thống thanh toán."
                });
            }

            const ipnUrl = `${backendUrl}/api/payments/momo-ipn`;
            const requestId = orderId + "_" + Date.now();
            const amountStr = String(amount);
            const momoOrderInfo = "Thanh toan ve xem phim QieQie"; // MoMo yêu cầu chuỗi đơn giản
            const requestType = "payWithQR"; // Yêu cầu QR code để hiển thị trên web
            const extraData = "";

            // ✅ MoMo yêu cầu rawSignature đúng thứ tự alphabet
            const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${momoOrderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            const signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature, 'utf8')
                .digest('hex');

            // ✅ Request body theo cấu trúc chuẩn của MoMo
            const requestBody = {
                partnerCode: partnerCode,
                partnerName: "QieQie Cinema", // Tên hiển thị cho người dùng
                storeId: "QieQieStore",       // Mã cửa hàng của bạn
                requestId: requestId,
                amount: amount, // ✅ SỬA LỖI: MoMo API v2 yêu cầu amount là NUMBER trong body
                orderId: orderId,
                orderInfo: momoOrderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: 'vi',
                extraData: extraData,
                requestType: requestType,
                signature: signature
            };

            console.log("🔍 Final MoMo Request Body:", JSON.stringify(requestBody, null, 2));

            try {
                const momoResponse = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const momoResult = await momoResponse.json();
                console.log("✅ MoMo Parsed Response:", JSON.stringify(momoResult, null, 2));

                if (momoResult.resultCode !== 0) {
                    return res.status(400).json({
                        message: `MoMo Error [${momoResult.resultCode}]: ${momoResult.message}`
                    });
                }

                payUrl = momoResult.payUrl;
                qrCodeUrl = momoResult.qrCodeUrl;

                if (!payUrl || !qrCodeUrl) {
                    console.error("❌ MoMo không trả về đủ URL cho payWithQR:", momoResult);
                    return res.status(500).json({ message: "MoMo không trả về URL thanh toán hoặc QR Code." });
                }

            } catch (fetchError) {
                console.error("❌ Lỗi khi gọi MoMo API:", fetchError);
                return res.status(500).json({ message: "Lỗi kết nối tới máy chủ MoMo." });
            }

        } else if (paymentMethod === 'zalopay') {
            const appId = process.env.ZALOPAY_APP_ID;
            const key1 = process.env.ZALOPAY_KEY1;
            const endpoint = "https://sb-openapi.zalopay.vn/v2/create"; // ✅ Sử dụng endpoint v2
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

            if (!appId || !key1) {
                console.error("❌ Thiếu thông tin cấu hình ZaloPay trong file .env");
                return res.status(500).json({ message: "Lỗi cấu hình hệ thống thanh toán ZaloPay." });
            }

            const embed_data = { redirecturl: redirectUrl };
            // ✅ Sửa lại tên trường theo chuẩn v2
            const items = [{ item_id: booking.movieId._id, item_name: movieTitle, item_price: booking.totalPrice, item_quantity: 1 }];
            const appTransId = `${dayjs().format('YYMMDD')}_${orderId}`;
            const appTime = Date.now();
            const appUser = `user_${booking.userId || 'guest'}`;

            const orderData = {
                app_id: parseInt(appId),
                app_trans_id: appTransId, // Mã giao dịch của app
                app_user: appUser, // Mã khách hàng
                app_time: appTime, // Thời gian tạo đơn hàng
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: amount,
                description: orderInfo,
                bank_code: "", // Để trống để hiển thị tất cả
                callback_url: `${backendUrl}/api/payments/zalopay-callback` // URL ZaloPay sẽ gọi lại
            };

            // ✅ Tạo MAC theo chuẩn v2
            const macData = `${orderData.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
            orderData.mac = crypto.createHmac('sha256', key1).update(macData).digest('hex');

            try {
                const zaloResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // ✅ v2 dùng JSON
                    body: JSON.stringify(orderData) // ✅ v2 dùng JSON
                });

                const zaloResult = await zaloResponse.json();

                if (zaloResult.return_code !== 1) { // 1 là thành công
                    console.error("❌ ZaloPay Error:", zaloResult);
                    return res.status(400).json({ message: `ZaloPay Error: ${zaloResult.return_message}` });
                }

                payUrl = zaloResult.order_url; // Link để chuyển hướng
                qrCodeUrl = zaloResult.order_url; // Link để tạo QR code

            } catch (error) {
                console.error("❌ Lỗi khi gọi ZaloPay API:", error);
                return res.status(500).json({ message: "Không thể kết nối ZaloPay. Vui lòng thử lại." });
            }

        } else if (paymentMethod === 'vnpay') {
            const ipnUrl = `${process.env.BACKEND_URL}/api/payments/vnpay-ipn`;
            process.env.TZ = 'Asia/Ho_Chi_Minh';
            const createDate = dayjs().format('YYYYMMDDHHmmss');
            const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

            const tmnCode = process.env.VNP_TMNCODE;
            const secretKey = process.env.VNP_HASHSECRET;
            let vnpUrl = process.env.VNP_URL;

            // ✅ Thêm kiểm tra cấu hình VNPay
            if (!tmnCode || !secretKey || tmnCode === 'your_vnpay_code' || secretKey === 'your_vnpay_secret') {
                console.error("❌ Lỗi cấu hình VNPay: Vui lòng kiểm tra VNP_TMNCODE và VNP_HASHSECRET trong file .env");
                return res.status(500).json({
                    message: "Lỗi cấu hình hệ thống thanh toán VNPay."
                });
            }

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu nhân 100
            vnp_Params['vnp_ReturnUrl'] = redirectUrl;
            vnp_Params['vnp_IpnURL'] = ipnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;

            vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort());

            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            payUrl = vnpUrl;
            qrCodeUrl = vnpUrl; // Với VNPay, QR code chính là URL thanh toán
        }

        console.log("✅ Trả về thành công:", { payUrl: !!payUrl, qrCodeUrl: !!qrCodeUrl });
        res.json({ payUrl, qrCodeUrl });

    } catch (error) {
        console.error("❌ Lỗi tạo URL thanh toán:", error);
        res.status(500).json({
            message: "Không thể tạo phiên thanh toán. Vui lòng thử lại.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/zalopay-callback', async (req, res) => {
    let result = {};
    try {
        const key2 = process.env.ZALOPAY_KEY2;
        const { data, mac } = req.body;
        const dataStr = JSON.stringify(data);
        const calculatedMac = crypto.createHmac("sha256", key2).update(dataStr).digest("hex");

        if (calculatedMac !== mac) {
            console.error('ZaloPay Callback: Invalid MAC');
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            const { app_trans_id, status, amount } = data;
            const orderId = app_trans_id.split('_')[1];

            const booking = await Booking.findById(orderId);

            if (!booking) {
                console.error(`ZaloPay Callback: Booking not found for orderId: ${orderId}`);
                result.return_code = 0; // ZaloPay expects success even if order not found on our side
                result.return_message = "success";
            } else if (booking.status !== 'pending') {
                console.log(`ZaloPay Callback: Booking ${orderId} already processed with status ${booking.status}`);
                result.return_code = 0;
                result.return_message = "success";
            } else if (booking.totalPrice !== amount) {
                console.error(`ZaloPay Callback: Amount mismatch for booking ${orderId}. Expected ${booking.totalPrice}, got ${amount}`);
                booking.status = 'failed';
                await booking.save();
                result.return_code = 0;
                result.return_message = "success";
            } else {
                if (status === 1) {
                    booking.status = 'confirmed';
                    booking.expireAt = undefined;
                    await booking.save();
                    console.log(`ZaloPay Callback: Booking ${orderId} confirmed successfully.`);
                } else {
                    booking.status = 'failed';
                    await booking.save();
                    console.log(`ZaloPay Callback: Booking ${orderId} failed with status ${status}.`);
                }
                result.return_code = 1;
                result.return_message = "success";
            }
        }
    } catch (ex) {
        console.error("ZaloPay Callback Error:", ex);
        result.return_code = 0;
        result.return_message = "success";
    }

    res.json(result);
});

// ✅ 2. IPN Handler cho MoMo (POST)
router.post('/momo-ipn', async (req, res) => {
    const {
        partnerCode, accessKey, requestId, amount, orderId, orderInfo,
        orderType, transId, resultCode, message, payType, responseTime,
        extraData, signature
    } = req.body;

    const secretKey = process.env.MOMO_SECRET_KEY;
    // ✅ Sửa lại chuỗi signature cho IPN theo đúng tài liệu của MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const calculatedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    if (calculatedSignature !== signature) {
        console.error('Momo IPN: Invalid signature');
        return res.status(400).json({ message: 'Invalid signature' });
    }

    try {
        const booking = await Booking.findById(orderId);
        if (!booking) {
            console.error(`Momo IPN: Booking not found for orderId: ${orderId}`);
            return res.status(204).send();
        }

        if (booking.status !== 'pending') {
            console.log(`Momo IPN: Booking ${orderId} already processed with status ${booking.status}`);
            return res.status(204).send();
        }
        if (booking.totalPrice !== amount) {
            console.error(`Momo IPN: Amount mismatch for booking ${orderId}. Expected ${booking.totalPrice}, got ${amount}`);
            booking.status = 'failed';
            await booking.save();
            return res.status(204).send();
        }

        if (resultCode === 0) { // Thành công
            booking.status = 'confirmed';
            booking.expireAt = undefined;
            console.log(`Momo IPN: Booking ${orderId} confirmed successfully.`);
        } else { // Thất bại
            booking.status = 'failed';
            console.log(`Momo IPN: Booking ${orderId} failed with resultCode ${resultCode}.`);
        }
        await booking.save();

        res.status(204).send();

    } catch (err) {
        console.error('Momo IPN: Server error', err);
        res.status(204).send();
    }
});

// ✅ 3. IPN Handler cho VNPay (GET)
router.get('/vnpay-ipn', async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort());

    const secretKey = process.env.VNP_HASHSECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash !== signed) {
        console.error('VNPay IPN: Invalid signature');
        return res.status(200).json({ RspCode: '97', Message: 'Invalid Signature' });
    }

    try {
        const orderId = vnp_Params['vnp_TxnRef'];
        const amount = vnp_Params['vnp_Amount'] / 100;
        const responseCode = vnp_Params['vnp_ResponseCode'];

        const booking = await Booking.findById(orderId);

        if (!booking) {
            console.error(`VNPay IPN: Booking not found for orderId: ${orderId}`);
            return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }

        if (booking.status !== 'pending') {
            console.log(`VNPay IPN: Booking ${orderId} already processed with status ${booking.status}`);
            return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
        }

        if (booking.totalPrice !== amount) {
            console.error(`VNPay IPN: Amount mismatch for booking ${orderId}. Expected ${booking.totalPrice}, got ${amount}`);
            return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
        }

        if (responseCode === '00') {
            booking.status = 'confirmed';
            booking.expireAt = undefined;
            await booking.save();
            console.log(`VNPay IPN: Booking ${orderId} confirmed successfully.`);
            res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
        } else {
            booking.status = 'failed';
            await booking.save();
            res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
        }
    } catch (err) {
        console.error('VNPay IPN: Server error', err);
        res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
});

module.exports = router;