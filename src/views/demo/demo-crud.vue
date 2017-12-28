<style lang="less">
@import "../../styles/common.less";
@import "./demo-crud.less";
</style>

<template>
    <div>
        <Row>
           <Col>
                <Card>
                    <Button type="primary" @click="showModal = true" >新建</Button>
                    <Modal v-model="showModal" @on-ok="createNew" title="新建用户">
                            <Form :model="formItem" :label-width="80">
                              <FormItem label="用户名">
                                  <Input v-model="formItem.username" placeholder="名称"></Input>
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
                              <FormItem label="启用">
                                  <i-switch v-model="formItem.switch" size="large">
                                      <span slot="open">启用</span>
                                      <span slot="close">关闭</span>
                                  </i-switch>
                              </FormItem>
                              <FormItem label="备注">
                                  <Input v-model="formItem.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
                              </FormItem>
                              <!-- <FormItem>
                                  <Button type="primary">Submit</Button>
                                  <Button type="ghost" style="margin-left: 8px">Cancel</Button>
                              </FormItem> -->
                          </Form>
                    </Modal>
                    <Button type="error" @click="showModal = true" >批量删除</Button>
                    <Input v-model="keyword" placeholder="按名称搜索" style="width: 200px"></Input>
                    <Button type="primary" shape="circle" icon="ios-search">Search</Button>
                    <div class="edittable-con-1">
                        <can-edit-table refs="table1" @on-delete="handleDel" v-model="tableData" :columns-list="columnsList"></can-edit-table>
                    </div>
                </Card>
            </Col>
        </Row>
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
          title: "姓名",
          align: "center",
          key: "username"
        },
        {
          title: "邮箱",
          key: "email",
          align: "center"
        },
        {
          title: "电话",
          align: "center",
          key: "mobile"
        },
        {
          title: "状态",
          align: "center",
          key: "status"
        },
        {
          title: "操作",
          align: "center",
          width: 180,
          key: "handle",
          handle: ["edit", "delete"]
        }
      ],
      tableData: []
    };
  },
  methods: {
    getData() {
      let that = this;
      let urlStr = "/sysUser/page";
      axios
        .get(urlStr, {
          params: {}
        })
        .then(function(response) {
          console.log(response);
          if (response.data) {
            that.tableData = response.data.list;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    createNew() {
      console.log(this.formItem)
      let that=this;
      let urlStr = "/sysUser";
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
    },
    handleDel(val, index) {
      var obj = val[index];
      let that = this;
      let urlStr = "/sysUser/" + obj.id;
      axios
        .delete(urlStr, {
          params: {}
        })
        .then(function(response) {
          console.log(response);
          if (response.data) {
            that.$Message.success("删除了第" + (index + 1) + "行数据");
          }
        })
        .catch(function(error) {
          that.$Message.error("删除失败");
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>
