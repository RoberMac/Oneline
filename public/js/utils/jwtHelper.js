import jwtDecode from 'jwt-decode';

// via https://github.com/auth0/angular-jwt/blob/master/dist/angular-jwt.js
export const getTokenExpirationDate = token => {
    const decoded = jwtDecode(token);

    if (typeof decoded.exp === "undefined"){
        return null;
    }

    const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decoded.exp);

    return d;
}
export const isTokenExpired = (token, offsetSeconds = 0) => {
    const d = getTokenExpirationDate(token);

    if (d === null){
        return false;
    }

    // Token expired?
    return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
}
export const decodeToken = token => jwtDecode(token)