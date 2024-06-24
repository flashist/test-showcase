const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = webpack.DefinePlugin;
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ip = require('ip');
// Inside of webpack.config.js:
const WorkboxPlugin = require('workbox-webpack-plugin');

var packageJson = require('./package.json');
const VERSION = `"${packageJson.version}"`;

// CONSTANTS
const BUILD_DIR = "dist";
const NODE_MODULES_DIR = `${__dirname}/node_modules`;
//
const IS_PROD = process.env.NODE_ENV === "prod";
const IS_DEV = !IS_PROD;
console.log("IS_DEV: ", IS_DEV);

const IS_ANALYZE = process.env.ANALYZE === "true";
console.log("IS_ANALYZE: ", IS_ANALYZE);

const appConfigJson = require("./assets/app-config.json");
const { debug } = require('console');
console.log("appConfigJson.appName: ", appConfigJson.appName);

var htmlTitle = appConfigJson.appName;
var bundlePath = "bundle.js"
if (IS_DEV) {
    htmlTitle += " (DEV)";
    bundlePath = "dist/bundle.js"
}

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /node_modules[/\\]createjs/,
                loaders: [
                    'imports-loader?this=>window',
                    'exports-loader?window.createjs'
                ]
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            }
        ],
    },
    resolve: {
        mainFields: ['browser', 'main', 'module'],
        extensions: [".js", ".ts", ".json", ".png"],
        alias: {
            "createjs": path.resolve(NODE_MODULES_DIR, 'createjs/builds/1.0.0/createjs.js')
        }
    },
    output: {
        filename: 'bundle.js',
        publicPath: `/${BUILD_DIR}/`,
        path: path.resolve(__dirname, `${BUILD_DIR}`)
    },
    plugins: [
        new DefinePlugin({
            'IS_DEV': IS_DEV,
            'VERSION': VERSION
        }),
        new CopyPlugin(
            [
                {
                    from: "src/index.html",
                    to: "index.html",
                    transform(content) {
                        return content
                            .toString()
                            .replace('$bundlePath$', bundlePath)
                            .replace('$appName$', htmlTitle);
                    },
                },
                {
                    from: "src/site.webmanifest",
                    to: "site.webmanifest"
                },
                {
                    from: "assets/*"
                },
                {
                    from: "assets/!(sources)/**"
                },
                {
                    from: "src/libs",
                    to: "libs"
                }
            ]
        )
    ]
};

if (IS_DEV) {
    const localIp = ip.address();
    module.exports.mode = "development";
    module.exports.devtool = 'inline-source-map';
    module.exports.devServer = {
        host: localIp,
        port: 9000,
        contentBase: path.join(__dirname, `${BUILD_DIR}`),
        open: true,
        index: "index.html",
        compress: true
    };
    module.exports.watch = true;
    module.exports.watchOptions = {
        poll: 1000,
        aggregateTimeout: 1000
    };

    console.log("DIST: ", path.join(__dirname, `${BUILD_DIR}`));

} else {
    module.exports.mode = "production";
    module.exports.plugins.unshift(
        new CleanWebpackPlugin()
    );
    // module.exports.plugins.unshift(
    //     new WorkboxPlugin.GenerateSW({
    //         // Do not precache images
    //         // exclude: [/\.(?:png|jpg|jpeg|svg|mp3|webm|woff2|json)$/],
    //
    //         // Define runtime caching rules.
    //         runtimeCaching: [{
    //             // Match any request that ends with .png, .jpg, .jpeg or .svg.
    //             urlPattern: /\.(?:png|jpg|jpeg|svg|mp3|webm|woff2|json)$/,
    //
    //             // Apply a cache-first strategy.
    //             handler: 'CacheFirst',
    //
    //             options: {
    //                 // Use a custom cache name.
    //                 cacheName: 'gameCacheName'
    //             }
    //         }]
    //     })
    // );
    if (IS_ANALYZE) {
        module.exports.plugins.unshift(
            new BundleAnalyzerPlugin()
        );
    }

    module.exports.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
}