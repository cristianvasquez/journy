<template>
    <v-text-path v-bind:config="computed_conf" />
<!--    <v-shape :config="{-->
<!--        sceneFunc: function(context) {-->
<!--          context.beginPath();-->
<!--          context.moveTo(20, 50);-->
<!--          context.lineTo(220, 80);-->
<!--          context.quadraticCurveTo(150, 100, 260, 170);-->
<!--          context.closePath();-->
<!--          // special Konva.js method-->
<!--          context.fillStrokeShape(this);-->
<!--        },-->
<!--        fill: '#ff0033',-->
<!--        stroke: 'black',-->
<!--        strokeWidth: 4-->
<!--      }"/>-->
</template>

<script>
import './star.css';

export default {
  name: 'my-star',
  data() {
    return {
      list: [],
      // tp_conf: {
      //   x: 10, y: 30,
      //   fill: '#333',
      //   fontSize: 16,
      //   fontFamily: 'Arial',
      //   text: "This two-story building made out of bricks is a place that shouldn't...",
      //   data: 'M5,12 C0,0 10,150 120,100 S350,120 390,50'
      // },
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true
    }
  },

  computed: {
    computed_conf(){
      let result = this.config
      Object.assign(result, {
        // x: 10, y: 30,
        // fill: '#333',
        fontSize: 16,
        fontFamily: 'Arial',
        text: this.title,
        data: 'M5,12 C0,0 10,150 120,100 S350,120 390,50'
      })
      return result;
    },
    style() {
      return {
        backgroundColor: this.backgroundColor,
      };
    },
  },

  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>
