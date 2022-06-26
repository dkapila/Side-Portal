<template>  
  <div class='ras-viewing-options'> 
    <div class='ras-done-button' v-on:click="viewing_options = false">Done</div>
    <div class='ras-select-mode-options'>
      Sort order for horizontal view:
      <select v-model="sort_order">
        <option disabled value="">Select sort order for horizontal view</option>
        <option value="1">Old to new</option>
        <option value="2">New to old</option>
      </select>
    </div>
    <div class='ras-select-mode-options'>
      Page width for horizontal view:
      <select v-model="horizontal_card_width">
        <option disabled value="">Select page width for horizontal view</option>
        <option value="1">Small</option>
        <option value="2">Medium</option>
        <option value="3">Large</option>
      </select>
    </div>
    <div class='ras-select-mode-options'>
      Panel Width:
      <select v-model="panel_width">
        <option disabled value="">Select the width of this panel</option>
        <option value="375">Small</option>
        <option value="450">Medium</option>
        <option value="555">Large</option>
      </select>
    </div>
    <button class='ras-reset-button' v-on:click="reset_data()">Reset all settings and clear all sidebar pages</button>
    <hr />
    <div class='ras-info'>
      Thank you for using this extension. If you face any problems, or have suggestions, please contact me by <a href="mailto:dharam@hey.com">email</a> or on <a href = "https://twitter.com/DharamKapila" target="_blank">Twitter</a>. 
      <div class='ras-info-mobile-link-container' v-if="!isMobileUrl()">
      ps: I would recommend trying this extension on the <a :href="getMobileUrl()">mobile wikipedia</a> site for a cleaner experience.
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ras-home-view',
  computed: {
    viewing_options: {
      get () {
        return this.$store.getters['ViewConfig/viewing_options'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_viewing_options', value);
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
  },
  methods: {
    isMobileUrl() {
      let is_mobile_url = (location.href.includes('.m.wikipedia')) ? true : false;
      return is_mobile_url;
    },
    getMobileUrl() {
      return location.href.replace('.m.wiki', '.wiki').replace('.wiki', '.m.wiki');
    },
    reset_data() {
      window.localStorage.removeItem('Wiki_Side_Portal_Card_Sort_Order');
      window.localStorage.removeItem('Wiki_Side_Portal_Card_Size');
      window.localStorage.removeItem('Wiki_Side_Portal_Cards_Mode');
      window.localStorage.removeItem('Wiki_Side_Portal_Panel_width');
      window.localStorage.removeItem('Wiki_Side_Portal_Cards');
      window.localStorage.removeItem('Side_Portal_Shown');
      window.localStorage.removeItem('Wiki_Side_Portal_Horizontal_Card_Width');
      window.localStorage.removeItem('Side_Portal_Scroll_Top');

      document.body.style.cursor = 'wait';

      location.reload();
    }
  }
}
</script>
<style scoped>
.ras-select-mode-options {
  font-size: 14px;
  color: #736f6f;
  margin-bottom: 10px;
  display: flex;
  flex-flow: column;
}

.ras-reset-button {
  border-radius: 4px;
  border: 1px solid #5f5b5b;
  padding: 5px 6px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 13px;
  justify-content: center;
  display: flex;
  cursor: pointer;
  margin-bottom: 20px;
}

.ras-done-button {
  justify-content: center;
  display: flex;
  color:#33bdea!important;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
}

.ras-done-button:hover {
  color:#ca124c!important;
}

.ras-done-button {
  justify-content: flex-start;
  margin-bottom: 25px;
  position: relative;
  top: 10px;
}

.ras-reset-button:hover {
  background: #f7b3b3;
}

.ras-info-mobile-link-container {
  position: relative;
  margin-top: 5px;
}

.ras-info {
  font-size: 14px;
  color: grey;
  margin-top: 20px;  
}

.ras-select-mode-options > select {
  margin-top: 5px;
  width: 200px;
  margin-bottom: 10px;
  border: none;
  color: rebeccapurple;
  background: transparent;
  font-size: 14px;
}
</style>