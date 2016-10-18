# Tube Mp3 Downloader
Just open the YouTube app on Android and share the video to **Tube Mp3 Downloader** and the app will download an .mp3 of the video to the `Music` folder on your phone.

### Download the app (.apk)
If you want only to download the app, you can do it clicking **[here](https://github.com/AlbertoAbruzzo/tubemp3downloader/raw/master/Tube%20Mp3%20Downloader%20v1.0.0.apk)**. You'll download an `.apk` to install.

### How to compile the app
If you want to compile the app you need to clone the repo and then launch 4 commands:
* `npm i` install node modules
* `ionic state restore --plugins` install all cordova plugins
* `ionic plugin add https://github.com/napolitano/cordova-plugin-intent` plugin for sharing
* `ionic platform add android` prepare the project for the Android platform

Then open `platforms/android/AndroidManifest.xml` and at the line **10** paste this code (for sharing):

```
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <action android:name="android.intent.action.SEND_MULTIPLE" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="*/*" />
</intent-filter>
```

That's all! Now you only need to run the app on your device, with this command `ionic run android`.