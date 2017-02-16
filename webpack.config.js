module.exports = {
    entry: {
        app: ['./index.js']
    },
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?presets[]=es2015'],
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> 1%"]}'
            }
        ]
    }
}
