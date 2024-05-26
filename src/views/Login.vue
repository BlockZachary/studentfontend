<template>
  <div>
    <div class="login-container">
      <div style="width: 420px" class="login-box">
        <div class="title">学生信息管理系统 - 登录</div>
        <el-form :model="data.form" ref="formRef" :rules="rules">
          <el-form-item prop="username">
            <el-input style="height: 40px;font-size: 18px" prefix-icon="Avatar" v-model="data.form.username"
                      placeholder="请输入账号"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password style="height: 40px;font-size: 18px" prefix-icon="Lock" v-model="data.form.password"
                      placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item prop="role">
            <el-radio-group size="large" v-model="data.form.role">
              <el-radio-button style="margin-left: 70px" label="管理员" value="ADMIN" />
              <el-radio-button style="margin-left: 50px" label="学生" value="STUDENT" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;font-size: 18px" @click="login">登 录</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top:35px;text-align: right;font-size: 15px">
          还没有账号？请<a href="/register">注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import request from '@/utils/request';
import {ElMessage} from 'element-plus';
import router from '@/router';

const data = reactive({
  form: {role: 'ADMIN'},
});

const rules = reactive({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ], password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
});

const formRef = ref();

const login = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.post('/login', data.form).then(res => {
        if (res.code === '200') {
          localStorage.setItem('student-user', JSON.stringify(res.data));
          ElMessage.success('登录成功');
          router.push('/home');
        } else {
          ElMessage.error(res.msg);
        }
      }).catch(err => {
        ElMessage.error(err.response?.data?.msg || err.message);
      });
    }
  });
};


</script>

<style scoped>
.login-container {
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/imgs/login_background.png");
  background-size: cover;
}

.login-box {
  background-color: rgb(255, 255, 255, 50%);
  box-shadow: 0 0 10px rgba(84, 221, 245, 0.41);
  padding: 30px;
}

.title {
  font-weight: bold;
  font-size: 30px;
  text-align: center;
  margin-bottom: 35px;
}

</style>