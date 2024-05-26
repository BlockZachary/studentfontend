<template>
  <div>
    <div class="register-container">
      <div style="width: 400px" class="register-box">
        <div class="title">学生信息管理系统 - 注册</div>
        <el-form :model="data.form" ref="formRef" :rules="rules">
          <el-form-item prop="username">
            <el-input style="height: 40px;font-size: 18px" prefix-icon="User" v-model="data.form.username"
                      placeholder="请输入账号"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password style="height: 40px;font-size: 18px" prefix-icon="Lock" v-model="data.form.password"
                      placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" plain @click="register">注 册</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top:30px;text-align: right">
          已有账号？请直接<a href="/login">登录</a>
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
  form: {},
});

const rules = reactive({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ], password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
});

const formRef = ref();

const register = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.post('/register', data.form).then(res => {
        if (res.code === '200') {
          ElMessage.success('注册成功');
          router.push('/login');
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
.register-container {
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/imgs/login_background.png");
  background-size: cover;
}

.register-box {
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