<!-- 机构字典维护 -->
<style scoped lang="less">
  @import '../../styles/common.less';
  @import './mentinfo.less';
</style>

<template>
  <div id="sysuser">
    <div class="usermain">
      <!--
      <Row>
        <div class="userbtn">
          <button type="button" class="ivu-btn-nobtn" @click="showModal = true; formItem={}"><img src="../../images/sys-step/user_add.png"><span>添加</span></button>
          <!-- <button type="button" class="ivu-btn-nobtn" @click="editModal"><img src="../../images/sys-step/user_edit.png"><span>修改</span></button> -->
          <!-- <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_export.png"><span>导出</span></button>
          <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_print.png"><span>打印</span></button> -->
          <!-- <button type="button" class="ivu-btn-nobtn"><img src="../../images/sys-step/user_cancel.png"><span>停用</span></button> -->
       <!-- </div>
      </Row>-->
      <Row>
        <div class="usersearch">
          <!-- <span class="label-name">上级科室</span>
          <Select style="width:200px" v-model="searchLevel" placeholder="请选择上级科室">
              <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select> -->
          <span class="label-name">项目名称</span>
          <Input v-model="reqParams.pDesc" placeholder="请输入项目名称" style="width: 200px" />
          <span class="label-name marin-left-5">字典名称</span>
          <Input v-model="reqParams.pFunDesc" placeholder="请输入字典名称" style="width: 200px" />
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
                          <th>字典状态</th>
                          <th>操作</th>
                          <th>添加区域</th>
                          <th>字典国家标准</th>
                          <th>字典编码</th>
                          <th>字典名称</th>
                          <th>项目编码</th>
                          <th>项目名称</th>
                          <th>上级字典</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for ="(user,index) in users.list">
                        <!-- <td style="text-align:center;"><input type="checkbox" name="" v-model="selectedItems" :value="user.id"></td> -->
                        <!-- <td style="text-align:center;">{{index+1}}</td> -->
                        <td style="text-align:center;">
                        <div v-if="user.status == '1'">
                        <Button type="primary" size="small" @click="changeStatus(user.id,'0')">正常</Button>
                        </div>
                        <div v-else-if="user.status == '0'">
                        <Button type="primary" size="small" @click="changeStatus(user.id,'1')">停用</Button>
                        </div>
                         <div v-else>
                        <Button type="primary" size="small">未选择</Button>
                        </div>
                        </td>
                        <td>
                      <div v-if="user.choise == '1'">
                      <button type="button"  class="ivu-btn-edit" ><span>已选择</span></button>
                       </div>
                       <div v-if="user.choise == '0'">
                      <button type="button"  class="ivu-btn-edit" @click="dictDz(user.id)"><span>未选择</span></button>
                       </div>
                        </td>
                     <!--  <td style="text-align:center;"><button type="button" class="ivu-btn-edit"><span>查看</span></button>
                       <span style="padding:5px;color:#2d8cf0;">|</span><button type="button" class="ivu-btn-edit"><span>编辑</span></button></td>-->
                        <td>{{user.areaname}}</td>
                        <td>{{user.pNationalStandards}}</td>
                        <td>{{user.pFunCode}}</td>
                        <td>{{user.pFunDesc}}</td>
                        <td>{{user.pCode}}</td>
                        <td>{{user.pDesc}}</td>
                        <td>{{user.parentId}}</td>
                      </tr>
                  </tbody>
            </table>
          </div>
        </div>
        <template>
            <Page style="float:right" :total="users.pages*users.size" :current="users.pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>
        </template>
      </Row>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import * as table from '../tables/data/search';
export default {
  name: "mech-diction",
  components: {
    
  },
  data() {
    return {
      showModal: false,
      reqParams: { pDesc: "",pFunDesc:"", pageNum: 1, pageSize: 15, orderBy: "" },
      pageSizeOpts: [15, 30, 45],
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
    
      users: {list: [], pageNum: 0, size: 0},
      checkAll: false,
      selectedItems: []
    }
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/ehrPwRegionDict/GetDictAll";
      axios
        .get(urlStr, {
          params: this.reqParams
        })
        .then(function(response) {
          if (response.data) {
             console.log(response.data);
            that.users = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      onPageSzieChanged(pageSize) {
            this.reqParams.pageSize = pageSize;
            this.getData();
        },
    onPageChanged(pageNum) {
            this.reqParams.pageNum = pageNum;
            this.getData();
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
 
    handleSearch3 () {
       this.getData();
    },
    dictDz(id,zt){
       let that = this;
        let urlStr = "/ehrPwRegionDict/saveDictDz";
      axios
        .get(urlStr, {
          params: { id: id, zt:zt}
        })
        .then(function(response) {
          if (response.data) {
            console.log(response.data);
            alert(response.data.msg);
            that.getData();
           // alert(response.data.msg);
           // that.users = response.data.result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleCancel3 () {
        this.data3 = table.searchTable3;
    },
   changeStatus(id,zt){
        let that = this;
        let urlStr = "/ehrPwRegionDict/updateStatus";
      axios
        .get(urlStr, {
          params: { "id":id,"status":zt }
        })
        .then(function(response) {
          if (response.data) {
            //console.log(response.data);
            that.getData();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.getData();
  }
};
</script>

