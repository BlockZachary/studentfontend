<template>
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
      <el-button type="primary" style="margin-bottom: 5px" plain @click="handleAdd">新增</el-button>
    </div>
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
            <el-button type="primary" size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" plain @click="handleDelete(scope.row.id)">删除</el-button>
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

  <el-dialog width="35%" v-model="data.formVisible" title="课程信息">
    <el-form :model="data.form" label-width="100px" label-position="right" style="padding-right: 45px">
      <el-form-item label="课程名称">
        <el-input v-model="data.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="课程编号">
        <el-input v-model="data.form.number" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="课程描述">
        <el-input v-model="data.form.description" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="课时">
        <el-input v-model="data.form.periods" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="任课教师">
        <el-input v-model="data.form.teacher" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.formVisible = false" plain>取消</el-button>
        <el-button type="primary" @click="save" plain>保存</el-button>
      </span>
    </template>
  </el-dialog>
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
  formVisible: false,
  form: {},
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

const handleAdd = () => {
  data.formVisible = true;
  data.form = {};
};

const save = () => {
  request.request({
    url: data.form.id ? '/course/update' : '/course/add',
    method: data.form.id ? 'put' : 'post',
    data: data.form,
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功');
      data.formVisible = false;
      load();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    ElMessage.error(err.response?.data?.msg || err.message);
  });
};

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row));
  data.formVisible = true;
};

const handleDelete = (id) => {
  ElMessageBox.confirm('删除内容将无法恢复，您确认删除嘛？', '删除确定', {type: 'warning'}).then(res => {
    request.delete('/course/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功');
        load();
      } else {
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      ElMessage.error(err.response?.data?.msg || err.message);
    });
  });
};

</script>