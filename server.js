const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// 🔥 关键中间件！
// 这行代码必须加，否则服务器看不懂表单提交上来的数据
// 它就像个“翻译官”，把数据解析到 req.body 里
app.use(express.urlencoded({ extended: true }));

// 💾 内存数据库
// 我们用一个简单的数组来存留言。注意：重启服务器后数据会消失哦！
// 格式：[ { name: 'Tom', text: 'Hello', time: '...' }, ... ]
const messageBoard = [];

// 1️⃣ 首页路由 (GET) - 展示留言
app.get('/', (req, res) => {
    // 把 messageBoard 数组传给 EJS，名字叫 messages
    // .reverse() 是为了让最新的留言显示在最上面
    res.render('index', { messages: messageBoard });
});

// 2️⃣ 提交路由 (POST) - 处理留言
app.post('/submit', (req, res) => {
    // req.body 里就是用户填的内容
    console.log("收到新留言:", req.body);

    const newMsg = {
        name: req.body.username,
        text: req.body.message,
        time: new Date().toLocaleString() // 获取当前时间
    };

    // 把新留言塞进数组里
    messageBoard.unshift(newMsg); // unshift 放在数组最前面

    // 🔄 这是一个经典动作：Post-Redirect-Get (PRG模式)
    // 处理完数据后，不要直接渲染，而是让浏览器“重定向”回首页
    // 这样用户刷新页面时，不会重复提交表单
    res.redirect('/');
});

// 🔥 更好的写法（推荐）：
// 优先使用环境变量里的 PORT，如果没有（比如在本地），才用 8080
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
});


