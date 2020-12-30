<template>
  <div>

    <v-stage
        ref="stage"
        :config="configKonva"
        @touchmove="onTouchmove"
        @touchend="onTouchend"
        @wheel="onWheel"
    >
      <v-layer ref="layer">
        <v-text
            :key="1"
            :config="{
                      x: 0,
                      y: 0,
                      text: debug_message,
                      fontSize: 18,
                      fontFamily: 'Calibri',
                      fill: '#555',
                      width: 300,
                      padding: 20,
                      align: 'center',
          }"/>

        <v-group
            v-for="item in list"
            :key="`group-${item.id}`"
            @dragstart="onDragstart"
            @dragend="onDragend"
            :config="{
              x: item.x,
              y: item.y,
              rotation: item.rotation,
              id: item.id,
              draggable: true,
              scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
              scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
              shadowColor: 'black',
              shadowBlur: 10,
              shadowOffsetX: dragItemId === item.id ? 15 : 5,
              shadowOffsetY: dragItemId === item.id ? 15 : 5,
              shadowOpacity: 0.6
            }"
        >

          <markdown-file :item="item"/>
          <star title="Hello" :item="item"/>

        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Star from './components/star/Star.vue';
import MarkdownFile from './components/text/MarkdownFile.vue';

const width = window.innerWidth;
const height = window.innerHeight;


function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export default {
  components: {Star, MarkdownFile},
  data() {
    return {
      list: [],
      message: '--',
      dragItemId: null,
      configKonva: {
        width: width,
        height: height,
      },
      isDragging: false,
      lastCenter: null,
      lastDist: 0,
      scaleBy: 1.2,
    };
  },

  methods: {

    onWheel(e) {
      this.message = e.evt.deltaY < 0 ? 'zooming in' : 'zooming out'
      let stage = this.$refs.stage.getStage()
      e.evt.preventDefault();

      let oldScale = stage.scaleX();

      let pointer = stage.getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let newScale =
          e.evt.deltaY < 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;

      stage.scale({x: newScale, y: newScale});

      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    },

    onTouchmove(e) {
      this.message = 'handleTouchmove'
      let stage = this.$refs.stage.getStage()

      e.evt.preventDefault();
      let touch1 = e.evt.touches[0];
      let touch2 = e.evt.touches[1];

      if (touch1 || touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
          stage.stopDrag();
        }
      }

      if (touch1 && touch2) {
        let p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        let p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!this.lastCenter) {
          this.lastCenter = getCenter(p1, p2);
          return;
        }
        let newCenter = getCenter(p1, p2);
        let dist = getDistance(p1, p2);
        if (!this.lastDist) {
          this.lastDist = dist;
        }
        // local coordinates of center point
        let pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        let scale = stage.scaleX() * (dist / this.lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        let dx = newCenter.x - this.lastCenter.x;
        let dy = newCenter.y - this.lastCenter.y;

        let newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        this.lastDist = dist;
        this.lastCenter = newCenter;
        // ############################
        // Handle single touch, (TODO: clean this mess)
      } else if (touch1) {

        let p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };

        if (!this.lastp1) {
          this.lastp1 = p1;
          return;
        }

        let pointTo = {
          x: (p1.x - stage.x()) / stage.scaleX(),
          y: (p1.y - stage.y()) / stage.scaleY(),
        };

        // calculate new position of the stage
        let dx = p1.x - this.lastp1.x;
        let dy = p1.y - this.lastp1.y;

        let newPos = {
          x: p1.x - pointTo.x * stage.scaleX() + dx,
          y: p1.y - pointTo.y * stage.scaleY() + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        this.lastDist = 0;
        this.lastp1 = p1;
      }
    },

    onTouchend(e) {
      this.message = 'handleTouchend'
      this.lastDist = 0;
      this.lastCenter = null;
      this.lastp1 = null;
    },

    onDragstart(e) {
      this.message = 'handleDragstart'
      // save drag element:
      this.dragItemId = e.target.id();
      // move current element to the top:
      const item = this.list.find(i => i.id === this.dragItemId);
      const index = this.list.indexOf(item);
      this.list.splice(index, 1);
      this.list.push(item);
    }
    ,
    onDragend(e) {
      this.message = 'handleDragend'
      this.dragItemId = null;
    }

  },
  computed: {

    debug_message() {
      return `message: ${this.message}
lastCenter: ${this.lastCenter}
lastDist: ${this.lastDist}
`
    },
  },

  mounted() {
    for (let n = 0; n < 30; n++) {

      let id = Math.round(Math.random() * 10000).toString()
      this.list.push({
        id: id,
        title: 'Item '+id,
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 130,
        scale: Math.random()
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
