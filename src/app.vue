<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    global.showLoginBox=true;
    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main{
    width: 100%;
    height: 100%;
}
::-webkit-scrollbar-track {
    background-color: #f5f5f5;
}

::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
    background-color: #999;
}
</style>
