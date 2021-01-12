<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-dropdown trigger="click">
          <el-button size="small"
                     plain>
            添加任务<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openDialogVisible('sql')">SQL任务</el-dropdown-item>
              <el-dropdown-item @click="openDialogVisible('env')">ENV任务</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="5">
        <el-button type="danger"
                   size="small"
                   plain
                   @click="deleteAllJob">删除所有任务</el-button>
      </el-col>
    </el-row>
  </div>
  <el-table :data="tableData"
            style="width: 100%"
            max-height="450"
            stripe
            v-loading="loading">
    <!-- <el-table-column prop="id"
                     label="id">
    </el-table-column> -->
    <el-table-column prop="name"
                     label="任务描述">
    </el-table-column>
    <el-table-column prop="type"
                     label="类型"
                     min-width="50">
    </el-table-column>
    <el-table-column prop="startDate"
                     label="开始时间"
                     min-width="84">
    </el-table-column>
    <el-table-column prop="endDate"
                     label="结束时间"
                     min-width="84">
    </el-table-column>
    <el-table-column prop="nextRunTime"
                     label="下次启动时间"
                     min-width="84">
    </el-table-column>
    <!-- 状态格局next_run_time 更改 -->
    <el-table-column prop="status"
                     min-width="60"
                     label="状态">
    </el-table-column>
    <el-table-column label="操作"
                     min-width="240">
      <template #default="scope">
        <el-row>
          <el-button size="mini"
                     @click="pauseJob(scope.row.id)">暂停</el-button>
          <el-button size="mini"
                     @click="resumeJob(scope.row.id)">恢复</el-button>
          <el-button size="mini"
                     @click="modifyJob(scope.row)">修改</el-button>
          <el-button size="mini"
                     @click="deleteJob(scope.row.id)">删除</el-button>
        </el-row>
      </template>
    </el-table-column>
    <teleport to="body">
      <!-- 点击添加任务弹出对话框 -->
      <el-dialog :title="modify?'修改定时任务':'新建定时任务'"
                 v-model="dialogVisible"
                 width="50%"
                 destroy-on-close
                 :close-on-click-modal="false"
                 @closed="closeDialog">
        <el-form :model="postData"
                 ref="addJobFormRef"
                 label-width="130px"
                 size="medium"
                 :rules="rules">
          <el-form-item label="任务名称"
                        prop="jobName">
            <el-input v-model="postData.jobName"></el-input>
          </el-form-item>
          <el-form-item label="定时时间">
            <el-col :span="11">
              <el-date-picker type="datetime"
                              placeholder="开始时间"
                              v-model="postData.startDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line"
                    :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime"
                              placeholder="结束时间"
                              v-model="postData.endDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <div class="note">非必填项，默认从此刻开始</div>
          </el-form-item>

          <el-form-item v-if="jobFormType==='sql'"
                        label="SQL语句"
                        prop="sql">
            <el-input v-model="postData.sql"></el-input>
          </el-form-item>
          <el-form-item label="定时类型">
            <el-input v-model="postData.triggerType"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="定时任务间隔">
            <!-- 周 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="postData.intervalTime.week"
                        placeholder="周"></el-input>
            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 日 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="postData.intervalTime.day"
                        placeholder="日"></el-input>

            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 时 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="postData.intervalTime.hour"
                        placeholder="时"></el-input>

            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 分 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="postData.intervalTime.minute"
                        placeholder="分"></el-input>
            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 秒 -->
            <el-col :span="4">
              <el-input v-model="postData.intervalTime.second"
                        size="small"
                        placeholder="秒"></el-input>
            </el-col>
            <br>
            <div class="note">从左往右依次表示周、日、时、分、秒</div>
          </el-form-item>
          <el-form-item v-if="jobFormType==='sql'"
                        label="消息内容"
                        prop="content">
            <el-input type="textarea"
                      v-model="postData.content"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button v-if="modify"
                       type="primary"
                       @click="addJob">修改任务</el-button>
            <el-button v-else
                       type="primary"
                       @click="addJob">创建定时任务</el-button>
          </span>
        </template>
      </el-dialog>
    </teleport>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
// import { DeleteJob, PauseJob, ShowJob, ResumeJob } from "@/api/jobs";
import { ResumeJob, ShowJobs, PauseJob, DeleteJob, AddJob } from "@/api/jobs";
import { jobPostData, jobInfo } from "@/utils/type";
import MessageBox from "element-plus/lib/el-message-box";
import Message from "element-plus/lib/el-message";
export default defineComponent({
  name: "JobList",
  setup() {
    const addJobFormRef: any = ref(null);
    const state = reactive({
      modify: false,
      dialogVisible: false,
      loading: false,
      // 用于修改任务
      helpModify: {
        curJobId: "",
      },
      jobFormType: "",
      // 最后需要提交的表单
      postData: {
        jobName: "",
        triggerType: "interval",
        startDate: "",
        endDate: "",
        sql: "",
        intervalTime: {
          week: "0",
          day: "0",
          hour: "0",
          minute: "0",
          second: "0",
        },
        content: "",
      },
      tableData: [],
      rules: {
        jobName: [
          {
            required: true,
            message: "请输入定时任务的名称",
            trigger: ["blur", "change"],
          },
        ],
        sql: [
          {
            required: true,
            message: "请输入sql语句",
            trigger: ["blur", "change"],
          },
        ],
        content: [
          {
            required: true,
            message:
              "请输入发送定时任务发送的内容,支持变量有<项目><日期><事项><金额>",
            trigger: ["blur", "change"],
          },
        ],
      },
    });
    // methods
    // 测试sql
    // const testSql = () => {
    //   const data = { sql: state.postData.sql };
    //   Message.success(state.postData.sql);
    //   TestSql(data)
    //     .then((response) => {
    //       console.log(response);
    //       Message.success("sql语句有效");
    //     })
    //     .catch((err) => {
    //       Message.error("无效的sql语句，请尝试删除sql语句句末分号");
    //     });
    // };

    // 控制对话框
    const openDialogVisible = (type: string) => {
      // 全部变成响应式数据 ref对象 使用value取值
      // 每次打开的时候初始化 有没有更简单的方法？
      state.dialogVisible = true;
      state.jobFormType = type;
      state.postData.intervalTime.day = "1";
      if (type === "sql") {
        state.postData.sql = "select * from TABLE1";
        state.postData.content =
          "<项目>将于<日期>进行<事项>，金额为：<金额>，请及时处理~";
      }
    };
    const closeDialog = () => {
      (state.postData.jobName = ""), (state.postData.startDate = "");
      state.postData.endDate = "";
      state.postData.sql = "";
      state.modify = false;
    };
    // 获取所有的定时任务
    const showJobs = () => {
      state.loading = true;
      ShowJobs().then((response) => {
        // res是个数组
        const res = response.data.data;
        res.forEach((item: jobInfo) => {
          if (item["nextRunTime"] === "") {
            item.status = "已暂停";
          } else {
            item.status = "运行中";
          }
        });
        state.tableData = res;
        state.loading = false;
      });
    };
    const getPostDataByType = (jobFormType: string) => {
      const {
        jobName,
        triggerType,
        startDate,
        endDate,
        sql,
        intervalTime,
        content,
      } = state.postData;
      if (state.jobFormType === "sql") {
        return {
          jobName,
          triggerType,
          startDate,
          endDate,
          intervalTime,
          content,
          sql,
          type: "sql",
        };
      } else if (state.jobFormType === "env") {
        return {
          jobName,
          triggerType,
          startDate,
          endDate,
          intervalTime,
          type: "env",
        };
      }
    };
    const addJob = () => {
      addJobFormRef.value.validate((valid: boolean) => {
        if (valid) {
          const postData: any = getPostDataByType(state.jobFormType);
          // 这里可以优化 这样做的原因前后端对时间没有统一处理
          const startDate = new Date(postData.startDate);
          const endDate = new Date(postData.endDate);
          postData.startDate = startDate;
          postData.endDate = endDate;
          postData.id = state.helpModify.curJobId;
          console.log(postData);
          AddJob(postData)
            .then((response) => {
              response.data.status === true
                ? Message.success("添加成功！")
                : Message.success("添加失败" + response.data.msg);
              state.dialogVisible = false;
              addJobFormRef.value.resetFields();
              showJobs();
            })
            .catch((error) => {
              Message.error("请求失败" + error);
            });
        } else {
          return false;
        }
      });
    };
    // 删除任务
    const deleteJob = (jobid: string) => {
      MessageBox.confirm("是否删除任务？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        const data: jobPostData = { id: jobid };
        DeleteJob(data)
          // 这里的response有问题 请求失败也是success 待处理
          .then((response) => {
            response.data.status === true
              ? Message.success("删除成功！")
              : Message.success("删除失败" + response.data.msg);
            showJobs();
          })
          .catch((error) => {
            Message.success("删除失败" + error);
          });
      });
    };
    const deleteAllJob = () => {
      MessageBox.confirm("是否删除所有任务,此操作不可撤回", "警告", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        const data: jobPostData = { id: "all" };
        DeleteJob(data)
          // 这里的response有问题 请求失败也是success 待处理
          .then((response) => {
            response.data.status === true
              ? Message.success("删除成功！")
              : Message.success("删除失败" + response.data.msg);
            showJobs();
          })
          .catch((error) => {
            Message.success("删除失败" + error);
          });
      });
    };
    const modifyJob = (jobInfo: jobInfo) => {
      console.log(state.postData);

      state.jobFormType = jobInfo.type;
      state.modify = true;
      state.dialogVisible = true;
      // 获取当前任务的开始时间、结束时间以、任务的名称，展示在对话框上
      state.postData.jobName = jobInfo.name;
      // jobInfo.startDate是string
      if (jobInfo.startDate) {
        state.postData.startDate = new Date(jobInfo.startDate).toUTCString();
        console.log(state.postData.startDate);
      }
      if (jobInfo.endDate) {
        state.postData.endDate = new Date(jobInfo.endDate).toUTCString();
        console.log(state.postData.endDate);
      }
      state.postData.intervalTime = jobInfo.intervalTime;
      if (jobInfo.type === "sql") {
        state.postData.sql = "select * from TABLE1";
        state.postData.content =
          "<项目>将于<日期>进行<事项>，金额为：<金额>，请及时处理~";
      }
      state.helpModify.curJobId = jobInfo.id;
    };
    // 恢复任务
    const resumeJob = (jobid: string) => {
      MessageBox.confirm("是否恢复任务？", "提示", {
        confirmButtonText: "恢复",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        const data: jobPostData = { id: jobid };
        ResumeJob(data)
          // 这里的response有问题 请求失败也是success 待处理
          .then((response) => {
            response.data.status === true
              ? Message.success("恢复成功！")
              : Message.success("恢复失败" + response.data.msg);
            showJobs();
          })
          .catch((error) => {
            Message.success("恢复失败" + error);
          });
      });
    };
    // 暂停任务
    const pauseJob = (jobid: string) => {
      MessageBox.confirm("是否暂停任务？", "提示", {
        confirmButtonText: "暂停",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        const data: jobPostData = { id: jobid };
        PauseJob(data)
          // 这里的response有问题 请求失败也是success 待处理
          .then((response) => {
            response.data.status === true
              ? Message.success("暂停成功！")
              : Message.success("暂停失败" + response.data.msg);
            showJobs();
          })
          .catch((error) => {
            Message.success("暂停失败" + error);
          });
      });
    };
    onMounted(() => {
      // 获取任务
      showJobs();
      // testSql();
    });
    return {
      ...toRefs(state),
      addJobFormRef,
      // methods
      resumeJob,
      deleteJob,
      pauseJob,
      modifyJob,
      deleteAllJob,
      addJob,
      openDialogVisible,
      closeDialog,
      // testSql,
    };
  },
});
</script>

<style lang="less" scoped>
.note {
  position: absolute;
  bottom: -30px;
  font-size: 12px;
  color: dimgray;
}
</style>
