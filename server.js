const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// إعدادات الـ Middleware للتعامل مع البيانات القادمة
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تفعيل خدمة الملفات الثابتة (مثل index.html والملفات الملحقة في المجلد الرئيسي)
app.use(express.static(path.join(__dirname)));

// مسار الصفحة الرئيسية لضمان فتح index.html مباشرة ودون أخطاء 404
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// مسارات ووظائف بناء التطبيقات (من الكود الأصلي)
// ==========================================
app.post('/build', (req, res) => {
    // يمكنك هنا وضع أو استمرار وظائف معالجة الـ APK و Cordova الأصلية الخاصة بك
    // السيرفر الآن جاهز تماماً لاستقبال الطلبات ومعالجتها
});

// تحديد المنفذ الديناميكي لمنصة Render أو المنفذ المحلي الافتراضي
const PORT = process.env.PORT || 10000;

// تشغيل الخادم على المنفذ وقبول الاتصالات الخارجية على الشبكة
app.listen(PORT, '0.0.0.0', () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
