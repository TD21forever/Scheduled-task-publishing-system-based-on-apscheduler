<template>
  <el-table :data="tableData"
            style="width: 100%"
            max-height="450"
            v-loading="loading"
            stripe>
    <el-table-column prop="id"
                     label="编号"
                     min-width="30">
    </el-table-column>
    <el-table-column prop="staffName"
                     label="发送对象"
                     min-width="50">
    </el-table-column>
    <el-table-column prop="exeTime"
                     label="发送时间"
                     min-width="100">
    </el-table-column>
    <el-table-column prop="status"
                     label="发送状态"
                     min-width="50">
    </el-table-column>
    <el-table-column prop="content"
                     label="发送内容"
                     min-width="120">
    </el-table-column>

    <el-table-column label="操作"
                     min-width="50">
      <!-- eslint-disable-next-line -->
      <template #default="scope">
        <el-button @click="deleteLog(scope.row.id)"
                   size="small">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column width="100">
      <template #header>
        <el-button type="danger"
                   size="small"
                   plain
                   @click="deleteAllLog">清除日志</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { GetLogInfo, DeleteLog } from "@/api/log";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import Message from "element-plus/lib/el-message";
export default defineComponent({
  name: "App",
  setup() {
    // data
    const state = reactive({
      loading: true,
      tableData: [],
    });

    // methods
    const getLogInfo = () => {
      state.loading = true;
      GetLogInfo().then((response) => {
        const data = response.data.data;
        data.map((e: any) => {
          e["status"] = e["status"] === true ? "成功" : "失败";
        });
        state.tableData = data;
        state.loading = false;
        console.log(state.tableData);
      });
    };
    const deleteAllLog = () => {
      const data = { id: "all" };
      DeleteLog(data)
        .then(() => {
          Message.success("删除成功");
        })
        .catch((error) => {
          Message.error("请求失败" + error);
        })
        .finally(() => {
          getLogInfo();
        });
    };
    const deleteLog = (logid: number) => {
      const data = { id: logid };
      DeleteLog(data)
        .then(() => {
          Message.success("删除成功");
        })
        .catch((error) => {
          Message.error("请求失败" + error);
        })
        .finally(() => {
          getLogInfo();
        });
    };

    onMounted(() => {
      getLogInfo();
    });
    return {
      ...toRefs(state),
      deleteAllLog,
      deleteLog,
    };
  },
});
</script>

<style lang="less" scoped>
</style>
