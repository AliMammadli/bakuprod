const path = require('path')

module.exports = {
    mode: 'development',
    entry: './assets/scripts/three.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets/scripts')
    }
}