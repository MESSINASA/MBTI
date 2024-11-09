const questions = [
    { text: '在社交场合，我通常是：', options: { E: '很快就能融入群体，认识新朋友', I: '更愿意和少数几个亲密的朋友交谈' } },
    { text: '当我有空闲时间时，我更喜欢：', options: { E: '参加活动或聚会', I: '独处，做一些个人感兴趣的活动' } },
    { text: '我更倾向于：', options: { E: '在人群中获得能量', I: '从独处中恢复精力' } },
    { text: '当面对问题时，我更倾向于：', options: { E: '和别人讨论，集思广益', I: '自己思考，寻找解决方案' } },
    { text: '当我做决定时，我更依赖：', options: { S: '实际经验和具体的信息', N: '想象和直觉' } },
    { text: '对于未来，我更喜欢：', options: { S: '基于现有的信息做规划', N: '探索可能性和创新' } },
    { text: '我更容易被吸引的是：', options: { S: '实际应用和具体结果', N: '抽象的概念和理论' } },
    { text: '在解决问题时，我更倾向于：', options: { S: '依靠已知的事实和数据', N: '依靠直觉和灵感' } },
    { text: '当我做决定时，我更看重：', options: { T: '逻辑和原则', F: '个人价值观和对他人的影响' } },
    { text: '在处理冲突时，我更倾向于：', options: { T: '就事论事，追求公平', F: '考虑情感，寻求和谐' } },
    { text: '我更喜欢与这样的人共事：', options: { T: '具有逻辑性和分析能力', F: '具有同情心和理解力' } },
    { text: '当给予反馈时，我更倾向于：', options: { T: '提供直接和具体的建议', F: '表达鼓励和支持' } },
    { text: '在日常生活中，我更倾向于：', options: { J: '制定计划，按部就班', P: '随性而为，灵活应对' } },
    { text: '当面临截止日期时，我更倾向于：', options: { J: '提前完成任务', P: '靠近截止日期时才开始着手' } },
    { text: '在处理任务时，我更倾向于：', options: { J: '完成一项再开始下一项', P: '同时处理多项任务' } },
    { text: '对于新环境，我更喜欢：', options: { J: '有明确的目标和预期', P: '开放地探索未知' } }
];

let currentQuestionIndex = 0;
const formData = new Map();

function showQuestion(index) {
    const questionContainer = document.getElementById('questionContainer');
    const question = questions[index];
    questionContainer.innerHTML = `
        <p>${question.text}</p>
        ${Object.entries(question.options).map(([value, text]) => `
            <label><input type="radio" name="q${index + 1}" value="${value}"> ${text}</label>
        `).join('')}
    `;
    setTimeout(() => {
        questionContainer.classList.add('show');
    }, 10);
}

document.getElementById('nextButton').addEventListener('click', function() {
    const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex + 1}"]:checked`);
    if (!selectedOption) {
        alert('请选择一个选项。');
        return;
    }

    formData.set(`q${currentQuestionIndex + 1}`, selectedOption.value);

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        const questionContainer = document.getElementById('questionContainer');
        questionContainer.classList.remove('show');
        setTimeout(() => {
            showQuestion(currentQuestionIndex);
        }, 300);
    } else {
        showLoadingAndCalculateResult();
    }
});

document.getElementById('retryButton').addEventListener('click', function() {
    location.reload(); // 重新加载页面以重新开始测试
});

function showLoadingAndCalculateResult() {
    document.getElementById('mbtiForm').style.display = 'none';
    document.getElementById('title').style.display = 'none'; // 隐藏标题
    const loadingDiv = document.getElementById('loading');
    loadingDiv.innerHTML = '<div class="spinner"></div>';
    loadingDiv.style.display = 'flex';

    setTimeout(() => {
        loadingDiv.style.display = 'none';
        calculateResult();
    }, 2000); // 模拟加载时间
}

function typeWriterEffect(element, text, speed = 50, callback) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); // 在打字机效果完成后调用回调函数
        }
    }
    type();
}

function calculateResult() {
    let result = '';

    const eCount = ['q1', 'q2', 'q3', 'q4'].filter(q => formData.get(q) === 'E').length;
    const iCount = 4 - eCount;
    result += eCount > iCount ? 'E' : 'I';

    const sCount = ['q5', 'q6', 'q7', 'q8'].filter(q => formData.get(q) === 'S').length;
    const nCount = 4 - sCount;
    result += sCount > nCount ? 'S' : 'N';

    const tCount = ['q9', 'q10', 'q11', 'q12'].filter(q => formData.get(q) === 'T').length;
    const fCount = 4 - tCount;
    result += tCount > fCount ? 'T' : 'F';

    const jCount = ['q13', 'q14', 'q15', 'q16'].filter(q => formData.get(q) === 'J').length;
    const pCount = 4 - jCount;
    result += jCount > pCount ? 'J' : 'P';

    const descriptions = {
        'ISTJ': '实际且稳重，他们是有责任感和可靠的人。他们遵循传统和既定的规则，注重细节，善于管理资源和组织事务。ISTJ倾向于认真对待承诺，是值得信赖的伙伴和员工。',
        'ISFJ': '温暖且忠诚，ISFJ总是准备保护他们所爱的人。他们非常细心，喜欢照顾他人，能够在日常生活中发现美的事物。ISFJ通常在家庭和工作中都表现出极高的责任感。',
        'INFJ': '安静而神秘，INFJ是鼓舞人心且不知疲倦的理想主义者。他们具有深刻的洞察力，为自己的信念不懈奋斗，希望为社会带来积极的变化。INFJ善于理解和激发他人的潜力。',
        'INTJ': '富有想象力和战略能力，INTJ是一切皆在计划之中的策略家。他们独立、自信，喜欢掌控自己的命运，追求知识和个人成长。INTJ通常对未来有清晰的愿景，并且努力将其变为现实。',
        'ISTP': '大胆且实际的操作者，ISTP擅长使用各种工具解决实际问题。他们喜欢动手实践，对机械和技术有浓厚的兴趣，能够在压力下保持冷静。ISTP享受探索和尝试新事物的过程。',
        'ISFP': '灵活且有魅力的艺术家，ISFP随时准备探索体验新鲜事物。他们对美有着独特的感知，喜欢通过艺术表达自己，同时也非常重视个人自由和人际关系的和谐。',
        'INFP': '诗意且善良的利他主义者，INFP总是热情地提供帮助。他们内心充满热情，追求个人价值和社会正义，希望用自己的方式让世界变得更美好。INFP擅长倾听和理解他人的情感需求。',
        'INTP': '具有创造力的思想家，INTP对知识有着止不住的渴望。他们喜欢思考复杂的问题，寻找逻辑上的完美解决方案。INTP通常在科学、数学和技术领域表现出色，因为他们能够看到事物的本质。',
        'ESTP': '聪明且精力充沛，ESTP善于感知并抓住机会。他们喜欢冒险，追求即时满足，能够在短时间内做出决策。ESTP通常在销售、体育和创业等领域表现出色，因为这些领域需要快速反应和灵活应对。',
        'ESFP': '自发且动人的表演者，ESFP生活在他们的周围永不无聊。他们热爱生活，喜欢成为焦点，享受与他人分享快乐的时刻。ESFP通常在艺术、娱乐和医疗保健等行业中找到自己的位置。',
        'ENFP': '热情且有创造力的自由人，ENFP总能找到理由微笑。他们喜欢与人建立深层次的联系，善于激励和鼓舞他人。ENFP通常在教育、咨询和创意产业中表现出色，因为他们能够激发他人的潜能。',
        'ENTP': '聪明好奇的发明者，ENTP不会放弃任何智力上的挑战。他们喜欢挑战现状，提出新的观点和解决方案。ENTP通常在科学研究、技术开发和战略规划等领域表现出色，因为他们能够看到事物的不同方面。',
        'ESTJ': '出色的管理者，ESTJ在管理具体事务和人员方面无与伦比。他们诚实、爱奉献，有尊严，他们的明确建议和指导被人看重。ESTJ通常在政府、商业和军事组织中担任领导角色。',
        'ESFJ': '极有同情心，爱交往、受欢迎，ESFJ总是热心提供帮助。他们喜欢助人为乐，享受做有意义的事情，只要他们的重要性被认可并受到感激。ESFJ通常在教育、医疗和社会服务行业中表现出色，因为他们善于与人建立良好的关系。',
        'ENFJ': '富有魅力且鼓舞人心的领导者，ENFJ有使听众着迷的能力。他们天生的领导者，充满激情，魅力四射，喜欢帮助、启发他人取得成就并造福整个世界。ENFJ通常在教育、咨询和宗教领域中找到自己的使命。',
        'ENTJ': '大胆、富有想象力且意志强大的领导者，ENTJ总能创建解决问题的方法。他们天生的领导者，具有魅力和信心，能够召集大家为着一个共同目标努力。ENTJ通常在企业、政治和军事组织中担任高级管理职位。'
    };

    const resultDiv = document.getElementById('result');
    const description = `您的 MBTI 类型：${result}\n${descriptions[result] || '未找到对应的人格描述。'}`;
    resultDiv.innerHTML = ''; // 清空内容以便打字机效果
    typeWriterEffect(resultDiv, description, 50, () => {
        document.getElementById('retryButton').style.display = 'block'; // 显示“再次测试”按钮
    });
}

// 初始化显示第一个问题
showQuestion(currentQuestionIndex); 