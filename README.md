# btnav

Mobile app to control relay over BLE to stay on a fixed course

Prerequisites: https://reactnative.dev/docs/environment-setup

```
cd BTNav
yarn install
yarn start # in terminal 1
yarn android # in terminal 2
yarn android:build
yarn android:install
```

Installable app can be found in android/app/build/outputs/apk/debug/app-debug.apk

## Publish

Copy btnav.keystore into `android/app`

credentials in `~/.gradle/gradle.properties`:

```ini
BTNAV_STORE_FILE=btnav.keystore
BTNAV_KEY_ALIAS=btnav
BTNAV_STORE_PASSWORD=*****
BTNAV_KEY_PASSWORD=*****
```

```bash
cd BTNav
yarn android:release
```

Uploadable app bundle can be found in android/app/build/outputs/bundle/release/app-release.abb

## Telemetry

https://app.logrocket.com/h5ovjy/btnav-dev
