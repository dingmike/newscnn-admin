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
        </el-row>
        <el-form v-for="(spec, index) in postForm.product_specs" :key="index">
          <el-card style="margin-bottom: 20px;height: 12rem; background-color: #fff; padding: 6px">
            <el-row>
              <el-col :span="3">
                <el-form-item>规格名（如：颜色）:</el-form-item>
              </el-col>
              <el-col :span="4" style="padding: 0 5px">
                <el-form-item>
                  <el-select size="small" v-model="spec.type" filterable allow-create placeholder="选择或创建规格名"
                             @change="renderAddSpec(index, spec.type)">
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
            <el-row v-if="spec.isShowValue">
              <el-col :span="3">
                <el-form-item>
                  规格值(如: 红色):
                </el-form-item>
              </el-col>
              <!--  <div v-for="specValue in spec.children">
                  {{specValue}}
                </div>-->
              <el-col style="padding: 0 5px" :span="4" v-for="(specValue, index2) in spec.children" :key="index2"
                      @mouseover.native="toggleShow(index, index2)" @mouseout.native="toggleShow(index, index2)">
                <el-form-item>
                  <el-select size="small" v-model.trim.lazy="specValue.value" filterable allow-create placeholder=""
                             @change="addSpec(spec.children, specValue.value, index, options, index2)">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <i class="el-icon-error delete-spec" ref="" v-show="specValue.isShow"
                   @click="removeSpecValue(index, index2, specValue.value, options)"></i>
              </el-col>
              <el-col :span="2" style="padding-left: 10px">
                <el-form-item>
                  <el-button icon="el-icon-plus" size="mini"
                             @click="addSpecsValue(spec.children, newSpecName[index], index, options)" plain>添加规格值
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!--规格值--end-->
            <i class="el-icon-delete delete-spec-box" @click.prevent="removeSpecs(spec)"></i>
            <!--<el-button @click.prevent="removeSpecs(spec)">删除</el-button>-->
          </el-card>

        </el-form>


        <el-row :gutter="20" style="padding: 12px">
          <el-button icon="el-icon-plus" size="mini" @click="addProductSku()" :disabled="disableValue" plain>添加规格
          </el-button>
        </el-row>


        <!--规格明细-->

        <el-row :gutter="20" style="padding: 12px">
          <el-form-item label="规格明细"></el-form-item>
        </el-row>
        <el-form>
          <el-table :data="tableData.data" :key='key' border fit highlight-current-row style="width: 100%">
            <!--<el-table-column prop="name" label="fruitName" width="180"></el-table-column>-->
            <el-table-column :key='thead.type' v-for='thead in tableThead' :label="thead.type">
              <template slot-scope="scope">
                {{scope.row.specs}}{{thead.type}}
              </template>
            </el-table-column>
            <!--    <el-table-column prop="" label="货号">
                  <template slot-scope="scope">
                    &lt;!&ndash;<el-input v-model="postForm.name"></el-input>&ndash;&gt;

                    <el-popover trigger="click" placement="top">
                      <p>货号:
                        <el-input size="mini" class="price-modi" v-model.number="scope.row.prices.marketPrice"></el-input>
                      </p>
                      <div style="text-align: right; margin: 0">
                        &lt;!&ndash; <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> &ndash;&gt;
                        &lt;!&ndash; <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> &ndash;&gt;
                      </div>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.prices.marketPrice }}
                      </div>
                    </el-popover>


                  </template>
                </el-table-column>-->
            <el-table-column prop="" label="*现价">
              <template slot-scope="scope">
                <!--<el-input v-model="postForm.name"></el-input>-->

                <el-popover trigger="click" placement="top">
                  <el-row>
                    <el-form-item
                      label="现价:"
                      prop="prices.advicePrice">
                      <el-input type="prices.advicePrice" size="mini" class="price-modi"
                                v-model.number="scope.row.prices.advicePrice"></el-input>
                    </el-form-item>

                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!--  <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>-->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.advicePrice }}
                  </div>
                </el-popover>

              </template>
            </el-table-column>
            <el-table-column prop="" label="*原价">
              <template slot-scope="scope">
                <!--<el-input v-model="postForm.name"></el-input>-->
                <el-popover trigger="click" placement="top">
                  <el-row>

                    <el-form-item
                      label="原价:"
                      prop="prices.marketPrice">
                    <el-input size="mini" type="prices.marketPrice" class="price-modi"
                              v-model.number="scope.row.prices.marketPrice"></el-input>
                    </el-form-item>
                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                    <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.marketPrice }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="" label="*库存">
              <template slot-scope="scope">
                <!--<el-input v-model="postForm.name"></el-input>-->

                <el-popover trigger="click" placement="top">
                  <el-row>
                    <el-form-item
                      label="库存:"
                      prop="prices.store">
                    <el-input size="mini" type="prices.store" class="price-modi"
                              v-model.number="scope.row.prices.store"></el-input>
                    </el-form-item>
                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                    <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.store }}
                  </div>
                </el-popover>

              </template>
            </el-table-column>
            <el-table-column prop="" label="*图片">
              <template slot-scope="scope">
                <Upload v-model="postForm.primary_pic_url"></Upload>
              </template>
            </el-table-column>
          </el-table>
        </el-form>


        <!--规格明细--end-->


        <!--添加规格 end-->


        <div class="form_divider"></div>

        <el-row style="padding: 12px 0">
          商品参数
        </el-row>
        <!--参数列表-->

        <el-form>
          <el-table :data="postForm.productParamsForm" fit
                    show-header
                    tooltip-effect="dark"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column align="center" label="属性分类" width="180" v-loading="loading"
                             element-loading-text="请给我点时间！">
              <template slot-scope="scope">

                <el-select size="small" v-model="scope.row.attribute_category" filterable placeholder="请输入分类">
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
                <el-input size="small" v-model="scope.row.attribute_name" auto-complete="off"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="" align="center" label="属性描述">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.attribute_des" auto-complete="off"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="操作">
              <template slot-scope="scope">

                <el-popover
                  placement="top"
                  width="100"
                  v-model="scope.row.isVisible">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.isVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteProductAttribute(scope.$index, postForm.productParamsForm)">确定</el-button>
                  </div>
                  <!--<el-button slot="reference">删除</el-button>-->
                  <el-button slot="reference"
                             type="danger"
                             icon="el-icon-delete" size="mini"  @click.native.prevent="scope.row.isVisible = true"></el-button>
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
  import {validateURL} from '@/utils/validate'
  import {fetchArticle} from '@/api/article'
  import {userSearch} from '@/api/remoteSearch'

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
      isShowValue: false,
      children: [{value: '黑', isShow: false}, {value: '蓝', isShow: false}]
    },
      {
        type: '尺寸',
        isShowValue: false,
        children: [{value: '大', isShow: false}, {value: '中', isShow: false}]
      }
    ],
    product_specs_prices: [],
    productParamsForm: [{
      attribute_category: '家具',
      attribute_name: '涂漆',
      attribute_des: '环保涂漆',
      isVisible: false
    }, {
      attribute_category: '家具2',
      attribute_name: '涂漆2',
      attribute_des: '环保涂漆2',
      isVisible: false // 显示删除按钮
    }],
    platforms: ['a-platform'],
    comment_disabled: false
  }

  export default {
    name: 'articleDetail',
    components: {Tinymce, MDinput, Upload, Multiselect, Sticky},
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
        isShowValue: false,
        disableValue: false,
        /*      tableData: [
         {
         name: 'fruit-1',
         apple: 'apple-10',
         banana: 'banana-10',
         orange: 'orange-10'
         },
         {
         name: 'fruit-2',
         apple: 'apple-20',
         banana: 'banana-20',
         orange: 'orange-20'
         }
         ],*/
        key: 1, // table key
        formTheadOptions: ['apple', 'banana', 'orange'],
        checkboxVal: ['apple', 'banana'], // checkboxVal
        formThead: ['apple', 'banana'],// 默认表头 Default header
        attributeParam: {
          attribute_category: '',
          attribute_name: '',
          attribute_des: ''
        },
        // 注意此项为数组 type Array
        originalPrices: [{
          marketPrice: 11340,
          advicePrice: 10440,
          store: 90,
        }],
        // 批量填写价格
        defaultAddPrices: {
          marketPrice: 1200,
          advicePrice: 90,
          store: 50
        },
        categories: ['居家', '餐厨', '饮食', '配件', '服装', '杂货'],
        checkList: [],
        // 规格种类的数量
        typesLength: null,
        enableSpec: null,
        // from backend
        specs: [{
          type: '颜色',
          children: ['红', '蓝']
        },
          {
            type: '尺寸',
            children: ['大', '中']
          }
        ],
        specPrices: [{
          specs: ['红', '大'],
          prices: {
            marketPrice: 90,
            advicePrice: 60,
            store: 10
          }
        },
          {
            specs: ['红', '中'],
            prices: {
              marketPrice: 30,
              advicePrice: 70,
              store: 10
            }
          },
          {
            specs: ['蓝', '大'],
            prices: {
              marketPrice: 20,
              advicePrice: 10,
              store: 10
            }
          },
          {
            specs: ['蓝', '中'],
            prices: {
              marketPrice: 50,
              advicePrice: 40,
              store: 10
            }
          }
        ],
        newSpecName: ['', ''],
        productSpecsOptions: [
          {
            value: '家具',
            label: '家具'
          }, {
            value: '尺寸',
            label: '尺寸'
          }, {
            value: '双皮奶',
            label: '双皮奶'
          }, {
            value: '蚵仔煎',
            label: '蚵仔煎'
          }, {
            value: '龙须面',
            label: '龙须面'
          }, {
            value: '北京烤鸭',
            label: '北京烤鸭'
          },
          {
            value: '颜色',
            label: '颜色'
          }],
        options: [{
          value: 'M',
          label: 'M'
        }, {
          value: 'L',
          label: 'L'
        }, {
          value: 'XL',
          label: 'XL'
        }, {
          value: 'S',
          label: 'S'
        }, {
          value: '红色',
          label: '红色'
        },
          {
            value: '绿色',
            label: '绿色'
          },
          {
            value: '金',
            label: '金'
          },
          {
            value: '木',
            label: '木'
          },
          {
            value: '水',
            label: '水'
          }
        ],
        userLIstOptions: [],
        platformsOptions: [
          {key: 'a-platform', name: 'a-platform'},
          {key: 'b-platform', name: 'b-platform'},
          {key: 'c-platform', name: 'c-platform'}
        ],
        rules: {
          title: [
            {required: true, message: '请输入商品标题', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          introduce: [
            {required: true, message: '请输入卖点介绍', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]

//
//        image_uri: [{ validator: validateRequire }],
//        title: [{ validator: validateRequire }],
//        content: [{ validator: validateRequire }],
//        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        }
      }
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
        this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      // 表格数据
      tableData() {
        debugger
        let arr = this.specPrices;
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          arr[i].spec0 = arr[i].specs[0]
          arr[i].spec1 = arr[i].specs[1]
          arr[i].spec2 = arr[i].specs[2]
        }
        // console.log(this.mySpecPrices)
        console.log('prices arr:-----')
        console.log(arr)
        let tableData = {data: arr}
        return tableData
      },
      // 规格表头数据
      tableThead() {
        let specs = this.postForm.product_specs
        let arr = []
        for (let i = 0; i < specs.length; i++) {
          arr.push(specs[i].type)
        }
        return specs
      }
    },
    created() {
      if (this.isEdit) {
        this.fetchData()
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }

// 规格
      this.specs = this._specs
      this.specs = []
      this.specPrices = []

      if (this.specs.length == 0) {
        // 初始化规格数据
        let obj = {}
        obj.type = "";
        obj.children = []
        this.specs.push(obj)
        // console.log(this.specs)

        // 初始化价格数据
        let _obj = [{}]
        _obj[0].specs = ['']
        _obj[0].prices = {
          marketPrice: 0,
          advicePrice: 0,
          store: 0
        }
        this.specPrices = _obj
      }

      this.typesLength = this.specs.length
      this.enableSpec = this.typesLength ? true : false
      this.enableSpec = false

      console.log(this.enableSpec)
      console.log(this.typesLength)
      console.log(this.specCombinations)
      console.log('this.specCombinations')

      if (this.typesLength === 2) {
        this.typeName1 = this.goodsData[0].type
        this.typeName2 = this.goodsData[0].type
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
      addProductSku() {
        let obj = {
          type: '',
          children: []
        }
        this.postForm.product_specs.push(obj)
        if (this.postForm.product_specs.length >= 3) {
          this.disableValue = true
        } else {
          this.disableValue = false
        }
      },
      addProductAttribute(row) {
        this.postForm.productParamsForm.push(this.attributeParam)
      },
      showPopover(index) {

      },
      deleteProductAttribute(index, rows) {
          debugger
        rows.splice(index, 1);
        console.log(this.postForm.productParamsForm)

      },
      handleSelectionChange() {

      },
      handleCheckedCategoryChange() {

      },
      modiSpec(specName, spec, index) {
        spec[index] = specName;
        console.log(this.specs)
      },
      addSpec(spec, newSpecName, index, options, index2) {
        debugger


        let obj = {value: '', isShow: false}
        /*   Array.prototype.indexOfObj = function (val) {
         for (var i = 0; i < this.length; i++) {
         if (this[i].value == val.value) return i;
         }
         return -1;
         };
         console.log(newSpecName + '111')
         let specValueOptionObj = {value: newSpecName, label: newSpecName}
         debugger
         //      this.productSpecsOptions.remove(specValueOptionObj)
         console.log(options)

         console.log(options.indexOfObj(specValueOptionObj))

         options.splice(options.indexOfObj(specValueOptionObj), 1)*/
        console.log('specs--------------')
        console.log(spec)


        console.log('newSpecName--------------')
        console.log(newSpecName)


        // 检测新规格名是否规范 1, 不为空. 2,不重复
        if (spec.length > 1) {
          for (let j = 0; j < spec.length - 1; j++) {
            if (spec[j].value === newSpecName.trim()) {
              this.$message({
                showClose: true,
                message: '规格项名称不能为重复!',
                type: 'warning'
              })
              spec[index2].value = '' // 清空
              return
            }
          }

        }


        /*

         if (!newSpecName) {
         alert('规格项名称不能为空')
         return
         } else if (spec.includes(newSpecName)) {
         alert('规格项名称不能为重复')
         return
         }
         */


        obj.value = newSpecName
        /*if(obj.value){
         spec.push(obj)
         }*/

        console.log(spec)
        console.log(this.postForm.product_specs)

        // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
        var myDefaultAddPrices = JSON.parse(JSON.stringify(this.defaultAddPrices));
        var specCombinations = this.specCombinations()
        this.mySpecPrices(specCombinations, myDefaultAddPrices)
//      this.newSpecName[index] = ''
//       console.log(this.specs)
      },
      addSpecsValue(spec, newSpecName, index, options) {
        debugger
        let obj = {value: '', isShow: false}

        // 删除已选择规格值，防止重复选择  ---- 暂时不使用
        /*    Array.prototype.indexOfObj = function (val) {
         for (var i = 0; i < this.length; i++) {
         if (this[i].value == val.value) return i;
         }
         return -1;
         };
         let newObj = {value: '', label: ''}
         for(let n = 0; n < options.length; n ++){
         for(let i = 0; i < spec.length; i++){
         if(options[n].value === spec[i].value){
         newObj.value = spec[i].value
         newObj.label = spec[i].value
         }
         }
         }
         debugger
         console.log(options)
         console.log('newObj: ' + newObj)
         console.log(newObj)
         console.log(options.indexOfObj(newObj))
         options.splice(options.indexOfObj(newObj), 1)*/


        /* if (!newSpecName) {
         alert('规格项名称不能为空')
         return
         }*/
        this.postForm.product_specs[index].children.push(obj)

      },
      removeSpecs(item) {
        let index = this.postForm.product_specs.indexOf(item)
        if (index !== -1) {
          this.postForm.product_specs.splice(index, 1)
        }
        if (this.postForm.product_specs.length < 3) {
          this.disableValue = false
        } else {
          this.disableValue = true
        }
      },
      removeSpecValue(index, index2, specValue, options) {
        debugger
        this.postForm.product_specs[index].children.splice(index2, 1)
        // 删除规格值恢复规格值的下拉选项个数
        /* let specValueOptionObj = {value: specValue, label: specValue}
         if(specValueOptionObj.value){
         options.push(specValueOptionObj)
         }*/

      },
      toggleShow(index, index2) {
        debugger
        this.postForm.product_specs[index].children[index2].isShow = !this.postForm.product_specs[index].children[index2].isShow
      },
      renderAddSpec(index, newSpecName) {
        debugger
        console.log('specType: ' + newSpecName)
        this.postForm.product_specs[index].isShowValue = true
        this.postForm.product_specs[index].children.length = 0
        this.formThead.length = 0
        this.formThead.push(newSpecName)

//      渲染一个默认规格值输入框
        let obj = {value: '', isShow: false}
        this.postForm.product_specs[index].children.push(obj)
      },
      // 规格组合数组
      specCombinations() {
        debugger
        console.log(this.postForm.product_specs)
        let arrWra = [];
        // 有2个规格type  children: [{value: '红',isShow: false}, {value:'蓝', isShow: false}]
        if (this.postForm.product_specs.length == 3) {
          let arr1 = this.postForm.product_specs[0].children
          let arr2 = this.postForm.product_specs[1].children
          let arr3 = this.postForm.product_specs[2].children
          // 判断arr1是否为[], 如果是 为其添加个空字符串占位
          if (arr1.length == 0) {
            arr1 = ['']
          }
          if (arr2.length == 0) {
            arr2 = ['']
          }
          if (arr3.length == 0) {
            arr3 = ['']
          }
          let arr = []
          for (let t = 0; t < arr1.length; t++) {
            for (let i = 0; i < arr2.length; i++) {
              for (let m = 0; m < arr3.length; m++) {
                arr = []
                arr.push(arr1[t].value)
                arr.push(arr2[i].value)
                arr.push(arr3[m].value)
                arrWra.push(arr)
              }

            }
          }
          console.log(arrWra)
          return arrWra
          // 只有1个规格type
        } else if (this.postForm.product_specs.length == 1) {
          let arr = this.postForm.product_specs[0].children
          if (arr.length == 0) {
            arr = ['']
          }
          for (let i = 0; i < arr.length; i++) {
            let _arr = []
            _arr.push(arr[i].value)
            arrWra.push(_arr)
          }
          debugger
          console.log(arrWra)
          console.log('arrWra hehe............')
          return arrWra
        } else if (this.postForm.product_specs.length == 2) {
          let arr1 = this.postForm.product_specs[0].children
          let arr2 = this.postForm.product_specs[1].children
          // 判断arr1是否为[], 如果是 为其添加个空字符串占位
          if (arr1.length == 0) {
            arr1 = ['']
          }
          if (arr2.length == 0) {
            arr2 = ['']
          }
          let arr = []
          for (let t = 0; t < arr1.length; t++) {
            for (let i = 0; i < arr2.length; i++) {
              arr = []
              arr.push(arr1[t].value)
              arr.push(arr2[i].value)
              arrWra.push(arr)
            }
          }
          console.log(arrWra)
          return arrWra
        }
      },
      // 规格价格数据 local
      // 数据更新
      mySpecPrices(specCombinations, myDefaultAddPrices) {
        debugger
        // function sameSpecs(element) {
        //   return element.specs == arr[i];
        // }
        let arrWra = []
        // 规格组合 数组
        let arr = specCombinations
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          // 新增 规格价格 项
          let obj = {};
          obj.specs = arr[i];
          // !注意 a类型为数组
          // 对比 新的 规格组合数组 与原价格数组
          let oldItem = this.specPrices.filter((element) => {
            return element.specs + "" === arr[i] + "";
          })
          let newItem = this.specPrices.filter((element) => {
            return element.specs + "" != arr[i] + "";
          })
          // 注意这里用的是length因为 空数组,空对象的布尔值为true
          // 旧规各项价格
          if (oldItem.length) {
            obj.prices = oldItem[0].prices
            console.log(oldItem[0])
            // 新规各项价格
          } else {
            console.log(newItem)
            console.log('_____')
            // if (newItem.length != 0) {
            // 这里用深拷贝否则各新项目的价格数据会关联
            newItem[0].prices = JSON.parse(JSON.stringify(myDefaultAddPrices));
            obj.prices = newItem[0].prices
            // }
          }
          arrWra.push(obj)
        }
        console.log(arrWra)
        this.specPrices = arrWra
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .title-prompt {
    position: absolute;
    right: 0;
    font-size: 12px;
    top: 10px;
    color: #ff4949;
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

  .delete-spec {
    position: relative;
    top: -4rem;
    right: -10rem;
    cursor: pointer;
  }

  .delete-spec-box {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

</style>

