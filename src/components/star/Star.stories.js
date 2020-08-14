import MyStar from './Star.vue';

import Vue from 'vue';
import VueKonva from 'vue-konva';

Vue.use(VueKonva);

export default {
    title: 'Shapes/Misc',
    component: MyStar,
    argTypes: {
        backgroundColor: {control: 'color'},
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {Component: MyStar},
    template: '<v-stage :config="{width: 400,height: 200}"><v-layer><component v-bind="$props"/></v-layer></v-stage>',
});

export const Primary = Template.bind({});
Primary.args = {
    title: 'This is one title',
};

export const Secondary = Template.bind({});
Secondary.args = {
    title: 'This is another title',
};
