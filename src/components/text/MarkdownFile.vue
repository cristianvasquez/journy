<template>
  <div>
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
                        item.title+'\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
                      fontSize: 18,
                      fontFamily: 'Calibri',
                      fill: '#555',
                      width: 300,
                      padding: 20,
                      align: 'center',
          }"/>
  </div>

</template>

<script>
import './MarkdownFile.css';

export default {
  name: 'markdown-file',
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

  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>
