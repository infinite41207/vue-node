import Vue from 'vue';
import Vuex from 'vuex';

import dispatchActionForAllModules from '@/utils/dispatch-action-for-all-modules';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
    modules,
    // Enable strict mode in development to get a warning
    // when mutating state outside of a mutation.
    // https://vuex.vuejs.org/guide/strict.html
    strict: process.env.NODE_ENV !== 'production',
});

// Automatically run the `init` action for every module,
// if one exists.
dispatchActionForAllModules('init');
