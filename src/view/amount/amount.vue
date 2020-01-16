<template>
    <div class="page">
        <Form :model="formRight" label-position="right"  inline>
            <FormItem label="编号" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.number"></Input>
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
        <Tabs value="1" @on-click="check" :animated="false">
            <TabPane label="未接受" name="1">
                
                <Table stripe :columns="columns1" :data="expenseList.data">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="warning" size="small" style="margin-right: 5px" @click="show(row,2)">审批</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'   @on-change='change'/>
                </div>
            </TabPane>
            <TabPane label="办理中" name="2">
                <Table stripe :columns="columns1" :data="expenseList.data">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="info" size="small" style="margin-right: 5px" @click="show(row,1)">修改</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'   @on-change='change'/>
                </div>
            </TabPane>
            <TabPane label="已结办" name="3">
                <Table stripe :columns="columns1" :data="expenseList.data">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,3)">完成</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'   @on-change='change'/>
                </div>
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">现金支票申请单</Button>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Tabs>
        <!-- <Model :value="isopen" @cancel='cancel' >
           
        </Model> -->
         <Formodal  width='850' 
           v-model="isopen" 
           :infolist='infolist'
            @forminfo = "forminfo"  
            @cancel='cancel' 
            :appinfo = 'appinfo' 
           :loading='loading'
           :title ='title'
           :isedit=isedit
           :settlelist='settlelist'
           @settle='settle'
           :finance='finance'
           :formobj=formobj
           :isamount=isamount
           :process=process
           @clicksure='clicksure'
           :expenseditlnfo='expenseditlnfo'
           ref='formodal'
        >
           
        </Formodal  >
    </div>
  </template>
  
  <script>
    import store from '@/store'
    
    import { cashlist ,cashadd,cashaddpost,cashedit,casheditpost,cashexamine,cashsettlement} from '@/api/form'
    import Formodal from './../formodal/index.vue'
    import { localRead } from '@/libs/util'
    import { mapMutations } from 'vuex'
    export default {
    name: 'ecurrency',
    components:{
       Formodal
    },
    data () {
        return {
            title:'现金支票申请',
            isamount:true,
            isedit:'0',
            process:1,
            expenseditlnfo:{},
            formobj:{},
            checktype:'1',
            spinShow:false,
            settlelist:[],
            isopen:false,
            expenseList:'',
            finance:false,// 判断是否为财务
            appinfo:{},
            prolist:[],//项目归属项列表
            loading:false,
            infolist:[
                   
            ],
            formRight: {
                    number:'',
                    user_name:''
            },
            columns1: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '编号',
                        key: 'cash_cheque_number'
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
                                    percent:Math.round(`${params.row.current_process}`*100/ `${params.row.total_process}`),
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
      show(e,pro){
        this.isopen = true
        this.loading = true
        this.process = pro
        this.isedit = '2'
        cashedit({id:e.id,company_id:localRead('comid')}).then(result=>{
           debugger
            if(result.data.status===20000){
                this.loading= false
                var res = result.data.data
                this.infolist = [
                    {type:'p',name:'时间:',value:res.cashInfo.created_at},
                    {type:'p',name:'编号:',value :res.cashInfo.cash_cheque_number},
                    {type:'p',name:'申请部门:',value :res.cashInfo.centre_name},
                    {type:'p',name:'姓名:',value:res.cashInfo.user_name},
                    {type:'input','name':'money',label:'预算金额',style:'width:87%',ischange:true,require:true,msg:"金额不能为空"},
                    {type:'input','name':'money_upper',label:'大写',style:'width:43%',disabled:true},
                    {type:'input','name':'pay_time',label:'支付时间',style:'width:43%'},
                ]
                this.settlelist = [
                    {type:'input','name':'check_num',label:'支票号码',style:'width:43%'},
                    {type:'input','name':'check_stub',label:'支票存根',style:'width:43%'},
                ]
                this.expenseditlnfo=result.data.data
                this.formobj = result.data.data.cashInfo
            }
        })
      },
      //搜索
      seach(){
          this.getcashlist()
        },
        // 清空
        clear(){
          this.formRight = {}
          this.getcashlist()
        },
        // 改变页码
        change(e){
         
          var obj = {page:e}
          this.getcashlist(obj)
        },
      clicksure(e){
        cashexamine(e).then(res=>{
           
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
               this.getcashlist()
           }
        })
      },
      check(e){
        this.checktype = e
        this.getcashlist()
      },
      // 获取table信息
      getcashlist(val){
        var obj ={process_status:this.checktype,company_id:localRead('comid'),...this.formRight,...val}
             this.spinShow = true
             cashlist(obj).then(res => {
              
                if(res.status ===200){
                    debugger
                    this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data.cashData || []
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        cashadd(id).then(result=>{
            debugger
            if(result.status ===200){
                var res = result.data.data
                this.appinfo = result.data.data
               
                this.loading = false
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                  
                    {type:'p',name:'编号:',value :res.cashChequeNumber},
                    {type:'p',name:'申请中心:',value:res.userInfo.company_center.name},
                    {type:'p',name:'姓名:',value:res.userInfo.name},
                
                    {type:'input','name':'money',label:'预算金额',style:'width:87%',ischange:true,require:true,msg:"金额不能为空"},
                    {type:'input','name':'money_upper',label:'大写',style:'width:43%',disabled:true},
                    {type:'input','name':'loan_amount',label:'支付单位',style:'width:43%'},
                    {type:'input','name':'pay_time',label:'支付时间',style:'width:43%'},
                   
                ]
            }
        })
      },
      addapproval(id){
          this.isamount = true
          this.process = 0
          this.isedit ='0'
          this.isopen = true
          this.loading = true
          this.getexpenseadd({company_id:localRead('comid')})
      },
       //结算
       settle(e){
          debugger
         var obj = {
             id :this.expenseditlnfo.cashInfo.id,
             ...e
         }
         cashsettlement(obj).then(res=>{
                if(res.data.status==20000){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                }else{
                    this.$Message.error(res.data.msg)
                }
        })
      },
      cancel(a){
          this.appinfo = {}
          this.expenseditlnfo ={}
          this.formobj = {}
          this.infolist =[]
          this.isopen= false
      },
      forminfo(e){
         if(this.isedit==='0'){
            var obj = {
            company_id:this.appinfo.company_id,
            cash_cheque_number:this.appinfo.cashChequeNumber,
            centre_name:this.appinfo.userInfo.company_center.name,
            user_name:this.appinfo.userInfo.name,
            ...e
          }
          cashaddpost(obj).then(res=>{
                if(res.data.status==20000){
                    this.cancel()
                    this.getcashlist()
                }
            })
         }else if(this.isedit==='2'){
           
            casheditpost(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getcashlist()
                }
            })
         }
      }
     
    },
    computed: {
        getapprovalinfo () {
            console.log(this.$store.state.app.getapprovalinfo)
            return this.$store.state.app.getapprovalinfo
        }
    },  
    mounted () {
       
        this.getcashlist()
       
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
  