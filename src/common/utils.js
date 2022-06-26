export default {
  computed: {
    scroll_top: {
      get () {
        return this.$store.getters['ViewConfig/scroll_top'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_scroll_top', value);
      }    
    }
  },
  methods: {
    save_scroll_state(data) {
     if (data && data.scroll_to_position) {
        this.$store.commit('WikiSideConfig/update_sidebar_card_scroll_pos', data);
     }

     let main_elem = document.getElementById('ras-side-portal');
      if (main_elem) {
        this.scroll_top =  main_elem.scrollTop;
      }
    },
    add_to_sidebar(data) {
      if (data && data.url && data.url.includes('.wiktionary')) {
        data.url = data.url.replace('.wiktionary', '.m.wiktionary');
      }

      this.$store.commit('WikiSideConfig/add_sidebar_card', data);
    },
    is_wiki_link(target_url) {
      let domain = (new URL(window.location.href)); 
      let target_url_domain = new URL(target_url);

      if (domain.host == target_url_domain.host && (target_url.includes('/wiki/') || target_url.includes('/w/index.php'))) {
        return true;
      }

      if (target_url.includes('wiktionary')) {
        return true;
      }

      return false;
    }    
  }
}