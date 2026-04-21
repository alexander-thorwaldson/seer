import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [{ input: './src/', outDir: './.dist', ext: 'js' }],
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  failOnWarn: false,
})
