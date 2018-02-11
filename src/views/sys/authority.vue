<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div class="access">
        <Row>
            <Col span="12">
            <Card>
                <p slot="title">
                    <Icon type="android-contact"></Icon>
                    角色列表
                </p>
                <div class="access-user-con access-current-user-con">
                    <div class="ivu-table ivu-table-border">
                        <table style="width:100%;word-break: break-all;">
                            <thead>
                                <tr>
                                    <th @click="oroleName?sysRoleReqParams.orderBy='roleName ASC':sysRoleReqParams.orderBy='roleName DESC';oroleName=!oroleName;getRolePermList();">角色名</th>
                                    <th @click="oremark?sysRoleReqParams.orderBy='remark ASC':sysRoleReqParams.orderBy='remark DESC';oremark=!oremark;getRolePermList();">备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in roleList" @click="onRoleItemClick(item)">
                                    <td>{{item.roleName}}</td>
                                    <td>{{item.remark}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
            </Col>
            <Col span="12" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="android-contacts"></Icon>
                    {{currentRole.roleName}}授权资源列表
                </p>
                <div class="access-user-con access-change-access-con">
                    <Col span="24" class="padding-left-10">
                    <Row type="flex" justify="center" align="middle" class="access-change-access-con-row">
                        <Tree :data="permissionTree" @on-check-change="onTreeNodeCheck" show-checkbox multiple></Tree>
                    </Row>
                    </Col>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import axios from "axios";
import util from "@/libs/util";
export default {
    name: "demo-crud",
    data() {
        return {
            oroleName: true,
            oremark: true,
            sysRoleReqParams: { keyword: "", orderBy: "" },
            sysRoleResData: { list: [], pageNum: 0, size: 0 },
            permissionTree: [],
            permissionList: [],
            roleList: [],
            rolePermList: [],
            currentRole: { roleName: "" }
        };
    },
    methods: {
        getpermissionTree() {
            let that = this;
            return axios.get("/sysPermission/all").then(function(response) {
                if (response.data) {
                    that.permissionList = response.data;
                    that.permissionTree = util.getJsonTree(
                        that.permissionList,
                        "#"
                    );
                }
            });
        },
        getRoleList() {
            let that = this;
            return axios.get("/sysRole/all").then(function(response) {
                if (response.data) {
                    that.roleList = response.data;
                }
            });
        },
        getRolePermList() {
            let that = this;
            let urlStr = "/sysRolePermission/all";
            axios
                .get(urlStr, { params: this.sysRoleReqParams })
                .then(function(response) {
                    if (response.data) {
                        that.rolePermList = response.data;
                        if (that.currentRole) {
                            that.onRoleItemClick(that.currentRole);
                        }
                    }
                });
        },
        onRoleItemClick(roleItem) {
            this.currentRole = roleItem;
            let hasPermList = [];
            for (let item of this.rolePermList) {
                if (item.roleId == roleItem.id) {
                    hasPermList.push(item.permissionId);
                }
            }
            for (let item of this.permissionList) {
                if (hasPermList.indexOf(item.id) != -1) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            }
            this.currentRole.hasPermList = hasPermList;
            this.permissionTree = util.getJsonTree(this.permissionList, "#");
        },
        onTreeNodeCheck(permissions) {
            let that = this;
            let permissionIds = [];
            if (!that.currentRole.id) {
                that.$Message.info("请先选择角色");
                return;
            }
            // 添加权限
            let addPermission = [];
            for (let item of permissions) {
                permissionIds.push(item.id);
                if (that.currentRole.hasPermList.indexOf(item.id) == -1) {
                    addPermission.push(item);
                }
            }
            if (addPermission.length > 0) {
                let rolPerList = [];
                for (let item of addPermission) {
                    rolPerList.push({
                        permissionId: item.id,
                        roleId: that.currentRole.id
                    });
                }
                axios
                    .post("/sysRolePermission/all", rolPerList)
                    .then(function(response) {
                        if (response.data.code == 0) {
                            that.$Message.success("添加权限成功");
                            that.getRolePermList();
                        }
                    });
                return;
            }
            //删除权限
            let removePermissions = [];
            for (let item of that.rolePermList) {
                if (permissionIds.indexOf(item.permissionId) == -1) {
                    removePermissions.push(item);
                }
            }
            if (removePermissions) {
                let ids = "";
                for (let item of removePermissions) {
                    ids += item.id + "_";
                }
                axios
                    .delete("/sysRolePermission/" + ids)
                    .then(function(response) {
                        if (response.data.code == 0) {
                            that.$Message.success("删除权限成功");
                            that.getRolePermList();
                        }
                    });
            }
        }
    },
    created() {
        let that = this;
        Promise.all([that.getRoleList(), that.getpermissionTree()])
            .then(function() {
                that.getRolePermList();
            })
            .catch(function(err) {
                that.$Message.error(err);
            });
    }
};
</script>
