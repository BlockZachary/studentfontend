<template>
  <div class="card" style="margin-bottom: 10px">
    <el-input @input="load" style="width: 260px" v-model="data.username" placeholder="请输入要查询的学生学号"
              :prefix-icon="Search"/>
    <el-input @input="load" style="margin-left: 10px; width: 260px" v-model="data.name"
              placeholder="请输入要查询的学生姓名"
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
        <el-table-column prop="username" label="学生学号"/>
        <el-table-column prop="name" label="学生姓名"/>
        <el-table-column prop="gender" label="性别"/>
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="birthday" label="出生日期"/>

        <el-table-column prop="avatar" label="头像">
          <template #default="scope">
            <el-image v-if="scope.row.avatar" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" :preview-teleported="true"
                      style="width: 40px;height: 40px"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" plain @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>


  <div class="card">
    <el-pagination v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                   @current-change="handleCurrentChange"
                   background layout="prev, pager, next" :total="data.total"/>
  </div>

  <el-dialog width="35%" v-model="data.formVisible" title="学生信息">
    <el-form :model="data.form" :rules="rules" ref="formRef" label-width="100px" label-position="right"
             style="padding-right: 45px">
      <el-form-item label="学生学号" prop="username">
        <el-input v-model="data.form.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="data.form.password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input v-model="data.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="data.form.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="data.form.phone" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="data.form.birthday"></el-date-picker>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload action="http://localhost:9090/files/upload" list-type="picture"
                   :on-success="handleImgUploadSuccess">
          <el-button type="primary">上传头像
          </el-button>
        </el-upload>
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
import {reactive, ref} from 'vue';
import {Search} from '@element-plus/icons-vue';
import request from '@/utils/request';
import {ElMessage, ElMessageBox} from 'element-plus';

const data = reactive({
  username: '',
  name: '',
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 5,
  formVisible: false,
  form: {password: '123456'},
});

const load = () => {
  request.get('/student/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      username: data.username,
      name: data.name,
    },
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
  data.username = '';
  data.name = '';
  load();
};

const rules = reactive({
  username: [
    {required: true, message: '请输入学生学号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
});

const formRef = ref();

const handleAdd = () => {
  data.formVisible = true;
  data.form = {password: '123456'};
};

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.request({
        url: data.form.id ? '/student/update' : '/student/add',
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
        if (err.response?.data?.code === '401') {
          localStorage.removeItem('student-user');
        }
        ElMessage.error(err.response?.data?.msg || err.message);
      });
    }
  });
};

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row));
  data.formVisible = true;
  data.form.password = '123456';
};

const handleDelete = (id) => {
  ElMessageBox.confirm('删除内容将无法恢复，您确认删除嘛？', '删除确定', {type: 'warning'}).then(res => {
    request.delete('/student/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功');
        load();
      } else {
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      if (err.response?.data?.code === '401') {
        localStorage.removeItem('student-user');
      }
      ElMessage.error(err.response?.data?.msg || err.message);
    });
  });
};

const handleImgUploadSuccess = (res) => {
  data.form.avatar = res.data.url;
};

</script>