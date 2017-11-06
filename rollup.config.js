export default {
  input: 'src/game.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  sourceMap: 'inline',
  watch: {
    include: 'src/**'
  }
};
