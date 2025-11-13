export const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
};
export const getCookie = (name) => {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(";");
    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
};
export const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
export const hasCookie = (name) => {
    return getCookie(name) !== null;
};
export const getAllCookies = () => {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
        const [key, value] = cookie.split("=");
        if (key && value) {
            cookies[key.trim()] = decodeURIComponent(value.trim());
        }
    });
    return cookies;
};
