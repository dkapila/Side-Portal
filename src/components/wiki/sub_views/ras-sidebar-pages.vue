<template>  
  <div>
    <div class='ras-options'>
      <div class="ras-portal-logo" title='More Options' v-on:click="viewing_options = true" />
        <div class='ras-explore-graph' v-on:click="explore_spatiallay_selected = true">Explore Spatially</div>
          <div class='ras-select-mode'>
            <select v-model="card_size">
              <option disabled value="">Select size for each page</option>
              <option value="1">Small</option>
              <option value="2">Medium</option>
              <option value="3">Large</option>
            </select>
          </div>
          <div class='ras-select-mode'>
            <select v-model="mode_selected">
              <option disabled value="">Select page layout</option>
              <option value="1">Vertical</option>
              <option value="2">Horizontal</option>
            </select>
          </div>
      </div>
      <div class='ras-sidebar-card-container' 
          v-bind:class="{'ras-card-container-horizontal-mode': mode_selected == 2, 
                          'ras-card-container-vertical-mode': mode_selected == 1, 
                          'ras-reverse-sort': (sort_order == 2 && mode_selected == 2) }">
       <div v-bind:class="{
          'ras-card-horizontal-mode': mode_selected == 2,  
          'ras-card-small-size': card_size == 1,
          'ras-card-medium-size': card_size == 2,
          'ras-card-large-size': card_size == 3,
          'ras-horizontal-width-small': (horizontal_card_width == 1 && mode_selected == 2),
          'ras-horizontal-width-medium': (horizontal_card_width == 2 && mode_selected == 2),
          'ras-horizontal-width-large': (horizontal_card_width == 3 && mode_selected == 2),
          }" ref="cards" v-bind:key="card.unique_id" class='ras-sidebar-card'  v-for="(card, idx) in sidebar_card_list.Wiki_Side_Portal_Cards">
          <div class='ras-close-card-container'>
            <div class='ras-close-card ras-card-button' title='Close Page' v-on:click="close_card($event, idx)"> ✕ </div>
          </div>
            <iframe v-on:load="card_loaded(card)" :data-id="card.unique_id" class='ras-visibility-hidden ras-sidebar-card-iframe ras-sidebar-card-view-frame' :src="card.url" />
        </div>
      </div>
    </div>
</template>
<script>

import utils from '../../../common/utils';

export default {
  name: 'ras-sidebar-pages',
  mixins: [utils],
  mounted() {
    if (this.scroll_top) {
      window.setTimeout(() => {
        if (this.scroll_top) {
          let elem_main = document.getElementById('ras-side-portal');
          elem_main.scrollTop = this.scroll_top;
        }
      }, 200);
    }
  },
  computed: {
    scroll_top: {
      get () {
        return this.$store.getters['ViewConfig/scroll_top'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_scroll_top', value);
      }    
    },
    explore_spatiallay_selected: {
      get () {
        return this.$store.getters['ViewConfig/explore_spatiallay_selected'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_explore_spatiallay_selected', value);
      }    
    },
    viewing_options: {
      get () {
        return this.$store.getters['ViewConfig/viewing_options'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_viewing_options', value);
      }    
    },
    horizontal_card_width: {
      get () {
        return this.$store.getters['WikiSideConfig/horizontal_card_width'];
      },
      set (value) {
        this.$store.commit('WikiSideConfig/update_horizontal_card_width', value);
      }    
    },
    sort_order: {
      get () {
        return this.$store.getters['WikiSideConfig/sort_order'];
      },
      set (value) {
        this.$store.commit('WikiSideConfig/update_sort_order', value);
      }    
    },
    card_size: {
      get () {
        return this.$store.getters['WikiSideConfig/card_size'];
      },
      set (value) {
        this.$store.commit('WikiSideConfig/update_card_size', value);
      }    
    },
    mode_selected: {
      get () {
        return this.$store.getters['WikiSideConfig/mode_selected'];
      },
      set (value) {
        this.$store.commit('WikiSideConfig/update_mode_selected', value);
      }    
    },
    sidebar_card_list: {
      get () {
        return this.$store.getters['WikiSideConfig/sidebar_card_list'];
      }
    },
  },
  methods: {
    card_loaded(card) {
      this.set_up_iframe(card);
    },
    set_up_iframe(card) {
      let iframe = document.querySelectorAll(".ras-sidebar-card-view-frame[data-id='".concat(card.unique_id, "']"))[0];

      if (!iframe) {
        return;
      }

      if (iframe.src.includes('.wiktionary')) {
        iframe.classList.remove('ras-visibility-hidden');
        return true;
      }

      let iframeWin = iframe.contentWindow || iframe;
      let iframeDoc = iframe.contentDocument || iframeWin.document;

      this.inject_js_into_iframe(iframeDoc, card);
      this.inject_css_into_iframe(iframeDoc);

      card.scroll_to_position = 0;
      this.$store.commit('WikiSideConfig/update_sidebar_card_scroll_pos', card);

      iframe.classList.remove('ras-visibility-hidden');
    },
    inject_js_into_iframe(iframeDoc, card) {
      let unique_id = card.unique_id;
      let scroll_to_position = (card.scroll_to_position) ? card.scroll_to_position : 0;

      var script = iframeDoc.createElement("script");
        script.append(`
          window.unique_id = '${unique_id}';
          window.scroll_to_position = ${scroll_to_position};
          
          window.setTimeout(() => {
            window.scroll(0, window.scroll_to_position);
          }, 200);

          var elements = document.getElementsByTagName('a');
          for(var i = 0; i < elements.length; i++) {
            elements[i].onclick = function (event) {
              if (event.shiftKey) {
                let data = {
                  side_portal_event: {
                      action:'open_in_sidebar', 
                      url: event.currentTarget.href, 
                      unique_id: window.unique_id, 
                      iframe_url: document.location.href  
                    }
                  };
                parent.postMessage(JSON.stringify(data), "*")
                return false;   
              }
              else {
                let data = {
                  side_portal_event: {
                      action:'open_in_main', 
                      url: event.currentTarget.href, 
                      unique_id: window.unique_id, 
                      iframe_url: document.location.href 
                    }
                  };
                parent.postMessage(JSON.stringify(data), "*")
                return false;   
              }
            }
          }
      `);
      
      iframeDoc.documentElement.appendChild(script);
    },
    inject_css_into_iframe(iframeDoc) {
      let css = `
        <style>
          img {
            max-width: 250px!important;
          }
          span#coordinates {
            display:none!important;
          }
          table.infobox.vcard {
            width:21em!important;
          }
          table.wikitable {
            width: 250px!important;
          }
          div#siteSub {
            display: none!important;
          }
          .navbox {
            width: 250px!important;
            overflow-x: scroll!important;
          }
          .thumbinner {
            max-width: 150px!important;
          }
          .mw-dismissable-notice {
            display: none!important;
          }
          #siteNotice {
            display: none!important;
          }
          #mw-panel {
            display: none!important;
          }

          mw-header {
            display: none;
          }
          #mw-page-base {
            display: none!important;
          }

          #content {
            margin-left: 0px!important;
          }

          .mw-body {
            border:none!important;
          }
          .mwe-popups {
            display:none!important;
          }

          #mw-navigation {
            display: none!important;
          }
        </style>
      `
      let style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));

      iframeDoc.head.insertBefore(style, iframeDoc.head.firstElementChild);
    },
    close_card(event, card_index) {
      this.$store.commit('WikiSideConfig/remove_sidebar_card', card_index);
    }
  }
}
</script>
<style scoped>
.ras-explore-graph {
  justify-content: center;
  display: flex;
  color:#33bdea!important;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
}

.ras-explore-graph:hover {
  color:#ca124c!important;
}

.ras-sidebar-card-iframe {
  border: 2px solid #d4d4d4;
  border-radius: 10px;
  margin-left: 5px;
}

.ras-card-button {
  height: 12px;
  font-size: 16px;
  width: 12px;
  padding: 10px;
  color: #33bdea!important;
  margin-bottom: 4px;
  cursor: pointer;
}

.ras-close-card-container {
  display: flex;
  justify-content: flex-end;  
}

.ras-visibility-hidden {
  opacity: 0;
}

.ras-card-button:hover {
  color:#ca124c!important;
}

.ras-sidebar-card-container {
  height: 100%;
}

.ras-card-container-horizontal-mode {
  display: flex;
  flex-flow: row-reverse;
  justify-content: flex-start;
  overflow-x: scroll;
}

.ras-card-container-vertical-mode {
  display: flex;
  flex-flow: column;
}

.ras-options {
  display: flex;
  justify-content: center;
}

.ras-select-mode > select {
  width: 90px; 
  border: 0;
  background: transparent;
  color: grey;
}

.ras-select-mode {
  display: flex;
  justify-content: flex-start;
  width: 85px;
  padding: 10px;
}

.ras-select-mode-options {
  font-size: 14px;
  color: #736f6f;
  margin-bottom: 10px;
  display: flex;
  flex-flow: column;
}

.ras-reverse-sort {
  flex-flow: row;
}

.ras-card-small-size > iframe {
  height: 300px;
  width:100%;
}

.ras-card-medium-size > iframe {
  height: 500px;
  width:100%;
}

.ras-horizontal-width-small > iframe {
  width: 300px!important;
}

.ras-horizontal-width-medium > iframe {
  width: 450px!important;
}

.ras-horizontal-width-large > iframe {
  width: 550px!important;
}

.ras-card-large-size > iframe {
  height: 700px;
  width:100%;
}

.ras-portal-logo {
  height: 12px;
  position: relative;
  top: 11px;
  right: 10px;
  width: 12px;
  cursor: pointer;
  border: 2px solid #74afec;
  border-radius: 50%;
  transition: border .4s ease-in;
}
</style>