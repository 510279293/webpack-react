import { resolve as pathResolve, join } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import eslintFormatter from 'react-dev-utils/eslintFormatter'
import {CWD, appSrc, appPath, appIndex, outputPath, appHtml, moduleFileExtensions,
     cssRegex, sassRegex, cssModuleRegex, sassModuleRegex, getStyleLoader,
     imgRegex, appPublic, Version } from './utils'

const entry = () => {
    return {
        app: appIndex
    }
}

const output = (isprod=false) => {
    const filename = 'static/js/[name].[contenthash:8].js'
    return {
        filename,
        path: outputPath,
        publicPath: './',
        clean: true
    }
}

const babelLoader = () => {
    return [
        {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: appSrc,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ["@babel/plugin-transform-react-jsx"],
                }
            }
        }
    ]
}

const eslintLoader = () => {
    return [
        {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            enforce: 'pre',
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        formatter: eslintFormatter,
                    }
                }
            ],
            include: appSrc
        }
    ]
}

const styleLoader = () => {
    return [
      {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoader({
              importLoaders: 1,
          }),
        
      },
      {
          test: cssModuleRegex,
          use: getStyleLoader({
              importLoaders: 1,
              modules: {

              }
          })
      },
      {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoader({
              importLoaders: 2,
          }, 'sass-loader')
      },
      {
          test: sassModuleRegex,
          use: getStyleLoader({
              importLoaders: 2,
              modules: {

              }
          }, 'sass-loader')
      }
    ]
}

const urlLoader = () => {
    return [
        {
           test: imgRegex,
           loader: 'url-loader',
           options: {
               name: 'static/media/[name].[hash:8].[ext]',
           }
        }
    ]
}

const fileLoader = () => {
    return [
        {
            loader: 'file-loader',
            exclude: /\.(js|mjs|jsx|ts|tsx|html|json)$/,
            options: {
                name: 'static/media/[name].[hash:8].[ext]',
            }
        }
    ]
}

const devtool = (isProd=false) => {
    return isProd ? 'source-map' : 'cheap-module-source-map'
}

const resolve = () => {
    return {
        extensions: moduleFileExtensions,
        alias: {
            '@': pathResolve('src'),
            '@component/*': pathResolve('src/component'),
            '@assets': pathResolve('src/assets'),
        }
    }
}

const plugins = (isProd=false) => {
    const minify = () => {
        return {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }
    }
    return [
        new HtmlWebpackPlugin(Object.assign({},{
            inject: true,
            template: appHtml,
        }, isProd ? {minify: minify()} : undefined)),
        // 用于替换 public/index.html 文件中的 %PUBLIC_URL%
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
            PUBLIC_URL: ''
        }),
        // 用于提示在 node_modules 中未找到的模块
        new ModuleNotFoundPlugin(appPath),
        new MiniCssExtractPlugin({
            filename: `static/css/[name].[contenthash:8].css?v=${Version}`,
            chunkFilename: `static/css/[name].[contenthash:8].chunk.css?v=${Version}`,
        }),
        isProd && new BundleAnalyzerPlugin()
    ].filter(Boolean)
}

// 优化
const optimization = (isProd=false) => {
    return {
        minimize: isProd, // 是否开启压缩
        emitOnErrors: true,
        splitChunks: {
            chunks: 'all',
            name: 'vendors'
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        drop_console: true,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    },
                    sourceMap: !isProd
                }
            }),
            new CssMinimizerPlugin()
        ]
    }
}

// only used in development 
export const devServer = () => {
    return {
        publicPath: '/',
        compress: true,
        contentBase: outputPath,
        watchContentBase: true,
        hot: true,
        historyApiFallback: {
            historyApiFallback: true,
        }
    }
}

export default (isProd=false) => {
    const mode = isProd ? "production" : "development"
    return {
        target:'web', //应为package.json 中有browserslist 所以webpack5 加上它才会热更新
        mode: mode,
        entry: entry(isProd),
        output: output(isProd),
        devtool: devtool(isProd),
        resolve: resolve(isProd),
        module: {
            rules: [
                ...eslintLoader(isProd),
                {
                    oneOf: [
                        ...urlLoader(isProd),
                        ...babelLoader(isProd),
                        ...styleLoader(isProd),
                        // ...fileLoader()
                    ]
                }
            ]
        },
        optimization: optimization(isProd),
        plugins: plugins(isProd)
    }
}
