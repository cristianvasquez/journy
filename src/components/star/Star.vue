<template>
  <div>
    <v-star
        :key="item.id"
        :config="{

            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50, fill: '#a21f58',
            opacity: 0.8,
          }"
    ></v-star>
  </div>
</template>

<script>
import './star.css';

export default {
  name: 'my-star',
  data() {
    return {

    };
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    computed_conf() {
      let result = this.item
      Object.assign(result, {
        // x: 10, y: 30,
        // fill: '#333',
        fontSize: 16,
        fontFamily: 'Arial',
        text: 'Text',
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
