<template>
    <div class="page">
        <Tabs value="name1">
            <TabPane label="未接受" name="name1">
                <Form :model="formRight" label-position="right"  inline>
                    <FormItem label="序号" style="width: 20%;">
                        <Row>
                            <Col span="18">
                                <Input v-model="formRight.input1"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="编号" style="width: 20%;">
                        <Row>
                            <Col span="18">
                                <Input v-model="formRight.input1"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="操作人" style="width: 20%;">
                        <Row>
                            <Col span="18">
                                <Input v-model="formRight.input1"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="状态" style="width: 20%;">
                        <Row>
                            <Col span="18">
                                <Select v-model="formRight.select">
                                    <Option value="beijing">New York</Option>
                                    <Option value="shanghai">London</Option>
                                    <Option value="shenzhen">Sydney</Option>
                                </Select>
                            </Col>
                        </Row>
                    </FormItem>
                    <Button type="primary"  style="margin-right: 20px;">搜索</Button>
                    <Button >清空</Button>
                </Form>
                <Table stripe :columns="columns1" :data="data1"></Table>
                <div>
                    <!-- <Page :total="getapprovalinfo.total" :current='getapprovalinfo.current' show-elevator /> -->
                </div>
            </TabPane>
            <TabPane label="办理中" name="name2">标签二的内容</TabPane>
            <TabPane label="已结办" name="name3">
                <a href="http://beian.miit.gov.cn" target="_blank" >123456</a>
               
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">费用报销申请单</Button>
        </Tabs>
       
    </div>
  </template>
  
  <script>
    import store from '@/store'

   
  import { mapMutations } from 'vuex'
  export default {
    name: 'split',
    components:{
        // Model
    },
    data () {
        return {
            isopen:false,
            formRight: {
                    input1: '',
                    input2: '',
                    input3: '',
                    select:'beijing'
            },
            columns1: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
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
                ]
        }
    },
    methods: {

      ...mapMutations([
        'closeTag'
      ]),
     
      addapproval(id){
          console.log(id)
          this.isopen = true
      },
      cancel(a){
        this.isopen = a
      }
     
    },
    computed: {
        getapprovalinfo () {
            console.log(this.$store.state.app.getapprovalinfo)
            return this.$store.state.app.getapprovalinfo
        }
    },  
    mounted () {
       
        console.log(this.getapprovalinfo)
    }
  }
  </script>
  
  <style lang="less">
      .page{
          height: 100%;
          padding: 24px;
          background: #fff;
      }
  </style>
  