<template>
  <div class="report-page">
    <div class="report-header">
      <h1 class="report-title">你的五行口味报告</h1>
    </div>
    <div class="report-content">
        <img class="report-image" src="../assets/report-gold1.png" alt="report" />
        <div class="report-details1">
          <h3>在别人眼中的你</h3>
          <p class="report-desc">"同事以为你是精致金系——米其林摆盘党，朋友圈总晒法式甜点！"<br>"死党盖章你是热情火系——火锅局发起人，蘸料区永远有你调的魔鬼辣酱！"</p>
        </div>
        <div class="report-details2">
          <h3>实际上的你</h3>
          <p class="report-desc">"大数据扒出你的深夜订单密码，五行真身竟是【赛博金钢】——朋友圈晒着人均800的法餐，外卖收藏夹却躺着东北饭包和珍珠奶茶"</p>
        </div>
    </div>
    <div class="report-match">
      <img class="report-match-image" src="../assets/report-match.png" alt="report" />
    </div>
    <div class="report-footer">
      <p class="report-footer-text">小美喂喂，介绍美食<br>快来和饭搭子看看吃什么</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.report-page {
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background: #FADA77;
  padding-top: 16px;
  box-sizing: border-box;
}

.report-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.report-title {
  width: 100%;
  text-align: center;
  color: #222;
  font-size: 24px;
  margin: 0;
}

.report-content {
  max-width: 600px;
  margin: 0px;
}

.report-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 24px;
}
.report-details1 {
  margin-left: 16px;
  margin-right: 16px;
}
.report-details2 {
  margin-left: 16px;
  margin-right: 16px;
}
.report-details1 h3 {
  color: rgba(17, 25, 37, 0.85);
  font-size: 17px;
  line-height: 22px;
  margin-bottom: 5px;
  font-weight: 400;
}

.report-details2 h3 {
  color: rgba(17, 25, 37, 0.85);
  font-size: 17px;
  line-height: 22px;
  margin-bottom: 5px;
  font-weight: 400;
}

.report-desc {
  color: rgba(17, 25, 37, 0.65);
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 24px;
}
.report-match-image {
  width: 343px;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  margin-left: 16px;
  margin-right: 16px;
}
.report-footer {
  margin-left: 16px;
  margin-right: 16px;
}
.report-footer-text {
  color: rgba(17, 25, 37, 0.65);
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 24px;
  text-align: center;
  padding-bottom: 16px;
}
</style>