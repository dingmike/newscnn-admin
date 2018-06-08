<template>
  <div class="tab-container">
    <!--<el-tag>mounted times ：{{createdTimes}}</el-tag>-->

    <el-row :gutter="20">
      <el-col :span="4">  <el-button type="primary" icon="el-icon-plus" @click="goAddProduct()">添加商品</el-button></el-col>
      <el-col :span="4">
        <i class="el-icon-refresh" @click="reload" :reload='reload'></i>
      </el-col>
      <el-col :span="4" :offset="16">
        <el-input placeholder="商品名称搜索" v-model="productName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"  @click="search()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key' @create='showCreatedTimes'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/tabPane'

  export default {
    name: 'tab',
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '全部', key: 'null' },
          { label: '在架', key: '1' },
          { label: '已下架', key: '0' }
        ],
        activeName: 'CN',
        createdTimes: 0,
        productName: '',
        reload: false,
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      goAddProduct() {
        this.$router.push({ path: '/addProduct/index' })
      },
      search() {

      },
      reload() {

      }
    }
  }
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
