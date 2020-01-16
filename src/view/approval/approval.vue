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
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'   @on-change='change'/>
                </div>
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">费用报销申请单</Button>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Tabs>
        <!-- <Model :value="isopen" @cancel='cancel' >
           
        </Model> -->
       
           
        </Formodal  >
         <Formodal  width='850' 
           v-model="isopen" 
           :infolist='infolist'
           :title='title'
            @forminfo = "forminfo"  
            @cancel='cancel'
            @settle = 'settle'
            :appinfo = 'appinfo' 
           :loading='loading'
           :isedit=isedit
           :formobj =formobj
           :settlelist='settlelist'
           :finance=finance
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
    
    import { expenselist ,expenseadd,expenseaddpost,expensedit,expenseditpost,expenseexamine,settlement} from '@/api/form'
    import Formodal from './../formodal/index.vue'
    import { localRead } from '@/libs/util'
    import Model from './model.vue'
    import { getToken,  } from '@/libs/util'
    import { mapMutations } from 'vuex'
    export default {
    name: 'approval',
    components:{
        Model,Formodal
    },
    data () {
        return {
            title:`费用报销申请`,
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
            settlelist:[],
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
                        key: 'expense_number'
                    },
                    {
                        title: '单据概要',
                        key: 'real_action'
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
        expensedit({id:e.id,company_id:localRead('comid')}).then(res=>{
            if(res.status===200){
                var result =  res.data.data.expenseInfo
                this.infolist = [
                    {type:'p',name:'时间:',value:result.created_at},
                    {type:'p',name:' ',value :' '},
                    {type:'p',name:'编号:',value :result.expense_number},
                    {type:'p',name:'申请人:',value:result.user_name},
                    {type:'p',name:'申请中心:',value:result.apply_centre},
                    
                    {type:'select',name:'type',label:'费用类型',style:'width:43%',option:[{value:'0',name:'个人费用'},{value:'1',name:'公用费用'}],require:true,msg:'请选择费用类型'},
                    {type:'cascader',name:'ascript',label:'费用所属项目',style:'width:43%',pro:res.data.data.center_list,require:true,msg:'请选择费用所属'},
                    {type:'input',name:'expense_money',label:'申请费用',style:'width:43%',ischange:true,require:true,msg:'申请费用不能为空'},
                    {type:'input',name:'expense_money_upper',label:'大写',style:'width:43%',disabled:true},
                    {type:'cascader',name:'subject',label:'费用科目',style:'width:43%'},
                    {type:'cascader',name:'real_subject',label:'实际科目',style:'width:43%'},
                    {type:'input',name:'commun_company',label:'内部通启公司',style:'width:43%',require:true,msg:'通启公司不能为空'},
                    {type:'input',name:'commun_num',label:'内部通启编号',style:'width:43%',isblur:true,require:true,msg:'通启编号不能为空'},
                    {type:'input',name:'real_action',text:'textarea',label:'费用说明',style:'width:87%',require:true,msg:'费用说明不能为空'},
                    {type:'input',name:'action',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'通申请事由不能为空'},
                    {type:'select',name:'invoice_type',label:'发票类别',style:'width:43%',option:[{value:'0',name:'普通增值税发票'},{value:'1',name:'专用增值税发票'}]},
                    {type:'input','name':'input_tax',label:'进项税',style:'width:43%',},
                    {type:'select',name:'invoice_year',label:'发票年限',style:'width:87%',option:[{value:'2019',name:'2019'},{value:'2020',name:'2020'}]},
                    {type:'upload',name:'',label:'附件',style:'width:87%'},
                ]
                this.settlelist = [
                   {type:'select','name':'transfer_type',label:'发放方式',style:'width:87%',option:[{id:1,name:'现金发放'},{id:0,name:'网银转账'}]},
                   {type:'date','name':'sign_for_time', text:'datetime',label:'签收时间',style:'width:87%',value:'value2'},
                   {type:'input','name':'sign_for',label:'签收人',style:'width:87%'},
                   {type:'input','name':'e_bank_num',label:'转账凭证号',style:'width:87%'},
                 
               ]
                result.invoice_type= result.invoice_type.toString()
                result.invoice_year= result.invoice_year.toString()
                result.invoice_year= result.invoice_year.toString()
                result.subject = [result.subject_first,result.subject_second,result.subject_third]
                result.real_subject= [result.real_subject_first,result.real_subject_second,result.real_subject_third]
                result.ascript= [parseInt(result.ascript_centre),parseInt(result.ascript_department)]
              
                this.expenseditlnfo=res.data.data
                this.formobj = result
             
                this.loading= false
            }
        })
      },
      //搜索
      seach(){
          
        this.getexpenselist()
      },
      // 清空
      clear(){
        this.formRight = {}
        this.getexpenselist()
      },
      // 改变页码
      change(e){
       
        var obj = {page:e}
        this.getexpenselist(obj)
      },
      // 审核
      clicksure(e){
        expenseexamine(e).then(res=>{
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
               this.getexpenselist()
           }
        })
      },
      check(e){
        this.checktype = e
        this.getexpenselist()
      },
      // 获取table信息
      getexpenselist(val){
            var obj ={process_status:this.checktype,company_id:parseInt(localRead('comid')),...this.formRight,...val}
            this.spinShow = true
            expenselist(obj).then(res => {
                if(res.data.status ===20000){
                    this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data.expenseData
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        expenseadd(id).then(result=>{
            this.loading = false
            if(result.data.status ===20000){
                this.isopen = true
                var res = result.data.data
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                    {type:'p',name:' ',value :' '},
                    {type:'p',name:'编号:',value :res.expenseNumber},
                    {type:'p',name:'申请人:',value:res.userInfo.name},
                    {type:'p',name:'申请中心:',value:res.userInfo.company_center.name},
                    {type:'select','name':'type',label:'费用类型',style:'width:43%',option:[{value:'0',name:'个人费用'},{value:'1',name:'公用费用'}],require:true,msg:'请选择'},
                    {type:'cascader','name':'ascript',label:'费用所属项目',style:'width:43%',pro:result.data.data.center_list,require:true,msg:'请选择'},
                    {type:'input','name':'expense_money',label:'申请费用',style:'width:43%',ischange:true,require:true,msg:'申请费用不能为空'},
                    {type:'input','name':'expense_money_upper',label:'大写',style:'width:43%',disabled:true,},
                    {type:'input','name':'real_money',label:'实际金额',style:'width:87%',ischange:true,require:true,msg:'实际金额不能为空'},
                    {type:'cascader','name':'subject',label:'费用类别',style:'width:43%'},
                    {type:'cascader','name':'real_subject',label:'实际科目',style:'width:43%',},
                    {type:'input','name':'commun_company',label:'内部通启公司',style:'width:43%',require:true,msg:'通启公司不能为空'},
                    {type:'input','name':'commun_num',label:'内部通启编号',style:'width:43%',isblur:true,require:true,msg:'通启编号不能为空'},
                    {type:'input','name':'real_action',text:'textarea',label:'费用说明',style:'width:87%',require:true,msg:'费用说明不能为空'},
                    {type:'input','name':'action',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'申请事由不能为空'},
                    {type:'select','name':'invoice_type',label:'发票类别',style:'width:43%',option:[{value:'0',name:'普通增值税发票'},{value:'1',name:'专用增值税发票'}]},
                    {type:'input1','name':'input_tax',label:'进项税(增值税)',style:'width:43%',},
                    {type:'select','name':'invoice_year',label:'发票年限',style:'width:43%',option:[{value:'2019',name:'2019'},{value:'2020',name:'2020'}]},
                    {type:'upload','name':'',label:'附件',style:'width:87%'},
                ]
                this.appinfo = result.data.data
            }
        })
      },
      addapproval(id){
          this.process = 0
          this.isedit ='0'
          this.loading = true
          this.getexpenseadd({company_id:localRead('comid')})
      },
      //结算
      settle(e){
        e.sign_for_time = this.formatDate(e.sign_for_time)
        var obj = {
            id :this.expenseditlnfo.expenseInfo.id,
            ...e
        }
        settlement(obj).then(res=>{
            if(res.data.status==20000){
                this.$Message.success(res.data.msg)
                this.cancel()
            }
        })
      },
      cancel(a){
          this.appinfo = {}
          this.settlelist= []
          this.infolist = []
          this.expenseditlnfo ={}
          this.isopen= false
      },
      forminfo(e){
            if(this.isedit==='0'){
                var obj = {
                company_id:this.appinfo.company_id,
                expense_number:this.appinfo.expenseNumber,
                apply_centre:this.appinfo.userInfo.company_center.name,
              
                subject_first:e.subject ? e.subject[0] : '',
                subject_second:e.subject[1] ? e.subject[1] : '',
                subject_third:e.subject[2] ? e.subject[2] : '',
                ascript_centre:e.ascript?e.ascript[0]:'',
                ascript_department:e.ascript[1]?e.ascript[1]:'',
                real_subject_first:e.real_subject ? e.real_subject[0] : '',
                real_subject_second:e.real_subject[1] ? e.real_subject[1] : '',
                real_subject_third:e.real_subject[2] ? e.real_subject[2] : '',
                ...e
            
            }
            expenseaddpost(obj).then(res=>{
                debugger
                if(res.data.status===20000){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getexpenselist()
                }
            })
         }else if(this.isedit==='2'){
            e.subject_first= e.subject ? e.subject[0] : '',
            e.subject_second=e.subject[1] ? e.subject[1] : '',
            e.subject_third=e.subject[2] ? e.subject[2] : '',
            e.ascript_centre=e.ascript?e.ascript[0]:'',
            e.ascript_department=e.ascript[1]?e.ascript[1]:'',
            e.real_subject_first=e.real_subject ? e.real_subject[0] : '',
            e.real_subject_second=e.real_subject[1] ? e.real_subject[1] : '',
            e.real_subject_third=e.real_subject[2] ? e.real_subject[2] : '',
            expenseditpost(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getexpenselist()
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
        this.getexpenselist()
       
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
  