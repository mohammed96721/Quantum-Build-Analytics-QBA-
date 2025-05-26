function processBasic(data) {
  console.log('معالجة في calculate.js:', data); // تسجيل
  return {
    message: 'معالجة تقريبية من calculate.js',
    inputData: data,
    totalCost: 0
  };
}

module.exports = { processBasic };
