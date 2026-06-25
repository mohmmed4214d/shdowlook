const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// 🗂️ مصفوفة مؤقتة لتخزين الأعضاء (عشان يشتغل على كمبيوترك الحين بدون أخطاء شبكة)
let users = [];

// 1️⃣ رابط إنشاء حساب جديد وتوليد الكود التلقائي
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "اكتب الاسم والباسورد!" });

    // التأكد من عدم تكرار الاسم
    const existingUser = users.find(u => u.username === username);
    if (existingUser) return res.status(400).json({ error: "اسم المستخدم مأخوذ بالفعل!" });

    // توليد كود عشوائي مميز لكل شخص
    const randomCode = "User-" + Math.floor(1000 + Math.random() * 900000000000000000);

    // حفظ العضو الجديد برتبة مستخدم عادية
    users.push({ username, password, userCode: randomCode, role: "User" });

    res.json({ message: "تم إنشاء الحساب بنجاح! 🎉", userCode: randomCode });
});

// 2️⃣ رابط تسجيل الدخول المباشر بالكود (بدون توكن)
app.post('/login-by-code', (req, res) => {
    const { userCode } = req.body;

    // 👑 كود المدير العام الثابت
    if (userCode === "mody-master-777") {
        return res.json({ 
            message: "أهلاً بك يا مودي (المدير العام) 👑", 
            role: "Admin", 
            username: "مودي" 
        });
    }

    // البحث عن المستخدم بالكود حقه
    const user = users.find(u => u.userCode === userCode);
    if (!user) return res.status(401).json({ error: "الكود المميز غير صحيح أو غير موجود! ❌" });

    // إرسال بيانات الشخص مباشرة للمتصفح
    res.json({ 
        message: `أهلاً بك يا ${user.username} 👋`, 
        role: user.role, 
        username: user.username 
    });
});

// 3️⃣ رابط جلب قائمة جميع المسجلين (خاص بالأدمن)
app.get('/admin/users', (req, res) => {
    res.json(users);
});

// 4️⃣ رابط تعديل الصلاحيات والرتب من لوحة التحكم
app.post('/admin/update-role', (req, res) => {
    const { userCode, newRole } = req.body;
    const user = users.find(u => u.userCode === userCode);
    
    if (user) {
        user.role = newRole;
        return res.json({ message: "تم تحديث الرتبة بنجاح! ⚡" });
    }
    res.status(404).json({ error: "المستخدم غير موجود" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`السيرفر شغال محلياً على المنفذ ${PORT} 👑`));