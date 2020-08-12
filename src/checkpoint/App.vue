<template>
  <div>
    <span>{{ message }}</span>
    <v-stage
        ref="stage"
        :config="configKonva"
        @touchmove="handleTouchmove"
        @touchend="handleTouchend"
        @wheel="handleWheel"

    >
      <v-layer ref="layer">

        <v-star
            @dragstart="handleDragstart"
            @dragend="handleDragend"
            v-for="item in list"
            :key="item.id"
            :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50, fill: '#a21f58',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6
          }"
        ></v-star>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
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
  data() {
    return {
      list: [],
      message: '--',
      dragItemId: null,
      configKonva: {
        width: width,
        height: height
      },
      isDragging: false,
      lastCenter: null,
      lastDist: 0,
      scaleBy: 1.2,

    };
  },
  methods: {
    handleWheel(e) {
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

    handleTouchmove(e) {
      this.message = 'handleTouchmove'
      let stage = this.$refs.stage

      e.evt.preventDefault();
      let touch1 = e.evt.touches[0];
      let touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
          stage.stopDrag();
        }

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
      }
    },

    handleTouchend(e) {
      this.message = 'handleTouchend'
      this.lastDist = 0;
      this.lastCenter = null;
    },

    handleDragstart(e) {
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
    handleDragend(e) {
      this.message = 'handleDragend'
      this.dragItemId = null;
    }
  },
  mounted() {
    for (let n = 0; n < 30; n++) {
      this.list.push({
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 180,
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
