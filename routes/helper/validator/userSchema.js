module.exports = {
    required: true,
    type: 'object',
    properties: {
        uid: { required: true, type: 'string' },
        provider: { required: true, type: 'string' },
        avatar: { required: true, type: 'string' },
        name: { required: true, type: 'string' },
        screen_name: { required: true, type: 'string' },
    }
}