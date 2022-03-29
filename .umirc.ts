import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  // routes
  // history
  fastRefresh: {},
  // mock: false,
  alias: {
    components: '/src/components',
    models: '/src/models',
    services: '/src/services',
    utils: '/src/utils',
    assets: '/src/assets'
  },
});
