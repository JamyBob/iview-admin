<style scoped lang="less">
@import "../../styles/common.less";
@import './user.less';
.clear {
    display:block;
    zoom:1;
}
.clear:after {
    clear: both;
    content:".";
    display: block;
    height: 0;
    visibility: hidden;
}
</style>

<template>
    <div class="access">
        <Row>
            <Col span="17">
            <Card class="usermain">
                <p slot="title">
                    <Icon type="android-contact"></Icon>
                    角色列表
                </p>
                <div class="access-user-con access-current-user-con">
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-border">
                            <table cellpadding="0" cellspacing="0" style="width:100%;word-break: break-all;">
                                <thead>
                                    <tr>
                                        <th @click="sysRoleReqParams.orderBy=oroleName?'roleName ASC':'roleName DESC';oroleName=!oroleName;getRoleList();">角色名</th>
                                        <th @click="sysRoleReqParams.orderBy=oremark?'remark ASC':'remark DESC';oremark=!oremark;getRoleList();">备注</th>
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
                </div>
            </Card>
            </Col>
            <Col span="7" class="padding-left-10">
            <Card class="usermain">
                <p slot="title">
                    <Icon type="android-contacts"></Icon>
                    {{currentRole.roleName}} 授权资源列表
                </p>
                <div class="access-user-con access-change-access-con clear">
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
            return axios.get("/sysRole/all", { params: this.sysRoleReqParams }).then(function(response) {
                if (response.data) {
                    that.roleList = response.data;
                }
            });
        },
        getRolePermList() {
            let that = this;
            axios
                .get("/sysRolePermission/all")
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
                if (item.roleId== that.currentRole.id &&permissionIds.indexOf(item.permissionId) == -1) {
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
