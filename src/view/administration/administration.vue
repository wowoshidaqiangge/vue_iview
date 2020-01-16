<template>
    <div class="page">
        <Form :model="formRight" label-position="right"  inline>
            
            <FormItem label="编号" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.commun_number"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="操作人" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.user_name"></Input>
                    </Col>
                </Row>
            </FormItem>
           
            <Button type="primary"  style="margin-right: 20px;" @click='seach'>搜索</Button>
            <Button @click="clear">清空</Button>
        </Form>
        <Tabs value="1" style="position: relative;" @on-click="check" :animated="false">
            <TabPane label="未接受" name="1" >
                
                <Table stripe :columns="columns1" :data="communList.data || []">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="warning" size="small" style="margin-right: 5px" @click="show(row,2)">审批</Button>
                    </template>
                </Table>
                <div>
                    <Page :total="communList.total" :current='communList.current_page' show-total style="margin:10px 0;float:right"/>
                </div>
            </TabPane>
            <TabPane label="办理中" name="2">
                <Table stripe :columns="columns1" :data="communList.data || []">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="info" size="small" style="margin-right: 5px" @click="show(row,1)">修改</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="communList.total" :page-size='communList.per_page' :current='communList.current_page'  @on-change='change'/>
                </div>
            </TabPane>
            <TabPane label="已结办" name="3">
                <Table stripe :columns="columns1" :data="communList.data || []">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,3)">完成</Button>
                    </template>
                </Table>
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">行政事务内部通启单</Button>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Tabs>
      
       <Model  :value="isopen" @cancel='cancel' @getcommunlist='getcommunlist' :isedit=isedit @communeditlnfo='commun' :process=process :communeditlnfo=communeditlnfo ref='model'/>
    </div>
  </template>
  
  <script>
   import store from '@/store'
   import { communlist,communedit} from '@/api/form'
   import {  setTitle,localRead } from '@/libs/util'
   import Model from './model.vue'
   import { mapMutations } from 'vuex'
   export default {
    name: 'administration',
    components:{
        // Model
        Model,
      
    },
    data () {
        return {
            checktype:'1',// 当前是那个状态
            process:1,
            now:'1',
            communList:'',
            spinShow:false,
            isedit:'1',
            communeditlnfo:{},
            
            isopen:false,
            formRight: {
                commun_number:'',
                user_name:''
            },
            columns1: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '编号',
                        key: 'commun_number'
                    },
                    {
                        title: '单据概要',
                        key: 'content'
                    },
                    {
                        title: '单据类型',
                        key: 'action'
                    },
                    {
                        title: '操作时间',
                        key: 'created_at'
                    },
                    {
                        title: '开始操作人',
                        key: 'user_name'
                    },
                    {
                        title: '进度',
                        key: '',
                        render: (h, params) => {
                            return h('Progress', {
                                props:{
                                    percent:`${params.row.current_process}`*100/ `${params.row.total_process}`,
                                    status:"active"
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                      
                        slot: 'action',
                      
                    }
                ],
                data1: [
                  
                ]
        }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      check(e){
        this.checktype = e
      
        this.getcommunlist()
      },
      //搜索
      seach(){
          
          this.getcommunlist()
      },
      //清空
      clear(){
        this.formRight = {}
        this.getcommunlist()
      },
      //切换页码
      change(e){
          var obj ={page:e}
          this.getcommunlist(obj)
      },
      getcommunlist(val){
            var obj ={
                process_status:this.checktype,
                company_id:localRead('comid'),...this.formRight,...val
            }
          
        
        this.spinShow = true
        communlist(obj).then(res=>{
            if(res.status ===200){
                this.spinShow = false
                this.communList = res.data.data
            }
        })
      },
      addapproval(id){
          this.process = 0
          this.isopen = true
          this.isedit = '1'
          this.$refs.model.getcommunadd()
      },
      commun(b){
        this.communeditlnfo =b
      },
      cancel(a){
        this.isopen = a
      },
      show(id,sta){
        this.isedit = '2'
        this.process=sta
        communedit({id:id.id}).then(res=>{
            if(res.data.status===20000){
                this.communeditlnfo = res.data.data
                this.isopen = true
            }
        })
      }
     
    },
    computed: {
        getapprovalinfo () {
           
            return this.$store.state.app.getapprovalinfo
        }
    },  
    mounted () {
       
        this.getcommunlist()
       
    }
  }
  </script>
  
  <style lang="less">
      .page{
          height: 100%;
          padding: 24px;
          background: #fff;
          position: relative;
      }
  </style>
  