import Vue from 'vue';
import Router from 'vue-router';
import Animation from './views/Animation';
import Start from './views/Start';
import Dashboard from './views/Dashboard';
import Extension from './views/Extension';
import Extensions from './views/Extensions';
import Gallery from './views/Gallery';
import Tippers from './views/Tippers';
import Translations from './views/Translations';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    },
    {
      path: '/:broadcaster',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/:broadcaster/gallery',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/:broadcaster/tippers',
      name: 'tippers',
      component: Tippers
    },
    {
      path: '/:broadcaster/translations',
      name: 'translations',
      component: Translations
    },
    {
      path: '/:broadcaster/animation',
      name: 'animation',
      component: Animation
    },
    {
      name: 'extensions',
      path: '/:broadcaster/extensions',
      component: Extensions
    },
    {
      name: 'extension',
      path: '/:broadcaster/extension/:extensionId',
      component: Extension
    }
  ]
});
