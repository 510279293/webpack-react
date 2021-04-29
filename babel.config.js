module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '60'
        }
      }
    ],
    ['@babel/preset-react',{
      runtime: 'automatic'
    }],
    "@babel/preset-typescript"
  ],
  plugins: []
}
