'use strict';
/* /upload */
const fs     = require('fs');
const router = require('express').Router();
const multer = require('multer');
const upload = require('./helper/api/upload');

const upload2Local = multer({
    storage: multer.diskStorage({
        destination: `${process.env.PWD}/routes/tmp`,
        filename   : (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}`),
    }),
});

// Handing `provider` Params
router.param('provider', (req, res, next, provider) => {
    req.olProvider = provider;

    next();
});

router.post('/:provider', (req, res, next) => {
    upload2Local.single('twitterMedia')(req, res, err => {
        if (err) {
            next(err);
        } else {
            const provider = req.olProvider;

            q_userFindOne({ id: provider + req.olPassports[provider] })
            .then((found) => {
                return upload[provider]({
                    token      : found.token,
                    tokenSecret: found.tokenSecret,
                    filePath   : req.file.path,
                });
            })
            .then(data => res.json(data))
            .fail(e => next(e))
            .finally(() => fs.unlinkSync(req.file.path));
        }
    });
});

module.exports = router;
