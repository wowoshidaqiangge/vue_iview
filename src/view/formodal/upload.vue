<template>
    <div>
        <Upload 
            ref="upload"
            :before-upload="handleUpload" 
            :show-upload-list="false"
            :with-credentials='ismultiple'
            :multiple="ismultiple"
            :on-success="uploadSuccess"
            
            action='http://ias.silversea2.usa-silversea.com/api/upload/file' 
            >
            <Button icon="ios-cloud-upload-outline" >Upload files</Button>
        </Upload>
        <Button  @click ='add' style="position: absolute;left: 177px;top: 0;" :disabled = isdisable>上传</Button>
        <div class="demo-upload-list">
           <p v-for="item in uploadList" class="filelist">
                <Icon type="md-images" /> 
                <span v-if="item.ext=='xlsx' "><a :href='item.path' style="margin-left:5px" >{{item.name}}</a></span>
                <span v-if="item.ext !='xlsx' " style="margin-left:5px" @click="handleView(item)" >{{item.name}}</span> 
                <span @click="handleRemove(item)">X</span> 
                <Progress v-if="item.showProgress" style="position: absolute;left: 5px;bottom: -10px;" :stroke-width="2" :percent="item.percentage"></Progress v-if="item.showProgress">
           </p>
        </div>
        <Modal
            title="查看附件"
            v-model="uploadmodal1">
           <div>
               <img :src=imgurl style="width: 100%;"/>
           </div>
        </Modal>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import { showfile} from '@/api/form'

export default {
name: 'upload',
props: {
    value: Boolean,
    size: Number,
    infolist: {
        type: Array,
    },
    fileid:String,
    isedit:String,
    isdisable:Boolean
},
mounted () {
  
},
data () {
    return {
        uploadFile:[],
        ismultiple:true,
        uploadid:[],
        uploadList:[],
        uploadmodal1:false,
        imgurl:''
    }
},
watch:{
    fileid:{
        handler(newvalue,old){
           
           if(newvalue){
            this.uploadid = newvalue.split(',')
            this.$emit('uploadid',this.uploadid)
            showfile({file_ids:newvalue}).then(res=>{
            if(res.data.status === 20000){
                this.uploadList = res.data.data.fileInfo
                console.log(this.uploadList)
                }
            })
           }else{
            // this.$refs.upload.clearFiles();
            this.uploadFile=[]
            this.uploadList = []
            this.uploadid = []
           }
        },
        deep: true,
        immediate: true,
    }
   
},

methods: {
    ...mapActions([
        'formuploadFile',
        'getsubject'
    ]),
  
    handleRemove(file){
        
        var arr = []
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        if(this.isedit==='2'){
            const a = this.uploadList
            this.uploadList.splice(a.indexOf(file),1)
        }
        if(file.id){
            this.uploadid.map((item,index)=>{
                if(file.id != item){
                    arr.push(item)
                }
            })
        }else{
            this.uploadid.map((item,index)=>{
                    if(file.response.data.file_ids != item){
                        arr.push(item)
                    }
            })
        }
        this.uploadid = arr
        this.$emit('uploadid',this.uploadid)
    },
    handleView(e){
        debugger
        if(!e.id){
            var obj={
                file_ids: e.response.data.file_ids
            }
            showfile(obj).then(res=>{
               if(res.data.status ===20000){
                   this.uploadList =  res.data.data.fileInfo
               }
            })
        }else{
            this.imgurl = e.path
            this.uploadmodal1 = true
        }
        
    },
    handleUpload(file){
        var that = this
        that.uploadFile.push(file);
        if(that.uploadFile.length>5){
            this.$Message.error('一次最多上传5张')
        }
        return false;
    },
    uploadSuccess(res){
        if(res.status ===20000){
            this.uploadid.push(res.data.file_ids)
            this.$emit('uploadid',this.uploadid)
            // console.log(this.uploadid)
             this.uploadFile = []
          
        }
    },
    clear(){
        this.$refs.upload.clearFiles();
        this.uploadFile=[]
        this.uploadList = []
        this.uploadid = []
    },
    // uoloadremove(e){
    //     var that = this
    //     debugger
    //     var arr = []
    //     that.uploadid.map((item,index)=>{
    //         if(e.response.data.file_ids != item){
    //             arr.push(item)
    //         }
    //     })
    //     that.uploadid = arr
    //     console.log(that.uploadid)
    // },
    uploaderror(res){
    },
    
    add(){
       debugger
        var file = this.uploadFile[0]
        for(let i=0;i<this.uploadFile.length;i++){
            // file.append('files', this.uploadFile[i])
            this.$refs.upload.post(this.uploadFile[i])
        }
        if(this.isedit ==='2'){
            this.uploadList = [...this.uploadList,...this.$refs.upload.fileList]
        }else{
            this.uploadList = this.$refs.upload.fileList
        }
      
    },
  
}
}
</script>

<style lang="less" scoped>
    .filelist{
        height: 40px;
        padding:4px;
        border-radius: 4px;
        position: relative;
    }
    .filelist span:nth-of-type(1){
        
        cursor: pointer;
    }
    .filelist:hover span:nth-of-type(1){
        
        color: #2d8cf0;
    }
    .filelist span:nth-of-type(2){
        float: right;
        cursor: pointer;
        margin-right: 10px;
        display: none;
    }
    .filelist:hover{
        background: #f3f3f3;
    }
    .filelist:hover span:nth-of-type(2){
        display: block;
    }
</style>
