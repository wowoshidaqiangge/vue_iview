<template>
    <div class="page">
        <Form :model="formRight" label-position="right"  inline>
            <FormItem label="编号" style="width: 20%;">
                <Row>
                    <Col span="18">
                        <Input v-model="formRight.seal_number"></Input>
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
            <Button type="primary"  slot="extra" @click="addapproval(1)">盖章申请单</Button>
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
           :title = 'title'
           :formobj=formobj
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
    
    import { seallist ,sealcreate,sealcreatepost,sealedit,sealeditpost,sealexamine} from '@/api/form'
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
            title:'盖章申请',
            isedit:'0',
            process:1,
            expenseditlnfo:{},
            formobj:{},
            checktype:'1',
            spinShow:false,
            isopen:false,
            expenseList:'',
            // finance:false,// 判断是否为财务
            appinfo:{},
            prolist:[],//项目归属项列表
            loading:false,
            optionlist:[
            {value:'1',name:'行政审批类文件'},{value:'2',name:'银行类文件'},{value:'3',name:'证明类文件'},{value:'4',name:'公司证件复印件加盖印章'},
            {value:'5',name:'合同类文件'},{value:'6',name:'票据专用'},{value:'7',name:'财务销售佣金类文件'},{value:'8',name:'其它'}
            ],
            infolist:[
                   
            ],
            formRight: {
                seal_number:'',
                user_name:'',
            },
            columns1: [
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '编号',
                        key: 'seal_number'
                    },
                    {
                        title: '单据概要',
                        key: 'file_use'
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
        sealedit({id:e.id,company_id:localRead('comid')}).then(result=>{
            debugger
            if(result.status===200){
                this.loading= false
                var res = result.data.data
               
               
                this.infolist = [
                    {type:'p',name:'时间:',value:res.loanInfo.created_at},
                    {type:'p',name:'编号:',value :res.loanInfo.seal_number},
                    {type:'p',name:'姓名:',value:res.loanInfo.user_name},
                    {type:'Checkbox','name':'seal_type',label:'印章类型',style:'width:87%',Check:[{name:'公章',value:'1'},{name:'合同章',value:'2'},{name:'财务章',value:'3'},{name:'法人章',value:'4'},
                    {name:'发票章',value:'5'},{name:'小定金专业章',value:'6'}]},
                     {type:'select','name':'file_type',label:'文件类型',style:'width:43%',option:this.optionlist,require:true,msg:'类型不能为空'},
                    {type:'input','name':'seal_file_fullname',label:'加盖文件名称',style:'width:43%'},
                    {type:'input','name':'file_use',text:'textarea',label:'加盖印鉴用途',style:'width:87%',require:true,msg:'用途不能为空'},
                    {type:'upload','name':'',label:'盖章文件内容',style:'width:87%'},
                    {type:'input','name':'file_page_num',label:'文件页数',style:'width:43%',require:true,msg:'页数不能为空'},
                    {type:'input','name':'file_num',label:'文件份数',style:'width:43%',require:true,msg:'份数不能为空'},

                    // {type:'Checkbox','name':'seal_type',label:'印章类型',style:'width:87%',Check:[{name:'公章',value:'1'},{name:'合同章',value:'2'},{name:'财务章',value:'3'},{name:'法人章',value:'4'},
                    // {name:'发票章',value:'5'},{name:'小定金专业章',value:'6'}]},
                    // {type:'select','name':'file_type',label:'文件类型',style:'width:43%',option:this.optionlist},
                    // {type:'input','name':'seal_file_fullname',label:'加盖文件名称',style:'width:43%'},
                    // {type:'input','name':'file_use',text:'textarea',label:'加盖印鉴用途',style:'width:87%'},
                    // {type:'upload','name':'',label:'盖章文件内容',style:'width:87%'},
                    // {type:'input','name':'file_page_num',label:'文件页数',style:'width:43%'},
                    // {type:'input','name':'file_num',label:'文件份数',style:'width:43%'},
                   
                ]
                result.data.data.loanInfo.seal_type = result.data.data.loanInfo.seal_type.split(',')
                this.expenseditlnfo=result.data.data
                this.formobj = result.data.data.loanInfo
            }
        })
      },
       //搜索
       seach(){
          
          this.getseallist()
        },
        // 清空
        clear(){
          this.formRight = {}
          this.getseallist()
        },
        // 改变页码
        change(e){
         
          var obj = {page:e}
          this.getseallist(obj)
        },
      clicksure(e){
        sealexamine(e).then(res=>{
           
           if(res.data.status==20000){
               this.$Message.success(res.data.msg)
               this.$refs.formodal.cancel1()
               this.isopen = false
               this.getseallist()
           }
        })
      },
      check(e){
        this.checktype = e
        this.getseallist()
      },
      // 获取table信息
      getseallist(val){
        var obj ={process_status:this.checktype,company_id:localRead('comid'),...this.formRight,...val}
             this.spinShow = true
             seallist(obj).then(res => {
                if(res.status ===200){

                    // this.finance = res.data.data.userInfo.finance
                    this.expenseList = res.data.data || []
                    this.spinShow = false
                }
           }) 
      },
      //获取表单个人信息
      getexpenseadd(id){
        sealcreate(id).then(result=>{
            debugger
            if(result.status ===200){
                var res = result.data.data
                this.appinfo = result.data.data
              
                this.loading = false
                this.infolist = [
                    {type:'p',name:'时间:',value:res.userInfo.created_at},
                 
                    {type:'p',name:'姓名:',value:res.userInfo.name},
                    {type:'p',name:'编号:',value:res.seal_number},
                
                    {type:'Checkbox','name':'seal_type',label:'印章类型',style:'width:87%',Check:[{name:'公章',value:'1'},{name:'合同章',value:'2'},{name:'财务章',value:'3'},{name:'法人章',value:'4'},
                    {name:'发票章',value:'5'},{name:'小定金专业章',value:'6'}],require:true,msg:'类型不能为空'},
                     {type:'select','name':'file_type',label:'文件类型',style:'width:43%',option:this.optionlist,require:true,msg:'类型不能为空'},
                    {type:'input','name':'seal_file_fullname',label:'加盖文件名称',style:'width:43%'},
                    {type:'input','name':'file_use',text:'textarea',label:'加盖印鉴用途',style:'width:87%',require:true,msg:'用途不能为空'},
                    {type:'upload','name':'',label:'盖章文件内容',style:'width:87%'},
                    {type:'input','name':'file_page_num',label:'文件页数',style:'width:43%',require:true,msg:'页数不能为空'},
                    {type:'input','name':'file_num',label:'文件份数',style:'width:43%',require:true,msg:'份数不能为空'},
                  
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
      cancel(a){
          this.appinfo = {}
          this.expenseditlnfo ={}
          this.formobj = {}
          this.infolist=[]
         
          this.isopen= false
      },
      forminfo(e){
         if(this.isedit==='0'){
             e.seal_type = e.seal_type.toString()
            var obj = {
            company_id:this.appinfo.company_id,
            seal_number:this.appinfo.seal_number,
            
            user_name:this.appinfo.userInfo.name,
            ...e
          }
          sealcreatepost(obj).then(res=>{
                if(res.data.status==20000){
                    this.cancel()
                    this.getseallist()
                }
            })
         }else if(this.isedit==='2'){
            e.seal_type = e.seal_type.toString()
            sealeditpost(e).then(res=>{
                if(res.status==200){
                    this.$Message.success(res.data.msg)
                    this.cancel()
                    this.getseallist()
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
       
        this.getseallist()
       
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
  