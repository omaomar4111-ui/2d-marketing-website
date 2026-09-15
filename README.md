# 2D Marketing Agency — موقع الوكالة الرسمي

موقع تسويق ونمو كامل مبني بـ **HTML5 / CSS3 / Vanilla JavaScript** بدون أي Build Tools أو Node Dependencies معقدة، جاهز للنشر المباشر والسريع على **GitHub Pages** مع دعم الدومين المخصص.

---

## 🌟 مميزات المشروع

- **عامية مصرية احترافية ومباشرة**: كل النصوص مصممة لخطاب رجال الأعمال وأصحاب الشركات في مصر.
- **بدون أدوات بناء (No Build Tools)**: يعمل فوراً بمجرد فتح أي ملف أو رفعه على أي استضافة ثابتة (Static Hosting).
- **تصميم فائق الأناقة (Dark Mode High-Conversion UI)**:
  - تناسق كامل في الألوان والظلال والكروم والخلفيات المتدرجة
  - جسيمات تفاعلية في الخلفية (Canvas Particles) ومؤشر ماوس مخصص (Custom Cursor)
  - شريط قراءة تفاعلي وتأثيرات ظهور ذكية (Scroll Reveal & GSAP fallback)
  - روبوت محادثة تفاعلي لحجز المواعيد وتوليد الـ Leads وتخزينها محلياً وفورياً
  - حاسبة تفاعلية للـ ROI تترجم الحسابات مباشرة لرسالة واتساب مجهزة
- **SEO & PWA جاهز**:
  - Structured Data (Schema.org) للأنشطة والخدمات
  - Sitemap.xml و Robots.txt محدثين بالكامل
  - OpenGraph و Twitter Cards لمشاركة احترافية على منصات التواصل
  - Web App Manifest مدمج
- **نظام إعلانات مرن (JSON-Driven Ad Slots)**: إمكانية تشغيل وإيقاف البنرات والعروض عبر ملف `ads.json` بدون لمس كود الـ HTML.
- **نظام بحث فوري (Ctrl + K Search Modal)**: تصفح والبحث السريع داخل صفحات الموقع.

---

## 📁 هيكل المجلدات

```text
2d-marketing-website/
├── index.html                  # الصفحة الرئيسية مع الحاسبة والروبوت
├── about.html                  # إحنا مين وقواعد العمل والمبادئ
├── contact.html                # نموذج التواصل المباشر ومعلومات الاتصال
├── 404.html                    # صفحة الخطأ 404 المخصصة
├── CNAME                       # ربط الدومين المخصص (2dmarketing.agency)
├── robots.txt                  # تعليمات محركات البحث
├── sitemap.xml                 # خريطة الموقع لمحركات البحث
├── ads.json                    # بيانات البنرات الإعلانية التفاعلية
├── manifest.webmanifest        # ملف تطبيق الويب التقدمي (PWA)
├── README.md                   # دليل الاستخدام والتشغيل
├── css/
│   ├── main.css                # نظام التصميم الرئيسي والمتغيرات
│   └── pages.css               # أنماط الصفحات الفرعية والبطاقات
├── js/
│   ├── main.js                 # المحرك التفاعلي، التتبع، والفورم
│   ├── ads.js                  # محرك جلب وعرض الإعلانات
│   └── search.js               # محرك البحث الفوري (Ctrl+K)
├── services/
│   ├── index.html              # بوابة الخدمات والقطاعات
│   ├── clinics.html            # صفحة تسويق العيادات والمراكز الطبية
│   ├── gyms.html               # صفحة تسويق الجيمات والمراكز الرياضية
│   ├── real-estate.html        # صفحة تسويق العقارات والبروكرز
│   └── ecommerce.html          # صفحة تسويق المتاجر الإلكترونية D2C
└── blog/
    └── index.html              # المدونة ومقالات معمل أفكار النمو
```

---

## 🚀 طريقة النشر على GitHub Pages

1. أنشئ مستودعاً جديداً (Repository) على GitHub باسم:
   ```text
   2d-marketing-website
   ```
2. ارفع جميع الملفات من هذا المجلد إلى الفرع الرئيسي (`main`).
3. من لوحة تحكم المستودع على GitHub:
   - اذهب إلى **Settings**
   - اختر **Pages** من القائمة الجانبية
   - في قسم **Build and deployment**:
     - المصدر: **Deploy from a branch**
     - الفرع: **main** والمجلد: **/ (root)**
     - اضغط **Save**
4. لتفعيل الدومين المخصص (`2dmarketing.agency`):
   - في خانة **Custom domain** اكتب: `2dmarketing.agency` واضغط **Save**
   - فعّل خيار **Enforce HTTPS** بعد تفعيل شهادة الأمان.
5. في إعدادات الـ DNS لدى مزود النطاق الخاص بك (Cloudflare, Namecheap, GoDaddy):
   - أضف سجلات `A` لـ GitHub Pages:
     ```text
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - وأضف سجل `CNAME` لاسم النطاق الفرعي:
     ```text
     www -> YOUR_GITHUB_USERNAME.github.io
     ```

---

## 📞 بيانات التواصل الرسمية في الموقع

- **رقم الهاتف**: `+20 114 482 6641`
- **رابط واتساب المباشر**: [https://wa.me/201144826641](https://wa.me/201144826641)
- **البريد الإلكتروني**: `hello@2dmarketing.agency`
- **الموقع الإلكتروني**: [https://2dmarketing.agency](https://2dmarketing.agency)

---
© 2026 2D Marketing Agency. كل الحقوق محفوظة.
