<template>
  <div class='ras-side-portal-main'>
    <rasWikiSidebar v-if="sidebar_domain == 0" />
  </div>
</template>
<script>

import rasWikiSidebar from './wiki/ras-wiki-sidebar.vue';

export default {
  name: 'side-portal-main',
  components: {
    rasWikiSidebar
  },
  computed: {
    is_shown: {
      get () {
        return this.$store.getters['ViewConfig/is_shown'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_is_shown', value);
      }    
    }
  },
  data () {
    return {
      sidebar_domain: null
    }
  },
  mounted () {
    let is_shown = window.localStorage.getItem('Side_Portal_Shown');

    if (is_shown == null) {
      this.is_shown = true;
    }

    window.side_portal = {};
    
    window.side_portal.toggle_show = () => {
      this.is_shown = !this.is_shown;
    }

    this.select_sidebar_for_site();
  },
  methods: {
    select_sidebar_for_site() {
      let domain = (new URL(window.location.href)); 

      if (domain.host.includes('wikipedia.org')) {
        this.sidebar_domain = 0;
      }
      else {
        document.getElementsByTagName("html")[0].style.display="block";
      }
    }
  }
}
</script>
<style>
.ras-side-portal-main {
  height: 100%;
  width: 100%;
}
</style>