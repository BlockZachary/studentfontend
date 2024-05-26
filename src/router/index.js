import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Manager',
      component: () => import('@/views/Manager.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/manager/Home.vue'),
          meta: {requiresAuth: true},
        }, {
          path: 'course',
          name: 'Course',
          component: () => import('@/views/manager/Course.vue'),
          meta: {requiresAuth: true},
        }, {
          path: 'student',
          name: 'Student',
          component: () => import('@/views/manager/Student.vue'),
          meta: {requiresAuth: true},
        }, {
          path: 'person',
          name: 'Person',
          component: () => import('@/views/manager/Person.vue'),
          meta: {requiresAuth: true},
        }, {
          path: 'courseList',
          name: 'CourseList',
          component: () => import('@/views/manager/CourseList.vue'),
          meta: {requiresAuth: true},
        }, {
          path: 'studentCourse',
          name: 'StudentCourse',
          component: () => import('@/views/manager/StudentCourse.vue'),
          meta: {requiresAuth: true},
        },{
          path: 'grade',
          name: 'Grade',
          component: () => import('@/views/manager/Grade.vue'),
          meta: {requiresAuth: true},
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },

  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('student-user'));
  if (requiresAuth && !user) {  // 如果目标路由需要认证，并且用户没有登录
    next('/login');  // 跳转到登录页面
  } else {
    next();   // 如果目标路由不需要认证，并且用户已登录，则正常导航到目标路由
  }
});

export default router;