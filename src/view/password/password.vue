<template>
    <Form class='formpassword' ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right"  :label-width="155">
        <FormItem label="旧密码" prop='password_old' style="width: 87%;margin-bottom:40px" >
            <Input type='password' v-model="formValidate.password_old" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="新密码"  prop='password_new' style="width: 87%;margin-bottom:40px">
            <Input type='password' v-model="formValidate.password_new" placeholder="请输入"></Input>
        </FormItem>
        <FormItem  style="width: 87%;">
            <Button type="success" long @click="pas">修 改</Button>
        </FormItem>
    </Form>
  </template>
  
  <script>
  import {updatepassword } from '@/api/form'
  export default {
    name: 'password',
  
    data () {
        return {
            value:true,
            formValidate: {
                password_old:'',
                password_new:''
                },
                ruleValidate: {
                    password_old: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    password_new:[
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                    }
        }
    },
    methods: {
        pas(){
            this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        updatepassword(this.formValidate).then(res=>{
                            if(res.data.status ===20000){
                                this.$Message.success(res.data.msg)
                                this.$store.commit("setToken",'')
                                this.$store.commit("setAccess",[])
                                this.$router.push({name: 'login'})
                            }
                        })
                    } 
            })
            
        }
      
    }
  }
  </script>
  
  <style lang="less" scoped>
     .formpassword{
         margin: 8% 20%
     }
  </style>
  