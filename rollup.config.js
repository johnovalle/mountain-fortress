export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  sourcemap: 'inline',
  watch: {
    include: 'src/**'
  }
};
