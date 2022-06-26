import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

import cytoscape from 'cytoscape';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import dagre from 'cytoscape-dagre'

nodeHtmlLabel( cytoscape );
cytoscape.use( dagre );
cytoscape.warnings(false);

Object.defineProperty(Vue.prototype, '$cytoscape', { value: cytoscape });

(function run() {
    var initialize_app = () => {
      var element_exists = document.getElementById("ras-side-portal")
      if (typeof(element_exists) != 'undefined' && element_exists != null) {
        document.getElementsByTagName("html")[0].style.display="block";
        return;
      }
      
      var side_portal_container = document.createElement("div");
      side_portal_container.id = 'side-portal-container';
      document.getElementsByTagName("body")[0].appendChild(side_portal_container);     

      new Vue({
        store,
        el: '#side-portal-container',
        render: h => h(App)
      });
    }
  initialize_app();
})();