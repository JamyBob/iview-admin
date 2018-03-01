<!-- 机构信息维护 -->
<style scoped lang="less">
  @import '../../styles/common.less';
  @import './mentinfo.less';
  .ivu-form-item{
    width:50%;
    float:left;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
</style>

<template>
  <div id="sysuser">
    <div class="usermain">
      <Row>
        <div class="userbtn">
          <button type="button" class="ivu-btn-nobtn" @click="showModal = true; message='新建机构'; isDisabled=false; parentShow=false"><img src="../../images/sys-step/user_add.png"><span>添加</span></button>
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
          <Input clearable v-model="reqParams.pRgid" placeholder="请输入机构编码" style="width: 200px" /></Input>
          <span class="label-name marin-left-5">机构名称</span>
          <Input clearable v-model="reqParams.pRgname" @keyup.enter.native="mechSearch" placeholder="请输入机构名称" style="width: 200px" />
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
          <Page v-show="tableShow" style="float:right" :total="resData.total" :current="resData.pageNum" :page-size="reqParams.ps" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer show-total></Page>
          
        </template>
      </Row>
    </div>
    <Modal v-model="showModal" @on-ok="submitForm('mech')" :title="message" :loading="loading" width="620">
        <!-- <p slot="header">
            <span>{{message}}</span>
        </p> -->
        <Form ref='formItem' :model="formItem" :rules="ruleValidate" label-position="right" class="mechform clear">
            <FormItem label="组织机构代码" prop="pRgid">
                <Input clearable v-model="formItem.pRgid" :disabled="isDisabled" placeholder="组织机构代码"></Input>
            </FormItem>
            <FormItem label="机构名称" prop="pRgname">
                <Input v-model="formItem.pRgname" :disabled="isDisabled" placeholder="名称" clearable></Input>
            </FormItem>
            <FormItem label="上级机构" v-show="parentShow">
                <!-- <Select clearable v-model="formItem.parentId" :disabled="isDisabled" placeholder="上级机构名称">
                  <Option v-for="item in parentRegionList" :value="item.id" :key="item.id">{{ item.pRgname }}</Option>
                </Select> -->
            <input type="hidden" v-model="formItem.parentId">
            <AutoComplete
                v-model="value2"
                :filter-method="filterMethod"
                :data="data2"
                @on-select="handleSearch2"
                :clearable="true"
                :disabled="isDisabled"
                placeholder="上级机构名称"
                style="width:200px">
            </AutoComplete>

            </FormItem>
            <FormItem label="机构负责人">
                <Input v-model="formItem.pFunctionary" :disabled="isDisabled" placeholder="机构负责人" clearable></Input>
            </FormItem>
            <FormItem label="联系人">
                <Input v-model="formItem.pContacts" :disabled="isDisabled" placeholder="联系人" clearable></Input>
            </FormItem>
            <FormItem label="联系电话">
                <Input v-model="formItem.pContactsTel" :disabled="isDisabled" placeholder="联系电话"></Input>
            </FormItem>
            <FormItem label="机构等级" prop="pRglevel">
                <!-- <Select clearable v-model="formItem.pRglevel" :disabled="isDisabled" placeholder="请选择机构级别">
                  <Option v-for="item in pRglevelDictList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
                </Select> -->

                <input type="hidden" v-model="formItem.pRglevel">
                <AutoComplete
                    v-model="valuePrglevel"
                    :filter-method="filterMethodPrglevel"
                    :data="pRglevelDictListData"
                    @on-select="handleSearchPrglevel"
                    :clearable="true"
                    :disabled="isDisabled"
                    placeholder="请选择机构级别"
                    style="width:200px">
                </AutoComplete>

            </FormItem>
            <FormItem label="机构经济类型">
                <!-- <Select clearable v-model="formItem.pEcocode" :disabled="isDisabled" placeholder="请选择机构经济类型">
                  <Option v-for="item in pEcocodeDictList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
                </Select> -->

                <input type="hidden" v-model="formItem.pEcocode">
                <AutoComplete
                    v-model="valuePecocode"
                    :filter-method="filterMethodPecocode"
                    :data="pEcocodeDictListData"
                    @on-select="handleSearchPecocode"
                    :clearable="true"
                    :disabled="isDisabled"
                    placeholder="请选择机构经济类型"
                    style="width:200px">
                </AutoComplete>
            </FormItem>
            <FormItem label="区域代码">
                <!-- <Select clearable v-model="formItem.areacode" :disabled="isDisabled" placeholder="请选择机构区域代码">
                  <Option v-for="item in areacodeList" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
                </Select> -->

                <input type="hidden" v-model="formItem.areacode">
                <AutoComplete
                    v-model="valueareacode"
                    :filter-method="filterMethodareacode"
                    :data="areacodeListData"
                    @on-select="handleSearchareacode"
                    :clearable="true"
                    :disabled="isDisabled"
                    placeholder="请选择机构区域代码"
                    style="width:200px">
                </AutoComplete>
            </FormItem>
            <FormItem label="机构类型">
                <!-- <Select clearable v-model="formItem.pRgtype" :disabled="isDisabled" placeholder="请选择机构类型" @on-change="">
                  <Option v-for="item in pRgtypeDictList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
                </Select> -->

                <input type="hidden" v-model="formItem.pRgtype">
                <AutoComplete
                    v-model="valuePrgtype"
                    :filter-method="filterMethodPrgtype"
                    :data="pRgtypeDictListData"
                    @on-select="handleSearchPrgtype"
                    :clearable="true"
                    :disabled="isDisabled"
                    placeholder="请选择机构类型"
                    style="width:200px">
                </AutoComplete>
            </FormItem>
            <FormItem label="机构地址">
                <Input v-model="formItem.pAddress" :disabled="isDisabled" placeholder="机构详细地址" clearable></Input>
            </FormItem>
            <FormItem label="面积">
                <Input v-model="formItem.pArea" :disabled="isDisabled" placeholder="面积（平方公里）" clearable></Input>
            </FormItem>

            <FormItem label="邮政编码">
                <Input v-model="formItem.pPost" :disabled="isDisabled" placeholder="邮政编码" clearable></Input>
            </FormItem>
            <FormItem label="城镇人口数">
                <Input v-model="formItem.pCityPopnum" :disabled="isDisabled" placeholder="城镇人口数" clearable></Input>
            </FormItem>
            <FormItem label="农村人口数">
                <Input v-model="formItem.pRuralPopnum" :disabled="isDisabled" placeholder="农村人口数" clearable></Input>
            </FormItem>
            <!-- <FormItem label="人口数更新时间">
                <Date-picker v-model="formItem.pPopupdateTime" type="date" :disabled="isDisabled" placeholder="选择日期"></Date-picker>
            </FormItem> -->
            <FormItem label="社区卫生服务机构从业人数">
                <Input v-model="formItem.pWorkPopnum" :disabled="isDisabled" placeholder="社区卫生服务机构从业人数" clearable></Input>
            </FormItem>
            <FormItem label="正式编制人员">
                <Input v-model="formItem.pOfficialStaffing" :disabled="isDisabled" placeholder="正式编制人员" clearable></Input>
            </FormItem>
            <FormItem label="全科医师">
                <Input v-model="formItem.pGeneralPractitioner" :disabled="isDisabled" placeholder="全科医师" clearable></Input>
            </FormItem>
            <FormItem label="临床执业医师数">
                <Input v-model="formItem.pClinicNum" :disabled="isDisabled" placeholder="临床执业医师数" clearable></Input>
            </FormItem>
            <FormItem label="公共卫生医师数">
                <Input v-model="formItem.pPubhealthNum" :disabled="isDisabled" placeholder="公共卫生医师数" clearable></Input>
            </FormItem>
            <FormItem label="其他人员">
                <Input v-model="formItem.pOtherNum" :disabled="isDisabled" placeholder="其他人员" clearable></Input>
            </FormItem>
            <!-- <FormItem label="状态" v-show="false">
                <RadioGroup v-model="formItem.status" >
                    <Radio label="0" value="0" :disabled="isDisabled">停用</Radio>
                    <Radio label="1" value="1" :disabled="isDisabled">启用</Radio>
                </RadioGroup>
            </FormItem> -->
            <!-- <div class="binding" data-title="绑定账号">
              <div class="bindingbtn">
                <input type="text" v-model="city"/>
              </div>
              <div v-show="isshow">
                <p v-for="item in selectCitys" @click="bindcity(item)">{{item}}</p>
              </div>
            </div> -->
        </Form>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
// import * as table from '../tables/data/search';
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
        status: "0",
        disabled: false,
        username: "",
        email: "",
        mobile: "",
        password: "",
        select: "",
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
                      this.showRegion(params.row.id);
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
                      this.modifyRegion(params.row.id);
                    }
                  }
                },
                "编辑"
              ),
            ]);
          }
      }],
      reqParams: { pRgid: "",pRgname:"", pn: 1, ps: 10, orderBy: "" },
      resData: { list: [], pageNum: 0, size: 0 },
      pageSizeOpts: [10, 20, 50],
      regions: [],
      checkAll: false,
      selectedItems: [],
      isshow:false,
      city:"",
      citys:[],
      products:[],
      search:'',
      selectCitys:[],
      pRgid: '',
      pRgname: '',
      parentShow:'',
      value2: '',
      valuePrglevel:'',
      valuePecocode:'',
      valueareacode:'',
      valuePrgtype:'',
      statust: '',
      pRglevelDictList:[],
      pEcocodeDictList:[],
      pRgtypeDictList:[],
      areacodeList:[],
      parentRegionList:[],
      message: '',
      isDisabled: false,
      loading: true,
      ruleValidate:{
        pRgid:[
          {required: true, message:'组织机构代码不能为空！', trigger: 'blur'},
        ],
        pRgname:[
          {required: true, message:'机构名称不能为空！', trigger: 'blur'},
        ],
        // pRglevel:[
        //   {required: true, message:'请选择机构等级！', trigger: 'change'},
        // ],
      }
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
            //onsole.log(response.data);
            that.regions = response.data.result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submitForm() {
      let that = this;
      let urlStr = "/ehrPwRegion/addRegion";
      if (this.formItem.id) {
        //修改
        // that.formTitle = '修改机构';
        axios
          .post(urlStr, this.formItem)
          .then(function(response) {
            if (response.data.code == 0) {
              that.mechSearch();
            } else {
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //新建
        that.$refs['formItem'].validate((valid) => {
            if (valid) {
                axios
                .post(urlStr, this.formItem)
                .then(function(response) {
                  // console.log(response);
                  // that.showModal = true;
                  if (response.data.code == 0) {
                      //alert(222);
                      that.showModal = false;
                  }else {
                      // that.showModal=true;
                      alert(111);
                  }
                })
                .catch(function(error) {
                  // console.log(error);
                  //that.showModal = true;
                });
            } else {
                setTimeout(() => {
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                }, 1000);
            }
        })

        
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
    // search (data, argumentObj) {
    //     let res = data;
    //     let dataClone = data;
    //     for (let argu in argumentObj) {
    //         if (argumentObj[argu].length > 0) {
    //             res = dataClone.filter(d => {
    //                 return d[argu].indexOf(argumentObj[argu]) > -1;
    //             });
    //             dataClone = res;
    //         }
    //     }
    //     return res;
    // },
    mechSearch () {
        // if(this.searchConName3 == ''){
        //   alert("请输入搜索条件");
        // }
        
        let that = this;
        let urlStr = "/ehrPwRegion/page";
        if(this.reqParams.pRgid == ''&&this.reqParams.pRgname == ''){
          this.treeShow = true;
          this.tableShow = false;
        }else{
          this.treeShow = false;
          this.tableShow = true;
          axios
          .get(urlStr, {
            params: that.reqParams
          })
          .then(function(response) {
            if (response.data) {
              //console.log(response.data);
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
      // alert(val);
      let that = this;
      that.isshow = false;
      this.search = val.areacode;
      //console.log(val);
    },
    rowClick(data, index, event, text) {
        // console.log('当前行数据:' + data.status)
        // console.log('点击行号:' + index)
        // console.log('点击事件:' + event)
        //  console.log(data.id);
        // this.getData();
        // console.log(that.statust)
        if(text == '查看'){
          this.showRegion(data.id);
        }else if(text == '编辑'){
          this.modifyRegion(data.id);
        }
    },
    selectionClick(arr) {
        //('选中数据id数组:' + arr)
    },
    sortClick(key, type) {
        //('排序字段:' + key)
        //console.log('排序规则:' + type)
    },
    tableSelectChange(items) {
        this.selectedItems = items;
    },
    onPageSzieChanged(pageSize) {
        this.reqParams.ps = pageSize;
        this.mechSearch();
    },
    onPageChanged(pageNum) {
        this.reqParams.pn = pageNum;
        this.mechSearch();
    },
    modify(id,status) {
      let that = this;
      let urlStr = "/ehrPwRegion/updateRegionById";
          axios({
            method:'put',
            url:urlStr,
            data:{
              id: id, status: status,
            },
            
            
          }).then(function(response){
              //console.log(response.data);

              if(response.data.code == '0'){
                 that.mechSearch();
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },
    showRegion(regionId) {
      let that = this;
      
      let urlStr = "/ehrPwRegion/"+regionId;
          axios({
            method:'get',
            url:urlStr,
            params:{},
            
            
          }).then(function(response){
              console.log("232---"+response.data);
              that.formItem = response.data;
              that.showModal = true;
              that.message = '查看机构';
              that.isDisabled = true;
            })
            .catch(function(error){
              console.log(error);
            })

    },
    modifyRegion(regionId) {
      this.parentShow = true;
      let that = this;
      
      let urlStr = "/ehrPwRegion/"+regionId;
          axios({
            method:'get',
            url:urlStr,
            params:{},
            
          }).then(function(response){
              //console.log("232---"+response.data);
              that.formItem = response.data;
              that.showModal = true;
              that.message = '修改机构';
              that.isDisabled = false;
              // that.formTitle = '修改机构';
            })
            .catch(function(error){
              console.log(error);
            })

    },
    getpRglevel() {
      let that = this;
      let urlStr = "/ehrPwRegionDict/getDictByCodeBus";
          axios({
            method:'get',
            url:urlStr,
            params:{
              pCode: "00002",
            },
            
            
          }).then(function(response){

              if(response.data.code == '0'){
                //console.log("prglevelDict==="+JSON.stringify(response.data.result))
                 that.pRglevelDictList = response.data.result;
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },getpEcocode() {
      let that = this;
      let urlStr = "/ehrPwRegionDict/getDictByCodeBus";
          axios({
            method:'get',
            url:urlStr,
            params:{
              pCode: "00004",
            },
            
            
          }).then(function(response){
              //console.log(response.data);

              if(response.data.code == '0'){
                 that.pEcocodeDictList = response.data.result;
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },
    getpRgtype() {
      let that = this;
      let urlStr = "/ehrPwRegionDict/getDictByCodeBus";
          axios({
            method:'get',
            url:urlStr,
            params:{
              pCode: "00001",
            },
            
            
          }).then(function(response){
              //console.log(response.data);

              if(response.data.code == '0'){
                 that.pRgtypeDictList = response.data.result;
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },getAreaCode() {
      let that = this;
      let urlStr = "/ehrPwRegion/getLowerAreaList";
          axios({
            method:'get',
            url:urlStr,
            
          }).then(function(response){
              if(response.data.code == '0'){
                let data = response.data.result;
                //console.log(data);
                 that.areacodeList = data;
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },getParentRegion() {
      let that = this;
      let urlStr = "/ehrPwRegion/getSLRegion";
          axios({
            method:'get',
            url:urlStr,
            
          }).then(function(response){
              if(response.data.code == '0'){
                //console.log("parentRegionList="+JSON.stringify(response.data.result));
                 that.parentRegionList = response.data.result;
              }
            })
            .catch(function(error){
              console.log(error);
            })

    },
    filterMethod (value, option) {
        return option.indexOf(value.toUpperCase()) !== -1;
    },handleSearch2 (value) {
        for(let i=0;i<this.parentRegionList.length;i++){
          if(value == this.parentRegionList[i].pRgname){
            this.formItem.parentId = this.parentRegionList[i].pRgid;
            break;
          }
        }
    },
    handleSearchPrglevel(value){
      for(let i=0;i<this.pRglevelDictList.length;i++){
            if(value == this.pRglevelDictList[i].pFunDesc){
              this.formItem.pRglevel = this.pRglevelDictList[i].id;
              break;
            }
          }
    },filterMethodPrglevel (value, option) {
        return option.indexOf(value.toUpperCase()) !== -1;
    },filterMethodPecocode (value, option) {
        return option.indexOf(value.toUpperCase()) !== -1;
    },filterMethodareacode (value, option) {
        return option.indexOf(value.toUpperCase()) !== -1;
    },filterMethodPrgtype (value, option) {
        return option.indexOf(value.toUpperCase()) !== -1;
    },handleSearchPecocode(value){
      for(let i=0;i<this.pEcocodeDictList.length;i++){
            if(value == this.pEcocodeDictList[i].pFunDesc){
              this.formItem.pEcocode = this.pEcocodeDictList[i].id;
              break;
            }
          }
    },handleSearchareacode(value){
      for(let i=0;i<this.areacodeList.length;i++){
            if(value == this.areacodeList[i].areaname){
              this.formItem.areacode = this.areacodeList[i].id;
              break;
            }
          }
    },handleSearchPrgtype(value){
      for(let i=0;i<this.pRgtypeDictList.length;i++){
            if(value == this.pRgtypeDictList[i].pFunDesc){
              this.formItem.pRgtype = this.pRgtypeDictList[i].id;
              break;
            }
          }
    },


  },
  computed:{
    data2:function(){
      let result = [];
      for(let i=0;i<this.parentRegionList.length;i++){
        let parent = this.parentRegionList[i];
        result[i] = parent.pRgname;
      }
      return result;
    },
    pRglevelDictListData:function(){
      let result = [];
      for(let i=0;i<this.pRglevelDictList.length;i++){
        let dict = this.pRglevelDictList[i];
        result[i] = dict.pFunDesc;
      }
      return result;
    },
    pEcocodeDictListData:function(){
      let result = [];
      for(let i=0;i<this.pEcocodeDictList.length;i++){
        let dict = this.pEcocodeDictList[i];
        result[i] = dict.pFunDesc;
      }
      return result;
    },
    areacodeListData:function(){
      let result = [];
      for(let i=0;i<this.areacodeList.length;i++){
        let dict = this.areacodeList[i];
        result[i] = dict.areaname;
      }
      return result;
    },
    pRgtypeDictListData:function(){
      let result = [];
      for(let i=0;i<this.pRgtypeDictList.length;i++){
        let dict = this.pRgtypeDictList[i];
        result[i] = dict.pFunDesc;
      }
      return result;
    }
  },
  // watch:{
  //   city:function(val){
  //     // console.log(citys);
  //     if(val.length==0){
  //        this.isshow = false
  //      }else{
  //         this.isshow = true;
  //         var citys = []
  //         this.citys.forEach((item,index) => {
  //           // console.log("item"+item);
  //           // // item = JSON.stringify(item);
  //           //  console.log("item说是"+JSON.stringify(item));
  //           // let showItem = item.areaname;
  //           // console.log("showItem=="+showItem);
  //             if(item.indexOf(val)>=0){
  //                 citys.unshift(item)
  //             }
  //         })  
  //         this.selectCitys = citys;
  //      }
  //   }
  // },
  created() {
    this.getData();
    this.getpRglevel();
    this.getpEcocode();
    this.getpRgtype();
    this.getAreaCode();
    this.getParentRegion();
  }
};

</script>
