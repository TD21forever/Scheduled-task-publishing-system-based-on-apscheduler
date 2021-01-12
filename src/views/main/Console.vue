<template>
  <el-table :data="tableData"
            style="width: 100%"
            max-height="450"
            v-loading="loading"
            stripe>
    <el-table-column prop="id"
                     label="项目名称">
    </el-table-column>
    <el-table-column prop="name"
                     label="参与人员">
    </el-table-column>
    <el-table-column prop="date"
                     label="截止日期"
                     min-width="120">
    </el-table-column>
    <el-table-column prop="task"
                     label="项目任务">
    </el-table-column>
    <el-table-column prop="money"
                     label="金额">
    </el-table-column>
    <el-table-column label="操作">
      <!-- eslint-disable-next-line -->
      <template #default="scope">
        <el-button @click="handleAddJob(scope.$index, scope.row)"
                  size="small">添加定时任务</el-button>
      </template>
    </el-table-column>

    <teleport to="body">
      <!-- 点击添加任务弹出对话框 -->
      <el-dialog title="新建定时任务"
                 v-model="dialogVisible"
                 width="30%"
                 destroy-on-close>
        <el-form :model="form.postData"
                 :label-position="labelPosition"
                 ref="addJobFormRef"
                 label-width="130px"
                 size="medium"
                 :rules="rules">
          <el-form-item label="任务名称"
                        prop="jobName">
            <el-input v-model="form.postData.jobName"></el-input>
          </el-form-item>
          <el-form-item label="定时时间">
            <el-col :span="11">
              <el-date-picker type="datetime"
                              placeholder="开始时间"
                              v-model="form.postData.startDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line"
                    :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime"
                              placeholder="结束时间"
                              v-model="form.postData.endDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="发送对象"
                        prop="to">
            <el-input v-model="form.postData.to"></el-input>
          </el-form-item>

          <el-form-item label="定时类型">
            <el-input v-model="form.postData.triggerType"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="定时任务间隔">
            <!-- 周 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="form.postData.intervalTime.week"
                        placeholder="周"></el-input>
            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 日 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="form.postData.intervalTime.day"
                        placeholder="日"></el-input>

            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 时 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="form.postData.intervalTime.hour"
                        placeholder="时"></el-input>

            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 分 -->
            <el-col :span="4">
              <el-input size="small"
                        v-model="form.postData.intervalTime.minute"
                        placeholder="分"></el-input>
            </el-col>
            <el-col class="line"
                    :span="1">-</el-col>
            <!-- 秒 -->
            <el-col :span="4">
              <el-input v-model="form.postData.intervalTime.second"
                        size="small"
                        placeholder="秒"></el-input>
            </el-col>
            <br>
            <div>从左往右依次表示周、日、时、分、秒</div>
          </el-form-item>
          <el-form-item label="消息内容"
                        prop="content">
            <el-input type="textarea"
                      v-model="form.postData.content"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary"
                       @click="beforeSubmitForm">创建定时任务</el-button>
          </span>
        </template>
      </el-dialog>
    </teleport>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, toRefs } from "vue";
import { GetStaffInfo } from "@/api/staff";
import { AddJob } from "@/api/jobs";
import MessageBox from "element-plus/lib/el-message-box";
import Message from "element-plus/lib/el-message";
export default defineComponent({
  name: "Console",
  setup() {
    // data
    const addJobFormRef: any = ref(null);
    const state = reactive({
      dialogVisible: false,
      loading: true,
      tableData: [],
      form: {
        // 最后需要提交的表单
        postData: {
          jobName: "",
          to: "",
          triggerType: "interval",
          startDate: "",
          endDate: "",
          intervalTime: {
            week: "0",
            day: "1",
            hour: "0",
            minute: "0",
            second: "0",
          },
          content: "<项目名称>将于<日期>支付<事项><金额>，请注意及时处理",
        },
        // 存储对应列表行的一些数据
        helpData: {
          money: "",
          task: "",
          date: "",
          projectName: "",
        },
      },
      rules: {
        jobName: [
          {
            required: true,
            message: "请输入定时任务的名称",
            trigger: ["blur", "change"],
          },
        ],
        to: [
          {
            required: true,
            message: "请输入发送人员,用英文逗号分割",
            trigger: ["blur", "change"],
          },
        ],
        content: [
          {
            required: true,
            message:
              "请输入发送定时任务发送的内容,支持变量有<项目名称><日期><事项><金额>",
            trigger: ["blur", "change"],
          },
        ],
      },
    });
    const labelPosition = ref("left"); // 表单label位置
    // methods
    const getStaffInfo = () => {
      state.loading = true;
      GetStaffInfo().then((response) => {
        const data = response.data.data;
        state.tableData = data;
        state.loading = false;
      });
    };
    // 点击添加新定时任务按钮
    const handleAddJob = (index: number, row: any) => {
      // 全部变成响应式数据 ref对象 使用value取值
      const { date, id, money, name, task } = toRefs(row);
      // 在表单上显示的数据
      state.form.postData.jobName = id.value + "的定时任务";
      state.form.postData.to = name.value;

      // 不用于直接post的数据
      state.form.helpData.money = money.value;
      state.form.helpData.task = task.value;
      state.form.helpData.date = date.value;
      state.form.helpData.projectName = id.value; //暂时把id当做项目名字，之后会更改

      // 打开对话框
      state.dialogVisible = true;
    };
    // 提交之前在前端处理下提交的数据
    const beforeSubmitForm = () => {
      const { date, money, task, projectName } = state.form.helpData;
      const {
        content,
        intervalTime,
        jobName,
        startDate,
        endDate,
        to,
      } = state.form.postData;
      const startDateObj = new Date(startDate);
      const msgStartDate =
        startDate != ""
          ? startDateObj.toLocaleString("ch-ZH", { hour12: false })
          : "今日";
      // console.log("=====", startDate, msgStartDate);
      const msgInterval = (() => {
        let msg = "";
        if (intervalTime.week != "" && intervalTime.week != "0") {
          msg += intervalTime.week + "周";
        }
        if (intervalTime.day != "" && intervalTime.day != "0") {
          msg += intervalTime.day + "日";
        }
        if (intervalTime.hour != "" && intervalTime.hour != "0") {
          msg += intervalTime.hour + "时";
        }
        if (intervalTime.minute != "" && intervalTime.minute != "0") {
          msg += intervalTime.minute + "分";
        }
        if (intervalTime.second != "" && intervalTime.second != "0") {
          msg += intervalTime.second + "秒";
        }
        return msg;
      })();
      const msgContent = (() => {
        // 这边写的很挫
        let msg = content;
        msg = msg.replace(/<项目名称>/, projectName);
        msg = msg.replace(/<日期>/, date);
        msg = msg.replace(/<事项>/, task);
        msg = msg.replace(/<金额>/, money);
        return msg;
      })();
      const configSubmitMsg =
        jobName +
        "将从" +
        msgStartDate +
        "开始，间隔" +
        msgInterval +
        "后向" +
        to +
        "发送，发送内容为" +
        "<" +
        msgContent +
        ">";
      // 验证表单
      addJobFormRef.value.validate((valid: boolean) => {
        if (valid) {
          // 最后一次确认提交
          MessageBox.confirm(configSubmitMsg, "确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            const postData = state.form.postData;
            console.log(postData);
            const rowContent = state.form.postData.content;
            postData.content = msgContent;
            AddJob(postData)
              .then((response) => {
                Message.success("添加成功！");
                state.dialogVisible = false;
                state.form.postData.startDate = "";
                state.form.postData.endDate = "";
                addJobFormRef.value.resetFields();
              })
              .catch((error) => {
                Message.error("添加失败" + error);
              })
              .finally(() => {
                state.form.postData.content = rowContent;
              });
          });
        } else {
          return false;
        }
      });
    };
    onMounted(() => {
      // 获取员工信息
      getStaffInfo();
    });
    return {
      ...toRefs(state),
      labelPosition,
      addJobFormRef,
      //methods
      handleAddJob,
      beforeSubmitForm,
    };
  },
});
</script>

<style lang="less" scoped>
</style>
