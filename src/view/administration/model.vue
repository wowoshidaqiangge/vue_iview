<template>
    <Modal
        :value="value"
        title="行政事务内部通启—— "
        @on-ok="ok"
        width='850'
        :loading="loading"
        @on-cancel="cancel">
        <div>
            <div  >
                <p class="p1">
                    <span>时间: </span>
                    <span v-if="communinfo">{{  communinfo.userInfo.created_at}}</span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.created_at}}</span>
                </p>
                <p class="p1">
                    <span></span>
                    <span></span>
                </p>
                <p class="p1">
                    <span>编号: </span>
                    <span  v-if="communinfo">{{communinfo.communNumber }}</span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.commun_number}}</span>
                </p>
             
                <p class="p1">
                    <span>致(公司名称): </span>
                    <span v-if="communinfo">{{communinfo.userInfo.user.company.name }} </span>
                    <span v-if="communeditlnfo.communInfo">{{communeditlnfo.communInfo.to_company}}</span>
                </p>
                <p class="p1">
                    <span>职务: </span>
                    <span v-if="communinfo">{{communinfo.userInfo.user.position.name}}</span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.to_position}}</span>
                </p>
                <p class="p1">
                    <span>姓名: </span>
                    <span v-if="communinfo">{{communinfo.userInfo.user.name}} </span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.leader_name}}</span>
                </p>
                <p class="p1">
                    <span>由(公司名称): </span>
                    <span v-if="communinfo">{{communinfo.userInfo.company.name}} </span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.from_company}}</span>
                </p>
                <p class="p1">
                    <span>职务: </span>
                    <span v-if="communinfo">{{communinfo.userInfo.position.name}}</span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.from_position}}</span>
                </p>
                <p class="p1">
                    <span>姓名: </span>
                    <span v-if="communinfo">{{communinfo.userInfo.name}} </span>
                    <span v-if="JSON.stringify(communeditlnfo) != '{}' ">{{communeditlnfo.communInfo.user_name}}</span>
                </p>
            </div>
            <Form v-if='communeditlnfo'  ref="formValidate" :model="formValidate" label-position="right" :rules="ruleValidate" :label-colon="isicon" :label-width="115" inline>
                
                <FormItem label="事宜" prop="action" style="width: 87%;" class="f14" >
                    <Input v-model="formValidate.action" :maxlength=23 placeholder="事宜不超过23个汉字" :disabled="isdisable" ></Input>
                </FormItem>
                <FormItem label="附件"  style="width: 87%;" class="f14">
                    <Uploadfile @uploadid='uploadid' ref='refupload' :fileid = 'formValidate.file_ids' :isedit='isedit' :isdisable=isdisable />
                </FormItem>
                <FormItem label="抄呈中心" prop="copy_name" style="width: 43%;" class="f14">
                    <Input v-model="formValidate.copy_name" placeholder="请输入" :disabled="isdisable"></Input>
                </FormItem>
                <FormItem label="抄呈人" prop="copy_user" style="width: 42.5%;" class="f14">
                    <Select v-model="formValidate.copy_user" placeholder="请选择" :disabled="isdisable" @on-change="((e)=>{copychange(e,communinfo.userList)})">
                        <Option :value=item.id v-if='communinfo' v-for="(item,index) in communinfo.userList">{{item.name}}</Option>
                        <Option :value=item.id v-if="JSON.stringify(communeditlnfo) != '{}' " v-for="(item,index) in communeditlnfo.userList">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="抄送中心" prop="send_name" style="width: 43%;" class="f14">
                    <Input v-model="formValidate.send_name" placeholder="请输入" :disabled="isdisable"></Input>
                </FormItem>
                <FormItem label="抄送人" prop="send_user" style="width: 42.5%;" class="f14">
                    <Select v-model="formValidate.send_user" placeholder="请选择" :disabled="isdisable" @on-change="((e)=>{sendchange(e,communinfo.userList)})">
                        <Option :value=item.id v-for="(item,index) in communinfo.userList">{{item.name}}</Option>
                        <Option :value=item.id v-if="JSON.stringify(communeditlnfo) != '{}' " v-for="(item,index) in communeditlnfo.userList">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="通启内容" prop="content" style="width: 87%;" class="f14" >
                    <Input v-model="formValidate.content"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" :disabled="isdisable"></Input>
                </FormItem>
            
            </Form >
            <div>
                <div class="model_lable">审批流程</div>
                <div style="display: flex;justify-content: center;" v-if="JSON.stringify(communeditlnfo) != '{}' ">
                    <div class="model_flow" v-for= '(item,index) in communeditlnfo.communInfo.sign_process' v-if=' item.status ==1'>
                        <div class="model_img" >
                            <div v-if="item.img!= null "><img :src='item.img.img'/></div>
                            <div v-if='item.img== null '><img src="./../../assets/images/wating.png"/></div>
                            <p>{{item.role.name}}</p>
                        </div>
                        <div class="model_next" v-if="index != communeditlnfo.communInfo.sign_process.length-1 ">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                    <div class="model_flow" v-for= '(item,index) in communeditlnfo.communInfo.sign_process' v-if='index == communeditlnfo.communInfo.current_process && process > 1'>
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
                        <div class="model_next" v-if="index != communeditlnfo.communInfo.sign_process.length-1  ">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                    <div class="model_flow" v-for= '(item,index) in communeditlnfo.communInfo.sign_process' v-if='item.status !=1 && (index != communeditlnfo.communInfo.current_process || process < 2)  '>
                        <div class="model_img" >
                            <div v-if="item.status ==2">
                                <p style="font-weight:600;text-align:center">{{item.role.name}}:</p>
                                <p style="text-align:center;overflow:hidden;height:30px" :title=item.refuse_action >{{item.refuse_action}}</p>
                            </div>
                            <div v-if='item.status== 0 '><img src="./../../assets/images/wating.png"/></div>
                            <p>{{item.role.name}}</p>
                        </div>
                        <div class="model_next" v-if="index != communeditlnfo.communInfo.sign_process.length-1  ">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                </div>
                <div style="display: flex;justify-content: center;" v-if="JSON.stringify(communeditlnfo) == '{}' ">
                    <div class="model_flow" v-for= '(item,index) in addapprov'>
                        <div class="model_img">
                            <div><img :src='item.img'/></div>
                            <p>{{item.name}}</p>
                        </div>
                        <div class="model_next" v-if="index != addapprov.length-1  ">
                            <img src="./../../assets/images/next.png"/>
                        </div>
                    </div>
                </div>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <div slot="footer" v-if=" process > 1 || (JSON.stringify(communeditlnfo) != '{}' && communeditlnfo.communInfo.current_process > 1 && issuccess) "></div>
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
  import {  communadd,communaddpost,communeditpost,communexamine} from '@/api/form'
  import {  setTitle,localRead } from '@/libs/util'
  import Uploadfile from './../formodal/upload.vue'
  import imgpath from '@/assets/images/wating.png'
  export default {
    components:{
        Uploadfile
    },
    name: 'approval_model',
    props: {
        value: Boolean,
        size: Number,
        communeditlnfo:Object,
        isedit :String,
        process:Number,
       
    },
    data () {
        return {
            commun:'',// 审核确定时的信息
            Radiovalue:'1',
            modal13:false,
            Inputvalue:'',
            model1:'',
            issuccess:true,
            isdisable:false,
            addapprov:[
                {img:imgpath,name:'申请人电子签章'},
                {img:imgpath,name:'申请人电子签章'},
                {img:imgpath,name:'申请人电子签章'},
                {img:imgpath,name:'申请人电子签章'},
            ],
            communinfo:'',
            spinShow:false,
            loading:false,
            file_id:'',
            formValidate: {
                },
                ruleValidate: {
                    action: [
                        { required: true, message: '事宜不能为空', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '通启内容不能为空', trigger: 'blur' },
                      
                    ],
                },
                isicon:true 
        }
    },
    mounted(){
         console.log(this.communeditlnfo)
    },
    watch:{
        communeditlnfo:{
            handler(val, oldVal){
              if(JSON.stringify(val) != "{}"){
                this.formValidate = val.communInfo
                this.formValidate.copy_user =parseInt(this.formValidate.copy_user)
                this.formValidate.send_user = parseInt(this.formValidate.send_user)
                this.communeditlnfo = val
                val.communInfo.sign_process.map((item)=>{
                     if(item.status===2){
                        this.issuccess = false
                     }
                 })
              }
            }
        }
    },
    methods: {
         // 获取表单头部信息
         getcommunadd(id){
            var comid ={company_id:localRead('comid')}
            this.spinShow = true
            communadd(comid).then(res=>{
                if(res.data.status==20000){
                    this.spinShow = false
                    this.communinfo = res.data.data
                }
            })
       },
       sendchange(e,it){
          if(it&&it.length>0){
            it.map(item=>{
                if(item.id===e){
                    if(item.center_name){
                        this.formValidate.send_name= `${JSON.stringify(this.communinfo) != '{}'?this.communinfo.userInfo.company.name:this.communeditlnfo.communInfo.from_company}${item.center_name}`
                       }else{
                         that.formValidate.send_name = JSON.stringify(this.communinfo) != '{}'? this.communinfo.userInfo.company.name :this.communeditlnfo.communInfo.from_company  
                       }
                   
                }
            })
          } 
       },
       copychange(e,it){
          if(it&&it.length>0){
            it.map(item=>{
                if(item.id===e){
                    if(item.center_name){
                        this.formValidate.copy_name= `${JSON.stringify(this.communinfo) != '{}'?this.communinfo.userInfo.company.name:this.communeditlnfo.communInfo.from_company}${item.center_name}`
                       }else{
                         that.formValidate.copy_name = JSON.stringify(this.communinfo) != '{}'? this.communinfo.userInfo.company.name :this.communeditlnfo.communInfo.from_company  
                       }
                }
            })
          }
            
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
            communexamine(obj).then(res=>{
                if(res.status===200){
                        this.$Message.success(res.data.msg)
                        this.$emit('cancel',false)
                        this.$emit('getcommunlist','')
                    }
            })
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
                communexamine(obj).then(res=>{
                    if(res.status===200){
                        that.$Message.success(res.data.msg)
                        that.modal13=false
                        that.$emit('cancel',false)
                        this.$emit('getcommunlist','')
                        this.Radiovalue = '1'
                        this.Inputvalue = ''
                    }
                })
            }
       },
       uploadid(data){
         this.file_id = data.toString()
         console.log(this.file_id)
       },
       // 关闭弹窗清空
        cancel(e){
            this.$emit('cancel',false)
            this.$emit('communeditlnfo',{})
            this.communinfo=''
            this.issuccess = true
            
            this.formValidate = {}
            this.isop = false
            this.$refs.refupload.clear()
        },
        ok(e){
            this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if(this.isedit==='2'){
                            var obj= {
                                ...this.formValidate,
                                file_ids:this.file_id
                            }
                            this.loading = true
                            communeditpost(obj).then(res=>{
                                if(res.status ===200){
                                    this.loading = false
                                    this.$Message.success(res.data.msg);
                                    this.$emit('cancel',false)
                                  
                                }else{
                                    this.$Message.error(res.data.msg)
                                }
                            })
                        }else{
                            var obj= {
                                commun_number:this.communinfo.communNumber,
                                to_company:this.communinfo.userInfo.user.company.name,
                                to_position:this.communinfo.userInfo.user.position.name,
                                leader_name:this.communinfo.userInfo.user.name,
                                user_name:this.communinfo.userInfo.name,
                                from_company:this.communinfo.userInfo.company.name,
                                from_position:this.communinfo.userInfo.position.name,
                                company_id:this.communinfo.company_id,
                                file_ids:this.file_id,
                                ...this.formValidate
                            }
                            this.loading  = true
                            communaddpost(obj).then(res=>{
                                if(res.data.status ===20000){
                                    this.$Message.success(res.data.msg)
                                    this.$emit('cancel',false)
                                }else{
                                    this.$Message.error(res.data.msg)
                                }
                                this.loading = false
                            })
                        }
                        
                    } else {
                        this.$Message.error('Fail!');
                    }
            })
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
                  height: 100%;
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
  