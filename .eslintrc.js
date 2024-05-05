module.exports = {
    plugins: {
        // Define the plugin object for each plugin
        security: require('eslint-plugin-security')
    },
    rules: {
        // Add your ESLint rules here
        // For example:
        'security/detect-non-literal-fs-filename': 'warn',
        'security/detect-object-injection': 'warn',
        // Add more rules as needed
        // Add other ESLint rules directly without using "extends"
        // For example:
        // 'no-console': 'warn',
        // 'no-unused-vars': 'warn',
        // 'indent': ['error', 2],
        // Add more rules as needed
    },
};
