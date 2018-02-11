<style lang="less">
@import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" src="../images/logo.jpg" key="max-logo" />
                    <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <message-tip v-model="mesCount"></message-tip>
                    <theme-switch></theme-switch>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>

        <Modal v-model="showLoginModal" :mask-closable="false">
            <div class="login" @keydown.enter="handleSubmit">
                <div class="login-con">
                    <Card :bordered="false">
                        <p slot="title">
                            <Icon type="log-in"></Icon>
                            欢迎登录
                        </p>
                        <div class="form-con">
                            <Form ref="loginForm" :model="form" :rules="rules">
                                <FormItem prop="userName">
                                    <Input v-model="form.userName" placeholder="请输入用户名">
                                    <span slot="prepend">
                                        <Icon :size="16" type="person"></Icon>
                                    </span>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Input type="password" v-model="form.password" placeholder="请输入密码">
                                    <span slot="prepend">
                                        <Icon :size="14" type="locked"></Icon>
                                    </span>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import themeSwitch from "./main-components/theme-switch/theme-switch.vue";
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import axios from "axios";
import Bus from "../libs/bus";

export default {
    components: {
        shrinkableMenu,
        tagsPageOpened,
        breadcrumbNav,
        fullScreen,
        lockScreen,
        messageTip,
        themeSwitch
    },
    data() {
        return {
            showLoginModal: false,
            shrink: false,
            userName: "",
            isFullScreen: false,
            openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
            form: {
                userName: "admin",
                password: "admin"
            },
            rules: {
                userName: [
                    { required: true, message: "账号不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" }
                ]
            }
        };
    },
    computed: {
        menuList() {
            return this.$store.state.app.menuList;
        },
        pageTagsList() {
            return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
        },
        currentPath() {
            return this.$store.state.app.currentPath; // 当前面包屑数组
        },
        avatorPath() {
            return localStorage.avatorImgPath;
        },
        cachePage() {
            return this.$store.state.app.cachePage;
        },
        lang() {
            return this.$store.state.app.lang;
        },
        menuTheme() {
            return this.$store.state.app.menuTheme;
        },
        mesCount() {
            return this.$store.state.app.messageCount;
        }
    },
    methods: {
        init() {
            let pathArr = util.setCurrentPath(this, this.$route.name);
            this.$store.commit("updateMenulist");
            if (pathArr.length >= 2) {
                this.$store.commit("addOpenSubmenu", pathArr[1].name);
            }
            this.userName = JSON.parse(Cookies.get("user")).username;
            let messageCount = 3;
            this.messageCount = messageCount.toString();
            this.checkTag(this.$route.name);
            this.$store.commit("setMessageCount", 3);
        },
        toggleClick() {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown(name) {
            if (name === "ownSpace") {
                util.openNewPage(this, "ownspace_index");
                this.$router.push({
                    name: "ownspace_index"
                });
            } else if (name === "loginout") {
                // 退出登录
                this.$store.commit("logout", this);
                this.$store.commit("clearOpenedSubmenu");
                this.$router.push({
                    name: "login"
                });
            }
        },
        checkTag(name) {
            let openpageHasTag = this.pageTagsList.some(item => {
                if (item.name === name) {
                    return true;
                }
            });
            if (!openpageHasTag) {
                //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                util.openNewPage(
                    this,
                    name,
                    this.$route.params || {},
                    this.$route.query || {}
                );
            }
        },
        handleSubmenuChange(val) {
            // console.log(val)
        },
        beforePush(name) {
            // if (name === 'accesstest_index') {
            //     return false;
            // } else {
            //     return true;
            // }
            return true;
        },
        fullscreenChange(isFullScreen) {
            // console.log(isFullScreen);
        },
        handleSubmit() {
            let that = this;
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    let urlStr = "/oauth/login";
                    let postData = {
                        username: this.form.userName,
                        password: this.form.password
                    };
                    axios
                        .post(urlStr, postData)
                        .then(function(response) {
                            console.log(response);
                            //登录成功保存用户登录状态
                            if (response.data.code == 0) {
                                Cookies.set("user", response.data.result);
                                that.$store.commit(
                                    "setAvator",
                                    "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
                                );
                                //设置当前用户权限，权限列表将与/router/router.js中配置的节点access字符串相匹配确定是否显示此菜单，匹配操作见/store/app.js/updateMenulist()
                                Cookies.set(
                                    "access",
                                    response.data.result.permissions
                                );
                                //跳转到主页
                                that.showLoginModal = false;
                                that.$Message.info("登录成功");
                            } else {
                                that.$Message.warning(response.data.msg);
                            }
                        })
                        .catch(function(error) {
                            that.$Message.warning("登录出错");
                        });
                }
            });
        }
    },
    watch: {
        $route(to) {
            this.$store.commit("setCurrentPageName", to.name);
            let pathArr = util.setCurrentPath(this, to.name);
            if (pathArr.length > 2) {
                this.$store.commit("addOpenSubmenu", pathArr[1].name);
            }
            this.checkTag(to.name);
            localStorage.currentPageName = to.name;
        },
        lang() {
            util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
        }
    },
    mounted() {
        let that = this;
        Bus.$on("relogin", e => {
            //console.log(e);
            that.showLoginModal = true;
        });
        this.init();
    },
    created() {
        // 显示打开的页面的列表
        this.$store.commit("setOpenedList");
    }
};
</script>
