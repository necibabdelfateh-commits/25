import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: AI Security & Electrical Consultant Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!ai) {
      return res.status(500).json({ 
        error: "مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في الإعدادات." 
      });
    }

    const systemInstruction = `أنت مساعد تقني خبير ومستشار هندسي لشركة Safe Tech في الجزائر، متخصص في كاميرات المراقبة (CCTV)، أنظمة الإنذار ضد السرقة والحريق، والكهرباء المنزلية والصناعية والإنارة الذكية وفقاً للقوانين والمعايير التقنية المعمول بها في الجزائر.
تتحدث باللغة العربية بأسلوب مهني ومبسط يناسب كلاً من الفنيين والزبائن في الجزائر.
مهمتك:
1. تقديم نصائح دقيقة حول اختيار أنواع الكاميرات وحساب التخزين والتركيب، مع مراعاة القوانين الجزائرية:
   - ضرورة الحصول على الترخيص المسبق (الرخصة الولائية) للمحلات التجارية والمؤسسات العمومية والخاصة طبقاً للمرسوم التنفيذي رقم 15-249 الذي يحدد شروط وكيفيات تركيب منظومات المراقبة بواسطة الكاميرات.
   - احترام خصوصية الجيران والطريق العام طبقاً للقانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، وقانون العقوبات الجزائري (يُمنع توجيه الكاميرات لبيوت الجيران أو تصوير المارة في الطريق العام دون رخصة).
2. تخطيط أنظمة الإنذار ومطابقتها لاشتراطات مصالح الحماية المدنية الجزائرية (Protection Civile) خاصة للمستودعات، المصانع، والمحلات التجارية الكبرى.
3. الإجابة على استفسارات الكهرباء المنزلية وفق معايير شركة سونلغاز (Sonelgaz) والتوتر المعمول به في الجزائر (220 فولت أحادي الطور / 380 فولت ثلاثي الطور بتردد 50 هرتز)، واستخدام قواطع التوزيع المناسبة (Schneider, Legrand, Hager) وكابلات نحاسية معتمدة محلياً مثل ENICAB.
4. حل مشاكل التركيب والأعطال الشائعة بأسلوب هندسي دقيق ومنظم باستخدام نقاط وتنسيق مريح للقراءة.`;

    // Construct contents with system instruction and history
    // For simplicity with generateContent:
    const formattedPrompt = `التعليمات الخاصة بك: ${systemInstruction}\n\nسياق المحادثة السابقة:\n${
      (history || []).map((h: any) => `${h.role === 'user' ? 'الزبون' : 'المساعد'}: ${h.text}`).join('\n')
    }\n\nالزبون: ${message}\nالمساعد:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedPrompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء معالجة طلبك." });
  }
});

// 2. API: Generate custom technical recommendations for an installation estimate
app.post("/api/generate-recommendation", async (req, res) => {
  try {
    const { 
      propertyType, 
      rooms, 
      floors,
      needsCameras, 
      cameraCount, 
      cameraLocation, 
      needsAlarms, 
      alarmSpecs, 
      needsElectricity, 
      electricitySpecs, 
      priority 
    } = req.body;

    if (!ai) {
      return res.status(500).json({ 
        error: "مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في الإعدادات." 
      });
    }

    const prompt = `بصفتك مهندس أنظمة حماية وكهرباء خبير، قم بإنشاء تقرير فني وتوصيات مخصصة لزبون يريد تركيب أنظمة في عقاره بالتفاصيل التالية:
- نوع العقار: ${propertyType}
- عدد الغرف/المساحات: ${rooms}
- عدد الطوابق: ${floors}
- نظام الكاميرات المطلوبة: ${needsCameras ? `نعم (${cameraCount} كاميرات، الأماكن المفضلة: ${cameraLocation.join(', ')})` : 'لا'}
- نظام الإنذار المطلوب: ${needsAlarms ? `نعم (التفاصيل المفضلة: ${alarmSpecs.join(', ')})` : 'لا'}
- الأعمال الكهربائية المطلوبة: ${needsElectricity ? `نعم (التفاصيل المفضلة: ${electricitySpecs.join(', ')})` : 'لا'}
- الأولوية للزبون: ${priority === 'quality' ? 'الجودة العالية والمواصفات المتقدمة' : priority === 'budget' ? 'أفضل تكلفة اقتصادية مناسبة الميزانية' : 'التوازن بين الجودة والسعر'}

يرجى توليد تقرير فني واحترافي مقسم كالتالي:
1. 📋 **نظرة عامة على المشروع وتخطيط النظام المقترح** (وصف عام لتوزيع الأنظمة وملاءمتها للمبنى).
2. 📹 **توصيات الكاميرات ومواقعها** (إذا تم تحديدها: دقة الكاميرا المقترحة، نوع التخزين NVR/DVR، ومواقع توزيع الكاميرات المقترحة بدقة لتغطية كاملة).
3. 🚨 **مخطط مستشعرات الإنذار** (إذا تم تحديدها: أماكن مستشعرات الحركة والكسر والدخان المقترحة لتوفير أمان تام).
4. ⚡ **توصيات الكهرباء والإنارة الحديثة** (إذا تم تحديدها: مواصفات الكابلات المقترحة، لوحات التوزيع وقواطع الحماية، ونصائح التأسيس).
5. 🛠️ **نصائح فنية للسلامة والتنفيذ** (ملاحظات أمان كهربائية هامة، وحماية الأنظمة من العوامل الجوية والكهرباء الزائدة).
6. 🛒 **قائمة تقريبية للمواد الأساسية المطلوبة**.

اجعل النبرة محترفة، مشجعة، وواضحة جداً باللغة العربية، واستخدم علامات الماركدوان (Markdown) للتنسيق.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Recommendation API Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء توليد التوصيات الفنية." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve build directory in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
