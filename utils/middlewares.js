const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const tokenList = (
        req.headers.authorization &&
        JSON.parse(req.headers.authorization.split(' ')[1]) ||
        []
    );
    const validPassports = {};

    // extract valid token's payload to req.olPassports
    tokenList.forEach(token => {
        try {
            const { provider, uid } = jwt.verify(token, process.env.KEY);
            validPassports[provider] = uid;
        } catch (e) {
            // Empty
        }
    });

    if (Object.keys(validPassports).length <= 0) {
        next({ statusCode: 401 });
    } else {
        req.olTokenList = tokenList;
        req.olPassports = validPassports;
        next();
    }
};
