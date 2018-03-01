<style scoped lang="less">
@import "../../styles/common.less";
@import './user.less';
</style>
<template>
    <div class="usermain">
        <Row>
            <Col>
                <div class="userbtn">
                    <Button v-permission="['KT Admin']" type="primary" class="ivu-btn-nobtn" @click="showCreateEditModal = true; formItem={}"><img src="../../images/sys-step/user_add.png"><span>新建</span></Button>
                    <Poptip confirm title="您确认删除选中的条目吗？" placement="bottom" v-permission="['KT Admin']" @on-ok="removeAll;">
                        <Button type="error"><img src="../../images/sys-step/user_del.png"><span>删除</span></Button>
                    </Poptip>
                </div>
                <div class="usersearch">
                    <span class="label-name marin-left-5">角色名称</span>
                    <Input v-model="reqParams.keyword" placeholder="按名称搜索" style="width: 200px"></Input>
                    <Button @click="getData" type="primary" style="margin-left:10px;">查询</Button>
                </div>
                <div class="edittable-con-1 clear">
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-border">
                            <table cellpadding="0" cellspacing="0" style="width:100%;word-break: break-all;">
                                <thead>
                                    <tr>
                                        <th style="width:50px">
                                            <label class="usercheck">
                                                <input type="checkbox" class="ivu-checkbox" v-model="checkAll" @click="handleCheckAll" />
                                                <span></span>
                                            </label>
                                        </th>
                                        <th @click="reqParams.orderBy=oroleName?'roleName ASC':'roleName DESC';oroleName=!oroleName;getData();">角色名</th>
                                        <th @click="reqParams.orderBy=oremark?'remark ASC':'remark DESC';oremark=!oremark;getData();">备注</th>
                                        <th style="width:130px">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in resData.list">
                                        <td class="ivu-table-center">
                                            <label class="usercheck">
                                                <input type="checkbox" class="ivu-checkbox" :value="item.id" v-model="checkArr"/>
                                                <span></span>
                                            </label>
                                        </td>
                                        <td>{{item.roleName}}</td>
                                        <td>{{item.remark}}</td>
                                        <td class="ivu-table-center">
                                            <Button type="default" size="small" @click=" showViewDialog(item);">查看</Button>
                                            <Button v-permission="['KT Admin']" type="default" size="small" @click="modify(item)">修改</Button>
                                            <!-- <Poptip confirm title="您确认删除这条内容吗？" placement="left-end" v-permission="['KT Admin']" @on-ok="removeSingl(item);">
                                                <Button type="error" size="small">删除</Button>
                                            </Poptip> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Page style="float:right;padding-top:10px;" :total="resData.pages*resData.size" :current="resData.pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>

                </div>
            </Col>
        </Row>
        <Modal v-model="showViewModal" @on-ok="" title="查看角色">
            <Form :model="formItem" :label-width="80">
                <FormItem label="角色名">
                    <span> {{formItem.roleName}}</span>
                </FormItem>
                <FormItem label="备注">
                    <span> {{formItem.remark}}</span>
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
        <Modal v-model="showCreateEditModal" @on-ok="submitForm" title="新建角色">
            <Form ref="crea_upda_form" :model="formItem" :rules="rules" :label-width="80">
                <FormItem prop="roleName" label="角色名">
                    <Input v-model="formItem.roleName"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
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
export default {
    name: "role-setting",
    data() {
        return {
            oroleName: true,
            oremark: true,
            reqParams: { keyword: "", pageNum: 1, pageSize: 15, orderBy: "" },
            resData: { list: [], pageNum: 0, size: 0 },
            pageSizeOpts: [15, 30, 45],
            showCreateEditModal: false,
            showViewModal: false,
            checkAll: false,
            checkArr: [],
            formItem: {},
            selectedItems: [],
            rules: {
                roleName: [
                    {
                        required: true,
                        message: "角色名不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        getData() {
            let that = this;
            let urlStr = "/sysRole/page";
            that.loading = true;
            axios
                .get(urlStr, { params: this.reqParams })
                .then(function(response) {
                    if (response.data) {
                        that.resData = response.data;
                    }
                    that.loading = false;
                })
                .catch(function(error) {
                    that.loading = false;
                    that.$Message.error(error);
                });
        },
        submitForm(name) {
            let that = this;
            this.$refs.crea_upda_form.validate(valid => {
                if (valid) {
                    let urlStr = "/sysRole";
                    if (this.formItem.id) {
                        //修改
                        axios
                            .put(urlStr, this.formItem)
                            .then(function(response) {
                                if (response.data.code == 0) {
                                    that.getData();
                                    that.showCreateEditModal=false;
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
                                    that.showCreateEditModal=false;
                                } else {
                                    that.$Message.error(response.data.msg);
                                }
                            });
                    }
                }
            });
        },
        remove(ids) {
            let that = this;
            let urlStr = "/sysRole/" + ids;
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
        removeSingl(item) {
            this.remove(item.id);
        },
        removeAll() {
            // 将选中的行id delete到 /sysRole/
            let ids = "";
            this.selectedItems.forEach(item => {
                ids += item.id + "_";
            });
            this.remove(ids);
        },
        tableSelectChange(items) {
            this.selectedItems = items;
        },
        modify(item) {
            this.formItem = JSON.parse(JSON.stringify(item));
            this.showCreateEditModal = true;
        },
        showViewDialog(item) {
            let that = this;
            this.formItem = item;
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
        handleCheckAll(status) {
            if (!this.checkAll) {
                this.checkArr = this.resData.list.map(item => {
                    return item.id;
                });
            } else {
                this.checkArr = [];
            }
        },
        onPageSzieChanged(pageSize) {
            this.reqParams.pageSize = pageSize;
            this.getData();
        },
        onPageChanged(pageNum) {
            this.reqParams.pageNum = pageNum;
            this.getData();
        }
    },
    watch: {
        checkArr() {
            if (this.checkArr.length === this.resData.list.length) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        }
    },
    created() {
        this.loading = true;
        this.getData();
    }
};
</script>
