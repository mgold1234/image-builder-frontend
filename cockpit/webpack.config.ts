const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); // Add this line
const [mode, devtool] =
  process.env.NODE_ENV === 'production'
    ? ['production', 'source-map']
    : ['development', 'inline-source-map'];

const output = {
  path: path.resolve('cockpit/public'),
  filename: 'main.js',
  sourceMapFilename: '[file].map',
};

const plugins = [
  new MiniCssExtractPlugin(),
  new webpack.DefinePlugin({
    'process.env.IS_ON_PREMISE': JSON.stringify(true),
  }),
];

module.exports = {
  entry: './src/AppCockpit.tsx',
  output,
  mode,
  devtool,
  plugins,
  externals: { cockpit: 'cockpit' },
  resolve: {
    modules: ['node_modules', 'pkg/lib'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      api: path.resolve(__dirname, '../src/store/cockpitApi.ts'),
      pathRes: path.resolve(__dirname, '../src/Utilities/pathOnPrem.ts'),
      getFeatureFlag: path.resolve(
        __dirname,
        '../src/Utilities/useGetEnvironment.ts'
      ),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [path.resolve('src'), path.resolve('pkg/lib')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
        resolve: { fullySpecified: false },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
