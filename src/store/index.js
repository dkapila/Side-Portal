import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const ViewConfig = {
  state: {
    explore_spatiallay_selected: false,
    viewing_options: false,
    is_shown: JSON.parse(window.localStorage.getItem('Side_Portal_Shown')),
    scroll_top: window.localStorage.getItem('Side_Portal_Scroll_Top'),
  },
  getters: {
   scroll_top: state => {
      return state.scroll_top;
    },
   viewing_options: state => {
      return state.viewing_options;
    },
   is_shown: state => {
      return state.is_shown;
    },
   explore_spatiallay_selected: state => {
      return state.explore_spatiallay_selected;
    }
  },
  mutations: {
    update_scroll_top(state, value) {
      state.scroll_top = value;
      window.localStorage.setItem('Side_Portal_Scroll_Top', value);
    },
    update_viewing_options(state, value) {
      state.viewing_options = value;
    },
    update_explore_spatiallay_selected(state, value) {
      state.explore_spatiallay_selected = value;
    },
    update_is_shown(state, value) {
      state.is_shown = value;
      window.localStorage.setItem('Side_Portal_Shown', value);
    }
  },
  namespaced: true
}

const WikiSideConfig = {
  state: {
    sort_order: window.localStorage.getItem('Wiki_Side_Portal_Card_Sort_Order'),
    horizontal_card_width: window.localStorage.getItem('Wiki_Side_Portal_Horizontal_Card_Width'),
    panel_width: window.localStorage.getItem('Wiki_Side_Portal_Panel_width'),
    card_size: window.localStorage.getItem('Wiki_Side_Portal_Card_Size'),
    mode_selected: window.localStorage.getItem('Wiki_Side_Portal_Cards_Mode'),
    sidebar_card_list: JSON.parse(window.localStorage.getItem('Wiki_Side_Portal_Cards')),
  },
  getters: {
   sort_order: state => {
      return state.sort_order;
    },
   panel_width: state => {
      return state.panel_width;
    },
   horizontal_card_width: state => {
      return state.horizontal_card_width;
    },
   card_size: state => {
      return state.card_size;
    },
    mode_selected: state => {
      return state.mode_selected;
    },
    sidebar_card_list: state => {
      return state.sidebar_card_list;
    },
  },
  mutations: {
    update_horizontal_card_width(state, value) {
      state.horizontal_card_width = value;
      window.localStorage.setItem('Wiki_Side_Portal_Horizontal_Card_Width', value);
    },
    update_panel_width(state, value) {
      state.panel_width = value;
      window.localStorage.setItem('Wiki_Side_Portal_Panel_width', value);
    },
    update_sort_order(state, value) {
      state.sort_order = value;
      window.localStorage.setItem('Wiki_Side_Portal_Card_Sort_Order', value);
    },
    update_card_size(state, value) {
      state.card_size = value;
      window.localStorage.setItem('Wiki_Side_Portal_Card_Size', value);
    },
    update_mode_selected(state, value) {
      state.mode_selected = value;
      window.localStorage.setItem('Wiki_Side_Portal_Cards_Mode', value);
    },
    set_scroll_position(state, card_index, scroll_pos) {
      state.sidebar_card_list.Wiki_Side_Portal_Cards[card_index]['scroll_pos'] = scroll_pos;
    },
    remove_sidebar_card(state, card_index) {
      state.sidebar_card_list.Wiki_Side_Portal_Cards.splice(card_index, 1);

      let items = {};
      items['Wiki_Side_Portal_Cards'] = [];

      for (let i = 0; i < state.sidebar_card_list.Wiki_Side_Portal_Cards.length; i++) {
          items['Wiki_Side_Portal_Cards'].push(state.sidebar_card_list.Wiki_Side_Portal_Cards[i]);
      }

      localStorage.setItem('Wiki_Side_Portal_Cards', JSON.stringify(items));
    },
    update_sidebar_card_scroll_pos(state, data) {
      state.sidebar_card_list.Wiki_Side_Portal_Cards.forEach((card, idx) => {
        if (card.unique_id == data.unique_id) {
          state.sidebar_card_list.Wiki_Side_Portal_Cards[idx].scroll_to_position = data.scroll_to_position;
        }

        let items = {};
        items['Wiki_Side_Portal_Cards'] = [];
        for (let i = 0; i < state.sidebar_card_list.Wiki_Side_Portal_Cards.length; i++) {
            items['Wiki_Side_Portal_Cards'].push(state.sidebar_card_list.Wiki_Side_Portal_Cards[i]);
        }

        localStorage.setItem('Wiki_Side_Portal_Cards', JSON.stringify(items));
      })
    },
    add_sidebar_card(state, data) {
      let card_list = null;
      if (state.sidebar_card_list == null || !state.sidebar_card_list.Wiki_Side_Portal_Cards) {
        card_list = {};
        card_list.Wiki_Side_Portal_Cards = [];
      }
      else {
        card_list = state.sidebar_card_list;
      }
      
      card_list.Wiki_Side_Portal_Cards.unshift(data);
      
      let items = {};
      items['Wiki_Side_Portal_Cards'] = [];

      for (let i = 0; i < card_list.Wiki_Side_Portal_Cards.length; i++) {
          items['Wiki_Side_Portal_Cards'].push(card_list.Wiki_Side_Portal_Cards[i]);
      }

      localStorage.setItem('Wiki_Side_Portal_Cards', JSON.stringify(items));

      state.sidebar_card_list = card_list;
    },
  },
  namespaced: true
}

export default new Vuex.Store({
  modules: {
    WikiSideConfig: WikiSideConfig,
    ViewConfig: ViewConfig
  }
})