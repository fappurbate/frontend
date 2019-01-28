import Vue from 'vue';
import Router from 'vue-router';
import Start from './views/Start';
import Dashboard from './views/Dashboard';
import Extensions from './views/Extensions';
import Tippers from './views/Tippers';
import Translations from './views/Translations';
import Animation from './views/Animation';

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
      path: '/:broadcaster/extensions',
      name: 'extensions',
      component: Extensions
    }
  ]
});
