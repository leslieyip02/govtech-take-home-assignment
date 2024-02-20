const path = require("path");

module.exports = {
    entry: "./src/client/index.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".css", ".js", ".ts"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "public"),
    },
};
