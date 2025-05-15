<template>
  <div class="page-header">
    <img class="header-avatar" :src="avatarUrl" alt="avatar" />
    <span class="header-title">测测你的五行口味</span>
  </div>
  <div class="chat-bg">
    <div v-for="(msg, idx) in visibleMessages" :key="idx" :class="['chat-row', (msg.type === 'user' || msg.type === 'options') ? 'chat-row-user' : '']">
      <template v-if="msg.type === 'avatar'">
        <div class="avatar-row">
          <img class="avatar" :src="msg.avatar" alt="avatar" />
        </div>
      </template>
      <template v-else-if="msg.type === 'text'">
        <div v-if="msg.imageOptions" class="chat-bubble">
          <div v-if="msg.text" v-html="msg.text"></div>
          <div class="image-options-grid">
            <div v-for="(opt, i) in msg.imageOptions" 
                 :key="i" 
                 class="image-option" 
                 :class="{'selected': selectedFoodType === opt.text}"
                 @click="selectImageOption(opt)">
              <div class="radio-button">
                <div class="radio-inner"></div>
              </div>
              <img :src="opt.image" :alt="opt.text" class="food-type-image" />
            </div>
          </div>
        </div>
        <div v-else
             class="chat-bubble text-bubble"
             v-html="msg.text"
             :class="{ clickable: msg.clickable }"
             @click="msg.clickable && handleReportClick()"
             style="cursor: pointer;"
        ></div>
      </template>
      <template v-else-if="msg.type === 'options'">
        <div class="options" v-if="(idx !== 3 || !userSelected) && !optionsSelected[msg.optionsId]">
          <button v-for="(opt, i) in msg.options.slice(0, optionsProgress[msg.optionsId] || 1)" :key="i" class="option-btn" @click="selectOption(opt, msg.optionsId)">{{ opt }}</button>
        </div>
      </template>
      <template v-else-if="msg.type === 'user'">
        <div class="user-bubble">{{ msg.text }}</div>
      </template>
      <template v-else-if="msg.type === 'taste-choices'">
        <div>
          <div class="chat-bubble">
            <div v-for="(q, idx) in msg.questions" :key="idx" class="taste-question-row">
              <img :src="q.img" class="taste-img" />
              <div class="taste-q-content">
                <div class="taste-q-title">{{ q.title }}</div>
                <div class="taste-options">
                  <div
                    :class="['taste-option', tasteAnswers[idx] === 0 ? 'selected' : 'left']"
                    @click="() => selectTaste(idx, 0)"
                  >{{ q.options[0] }}</div>
                  <div
                    :class="['taste-option', tasteAnswers[idx] === 1 ? 'selected' : 'right']"
                    @click="() => selectTaste(idx, 1)"
                  >{{ q.options[1] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'card'">
        <div class="card-bubble">
          <img class="card-img" :src="msg.image" alt="card" />
          <div class="card-content">
            <div class="card-title" v-html="msg.title"></div>
            <ul class="card-list">
              <li v-for="(item, i) in msg.items" :key="i">
                <span v-html="item"></span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'card-bg'">
        <div class="card-bg-bubble" :style="{ backgroundImage: `url(${msg.image})` }"></div>
      </template>
      <template v-else-if="msg.type === 'card-overlay' && idx === 0">
        <div class="card-overlay-bubble-first" :style="{ backgroundImage: `url(${msg.image})` }">
          <!-- 只保留背景图，不渲染任何内容 -->
        </div>
      </template>
      <template v-else-if="msg.type === 'card-overlay'">
        <div class="card-overlay-bubble" :style="{ backgroundImage: `url(${msg.image})` }">
          <div class="card-overlay-content">
            <div class="card-overlay-title" v-html="msg.title"></div>
            <ul class="card-overlay-list">
              <li v-for="(item, i) in msg.items" :key="i">
                <span v-html="item"></span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'report-card'">
        <div class="report-card-bubble" 
             :style="{ backgroundImage: `url(${msg.image})` }"
             @click="handleReportClick"
             style="cursor: pointer;"></div>
      </template>
      <template v-else-if="msg.type === 'image-options-card'">
        <div class="image-options-card-bubble" :style="{ backgroundImage: `url(${msg.image})` }">
          <div class="image-options-card-content">
            <div class="image-options-card-title" v-html="msg.title"></div>
            <div class="image-options-grid">
              <div v-for="(opt, i) in msg.imageOptions" 
                   :key="i" 
                   class="image-option" 
                   :class="{'selected': selectedFoodType === opt.text}"
                   @click="selectImageOption(opt)">
                <div class="radio-button">
                  <div class="radio-inner"></div>
                </div>
                <img :src="opt.image" :alt="opt.text" class="food-type-image" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'taste-choices-card'">
        <div class="taste-choices-card-bubble" :style="{ backgroundImage: `url(${msg.image})` }">
          <div class="taste-choices-card-content">
            <div v-for="(q, idx) in msg.questions" :key="idx" class="taste-question-row">
              <div class="taste-q-content">
                <div class="taste-options" v-if="tasteAnswers[idx] === null">
                  <div
                    :class="['taste-option', 'left']"
                    @click="() => selectTaste(idx, 0)"
                  >{{ q.options[0] }}</div>
                  <div
                    :class="['taste-option', 'right']"
                    @click="() => selectTaste(idx, 1)"
                  >{{ q.options[1] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'taste-choices-card2'">
        <div class="taste-choices-card2-bubble" :style="{ backgroundImage: `url(${msg.image})` }">
          <div class="taste-choices-card2-content">
            <div v-for="(q, idx) in msg.questions" :key="idx" class="taste-question-row">
              <div class="taste-q-content">
                <div class="taste-options" v-if="tasteAnswers[idx+1] === null">
                  <div
                    :class="['taste-option', 'left']"
                    @click="() => selectTaste(idx+1, 0)"
                  >{{ q.options[0] }}</div>
                  <div
                    :class="['taste-option', 'right']"
                    @click="() => selectTaste(idx+1, 1)"
                  >{{ q.options[1] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'taste-choices-card3'">
        <div class="taste-choices-card3-bubble" :style="{ backgroundImage: `url(${msg.image})` }">
          <div class="taste-choices-card3-content">
            <div v-for="(q, idx) in msg.questions" :key="idx" class="taste-question-row">
              <div class="taste-q-content">
                <div class="taste-options" v-if="tasteAnswers[idx+2] === null">
                  <div
                    :class="['taste-option', 'left']"
                    @click="() => selectTaste(idx+2, 0)"
                  >{{ q.options[0] }}</div>
                  <div
                    :class="['taste-option', 'right']"
                    @click="() => selectTaste(idx+2, 1)"
                  >{{ q.options[1] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'card-overlay-order'">
        <div class="card-overlay-bubble-order" :style="{ backgroundImage: `url(${msg.image})` }">
          <!-- 只保留背景图，不渲染任何内容 -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'  // 添加这行

const router = useRouter()  // 添加这行

const avatarUrl = new URL('../assets/avatar.png', import.meta.url).href

const optionsIdSeedStart = 1
let optionsIdSeed = optionsIdSeedStart + 1

const cardOverlayImages = [
  new URL('../assets/card1.png', import.meta.url).href,
  new URL('../assets/card2.png', import.meta.url).href,
  new URL('../assets/card3.png', import.meta.url).href,
  new URL('../assets/card4.png', import.meta.url).href,
  new URL('../assets/card5.png', import.meta.url).href,
]
const randomCardOverlayImage = cardOverlayImages[Math.floor(Math.random() * cardOverlayImages.length)]

const cardOrderImages = [
  new URL('../assets/card6.png', import.meta.url).href,
  new URL('../assets/card7.png', import.meta.url).href,
  new URL('../assets/card8.png', import.meta.url).href
]
function getRandomOrderImage() {
  return cardOrderImages[Math.floor(Math.random() * cardOrderImages.length)]
}

const messages = [
  {
    type: 'card-overlay',
    image: randomCardOverlayImage,
    title: '今年，<span class="card-highlight">72</span>份外卖准时送到，点外卖<br>的日子占了<span class="card-highlight">64%</span>',
    items: [
      '床以外都是远方，筷子是年度最佳伴侣！等待时，你的经典姿势是？',
    ]
  },
  { type: 'options', options: ['沉迷工作忘乎所以，外卖啥时候到的？', '疯狂刷新地图看小哥一点一点挪过来', '找好会议室，万事俱备就等饭到'], optionsId: optionsIdSeedStart }
]

const foodTypes = [
  { text: '火锅', image: new URL('../assets/food-types/hotpot.jpg', import.meta.url).href },
  { text: '烧烤', image: new URL('../assets/food-types/bbq.jpg', import.meta.url).href },
  { text: '粤菜', image: new URL('../assets/food-types/cantonese.jpg', import.meta.url).href },
  { text: '铁板烧', image: new URL('../assets/food-types/teppanyaki.jpg', import.meta.url).href },
  { text: '川菜', image: new URL('../assets/food-types/sichuan.jpg', import.meta.url).href },
  { text: '日料', image: new URL('../assets/food-types/japanese.jpg', import.meta.url).href },
  { text: '江浙菜', image: new URL('../assets/food-types/jiangzhe.jpg', import.meta.url).href },
  { text: '东北菜', image: new URL('../assets/food-types/dongbei.jpg', import.meta.url).href },
  { text: '云南菜', image: new URL('../assets/food-types/yunnan.jpg', import.meta.url).href }
]

const tasteQuestions = [
  {
    options: ['甜的', '咸的']
  }
]

const tasteQuestions2 = [
  {
    options: ['泡着吃', '煮着吃']
  }
]

const tasteQuestions3 = [
  {
    options: ['脆的', '软的']
  }
]

const visibleMessages = ref([])
let currentIdx = 0
const userSelected = ref(false)
const optionsProgress = ref({})
const optionsSelected = ref({})
const selectedFoodType = ref(null)
const tasteAnswers = ref([null, null, null])
const tasteSubmitted = ref(false)

function showNext() {
  if (currentIdx < messages.length) {
    visibleMessages.value.push(messages[currentIdx])
    // 如果是options类型，启动依次出现动画
    if (messages[currentIdx].type === 'options') {
      showOptionsOneByOne(messages[currentIdx].options, messages[currentIdx].optionsId)
    }
    currentIdx++
    if (currentIdx < messages.length) {
      setTimeout(showNext, 800)
    }
  }
}

function showOptionsOneByOne(options, optionsId) {
  optionsProgress.value = { ...optionsProgress.value, [optionsId]: 1 }
  function showNextOption() {
    if (optionsProgress.value[optionsId] < options.length) {
      optionsProgress.value = { ...optionsProgress.value, [optionsId]: optionsProgress.value[optionsId] + 1 }
      setTimeout(showNextOption, 300)
    }
  }
  setTimeout(showNextOption, 300)
}

function selectOption(opt, optionsId) {
  if (optionsId) {
    optionsSelected.value = { ...optionsSelected.value, [optionsId]: true }
  } else {
    userSelected.value = true
  }

  // 针对外卖等待方式的特殊处理
  if (optionsId === optionsIdSeedStart) {
    let nextText = ''
    if (opt === '沉迷工作忘乎所以，外卖啥时候到的？') {
      nextText = '敬业归敬业，饭也要好好吃啊'
    } else if (opt === '疯狂刷新地图看小哥一点一点挪过来') {
      nextText = '这是真人版《小哥去哪儿》沉浸式直播'
    } else if (opt === '找好会议室，万事俱备就等饭到') {
      nextText = '5G冲饭人已就位'
    }
    visibleMessages.value.push({ type: 'user', text: opt })
    setTimeout(() => {
      visibleMessages.value.push({ type: 'text', text: nextText })
      // 后续消息...
      setTimeout(() => {
        const orderImg = getRandomOrderImage();
        visibleMessages.value.push({
          type: 'card-overlay-order',
          image: orderImg,
          title: '你最晚的订单是<span class="highlight">凌晨三点</span>下单的"好吃炸鸡"'
        });
        setTimeout(() => {
          const optionsId = optionsIdSeed++;
          if (orderImg.includes('card6')) {
            visibleMessages.value.push({
              type: 'options',
              options: ['好呀，下次试试酸辣粉', '达咩，我不爱吃酸辣粉', '我更想试试牛肉面'],
              optionsId
            });
            showOptionsOneByOne(['好呀，下次试试酸辣粉', '达咩，我不爱吃酸辣粉', '我更想试试牛肉面'], optionsId);
          } else if (orderImg.includes('card7')) {
            visibleMessages.value.push({
              type: 'options',
              options: ['加浓美式就是这个味，得劲儿！', '加浓美式才是真正的工作搭子', '你误会了，我更爱喝拿铁'],
              optionsId
            });
            showOptionsOneByOne(['加浓美式就是这个味，得劲儿！', '加浓美式才是真正的工作搭子', '你误会了，我更爱喝拿铁'], optionsId);
          } else if (orderImg.includes('card8')) {
            visibleMessages.value.push({
              type: 'options',
              options: ['麦门永存 我爱麦麦', '疯狂星期四，我更爱吃肯德基', '其实我更爱吃塔斯汀'],
              optionsId
            });
            showOptionsOneByOne(['麦门永存 我爱麦麦', '疯狂星期四，我更爱吃肯德基', '其实我更爱吃塔斯汀'], optionsId);
          } else {
            visibleMessages.value.push({
              type: 'options',
              options: ['我不爱吃'],
              optionsId
            });
            showOptionsOneByOne(['我不爱吃'], optionsId);
          }
        }, 800);
      }, 800)
    }, 800)
    return
  }

  // 处理"提交答案"按钮
  if (opt === '提交答案') {
    const answerText = `我的口味选择：${tasteQuestions.map((q, i) => q.options[tasteAnswers.value[i]] || '').join('，')}`;
    visibleMessages.value.push({ type: 'user', text: answerText });
    setTimeout(() => {
      visibleMessages.value.push({
        type: 'report-card',
        image: new URL('../assets/report-gold.png', import.meta.url).href
      });
    }, 800);
    return;
  }

  // 针对食物类型选项的特殊处理
  if (optionsId && optionsId >= optionsIdSeedStart + 2) {
    if (opt === '就选这个' && selectedFoodType.value) {
      visibleMessages.value.push({ type: 'user', text: `我选择 ${selectedFoodType.value}` })
      afterFoodTypeOptions()
    } else if (opt === '都不爱吃') {
      visibleMessages.value.push({ type: 'user', text: '都不爱吃' })
      afterFoodTypeOptions()
    }
    return
  }

  // 前两组选项，点击后显示绿色气泡
  visibleMessages.value.push({ type: 'user', text: opt })

  if (optionsId === optionsIdSeedStart) {
    // 第一组选项的后续消息
    setTimeout(() => {
      visibleMessages.value.push({ type: 'text', text: '只有你这样智慧的脑袋，才能想出这么多点外卖省钱的方法。' })
      setTimeout(() => {
        const orderImg = getRandomOrderImage();
        visibleMessages.value.push({
          type: 'card-overlay-order',
          image: orderImg,
          title: '你最晚的订单是<span class="highlight">凌晨三点</span>下单的"好吃炸鸡"'
        });
        setTimeout(() => {
          visibleMessages.value.push({ type: 'text', text: '你是彻底放弃睡眠的夜猫子，白天靠咖啡续命，晚上靠外卖续魂！' })
          setTimeout(() => {
            const optionsId = optionsIdSeed++;
            if (orderImg.includes('card6')) {
              visibleMessages.value.push({
                type: 'options',
                options: ['好呀，下次试试酸辣粉', '达咩，我不爱吃酸辣粉', '我更想试试牛肉面'],
                optionsId
              });
              showOptionsOneByOne(['好呀，下次试试酸辣粉', '达咩，我不爱吃酸辣粉', '我更想试试牛肉面'], optionsId);
            } else if (orderImg.includes('card7')) {
              visibleMessages.value.push({
                type: 'options',
                options: ['加浓美式就是这个味，得劲儿！', '加浓美式才是真正的工作搭子', '你误会了，我更爱喝拿铁'],
                optionsId
              });
              showOptionsOneByOne(['加浓美式就是这个味，得劲儿！', '加浓美式才是真正的工作搭子', '你误会了，我更爱喝拿铁'], optionsId);
            } else if (orderImg.includes('card8')) {
              visibleMessages.value.push({
                type: 'options',
                options: ['麦门永存 我爱麦麦', '疯狂星期四，我更爱吃肯德基', '其实我更爱吃塔斯汀'],
                optionsId
              });
              showOptionsOneByOne(['麦门永存 我爱麦麦', '疯狂星期四，我更爱吃肯德基', '其实我更爱吃塔斯汀'], optionsId);
            } else {
              visibleMessages.value.push({
                type: 'options',
                options: ['我不爱吃'],
                optionsId
              });
              showOptionsOneByOne(['我不爱吃'], optionsId);
            }
          }, 800)
        }, 800)
      }, 800)
    }, 800)
  } else {
    // 第二组选项的后续消息
    setTimeout(() => {
      visibleMessages.value.push({ 
        type: 'image-options-card',
        image: new URL('../assets/food-types/bg.png', import.meta.url).href,
        title: '周末和饭搭子吃饭，你会选择：',
        imageOptions: foodTypes 
      })
      setTimeout(() => {
        const optionsId = optionsIdSeed++
        visibleMessages.value.push({ type: 'options', options: ['就选这个', '都不爱吃'], optionsId })
        showOptionsOneByOne(['就选这个', '都不爱吃'], optionsId)
      }, 800)
    }, 800)
  }
}

function selectImageOption(opt) {
  selectedFoodType.value = opt.text
  // 不再push用户气泡
}

function selectTaste(qIdx, optIdx) {
  tasteAnswers.value[qIdx] = optIdx
  if (qIdx === 0) {
    if (optIdx === 0) {
      visibleMessages.value.push({ type: 'user', text: '西红柿炒蛋必须是甜的！' })
    } else if (optIdx === 1) {
      visibleMessages.value.push({ type: 'user', text: '西红柿炒蛋当然是咸的！' })
    }
    setTimeout(() => {
      visibleMessages.value.push({
        type: 'taste-choices-card2',
        questions: tasteQuestions2,
        image: new URL('../assets/taste-bg2.png', import.meta.url).href
      })
    }, 500)
  } else if (qIdx === 1) {
    if (optIdx === 0) {
      visibleMessages.value.push({ type: 'user', text: '泡着吃多方便！' })
    } else if (optIdx === 1) {
      visibleMessages.value.push({ type: 'user', text: '煮着吃才有灵魂！' })
    }
    setTimeout(() => {
      visibleMessages.value.push({
        type: 'taste-choices-card3',
        questions: tasteQuestions3,
        image: new URL('../assets/taste-bg3.png', import.meta.url).href
      })
    }, 500)
  } else if (qIdx === 2) {
    if (optIdx === 0) {
      visibleMessages.value.push({ type: 'user', text: '脆桃才是YYDS！' })
    } else if (optIdx === 1) {
      visibleMessages.value.push({ type: 'user', text: '软桃香喷喷！' })
    }
    setTimeout(() => {
      visibleMessages.value.push({
        type: 'report-card',
        image: new URL('../assets/report-gold.png', import.meta.url).href
      })
    }, 800)
  }
}

function submitTaste() {
  tasteSubmitted.value = true
  visibleMessages.value.push({
    type: 'user',
    text: `我的口味选择：${tasteQuestions.map((q, i) => q.options[tasteAnswers.value[i]]).join('，')}`
  })
  // 这里可以继续后续消息
}

function afterFoodTypeOptions() {
  visibleMessages.value.push({ type: 'taste-choices-card', questions: tasteQuestions, image: new URL('../assets/taste-bg.png', import.meta.url).href })
  // 移除提交答案按钮的推送
}

function handleReportClick() {
  router.push('/report')
}

onMounted(() => {
  showNext()
})
</script>

<style scoped>
.chat-bg {
  width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background: linear-gradient(180deg, #e6faf3 0%, #e6f6fa 100%);
  padding-top: 16px;
  box-sizing: border-box;
}
.avatar-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-left: 24px;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d2f3e6;
}
.chat-row {
  display: flex;
  width: 100%;
  justify-content: flex-start;
}
.chat-row-user {
  justify-content: flex-end;
  width: 100%;
  padding-right: 16px;
  padding-left: 16px;
  box-sizing: border-box;
}
.chat-bubble {
  background: #fff;
  border-radius: 20px 20px 20px 0;
  padding: 16px;
  margin: 0 16px 16px 16px;
  font-size: 14px;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  line-height: 1.7;
  text-align: left;
  width: auto;
  max-width: 343px;
  display: block;
  box-sizing: border-box;
}
.user-bubble {
  background: #94F4C6;
  color: #111111 85%;
  border-radius: 20px 20px 0 20px;
  padding: 16px;
  font-size: 14px;
  font-weight: 450;
  max-width: 85%;
  text-align: left;
  box-shadow: 0 2px 8px rgba(30,201,139,0.08);
  line-height: 20px;
  display: inline-block;
  word-break: break-all;
  margin-bottom: 16px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  width: auto;
  align-items: flex-end;
}
.option-btn {
  border: 0.5px solid #45BF91;
  background: #fff;
  color: #45BF91;
  border-radius: 20px 20px 0 20px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 450;
  line-height: 20px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-align: left;
  width: auto;
  min-width: 0;
  align-self: flex-end;
}
.option-btn:hover {
  background: #94F4C6;
  color: #111 85%;
}
.option-btn:active,
.option-btn:focus {
  outline: none;
  box-shadow: none;
  border-color: #94F4C6;
}
.image-options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 32px;
  width: 313px;
  box-sizing: border-box;
  margin: 16px 0;
}
.image-option {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  aspect-ratio: 1;
  position: relative;
}
.image-option:hover {
  transform: translateY(-2px);
}
.food-type-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.radio-button {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.radio-inner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  transition: background-color 0.2s;
}
.image-option.selected .radio-button {
  border-color: #1ec98b;
  background: #fff;
}
.image-option.selected .radio-inner {
  background-color: #1ec98b;
}
.image-option:hover .radio-button {
  border-color: #1ec98b;
}
.taste-question-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
}
.taste-img {
  width: 75px;
  height: 75px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
  flex-shrink: 0;
}
.taste-q-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.taste-q-title {
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 10px;
}
.taste-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0;
  max-width: 100%;
  box-sizing: border-box;
}
.taste-option {
  width: 150px;
  height: 30px;
  padding: 8px 0;
  border-radius: 50px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  color: transparent;
  font-weight: 500;
  margin: 0 0px;
  transition: all 0.2s;
}
.taste-option.right {
  background: transparent;
  color: transparent;
}
.taste-option.selected {
  background: transparent;
  color: transparent;
}
.taste-option.right.selected {
  background: transparent;
  color: transparent;
}
.taste-title-text {
  margin-bottom: 16px;
}
.text-bubble {
  display: inline-block;
  width: auto;
  max-width: 311px;
}
.text-bubble.clickable {
  border: 1.5px solid #1ec98b;
  color: #1ec98b;
  transition: box-shadow 0.2s, border 0.2s;
}
.text-bubble.clickable:hover {
  box-shadow: 0 2px 12px rgba(30,201,139,0.12);
  background: #f6fefb;
}
.taste-option:hover {
  color: transparent;
  background: transparent;
}
.taste-option.right:hover {
  color: transparent;
  background: transparent;
}
.page-header {
  display: flex;
  width: 375px;
  align-items: center;
  background: #e6faf3;
  padding: 12px 20px 5px 20px;
  margin: 0 auto;
  box-sizing: border-box;
}
.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  background: #fff;
  border: 2px solid #d2f3e6;
}
.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #222;
}
.card-bubble {
  background: #fffbe6;
  border-radius: 32px;
  margin: 0 24px 16px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  overflow: hidden;
  position: relative;
  padding-bottom: 16px;
}
.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  display: block;
  background: #eee;
  border: 2px dashed #f66;
}
.card-content {
  padding: 24px 24px 0 24px;
  position: relative;
  background: #fffbe6;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}
.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #222;
  line-height: 1.3;
}
:deep(.card-highlight) {
  color: #222;
  font-size: 24px !important;
  font-weight: bold;
  background: transparent;
  box-decoration-break: clone;
}
.card-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.card-list li {
  display: flex;
  align-items: flex-start;
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}
.card-bg-bubble {
  width: 100%;
  max-width: 600px;
  height: 320px;
  margin: 0 24px 16px 24px;
  border-radius: 32px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.card-overlay-bubble-first {
  width: 100%;
  max-width: 600px;
  height: 276.5px;
  margin: 0 16px 12px 16px;
  border-radius: 20px 20px 20px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.card-overlay-content-first {
  padding: 110px 100px 14px 14px;
  border-radius: 20px 20px 20px 0;
  text-align: left;
  background: transparent;
}
.card-overlay-bubble {
  width: 100%;
  max-width: 600px;
  margin: 0 16px 12px 16px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.card-overlay-content {
  padding: 150px 20px 12px 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 32px;
  text-align: left;
}
.card-overlay-title {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 12px;
  text-align: left;
  color: #222;
  line-height: 1.6;
}
.card-highlight {
  color: #222;
  font-size: 32px;
  font-weight: bold;
  margin: 0 2px;
}
.card-overlay-list {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
}
.card-overlay-list li {
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
}
.report-card-bubble {
  width: 100%;
  max-width: 343px;
  height: 210px;
  margin: 0 16px 12px 16px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.image-options-card-bubble {
  width: 100%;
  max-width: 600px;
  height: 389.5px;
  margin: 0 16px 12px 16px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.image-options-card-content {
  padding: 24px 20px 24px 20px;
  border-radius: 20px;
  text-align: left;
  background: transparent;
}
.image-options-card-title {
  font-size: 17px;
  font-weight: normal;
  margin-bottom: 12px;
  text-align: left;
  color: #222;
  line-height: 22px;
}
.taste-choices-card-bubble {
  width: 100%;
  max-width: 600px;
  height: 171px;
  margin: 0 16px 12px 16px;
  border-radius: 20px 20px 20px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.taste-choices-card-content {
  padding: 110px 100px 14px 14px;
  border-radius: 20px;
  text-align: left;
  background: transparent;
}
.taste-choices-card2-bubble {
  width: 100%;
  max-width: 600px;
  height: 117px;
  margin: 0 16px 12px 16px;
  border-radius: 20px 20px 20px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.taste-choices-card2-content {
  padding: 60px 60px 14px 14px;
  border-radius: 20px;
  text-align: left;
  background: transparent;
}
.taste-choices-card3-bubble {
  width: 100%;
  max-width: 600px;
  height: 117px;
  margin: 0 16px 12px 16px;
  border-radius: 20px 20px 20px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.taste-choices-card3-content {
  padding: 60px 60px 14px 14px;
  border-radius: 20px 20px 20px 0;
  text-align: left;
  background: transparent;
}
.card-overlay-bubble-order {
  width: 100%;
  max-width: 600px;
  height: 171px;
  margin: 0 16px 12px 16px;
  border-radius: 20px 20px 20px 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
}
.card-overlay-content-order {
  padding: 110px 100px 14px 14px;
  border-radius: 20px 20px 20px 0;
  text-align: left;
  background: transparent;
}
</style>