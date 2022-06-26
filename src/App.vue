<template>
  <div id="ras-side-portal" 
      v-bind:class="{'ras-side-portal-full-screen': explore_spatiallay_selected}">
    <side-portal></side-portal>
  </div>
</template>
<script>
import sidePortal from './components/side-portal.vue';

export default {
  name: 'app',
  components: {
    sidePortal,
  },
  computed: {
    explore_spatiallay_selected: {
      get () {
        return this.$store.getters['ViewConfig/explore_spatiallay_selected'];
      }
    }
  }
}
</script>
<style scoped>
.ras-side-portal-full-screen {
  width: 100%;
  background: #ececec;
}

#ras-side-portal {
    display: block;
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 100;
    height: 100%;   
    overflow-y: scroll;
    overscroll-behavior-x: none;
}
</style>