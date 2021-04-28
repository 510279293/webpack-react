import { existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import postcssNormalize from 'postcss-normalize'
export const CWD = process.cwd();
export const moduleFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs']
const resolveApp = relativePath => resolve(CWD, relativePath);
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension => existsSync(resolveFn(`${filePath}${extension}`)))
    return resolveFn(`${filePath}${extension||'.js'}`)
}
const findRootDir = (dir) => {
    return dir === '/' ? dir : findRootDir(dirname(dir));
}

export const getStyleLoader = (cssOptions={}, preProcessor, isProd = false) => {
    const Loaders = [
        !isProd && 'style-loader',
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                esModule: false
            }
        },
        {
            loader: 'css-loader',
            options: cssOptions
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-flexbugs-fixes',
                        ['postcss-preset-env', {
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }],
                        postcssNormalize(),
                    ]
                },
            }
        }
    ].filter(Boolean)

    if(preProcessor) {
        Loaders.push(
            {
                loader: 'resolve-url-loader',
                options: {}
            },
            {
                loader: require.resolve(preProcessor),
                options: {
                    sourceMap: true
                }
            }
        )
    }
    return Loaders
}

// path
export const ROOT = findRootDir(CWD)
export const packageJsonPath = resolveApp('package.json')
export const outputPath = resolveApp('dist')
export const appSrc = resolveApp('src')
export const appIndex = resolveModule(resolveApp, 'src/index')
export const appHtml = resolveApp('public/index.html')
export const appPublic = resolveApp('public')
export const appPath = resolveApp('.')

// value used offen
export const packageJson = JSON.parse(readFileSync(packageJsonPath)) || {}
export const Version = packageJson.version

// Reg
export const cssRegex = /\.css$/
export const sassRegex = /\.(scss|sass)$/
export const cssModuleRegex = /\.module\.css$/
export const sassModuleRegex = /\.module\.(scss|sass)$/
export const imgRegex = /\.(bmp|gif|jpe?g|png)$/
