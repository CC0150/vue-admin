<template>
  <div class="not-found">
    <div class="icon-box">
      <svg width="100" height="100" viewBox="0 0 1024 1024" fill="none">
        <circle cx="512" cy="512" r="400" fill="#F7F7FA" />
        <path d="M384 410c0-70 56-126 126-126s126 56 126 126" stroke="#FF4D4F" stroke-width="30"
          stroke-linecap="round" />
        <ellipse cx="430" cy="484" rx="22" ry="30" fill="#A0A0A0" />
        <ellipse cx="594" cy="484" rx="22" ry="30" fill="#A0A0A0" />
        <path d="M410 600c19 30 59 50 102 50s83-20 102-50" stroke="#C1C1C1" stroke-width="18" stroke-linecap="round" />
      </svg>
    </div>
    <h1>404</h1>
    <p>哎呀，页面走丢了~</p>
    <router-link to="/" class="home-btn">返回首页</router-link>
  </div>
</template>

<script setup>

</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f7f7fa 100%);
  animation: fadeIn 1s;
  height: 100vh;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-box {
  margin-bottom: 18px;
  animation: float 2s infinite ease-in-out alternate;
}

@keyframes float {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10px);
  }
}

.not-found h1 {
  font-size: 5rem;
  font-weight: bold;
  color: #FF4D4F;
  margin-bottom: 10px;
  letter-spacing: 6px;
  text-shadow: 0 2px 16px #ff4d4f18;
}

.not-found p {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 35px;
  letter-spacing: 1px;
}

.home-btn {
  display: inline-block;
  padding: 12px 36px;
  font-size: 1.1rem;
  color: #fff;
  background: linear-gradient(90deg, #42b983 60%, #2ac1bc 100%);
  border: none;
  border-radius: 28px;
  box-shadow: 0 2px 14px #42b98330;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 2px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.13s;
}

.home-btn:hover {
  background: linear-gradient(90deg, #2ac1bc 20%, #42b983 100%);
  box-shadow: 0 6px 24px #42b98355;
  transform: translateY(-2px) scale(1.04);
}
</style>