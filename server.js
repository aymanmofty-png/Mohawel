const express = require('express');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// تفعيل قراءة الواجهة وملفات الـ HTML لأن index.html بجانب server.js مباشرة
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.post('/build-apk', async (req, res) => {
    try {
        if (!req.files || !req.files.htmlFile) {
            return res.status(400).send('لم يتم رفع أي ملف HTML');
        }

        const appName = req.body.appName || "MyWebApp";
        const pkgName = req.body.pkgName || "com.custom.app";
        const htmlFile = req.files.htmlFile;

        const buildId = Date.now();
        const projectDir = path.join(__dirname, 'tmp', `app_${buildId}`);
        const outputApkPath = path.join(__dirname, 'public', 'downloads', `app_${buildId}.apk`);

        await fs.ensureDir(path.dirname(outputApkPath));

        // 1. إنشاء مشروع Cordova جديد
        const createCmd = `npx cordova create "${projectDir}" "${pkgName}" "${appName}"`;
        
        exec(createCmd, async (err) => {
            if (err) return res.status(500).json({ error: 'فشل في إنشاء هيكل التطبيق' });

            // 2. نسخ ملف HTML المرفوع وإحلاله محل index.html الأساسي
            const wwwPath = path.join(projectDir, 'www');
            await fs.emptyDir(wwwPath);
            await htmlFile.mv(path.join(wwwPath, 'index.html'));

            // 3. إضافة منصة الأندرويد وبناء ملف APK
            const buildCmd = `cd "${projectDir}" && npx cordova platform add android && npx cordova build android`;
            
            exec(buildCmd, async (buildErr) => {
                if (buildErr) return res.status(500).json({ error: 'فشل أثناء تجميع ملف APK' });

                const generatedApk = path.join(projectDir, 'platforms/android/app/build/outputs/apk/debug/app-debug.apk');
                
                if (fs.existsSync(generatedApk)) {
                    await fs.copy(generatedApk, outputApkPath);
                    // تنظيف الملفات المؤقتة
                    await fs.remove(projectDir);
                    
                    return res.json({ 
                        success: true, 
                        downloadUrl: `/downloads/app_${buildId}.apk` 
                    });
                } else {
                    return res.status(500).json({ error: 'لم يتم العثور على ملف APK الناتج' });
                }
            });
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// تشغيل الخادم بالمنفذ الصحيح وربطه بالشبكة ليتوافق تماماً مع Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
