<style scoped lang="less">
@import "../../styles/common.less";
@import './user.less';
.ivu-card .ivu-card-body{
    padding:0 !important;
}
</style>

<template>
    <div class="usermain">
        <Row>
            <Col>
                <div class="userbtn">
                    <Button v-permission="['KT Admin']" type="primary" class="ivu-btn-nobtn" @click="showCreateEditModal = true; "><img src="../../images/sys-step/user_add.png"><span>新建</span></Button>
                    <Poptip confirm title="您确认删除选中的条目吗？" placement="bottom" v-permission="['KT Admin']" @on-ok="removeAll;">
                        <Button type="error"><img src="../../images/sys-step/user_del.png"><span>删除</span></Button>
                    </Poptip>
                </div>
                <div class="usersearch">
                    <span class="label-name marin-left-5">用户名称</span>
                    <Input @keydown.enter="getData" v-model="reqParams.keyword" placeholder="按名称搜索" style="width: 200px"></Input>
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
                                        <th @click="reqParams.orderBy=ousername?'username ASC':'username DESC';ousername=!ousername;getData();">登录账户</th>
                                        <th @click="reqParams.orderBy=oname?'name ASC':'name DESC';oname=!oname;getData();">姓名</th>
                                        <th @click="reqParams.orderBy=oemail?'email ASC':'email DESC';oemail=!oemail;getData();">邮箱</th>
                                        <th @click="reqParams.orderBy=omob?'mobile ASC':'mobile DESC';omob=!omob;getData();">电话</th>
                                        <th @click="reqParams.orderBy=opin?'DESC_CODE ASC':'DESC_CODE DESC';opin=!opin;getData();">拼音码</th>
                                        <th>区域</th>
                                        <th>机构</th>
                                        <th style="width:62px;">用户类型</th>
                                        <th style="width:50px;">状态</th>
                                        <th style="width:100px;">操作</th>
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
                                        <td>{{item.username}}</td>
                                        <td>{{item.name}}</td>
                                        <td>{{item.email}}</td>
                                        <td>{{item.mobile}}</td>
                                        <td>{{item.descCode}}</td>
                                        <td>{{listFilter(regionList,item.regionId,'id','pRgname')}}</td>
                                        <td>{{listFilter(deptList,item.deptId,'id','deptName')}}</td>
                                        <td class="ivu-table-center">{{item.userType}}</td>
                                        <td class="ivu-table-center">{{listFilter(statusList,item.status,'id','name')}}</td>
                                        <td class="ivu-table-center">
                                            <Button type="default" size="small" @click=" showViewDialog(item);" style="margin-right:5px;">查看</Button>
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
        <Modal v-model="showCreateEditModal"  v-bind:title="formItem.id?'修改用户':'新建用户'" :styles="{'padding-bottom':'100px'}">
            <Form ref="crea_upda_form" :model="formItem" :rules="rules" :label-width="80">
                <FormItem prop="username" label="登录账户">
                    <Input v-model="formItem.username" placeholder="名称"></Input>
                </FormItem>
                <FormItem prop="name" label="用户名">
                    <Input v-model="formItem.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem prop="descCode" label="拼音码">
                    <Input v-model="formItem.descCode" placeholder="拼音码"></Input>
                </FormItem>
                <FormItem prop="email" label="邮箱">
                    <Input v-model="formItem.email" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem prop="mobile" label="手机">
                    <Input v-model="formItem.mobile" placeholder="手机"></Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="formItem.password" placeholder="密码"></Input>
                </FormItem>
                <FormItem prop="regionId" label="所属机构">
                    <Select v-model="formItem.regionId" @on-change="onRegSelectChanged">
                        <div v-for="item in regionList">
                            <Option v-bind:value="item.id">{{item.pRgname}}</Option>
                        </div>
                    </Select>
                </FormItem>
                <FormItem prop="deptId" label="所属部门">
                    <Select v-model="formItem.deptId">
                        <div v-for="item in cordeptList">
                            <Option v-bind:value="item.id">{{item.deptName}}</Option>
                        </div>
                    </Select>
                </FormItem>
                <FormItem prop="status" label="状态">
                    <RadioGroup v-model="formItem.status">
                        <div style="float:left" v-for="item in statusList">
                            <Radio v-bind:label="item.id">{{item.name}}</Radio>
                        </div>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="roleList" label="角色">
                    <CheckboxGroup v-model="formItem.roleList" class="clear">
                        <div style="float:left" v-for="item in roleList">
                            <Checkbox v-bind:label="item.id">{{item.remark}}</Checkbox>
                        </div>
                    </CheckboxGroup>
                </FormItem>
                <FormItem prop="remark" label="备注">
                    <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
                </FormItem>
                <FormItem style="float:right;">
                    <Button size="large" type="ghost" @click="showCreateEditModal=false">取消</Button>
                    <Button size="large" type="primary" @click="submitForm('formItem')">确定</Button>                   
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="showViewModal" @on-ok="submitForm" title="查看用户">
            <Form :model="formItem" :label-width="80">
                <FormItem label="登录账户" style="margin-bottom:5px;">
                    {{formItem.username}}
                </FormItem>
                <FormItem label="用户名" style="margin-bottom:5px;">
                    {{formItem.name}}
                </FormItem>
                <FormItem label="拼音码" style="margin-bottom:5px;">
                    {{formItem.descCode}}
                </FormItem>
                <FormItem label="邮箱" style="margin-bottom:5px;">
                    {{formItem.email}}
                </FormItem>
                <FormItem label="手机" style="margin-bottom:5px;">
                    {{formItem.mobile}}
                </FormItem>
                <FormItem label="密码" style="margin-bottom:5px;">
                    {{formItem.password}}
                </FormItem>
                <FormItem label="所属机构" style="margin-bottom:5px;">
                    {{listFilter(regionList,formItem.regionId,'id','pRgname')}}
                </FormItem>
                <FormItem label="所属部门" style="margin-bottom:5px;">
                    {{listFilter(deptList,formItem.deptId,'id','deptName')}}
                </FormItem>
                <FormItem label="状态" style="margin-bottom:5px;">
                    {{listFilter(statusList,formItem.status,'id','name')}}
                </FormItem>
                <FormItem label="角色" style="margin-bottom:5px;">
                    {{listFilter(roleList,formItem.roleList,'id','remark')}}
                </FormItem>
                <FormItem label="备注" style="margin-bottom:5px;">
                    {{formItem.remark}}
                </FormItem>
                <FormItem label="创建用户" style="margin-bottom:5px;">
                    <span> {{formItem.createUserName}}</span>
                </FormItem>
                <FormItem label="创建时间" style="margin-bottom:5px;">
                    <span> {{formItem.createTime}}</span>
                </FormItem>
                <FormItem label="更新用户" style="margin-bottom:5px;">
                    <span> {{formItem.updateUserName}}</span>
                </FormItem>
                <FormItem label="更新时间" style="margin-bottom:5px;">
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
            cordeptList: [],
            checkAll: false,
            checkArr: [],
            statusList: [
                { id: "0", name: "未激活" },
                { id: "1", name: "激活" },
                { id: "2", name: "禁用" }
            ],
            formItem: {},
            selectedItems: [],
            rules: {
                username: [
                    { required: true, message: "账号不能为空", trigger: "blur" }
                ],
                name: [ 
                    { required: true, message: "用户名不能为空", trigger: "blur"}
                ],
                descCode: [ 
                    { required: true, message: "拼音码不能为空", trigger: "blur"}
                ],
                password: [ 
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { type: 'string', min: 8,max:20, message: '密码长度必须为8到20位', trigger: 'blur' },
                    { type: 'string',pattern:/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,20}$/, message:'密码必须包含字符、数字、下划线', trigger:'blur'},
                ],
                regionId: [
                        { required: true, message: '所属机构不能为空', trigger: 'change' }
                ],
                deptId: [
                        { required: true, message: '所属部门不能为空', trigger: 'change' }
                ],
                status: [
                        { required: true, message: '必须设置状态', trigger: 'change' }
                ],
                roleList: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个角色', trigger: 'change' },
                ],                    
            }
        };
    },
    methods: {
        listFilter: util.listFilter,
        getRegionList() {
            let that = this;
            return axios
                .get("/ehrPwRegion/getLowerRegionList")
                .then(function(response) {
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
        submitForm(name) {
            let that = this;
            this.$refs.crea_upda_form.validate(valid => {
                if (valid) {
                    let urlStr = "/sysUser";
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
        },
        onRegSelectChanged(regionId) {
            console.log(regionId);
            console.log(this.deptList);
            let that = this;
            this.deptList.forEach(item => {
                if (item.regionId == regionId) {
                    that.cordeptList.push(item);
                }
            });
            console.log(this.cordeptList);
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
