<template>
        <Modal
         :value= 'value'
         :title="title"
         width='850'
         ref='print'
         @on-cancel="cancel"
        >
            <div>
                <div>
                    <p class="p1" v-for="(item,index) in infolist" v-if="item.type =='p' ">
                        <span>{{item.name}}</span>
                        <span>{{item.value}}</span>
                    </p>
                   
                </div>
                
                <div v-if='isamount'>
                    <table class="table_num">
                        <tr>
                          <th>序号</th>
                          <th>类型</th>
                          <th>已批复单据编号</th>
                          <th>现金用途说明</th>
                          <th>申请金额 </th>
                          <th><Button type="primary" @click="addtd">+ 添加</Button></th>
                        </tr>
                        <tr v-for="(item ,index) in tdlist" >
                          <td><p  style="margin-bottom: 10px;">{{item.ids}}</p></td>
                          <td ><Select style="margin-bottom: 10px;" v-model="item.type"><Option  value='0'>报销</Option ><Option value='1'>借款</Option><Option value='2'>往来</Option> </Select style="margin-bottom: 10px;"></td>
                          <td><Input v-model="item.number" placeholder="单据编号" style="width: 120px;margin-bottom: 10px;"/></td>
                          <td><Input  v-model="item.introduction" placeholder="用途说明" style="width: 200px;margin-bottom: 10px;"/></td>
                          <td><Input  v-model="item.money" @on-blur='moneyblur' placeholder="申请金额" style="width: 100px;margin-bottom: 10px;"/></td>
                          <td><Button style="margin-bottom: 10px;" @click="(()=>{delet(item.ids)})">删除</Button ></td>
                        </tr>
                        <tr  >
                            <td></td>
                            <td><p style="margin-bottom: 10px;">总计金额：</p></td>
                            <td></td>
                            <td></td>
                            <td><Input  :value='allmoney'  style="width: 100px;margin-bottom: 10px;"/></td>
                            <td></td>
                          </tr>
                      </table>
                </div>
                <Form ref="formValidate" :model="formValidate" label-position="right" :rules="ruleValidate" :label-colon="isicon" :label-width="115"  inline>  
                    <FormItem :label=item.label :prop="item.name" :style="item.style" class="f14" v-for="(item,index) in infolist" :key="index" v-if="item.type != 'p' && item.type !='input1' " 
                    :rules=" item.require ? {required: true, message: item.msg, trigger: 'blur'} : {required: false} ">
                        <Input v-if="item.type =='input'&& !item.ischange && !item.isblur " :ref='item.ref' :type="item.text" v-model="formValidate[item.name]" placeholder="请输入" :disabled="item.disabled" />
                        <Input v-if="item.type =='input' && item.ischange " :type="item.text" v-model="formValidate[item.name]" placeholder="请输入" :disabled="item.disabled" @on-change='change'/>
                        <Input v-if="item.type =='input' && item.isblur " :type="item.text" v-model="formValidate[item.name]" placeholder="请输入" :disabled="item.disabled" @on-blur='blur'/>
                        
                         <Cascader v-if="item.type =='cascader' && !item.pro" v-model="formValidate[item.name]" :data="cascaderdata" :load-data="loadData"></Cascader>
                        <Cascader v-if="item.type =='cascader' && item.pro" v-model="formValidate[item.name]" :data="item.pro" ></Cascader>
                        <Uploadfile v-if="item.type =='upload' "  @uploadid='uploadid' ref='refupload' :fileid ='formValidate.file_ids' :isedit='isedit'></Uploadfile>
                        <CheckboxGroup v-if="item.type =='Checkbox'" v-model="formValidate[item.name]">
                            <Checkbox :label="e.value"  v-for="e in item.Check">
                                {{ e.name }}
                            </Checkbox>
                        </CheckboxGroup>
                        <Select v-if="item.type == 'select'" v-model="formValidate[item.name]" :label-in-value='true' @on-change='((e)=>{selchange(e,item)})'>
                            <Option v-for="e in item.option" :key="e.label" :value="e.value ?e.value:e.id " :disabled="item.disabled" placeholder="item.placeholder">
                              {{ e.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem :label=item.label :prop="item.name" :style="item.style" class="f14" v-for="(item,index) in infolist" :key="index"  v-if="item.type =='input1'&& istrue ">
                        <Input :type="item.text" v-model="formValidate[item.name]" placeholder="请输入"  />
                    </FormItem>
                </Form>
                <div>
                    <div class="model_lable" >审批流程</div>
                    <div style="display: flex;flex-wrap:wrap;width:80%;margin:0 10%;" v-if="JSON.stringify(expenseditlnfo) != '{}' ">
                        <div class="model_flow" v-for= '(item,index) in formobj.sign_process' v-if=' item.status ==1'>
                            <div class="model_img" >
                                <div v-if="item.img!= null "><img :src='item.img.img'/></div>
                                <div v-if='item.img== null '><img src="./../../assets/images/wating.png"/></div>
                                <p>{{item.role.name}}</p>
                            </div>
                            <div class="model_next" v-if="index != formobj.sign_process.length-1 ">
                                <img src="./../../assets/images/next.png"/>
                            </div>
                        </div>
                        <div class="model_flow" v-for= '(item,index) in formobj.sign_process' v-if='index == formobj.current_process && process == 2'>
                            <div class="model_img" >
                                <div >
                                    <div style="margin-left: 20px;position: relative;">
                                        <Select v-model ='model1' style="width:80px" placeholder='请审核' @on-change='changeoption'>
                                            <Option  value="1" >同意</Option>
                                            <Option  value="2" >不同意</Option>
                                        </Select>
                                        <Button size="small" type="primary" style="position: absolute;left: 38px;top: 39px;" @click="clicksure(item)">  确定</Button>
                                    </div>
                                </div>
                                <p>{{item.role.name}}</p>
                            </div>
                            <div class="model_next" v-if="index != formobj.sign_process.length-1  ">
                                <img src="./../../assets/images/next.png"/>
                            </div>
                        </div>
                        <div class="model_flow" v-for= '(item,index) in formobj.sign_process' v-if='item.status !=1 && (index != formobj.current_process || process != 2) '>
                            <div class="model_img" >
                                <div v-if="item.status ==2">
                                    <p style="font-weight:600;text-align:center">{{item.role.name}}:</p>
                                    <p style="text-align:center;overflow:hidden;height:30px" :title=item.refuse_action >{{item.refuse_action}}</p>
                                </div>
                                <div v-if='item.status== 0 '><img src="./../../assets/images/wating.png"/></div>
                                <p>{{item.role.name}}</p>
                            </div>
                            <div class="model_next" v-if="index != formobj.sign_process.length-1  ">
                                <img src="./../../assets/images/next.png"/>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;flex-wrap:wrap;width:660px;margin-left:80px;" v-if="JSON.stringify(appinfo) != '{}' ">
                        <div class="model_flow" v-for= '(item,index) in appinfo.role_info'>
                            <div class="model_img" >
                               
                                <div v-if='index== 0 '><img :src="appinfo.userInfo.img"/></div>
                                <div v-if='index!= 0 '><img src="./../../assets/images/wating.png"/></div>
                                <p>{{item.name}}</p>
                            </div>
                            <div class="model_next" v-if="index != appinfo.role_info.length-1  ">
                                <img src="./../../assets/images/next.png"/>
                            </div>
                        </div>
                    </div>
                </div>
                <Form ref="formVali" v-model="formVali"   label-position="right"   :label-width="115" inline>
                    <FormItem :label=item.label :props=item.name :style="item.style"  class="f14" v-for="(item,index) in settlelist">
                        <Input v-if="item.type =='input' "  :type="item.text" v-model="formVali[item.name]" placeholder="请输入"  />
                        <Select v-if="item.type == 'select'" v-model="formVali[item.name]" >
                            <Option v-for="e in item.option" :key="e.label" :value="e.id "  placeholder="item.placeholder">
                              {{ e.name }}
                            </Option>
                        </Select>
                        <DatePicker v-if="item.type == 'date'" v-model="formVali[item.name]"  :value="item.value" :type="item.text" ></DatePicker >
                    </FormItem>
                </Form>
                <Spin size="large" fix v-if="loading"></Spin>
            </div>
            <div slot="footer" v-if=" process === 1 &&(JSON.stringify(expenseditlnfo) != '{}' && (formobj.current_process === formobj.total_process ))  ">
                <Button  @click="cancel">取消</Button>
                <Button type="primary"  @click="preserve(1)">保存</Button>
                <Button type="primary"  @click="preserve(2)">完结</Button>
            </div>
            <div slot="footer"  v-if=" process == 3 ">
                <Button type="primary"  @click="print">打印</Button>
            </div>
            <div slot="footer" v-else-if=" process == 2 || (JSON.stringify(expenseditlnfo) != '{}' && formobj.current_process > 1 && issuccess) || (process == 1 && formobj.user_id != userid )  ">
            </div>
            
            <div slot="footer" v-else>
                <Button  @click="cancel">取消</Button>
                <Button type="primary"  @click="marksure">确认</Button>
            </div>
            <Modal v-model="modal13"  title="拒绝理由" width= 360>
                <RadioGroup v-model="Radiovalue" @on-change="radiochange">
                    <Radio label="1">重新修改</Radio>
                    <Radio label="2">此单作废 (理由必填)</Radio>
                </RadioGroup>
                <Input type="textarea" style="margin-top:16px" v-model='Inputvalue'/>
                <div slot="footer">
                        <Button type="text"  @click="cancel1">取消</Button>
                        <Button type="primary"  @click="define">确定</Button>
                    
                </div>
            </Modal>
        </Modal>
  </template>
  
  <script>
    import { communverify} from '@/api/form'
    import { getToken,  } from '@/libs/util'
    import Uploadfile from './upload.vue'
    import {mapActions} from 'vuex'
  export default {
    components:{
        Uploadfile
    },
    name: 'form_model',
    props: {
        value: Boolean,
        size: Number,
        
        settlelist:{
            type: Array,
        },
        title:String,
        isedit:String,
        appinfo:Object,
        process:Number,
        loading:Boolean,
        expenseditlnfo:Object,
        formobj:Object,
        infolist: {
            type: Array,
        },
        finance:Boolean,// 判断是否为财务
        isamount:Boolean, // 判断是否为现金支付
    },
    mounted () {
       console.log(this.infolist)
   },
   watch:{
    
    formobj:{
        handler(val, oldVal){
         
            if(JSON.stringify(val) != '{}'){
                var arr = []
                if(this.settlelist){
                    this.settlelist.map((item)=>{
                        arr.push(item.name)
                    })
                }
                Object.keys(val).forEach(key=>{
                    this.formValidate[key] = val[key]
                    if(arr.findIndex(v=> v==key) != -1){
                        this.formVali[key] = val[key]
                    }
                })
                // 判断审核中是否有拒绝
                val.sign_process.map((item)=>{
                     if(item.status===2){
                        this.issuccess = false
                     }
                 })
                 // 现金支付时获取支票列表
                 if(val.cash_cheque_detail){
                    var len = val.cash_cheque_detail.length-1
                    var arr = []
                    val.cash_cheque_detail.map((item)=>{
                        item.ids = item.id
                        item.type = item.type.toString()
                        arr.push(item)
                    })
                    this.tdlist =arr
                    this.ids = val.cash_cheque_detail[len].id
                 }
            }
        },
        deep: true,
        immediate: true,
    },
    infolist:{
        handler(val, oldVal){
            if(JSON.stringify(val) != '{}'){
               
            }
        },
        deep: true,
        immediate: true,
    },
   },
    data () {
        return {
           istrue:false,
            allmoney:0,
            issuccess:true,
            userid :getToken(),
            commun:'',
            cascaderdata:[],
            cascader:[],
            value2:[],
            modal13:false,// 审核二级弹窗
            uploadFile:'',
            ismultiple:true,
            Inputvalue:'',
            Radiovalue:'1',
            model1:'',
            tdlist:[],
            file_ids:'',
            formValidate: {},
            formVali:{},
           
            ruleValidate: {
             
            },
            isicon:true ,
            ids:0
        }
    },
    mounted(){
        let a = {id:0}
        this.getsub(a,1)
    },
    computed:{
      
       
    },
    methods: {
        ...mapActions([
            'formuploadFile',
            'getsubject'
        ]),
        selchange(e,it){
            var that= this
           
           if(e && e.label){
                if(e.label.trim() ==="专用增值税发票"){
                    this.istrue = true
                }else{
                    this.istrue = false
                }
           }
           if(it&& it.option){
            it.option.map((item)=>{
                if(item.id== e.value){
                   if(it.label.trim() ==="抄呈人"){
                       if(item.center_name){
                         that.formValidate.copy_name= `${JSON.stringify(that.appinfo) != '{}'?this.appinfo.userInfo.company.name:that.expenseditlnfo.communInfo.from_company}${item.center_name}`
                       }else{
                         that.formValidate.copy_name = JSON.stringify(that.appinfo) != '{}'? that.appinfo.userInfo.company.name :that.expenseditlnfo.communInfo.from_company  
                       }
                   }else if(it.label.trim() ==="抄送人"){
                    if(item.center_name){
                         that.formValidate.send_name= `${JSON.stringify(that.appinfo) != '{}'?this.appinfo.userInfo.company.name:that.expenseditlnfo.communInfo.from_company}${item.center_name}`
                       }else{
                         that.formValidate.send_name = JSON.stringify(that.appinfo) != '{}'? that.appinfo.userInfo.company.name :that.expenseditlnfo.communInfo.from_company  
                       }
                   }
                }
            })
           }
            
          
        },
        delet(id){
            let arr = []
            this.tdlist.map((item,index)=>{
                if(item.ids!=id){
                    arr.push(item)
                }else{
                    if(item.money){
                        this.allmoney = this.allmoney - parseInt(item.money)
                    }
                }
               
            })
            this.tdlist = arr
        },
        addtd(){
            this.ids = this.ids + 1
            this.tdlist.push({ids:this.ids,type:'',number:'',introduction:'',money:''})
        },
        moneyblur(){
            var a = 0
            this.tdlist.map((item)=>{
                if(item.money){
                    console.log(parseInt(item.money),item.money)
                    a = a + parseInt(item.money)
                }
                
                
               
            })
            this.allmoney = a
         
            console.log(a)
        },
        // 财务确认
        preserve(e){
            var obj = {
                submit_type :e,
                ...this.formVali
            }
            debugger
            this.$emit('settle',obj)
        },
        //审核 
       changeoption(e){
            this.model1 = e
       },
       //审核确定
       clicksure(info){
           this.commun = info
           if(this.model1 == '2'){
                this.modal13=true
           }else{
                var obj ={
                    link_id:info.link_id,
                    id:info.id,
                    status:this.model1
            }
            this.$emit('clicksure',obj)
           }
       },
       radiochange(e){
            this.Radiovalue = e
       },
       // 关闭审核弹窗
       cancel1(){
            this.modal13=false
            this.Radiovalue = '1'
            this.Inputvalue = ''
       },
       // 审核弹窗确定
       define(){
           var that = this
            if( !this.Inputvalue){
                this.$Message.error('请填写理由')
            }else{
                var obj ={
                    link_id:this.commun.link_id,
                    id:this.commun.id,
                    status:this.model1,
                    flag:this.Radiovalue,
                    refuse_action:this.Inputvalue
                }
                this.$emit('clicksure',obj)
            }
       },
        loadData(result,callback){
            result.loading = true;
            var id = {id: result.value}
            this.getsubject({id}).then(res=>{
                var arr = []
                if(res.status === 200){ 
                    res.data.data.map((item)=>{
                            if(!item.son){
                                delete item.children;
                                delete item.loading; 
                            }
                            arr.push(item)
                    })
                    result.children.push(...arr)
                    result.loading = false;
                    callback();
                }
            })
        },
        getsub(id,num,load){
            this.getsubject({id}).then(res=>{
                var arr = []
                if(res.status === 200){
                    res.data.data.map((item)=>{
                            if(!item.son){
                                    delete item.children;
                                    delete item.loading; 
                            }
                                arr.push(item)
                    })
                    this.cascaderdata = arr
                }
            })
            return
        },
        // 验证通启是否可用
        blur(e){
                communverify({number:e.target.value}).then(res=>{
                   
                    if(res.data.status==20000){
                    }
                })
        },
        change(e){
            this.number_chinese(e.target.value)
        },
        cancel(e){ 
           
            this.formVali = {}
           
            
           this.ruleValidate = {}
           this.issuccess = true
           this.tdlist = []
            this.formValidate={}
            this.$emit('cancel',false)
        },
      
        print(){
            this.$print(this.$refs.print)
        },
        marksure(){
            if(this.tdlist.length>0){
                var obj ={...this.uploadFile,...this.formValidate,...{cheque_detail:this.tdlist}}
            }else{
                var obj ={...this.uploadFile,...this.formValidate}
            }
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$emit('forminfo',obj)
                } else {
                        this.$Message.error('必填项不能为空！');
                }
            })
           
            
        },
        uploadid(data){
            this.uploadFile = {file_ids:data.toString()}
        },
        number_chinese(str) {
            if(str){
                    var num = parseFloat(str);
                    var strOutput = "",
                        strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
                    num += "00";
                    var intPos = num.indexOf('.');  
            if (intPos >= 0){
                        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
                    }
                    strUnit = strUnit.substr(strUnit.length - num.length);
                    for (var i=0; i < num.length; i++){
                        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
                    }
                    var a = strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
                    this.formValidate.expense_money_upper = a
                    this.formValidate.amount_in_words = a
                    this.formValidate.money_upper = a
                    this.formValidate.pay_money_upper=a
            }else {
                    this.formValidate.expense_money_upper = ''
                    this.formValidate.money_upper = ''
                    this.formValidate.amount_in_words =  ''
                    this.formValidate.pay_money_upper = ''
            }
        },
       
     
    }
  }
  </script>
  
  <style lang="less" scoped>
      .table_num{
          width: 90%;
          margin-left: 5%;
        
          tr{
              td{
                  text-align: center;
              }
          }
      }
      .table_num th:nth-of-type(1){
        height: 46px;
        line-height: 46px;

      }
      .p1{
        width: 30%;
        height: 45px;
        display: inline-block;

      }
      .p1:nth-of-type(3n+1){
          width: 40%;
      }
      .p1 span:nth-of-type(1){
          display: inline-block;
          width: 35%;
          font-weight: 600;
          font-size: 14px;
          color: #292B2B;
          line-height: 20px;
          text-align: end;
          padding-right: 10px;
      }
      .p1 span:nth-of-type(2){
          display: inline-block;
          width: 65%;
          font-weight: 400;
          font-size: 14px;
          color: #292B2B;
          line-height: 20px;
      }
      .f14 > :first-child{
          font-size: 14px;
          font-weight: 600;
      }
      .model_lable{
          width: 115px;
          font-size: 14px;
          font-weight: 600;
          padding-right: 10px;
          text-align: end;
          height: 45px;
      }
      .model_flow{
          display: flex;
         width:25%;
      }
      .model_img{
          display: flex;
          flex-direction: column;
          align-items: center;
          div{
              width: 120px;
              height: 60px;
              img{
                  width: 100%;
              }
              p{
              color: #787979;
              line-height: 30px;
              font-size: 12px;
              font-weight: 400;
             }
          }
          p{
              color: #787979;
              line-height: 45px;
              font-size: 14px;
              font-weight: 600;
          }
      }
      .model_next{
          padding-top: 23px;
          margin: 0 15px;
          img{
              width: 14px;
              height:14px;
          }
      }
  </style>
  