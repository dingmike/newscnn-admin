<template>
  <div class="app-container calendar-list-container">
    <el-table :data="list" border fit
              highlight-current-row
              show-header
              tooltip-effect="dark"
              v-loading="listLoading"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              style="width: 100%">

      <el-table-column
        type="selection"
        width="34px">
      </el-table-column>
      <el-table-column align="center" label="商品图" width="80px" v-loading="loading"
                       element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <div class="good-pic-head">
            <img :src="scope.row.primary_pic_url" @click="dialogVisible = true">
          </div>
         <!-- <el-dialog width="40%" :visible.sync="dialogVisible">
              <img width="100%" :src="scope.row.primary_pic_url">
          </el-dialog>-->
        </template>
      </el-table-column>

      <el-table-column width="380px" align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="价格（元）">
        <template slot-scope="scope">
          <!--<span>{{scope.row.title}}</span>-->
          <el-tag>{{scope.row.retail_price}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="库存">
        <template slot-scope="scope">
          <span>{{scope.row.goods_number}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="销量">
        <template slot-scope="scope">
          <span>{{scope.row.sell_volume}}</span>
          <!--<svg-icon v-for="n in +scope.row.importance" icon-class="star" :key="n"></svg-icon>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="success" @click="handleDownProduct(scope.row,'published')">下架
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeletProduct(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </div>

  </div>


</template>

<script>
  import {fetchGoodsList} from '@/api/goods'

  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
      reload: {
        type: Boolean,
        default: false
      },

    },
    watch(){

    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        dialogImageUrl: '',
        dialogVisible: false,
        multipleSelection: [],
        listQuery: {
          page: 1,
          size: 10,
          isOnSale: this.type  // 全部:''，在架：1，下架：0
        },
        loading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    mounted() {
      this.getList()
    },
    created() {
//      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
//        this.$emit('create') // for test
        fetchGoodsList(this.listQuery).then(response => {
          debugger
          this.list = response.data.data.data
          this.total = response.data.data.count
          this.loading = false
          this.listLoading = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(row) {
debugger
        // 编辑商品跳转

      },
      handleDownProduct() {

      },
      handleDeletProduct() {

      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
    }
  }
</script>

<style scoped>
  .good-pic-head{
    width: 60px;
    height:60px;
    text-align: center;
    border: 1px solid #cccccc;
    cursor: pointer;
  }
  .good-pic-head img{
    width: 100%;
    text-align: center;
  }
  .visible-pic-box{
    height: 100%;
  }
</style>
