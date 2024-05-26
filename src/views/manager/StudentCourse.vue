<template>
  <div>
    <div class="card" style="margin-bottom: 10px">
      <el-input @input="load" style="width: 260px" v-model="data.name" placeholder="请输入要查询的课程名称"
                :prefix-icon="Search"/>
      <el-input @input="load" style="margin-left:10px; width: 260px" v-model="data.number" placeholder="请输入课程编号"
                :prefix-icon="Search"/>
      <el-button type="info" plain style="margin: 0 0 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div>
        <el-table :data="data.tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="课程名称"/>
          <el-table-column prop="number" label="课程编号"/>
          <el-table-column prop="student.name" label="学生名称"/>
          <el-table-column label="操作" align="center" width="180px">
            <template #default="scope">
              <el-button type="primary" size="small" plain @click="addGrade(scope.row)"
                         v-if="data.user.role === 'ADMIN'">评分
              </el-button>
              <el-button type="danger" size="small" plain @click="del(scope.row.id)">删除</el-button>
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
    <el-dialog v-model="data.formVisible" title="成绩信息" width="35%">
      <el-form :model="data.gradeForm" label-width="100px" label-position="right" style="padding-right: 40px">
        <el-form-item label="课程名称">
          <el-input v-model="data.gradeForm.name" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="data.gradeForm.score" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="评语">
          <el-input type="textarea" v-model="data.gradeForm.comment" autocomplete="off"/>
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
  name: '',
  number: '',
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  user: JSON.parse(localStorage.getItem('student-user') || '{}'),
  gradeForm: {},
  formVisible: false,
});

const load = () => {
  let params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize,
    name: data.name,
    number: data.number,
  };
  if (data.user.role === 'STUDENT') {
    params.studentId = data.user.id;
  }

  request.get('/studentCourse/selectPage', {
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
  data.name = '';
  data.number = '';
  load();
};

const del = (id) => {
  ElMessageBox.confirm('删除后内容将无法恢复，您确认删除嘛？', '删除确认', {type: 'warning'}).then(res => {
    request.delete('/studentCourse/delete/' + id).then(res => {
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

// 打分函数，弹窗
const addGrade = (row) =>{
  // 弹窗
  data.formVisible = true
  data.gradeForm.name = row.name
  data.gradeForm.studentId = row.studentId
  data.gradeForm.courseId = row.courseId
  data.gradeForm.score = ""
  data.gradeForm.comment = ""
}

const save = () => {
  request.post('/grade/add', data.gradeForm).then(res=>{
    if(res.code === '200'){
      ElMessage.success('操作成功')
      data.formVisible = false
      load()
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    if (err.response?.data.code === '401'){
      localStorage.removeItem('student-user')
    }
    ElMessage.error(err.response?.data?.msg || err.message)
  })
}

</script>