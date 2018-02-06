<style lang="less">
@import "../../styles/common.less";
@import "./demo-crud.less";
</style>

<template>
    <div>
        <Row>
           <Col>
                <Card>
                    <Button v-permission="['KT Admin']" type="primary" @click="showModal = true; formItem={}" >新建</Button>                    
                    <Button v-permission="['KT Admin']" type="error" @click="removeAll" >批量删除</Button>
                    <Input v-model="keyword"  placeholder="按名称搜索" style="width: 200px"></Input>
                    <Button @click="getData" type="primary" shape="circle" icon="ios-search">Search</Button>
                    <div class="edittable-con-1">
                        <Table border ref="selection" :columns="columnsList" :data="tableData" @on-selection-change="tableSelectChange" ></Table>
                        <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">取消全选</Button>
                    </div>
                </Card>
            </Col>
        </Row>
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
import tableData from "../tables/components/table_data.js";
import canEditTable from "../tables/components/canEditTable.vue";
export default {
  name: "demo-crud",
  components: {
    canEditTable
  },
  data() {
    return {
      keyword: "",
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
      columnsList: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          align: "center",
          key: "id"
        },
        {
          title: "父权限",
          align: "center",
          key: "parentId"
        },
        {
          title: "资源名",
          align: "center",
          key: "menuName"
        },
        {
          title: "类型",
          align: "center",
          key: "pType"
        },
        {
          title: "标题",
          align: "center",
          key: "title"
        },        
        {
          title: "级别",
          align: "center",
          key: "menuLevel"
        },     
        {
          title: "排序号",
          align: "center",
          key: "menuOrder"
        },
            
        {
          title: "创建用户",
          align: "center",
          key: "createUserId"
        },
            
        {
          title: "创建时间",
          align: "center",
          key: "createTime"
        },
            
        {
          title: "更新用户",
          align: "center",
          key: "updateUserId"
        },
            
        {
          title: "更新时间",
          align: "center",
          key: "updateTime"
        },
        {
          title: "操作",
          align: "center",
          width: 180,
          key: "action",
          render: (h, params) => {
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
              ),
              h("Button", [
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定要删除吗！",
                      type: "error",
                      size: "small"
                    },
                    on: {
                      "on-ok": () => {
                        this.removeSingl(params.index);
                      },
                      "on-cancel": () => {}
                    }
                  },
                  "删除"
                )
              ])
            ]);
          }
        }
      ],
      tableData: [],
      selectedItems: []
    };
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/sysPermission/page";
      axios
        .get(urlStr, {
          params: { keyword: this.keyword }
        })
        .then(function(response) {
          if (response.data) {
            that.tableData = response.data.list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submitForm() {
      let that = this;
      let urlStr = "/sysPermission";
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
            console.log(response);
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
    remove(ids) {
      let that = this;
      let urlStr = "/sysPermission/" + ids;
      axios
        .delete(urlStr, {
          params: {}
        })
        .then(function(response) {
          console.log(response);
          if (response.data) {
            that.$Message.success("删除成功");
            that.getData();
          }
        })
        .catch(function(error) {
          console.log(error);
          that.$Message.error("删除失败");
        });
    },
    removeSingl(index){
      var obj = this.tableData[index];
      this.remove(obj.id);
    },
    removeAll() {
      // 将选中的行id delete到 /sysPermission/
      let ids='';      
      this.selectedItems.forEach((item)=>{
        ids+=item.id+'_';
      });
      //console.log(ids);
      this.remove(ids);
    },
    tableSelectChange(items){
      this.selectedItems=items;
    },
    modify(index) {
      this.formItem = this.tableData[index];
      this.formItem.disabled = false;
      this.showModal = true;
    },
    show(index) {
      this.formItem = this.tableData[index];
      this.formItem.disabled = true;
      this.showModal = true;
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    }
  },
  created() {
    this.getData();
  }
};
</script>
