<!-- 区域字典维护 -->
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
          <span class="label-name">项目名称</span>
          <Input v-model="reqParams.pDesc" placeholder="请输入项目名称" style="width: 200px" />
          <span class="label-name marin-left-5">字典名称</span>
          <Input v-model="reqParams.pFunDesc" placeholder="请输入字典名称" style="width: 200px" />
          <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary" >查询</Button></span>
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
                          <th>是否初始字典</th>
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
                        <div v-if="user.status == '0'">
                        <Button type="primary" size="small" @click="changeStatus(user.id,'1')">停用</Button>
                        </div>
                        </td>
                        <td style="text-align:center;"><button type="button" class="ivu-btn-edit" ><span>查看</span></button><span style="padding:5px;color:#2d8cf0;">|</span><button type="button" class="ivu-btn-edit" @click="modify(user)"><span>编辑</span></button></td>
                        <td>
                          <div v-if="user.initialDictionary=='1'">是</div>
                        <div v-if="user.initialDictionary=='0'">否</div>
                        </td>
                        <td>{{user.areaname}}</td>
                        <td>{{user.pNationalStandards}}</td>
                        <td>{{user.pFunCode}}</td>
                        <td>{{user.pFunDesc}}</td>
                        <td>{{user.pDesc}}</td>
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
    <Modal v-model="showModal" @on-ok="submitForm" title="新建字典">
        <Form :model="formItem" :label-width="80" >
           <FormItem label="申请机构">
                <Select v-model="formItem.addareacode">
                    <Option v-for="item in articleStateList" :value="item.id " :key="item.id ">{{ item.areaname }}</Option>                
                </Select>
            </FormItem>
          
            <FormItem label="字典名称">
                <Input v-model="formItem.pFunDesc" placeholder="字典名称"></Input>
            </FormItem>
            <FormItem label="项目名称">
                <Select v-model="formItem.pCode"  @on-change="choisepCode" >                   
                    <Option v-for="item in zdxmList" :value="item.pCode " :key="item.pCode ">{{ item.pDesc }}</Option>
                </Select>
            </FormItem>
            <FormItem label="上级字典">
                <Select v-model="formItem.parentId">   
                  <Option v-for="item in zdxlList" :value="item.pFunCode " :key="item.pFunCode ">{{ item.pFunDesc }}</Option>                
                </Select>
            </FormItem>
            <FormItem label="拼音码">
                <Input v-model="formItem.descCode" placeholder="拼音码"></Input>
            </FormItem>          
            <FormItem label="备注">
                <Input v-model="formItem.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
                <Input v-model="formItem.pDesc"  placeholder="项目名称" v-show="false"></Input>
            </FormItem>
        </Form>
    </Modal>

      
  </div>
</template>

<script>
import axios from "axios";
import * as table from '../tables/data/search';
export default {
  name: "region-diction",
  components: {
    
  },
  data() {
    return {
         reqParams: { pDesc: "",pFunDesc:"", pageNum: 1, pageSize: 15, orderBy: "" },
         pageSizeOpts: [15, 30, 45],
         
      showModal: false,
      formItem: {
        disabled: false,
        addareacode: "",
        pFunDesc: "",
        pCode: "",
        parentId: "",
        descCode: "",
        remarks: "",
        status: "",
        pDesc :"",
      },
      showDictModal:false,
      searchLevel: '',
      searchConName3: '',
   
      articleStateList: [],
       zdxmList: [],
       zdxlList: [],
       users: {list: [], pageNum: 0, size: 0},
      checkAll: false,
      selectedItems: []
    }
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/ehrPwGlobalDict/getPage";
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
    modify(item) {
            this.formItem = item;
            this.formItem.disabled = false;
            this.showModal = true;
        },
    submitForm() {
      let that = this;
      let urlStr = "/ehrPwGlobalDict";
      if (this.formItem.id) {
        //修改
        axios
          .put(urlStr, this.formItem)
          .then(function(response) {
            //console.log(response);
            alert(response.data.msg);
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
            alert(response.data.msg);
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
 
    handleSearch3 () {
      this.getData();
    },
    handleCancel3 () {
        this.data3 = table.searchTable3;
    },
     getRegion() {
      let that = this;
      let urlStr = "/ehrPwGlobalDict/getAreaAndpdesc";
      axios
        .get(urlStr, {
          params: { natureId: '156746886068588560' }
        })
        .then(function(response) {
          if (response.data) {
           //  console.log(response.data);
            that.articleStateList = response.data.result.area;
            that.zdxmList=response.data.result.zdxm;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    choisepCode(value){
       this.formItem.pDesc=this.zdxmList.find(item => item.pCode === this.formItem.pCode)['pDesc'];
        let that = this;
        let urlStr = "/ehrPwGlobalDict/getGlobalDictByPcode";
      axios
        .get(urlStr, {
          params: { pCode: value }
        })
        .then(function(response) {
          if (response.data) {
            console.log(response.data);
         
            that.zdxlList= response.data.result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    changeStatus(id,zt){
        let that = this;
        let urlStr = "/ehrPwGlobalDict/updateStatus";
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
    this.getRegion();
  }
};
</script>

