import jwtDecode from 'jwt-decode';

export default {
    // via https://github.com/auth0/angular-jwt/blob/master/dist/angular-jwt.js#L106
    getTokenExpirationDate: token => {
        const decoded = jwtDecode(token);

        if (typeof decoded.exp === "undefined"){
            return null;
        }

        const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);

        return d;
    },
    // via https://github.com/auth0/angular-jwt/blob/master/dist/angular-jwt.js#L120
    isTokenExpired: (token, offsetSeconds = 0) => {
        const d = this.getTokenExpirationDate(token);

        if (d === null){
            return false;
        }

        // Token expired?
        return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    },
    decodeToken: token => jwtDecode(token)
}