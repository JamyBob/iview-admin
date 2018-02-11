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
          <!-- <span class="label-name">区划级别</span>
          <Select style="width:200px" clearable v-model="reqParams.areaNature" placeholder="请选择区划级别" @on-change="selectChange">
            <Option v-for="item in articleStateList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
          </Select> -->
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
                <!-- <Row>
                    <Col span="4">
                        <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">取消全选</Button>
                    </Col>
                    <Col span="20">
                        <Page v-show="tableShow" style="float:right" :total="pages*size" :current="pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>
                    </Col>
                </Row> -->
                </template>
      </Row>
    </div>
    <Modal v-model="showModal" @on-ok="submitForm" title="新建区域">
      <Form :model="addItem" :label-width="80">
        <FormItem label="上级区域">
          <Input v-model="addParentName" placeholder="上級区域" readonly></Input>
        </FormItem>
        <FormItem label="区域性质">
          <!-- <Input v-model="addNature" placeholder="区域性质"></Input> -->
           <Select clearable v-model="addItem.areaNature" placeholder="请选择区划级别" @on-change="">
            <Option v-for="item in addDictList" :value="item.id" :key="item.id">{{ item.pFunDesc }}</Option>
          </Select>
        </FormItem>
        <FormItem label="区域名称">
          <Input v-model="addItem.areaname" placeholder="区域名称"></Input>
        </FormItem>
        <FormItem label="区域编码">
         <Row>
            <Col span="14"><Input v-model="parentCode" placeholder="区域编码" readonly style="text-align: right;"></Input></Col>
            <Col span="10"><Input v-model="addCode" placeholder="区域编码" maxlength="3"></Input></Col>
         </Row>
        </FormItem>
        <!-- <FormItem label="状态">
          <RadioGroup v-model="formItem.status">
            <Radio label="0">正常</Radio>
            <Radio label="1">停用</Radio>
          </RadioGroup>
        </FormItem> -->
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
            addItem: {
                areaname: "",
                areacode: "",
                parentId: "",
                areaNature: "",
                villageNature: "",
                status: "1",
                villageArea: ""
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
                    key: "villageArea"
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
                    width: 110,
                    type: "action",
                    align: "center",
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
                    key: "villageArea"
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
                                this.changeStatus(params.index,params.row.status);
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
                                this.changeStatus(params.index,params.row.status);
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
                }
                // // {
                // //     type: "selection",
                // //     width: 60,
                // //     align: "center"
                // // },
                // // {
                // //     title: "ID",
                // //     align: "center",
                // //     key: "id",
                // //     hidden:true
                // // },
                // {
                //     title: "区划状态",
                //     align: "center",
                //     key: "status",
                //     render: (h, params) => {
                //         let s = params.row.status;
                //         if(s==1){
                //             this.statusBtn="正常";
                //         }else{
                //             this.statusBtn="停用";
                //         }
                //         return h("div", [
                //             h(
                //                 "Button",
                //                 {
                //                     props: {
                //                         type: "primary",
                //                         size: "small"
                //                     },
                //                     on: {
                //                         click: () => {
                //                             this.changeStatus(params.index,s);
                //                         }
                //                     }
                //                 },
                //                 this.statusBtn
                //             )
                //         ]);
                //     }
                // },
                // {
                //     title: "操作",
                //     align: "center",
                //     width: 180,
                //     key: "action",
                //     render: (h, params) => {
                //         return h("div", [
                //             h(
                //                 "Button",
                //                 {
                //                     props: {
                //                         type: "primary",
                //                         size: "small"
                //                     },
                //                     on: {
                //                         click: () => {
                //                             this.show(params.index);
                //                         }
                //                     }
                //                 },
                //                 "查看"
                //             ),
                //             h(
                //                 "Button",
                //                 {
                //                     props: {
                //                         type: "primary",
                //                         size: "small"
                //                     },
                //                     on: {
                //                         click: () => {
                //                             this.modify(params.index);
                //                         }
                //                     }
                //                 },
                //                 "修改"
                //             )
                //         ]);
                //     }
                // },
                // {
                //     title: "区划编码",
                //     key: "areacode",
                //     align: "center"
                // },
                // {
                //     title: "区划名称",
                //     align: "center",
                //     key: "areaname"
                // },
                // {
                //     title: "上级区划名称",
                //     align: "center",
                //     key: "parentName"
                // },
                // {
                //     title: "行政区划性质",
                //     align: "center",
                //     key: "aNatureName"
                // },
                // {
                //     title: "村性质",
                //     align: "center",
                //     key: "vNatureName"
                // },
                // {
                //     title: "村所属片区",
                //     align: "center",
                //     key: "villageArea"
                // }
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
            addCode:"",
            parentCode:""
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
                        // that.reqParams.areaId=areaInfo.id;
                        // that.addItem = areaInfo;
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
                        // that.pageNum = response.data.pageNum;
                        // that.pages = response.data.pages;
                        // that.size = response.data.size;
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
        changeStatus(index,s){
            let that = this;
            let urlStr = "/ehrPwArea";
            that.formItem = that.areas[index];
            if(s=="1"){
                that.formItem.status=0; 
            }else{
                that.formItem.status=1;
            }
            axios
                .put(urlStr, that.formItem)
                .then(function(response) {
                    if (response.data) {
                        console.log(response.data);
                        that.areas[index].status = that.formItem.status;
                        alert("状态已改变！");
                        that.regionSearch();
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
                        } else {
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                //新建
                if(that.addCode==""){
                    alert("区域编码尾数位不能为空");
                }else{
                    that.addItem.areacode = that.parentCode+that.addCode;
                    axios
                    .post(urlStr, that.addItem)
                    .then(function(response) {
                        // console.log(response);
                        if (response.data.code == 0) {
                            that.getData();
                        } else {
                            that.showModal=true;
                            alert(response.data.msg);
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }
            }
        },
        editModal() {
            var index = this.selectedItems - 1;
            var indexs = this.selectedItems;
            alert(indexs);
            if (indexs.length > 1) {
                alert("只能选择一条数据！");
            } else if (indexs.length == 0) {
                alert("请选择一条数据！");
            } else {
                // this.formItem = this.users[indexs];
                // this.formItem.disabled = false;
                this.showModal = true;
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
        handleSelectAll(status) {
            this.$refs.selection.selectAll(status);
        },
        selectChange(){
           let t = this.articleStateList.find(item => item.id === this.reqParams.areaNature)['pFunDesc'];
        },
        addArea(){
            let that = this;
            that.showModal = true;
            let nature="";
            if(that.userNature=="156746886068588558"){//新增市级
                nature = "156746886068588559";
                // that.addNature = that.articleStateList.find(item => item.id === nature)['pFunDesc'];
                // that.addItem={parentName:that.formItem.areaname,parentId:that.formItem.id,areaNature:nature,aNatureName:aNatureName};
                that.addDictList[0]=that.articleStateList[1];
            }else if(that.userNature=="156746886068588559"){//新增县市级
                nature = "156746886068588560";
                that.addDictList[0]=that.articleStateList[2];
            }else if(that.userNature=="156746886068588560"){//新增街道
                nature = "156746886068588561";
                that.addDictList[0]=that.articleStateList[3];
                that.parentCode=that.parentCode.substring(0,6);
            }else if(that.userNature=="156746886068588561"){//新增片区或者村
                nature = "156746886068588563";
                that.addDictList[0]=that.articleStateList[5];
                that.addDictList[1]=that.articleStateList[4];
                that.parentCode=that.parentCode.substring(0,9);
            } else {
                return;
            }
            that.addItem.areaNature = nature;
            that.addItem.areaname="";
            that.addCode="";
        },
        rowClick(data, event, index, text) {
            console.log('当前行数据1:' + data.status)
            console.log('点击行号:' + index)
            console.log('点击事件:' + event)
            // console.log(text)
            // this.getData();
            // console.log(that.statust)
            this.changeStatus(index,data.status);
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
        }
    },
    created() { 
        let user = Cookies.get("user");
        this.getRegion(JSON.parse(user).regionId);
        // this.getData();
        this.getNatureDict();
    }
};
</script>

