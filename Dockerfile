FROM node:18-bullseye

# تثبيت الحزم الأساسية وجافا (OpenJDK 17)
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# إعداد مسارات بيئة الأندرويد
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# تحميل وتثبيت أدوات الأندرويد (Command Line Tools)
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O android-tools.zip && \
    unzip android-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    rm android-tools.zip && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest

# قبول رخص أندرويد تلقائياً
RUN yes | sdkmanager --licenses

# تثبيت حزم بناء الأندرويد المطلوبة
RUN sdkmanager "platforms;android-33" "build-tools;33.0.2" "platform-tools"

# تثبيت أداة Cordova بشكل عام
RUN npm install -g cordova

# تحديد مجلد العمل داخل السيرفر
WORKDIR /app

# نسخ ملفات الاعتماديات وتثبيتها
COPY package*.json ./
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# فتح المنفذ وتشغيل السيرفر
EXPOSE 3000
CMD ["node", "server.js"]
