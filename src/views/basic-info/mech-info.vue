<!-- 机构信息维护 -->
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
          <!-- <span class="label-name">机构级别</span>
          <Select style="width:200px" v-model="searchLevel" placeholder="请选择机构级别">
              <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select> -->
          <span class="label-name marin-left-5">机构编码</span>
          <Input v-model="pRgid" placeholder="请输入机构编码" style="width: 200px" />
          <span class="label-name marin-left-5">机构名称</span>
          <Input v-model="pRgname" @keyup.enter.native="mechSearch" placeholder="请输入机构名称" style="width: 200px" />
          <span @click="mechSearch" style="margin: 0 10px;"><Button type="primary">查询</Button></span>
          <!-- <Button @click="handleCancel3" type="ghost" >取消</Button> -->
        </div>
      </Row>
      <Row class="searchable-table-con1" style="padding:0 20px 10px;">
          <!-- <Table :columns="columnsUser" :data="data3"></Table> -->
          <!-- <div class="ivu-table-wrapper">
            <div class="ivu-table ivu-table-border">
              <table cellspacing="0" cellpadding="0" style="width:100%;">
                  <thead>
                      <tr>
                          <th>机构状态</th>
                          <th>操作</th>
                          <th>机构编码</th>
                          <th>机构名称</th>
                          <th>上级机构名称</th>
                          <th>区域名称</th>
                          <th>机构级别</th>
                          <th>城镇人口数</th>
                          <th>农村人口数</th>
                          <th>人口更新时间</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for ="(region,index) in regions">
                        <td style="text-align:center;">
                          <div v-if="region.status == '1'">
                             <Button type="primary" size="small">正常</Button>
                          </div>
                          <div v-if="region.status == '0'">
                             <Button type="primary" size="small">停用</Button>
                          </div>
                          </td>
                        <td style="text-align:center;"><button type="button" class="ivu-btn-edit"><span>查看</span></button><span style="padding:5px;color:#2d8cf0;">|</span><button type="button" class="ivu-btn-edit"><span>编辑</span></button></td>
                        <td>{{region.pRgid}}</td>
                        <td>{{region.pRgname}}</td>
                        <td>{{region.parentName}}</td>
                        <td>{{region.areaName}}</td>
                        <td>{{region.pRglevel}}</td>
                        <td>{{region.pCityPopnum}}</td>
                        <td>{{region.pRuralPopnum}}</td>
                        <td>{{region.pPopupdateTime}}</td>
                      </tr>
                  </tbody>
              </table>
            </div>
          </div> -->
        <template>
            <tree-grid v-show="treeShow"  class="mechtree" :items='regions' :columns='columns' @on-row-click='rowClick' @on-selection-change='selectionClick' @on-sort-change='sortClick'></tree-grid>
        </template>
        <!-- <template>
            <Page :total="regions.length" size="small" show-total show-elevator></Page>
        </template> -->
        <template>
          <Table v-show="tableShow" class="mechtable" border ref="selection" :columns="columnslist" :data="resData.list" @on-selection-change="tableSelectChange"></Table>
          <Page v-show="tableShow" style="float:right" :total="resData.pages*resData.size" :current="resData.pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>
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
            <div class="binding" data-title="绑定账号">
              <div class="bindingbtn">
                <input type="text" v-model="city"/>
              </div>
              <div v-show="isshow">
                <p v-for="item in selectCitys" @click="bindcity(item)">{{item}}</p>
              </div>
            </div>
        </Form>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import * as table from '../tables/data/search';
import TreeGrid from '../main-components/TreeGrid';
export default {
  name: "mech-info",
  components: {
    TreeGrid
  },
  data() {
    return {
      treeShow: true,
      tableShow: false,
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
      articleStateList: [{value: '区县卫生局'}, {value: '社区卫生服务站/卫生室'}, {value: '市卫生局'}, {value: '社区卫生服务中心/卫生院'}, {value: '村卫生室'}, {value: '乡镇卫生院'},],
      columns: [{
          title: '机构名称',
          key: 'pRgname',
      }, {
          title: '机构编码',
          key: 'pRgid',
          sortable: true,
          // width: '150',
      }, {
          title: '上级机构名称',
          key: 'parentName',
      }, {
          title: '区域名称',
          key: 'areaName',
      }, {
          title: '机构级别',
          key: 'pRglevelName',
      }, {
          title: '城镇人口数',
          key: 'pCityPopnum',
          width: 81,
          align: "right",
      }, {
          title: '农村人口数',
          key: 'pRuralPopnum',
          width: 81,
          align: "right",
      }, {
          title: '人口更新时间',
          key: 'pPopupdateTime',
          width: 110,
          align: "center",
      }, {
          title: '机构状态',
          type: 'actions',
          width: 80,
          actions: [{
              type: 'primary',
              text: '已启用',
          }],
          actionn: [{
              type: 'default',
              text: '已停用',
          }],
      }, {
          title: '操作',
          type: 'action',
          width: 110,
          align: 'center',
          className: 'infotable',
          actions: [{
              type: 'default',
              text: '查看',
          }, {
              type: 'default',
              text: '编辑'
          }],
          actionn: [{
              type: 'default',
              text: '查看',
          }, {
              type: 'default',
              text: '编辑'
          }],
      }],
      columnslist: [{
          title: '机构名称',
          key: 'pRgname',
      }, {
          title: '机构编码',
          key: 'pRgid',
          // sortable: true,
          // width: '150',
      }, {
          title: '上级机构名称',
          key: 'parentName',
      }, {
          title: '区域名称',
          key: 'areaName',
      }, {
          title: '机构级别',
          key: 'pRglevelName',
      }, {
          title: '城镇人口数',
          key: 'pCityPopnum',
          width: 81,
          align: "right",
      }, {
          title: '农村人口数',
          key: 'pRuralPopnum',
          width: 81,
          align: "right",
      }, {
          title: '人口更新时间',
          key: 'pPopupdateTime',
          width: 110,
          align: "center",
      }, {
          title: '机构状态',
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      // this.show(params.index);
                      console.log(params.row.status);
                      this.modify(params.row.id,'0');
                    }
                  }
                },
               "已启用"
              );
            if(params.row.status=='0'){
            btn=h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      let that = this;
                      // this.show(params.index);
                      console.log("352532523532"+params.row.status);
                      this.modify(params.row.id,'1');
                    }
                  }
                },
                "已停用"
              )
          }
            return h("div", [
              btn
            ]);
          }
      }, {
          title: '操作',
          key: "action",
          align: "center",
          width: 110,
          className: "infotable",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.modify(params.index);
                    }
                  }
                },
                "编辑"
              ),
            ]);
          }
      }],
      reqParams: { keyword: "", pageNum: 1, pageSize: 15, orderBy: "" },
      resData: { list: [], pageNum: 0, size: 0 },
      pageSizeOpts: [15, 30, 45],
      regions: [],
      checkAll: false,
      selectedItems: [],
      isshow:true,
      city:"",
      citys:['北京','北海','东北','上海','武汉','东京','广州','广元市','上饶','上水市'],
      selectCitys:[],
      pRgid: '',
      pRgname: '',
      statust: '',
    }
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/ehrPwRegion/selectBypRgid";
      axios
        .get(urlStr, {
          params: { pRglevel: '156746886068588545', pRgid: '1137000000450234X0', }
        })
        .then(function(response) {
          if (response.data) {
            console.log(response.data);
            that.regions = response.data.result;
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
    mechSearch () {
        // if(this.searchConName3 == ''){
        //   alert("请输入搜索条件");
        // }
        let that = this;
        let urlStr = "/ehrPwRegion/page";
        if(this.pRgid == ''&&this.pRgname == ''){
          this.treeShow = true;
          this.tableShow = false;
        }else{
          this.treeShow = false;
          this.tableShow = true;
          axios
          .get(urlStr, {
            params: { pRgid: this.pRgid, pRgname: this.pRgname, }
          })
          .then(function(response) {
            if (response.data) {
              console.log(response.data);
              that.resData = response.data;
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }
        
    },
    handleCancel3 () {
        this.data3 = table.searchTable3;
    },
    bindcity(val){
      alert(val);
      this.city = val;
    },
    rowClick(data, index, event, text) {
        console.log('当前行数据:' + data.status)
        console.log('点击行号:' + index)
        console.log('点击事件:' + event)
        // console.log(text)
        // this.getData();
        // console.log(that.statust)
    },
    selectionClick(arr) {
        console.log('选中数据id数组:' + arr)
    },
    sortClick(key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
    },
    tableSelectChange(items) {
        this.selectedItems = items;
    },
    onPageSzieChanged(pageSize) {
        this.reqParams.pageSize = pageSize;
        this.getData();
    },
    onPageChanged(pageNum) {
        this.reqParams.pageNum = pageNum;
        this.getData();
    },
    modify(id,status) {
      console.log(id +"----"+ status);
      let that = this;
      let urlStr = "/ehrPwRegion/updateRegionById";
          axios({
            method:'put',
            url:urlStr,
            data:{
              id: id, status: status,
            },
            
            
          }).then(function(response){
              console.log(response.data);
              if(response.data.code == '0'){
                 that.mechSearch();
                 // if(status == '0'){
                 //  that.btn.text = '123';
                 // }
              }
            })
            .catch(function(error){
              console.log(error);
            })
    },

  },
  watch:{
    city:function(val, oldVal){
      if(val.length==0){
         this.isshow = false
       }else{
          this.isshow = true;
          var citys = []
          this.citys.forEach((item,index) => {
              if(item.indexOf(val)>=0){
                  citys.unshift(item)
              }
          })  
          this.selectCitys = citys;
       }
    }
  },
  created() {
    this.getData();
  }
};
</script>
