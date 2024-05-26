<template>
  <div>
    <div class="card" style="margin-bottom: 10px">
      <el-input @input="load" style="width: 260px" v-model="data.courseName" placeholder="请输入要查询的课程名称"
                :prefix-icon="Search"/>
      <el-input @input="load" style="margin-left:10px; width: 260px" v-model="data.studentName"
                placeholder="请输入要查询的学生名称"
                :prefix-icon="Search"/>
      <el-button type="info" plain style="margin: 0 0 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div>
        <el-table :data="data.tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="course.name" label="课程名称"/>
          <el-table-column prop="student.name" label="学生名称"/>
          <el-table-column prop="score" label="成绩"/>
          <el-table-column prop="comment" label="教师评语"/>
          <el-table-column prop="feedback" label="学生评价"/>
          <el-table-column label="操作" align="center" width="180px">
            <template #default="scope">
              <el-button type="primary" size="small" plain @click="handleEdit(scope.row)"
                         v-if="data.user.role === 'ADMIN'">编辑
              </el-button>
              <el-button type="danger" size="small" plain @click="del(scope.row.id)"
                         v-if="data.user.role === 'ADMIN'">删除
              </el-button>
              <el-button type="primary" size="small" plain @click="handleEdit(scope.row)"
                         v-if="data.user.role === 'STUDENT'">评价
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>


    <div class=" card
            ">
      <el-pagination v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                     @current-change="handleCurrentChange"
                     background layout="prev, pager, next" :total="data.total"/>
    </div>


    <!--    评分表单-->
    <el-dialog v-model="data.formVisible" title="反馈信息" width="35%">
      <el-form :model="data.form" label-width="100px" label-position="right" style="padding-right: 40px">
        <el-form-item label="分数" v-if="data.user.role === 'ADMIN'">
          <el-input v-model="data.form.score" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="教师评语" v-if="data.user.role === 'ADMIN'">
          <el-input type="textarea" v-model="data.form.comment" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="学生评价" v-if="data.user.role === 'STUDENT'">
          <el-input type="textarea" v-model="data.form.feedback" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="data.formVisible=false">取消</el-button>
          <el-button type="primary" plain @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>

  </div>

</template>

<script setup>
import {reactive} from 'vue';
import {Search} from '@element-plus/icons-vue';
import request from '@/utils/request';
import {ElMessage, ElMessageBox} from 'element-plus';

const data = reactive({
  form:{},
  courseName: '',
  studentName: '',
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  user: JSON.parse(localStorage.getItem('student-user') || '{}'),
  formVisible: false,
});

const load = () => {
  let params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize,
    courseName: data.courseName,
    studentName: data.studentName,
  };
  if (data.user.role === 'STUDENT') {
    params.studentId = data.user.id;
  }

  request.get('/grade/selectPage', {
    params: params,
  }).then(res => {
    if (res.code === '200') {
      data.tableData = res.data?.list || [];
      data.total = res.data?.total || 0;
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    if (err.response?.data?.code === '401') {
      localStorage.removeItem('student-user');
    }
    ElMessage.error(err.response?.data?.msg || err.message);
  });
};

// 加载一次 获取课程数据
load();

const handleCurrentChange = () => {
  // 当翻页的时候重新加载数据
  load();
};

const reset = () => {
  data.courseName = '';
  data.studentName = '';
  load();
};

const del = (id) => {
  ElMessageBox.confirm('删除后内容将无法恢复，您确认删除嘛？', '删除确认', {type: 'warning'}).then(res => {
    request.delete('/grade/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('操作成功');
        load();
      } else {
        ElMessage.error(res.msg);
      }
    });
  }).catch(err => {
    if (err.response?.data?.code === '401') {
      localStorage.removeItem('student-user');
    }
    ElMessage.error(err.response?.data?.msg || err.message);
  });
};

// 打分
const handleEdit = (row) => {
  // 弹窗
  data.formVisible = true;
  data.form = JSON.parse(JSON.stringify(row))
};

const save = () => {
  request.put('/grade/update', data.form).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功');
      data.formVisible = false;
      load();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    if (err.response?.data.code === '401') {
      localStorage.removeItem('student-user');
    }
    ElMessage.error(err.response?.data?.msg || err.message);
  });
};

</script>