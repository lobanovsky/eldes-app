

export enum UserPlatform {
    IOS= 'ios',
    ANDROID = 'android',
    WINDOWS_PHONE = 'windows phone',
}
export const getMobileOperatingSystem = ():UserPlatform | '' => {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return UserPlatform.WINDOWS_PHONE;
    }

    if (/android/i.test(userAgent)) {
        return UserPlatform.ANDROID
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    // @ts-ignore
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return UserPlatform.IOS
    }

    return '';
}
