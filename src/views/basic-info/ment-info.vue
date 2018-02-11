<!-- 机构科室信息维护 -->
<style scoped lang="less">
  @import '../../styles/common.less';
  @import './mentinfo.less';
</style>

<template>
  <div id="sysuser">
    <div class="usermain">
      <Row>
        <div class="userbtn">
          <button type="button" class="ivu-btn-nobtn" @click="showModal = true; formItem={}"><img src="../../images/sys-step/user_add.png"><span>添加</span></button>
          <!-- <button type="button" class="ivu-btn-nobtn" @click="editModal"><img src="../../images/sys-step/user_edit.png"><span>修改</span></button> -->
          <!-- <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_export.png"><span>导出</span></button>
          <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_print.png"><span>打印</span></button> -->
          <!-- <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_cancel.png"><span>停用</span></button> -->
        </div>
      </Row>
      <Row>
        <div class="usersearch">
          <!-- <span class="label-name">上级科室</span>
          <Select style="width:200px" v-model="searchLevel" placeholder="请选择上级科室">
              <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select> -->
          <span class="label-name marin-left-5">机构名称</span>
          <Input v-model="searchConName3" placeholder="请输入机构名称" style="width: 200px" />
          <span class="label-name marin-left-5">科室名称</span>
          <Input v-model="searchConName3" placeholder="请输入科室名称" style="width: 200px" />
          <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary">查询</Button></span>
          <!-- <Button @click="handleCancel3" type="ghost" >取消</Button> -->
        </div>
      </Row>
      <Row class="searchable-table-con1" style="padding:0 20px 10px;">
          <!-- <Table :columns="columnsUser" :data="data3"></Table> -->
          <div class="ivu-table-wrapper">
            <div class="ivu-table ivu-table-border">
              <table cellspacing="0" cellpadding="0" style="width:100%;">
                  <thead>
                      <tr>
                          <!-- <th><input type="checkbox" name="" v-model="checkAll" @click="SelectAll"></th> -->
                          <!-- <th>序号</th> -->
                          <th>科室状态</th>
                          <th>操作</th>
                          <th>科室名称</th>
                          <th>上级科室</th>
                          <th>机构名称</th>
                          <th>创建人员</th>
                          <th>创建时间</th>
                          <th>更新人员</th>
                          <th>更新时间</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for ="(user,index) in users">
                        <!-- <td style="text-align:center;"><input type="checkbox" name="" v-model="selectedItems" :value="user.id"></td> -->
                        <!-- <td style="text-align:center;">{{index+1}}</td> -->
                        <td style="text-align:center;"><Button type="primary" size="small">正常</Button></td>
                        <td style="text-align:center;"><button type="button" class="ivu-btn-edit"><span>查看</span></button><span style="padding:5px;color:#2d8cf0;">|</span><button type="button" class="ivu-btn-edit"><span>编辑</span></button></td>
                        <td>{{user.username}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.phone}}</td>
                        <td>{{user.website}}</td>
                        <td></td>
                        <td></td>
                      </tr>
                  </tbody>
            </table>
          </div>
        </div>
        <template>
            <Page :total="users.length" size="small" show-total show-elevator></Page>
        </template>
      </Row>
    </div>
    <Modal v-model="showModal" @on-ok="submitForm" title="新建用户">
        <Form :model="formItem" :label-width="80" >
            <FormItem label="用户名">
                <Input v-model="formItem.username" placeholder="名称" ></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="formItem.email" placeholder="邮箱"></Input>
            </FormItem>
            <FormItem label="手机">
                <Input v-model="formItem.mobile" placeholder="手机"></Input>
            </FormItem>
            <FormItem label="密码">
                <Input v-model="formItem.password" placeholder="密码"></Input>
            </FormItem>
            <FormItem label="所属部门">
                <Select v-model="formItem.select">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="状态">
                <RadioGroup v-model="formItem.status">
                    <Radio label="0">未激活</Radio>
                    <Radio label="1">激活</Radio>
                    <Radio label="2">锁定</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="角色">
                <CheckboxGroup v-model="formItem.checkbox">
                    <Checkbox label="Eat">管理员</Checkbox>
                    <Checkbox label="Sleep">用户</Checkbox>
                    <Checkbox label="Run">部门经理</Checkbox>
                    <Checkbox label="Movie">临时用户</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="formItem.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import * as table from '../tables/data/search';
export default {
  name: "ment-info",
  components: {
    
  },
  data() {
    return {
      showModal: false,
      formItem: {
        disabled: false,
        username: "",
        email: "",
        mobile: "",
        password: "",
        select: "",
        status: "0",
        checkbox: [],
        switch: true,
        comment: ""
      },
      searchLevel: '',
      searchConName3: '',
      articleStateList: [{value: '省'}, {value: '市'}, {value: '县(区)'}, {value: '街道(镇)'}, {value: '片区'}, {value: '村(居委会)'},{value: '村(居委会)'},],
      // columnsUser: [
      //   {
      //     type: "selection",
      //     align: "center",
      //     width: 50,
      //   },
      //   {
      //     key:'id',
      //     title:'序号',
      //     width: 60,
      //     align: "center",
      //   },
      //   {
      //     key:'tel',
      //     title:'机构编码'
      //   },
      //   {
      //     key:'name',
      //     title:'机构名称'
      //   },
      //   {
      //     key:'website',
      //     title:'机构级别'
      //   },
      //   {
      //     key:'',
      //     title:'负责人'
      //   },
      //   {
      //     key:'',
      //     title:'联系人'
      //   },
      //   {
      //     key:'phone',
      //     title:'联系电话'
      //   },
      //   {
      //     key:'',
      //     title:'城镇人口数'
      //   },
      //   {
      //     key:'',
      //     title:'农村人口数'
      //   },
      //   {
      //     key:'',
      //     title:'总人口数'
      //   },
      //   {
      //     key:'',
      //     title:'备注'
      //   },
      // ],
      users: [],
      checkAll: false,
      selectedItems: []
    }
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/sysUser/page";
      axios
        .get(urlStr, {
          params: { keyword: this.keyword }
        })
        .then(function(response) {
          if (response.data) {
            // console.log(response.data);
            that.users = response.data.list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submitForm() {
      let that = this;
      let urlStr = "/sysUser";
      if (this.formItem.id) {
        //修改
        axios
          .put(urlStr, this.formItem)
          .then(function(response) {
            console.log(response);
            if (response.data.code == 0) {
              that.getData();
            } else {
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //新建
        axios
          .post(urlStr, this.formItem)
          .then(function(response) {
            // console.log(response);
            if (response.data.code == 0) {
              that.getData();
            } else {
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    editModal(){
      var index = this.selectedItems - 1;
      var indexs = this.selectedItems;
      alert(indexs);
      if(indexs.length>1){
        alert("只能选择一条数据！");
      }else if(indexs.length == 0){
        alert("请选择一条数据！");
      }else{
        // this.formItem = this.users[indexs];
        // this.formItem.disabled = false;
        this.showModal = true;
      }
      
    },
    SelectAll() {
      if (!this.checkAll) {
        this.selectedItems = this.users.map(user => {
          return user.id
        })
      } else {
        this.selectedItems = []
      }

    },
    search (data, argumentObj) {
        let res = data;
        let dataClone = data;
        for (let argu in argumentObj) {
            if (argumentObj[argu].length > 0) {
                res = dataClone.filter(d => {
                    return d[argu].indexOf(argumentObj[argu]) > -1;
                });
                dataClone = res;
            }
        }
        return res;
    },
    handleSearch3 () {
        // if(this.searchConName3 == ''){
        //   alert("请输入搜索条件");
        // }
        this.data3 = this.search(this.data3, {name: this.searchConName3});
        console.log(this.searchLevel + '--' + this.searchConName3);
    },
    handleCancel3 () {
        this.data3 = table.searchTable3;
    },
  },
  created() {
    this.getData();
  }
};
</script>

