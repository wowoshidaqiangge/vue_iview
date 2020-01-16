<template>
    <div class="page">
        <Form :model="formRight" label-position="right"  inline>
            <FormItem label="编号" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.dealings_number"></Input>
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
            <Button type="primary"  slot="extra" @click="addapproval(1)">往来支付申请单</Button>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Tabs>
        <!-- <Model :value="isopen" @cancel='cancel' >
           
        </Model> -->
         <Formodal  width='850' 
           v-model="isopen" 
           :infolist='infolist'
           :title='title'
            @forminfo = "forminfo"  
            @cancel='cancel' 
           :appinfo = 'appinfo' 
           :loading='loading'
           :isedit=isedit
           :formobj=formobj
           @settle='settle'
           :process=process
           :settlelist='settlelist'
           :finance= finance
           @clicksure='clicksure'
           :expenseditlnfo='expenseditlnfo'
           ref='formodal'
        >
           
        </Formodal  >
    </div>
  </template>
  
  <script>
    import store from '@/store'
    
    import { dealingslist ,dealingscreate,dealingscreatepost,dealingsedit,dealingseditpost,dealingsexamine,dealingsfinanceedit} from '@/api/form'
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
            title:`往来支付申请 `,
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
                dealings_number:'',
                user_name:''
            },
            columns1: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '编号',
                        key: 'dealings_number'
                    },
                    {
                        title: '单据概要',
                        key: 'apply_content'
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
        dealingsedit({id:e.id,company_id:localRead('comid')}).then(result=>{
            debugger
            if(result.status===200){
                this.loading= false
                var res = result.data.data
                this.infolist = [
                    {type:'p',name:'时间:',value:res.dealingsInfo.created_at},
                    {type:'p',name:'编号:',value :res.dealingsInfo.dealings_number},
                    {type:'p',name:'申请中心:',value :res.dealingsInfo.from_center},
                    {type:'p',name:'姓名:',value:res.dealingsInfo.user_name},
                    {type:'cascader',name:'to_center',label:'费用所属项目',style:'width:87%',pro:result.data.data.center_list,},
                    {type:'input','name':'pay_amount',label:'借款金额',style:'width:43%',ischange:true,require:true,msg:'金额不能为空'},
                    {type:'input','name':'amount_in_words',label:'大写',style:'width:43%',disabled:true,},
                    {type:'input','name':'pay_company',label:'支付单位',style:'width:43%',require:true,msg:'单位不能为空'},
                    {type:'input','name':'pay_time',label:'支付时间',style:'width:43%',},
                    {type:'input','name':'bank_name',label:'账户名称',style:'width:43%',},
                    {type:'input','name':'card_numbers',label:'开户行账户',style:'width:43%',},
                    {type:'input','name':'internal_notice_company',label:'内部通启公司',style:'width:43%'},
                    {type:'input','name':'internal_notice_num',label:'内部通启编号',style:'width:43%',},
                    {type:'input','name':'apply_content',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'事由不能为空'},
                    {type:'cascader','name':'subject',label:'费用科目',style:'width:87%',require:true,msg:'不能为空'},
                    {type:'upload','name':'',label:'附件',style:'width:87%'},

                ]
                this.settlelist = [
                   {type:'input','name':'voucher_num',label:'转账凭证号',style:'width:87%'},
               ]
                result.data.data.dealingsInfo.to_center= result.data.data.dealingsInfo.to_center.split(',').map(Number)
                result.data.data.dealingsInfo.subject = [result.data.data.dealingsInfo.subject_first,result.data.data.dealingsInfo.subject_second,result.data.data.dealingsInfo.subject_third]
                setTimeout(()=>{
                    this.expenseditlnfo=result.data.data
                    this.formobj = result.data.data.dealingsInfo
                })
            }
        })
      },
      seach(){
          
          this.getdealingslist()
        },
        // 清空
        clear(){
          this.formRight = {}
          this.getdealingslist()
        },
        // 改变页码
        change(e){
         
          var obj = {page:e}
          this.getdealingslist(obj)
      },
      clicksure(e){
        dealingsexamine(e).then(res=>{
           
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
               this.getdealingslist()
           }
        })
      },
      check(e){
        this.checktype = e
        this.getdealingslist()
      },
      // 获取table信息
      getdealingslist(val){
        var obj ={process_status:this.checktype,company_id:localRead('comid'),...this.formRight,...val}
             this.spinShow = true
             dealingslist(obj).then(res => {
                if(res.status ===200){
                    this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data.dealingsData || []
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        dealingscreate(id).then(result=>{

            if(result.status ===200){
                var res = result.data.data
                this.appinfo = result.data.data
               
                this.loading = false
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                    {type:'p',name:'编号:',value :res.dealings_number},
                    {type:'p',name:'申请中心:',value:res.userInfo.team_center.name},
                    {type:'p',name:'姓名:',value:res.userInfo.name},
                    {type:'cascader',name:'to_center',label:'费用所属项目',style:'width:87%',pro:result.data.data.center_list,require:true,msg:'请选择'},
                    {type:'input','name':'pay_amount',label:'借款金额',style:'width:43%',ischange:true,require:true,msg:'金额不能为空'},
                    {type:'input','name':'amount_in_words',label:'大写',style:'width:43%',disabled:true,},
                    {type:'input','name':'pay_company',label:'支付单位',style:'width:43%',require:true,msg:'单位不能为空'},
                    {type:'input','name':'pay_time',label:'支付时间',style:'width:43%',},
                    {type:'input','name':'bank_name',label:'账户名称',style:'width:43%',},
                    {type:'input','name':'card_numbers',label:'开户行账户',style:'width:43%',},
                    {type:'input','name':'internal_notice_company',label:'内部通启公司',style:'width:43%',},
                    {type:'input','name':'internal_notice_num',label:'内部通启编号',style:'width:43%',},
                    {type:'input','name':'apply_content',text:'textarea',label:'费用申请事由',style:'width:87%',require:true,msg:'事由不能为空'},
                    {type:'cascader','name':'subject',label:'费用科目',style:'width:87%',require:true,msg:'不能为空'},
                    {type:'upload','name':'',label:'附件',style:'width:87%'},


                  
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
      //结算
      settle(e){
          debugger
         var obj = {
             id :this.expenseditlnfo.dealingsInfo.id,
             ...e
         }
         dealingsfinanceedit(obj).then(res=>{
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
          this.settlelist= []
          this.infolist = []
          this.isopen= false
      },
      forminfo(e){
         e.to_center = e.to_center.toString()
         if(this.isedit==='0'){
            var obj = {
            company_id:this.appinfo.company_id,
            dealings_number:this.appinfo.dealings_number,
            from_center:'财务中心',
            subject_first:e.subject ? e.subject[0] : '',
            subject_second:e.subject[1] ? e.subject[1] : '',
            subject_third:e.subject[2] ? e.subject[2] : '',
            user_name:this.appinfo.userInfo.name,
            ...e
          }
          dealingscreatepost(obj).then(res=>{
                if(res.data.status==20000){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getdealingslist()
                }else{
                    this.$Message.error(res.data.msg)
                }
            })
         }else if(this.isedit==='2'){
            e.subject_first= e.subject ? e.subject[0] : '',
            e.subject_second=e.subject[1] ? e.subject[1] : '',
            e.subject_third=e.subject[2] ? e.subject[2] : '',
            dealingseditpost(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getdealingslist()
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
       
        this.getdealingslist()
       
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
  