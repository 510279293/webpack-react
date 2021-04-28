import webpack from 'webpack'
import { copySync, emptyDirSync } from 'fs-extra'
import { yellow, bold } from 'chalk'
import ora from 'ora'
import { appPublic, outputPath, appHtml } from './utils'
import configFn from './config'

const config = configFn(true) // 获取生产环境的webpack 配置项

const compilerRunCallBack = async (err, stats) => {
    copyPublicFolder()
}

const copyPublicFolder = () => {
    copySync(appPublic, outputPath, {
        dereference: true,
        filter: file => file !== appHtml
    })
}

const build = async () => {
    const spinner = ora('start build...\n').start()
    try {
        emptyDirSync(outputPath)
        const compiler = webpack(config)
        compiler.run((err, stats) => {
            compilerRunCallBack(err, stats)
            console.log('\n')
            spinner.succeed('build ok!');
        })
    } catch (err) {
        spinner.fail('Compile failed!')
    }
}

build()