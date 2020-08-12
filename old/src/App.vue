<template>
    <div id="app">
        <b-card no-body>
            <b-tabs card>
                <b-tab no-body title="Edit">
                    <codemirror id="editArea" v-model="msg" :options="cmOptions" ref='codemirror'></codemirror>
                </b-tab>

                <b-tab no-body title="View">
                    <VueShowdown id="viewArea" :markdown="msg" />
                </b-tab>

                <b-tab no-body title="History">
                    <VueShowdown id="viewArea" :markdown="msg" />
                </b-tab>
                <b-tab title="Config">
                    <div>
                        <div class="mt-3">Current notebook: <strong>{{ currentNotebookId }}</strong></div>
                        <b-form-group label="Available:">
                            <ul v-if="folders && folders.length">
                                <b-form-radio v-bind:key="folder.id" v-for="folder of folders" v-model="currentNotebookId"
                                    name="some-radios" :value="folder.id">
                                    {{folder.title}}</b-form-radio>
                            </ul>
                        </b-form-group>
                    </div>
                </b-tab>
            </b-tabs>
            <ul v-if="errors && errors.length">
                <li :key="i" v-for="(error, i) of errors">
                    {{error.message}}
                </li>
            </ul>
        </b-card>

    </div>
</template>

<script>
    const axios = require('axios');
    const config = require('./config').config

    function getCurrentDate() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return '> ' + dateTime + '\n\n'
    }

    export default {
        name: 'app',
        data() {
            return {
                msg: '`journy` is? easy to use :kissing_heart:\n\nPress `ctrl + space` to preview markdown ',
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'markdown',
                    theme: 'lesser-dark',
                    lineNumbers: false,
                    lineWrapping: true,
                    line: true,
                },
                currentFolderID: '',
                folders: [],
                errors: []
            }
        },
        methods: {},
        created() {
            this.currentNotebookId = config.currentNotebookId;
            axios.get(config.host + "/folders", config.options)
                .then(response => {
                    this.folders = response.data
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        props: {
            list: Array,
        },
    }
</script>

<style>

</style>
