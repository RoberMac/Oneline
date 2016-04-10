module.exports = {
    required  : true,
    type      : 'object',
    properties: {
        created_at: { required: true, type: 'number' },
        id_str    : { required: true, type: 'string' },
        provider  : 'validProvider',
        type      : 'validType',
        user      : {
            required  : true,
            type      : 'object',
            properties: {
                uid        : { required: true, type: 'string' },
                avatar     : { required: true, type: 'string' },
                name       : { required: true, type: 'string' },
                screen_name: { required: true, type: 'string' },
            },
        },
    },
};
