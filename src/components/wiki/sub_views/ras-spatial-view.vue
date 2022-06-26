<template>  
  <div>
    <div class='ras-close-view' v-on:click="explore_spatiallay_selected = false">Close View</div>
    <div id='ras-spatial-view'></div>
  </div>
</template>
<script>

export default {
  name: 'ras-spatial-view',
  props: {
    unique_id: String
  },
  computed: {
    explore_spatiallay_selected: {
      get () {
        return this.$store.getters['ViewConfig/explore_spatiallay_selected'];
      },
      set (value) {
        this.$store.commit('ViewConfig/update_explore_spatiallay_selected', value);
      }    
    },
    sidebar_card_list: {
      get () {
        return this.$store.getters['WikiSideConfig/sidebar_card_list'];
      }
    },
  },
  mounted () {
    this.display_spatial_view();
  },
  methods: {
    display_spatial_view() {
      let elements = [];
      let node_ids = {}

      if (!this.sidebar_card_list 
          || !this.sidebar_card_list.Wiki_Side_Portal_Cards 
          || (this.sidebar_card_list.Wiki_Side_Portal_Cards.length == 0)) {
        return;
      }
      
      let card_list  = this.sidebar_card_list.Wiki_Side_Portal_Cards;

      card_list.forEach(card => {
        if (!(card.prev_node_unique_id in node_ids)) {
          elements.push({group: 'nodes', data: {"id" : card.prev_node_unique_id, "type": 1, 'url': card.prev_node_url }});     
          node_ids[card.prev_node_unique_id] = true;     
        }
        if (!(card.unique_id in node_ids)) {
          elements.push({group: 'nodes', data: {"id" : card.unique_id, "type": 1, 'url': card.url}});          
          node_ids[card.unique_id] = true;     
        }
      });

      card_list.forEach(card => {
        if (card.prev_node_unique_id in node_ids && card.unique_id in node_ids) {
          let edge = { 
                       group: 'edges', 
                       data: { 
                            id: card.prev_node_unique_id + card.unique_id,
                            source: card.prev_node_unique_id, target: card.unique_id 
                        }
                     }

          elements.push(edge);          
        }        
      })

      if (!(this.unique_id in node_ids)) {
        elements.push({
          group: 'nodes', data: {'id': this.unique_id, 'type': 1, 'url': document.location.href}
        });

        node_ids[this.unique_id] = true;
      }

       let cy = this.$cytoscape({
          container: document.getElementById('ras-spatial-view'), 
          elements: elements,
          minZoom: 0.1,
          maxZoom: 2.0,
          style: [
            {
              selector: 'node',
              style: {
                'height': '40',
                'width': '40',
                'background-color': '#33bdea'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#ec6f35',
                'mid-target-arrow-color': '#ec6f35',
                'mid-target-arrow-shape': 'triangle',
                'target-arrow-color': '#ec6f35',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 4,
                'curve-style': 'bezier',
              }
            }
          ],
          layout: {
            name: 'dagre',
            animate: true,
            spacingFactor: 6
          }
        });

       cy.nodeHtmlLabel([
              {
                  query: 'node[type=1]',
                  cssClass: 'cy-title',
                  valign: "top",
                  valignBox: "top",
                  tpl: function (data) {
                      let url = data.url.replace('.m.wiki', '.wiki').replace('.wiki', '.m.wiki');
                      return `<iframe src="${url}" class="ras-sidebar-card-iframe ras-sidebar-card-iframe-spatial"></iframe>`;
                  }
              }
          ], {enablePointerEvents: true});

    },
  }
}
</script>

<style>
.ras-sidebar-card-iframe.ras-sidebar-card-iframe-spatial {
    height: 350px;
    border: 1px solid #988c8c;
    width: 300px;
    border-radius: 15px;
}
</style>
<style scoped>
.ras-close-view {
    display: flex;
    color: #33bdea!important;
    align-items: center;
    cursor: pointer;
    height: 30px;
    position: fixed;
    z-index: 10000;
}

.ras-close-view:hover {
  color:#ca124c!important;
}

.ras-sidebar-card-iframe {
  margin-bottom: 10px;
  border: 2px solid #757575;
  border-radius: 10px;
  margin-left: 5px;
  margin-left: 5px;
  width: 100%;
}

.ras-sidebar-card-iframe-spatial {
  height: 350px;
  width: 350px;  
}

.ras-spatial-view {
  height: 200px;
  width: 200px;
}

#ras-spatial-view {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: absolute;
  height: 100%;
  width: 100%;
  top: 30px;
  left: 0px;
}
</style>