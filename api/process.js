const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

module.exports = async (req, res) => {
  try {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(405).json({ success: false, error: 'الطريقة غير مسموح بها، استخدم POST' });
    }

    // تحليل البيانات من الطلب
    const data = req.body;
    console.log('📥 **البيانات المستلمة في /api/process**:', JSON.stringify(data, null, 2));

    // التحقق من صلاحية البيانات
    if (!data || typeof data !== 'object') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(400).json({ success: false, error: 'البيانات المستلمة غير صالحة' });
    }

    // معالجة البيانات بناءً على hasMap
    const hasMap = data.hasMap || false;
    console.log('🔍 **hasMap**:', hasMap);
    const result = await (hasMap ? advancedCalculate.processAdvanced(data) : calculate.processBasic(data));

    // التحقق من نجاح المعالجة
    if (!result.success || !result.pdfData) {
      console.error('❌ **فشل معالجة البيانات**:', result.message || 'pdfData غير موجود');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(400).json({ success: false, error: result.message || 'فشل معالجة البيانات' });
    }

    // تسجيل النتيجة قبل إرجاعها
    console.log('📤 **النتيجة المُرجعة**:', JSON.stringify({ success: true, pdfData: result.pdfData }, null, 2));

    // إرجاع الاستجابة الموحدة
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ success: true, pdfData: result.pdfData });
  } catch (error) {
    console.error('❌ **خطأ في process.js**:', error.stack);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(500).json({ success: false, error: error.message || 'خطأ داخلي في الخادم' });
  }
};
