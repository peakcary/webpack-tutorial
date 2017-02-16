#webpack教程
##安装webpack
```
npm install webpack -g
webpack --help
```

##初始化项目
创建项目

```
cd webpack
mkdir webpack-tutorial
cd webpack-tutorial
npm init -y
touch index.html
```
编辑index.html内容

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack 教程</title>
</head>
<body>
</body>
</html>
```


##webpack配置
根目录创建webpack.config.js

```
cd webpack-tutorial
touch webpack.config.js
```
单页面应用里，项目通常会有一个入口（entry）文件，假设是 index.js，我们通过配置 webpack 来指明它的位置。

```
touch index.js
```

编辑webpack.config.js内容

```
module.exports = {
    entry:'./index.js',
    output:{
        path:__dirname,//输出文件的保存路径
        filename:'bundle.js'//输出文件的名称
    }
}
```

现在在项目里执行 webpack 命令，我们的根目录下会多出一个 bundle.js 文件,并输出

```
Hash: 57dff4c8b51db2d90814
Version: webpack 1.13.2
Time: 41ms
    Asset     Size  Chunks             Chunk Names
bundle.js  1.39 kB       0  [emitted]  main
   [0] ./index.js 0 bytes {0} [built]
```

接下来，在 index.html 中引用 bundle.js 文件：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>webpack 教程</title>
</head>
<body>
    <script src="./bundle.js"></script><!-- 在 index.html 文件中添加这一行代码 -->
</body>
</html>
```
##实时刷新
在 html 文件中引用 bundle.js 文件后，我们有几个问题需要解决。

1. index.js 或它所引用的模块的变化如何通知 webpack，重新生成 bundle.js？

	非常简单，在根目录下执行 webpack --watch 就可以监控目录下的文件变化并实时重新构建。

2. 上面只是实时构建，我们该如何把结果通知给浏览器页面，让 HTML 页面上的 bundle.js 内容保持最新？

	webpack 提供了 webpack-dev-server 解决实时刷新页面的问题，同时解决实时构建的问题。

###安装 webpack-dev-server

在全局环境中安装 webpack-dev-server：

```
npm install webpack-dev-server -g
```
在项目根目录下执行命令：

```
$ webpack-dev-server
```  
这样，我们就可以在默认的 http://localhost:8080 网址上打开我们的 index.html。
此时，我们可能认为事情是按以下顺序发生的，

1. js 文件修改
2. webpack-dev-server 监控到变化
3. webpack 在内存中重新构建 bundle.js
4. webpack-dev-server 保证页面引用的 bundle.js 文件与内存中一致

但不幸的是，我们「自以为是」了。http://localhost:8080/index.html 对 js 文件的变化无动于衷。


webpack-dev-server 提供了两种模式用于自动刷新页面：

1. iframe 模式

	我们不访问 http://localhost:8080，而是访问 http://localhost:8080/webpack-dev-server/index.html

2. inline 模式

	在命令行中指定该模式，webpack-dev-server --inline。这样 http://localhost:8080/index.html 页面就会在 js 文件变化后自动刷新了。

以上说的两个页面自动刷新的模式都是指刷新整个页面，相当于点击了浏览器的刷新按钮。

webpack-dev-server 还提供了一种 --hot 模式，属于较高阶的应用

##第三方库
webpack 并不是包管理器，所以如果我们要使用第三方库，需要借助 npm。比如，在项目里安装 jQuery：

```
npm install jquery --save
```

##模块化
###模块化 JavaScript
如果我想用 ES6 的方式引入 jQuery 模块，比如：

```
import $ from 'jquery'
```
怎么办？浏览器目前还不提供原生支持，webpack 原生也仅支持 CommonJS 的那种写法，但借助 babel-loader ，我们可以加载 es6 模块：

1. 安装 babel-loader

	```
	npm install babel-loader babel-core babel-preset-es2015 --save-dev
	```
2. 配置 webpack.config.js，在 module.exports 值中添加 module：

	```
	module.exports = {
	  entry: {
	      app: ['./index.js']
	  },
	  output: {
	      filename: 'bundle.js'
	  },
	  module: {
	      loaders: [{
	          test: /\.js$/,
	          loaders: ['babel?presets[]=es2015'],
	          exclude: /node_modules/
	      }]
	  }
	}

	```

这样我们就可以在我们的 js 文件中使用 ES6 语法，babel-loader 会负责编译成浏览器可以识别的格式

###CSS 加载器
我们可以按传统方法使用 CSS，即在 HTML 文件中添加：

```
<link rel="stylesheet" href="style/app.css">
```

但 webpack 里，CSS 同样可以模块化，使用 import 导入。

因此我们不再使用 link 标签来引用 CSS，而是通过 webpack 的 style-loader 及 css-loader。前者将 css 文件以 <style></style> 标签插入 <head> 头部，后者负责解读、加载 CSS 文件。

1. 安装 CSS 相关的加载器

	```
	npm install style-loader css-loader --save-dev
	```

2. 配置 webpack.config.js 文件

	```
	{
	    module: {
	        loaders: [
	            { test: /\.css$/, loaders: ['style', 'css'] }
	        ]
	    }
	}
	```
3. 在 main.js 文件中引入 css

	```
	import'./style/app.css';
```
这样，在执行 webpack 后，我们的 CSS 文件就会被打包进 bundle.js 文件中，如果不想它们被打包进去，可以使用 extract text 扩展。

###模块化 CSS
上一步里，我们 import 到 JavaScript 文件中的 CSS 文件中的 CSS 在打包后是仍然是全局的，也就是说，我们只是换了种加载 CSS 的方式，在书写 CSS 的时候，还是需要注意使用命名规范，比如使用 BEM，否则全局环境 CSS 类的冲突等问题不会消失。

这里，webpack 做了一个模块化 CSS 的尝试，真正意思上的「模块化」，即 CSS 类不会泄露到全局环境中，而只会定义在 UI 模块内 – 类似 react.js 这类模块，或者 web components。

####autoprefixer
我们在写 CSS 时，按 CSS 规范写，构建时利用 autoprefixer 可以输出 -webkit、-moz 这样的浏览器前缀，webpack 同样是通过 loader 提供该功能。

1. 安装 autoprefixer-loader

	```
	npm install autoprefixer-loader --save-dev
	```
2. 配置 webpack.config.js

	```
	loaders: [{
    	test: /\.css$/,
    	loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> 1%"]}',
  }]
  ```
3. 重启 webpack-dev-server
	假如我们在 CSS 中写了 body { display: flex; } 规则，再查看 bundle.js 文件的话，我们能看到类似如下的代码：

	```
	body {\n\tdisplay: -webkit-box;\n\tdisplay: -webkit-flex;\n\tdisplay: -ms-flexbox;
	\n\tdisplay: flex;\n}
	```

###图片
图片同样可以是模块，但使用的是 file loader 或者 url loader，后者会根据定义的大小范围来判断是否使用 data url。

```
import loadingIMG from 'file!../img/loading.gif'

React.render(<img src={loadingIMG} />, document.getElementById('app'));
```


##打包 构建
项目结束后，代码要压缩、混淆、合并等，只需要在命令行执行：

```
$ webpack
```

即可，webpack 根据 webpack.config.js 文件中的配置路径、构建文件名生成相应的文件。通常，我们会额外定义一个专门用于生产环境的配置文件，比如 webpack.production.config.js，其中可以做许多代码优化。
