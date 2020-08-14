<template>
  <div>
    <ul>
      <li><span>{{ message }}</span></li>
      <li><span>{{ lastCenter }}</span></li>
      <li><span>{{ lastDist }}</span></li>
    </ul>
    <v-stage
        ref="stage"
        :config="configKonva"
        @touchmove="onTouchmove"
        @touchend="onTouchend"
        @wheel="onWheel"
    >
      <v-layer ref="layer">

        <v-group
            v-for="item in list"
            :key="`group-${item.id}`"
            @dragstart="onDragstart"
            @dragend="onDragend"
            :config="{
              x: item.x,
              y: item.y,
              // rotation: item.rotation,
              id: item.id,
              // width: 300,
              // height: 200,
              numPoints: 5,
              innerRadius: 30,
              outerRadius: 50, fill: '#a21f58',
              // opacity: 0.8,
              draggable: true,
              scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
              scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
              // shadowColor: 'black',
              // shadowBlur: 10,
              // shadowOffsetX: dragItemId === item.id ? 15 : 5,
              // shadowOffsetY: dragItemId === item.id ? 15 : 5,
              shadowOpacity: 0.6
            }"
        >
          <v-rect
              :key="`rectangle-${item.id}`"
              :config="{
                      // x: item.x,
                      // y: item.y,
                      stroke: '#555',
                      strokeWidth: 5,
                      fill: '#ddd',
                      width: 300,
                      // height: complexText.height(),
                      height: 200,
                    }"/>
          <v-text
              :key="`text-${item.id}`"
              :config="{
                      // x: item.x,
                      // y: item.y,
                      text:
                        'COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
                      fontSize: 18,
                      fontFamily: 'Calibri',
                      fill: '#555',
                      width: 300,
                      padding: 20,
                      align: 'center',
          }"/>
        </v-group>

        <!--        <Star-->
        <!--            title="Hello"-->
        <!--            :config="{-->
        <!--              draggable: true,-->
        <!--            }"-->
        <!--        ></Star>-->
        <!--        <v-text-path-->
        <!--            @dragstart="onDragstart"-->
        <!--            @dragend="onDragend"-->
        <!--            v-for="item in list"-->
        <!--            :key="item.id"-->
        <!--            :config="{-->
        <!--              x: item.x,-->
        <!--              y: item.y,-->
        <!--              // rotation: item.rotation,-->
        <!--              id: item.id,-->
        <!--              // numPoints: 5,-->
        <!--              // innerRadius: 30,-->
        <!--              // outerRadius: 50, fill: '#a21f58',-->
        <!--              opacity: 0.8,-->
        <!--              draggable: true,-->
        <!--              // scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,-->
        <!--              // scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,-->
        <!--              // shadowColor: 'black',-->
        <!--              // shadowBlur: 10,-->
        <!--              // shadowOffsetX: dragItemId === item.id ? 15 : 5,-->
        <!--              // shadowOffsetY: dragItemId === item.id ? 15 : 5,-->
        <!--              // shadowOpacity: 0.6,-->
        <!--              fontSize: 16,-->
        <!--              fontFamily: 'Arial',-->
        <!--              text: this.title,-->
        <!--              data: 'M5,12 C0,0 10,150 120,100 S350,120 390,50'-->
        <!--            }"></v-text-path>-->

        <!--        <v-star-->
        <!--            @dragstart="onDragstart"-->
        <!--            @dragend="onDragend"-->
        <!--            v-for="item in list"-->
        <!--            :key="item.id"-->
        <!--            :config="{-->
        <!--              x: item.x,-->
        <!--              y: item.y,-->
        <!--              rotation: item.rotation,-->
        <!--              id: item.id,-->
        <!--              numPoints: 5,-->
        <!--              innerRadius: 30,-->
        <!--              outerRadius: 50, fill: '#a21f58',-->
        <!--              opacity: 0.8,-->
        <!--              draggable: true,-->
        <!--              scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,-->
        <!--              scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,-->
        <!--              shadowColor: 'black',-->
        <!--              shadowBlur: 10,-->
        <!--              shadowOffsetX: dragItemId === item.id ? 15 : 5,-->
        <!--              shadowOffsetY: dragItemId === item.id ? 15 : 5,-->
        <!--              shadowOpacity: 0.6-->
        <!--            }"-->
        <!--        ></v-star>-->
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Star from './components/star/Star.vue';

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
  components: {Star},
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
        // Handle single touch, (TODO: cleanup this mess)
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
