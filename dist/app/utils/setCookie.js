"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    // refresh token jemon rakhlam, thik temoni access token kew cookie te rakhbo. Bivinno somoi need porbe.
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            // localhost a aivabe dita hobe
            // secure: false,
            // sameSite: 'lax',
            // code live a jawer pore
            secure: true,
            sameSite: 'none',
        });
    }
    // successfully login hole loginInfo er moddhe access-token and refresh-token thakbe. Seikhan theke refresh token ke client side er browser a coockies er moddhe set kore dita hobe. Jehto postman theke try korbo. Tai ai refreshToken postman er coockie teo set hobe.
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            // localhost a aivabe dita hobe
            // secure: false,
            // sameSite: 'lax',
            // code live a jawer pore
            secure: true,
            sameSite: 'none',
        });
    }
};
exports.setAuthCookie = setAuthCookie;
