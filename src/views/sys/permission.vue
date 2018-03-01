<style scoped lang="less">
@import "../../styles/common.less";
@import './user.less';
</style>

<template>
    <div class="usermain">
        <Row>
            <Col>
                <div class="userbtn">
                    <Button v-permission="['KT Admin']" type="primary" class="ivu-btn-nobtn" @click="create"><img src="../../images/sys-step/user_add.png"><span>新建根资源</span></Button>
                </div>
                <div class="pertree">
                    <template>
                        <tree-grid :items='resData' :columns='columns' @on-row-click='rowBtnClick' @on-selection-change='selectionClick'></tree-grid>
                    </template> 
                </div>
                
            </Col>
        </Row>
        <Modal v-model="showViewModal" @on-ok="" title="查看资源">
            <Form :model="formItem" :label-width="80">
                <FormItem label="资源名称">
                    <span> {{formItem.menuName}}</span>
                </FormItem>
                <FormItem label="资源类型">
                    <span> {{formItem.pType}}</span>
                </FormItem>
                <FormItem label="资源图标">
                    <span> {{formItem.icon}}</span>
                </FormItem>
                <FormItem label="资源标题">
                    <span> {{formItem.title}}</span>
                </FormItem>
                <FormItem label="层级">
                    <span> {{formItem.menuLevel}}</span>
                </FormItem>
                <FormItem label="排序号">
                    <span> {{formItem.menuOrder}}</span>
                </FormItem>
                <FormItem label="创建用户">
                    <span> {{formItem.createUserName}}</span>
                </FormItem>
                <FormItem label="创建时间">
                    <span> {{formItem.createTime}}</span>
                </FormItem>
                <FormItem label="更新用户">
                    <span> {{formItem.updateUserName}}</span>
                </FormItem>
                <FormItem label="更新时间">
                    <span> {{formItem.updateTime}}</span>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showCreateEditModal" @on-ok="submitForm" title="新建资源">
            <Form ref="crea_upda_form" :model="formItem" :rules="rules" :label-width="80">
                <FormItem prop="menuName" label="资源名称">
                    <Input v-model="formItem.menuName"></Input>
                </FormItem>
                <FormItem prop="pType" label="资源类型">
                    <Input v-model="formItem.pType"></Input>
                </FormItem>
                <FormItem prop="icon" label="资源图标">
                    <Input v-model="formItem.icon"></Input>
                </FormItem>
                <FormItem prop="title" label="资源标题">
                    <Input v-model="formItem.title"></Input>
                </FormItem>
                <FormItem style="float:right;">
                    <Button size="large" type="ghost" @click="showCreateEditModal=false">取消</Button>
                    <Button size="large" type="primary" @click="submitForm('formItem')">确定</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import axios from "axios";
import util from "@/libs/util";
import TreeGrid from "../main-components/TreeGrid";
export default {
    name: "permission-setting",
    components: { TreeGrid },
    data() {
        return {
            reqParams: { keyword: "", orderBy: "MENU_ORDER" },
            resData: [],
            showModal: false,
            formItem: {},
            selectedItems: [],
            showCreateEditModal: false,
            showViewModal: false,
            columns: [
                {
                    title: "资源名称",
                    key: "menuName"
                },
                {
                    title: "资源类型",
                    key: "pType"
                },
                {
                    title: "资源标题",
                    key: "title"
                },
                {
                    title: "操作",
                    type: "action",
                    align: "center",
                    actions: [
                        {
                            type: "default",
                            text: "查看"
                        },
                        {
                            type: "default",
                            text: "新建子资源"
                        },
                        {
                            type: "default",
                            text: "编辑"
                        },
                        {
                            type: "default",
                            text: "上移"
                        },
                        {
                            type: "default",
                            text: "下移"
                        },
                        {
                            type: "error",
                            text: "删除"
                        }
                    ]
                }
            ],
            rules: {
                menuName: [
                    {
                        required: true,
                        message: "资源名称不能为空",
                        trigger: "blur"
                    }
                ],
                pType:[
                    {
                        required: true,
                        message: "资源类型不能为空",
                        trigger: "blur"
                    }
                ],
                 icon:[
                    {
                        required: true,
                        message: "资源图标不能为空",
                        trigger: "blur"
                    }
                ],
                title: [
                    {
                        required: true,
                        message: "资源标题不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        getData() {
            let that = this;
            let urlStr = "/sysPermission/all";
            axios
                .get(urlStr, { params: this.reqParams })
                .then(function(response) {
                    if (response.data) {
                        that.resData = util.getJsonTree(response.data, "#");
                    }
                });
        },
        submitForm(name) {
            let that = this;
            this.$refs.crea_upda_form.validate(valid => {
                if (valid) {
                    let urlStr = "/sysPermission";
                    if (this.formItem.id) {
                        //修改
                        axios
                            .put(urlStr, this.formItem)
                            .then(function(response) {
                                if (response.data.code == 0) {
                                    that.getData();
                                    that.showCreateEditModal = false;
                                } else {
                                    that.$Message.error(response.data.msg);
                                }
                            });
                    } else {
                        //新建
                        axios
                            .post(urlStr, this.formItem)
                            .then(function(response) {
                                if (response.data.code == 0) {
                                    that.getData();
                                    that.showCreateEditModal = false;
                                } else {
                                    that.$Message.error(response.data.msg);
                                }
                            });
                    }
                }
            });
        },
        create() {
            this.formItem = {};
            this.formItem.parentId = "#";
            this.formItem.menuLevel = 0;
            this.formItem.menuOrder = 0;
            this.showCreateEditModal = true;
        },
        showViewDialog() {
            let that = this;
            var getCreUsr = new Promise(function(resolve, reject) {
                axios
                    .get("/sysUser/" + that.formItem.createUserId)
                    .then(function(response) {
                        if (response.data) {
                            that.formItem.createUserName = response.data.name;
                        } else {
                            that.formItem.createUserName = "未查到创建用户";
                        }
                        resolve();
                    });
            });
            var getUpUsr = new Promise(function(resolve, reject) {
                axios
                    .get("/sysUser/" + that.formItem.updateUserId)
                    .then(function(response) {
                        if (response.data) {
                            that.formItem.updateUserName = response.data.name;
                        } else {
                            that.formItem.updateUserName = "未查到更新用户";
                        }
                        resolve();
                    });
            });
            Promise.all([getCreUsr, getUpUsr])
                .then(function() {
                    that.showViewModal = true;
                })
                .catch(function(err) {
                    that.$Message.error(err);
                    that.showViewModal = true;
                });
        },
        remove(ids) {
            let that = this;
            let urlStr = "/sysPermission/" + ids;
            axios
                .delete(urlStr, {
                    params: {}
                })
                .then(function(response) {
                    if (response.data.code == 0) {
                        that.$Message.success("删除成功");
                        that.getData();
                    }
                });
        },
        rowBtnClick(item, index, event, text) {
            this.formItem = JSON.parse(JSON.stringify(item));
            if (text == "查看") {
                this.showViewDialog();
            } else if (text == "新建子资源") {
                this.formItem = {};
                this.formItem.parentId = item.id;
                this.formItem.menuLevel = 0;
                if (this.formItem.children) {
                    this.formItem.menuOrder = this.formItem.children.length;
                } else {
                    this.formItem.menuOrder = 0;
                }
                this.showCreateEditModal = true;
            } else if (text == "编辑") {
                this.showCreateEditModal = true;
            } else if (text == "删除") {
                this.remove(item.id);
            } else if (text == "上移") {
                this.formItem.menuOrder = parseInt(this.formItem.menuOrder) - 1;
                this.submitForm();
            } else if (text == "下移") {
                this.formItem.menuOrder = parseInt(this.formItem.menuOrder) + 1;
                this.submitForm();
            }
        },
        selectionClick(arr) {
            //console.log("选中数据id数组:" + arr);
        }
    },
    created() {
        this.getData();
    }
};
</script>
