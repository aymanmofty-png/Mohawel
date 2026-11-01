const express = require('express');
const path = require('path');
const app = express();

// استخدام المنفذ الذي تحدده منصة Render أو المنفذ الافتراضي 10000
const PORT = process.env.PORT || 10000;

// السماح بقراءة الملفات الثابتة (مثل index.html وأي ملفات مرافقة في نفس المجلد)
app.use(express.static(__dirname));

// توجيه الصفحة الرئيسية مباشرة إلى ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل الخادم على المنفذ المحدد واستقبال الاتصالات الخارجية
app.listen(PORT, '0.0.0.0', () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
