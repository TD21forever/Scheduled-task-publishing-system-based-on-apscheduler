<template>
  <el-container class="f-container">
    <el-header>
      <span class="brand">🚀🚀JobCenter🚀🚀</span>
      <el-button type="text"
                 @click="loginOut"
                 class="loginOutButton">退出登录</el-button>
    </el-header>
    <el-container class="s-container">
      <el-aside width="200px">
        <el-card class="side-card">
          <!-- 侧边菜单 -->
          <el-menu router="true"
                   text-color="#1c1c21">
            <el-menu-item index="./jobs">
              <i class="el-icon-s-order"></i>
              <template #title>
                任务详情
              </template>
            </el-menu-item>
            <el-menu-item index="./logs">
              <i class="el-icon-setting"></i>
              <template #title>
                任务日志
                <!-- <el-badge :value="12"></el-badge> -->
              </template>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-aside>
      <el-main>
        <el-card>
          <router-view />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Message from "element-plus/lib/el-message";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import store from "@/utils/store";
export default defineComponent({
  name: "Layout",
  setup() {
    const router = useRouter();
    // methods
    const loginOut = () => {
      Message.success("退出成功");
      store.commit("delToken");
      router.push({
        path: "/login",
      });
    };
    return {
      loginOut,
    };
  },
});
</script>

<style lang="less" scoped>
.s-container {
  width: 1140px !important;
  margin: 0 auto;
  // border: 1px solid sandybrown;
}
.brand {
  font-size: 30px;
  display: flex;
  align-items: center;
}
.el-header {
  width: 100%;
  height: 37px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
}
// .el-header,
// .el-aside,
// .el-main {
//   border: 1px solid pink;
// }
.loginOutButton {
  font-size: 20px;
}
.side-card {
  margin-top: 20px;
}
.el-menu {
  border: none !important;
}
.el-menu-item:hover {
  background-color: #f5f5f5;
}
</style>
