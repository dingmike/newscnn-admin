<template>
  <div class="upload-container">
   <!-- <el-upload class="image-uploader"
      :data="dataObj"
      action="https://httpbin.org/post"
      :multiple="single"
      :file-list="picFiles"
      :on-success="handleImageScucess"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">添加图片(0/10)</div>
    </el-upload>-->

    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleImageScucess"
      :before-upload="beforeUpload">
      <img v-if="tempUrl" :src="tempUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

<!--https://jsonplaceholder.typicode.com/posts/-->
  <!--  <el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" action="https://httpbin.org/post"
      :on-success="handleImageScucess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="image-preview image-app-preview">
      <div class="image-preview-wrapper" v-show="imageUrl.length>1">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i @click="rmImage" class="el-icon-delete"></i>
        </div>
      </div>
    </div>
    <div class="image-preview">
      <div class="image-preview-wrapper" v-show="imageUrl.length>1">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i @click="rmImage" class="el-icon-delete"></i>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { getToken } from '@/api/qiniu'

export default {
  name: 'oneImageUpload',
  directives: { elDragDialog },
  props: {
    fileList: {
        type: String,
        default: ''
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      single: false,
      dialogImageUrl: '',
      dialogVisible: false,
      tempUrl: '',
      picFiles: this.fileList,
      dataObj: { token: '', key: '' }
    }
  },
  mounted() {
      console.log('picFiles:')
      console.log(this.picFiles)
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(file) {
      this.emitInput(file.files.file)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
