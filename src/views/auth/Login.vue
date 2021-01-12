<template>
  <div class="login-box">
    <el-card>
      <h2 class="login-note">登录</h2>
      <el-form ref="form"
               :model="loginForm"
               label-width="70px"
               label-position="left"
               size="large">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="submitLoginForm">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { LoginPost } from "@/api/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Message from "element-plus/lib/el-message";
export default defineComponent({
  name: "App",
  setup() {
    // data
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      loginForm: {
        username: "",
        password: "",
      },
    });
    // methods
    const submitLoginForm = () => {
      const data = state.loginForm;
      LoginPost(data)
        .then((response) => {
          const token = response.data;
          Message.success("登录成功！");
          router.push({
            path: "/",
          });
          store.commit("setToken", token);
        })
        .catch((error) => {
          Message.success("登录失败！");
          console.log(error);
        });
    };
    return {
      ...toRefs(state),
      submitLoginForm,
    };
  },
});
</script>

<style lang="less" scoped>
.login-box {
  width: 450px;
  height: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.login-note {
  font-weight: 600;
  font-size: 24px;
  text-align: center;
  font-family: "Microsoft Yahei";
}
</style>
