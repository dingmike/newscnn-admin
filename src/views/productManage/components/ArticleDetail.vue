<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="80px">

      <div class="createPost-main-container">

        <!--商品主图片上传-->
        <el-row>
          <el-form-item label-width="45px" label="主图:" class="postInfo-container-item">
            <Upload v-model="postForm.primary_pic_url"></Upload>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="postForm.name"></el-input>
            </el-form-item>

            <el-form-item label="卖点介绍" prop="introduce">
              <el-input v-model="postForm.goods_brief"></el-input>
            </el-form-item>


          </el-col>
        </el-row>
        <div class="form_divider"></div>
        <!--添加 规格-->
        <el-row :gutter="20" style="padding: 12px">
          <el-form-item label="商品规格"></el-form-item>
          <el-button icon="el-icon-plus" size="mini" plain>添加规格</el-button>
        </el-row>


        <el-form v-for="(spec,index) in postForm.product_specs" :key="index">
          <el-card style="margin-bottom: 20px;height: 11rem; background-color: #fff6e4; padding: 6px">
            <el-row>
              <el-col :span="2">
                <el-form-item>规格名（如：颜色）:</el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-select v-model="spec.type" filterable placeholder="选择或创建规格名">
                    <el-option
                      v-for="item in productSpecsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="2" style="padding-left: 10px">
                <el-form-item>
                  <el-checkbox v-model="setAttributeImg">批量设置规格图片</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <!--规格值-->
            <el-row>
              <el-col :span="2">
                <el-form-item>
                  规格值(如: 红色):
                </el-form-item>
              </el-col>
              <!--  <div v-for="specValue in spec.children">
                  {{specValue}}
                </div>-->
              <el-col style="padding: 0 5px" :span="2" v-for="(specValue, index2) in spec.children" :key="index2" @mouseover.native="toggleShow(index, index2)" @mouseout.native="toggleShow(index, index2)">
                <el-form-item>
                  <el-select v-model="specValue.value" filterable placeholder="" >
                    <el-option
                      v-for="item in productSpecsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <i class="el-icon-error delete-spec" ref="" v-show="specValue.isShow"></i>
              </el-col>
              <el-col :span="2" style="padding-left: 10px">
                <el-form-item>
                  <el-button icon="el-icon-plus" size="mini" plain>添加规格值</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!--规格值--end-->
            <i class="el-icon-delete delete-spec-box" @click.prevent="removeSpecs(spec)"></i>
            <!--<el-button @click.prevent="removeSpecs(spec)">删除</el-button>-->
          </el-card>

        </el-form>




        <!--添加规格 end-->

        <el-row style="padding: 12px 0">
          商品参数
        </el-row>
        <!--参数列表-->

        <el-form>
          <el-table :data="postForm.productParamsForm" border fit
                    show-header
                    tooltip-effect="dark"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column align="center" label="属性分类" width="180" v-loading="loading"
                             element-loading-text="请给我点时间！">
              <template slot-scope="scope">

                <el-select v-model="scope.row.attribute_category" filterable placeholder="请输入分类">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="属性名称" width="" v-loading="loading"
                             element-loading-text="请给我点时间！">
              <template slot-scope="scope">
                <el-input v-model="scope.row.attribute_name" auto-complete="off"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="" align="center" label="属性描述">
              <template slot-scope="scope">
                <el-input v-model="scope.row.attribute_des" auto-complete="off"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="操作">
              <template slot-scope="scope">

                <el-popover
                  placement="top"
                  width="100"
                  v-model="visible2">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>
                  </div>
                  <!--<el-button slot="reference">删除</el-button>-->
                  <el-button slot="reference" type="danger" icon="el-icon-delete"   @click.native.prevent="deleteProductAttribute(scope.$index, postForm.productParamsForm)"></el-button>

                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-form>







        <!--参数列表--end-->
        <div class="form_divider"></div>
        <el-button icon="el-icon-plus" size="mini" @click="addProductAttribute()" plain>添加参数</el-button>


        <div class="form_divider"></div>

        <el-row style="padding: 12px 0">
           商品详情
        </el-row>
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.goods_desc"></tinymce>
        </div>

        <div class="form_divider"></div>

        <el-row style="padding: 20px 0">
          商品分类
        </el-row>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCategoryChange">
          <el-checkbox v-for="category in categories" :label="category" :key="category">{{category}}</el-checkbox>
        </el-checkbox-group>
        <div class="form_divider"></div>

        <el-row style="padding: 20px 0">
          <el-button type="primary" :loading="true">发布</el-button>
        </el-row>


      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/mutilImage'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'

const defaultForm = {
  status: 'draft',
  goods_brief: '', // 商品卖点介绍
  name: '', // 商品标题
  goods_desc: '', // 商品详情
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  primary_pic_url: '', // 商品主要图片
  source_name: '', // 文章外部作者
  display_time: undefined, // 前台展示时间
  id: undefined,
  product_specs: [{
    type: '颜色',
    children: [{value: '红',isShow: false}, {value:'蓝', isShow: false}]
  },
    {
      type: '尺寸',
      children: [{value: '大', isShow: false}, {value:'中', isShow: false}]
    }
  ],
  productParamsForm:[{
    attribute_category: '家具',
    attribute_name: '涂漆',
    attribute_des: '环保涂漆'
  },{
    attribute_category: '家具2',
    attribute_name: '涂漆2',
    attribute_des: '环保涂漆2'
  }],
  platforms: ['a-platform'],
  comment_disabled: false
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(null)
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      visible2: false,
      setAttributeImg: false,
      isShow: false,
      attributeParam: {
        attribute_category: '',
        attribute_name: '',
        attribute_des: ''
      },
      categories: ['居家', '餐厨', '饮食', '配件','服装','杂货'],
      checkList: [],
      productSpecsOptions: [
          {
        value: '选项1',
        label: '家具'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      options: [{
        value: '选项1',
        label: '家具'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      userLIstOptions: [],
      platformsOptions: [
        { key: 'a-platform', name: 'a-platform' },
        { key: 'b-platform', name: 'b-platform' },
        { key: 'c-platform', name: 'c-platform' }
      ],
      rules: {
        title: [
          { required: true, message: '请输入商品标题', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入卖点介绍', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]

//
//        image_uri: [{ validator: validateRequire }],
//        title: [{ validator: validateRequire }],
//        content: [{ validator: validateRequire }],
//        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData() {
      fetchArticle().then(response => {
        this.postForm = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        console.log(response)
        this.userLIstOptions = response.data.items.map(v => ({
          key: v.name
        }))
      })
    },
    addProductAttribute(row) {
      this.postForm.productParamsForm.push(this.attributeParam)
    },
    deleteProductAttribute(index, rows) {
      rows.splice(index, 1);
      console.log( this.postForm.productParamsForm)

    },
    handleSelectionChange() {

    },
    handleCheckedCategoryChange() {

    },
    removeSpecs(item) {
      let index = this.postForm.product_specs.indexOf(item)
      if (index !== -1) {
        this.postForm.product_specs.splice(index, 1)
      }
    },
    toggleShow(index, index2) {
      this.postForm.product_specs[index].children[index2].isShow = !this.postForm.product_specs[index].children[index2].isShow
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
      .form_divider {
        border-top: 1px solid #c5c5c5;
        margin: 15px 0;
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0;
    }
  }
  .delete-spec{
    position: relative;
    top: -65px;
    right: -111px;
    cursor: pointer;
  }
  .delete-spec-box{
    font-size: 18px;
    cursor: pointer;
    float: right;
  }

</style>

