// 活动数据
const activities = [
    {
        id: 'recipe',
        icon: '🍳',
        title: '全球食谱接龙',
        description: '一起共创《游牧岛美食圣经》！你贡献一道私房菜，我分享一个家乡味，最后生成一本属于我们的电子食谱。',
        example: '比如：你写"泰国芒果糯米饭"，我接"四川麻婆豆腐"'
    },
    {
        id: 'sound',
        icon: '🗺️',
        title: '声音漂流计划',
        description: '共同制作一张能「听」的世界地图。上传你所在地的声音：巴黎咖啡馆的磨豆声、巴厘岛的海浪声...最后合成一张独一无二的声音地图。',
        example: '比如：点击清迈，听到雨林里的键盘声；点击冰岛，听到黑沙滩的风声'
    },
    {
        id: 'vote',
        icon: '✈️',
        title: '投票决定我的旅行',
        description: '是时候体验一把「造物主」的快感了！投票决定一位资深岛民的下一站旅行目的地，你的选择将直接改变他的行程，并收获他的独家旅行报告。',
        example: '比如：让@大曹不去南极，改道去撒哈拉沙漠！'
    },
    {
        id: 'mystery',
        icon: '🕵️',
        title: '神秘项目解锁',
        description: '像追剧一样追一个真实项目！初期信息极少，随着支持人数增加，一步步解锁新章节：项目计划、现场照片、幕后花絮...',
        example: '比如：一个"在清迈开咖啡馆"的真人实验，你是第一批知情者'
    },
    {
        id: 'dream',
        icon: '🎯',
        title: '梦想赞助人',
        description: '为你欣赏的岛民梦想添砖加瓦！支持TA完成一次骑行环岛、一次艺术创作，你的名字将出现在感谢名单里，共同见证梦想成真。',
        example: '比如：支持程序员@阿乐去南极写代码，收获他从南极寄来的明信片'
    }
];

// 用户选择状态
let userSelections = {
    nickname: '',
    play: [], // 最多选择2个
    host: null  // 只能选择1个
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    renderActivities();
    setupEventListeners();
});

// 渲染活动卡片
function renderActivities() {
    const playContainer = document.getElementById('play-activities');
    const hostContainer = document.getElementById('host-activities');
    
    playContainer.innerHTML = '';
    hostContainer.innerHTML = '';
    
    activities.forEach(activity => {
        // 第一轮：想玩的活动（可多选）
        const playCard = createActivityCard(activity, 'play');
        playContainer.appendChild(playCard);
        
        // 第二轮：想发起的活动（单选）
        const hostCard = createActivityCard(activity, 'host');
        hostContainer.appendChild(hostCard);
    });
    
    updateSelectionDisplay();
}

// 创建活动卡片
function createActivityCard(activity, type) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.dataset.id = activity.id;
    card.dataset.type = type;
    
    card.innerHTML = `
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
        <div class="activity-example">${activity.example}</div>
    `;
    
    return card;
}

// 设置事件监听器
function setupEventListeners() {
    // 活动卡片点击事件
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.activity-card');
        if (card) {
            handleActivityClick(card);
        }
    });
    
    // 表单提交事件
    const form = document.getElementById('participation-form');
    form.addEventListener('submit', handleFormSubmit);
    
    // 昵称输入事件
    const nicknameInput = document.getElementById('nickname');
    nicknameInput.addEventListener('input', function(e) {
        userSelections.nickname = e.target.value.trim();
        updateSubmitButton();
    });
}

// 处理活动卡片点击
function handleActivityClick(card) {
    const activityId = card.dataset.id;
    const type = card.dataset.type;
    const activity = activities.find(a => a.id === activityId);
    
    if (type === 'play') {
        // 第一轮：想玩的活动（最多选2个）
        const index = userSelections.play.indexOf(activityId);
        if (index > -1) {
            // 取消选择
            userSelections.play.splice(index, 1);
            card.classList.remove('selected');
        } else {
            // 选择
            if (userSelections.play.length < 2) {
                userSelections.play.push(activityId);
                card.classList.add('selected');
            } else {
                showMessage('第一轮最多只能选择2个活动哦！', 'warning');
            }
        }
    } else if (type === 'host') {
        // 第二轮：想发起的活动（单选）
        const hostCards = document.querySelectorAll('.activity-card[data-type="host"]');
        hostCards.forEach(c => c.classList.remove('selected'));
        
        if (userSelections.host === activityId) {
            // 取消选择
            userSelections.host = null;
        } else {
            // 选择
            userSelections.host = activityId;
            card.classList.add('selected');
        }
    }
    
    updateSelectionDisplay();
    updateSubmitButton();
}

// 更新选择显示
function updateSelectionDisplay() {
    const playContainer = document.getElementById('selected-play');
    const hostContainer = document.getElementById('selected-host');
    
    // 更新想玩的活动显示
    playContainer.innerHTML = '';
    userSelections.play.forEach(activityId => {
        const activity = activities.find(a => a.id === activityId);
        if (activity) {
            const selectedItem = document.createElement('span');
            selectedItem.className = 'selected-activity';
            selectedItem.textContent = `${activity.icon} ${activity.title}`;
            playContainer.appendChild(selectedItem);
        }
    });
    
    if (userSelections.play.length === 0) {
        playContainer.innerHTML = '<span style="color: #a0aec0;">请选择1-2个你想玩的活动</span>';
    }
    
    // 更新想发起的活动显示
    hostContainer.innerHTML = '';
    if (userSelections.host) {
        const activity = activities.find(a => a.id === userSelections.host);
        if (activity) {
            const selectedItem = document.createElement('span');
            selectedItem.className = 'selected-activity';
            selectedItem.textContent = `${activity.icon} ${activity.title}`;
            hostContainer.appendChild(selectedItem);
        }
    } else {
        hostContainer.innerHTML = '<span style="color: #a0aec0;">请选择1个你最想发起的活动</span>';
    }
}

// 更新提交按钮状态
function updateSubmitButton() {
    const submitBtn = document.querySelector('.submit-btn');
    const isValid = userSelections.nickname && 
                   userSelections.play.length > 0 && 
                   userSelections.play.length <= 2 && 
                   userSelections.host;
    
    submitBtn.disabled = !isValid;
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateSelections()) {
        return;
    }
    
    // 设置隐藏字段的值
    document.getElementById('play-activities-input').value = userSelections.play.join(',');
    document.getElementById('host-activity-input').value = userSelections.host;
    
    // 显示提交动画
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 实际提交表单（Netlify Forms会自动处理）
    const form = document.getElementById('participation-form');
    
    // 使用Fetch API提交表单数据
    const formData = new FormData(form);
    
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    }).then(() => {
        // 提交成功后显示结果
        showResults();
        submitBtn.textContent = '提交成功！';
    }).catch(error => {
        console.error('提交失败:', error);
        showMessage('提交失败，请稍后重试', 'error');
        submitBtn.textContent = '提交我的选择';
        submitBtn.disabled = false;
    });
}

// 验证选择
function validateSelections() {
    if (!userSelections.nickname) {
        showMessage('请输入你的昵称！', 'error');
        return false;
    }
    
    if (userSelections.play.length === 0) {
        showMessage('请至少选择1个你想玩的活动！', 'error');
        return false;
    }
    
    if (userSelections.play.length > 2) {
        showMessage('第一轮最多只能选择2个活动！', 'error');
        return false;
    }
    
    if (!userSelections.host) {
        showMessage('请选择1个你最想发起的活动！', 'error');
        return false;
    }
    
    return true;
}

// 显示结果
function showResults() {
    const formSection = document.querySelector('.section:last-of-type');
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    // 隐藏表单，显示结果
    formSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // 构建结果内容
    const playActivities = userSelections.play.map(id => 
        activities.find(a => a.id === id)
    );
    const hostActivity = activities.find(a => a.id === userSelections.host);
    
    resultsContent.innerHTML = `
        <div class="result-item fade-in">
            <h3>👋 感谢 ${userSelections.nickname} 的参与！</h3>
            <p>你的选择已经成功提交，将直接影响游牧岛下一批活动的开发方向！</p>
        </div>
        
        <div class="result-item fade-in" style="animation-delay: 0.2s">
            <h3>🎮 你想玩的活动：</h3>
            ${playActivities.map(activity => `
                <div style="margin: 10px 0; padding: 15px; background: #f7fafc; border-radius: 8px;">
                    <strong>${activity.icon} ${activity.title}</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${activity.description}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="result-item fade-in" style="animation-delay: 0.4s">
            <h3>🚀 你想发起的活动：</h3>
            <div style="margin: 10px 0; padding: 15px; background: #f7fafc; border-radius: 8px;">
                <strong>${hostActivity.icon} ${hostActivity.title}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${hostActivity.description}</p>
            </div>
        </div>
        
        <div class="result-item fade-in" style="animation-delay: 0.6s">
            <h3>✨ 共创的力量</h3>
            <p>你的每一个选择都在为游牧岛社区添砖加瓦。让我们一起期待这些精彩活动的诞生！</p>
            <p style="margin-top: 10px; font-weight: bold; color: #667eea;">
                记得关注游牧岛小程序，你的创意可能很快就会上线！
            </p>
        </div>
        
        <button onclick="resetForm()" class="submit-btn" style="margin-top: 20px;">
            重新选择
        </button>
    `;
    
    // 滚动到结果区域
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// 重置表单
function resetForm() {
    userSelections = {
        nickname: '',
        play: [],
        host: null
    };
    
    document.getElementById('nickname').value = '';
    
    // 重置所有卡片选择状态
    document.querySelectorAll('.activity-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 显示表单，隐藏结果
    document.querySelector('.section:last-of-type').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
    
    updateSelectionDisplay();
    updateSubmitButton();
}

// 显示消息
function showMessage(message, type) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'error' ? 'background: #e53e3e;' : 'background: #ed8936;'}
    `;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // 显示动画
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // ESC键重置表单
    if (e.key === 'Escape') {
        resetForm();
    }
    
    // 数字键快速选择活动（1-5对应5个活动）
    if (e.key >= '1' && e.key <= '5' && e.ctrlKey) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < activities.length) {
            const activityId = activities[index].id;
            const playCard = document.querySelector(`.activity-card[data-id="${activityId}"][data-type="play"]`);
            if (playCard) {
                handleActivityClick(playCard);
            }
        }
    }
});