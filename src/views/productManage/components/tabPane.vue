<template>
  <el-table :data="list" border="false" fit="true"
            highlight-current-row="true"
            show-header="true"
            tooltip-effect="dark"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            style="width: 100%">

    <el-table-column
      type="selection"
      width="34px">
    </el-table-column>
    <el-table-column align="center" label="商品图" width="100px" v-loading="loading"
                     element-loading-text="请给我点时间！">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>

    <el-table-column width="300px" align="center" label="商品名称">
      <template slot-scope="scope">
        <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="40px" label="价格（元）">
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
        <el-tag>{{scope.row.type}}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="库存">
      <template slot-scope="scope">
        <span>{{scope.row.author}}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="销量">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" icon-class="star" :key="n"></svg-icon>
      </template>
    </el-table-column>

    <el-table-column align="center" label="创建时间" width="95">
      <template slot-scope="scope">
        <span>{{scope.row.pageviews}}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="操作" width="240">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="success" @click="handleDownProduct(scope.row,'published')">下架
        </el-button>
        <el-button size="mini" type="danger" @click="handleDeletProduct(scope.row,'deleted')">删除
        </el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  import {fetchList} from '@/api/article'

  export default {
    props: {
      type: {
        type: String,
        default: 'CN'
      }
    },
    data() {
      return {
        list: null,
        multipleSelection: [],
        listQuery: {
          page: 1,
          limit: 5,
          type: this.type,
          sort: '+id'
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
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        this.$emit('create') // for test
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.loading = false
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

      }
    }
  }
</script>

