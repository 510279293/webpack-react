module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        // "airbnb"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        // "react",
        // "@typescript-eslint"
    ],
    "rules": {
        "no-var": 1, //禁用var，用let和const代替
    },
    "settings": {
        "react": {
            "version": "999.999.999"
        }
    }
};
