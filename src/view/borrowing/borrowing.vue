<template>
    <div class="page">
        <Form :model="formRight" label-position="right"  inline>
            <FormItem label="编号" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.loan_number"></Input>
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
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'  @on-change='change'/>
                </div>
            </TabPane>
            <TabPane label="办理中" name="2">
                <Table stripe :columns="columns1" :data="expenseList.data">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="info" size="small" style="margin-right: 5px" @click="show(row,1)">修改</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'  @on-change='change'/>
                </div>
            </TabPane>
            <TabPane label="已结办" name="3">
                <Table stripe :columns="columns1" :data="expenseList.data">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,3)">完成</Button>
                    </template>
                </Table>
                <div style="margin-top: 20px;">
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'  @on-change='change'/>
                </div>
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">借款申请单</Button>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Tabs>
        <!-- <Model :value="isopen" @cancel='cancel' >
           
        </Model> -->
         <Formodal  width='850' 
           v-model="isopen" 
           :infolist='infolist'
           :settlelist ='settlelist'
            @forminfo = "forminfo"  
            @cancel='cancel' 
            @settle = 'settle'
            :appinfo = 'appinfo' 
           :loading='loading'
           :isedit=isedit
           :formobj=formobj
           :process=process
           :finance=finance
           :title = 'title'
           @clicksure='clicksure'
           :expenseditlnfo='expenseditlnfo'
           ref='formodal'
        >
           
        </Formodal  >
    </div>
  </template>
  
  <script>
    import store from '@/store'
    
    import { loanlist ,loancreate,loancreatepost,loanedit,loaneditpost,loanexamine,financeedit} from '@/api/form'
    import Formodal from './../formodal/index.vue'
    import { getToken,  } from '@/libs/util'
    import { localRead } from '@/libs/util'
    import { mapMutations } from 'vuex'
    export default {
    name: 'borrowing',
    components:{
       Formodal
    },
    data () {
        return {
            title:`借款申请`,
            isedit:'0',
            process:1,
            expenseditlnfo:{},
            formobj:{},
            checktype:'1',
            spinShow:false,
            isopen:false,
            expenseList:'',
            finance:false,// 判断是否为财务
            appinfo:{},
            prolist:[],//项目归属项列表
            loading:false,
            infolist:[
                   
            ],
            settlelist:[],
            formRight: {
                loan_number:'',
                user_name:'',
            },
            columns1: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '编号',
                        key: 'loan_number'
                    },
                    {
                        title: '单据概要',
                        key: 'loan_reason'
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
        loanedit({id:e.id,company_id:localRead('comid')}).then(result=>{
            debugger
            if(result.data.status===20000){
                this.loading= false
                var res = result.data.data
               
                this.infolist = [
                    {type:'p',name:'时间:',value:res.loanInfo.created_at},
                    {type:'p',name:'编号:',value :res.loanInfo.loan_number},
                    {type:'p',name:'申请部门:',value:res.loanInfo.from_center},
                    {type:'p',name:'申请人:',value:res.loanInfo.user_name},
                    {type:'cascader',name:'to_center',label:'费用所属项目',style:'width:87%',pro:result.data.data.center_list,},
                    {type:'input','name':'loan_reason',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'申请事由不能为空'},
                    {type:'input','name':'loan_amount',label:'借款金额',style:'width:43%',ischange:true,require:true,msg:'金额不能为空'},
                    {type:'input','name':'amount_in_words',label:'大写',style:'width:43%',disabled:true},
                    {type:'input','name':'copy_name',label:'内部通启公司',style:'width:43%'},
                    {type:'input','name':'internal_notice_num',label:'内部通启编号',style:'width:43%',require:true,msg:'通启编号不能为空'},
                ]
                this.settlelist = [
                    {type:'date','name':'refund_time',text:'datetime', label:'还款时间',style:'width:43%',value:'value1'},
                    {type:'input','name':'refund_num',label:'还款报销单据号',style:'width:43%'},
                    {type:'input','name':'loan_remaining',label:'余额退换金额',style:'width:43%'},
                    {type:'input','name':'loan_remaining_num',label:'收款收据编号',style:'width:43%'},
                    {type:'input','name':'loan_excess',label:'再申请报销金额',style:'width:43%'},
                    {type:'input','name':'loan_excess_num',label:'报销收据编号',style:'width:43%'},
                    {type:'select','name':'give_type',label:'发放方式',style:'width:87%',option:[{id:1,name:'现金发放'},{id:2,name:'网银转账'}]},
                    {type:'date','name':'sign_time', text:'datetime',label:'签收时间',style:'width:87%',value:'value2'},
                    {type:'input','name':'sign_name',label:'签收人',style:'width:87%'},
                    {type:'input','name':'transfer_voucher_num',label:'转账凭证号',style:'width:87%'},
                    {type:'input','name':'expense_account_num',label:'抵借款报销单据号',style:'width:87%'},
                ]
                result.data.data.loanInfo.to_center= result.data.data.loanInfo.to_center.split(',').map(Number)
               
                this.expenseditlnfo=result.data.data
                this.formobj = result.data.data.loanInfo
              
            }
        })
      },
      // 搜索
      seach(){
        this.getloanlist()
      },
      //清空
      clear(){
        this.formRight = {}
        this.getloanlist()
      },
      //切换页码
      change(e){
        var obj = {page:e}
        this.getloanlist(obj)
      },
      clicksure(e){
        loanexamine(e).then(res=>{
           
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
               this.getloanlist()
           }
        })
      },
      check(e){
        this.checktype = e
        this.getloanlist()
      },
      // 获取table信息
      getloanlist(val){
        var obj ={process_status:this.checktype,company_id:localRead('comid'),...this.formRight,...val}
             this.spinShow = true
             loanlist(obj).then(res => {
              
                if(res.status ===200){
                    this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data.loanData || []
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        loancreate(id).then(result=>{
            debugger
            if(result.status ===200){
                var res = result.data.data
                this.appinfo = result.data.data
              
                this.loading = false
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                    
                    {type:'p',name:'姓名:',value:res.userInfo.name},
                    {type:'p',name:'申请部门:',value:res.userInfo.team_center.name},
                   
                    {type:'p',name:'编号:',value :res.loan_number},
                    {type:'cascader',name:'to_center',label:'费用所属项目',style:'width:87%',pro:result.data.data.center_list,require:true,msg:'请选择'},
                    
                    {type:'input','name':'loan_reason',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'申请事由不能为空'},
                    {type:'input','name':'loan_amount',label:'借款金额',style:'width:43%',ischange:true,require:true,msg:'金额不能为空'},
                    {type:'input','name':'amount_in_words',label:'大写',style:'width:43%',disabled:true},
                    
                    {type:'input','name':'copy_name',label:'内部通启公司',style:'width:43%'},
                    {type:'input','name':'internal_notice_num',label:'内部通启编号',style:'width:43%',require:true,msg:'通启编号不能为空'},
                   
                ]
            }
        })
      },
      addapproval(id){
          this.process = 0
          this.isedit ='0'
          this.isopen = true
          this.loading = true
          this.getexpenseadd({company_id:localRead('comid')})
      },
      settle(e){
        e.refund_time = this.formatDate(e.refund_time)
        e.sign_time = this.formatDate(e.sign_time)
        var obj = {
            id:this.expenseditlnfo.loanInfo.id,
            ...e
        }
        financeedit(obj).then(res=>{
            if(res.data.status===20000){
                this.$Message.success(res.data.msg)
                this.cancel()
            }
        })
      },
      cancel(a){
          this.appinfo = {}
          this.expenseditlnfo ={}
          this.formobj = {}
          this.settlelist= []
          this.infolist = []
          this.isopen= false
      },
      forminfo(e){
          debugger
         if(this.isedit==='0'){
             e.to_center = e.to_center.toString()
            var obj = {
            company_id:this.appinfo.company_id,
            loan_number:this.appinfo.loan_number,
            user_name:this.appinfo.userInfo.name,
            from_center:this.appinfo.userInfo.team_center.name,
            ...e
          }
          loancreatepost(obj).then(res=>{
                if(res.data.status==20000){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getloanlist()
                }
            })
         }else if(this.isedit==='2'){
            e.to_center = e.to_center.toString()
            loaneditpost(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getloanlist()
                }
            })
         }
      },
      formatDate(shijianchuo) {
            var time = new Date(shijianchuo); // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+ this.isZero(m)+'-'+ this.isZero(d)+' '+ this.isZero(h)+':'+ this.isZero(mm)+':'+ this.isZero(s);    
        },
        isZero(m){
            return m<10?'0'+m:m
        }
     
    },
    computed: {
        getapprovalinfo () {
            console.log(this.$store.state.app.getapprovalinfo)
            return this.$store.state.app.getapprovalinfo
        }
    },  
    mounted () {
       
        this.getloanlist()
       
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
  