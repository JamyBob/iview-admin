<!-- 区域信息维护 -->
<style scoped lang="less">
@import "../../styles/common.less";
@import "./mentinfo.less";
</style>

<template>
  <div id="areaDiv">
    <div class="areamain">
      <Row>
        <div class="userbtn">
          <button type="button" class="ivu-btn-nobtn" @click="addArea"><img src="../../images/sys-step/user_add.png">
            <span>添加</span>
          </button>
        </div>
      </Row>
      <Row>
        <div class="areasearch">
          <span class="label-name marin-left-5">区划编码</span>
          <Input v-model="reqParams.areacode" clearable  placeholder="请输入区划编码" style="width: 200px" />
          <span class="label-name marin-left-5">区划名称</span>
          <Input v-model="reqParams.areaname" clearable  placeholder="请输入区划名称" style="width: 200px" />
          <span @click="regionSearch" style="margin: 0 10px;">
            <Button type="primary">查询</Button>
          </span>
        </div>
      </Row>
      <Row class="searchable-table-con1" style="padding:0 20px 10px;">
             <template>
                 <tree-grid v-show="treeShow"  class="mechtree" :items='areas' :columns='columns' @on-row-click='rowClick' @on-selection-change='selectionClick' @on-sort-change='sortClick'></tree-grid>
             </template>
             <template>
              <Table v-show="tableShow"  class="mechtable" border ref="selection" :columns="columnsList" :data="areas" ></Table>
              <Page v-show="tableShow" style="float:right" :total="pages*size" :current="pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer show-total></Page>
                </template>
      </Row>
    </div>
    <Modal v-model="showModal" @on-ok="submitForm" title="新建区域" :loading="loading">
      <Form ref="addItem" :model="addItem" :label-width="80" :rules="ruleValidate">
        <FormItem label="上级区域">
          <Input v-model="addParentName" placeholder="上級区域" readonly></Input>
        </FormItem>
        <FormItem label="区域性质">
          <!-- <Input v-model="addNature" placeholder="区域性质"></Input> -->
           <Select v-model="addItem.areaNature" placeholder="请选择区划级别" @on-change="">
            <Option v-for="item in addDictList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
          </Select>
        </FormItem>
        <FormItem label="区域名称" prop="areaname">
          <Input clearable v-model="addItem.areaname" placeholder="区域名称"></Input>
        </FormItem>
        <FormItem label="区域编码" prop="addCode">        
         <label style="padding:10px 5px 10px 0">{{parentCode}}</label><Input  ref="addCode" v-model="addItem.addCode" placeholder="区域编码" maxlength=3 style="width:60%;"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModal" @on-ok="submitForm" title="修改区域">
      <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
         <FormItem label="区域名称" prop="areaname">
          <Input v-model="formItem.areaname" placeholder="区域名称"></Input>
        </FormItem>
        <FormItem label="区域编码"  prop="areacode">
         <Input v-model="formItem.areacode" placeholder="区域编码"></Input>
        </FormItem>
        <FormItem label="上级区域">
          <!-- <Input v-model="formItem.parentName" placeholder="上級区域" readonly></Input> -->
          <Select v-model="formItem.parentId" placeholder="请选择区划级别">
            <Option v-for="item in parentAreaList" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="区域性质">
          <label style="padding:10px 5px 10px 0">{{formItem.aNatureName}}</label>
        </FormItem>
        <FormItem  label="所属片区" ref="child">
          <Select v-model="formItem.villageArea" clearable placeholder="请选择片区">
            <Option v-for="item in sliceList" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="formItem.status">
            <Radio label="1">正常</Radio>
            <Radio label="0">停用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import * as table from "../tables/data/search";
import Cookies from 'js-cookie';
import TreeGrid from '../main-components/TreeGrid';
export default {
    name: "region-info",
    components: {TreeGrid},
    data() {
        return {
            reqParams: { areaname: "",areacode: "",areaNature: "", pageNum: 1, pageSize: 10, orderBy: "areacode",areaId:""},
            showModal: false,
            editModal:false,
            treeShow: true,
            tableShow: false,
            statusBtn:"正常",
            formItem: {
                disabled: false,
                id:"",
                areaname: "",
                areacode: "",
                parentId: "",
                parentName:"",
                areaNature: "",
                aNatureName:"",
                villageNature: "",
                status: "1",
                villageArea: ""
            },
            ruleValidate: {
                areaname: [
                    { required: true, message: '区域名称不能为空', trigger: 'blur' }
                ],
                addCode: [
                    { required: true, message: '区域编码尾数位不能少于2位',min: 2, max:3, trigger: 'blur' }
                ],
                areacode: [
                    { required: true, message: '区域编码不能为空', trigger: 'blur' }
                ]
            },
            addItem: {
                areaname: "",
                areacode: "",
                parentId: "",
                areaNature: "",
                villageNature: "",
                status: "1",
                villageArea: "",
                addCode:""
            },
            columns:[
                {
                    title: "区划名称",
                    key: "areaname"
                },
                {
                    title: "区划编码",
                    key: "areacode"
                },
                {
                    title: "上级区划名称",
                    key: "parentName"
                },
                {
                    title: "行政区划性质",
                    key: "aNatureName"
                },
                {
                    title: "村性质",
                    key: "vNatureName"
                },
                {
                    title: "村所属片区",
                    key: "sliceName"
                },{
                    title: "区划状态",
                    type: "actions", 
                    width: 80,
                    align: "center",
                    actions: [{
                        type: 'primary',
                        text: '已启用',
                    }],
                    actionn: [{
                        type: 'default',
                        text: '已停用',
                    }]
                },
                {
                    title: "操作",
                    width: 60,
                    type: "action",
                    align: "center",
                    actions: [ {
                        type: 'default',
                        text: '编辑'
                    }],
                    actionn: [{
                        type: 'default',
                        text: '编辑'
                    }]
                }
            ],
            columnsList: [{
                    title: "区划名称",
                    key: "areaname"
                },
                {
                    title: "区划编码",
                    key: "areacode",
                },
                {
                    title: "上级区划名称",
                    key: "parentName"
                },
                {
                    title: "行政区划性质",
                    key: "aNatureName"
                },
                {
                    title: "村性质",
                    key: "vNatureName"
                },
                {
                    title: "村所属片区",
                    key: "sliceName"
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
                                this.changeStatus(params.index,params.row);
                                // this.changeStatus(params.index,'0');
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
                                this.changeStatus(params.index,params.row);
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
                 }, 
                {
                    title: '操作',
                    key: "action",
                    align: "center",
                    width: 110,
                    className: "infotable",
                    render: (h, params) => {
                        return h("div", [
                        // h(
                        //     "Button",
                        //     {
                        //     props: {
                        //         type: "default",
                        //         size: "small"
                        //     },
                        //     on: {
                        //         click: () => {
                        //         this.show(params.index);
                        //         }
                        //     }
                        //     },
                        //     "查看"
                        // ),
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
                }
            ],
            articleStateList: [],
            areas: [],
            pageNum: 0,
            pages: 0,
            size: 0,
            pageSizeOpts: [10,30,45],
            checkAll: false, 
            selectedItems: [],
            userNature:"",
            addParentName:"",
            addDictList:[],
            parentCode:"",
            parentAreaList:[],
            sliceList:[],
            loading:true
        };
    },
    methods: {
        getRegion(regionId){
            let that = this;
            let urlStr = "/ehrPwRegion/"+regionId;
            axios
                .get(urlStr,{})
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data);
                        let regionInfo = response.data;
                        that.getAreaInfo("156732415107412200");//测试用
                        // that.getAreaInfo("961892180511703041");//测试用
                        // that.getAreaInfo("961893119842861058");//测试用
                        // that.getAreaInfo(regionInfo.areacode);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        getAreaInfo(areaId){
            let that = this;
            let urlStr = "/ehrPwArea/getAreaInfoById";
            axios
                .get(urlStr,{params:{areaId:areaId}})
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data.result);
                        let areaInfo = response.data.result;
                        that.addParentName=areaInfo.areaname;
                        that.addItem.parentId=areaInfo.id;
                        that.userNature=areaInfo.areaNature;
                        that.parentCode=areaInfo.areacode;
                        that.getData();
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        getData() {
            let that = this;
            let urlStr = "/ehrPwArea/selectByNatureAndId";
            axios
                .get(urlStr, { params: {areaId:that.addItem.parentId}})
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data);
                        that.areas = response.data.result;
                        that.tableShow=false;
                        that.treeShow=true;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        regionSearch(){
            let that = this;
            if(that.reqParams.areaname=="" && that.reqParams.areacode==""){
                that.getData();
            }else{
                let urlStr = "/ehrPwArea/getPage";
            axios
                .get(urlStr, { params: that.reqParams})
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data);
                        that.tableShow=true;
                        that.treeShow=false;
                        that.areas = response.data.list;
                        that.pageNum = response.data.pageNum;
                        that.pages = response.data.pages;
                        that.size = response.data.size;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
        },
        getNatureDict(){
            let that = this;
            let urlStr = "/ehrPwRegionDict/getDictByPcode";
            axios
                .get(urlStr,  {params: {pCode:"00003"}})
                .then(function(response) {
                    if (response.data) {
                        console.log("dict"+response.data);
                        that.articleStateList = response.data.result;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        changeStatus(index,dt){
            let that = this;
            let urlStr = "/ehrPwArea";
            let s = dt.status;
            if(s=="1"){
                dt.status=0; 
            }else{
                dt.status=1;
            }
            axios
                .put(urlStr, dt)
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        submitForm() {
            let that = this;
            let urlStr = "/ehrPwArea";
            if (that.formItem.id) {
                //修改
                axios
                    .put(urlStr, that.formItem)
                    .then(function(response) {
                        console.log(response);
                        if (response.data.code == 0) {
                            that.getData();
                            that.formItem.id="";
                            that.editModal=false;
                        } else {
                            setTimeout(() => {
                                that.loading = false;
                                that.$nextTick(() => {
                                    that.loading = true;
                                });
                            }, 100);
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        setTimeout(() => {
                            that.loading = false;
                            that.$nextTick(() => {
                                that.loading = true;
                            });
                        }, 100);
                    });
            } else {
                //新建
                that.$refs['addItem'].validate((valid) => {
                        if (valid) {
                            that.addItem.areacode = that.parentCode+that.addItem.addCode;
                            axios
                                .post(urlStr, that.addItem)
                                .then(function(response) {
                                    if (response.data.code == 0) {
                                        that.getData();
                                        that.showModal=false;
                                    } else {
                                        that.showModal=true;
                                        setTimeout(() => {
                                            that.loading = false;
                                            that.$nextTick(() => {
                                                that.loading = true;
                                            });
                                        }, 100);
                                    }
                                })
                                .catch(function(error) {
                                    console.log(error);
                                });
                        } else {
                            this.$Message.error('Fail!');
                        }
                });
            }
        },
        onPageSzieChanged(ps) {
            console.log(ps);
            this.reqParams.pageSize = ps;
            this.regionSearch();
        },
        onPageChanged(pn) {
            console.log(pn);
            this.reqParams.pageNum = pn;
            this.regionSearch();
        },
        addArea(){
            let that = this;
            that.showModal = true;
            let nature="";
            if(that.userNature=="156746886068588558"){//新增市级
                nature = "156746886068588559";
                that.addDictList[0]=that.articleStateList[1];
                that.$refs.addCode.$el.children[1].maxLength=2;
            }else if(that.userNature=="156746886068588559"){//新增县市级
                nature = "156746886068588560";
                that.addDictList[0]=that.articleStateList[2];
                that.$refs.addCode.$el.children[1].maxLength=2;
            }else if(that.userNature=="156746886068588560"){//新增街道
                nature = "156746886068588561";
                that.addDictList[0]=that.articleStateList[3];
                that.parentCode=that.parentCode.substring(0,6);
                that.$refs.addCode.$el.children[1].maxLength=3;
            }else if(that.userNature=="156746886068588561"){//新增片区或者村
                nature = "156746886068588563";
                that.addDictList[0]=that.articleStateList[5];
                that.addDictList[1]=that.articleStateList[4];
                that.parentCode=that.parentCode.substring(0,9);
                that.$refs.addCode.$el.children[1].maxLength=3;
            } else {
                return;
            }
            that.addItem.areaNature = nature;
            that.addItem.areaname="";
            that.addItem.addCode="";
        },
        rowClick(data, event, index, text) {
             let that = this;
            console.log('当前行数据1:' + data.status)
            console.log('点击行号:' + index)
            console.log('点击事件:' + event)
            // console.log(text)
            // this.getData();
            // console.log(that.statust)
            if(text=="编辑"){
                that.editModal=true;
                if(data.areaNature=="156746886068588563"){
                    that.$refs.child.$el.hidden=false;
                }else{
                    that.$refs.child.$el.hidden=true;
                }
                that.formItem=data;
                let urlStr = "/ehrPwArea/selectPNatureByParentId";
                axios
                    .get(urlStr,  {params: {parentId:data.parentId}})
                    .then(function(response) {
                        if (response.data) {
                            console.log("dict"+response.data);
                            that.parentAreaList = response.data.result;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                urlStr = "/ehrPwArea/selectSlicesByParentId";
                axios
                    .get(urlStr,  {params: {parentId:data.parentId}})
                    .then(function(response) {
                        if (response.data) {
                            console.log("dict"+response.data);
                            that.sliceList = response.data.result;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }else{
                    that.changeStatus(index,data);
                }
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
        modify(item) {
            let that = this;
            this.formItem = this.areas[item];
            this.editModal = true;
            if(this.formItem.areaNature=="156746886068588563"){
                    that.$refs.child.$el.hidden=false;
                }else{
                    that.$refs.child.$el.hidden=true;
                }
                let urlStr = "/ehrPwArea/selectPNatureByParentId";
                axios
                    .get(urlStr,  {params: {parentId:this.formItem.parentId}})
                    .then(function(response) {
                        if (response.data) {
                            console.log("dict"+response.data);
                            that.parentAreaList = response.data.result;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                urlStr = "/ehrPwArea/selectSlicesByParentId";
                axios
                    .get(urlStr,  {params: {parentId:this.formItem.parentId}})
                    .then(function(response) {
                        if (response.data) {
                            console.log("dict"+response.data);
                            that.sliceList = response.data.result;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
        },
    },
    created() { 
        let user = Cookies.get("user");
        this.getRegion(JSON.parse(user).regionId);
        // this.getData();
        this.getNatureDict();
    }
};
</script>

