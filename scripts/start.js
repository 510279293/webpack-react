import webpack from 'webpack'
import { ip } from 'address'
import { yellow, bold } from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils'
import clearConsole from 'react-dev-utils/clearConsole'
import configFn, { devServer } from './config'
import { appPath } from './utils'
const PORT = '3000'
const HOST = '0.0.0.0' || '127.0.0.1'
const isInteractive = process.stdout.isTTY
const config = configFn()
const devServerConfig = Object.assign({}, devServer(), {
    open: true,
    progress: true,
    stats: 'errors-warnings',
    useLocalIp: true,
    overlay: {
        errors: true,
        warnings: false
    }
})

const compilerInvalidCallBack = () => {
    isInteractive && clearConsole()
}

const start = async () => {
    console.log(config)
    try {
        // await checkBrowsers(appPath, isInteractive)
        const port = await choosePort(HOST, PORT)
        if (!port) return 
        const compiler = await webpack(config)
        compiler.hooks.invalid.tap('invalid', compilerInvalidCallBack)
        const server = await new WebpackDevServer(compiler, devServerConfig)
        server.listen(port, HOST, (err) => {
           console.log(`your App started at: 
           ${ yellow(bold(`http://${HOST}:${port}`))}  \n 
           ${ yellow(bold(`http://localhost:${port}`))} \n
           ${ yellow(bold(`http://${ip()}:${port}`))}
           `)
        })
    } catch (err) {
        if (err && err.message) {
            console.log(err.message)
        }
        process.exit(1)
    }
}

start()