<template>  
  <div class='ras-wiki-sidebar'>
    <rasHomeView v-if="viewing_options == true" />
    <div v-if="viewing_options == false && has_pages()">
        <rasSpatialView v-if="explore_spatiallay_selected" :unique_id="unique_id" />
        <rasSidebarPages v-if="!explore_spatiallay_selected" :unique_id="unique_id" />
    </div>
    <div v-if="viewing_options == false && !has_pages()" class = 'ras-empty-view'>
      <div v-bind:style="ras_portal_style" class="ras-portal-logo" v-on:click="viewing_options = true" />
      Shift-click on links to add them here.
    </div>
  </div>
</template>
<script>
import rasSpatialView from './sub_views/ras-spatial-view.vue';
import rasSidebarPages from './sub_views/ras-sidebar-pages.vue';
import rasHomeView from './sub_views/ras-home-view.vue';
import utils from '../../common/utils';

export default {
  name: 'ras-wiki-sidebar',
  mixins: [utils],
  components: {
    rasSpatialView,
    rasSidebarPages,
    rasHomeView
  },
  data () {
    return {
      unique_id: null,
    }
  },
  watch: {
    panel_width() {
      this.set_portal_width();
    },
    is_shown() {
      this.set_main_page_width();
    },
    explore_spatiallay_selected(val) {
      if (!val) {
        window.setTimeout(() => {
          let elem = document.getElementsByClassName('ras-sidebar-card-container')[0].children[0];
          if (!elem.classList.contains('ras-sidebar-card')) {
            elem.remove();
          }         
        }, 500);
      }
    },
  },
  computed: {
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
    explore_spatiallay_selected: {
      get () {
        return this.$store.getters['ViewConfig/explore_spatiallay_selected'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_explore_spatiallay_selected', value);
      }    
    },
    is_shown: {
      get () {
        return this.$store.getters['ViewConfig/is_shown'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_is_shown', value);
      }    
    },
    panel_width: {
      get () {
        return this.$store.getters['WikiSideConfig/panel_width'];
      },
      set (value) {
        this.$store.commit('WikiSideConfig/update_panel_width', value);
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
  mounted () {
    try {
      this.initialize_config();
      this.initialize_page();
      this.set_on_shift_click_listener();
      this.add_post_message_listener();
    }
    catch (e) {
      console.log("Error " + e);
    }
    finally {
      window.setTimeout(() => {
        document.getElementsByTagName("html")[0].style.display="block";
      }, 100)
    }
  },
  methods: {
  add_post_message_listener() {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, (e) => {
      try {
        let data = JSON.parse(e.data);
        if (!data.side_portal_event || !data.side_portal_event.url) {
          return;
        }

        let url = data.side_portal_event.url;
        if (this.is_wiki_link(url) && data.side_portal_event.action == 'open_in_sidebar') {
          this.add_to_sidebar({'prev_node_unique_id': data.side_portal_event.unique_id, 
                            'url': url,
                            'prev_node_url': data.side_portal_event.iframe_url,
                            'unique_id': '_f' + Math.random().toString(36).substr(2, 9) });
        }
        else if (data.side_portal_event.action == 'open_in_main') {
          this.save_all_iframe_scroll_state();
          window.location = url;
        }
      }
      catch(e) {
        console.log("Failed parsing " + e);
      }
    });
  },
  has_pages() {
      return (this.sidebar_card_list && this.sidebar_card_list.Wiki_Side_Portal_Cards && this.sidebar_card_list.Wiki_Side_Portal_Cards.length > 0)
   },
   save_all_iframe_scroll_state() {
    let iframes = document.querySelectorAll('.ras-sidebar-card-iframe');

    if (iframes && iframes.length > 0) {
      iframes.forEach(frame => {
        let scroll_pos = 0;

        if (frame.src.includes('.wikipedia')) {
          scroll_pos = frame.contentWindow.scrollY;
        }

        let unique_id = frame.getAttribute('data-id');
        if (unique_id && (scroll_pos != null)) {
          this.save_scroll_state({'unique_id': unique_id, 'scroll_to_position' :scroll_pos});
        }
      });
    }
   },
   set_on_shift_click_listener() {
      document.body.addEventListener('click', (e) => {
        if (e && e.shiftKey && e.target && e.target.classList  && e.target.classList.length > 0 
            && e.target.classList[0].includes('suggestions-result') && e.target.parentElement
            && e.target.parentElement.href && this.is_wiki_link(e.target.parentElement.href)) {
          
          this.is_shown = true;
          let url = e.target.parentElement.href;
          
          this.add_to_sidebar(
                {'prev_node_unique_id': this.unique_id, 
                  'url': url,
                  'prev_node_url': document.location.href,
                  'unique_id': '_f' + Math.random().toString(36).substr(2, 9) });  

          e.preventDefault();
          return ;
        }
      }, false); 

      var elements = document.getElementsByTagName('a');
      for(var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = (event) => {
          if (event.shiftKey && this.is_wiki_link(event.currentTarget.href)) {
            this.is_shown = true;
            this.add_to_sidebar(
                {'prev_node_unique_id': this.unique_id, 
                  'url': event.currentTarget.href,
                  'prev_node_url': document.location.href,
                  'unique_id': '_f' + Math.random().toString(36).substr(2, 9) });

            event.preventDefault();
            return false;   
          }
          else {
            try {
              this.save_all_iframe_scroll_state();
            }
            catch (e) {
              console.log ('Error');
            }
          }
        }
      }
    },
    initialize_config() {
      this.unique_id = '_f' + Math.random().toString(36).substr(2, 9);

      let sort = window.localStorage.getItem('Wiki_Side_Portal_Card_Sort_Order');
      let size = window.localStorage.getItem('Wiki_Side_Portal_Card_Size');
      let mode = window.localStorage.getItem('Wiki_Side_Portal_Cards_Mode');
      let panel_width = window.localStorage.getItem('Wiki_Side_Portal_Panel_width');
      let horizontal_card_width = window.localStorage.getItem('Wiki_Side_Portal_Horizontal_Card_Width');

      if(size == null) {
        this.card_size = 1;
      }

      if(horizontal_card_width == null) {
        this.horizontal_card_width = 1;
      }

      if(sort == null) {
        this.sort_order = 1;
      }

      if(mode == null) {
        this.mode_selected = 1;
      }

      if(panel_width == null) {
        this.panel_width = 375;
      }
    },
    initialize_page() {
      this.initialize_wikipedia_dom();
      this.set_main_page_width();
      this.set_portal_width();
      this.make_wikipedia_page_visible();
    },
    set_portal_width() {
      document.getElementsByTagName("body")[0].style.setProperty('--portal-width',`${this.panel_width}px`);
    },
    set_main_page_width() {
      if (this.is_shown) {
        document.getElementById("ras-main-container").classList.add('ras-main-container-with-side-portal');
        document.getElementById("ras-side-portal-container").style.display = 'block';
        return;
      }

      document.getElementById("ras-main-container").classList.remove('ras-main-container-with-side-portal');
      document.getElementById("ras-side-portal-container").style.display = 'none';
    },
    make_wikipedia_page_visible() {
      document.getElementById("ras-main-container").classList.remove('ras-visibility-hidden');
    },
    initialize_wikipedia_dom() {
      document.body.style.display = 'flex';
      var body_container = document.createElement("div");
      body_container.id = 'ras-main-container';
      body_container.class = 'ras-visibility-hidden';
      var elements = document.querySelectorAll( 'body > *' );
      elements.forEach((element) => body_container.append(element));
      document.getElementsByTagName("body")[0].appendChild(body_container);

      var side_portal_container = document.createElement("div");
      side_portal_container.id = 'ras-side-portal-container'; 
      document.getElementsByTagName("body")[0].appendChild(side_portal_container);
      let side_portal = document.getElementById('ras-side-portal');
      side_portal_container.appendChild(side_portal);
    }
  }
}
</script>
<style>
.ras-main-container-with-side-portal {
  width: calc(100% - var(--portal-width) - 30px);
  position: absolute;
  overflow-x: scroll;
}
</style>

<style scoped>
.ras-sidebar-card-iframe-spatial {
  height: 350px;
  width: 350px;  
}

.ras-visibility-hidden {
  opacity: 0;
}

.ras-wiki-sidebar {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  width: calc(var(--portal-width));
  height: 100%;
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

.ras-empty-view {
  color: grey;
  font-size: 14px;
  display: flex;
  top: 15px;
  justify-content: center;
  position: relative;
}

.ras-portal-logo {
  height: 12px;
  position: relative;
  top: 2px;
  right: 10px;
  width: 12px;
  cursor: pointer;
  border: 2px solid #74afec;
  border-radius: 50%;
  transition: border .4s ease-in;
}
</style>