<template>
  <div>
    <div class="card" style="margin-bottom: 10px">
      <el-input @input="load" style="width: 260px" v-model="data.name" placeholder="请输入要查询的课程名称"
                :prefix-icon="Search"/>
      <el-input @input="load" style="margin-left:10px; width: 260px" v-model="data.number" placeholder="请输入课程编号"
                :prefix-icon="Search"/>
      <el-input @input="load" style="margin-left:10px; width: 260px" v-model="data.teacher" placeholder="请输入任课教师"
                :prefix-icon="Search"/>
      <el-button type="info" plain style="margin: 0 0 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div>
        <el-table :data="data.tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"/>
          <el-table-column prop="name" label="课程名称" width="180"/>
          <el-table-column prop="number" label="课程编号" width="180"/>
          <el-table-column prop="description" label="课程描述" width="240"/>
          <el-table-column prop="periods" label="课时" width="180"/>
          <el-table-column prop="teacher" label="任课教师"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" plain @click="selectCourse(scope.row)">选课</el-button>
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
  </div>

</template>

<script setup>
import {reactive} from 'vue';
import {Search} from '@element-plus/icons-vue';
import request from '@/utils/request';
import {ElMessage, ElMessageBox} from 'element-plus';

const data = reactive({
  name: '',
  number: '',
  teacher: '',
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 5,
  user: JSON.parse(localStorage.getItem('student-user') || '{}'),
});

const load = () => {
  request.get('/course/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      number: data.number,
      teacher: data.teacher,
    },
  }).then(res => {
    if (res.code === '200') {
      data.tableData = res.data.list;
      data.total = res.data.total;
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
  data.name = '';
  data.number = '';
  data.teacher = '';
  load();
};

const selectCourse = (row) => {
  request.post('/studentCourse/add', {
    studentId: data.user.id,
    name: row.name,
    number: row.number,
    courseId: row.id,
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('选课成功');
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

</script>