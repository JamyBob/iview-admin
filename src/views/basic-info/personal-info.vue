<!-- 人员机构关系维护 -->
<style scoped lang="less">
	@import '../../styles/common.less';
  	@import './mentinfo.less';
</style>

<template>
	<div>
		<Row :gutter="10">
            <Col span="17">
                <Card>
                    <p slot="title">
                    	<Icon type="person-stalker"></Icon>
                        人员信息
                    </p>
                    <Row class="area-linkage-page-row1">
                    	<div class="personalsearch">
							<span class="label-name marin-left-5">人员姓名</span>
							<Input clearable placeholder="请输入机构编码" style="width: 200px" /></Input>
							<span class="label-name marin-left-5">人员编码</span>
							<Input clearable placeholder="请输入机构名称" style="width: 200px" />
							<span style="margin: 0 10px;"><Button type="primary">查询</Button></span>
				        </div>
                        <Table class="mechtable" border ref="selection" :columns="columns1" :data="data1" @on-row-click="handleRowChange"></Table>
          				<Page style="float:right" :total="data1.total" :current="data1.pageNum" :page-size="reqParams.ps" :page-size-opts="pageSizeOpts" @on-change="onPageChanged" @on-page-size-change="onPageSzieChanged" show-elevator show-sizer show-total></Page>
                    </Row>
                </Card>
            </Col>
            <Col span="7">
                <Card>
                    <p slot="title">
                        <Icon type="stats-bars"></Icon>
                        机构关系
                    </p>
                    <Row class="area-linkage-page-row1">
                        <Tree :data="data4" show-checkbox multiple></Tree>
                    </Row>
                </Card>
            </Col>
        </Row>
	</div>
</template>

<script>
export default {
  name: "personal-info",
  components: {
    
  },
  data() {
	    return {
	    	columns1: [
		        {
		            title: '姓名',
		            key: 'name'
		        },
		        {
		            title: '编码',
		            key: 'age'
		        },
		        {
		            title: '备注',
		            key: 'address'
		        }
		    ],
		    data1: [
		        {
		            name: 'John Brown',
		            age: 18,
		            address: 'New York No. 1 Lake Park',
		            date: '2016-10-03'
		        },
		        {
		            name: 'Jim Green',
		            age: 24,
		            address: 'London No. 1 Lake Park',
		            date: '2016-10-01'
		        },
		        {
		            name: 'Joe Black',
		            age: 30,
		            address: 'Sydney No. 1 Lake Park',
		            date: '2016-10-02'
		        },
		        {
		            name: 'Jon Snow',
		            age: 26,
		            address: 'Ottawa No. 2 Lake Park',
		            date: '2016-10-04'
		        }
		    ],
		    data4: [
                {
                    title: 'parent 1',
                    expand: true,
                    selected: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1',
                                    disabled: true
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1',
                                    checked: true
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
			reqParams: { pRgid: "",pRgname:"", pn: 1, ps: 10, orderBy: "" },
			resData: { list: [], pageNum: 0, size: 0 },
			pageSizeOpts: [10, 20, 50],
	    }
  	},
  	methods: {
  		handleRowChange(index){
	        
	        alert(index.name);
	    },
	     onPageSzieChanged(pageSize) {
	        this.reqParams.pageSize = pageSize;
	        this.getData();
	    },
	    onPageChanged(pageNum) {
	        this.reqParams.pageNum = pageNum;
	        this.getData();
	    },
	}
}
</script>
