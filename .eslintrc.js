module.exports = {
    env: {
        node: true
    },
    "extends": [
        "plugin:vue/recommended",
        "eslint:recommended"
    ],
    parserOptions: {
        parser: "babel-eslint"
    },
    root: true,
    rules: {
        "no-console": "error",
        "no-debugger": "error"
    }
}