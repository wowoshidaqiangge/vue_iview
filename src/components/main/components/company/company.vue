<template>
    <div style="display: inline-block;vertical-align: top;">
      <span>当前所在公司：</span>
      <Dropdown trigger="click" @on-click="selectLang">
        <a href="javascript:void(0)">
          {{ title }}
          <Icon :size="18" type="md-arrow-dropdown" />
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-for="(value, key) in localList" :name="key" :key="`lang-${key}`">{{ value.name }}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </template>
  
  <script>
  import {  setTitle,localRead } from '@/libs/util'
  export default {
    name: 'Company',
    props: {
      lang: String
    },
    data () {
      return {
        title:'',
        langList:
        //  {
        //   'zh-CN': '阿里巴巴',
        //   'zh-TW': '腾讯',
        //   'en-US': '百度'
        // }
        JSON.parse(localRead('comlist')),
        localList: JSON.parse(localRead('comlist'))
      }
    },
    inject: [
      'reload'
    ],
    watch: {
      lang (lang) {
        this.$i18n.locale = lang
      },
    },
    mounted () {
        // console.log(JSON.parse(localRead('comlist')),this.gettitle())
       this.gettitle()
       
    },
    computed: {
      // title () {
      //   return this.gettitle()
      // }
    },
    methods: {
      selectLang (name) {
        this.langList.map((item,index)=>{
          if(index ==name){
              this.$store.commit("companyId",item.id)
              this.gettitle()
              this.reload()
              this.$Message.success('切换成功')
          }
        })
      },
      gettitle(){
        this.langList.map((res,index)=>{
           if(res.id==localRead('comid')){
             this.title  =  res.name
           }
        })
      }
    }
  }
  </script>
  