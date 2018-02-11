<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div>
        <Row>
            <Col>
            <Card>
                <Button v-permission="['KT Admin']" type="primary" @click="showCreateEditModal = true; formItem={}">新建</Button>
                <Poptip confirm title="您确认删除选中的条目吗？" placement="bottom" v-permission="['KT Admin']" @on-ok="removeAll;">
                    <Button type="error">批量删除</Button>
                </Poptip>
                <Input @keydown.enter="getData" v-model="reqParams.keyword" placeholder="按名称搜索" style="width: 200px"></Input>
                <Button @click="getData" type="primary" shape="circle" icon="ios-search">Search</Button>
                <div class="edittable-con-1">
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-border">
                            <table style="width:100%;word-break: break-all;">
                                <thead>
                                    <tr>
                                        <th style="width:50px">
                                            <input type="checkbox" v-model="checkAll" @click="handleCheckAll" />
                                        </th>
                                        <th @click="ousername?reqParams.orderBy='username ASC':reqParams.orderBy='username DESC';ousername=!ousername;getData();">登录账户</th>
                                        <th @click="oname?reqParams.orderBy='name ASC':reqParams.orderBy='name DESC';oname=!oname;getData();">姓名</th>
                                        <th @click="oemail?reqParams.orderBy='email ASC':reqParams.orderBy='email DESC';oemail=!oemail;getData();">邮箱</th>
                                        <th @click="omob?reqParams.orderBy='mobile ASC':reqParams.orderBy='mobile DESC';omob=!omob;getData();">电话</th>
                                        <th @click="opin?reqParams.orderBy='DESC_CODE ASC':reqParams.orderBy='DESC_CODE DESC';opin=!opin;getData();">拼音码</th>
                                        <th>区域</th>
                                        <th>机构</th>
                                        <th>用户类型</th>
                                        <th>状态</th>
                                        <th style="width:130px">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in resData.list">
                                        <td>
                                           <input type="checkbox" :value="item.id" v-model="checkArr"/>
                                        </td>
                                        <td>{{item.username}}</td>
                                        <td>{{item.name}}</td>
                                        <td>{{item.email}}</td>
                                        <td>{{item.mobile}}</td>
                                        <td>{{item.descCode}}</td>
                                        <td>{{listFilter(regionList,item.regionId,'id','pRgname')}}</td>
                                        <td>{{listFilter(deptList,item.deptId,'id','deptName')}}</td>
                                        <td>{{item.userType}}</td>
                                        <td>{{listFilter(statusList,item.status,'id','name')}}</td>
                                        <td>
                                            <Button type="primary" size="small" @click=" showViewDialog(item);">查看</Button>
                                            <Button v-permission="['KT Admin']" type="primary" size="small" @click="modify(item)">修改</Button>
                                            <Poptip confirm title="您确认删除这条内容吗？" placement="left-end" v-permission="['KT Admin']" @on-ok="removeSingl(item);">
                                                <Button type="error" size="small">删除</Button>
                                            </Poptip>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Page :total="resData.pages*resData.size" :current="resData.pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>

                </div>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showCreateEditModal" @on-ok="submitForm" v-bind:title="formItem.id?'修改用户':'新建用户'">
            <Form :model="formItem" :label-width="80">
                <FormItem label="登录账户">
                    <Input v-model="formItem.username" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model="formItem.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="拼音码">
                    <Input v-model="formItem.descCode" placeholder="拼音码"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="formItem.email" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem label="手机">
                    <Input v-model="formItem.mobile" placeholder="手机"></Input>
                </FormItem>
                <FormItem label="密码">
                    <Input type="password" v-model="formItem.password" placeholder="密码"></Input>
                </FormItem>
                <FormItem label="所属机构">
                    <Select v-model="formItem.regionId">
                        <div v-for="item in regionList">
                            <Option v-bind:value="item.id">{{item.pRgname}}</Option>
                        </div>
                    </Select>
                </FormItem>
                <FormItem label="所属部门">
                    <Select v-model="formItem.deptId">
                        <div v-for="item in deptList">
                            <Option v-bind:value="item.id">{{item.deptName}}</Option>
                        </div>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <RadioGroup v-model="formItem.status">
                        <div style="float:left" v-for="item in statusList">
                            <Radio v-bind:label="item.id">{{item.name}}</Radio>
                        </div>
                    </RadioGroup>
                </FormItem>
                <FormItem label="角色">
                    <CheckboxGroup v-model="formItem.roleList">
                        <div style="float:left" v-for="item in roleList">
                            <Checkbox v-bind:label="item.id">{{item.remark}}</Checkbox>
                        </div>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showViewModal" @on-ok="submitForm" title="查看用户">
            <Form :model="formItem" :label-width="80">
                <FormItem label="登录账户">
                    {{formItem.username}}
                </FormItem>
                <FormItem label="用户名">
                    {{formItem.name}}
                </FormItem>
                <FormItem label="拼音码">
                    {{formItem.descCode}}
                </FormItem>
                <FormItem label="邮箱">
                    {{formItem.email}}
                </FormItem>
                <FormItem label="手机">
                    {{formItem.mobile}}
                </FormItem>
                <FormItem label="密码">
                    {{formItem.password}}
                </FormItem>
                <FormItem label="所属机构">
                    {{listFilter(regionList,formItem.regionId,'id','pRgname')}}
                </FormItem>
                <FormItem label="所属部门">
                    {{listFilter(deptList,formItem.deptId,'id','deptName')}}
                </FormItem>
                <FormItem label="状态">
                    {{listFilter(statusList,formItem.status,'id','name')}}
                </FormItem>
                <FormItem label="角色">
                    {{listFilter(roleList,formItem.roleList,'id','remark')}}
                </FormItem>
                <FormItem label="备注">
                    {{formItem.remark}}
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
    </div>
</template>

<script>
import axios from "axios";
import util from "@/libs/util";
export default {
    name: "user-setting",
    data() {
        return {
            ousername: true,
            oname: true,
            oemail: true,
            omob: true,
            opin: true,
            reqParams: { keyword: "", pageNum: 1, pageSize: 15, orderBy: "" },
            resData: { list: [], pageNum: 0, size: 0 },
            pageSizeOpts: [15, 30, 45],
            showCreateEditModal: false,
            showViewModal: false,
            roleList: [],
            regionList: [],
            deptList: [],
            checkAll: false,
            checkArr: [],
            statusList: [
                { id: "0", name: "未激活" },
                { id: "1", name: "激活" },
                { id: "2", name: "禁用" }
            ],
            formItem: {},
            selectedItems: []
        };
    },
    methods: {
        listFilter: util.listFilter,
        getRegionList() {
            let that = this;
            return axios.get("/ehrPwRegion/all").then(function(response) {
                if (response.data) {
                    that.regionList = response.data;
                }
            });
        },
        getDeptList() {
            let that = this;
            return axios.get("/ehrPwDept/all").then(function(response) {
                if (response.data) {
                    that.deptList = response.data;
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
        getData() {
            let that = this;
            axios
                .get("/sysUser/page", { params: this.reqParams })
                .then(function(response) {
                    if (response.data) {
                        that.resData = response.data;
                    } 
                })
                .catch(function(error) {
                    that.$Message.error(error);
                });
        },
        submitForm() {
            let that = this;
            let urlStr = "/sysUser";
            if (this.formItem.id) {
                //修改
                axios.put(urlStr, this.formItem).then(function(response) {
                    if (response.data.code == 0) {
                        that.getData();
                    } else {
                        that.$Message.error(response.data.msg);
                    }
                });
            } else {
                //新建
                axios.post(urlStr, this.formItem).then(function(response) {
                    if (response.data.code == 0) {
                        that.getData();
                    } else {
                        that.$Message.error(response.data.msg);
                    }
                });
            }
        },
        remove(ids) {
            let that = this;
            axios
                .delete("/sysUser/" + ids, {
                    params: {}
                })
                .then(function(response) {
                    if (response.data) {
                        that.$Message.success("删除成功");
                        that.getData();
                    }
                })
                .catch(function(error) {
                    that.$Message.error("删除失败");
                });
        },
        removeSingl(item) {
            this.remove(item.id);
        },
        removeAll() {
            // 将选中的行id delete到 /sysUser/
            let ids = "";
            this.selectedItems.forEach(item => {
                ids += item.id + "_";
            });
            this.remove(ids);
        },
        modify(item) {
            this.formItem = JSON.parse(JSON.stringify(item));
            this.formItem.disabled = false;
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
                });
        },
        handleCheckAll(status) {
             if (!this.checkAll) {
            this.checkArr = this.resData.list.map(item => {
              return item.id
            })
          } else {
            this.checkArr = []
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
            this.checkAll = true
          } else {
            this.checkAll = false
          }
        }
      },
    created() {
        let that = this;
        Promise.all([
            that.getRoleList(),
            that.getRegionList(),
            that.getDeptList()
        ])
            .then(function() {
                that.getData();
            })
            .catch(function(err) {
                that.$Message.error(err);
            });
    }
};
</script>
