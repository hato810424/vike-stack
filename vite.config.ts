import preact from '@preact/preset-vite'
import vike from 'vike/plugin'
import devServer from "@hono/vite-dev-server"
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    preact(),
    vike(),
    devServer({
      entry: "./server/index.ts",
      exclude: [
        /.*\.ts$/,
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
    }
  },
  optimizeDeps: {
    include: ['preact', 'preact/devtools', 'preact/debug', 'preact/jsx-dev-runtime', 'preact/hooks']
  },
  server: {
    hmr: true,
    watch: {
      ignored: ['./server/**'],
    }
  }
}

export default config