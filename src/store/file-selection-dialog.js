const events = new EventTarget;

export default {
  namespaced: true,
  state: {
    open: false,
    type: 'images',
    multiple: false,
    selection: null,
    pending: 0
  },
  mutations: {
    open(state, { type, multiple }) {
      state.open = true;
      state.type = type;
      state.multiple = multiple;
      state.selection = multiple ? [] : null;
    },
    cancel(state) {
      state.open = false;
      state.selection = undefined;
    },
    select(state) {
      state.open = false;
    },
    getInLine(state) {
      state.pending++;
    },
    leaveLine(state) {
      state.pending--;
    }
  },
  actions: {
    $init(context, store) { },
    async open(context, options = {}) {
      const multiple = typeof options.multiple === 'boolean' ? options.multiple : false;
      const type = options.type || 'images';

      let myTurn = context.state.pending;
      if (context.state.open || myTurn > 0) {
        await new Promise(resolve => {
          context.commit('getInLine');

          events.addEventListener('close', function listener() {
            if (myTurn === 0) {
              context.commit('leaveLine');
              events.removeEventListener('close', listener);
              resolve();
            } else {
              myTurn--;
            }
          });
        });
      }

      context.commit('open', { type, multiple });

      return new Promise(resolve =>
        events.addEventListener('close', () => resolve(context.state.selection), { once: true })
      );
    },
    cancel(context) {
      context.commit('cancel');
      events.dispatchEvent(new CustomEvent('close'));
    },
    select(context) {
      context.commit('select');
      events.dispatchEvent(new CustomEvent('close'));
    }
  }
};
