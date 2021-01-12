<template>
  <el-row>
    <el-button size="small ">暂停</el-button>
    <el-button type="primary">开始</el-button>
    <el-button type="success">停止</el-button>
    <el-button type="info">删除</el-button>
    <el-button type="warning">恢复</el-button>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  name: "ButtonList",
  setup() {},
});
</script>

<style lang="less" scoped>
</style>
