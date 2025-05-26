const calculate = require('./calculate');
const advancedCalculate = require('./advancedCalculate');

module.exports = async (req, res) => {
  try {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'الطريقة غير مسموح بها، استخدم POST' });
    }

    // تحليل البيانات من الطلب
    const data = req.body;
    console.log('البيانات المستلمة في /api/process:', data);

    // التحقق من صلاحية البيانات
    if (!data || typeof data !== 'object') {
      throw new Error('البيانات المستلمة غير صالحة');
    }

    // معالجة البيانات
    const hasMap = data.hasMap || false;
    console.log('hasMap:', hasMap);
    const result = hasMap ? advancedCalculate.processAdvanced(data) : calculate.processBasic(data);

    // إرجاع النتيجة
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('خطأ في process.js:', error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
};
