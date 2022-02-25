const path = require('path')

module.exports = {
    mode: 'production',
    entry: ['./assets/scripts/three.js', './assets/scripts/slider.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets/scripts')
    }
}