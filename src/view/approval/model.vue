<template>
    <Modal
        :value="value"
        title="费用申请内容通启 -杭州博兆嘉"
        @on-ok="ok"
        width='850'
      
        @on-cancel="cancel">
        <div >
            <div>
                <p class="p1">
                    <span>时间: </span>
                    <span>2019-12-12 09:47</span>
                </p>
                <p class="p1">
                    <span>编号: </span>
                    <span>7895456465 </span>
                </p>
                <p class="p1">
                    <span>进度:</span>
                    <span>78%</span>
                </p>
                <p class="p1">
                    <span>致(公司名称): </span>
                    <span>杭州阿里巴巴 </span>
                </p>
                <p class="p1">
                    <span>职务: </span>
                    <span>web前端</span>
                </p>
                <p class="p1">
                    <span>姓名: </span>
                    <span>大强哥 </span>
                </p>
                <p class="p1">
                    <span>由(公司名称): </span>
                    <span>杭州阿里巴巴 </span>
                </p>
            </div>
            <Form ref="formValidate" :model="formValidate" label-position="right" :rules="ruleValidate" :label-colon="isicon" :label-width="115" inline>
                <FormItem label="事宜" prop="name" style="width: 87%;" class="f14">
                    <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
               
                <FormItem label="抄呈" prop="city" style="width: 40%;" class="f14">
                    <Select v-model="formValidate.city" placeholder="Select your city">
                        <Option value="beijing">New York</Option>
                        <Option value="shanghai">London</Option>
                        <Option value="shenzhen">Sydney</Option>
                    </Select>
                </FormItem>
                <FormItem label="抄送" prop="city" style="width: 40%;" class="f14">
                    <Select v-model="formValidate.city" placeholder="Select your city">
                        <Option value="beijing">New York</Option>
                        <Option value="shanghai">London</Option>
                        <Option value="shenzhen">Sydney</Option>
                    </Select>
                </FormItem>
                <FormItem label="附件"  style="width: 40%;" class="f14">
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button icon="ios-cloud-upload-outline">Upload files</Button>
                    </Upload>
                </FormItem>
                <FormItem label="通启内容" prop="name" style="width: 87%;" class="f14">
                    <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="预算费用" prop="name" style="width: 43%;" class="f14">
                    <Input v-model="formValidate.name" placeholder="Enter your name" @on-change='change'></Input>
                </FormItem>
                <FormItem label="大写" prop="mm" style="width: 43%;" class="f14" >
                    <Input v-model="formValidate.mm" placeholder="Enter your name" disabled></Input>
                </FormItem>
              
            </Form>
            <div>
                <div class="model_lable">审批流程</div>
                <div style="display: flex;justify-content: center;">
                    <div class="model_flow">
                        <div class="model_img">
                            <div><img src="./../../assets/images/wating.png"/></div>
                            <p>申请人电子签章</p>
                        </div>
                        <div class="model_next">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                    <div class="model_flow">
                        <div class="model_img">
                            <div><img src="./../../assets/images/wating.png"/></div>
                            <p>申请人电子签章</p>
                        </div>
                        <div class="model_next">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                    <div class="model_flow">
                        <div class="model_img">
                            <div><img src="./../../assets/images/wating.png"/></div>
                            <p>申请人电子签章</p>
                        </div>
                        <div class="model_next">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                    <div class="model_flow">
                        <div class="model_img">
                            <div><img src="./../../assets/images/wating.png"/></div>
                            <p>申请人电子签章</p>
                        </div>
                      
                    </div>
                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
           
        </div>
       
    </Modal>
  </template>
  
  <script>
import {  expenseadd} from '@/api/form'
  export default {
    name: 'approval_model',
    props: {
        
        value: Boolean,
        size: Number
    },
    data () {
        return {
            spinShow:false,
            formValidate: {
                    name: '',
                    mail: '',
                    city: '',
                    gender: '',
                    interest: [],
                    date: '',
                    time: '',
                    desc: '',
                    mm:''
                },
                ruleValidate: {
                    name: [
                        { required: false, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    city: [
                        { required: false, message: 'Mailbox cannot be empty', trigger: 'blur' },
                      
                    ],
                },
                isicon:true 
        }
    },
    mounted(){
          var comid ={company_id:13}
          this.getexpenseadd(comid)
    },
    methods: {
         // 获取表单头部信息
       getexpenseadd(id){
            expenseadd(id).then(res=>{
                debugger
            })
       },
        change(e){

            this.number_chinese(e.target.value)
        },
        cancel(e){
            this.$emit('cancel',false)
            this.isop = false
        },
        ok(e){

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
                    this.formValidate.mm = strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
                   }else {
                    this.formValidate.mm = ''
                   }
                    

            },
     
    }
  }
  </script>
  
  <style lang="less" scoped>
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
          }
          p{
              color: #787979;
              line-height: 30px;
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
  