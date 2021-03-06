'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
    //-------------------axios 结合 node.js 代理后端请求 start
const express = require('express')
const axios = require('axios')
const app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
    //-------------------axios 结合 node.js 代理后端请求 end

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
            ],
        },
        //----------------axios 结合 node.js 代理后端请求
        before(app) {
            // 推荐热门歌单
            app.get('/api/getDiscList', function(req, res) {
                    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
                    axios.get(url, {
                        headers: {
                            referer: 'https://c.y.qq.com/',
                            host: 'c.y.qq.com'
                        },
                        params: req.query
                    }).then((response) => {
                        res.json(response.data)
                    }).catch((e) => {
                        console.log(e)
                    })
            }),
            // 歌词
            app.get('/api/getLyric', function(req, res) {
                var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

                axios.get(url, {
                        headers: {
                            referer: 'https://c.y.qq.com/',
                            host: 'c.y.qq.com'
                        },
                        params: req.query
                    })
                    .then((response) => {
                        // jsonp 数据转为 json 数据
                        var result = response.data
                        if (typeof result === 'string') {
                            var reg = /^\w+\(({[^()]+})\)$/
                            var matches = result.match(reg)

                            if (matches) {
                                result = JSON.parse(matches[1])
                            }
                        }
                        res.json(result)
                        // res.json(response.data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }),
            //搜索
            // https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
            app.get('/api/search', function(req, res) {
                    var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
                    axios.get(url, {
                        headers: {
                            referer: 'https://c.y.qq.com/',
                            host: 'c.y.qq.com'
                        },
                        params: req.query
                    }).then((response) => {
                        res.json(response.data)
                    }).catch((e) => {
                        console.log(e)
                    })
            })
        },
        //----------------axios 结合 node.js 代理后端请求
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
                // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
