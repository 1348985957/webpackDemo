const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCssPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack.js');
const copyWebpackPlugin = require('copy-webpack-plugin');

console.log(encodeURIComponent(process.env.type));
if(process.env.type=="build"){
	var website={
		publicPath:"http://chengxi.com:1717/"
	}
}else{
	var website={
		publicPath:"http://192.168.2.234:1717/"
	}
}



module.exports={
	devtool:"source-map",
	//入口文件的配置项
	entry:entry.path,
	//出口文件的配置项
	output:{
		path:path.resolve(__dirname,'dist'),  //定义输出文件将存放的文件夹名称，这里需要绝对路径，因此开头引入path,利用path方法
		filename:'[name].js',  //输出文件名称定义，默认是main.js
		publicPath:website.publicPath
	},
	//模块：例如解读CSS,图片如何转换，压缩
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[　
					MiniCssExtractPlugin.loader,
					{loader:"css-loader", options:{importLoaders:1} },
					"postcss-loader"
				]
			},
			{
				test:/\.(png|jpg|gif)/,
				use:[{
					loader:'url-loader',
					options:{
						limit:5000,
						outputPath:"images/"
					}
				}]
			},
			{
				test:/\.(htm|html)$/i,
				use:['html-withimg-loader']
			},
			{
				test:/\.less$/,
				use:[
					MiniCssExtractPlugin.loader,
					"css-loader",
					"less-loader"
				]
			},
			{
				test:/\.scss/,
				use:[
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test:/\.(jsx|js)$/,
				exclude: /node_modules/, 
                loader: "babel-loader"
			}
		]
	},
	//插件，用于生产模版和各项功能
	plugins:[
		// Uglify是压缩js,现在已经不需要了,只需要在script里面写成
   		// "build": "webpack --mode production", 就自动压缩额
		//new uglify()cn
		new webpack.ProvidePlugin({
			$:"jquery" //下载jquery
		}),
		new htmlPlugin({
			minify:{
				removeAttributeQuotes:true
			},
			hash:true,  //消除缓存
			template:'./src/index.html'
		}),
		new MiniCssExtractPlugin("css/index.css"),
		new PurifyCssPlugin({//消除冗余代码
			// 首先保证找路径不是异步的,所以这里用同步的方法
        	// path.join()也是path里面的方法,主要用来合并路径的
      		// 'src/*.html' 表示扫描每个html的css
			paths:glob.sync(path.join(__dirname,'src/*.html'))
		}),
		new webpack.BannerPlugin('ycx版权所有'),
		new copyWebpackPlugin([{
			from:__dirname+'/src/public',
        	to:'./public'
		}])
	],
	optimization: {
		splitChunks: {
			cacheGroups:{ // 单独提取JS文件引入html
				aaa:{ // 键值可以自定义
					chunks:'initial', // 
					name:'jquery', // 入口的entry的key
					enforce:true   // 强制 
				},
				bbb:{
					chunks:'initial',
					name:'vue',
					enforce:true
				}
			}
		}
	},
	//配置webpack开发服务功能
	devServer:{
		//设置基本目录结构
		contentBase:path.resolve(__dirname,'dist'),
		//服务器的IP地址，可以使用IP也可以使用localhost
		host:'192.168.2.234',
		//服务端压缩是否开启
		compress:true,
		port:1717
	},
	mode: "development",
	watchOptions:{
		poll:1000, //监测修改的时间(ms)
		aggregateTimeout:500, //防止重复按键，500毫米内算按键一次
		ignored:/node_modules/ //不监测
	}
}