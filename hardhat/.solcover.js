module.exports = {
    skipFiles: [
        'mocks',
        'interface',
        'testnet'
    ],
    modifierWhitelist: [
        'onlyInitializing',
        'initializer',
        'nonReentrant',
        'whenNotPaused'
    ]
};