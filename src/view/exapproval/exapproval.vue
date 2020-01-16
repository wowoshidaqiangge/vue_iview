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
                    <Page style="float: right;" :total="expenseList.total" :page-size='expenseList.per_page' :current='expenseList.current_page'  @on-change='change'/>
                </div>
            </TabPane>
            <Button type="primary"  slot="extra" @click="addapproval(1)">费用审批内部通启单</Button>
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
           :isedit=isedit
           :formobj=formobj
           :title = 'title'
           :settlelist = 'settlelist'
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
    
    import { costcommunlist ,costcommunadd,costcommunaddpost,costcommunedit,costcommunaddedit,costcommunexamine} from '@/api/form'
    import Formodal from './../formodal/index.vue'
    import { localRead } from '@/libs/util'
    import { getToken,  } from '@/libs/util'
    import { mapMutations } from 'vuex'
    export default {
    name: 'exapproval',
    components:{
       Formodal
    },
    data () {
        return {
            title:`费用审批内部通启 `,
            isedit:'0',
            process:1,
            expenseditlnfo:{},
            formobj:{},
            checktype:'1',
            spinShow:false,
            settlelist:[],
            isopen:false,
            expenseList:'',
            // finance:false,// 判断是否为财务
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
                        key: 'number'
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
        costcommunedit({id:e.id,company_id:localRead('comid')}).then(result=>{
           
            if(result.data.status===20000){
                this.loading= false
                var res = result.data.data
                this.infolist = [
                    {type:'p',name:'时间:',value:res.communInfo.created_at},
                    {type:'p',name:' ',value :' '},
                    {type:'p',name:'编号:',value :res.communInfo.number},
                    {type:'p',name:'致公司:',value:res.communInfo.to_company},
                    {type:'p',name:'职务:',value:res.communInfo.to_position},
                    {type:'p',name:'姓名:',value:res.communInfo.leader_name},
                    {type:'p',name:'由公司:',value:res.communInfo.from_company},
                    {type:'p',name:'职务:',value:res.communInfo.from_position},
                    {type:'p',name:'姓名:',value:res.communInfo.user_name},
                    {type:'input','name':'action',label:'事宜',style:'width:87%',require:true,msg:'事宜不能为空'},
                    {type:'upload','name':'',label:'附件',style:'width:87%'},
                    {type:'input','name':'money',label:'申请费用',style:'width:43%',ischange:true,},
                    {type:'input','name':'money_upper',label:'大写',style:'width:43%',disabled:true},
                    {type:'input','name':'copy_name',label:'抄呈内容',style:'width:43%'},
                    {type:'select','name':'copy_user',label:'抄呈人',style:'width:43%',option:result.data.data.userList},
                    {type:'input','name':'send_name',label:'抄送内容',style:'width:43%'},
                    {type:'select','name':'send_user',label:'抄送人',style:'width:43%',option:result.data.data.userList},
                    {type:'input','name':'content',text:'textarea',label:'费用申请事由',style:'width:87%',},
                ]

                this.expenseditlnfo=result.data.data
                this.formobj = result.data.data.communInfo
              
            }
        })
      },

      // 搜索
      seach(){
        this.getcostcommunlist()
      },
      //清空
      clear(){
        this.formRight = {}
        this.getcostcommunlist()
      },
      //切换页码
      change(e){
        var obj = {page:e}
        this.getcostcommunlist(obj)
      },
      clicksure(e){
        costcommunexamine(e).then(res=>{
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
           }
        })
      },
      check(e){
        this.checktype = e
        this.getcostcommunlist()
      },
      // 获取table信息
      getcostcommunlist(val){
        var obj ={process_status:this.checktype,company_id:localRead('comid'),...this.formRight,...val}
             this.spinShow = true
             costcommunlist(obj).then(res => {
                if(res.data.status ===20000){
                    // this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data || []
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        costcommunadd(id).then(result=>{
            
            if(result.data.status ==20000){
                var res = result.data.data
             
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                    {type:'p',name:' ',value :' '},
                    {type:'p',name:'编号:',value :res.number},
                    {type:'p',name:'致公司:',value:res.userInfo.user.company.name},
                    {type:'p',name:'职务:',value:res.userInfo.user.position.name},
                    {type:'p',name:'姓名:',value:res.userInfo.user.name},
                    {type:'p',name:'由公司:',value:res.userInfo.company.name},
                    {type:'p',name:'职务:',value:res.userInfo.position.name},
                    {type:'p',name:'姓名:',value:res.userInfo.name},
                    {type:'input','name':'action',label:'事宜',style:'width:87%',require:true,msg:'事宜不能为空'},
                    {type:'upload','name':'',label:'附件',style:'width:87%'},
                    {type:'input','name':'money',label:'申请费用',style:'width:43%',ischange:true,},
                    {type:'input','name':'money_upper',label:'大写',style:'width:43%',disabled:true},
                    {type:'input','name':'copy_name',label:'抄呈中心',style:'width:43%'},
                    {type:'select','name':'copy_user',label:'抄呈人',style:'width:43%',option:result.data.data.userList},
                    {type:'input','name':'send_name',label:'抄送中心',style:'width:43%'},
                    {type:'select','name':'send_user',label:'抄送人',style:'width:43%',option:result.data.data.userList},
                    {type:'input','name':'content',text:'textarea',label:'费用申请事由',style:'width:87%',},
                ]
                this.appinfo = result.data.data
                this.loading = false
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
      cancel(a){
          this.formobj = {}
          this.appinfo = {}
          this.expenseditlnfo ={}
          this.infolist =[]
          this.isopen= false
      },
      forminfo(e){
        
         if(this.isedit==='0'){
            var obj = {
            company_id:this.appinfo.company_id,
            number:this.appinfo.number,
            to_company:this.appinfo.userInfo.user.company.name,
            to_position:this.appinfo.userInfo.user.position.name,
            leader_name:this.appinfo.userInfo.user.name,
            from_company:this.appinfo.userInfo.company.name,
            from_position:this.appinfo.userInfo.position.name,
            user_name:this.appinfo.userInfo.name,
            ...e
          }
          costcommunaddpost(obj).then(res=>{
                if(res.data.status==20000){
                    this.cancel()
                    this.getcostcommunlist()
                }
            })
         }else if(this.isedit==='2'){
           
            costcommunaddedit(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getcostcommunlist()
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
       
        this.getcostcommunlist()
       
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
  