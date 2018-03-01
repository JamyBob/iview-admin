<!-- 机构科室信息维护 -->
<style scoped lang="less">
  @import '../../styles/common.less';
  @import './mentinfo.less';
</style>

<template>
  <div id="sysdept">
    <div class="areamain">
      <Row>
        <div class="userbtn">
          <button type="button" class="ivu-btn-nobtn" @click="showModal = true; formItem={}"><img src="../../images/sys-step/user_add.png"><span>添加</span></button>
        </div>
      </Row>
      <Row>
        <div class="areasearch">
          <span class="label-name marin-left-5">科室名称</span>
          <Input v-model="reqParams.deptName" clearable placeholder="请输入科室名称" style="width: 200px" />
          <span @click="getData" style="margin: 0 10px;"><Button type="primary">查询</Button></span>
        </div>
      </Row>
      <Row class="searchable-table-con1" style="padding:0 20px 10px;">
          <div class="ivu-table-wrapper">
            <Table border ref="selection" :columns="columnsDept" :data="depts" ></Table>
                <Row>
                    <!-- <Col span="4">
                        <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">取消全选</Button>
                    </Col> -->
                    <Col span="24">
                        <Page style="float:right" :total="pages*size" :current="pageNum" :page-size="reqParams.pageSize" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer></Page>
                    </Col>
                </Row>
        </div>
      </Row>
    <Modal v-model="showModal" @on-ok="submitForm" title="新建科室" :loading="loading">
      <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
        <!-- <FormItem label="上级科室">
          <Input v-model="parentName" placeholder="上級区域" readonly></Input>
        </FormItem> -->
        <FormItem label="所属机构">
           <Input v-model="regionName" placeholder="上級区域" readonly></Input>
        </FormItem>
        <FormItem label="区域名称" prop="deptName">
          <Input clearable v-model="formItem.deptName" placeholder="区域名称"></Input>
        </FormItem>
       
      </Form>
    </Modal>
    <Modal v-model="editModal" @on-ok="submitForm" @on-cancel="cancelBtn" title="修改科室" :loading="loading">
      <Form ref="editItem" :model="editItem" :label-width="80" :rules="ruleValidate">
        <!-- <FormItem label="上级科室">
          <Input v-model="parentName" placeholder="上級区域" readonly></Input>
        </FormItem> -->
        <FormItem label="所属机构">
           <Input v-model="regionName" placeholder="上級区域" readonly></Input>
        </FormItem>
        <FormItem label="区域名称" prop="deptName">
          <Input clearable v-model="editItem.deptName" placeholder="区域名称"></Input>
        </FormItem>
       
      </Form>
    </Modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as table from '../tables/data/search';
import Cookies from 'js-cookie';
export default {
  name: "ment-info",
  components: {
  },
  data() {
    return {
      reqParams: {pageSize:10,pageNum:1,deptName: "",regionId:"",orderBy: "DEPT_NAME"},
      showModal: false,
      editModal:false,
      regionName:"",
      formItem: {
        id:"",
        deptName:"",
        regionId:"",
        status:"1"
      },
      editItem: {
        id:"",
        deptName:"",
        regionId:"",
      },
        ruleValidate: {
            deptName: [
                { required: true, message: '区域名称不能为空', trigger: 'blur' }
            ]
        },
      columnsDept: [
        {
          key:'status',
          title:'科室状态',
          align: "center",
          render: (h, params) => {
                        let s = params.row.status;
                        if(s==1){
                            this.statusBtn="正常";
                        }else{
                            this.statusBtn="停用";
                        }
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {
                                            this.changeStatus(params.index,s);
                                        }
                                    }
                                },
                                this.statusBtn
                            )
                        ]);
                    }
        },
        {
          title: "操作",
          align: "center",
          width: 180,
          key: "action",
          render: (h, params) => {
              return h("div", [
                //   h(
                //       "Button",
                //       {
                //           props: {
                //               type: "primary",
                //               size: "small"
                //           },
                //           on: {
                //               click: () => {
                //                   this.show(params.index);
                //               }
                //           }
                //       },
                //       "查看"
                //   ),
                  h(
                      "Button",
                      {
                          props: {
                              type: "primary",
                              size: "small"
                          },
                          on: {
                              click: () => {
                                  this.modify(params.index);
                              }
                          }
                      },
                      "修改"
                  )
              ]);
          }
        },
        {
          key:'deptName',
          title:'科室名称'
        },
        // {
        //   key:'parentName',
        //   title:'上级科室'
        // },
        {
          key:'regionName',
          title:'机构名称'
        },
        {
          key:'createUser',
          title:'创建人员'
        },
        {
          key:'createTime',
          title:'创建时间',
          // render:(h, params) =>{
          //     let date = new Date(params.row.createTime);
          //     return this.formatDate(date,'yyyy-MM-dd hh:mm:ss');
          // }
        },
        {
          key:'updateUser',
          title:'更新人员'
        },
        {
          key:'updateTime',
          title:'更新时间',
          // render:(h, params) =>{
          //     let date = new Date(params.row.createTime);
          //     return this.formatDate(date,'yyyy-MM-dd hh:mm:ss');
          // }
        }
      ],
      depts: [],
      pageSize: 0,
      pageNum: 0,
      pages: 0,
      size: 0,
      pageSizeOpts: [10,30,45],
      checkAll: false,
      selectedItems: [],
      loading:true
    }
  },
  methods: {
    getData() {
        let that = this;
        let urlStr = "/ehrPwDept/getPage";
        axios
            .get(urlStr, { params: this.reqParams})
            .then(function(response) {
                if (response.data) {
                    console.log(response.data);
                    that.depts = response.data.list;
                    that.pageSize = response.data.pageSize;
                    that.pageNum = response.data.pageNum;
                    that.pages = response.data.pages;
                    that.size = response.data.size;
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    changeStatus(index,s){
        let that = this;
        let urlStr = "/ehrPwDept";
        this.formItem = this.depts[index];
        if(s==1){
           this.formItem.status=0; 
        }else{
           this.formItem.status=1;
        }
        axios
            .put(urlStr, this.formItem)
            .then(function(response) {
                if (response.data) {
                    console.log(response.data);
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    onPageSzieChanged(ps) {
        console.log(ps);
        this.reqParams.pageSize = ps;
        this.getData();
    },
    onPageChanged(pn) {
        console.log(pn);
        this.reqParams.pageNum = pn;
        this.getData();
    },
    formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
            }
        }
        return fmt;
    },
    padLeftZero(str) {
        return ('00' + str).substr(str.length);
    },
    getRegion(regionId){
        let that = this;
        let urlStr = "/ehrPwRegion/"+regionId;
        axios
            .get(urlStr,{})
            .then(function(response) {
                if (response.data) {
                    that.regionName=response.data.pRgname;
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    modify(index) {
        let that = this;
        that.editItem = that.depts[index];
        that.editModal = true;
    },
    cancelBtn(){
        this.getData();
    },
    submitForm() {
        let that = this;
        let urlStr = "/ehrPwDept";
        let user = Cookies.get("user");
        // that.formItem.regionId="156737827659595778";
        if (that.editItem.id) {
            //修改
             that.editItem.regionId=JSON.parse(user).regionId;
             that.$refs['editItem'].validate((valid) => {
                    if (valid) {
                        axios
                        .put(urlStr, that.editItem)
                        .then(function(response) {
                            console.log(response);
                            if (response.data.code == 0) {
                                that.getData();
                                that.editModal=false;
                                that.editItem.id="";
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
                    }else{
                        this.$Message.error('Fail!');
                    }
             });
        } else {
            //新建
            that.formItem.status="1";
            that.formItem.regionId=JSON.parse(user).regionId;
            that.$refs['formItem'].validate((valid) => {
                    if (valid) {
                        axios
                            .post(urlStr, that.formItem)
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
                                setTimeout(() => {
                                        that.loading = false;
                                        that.$nextTick(() => {
                                            that.loading = true;
                                        });
                                    }, 100);
                            });
                    } else {
                        this.$Message.error('Fail!');
                    }
            });
        }
    }
  },
  created() {
    let user = Cookies.get("user");
    this.reqParams.regionId=JSON.parse(user).regionId;
    // this.reqParams.regionId='156737827659595778';//测试用
    this.getRegion(this.reqParams.regionId);
    this.getData();
  }
};
</script>

