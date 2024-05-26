<template>
  <div>
    <div class="card" style="width: 50%; padding: 40px">
      <el-form :model="data.form" ref="formRef" :rules="rules" label-width="100px" label-position="right"
               style="padding-right: 40px">
        <el-form-item label="头像">
          <el-upload class="avatar-uploader" action="http://localhost:9090/files/upload" :show-file-list="false"
                     :on-success="handleImgUploadSuccess">
            <img v-if="data.form.avatar" :src="data.form.avatar" class="avatar">
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="学生学号" prop="username">
          <el-input v-model="data.form.username" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="data.form.password" autocomplete="off"/>
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
        <el-form-item style="padding-left: 60%">
          <el-button type="primary" @click="update">保存</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>


<script setup>
import {ref, reactive} from 'vue';
import {Plus} from '@element-plus/icons-vue';
import request from '@/utils/request';
import {ElMessage} from 'element-plus';
import router from '@/router';

const data = reactive({
  form: JSON.parse(localStorage.getItem('student-user') || '{}'),
});

if (data.form) {
  data.form.password = '';
}

const rules = reactive({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '修改个人资料必须重新输入密码', trigger: 'blur'},
  ],
});

const update = () => {
  request.put('/student/update', data.form).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功');
      router.push('/login');
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    ElMessage.error(err.response?.data?.msg || err.message);
  });
};

const handleImgUploadSuccess = (res) => {
  data.form.avatar = res.data;
};

</script>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>