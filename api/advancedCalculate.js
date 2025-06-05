/**
 * @file advancedCalculate.js
 * @desc معالجة بيانات النموذج من process.js وحساب التكاليف والتحليل الإنشائي مع تفاصيل هندسية دقيقة.
 * @version 1.6.2
 * @remarks
 * - يعالج الكود بيانات التصميم الهندسي (خرسانة، طابوق، أساس، تكاليف) بناءً على المعايير العراقية لعام 2025.
 * - الحسابات مرتبة حسب التسلسل الهندسي: كميات، وزن المنشأ، أساس، تكاليف.
 * - يعتمد على مساحات الشبابيك المُرسلة (facadeWindowsDoorsArea, skylightWindowsDoorsArea) بدلاً من أبعاد افتراضية.
 * - يحتوي على شروحات مفصلة لكل قسم وخطوة حسابية.
 * - تم تحديث الكود لإزالة التحققات (تُجرى في process.js) وإضافة حقول جديدة (سمك السقف، Waffle Slab، thermstone).
 * - تم إزالة حقول otherBrickInfo وliveLoadPerM2 وexcavationDepth لتتوافق مع نموذج HTML المحدث.
 * - تم تصحيح حسابات الجص، الأرضيات، المناور، وزن المنشأ، والشتايكر.
 * - تم إضافة حساب إطارات الشبابيك والأبواب للجص.
 * - تم تحسين تصنيف الأساس وإضافة سمك الحفر الإضافي (0.3 م).
 */

/**
 * @function getMaterialPrices
 * @desc إرجاع أسعار المواد والعمالة بالدينار العراقي بناءً على السوق العراقي (2025).
 * @returns {Object} - كائن يحتوي على أسعار المواد والعمالة مع تعريف كل حقل.
 * @remarks
 * - الأسعار مُحدثة لعام 2025 بناءً على السوق العراقي.
 * - تشمل المواد (خرسانة، حديد، طابوق) والعمالة (جص، نجارة، سباكة).
 * - تم إضافة سعر thermstone وإزالة brickCustomPerM3.
 */
function getMaterialPrices() {
  return {
    concreteC30PerM3: 80000, // خرسانة C30: 80000 دينار/م³
    concreteC40PerM3: 98000, // خرسانة C40: 98000 دينار/م³
    steelPerTon: 1500000, // حديد التسليح: 1,500,000 دينار/طن
    cementOrdinaryPerTon: 120000, // إسمنت عادي: 120,000 دينار/طن
    sandPerM3: 25000, // رمل: 25,000 دينار/م³
    gravelBasePerM3: 30000, // حصى الأساس: 30,000 دينار/م³
    sandBasePerM3: 25000, // رمل الأساس: 25,000 دينار/م³
    brickYellowPerDbl: 600000, // دبل طابوق أصفر (4000 طابوقة): 600,000 دينار
    brickRedPerDbl: 1250000, // دبل طابوق أحمر: 1,250,000 دينار
    brickThermostonePerThousand: 375000, // ألف طابوقة ثرمستون: 375,000 دينار
    gypsumPerTon: 75000, // جبس: 75,000 دينار/طن
    limePerTon: 80000, // جير: 80,000 دينار/طن
    plasterLaborPerM2: 7000, // عمالة جص: 7,000 دينار/م²
    plasterCeilingLaborPerM2: 8000, // عمالة جص الأسقف: 8,000 دينار/م²
    primingPerM2: 2000, // تمهيد (طرطشه): 2,000 دينار/م²
    flooringMortarLaborPerM2: 6000, // عمالة مونة الأرضيات: 6,000 دينار/م²
    facadeEconomyPerM2: 20000, // واجهة اقتصادية: 20,000 دينار/م²
    facadeSimplePerM2: 30000, // واجهة بسيطة: 30,000 دينار/م²
    facadeLuxuryPerM2: 50000, // واجهة فاخرة: 50,000 دينار/م²
    facadeLaborPerM2: 15000, // عمالة الواجهة: 15,000 دينار/م²
    externalDoorFixed: 500000, // باب خارجي: 500,000 دينار
    internalDoorFixed: 300000, // باب داخلي: 300,000 دينار
    carGatePerM2: 30000, // بوابة سيارة: 30,000 دينار/م²
    hvacPerM: 25000, // نظام تكييف: 25,000 دينار/م
    poolFixed: 10000000, // مسبح: 10,000,000 دينار
    gardenPerM2: 25000, // حديقة: 25,000 دينار/م²
    fencePerM: 50000, // سياج: 50,000 دينار/م
    elevatorBaseCost: 10000000, // مصعد أساسي: 10,000,000 دينار
    elevatorPerFloorCost: 2500000, // مصعد لكل طابق: 2,500,000 دينار
    excavationPerM3: 5000, // حفر: 5,000 دينار/م³
    truckTransportPerTrip: 90000, // نقل مخلفات: 90,000 دينار/رحلة
    baseLaborPerM2: 3000, // عمالة الأساس: 3,000 دينار/م²
    electricalPointCost: 9000, // نقطة كهربائية: 9,000 دينار
    electricalBoardFixed: 500000, // لوحة كهربائية: 500,000 دينار
    electricalLaborPerPoint: 3000, // عمالة نقطة كهربائية: 3,000 دينار
    plumbingBathroomMaterials: 500000, // مواد سباكة حمام: 500,000 دينار
    plumbingKitchenMaterials: 150000, // مواد سباكة مطبخ: 150,000 دينار
    plumbingOtherMaterials: 100000, // مواد سباكة أخرى: 100,000 دينار
    plumbingBathroomLabor: 1500000, // عمالة سباكة حمام: 1,500,000 دينار
    bathroomFittingsPerSet: 1200000, // تجهيزات حمام: 1,200,000 دينار/مجموعة
    brickLaborPerDbl: 400000, // عمالة طابوق: 400,000 دينار/دبل
    brickLaborPerThousand: 100000, // عمالة طابوق ثرمستون: 100,000 دينار/ألف طابوقة
    brickLaborExtraPerFloor: 50000, // زيادة عمالة طابوق لكل طابق: 50,000 دينار
    carpentryLaborPerM3: {
      plywood: 100000, // عمالة نجارة بليوود: 100,000 دينار/م³
      regular: 120000, // عمالة نجارة عادي: 120,000 دينار/م³
      waffle: 150000 // عمالة نجارة وافل: 150,000 دينار/م³
    },
    steelLaborPerM3: 100000, // عمالة حديد: 100,000 دينار/م³
    skylightsPerM2: 150000, // مناور: 150,000 دينار/م²
    secondaryCeilingsPerM2: 30000, // أسقف ثانوية: 30,000 دينار/م²
    decorativeWallsPerM2: 35000, // جدران زخرفية: 35,000 دينار/م²
    garageCanopyFixed: 1000000, // مظلة مرآب: 1,000,000 دينار
    transportConcretePerM3: 2000, // نقل خرسانة: 2,000 دينار/م³
    transportSteelPerTon: 50000, // نقل حديد: 50,000 دينار/طن
    transportCementPerTon: 3000, // نقل إسمنت: 3,000 دينار/طن
    transportSandPerM3: 1500, // نقل رمل: 1,500 دينار/م³
    transportBricksPerDbl: 40000, // نقل طابوق: 40,000 دينار/دبل
    transportBricksThermostonePerThousand: 10000 // نقل طابوق ثرمستون: 10,000 دينار/ألف طابوقة
  };
}

/**
 * @function getEngineeringConstants
 * @desc إرجاع الثوابت الهندسية بناءً على المعايير العراقية.
 * @returns {Object} - كائن يحتوي على الثوابت الهندسية مع تعليقات توضيحية.
 * @remarks
 * - الثوابت تشمل كثافات المواد، أبعاد الطابوق، ومعاملات التصميم.
 * - تم حذف facadeWindowDimensions وskylightWindowDimensions بناءً على الطلب للاعتماد على مساحات الشبابيك المُرسلة.
 * - تم حذف roofSlabThickness للاعتماد على حقل ceilingThickness من النموذج.
 * - تم إضافة ثوابت لـ thermstone وإزالة brickCustomDensity.
 * - تم إضافة ثوابت لوزن الأبواب، الشبابيك، خزانات الماء، السخانات، والشتايكر.
 */
function getEngineeringConstants() {
  return {
    concreteDensity: 2400, // كثافة الخرسانة: 2400 كجم/م³
    steelDensity: 7850, // كثافة الحديد: 7850 كجم/م³
    brickYellowDensity: 1800, // كثافة طابوق أصفر: 1800 كجم/م³
    brickRedDensity: 2000, // كثافة طابوق أحمر: 2000 كجم/م³
    brickThermostoneDensity: 600, // كثافة طابوق ثرمستون: 600 كجم/م³
    cementOrdinaryDensity: 1440, // كثافة الإسمنت: 1440 كجم/م³
    sandDensity: 1600, // كثافة الرمل: 1600 كجم/م³
    gravelDensity: 1650, // كثافة الحصى: 1650 كجم/م³
    gypsumDensity: 1200, // كثافة الجبس: 1200 كجم/م³
    limeDensity: 1100, // كثافة الجير: 1100 كجم/م³
    flooringDensity: 3000, // كثافة الأرضيات: 3000 كجم/م³
    mortarFloorDensity: 2000, // كثافة مونة الأرضيات: 2000 كجم/م³
    mortarWallsDensity: 1900, // كثافة مونة الجدران: 1900 كجم/م³
    screedDensity: 2000, // كثافة الشتايكر: 2000 كجم/م³ (مونة خفيفة)
    cementPerM2MortarFloor: 0.015, // إسمنت مونة الأرضيات: 0.015 طن/م²
    sandPerM2MortarFloor: 0.03, // رمل مونة الأرضيات: 0.03 م³/م²
    cementPerM2MortarWalls: 0.01, // إسمنت مونة الجدران: 0.01 طن/م²
    sandPerM2MortarWalls: 0.02, // رمل مونة الجدران: 0.02 م³/م²
    mortarFloorThickness: 0.08, // سماكة مونة الأرضيات: 8 سم
    mortarWallsThickness: 0.05, // سماكة مونة الجدران: 5 سم
    screedThickness: 0.06, // سماكة الشتايكر: 6 سم
    gypsumPerM2Plaster: 0.03, // جبس للجص: 0.03 طن/م²
    limePerM2Plaster: 0.01, // جير للجص: 0.01 طن/م²
    plasterThickness: 0.04, // سماكة الجص: 4 سم
    brickYellowDimensions: { width: 0.24, length: 0.115, height: 0.08 }, // أبعاد الطابوق الأصفر: 24×11.5×8 سم
    brickRedDimensions: { width: 0.24, length: 0.115, height: 0.115 }, // أبعاد الطابوق الأحمر: 24×11.5×11.5 سم
    brickThermostoneDimensions: { width: 0.4, length: 0.2, height: 0.2 }, // أبعاد الطابوق الثرمستون: 40×20×20 سم
    brickYellowCompressiveStrength: 5, // قوة ضغط الطابوق الأصفر: 5 ميجا باسكال
    brickRedCompressiveStrength: 7, // قوة ضغط الطابوق الأحمر: 7 ميجا باسكال
    brickThermostoneCompressiveStrength: 3.5, // قوة ضغط الطابوق الثرمستون: 3.5 ميجا باسكال
    bricksPerDbl: 4000, // طابوقات في دبل: 4000
    brickYellowCoveragePerDbl: 11, // دبل طابوق أصفر يغطي: 11 م³
    brickRedCoveragePerDbl: 10.5, // دبل طابوق أحمر يغطي: 10.5 م³
    brickThermostoneMortarHorizontal: 0.01, // مونة أفقية بين صفوف الثرمستون: 1 سم
    brickThermostoneMortarVertical: 0.005, // مونة رأسية بين طابوقات الثرمستون: 0.5 سم
    liveLoadPerM2GroundFloor: 200, // حمل حي للطابق الأرضي: 200 كجم/م²
    liveLoadPerM2OtherFloors: 150, // حمل حي لباقي الطوابق: 150 كجم/م²
    liveLoadPerM2Roof: 100, // حمل حي للسطح: 100 كجم/م²
    deadLoadAdditionalPerM2: 100, // حمل ميت إضافي (تشطيبات، أسقف ثانوية): 100 كجم/م²
    steelPerM3ConcreteRoof: 100, // حديد الأسقف: 100 ك mencionado/م³
    steelPerM3ConcreteFoundation: 120, // حديد الأساس: 120 كجم/م³
    tieBeamHeight: 0.3, // ارتفاع الربط: 30 سم
    invertedBeamHeight: 0.3, // ارتفاع الكمرة المقلوبة: 30 سم
    excavationDepthBasement: 3, // عمق حفر الطوابق السفلية: 3 م
    electricalPointsPerMWall: 0.5, // نقاط كهربائية لكل متر جدار: 0.5
    electricalPointsPerM2Ceiling: 0.1, // نقاط كهربائية لكل متر مربع سقف: 0.1
    gravityConstant: 9.81, // الجاذبية: 9.81 م/ث²
    soilBearingCapacity: 125, // قدرة تحمل التربة: 125 kN/m² بعد إضافة طبقة الجلمود والحصى
    safetyFactorFoundation: 1.5, // معامل أمان للأساس: 1.5
    minRaftThickness: 0.3, // الحد الأدنى لسماكة الأساس: 30 سم
    maxRaftThickness: 1.0, // الحد الأقصى لسماكة الأساس: 100 سم
    baseLayerThickness: 0.3, // سماكة طبقة الأساس: 30 سم
    externalDoorDimensions: { width: 1.2, height: 2.1, thickness: 0.24 }, // أبعاد الباب الخارجي: 1.2×2.1×0.24 م
    internalDoorDimensions: { width: 0.9, height: 2.1, thickness: 0.24 }, // أبعاد الباب الداخلي: 0.9×2.1×0.24 م
    curtainWallHeight: 1.5, // ارتفاع الستارة: 1.5 م
    curtainWallWidth: 0.24, // عرض الستارة: 24 سم
    waffleVoidVolume: 0.1, // حجم الفراغ الواحد في Waffle Slab: 0.1 م³
    externalDoorWeight: 50, // وزن الباب الخارجي: 50 كجم/باب
    internalDoorWeight: 30, // وزن الباب الداخلي: 30 كجم/باب
    windowWeightPerM2: 20, // وزن الشبابيك: 20 كجم/م²
    waterTankWeight: 500, // وزن خزان الماء: 500 كجم/خزان (500 لتر)
    heaterWeight: 100 // وزن السخان: 100 كجم/سخان (100 لتر)
  };
}

/**
 * @function processAdvanced
 * @desc استقبال بيانات النموذج من /api/process وإجراء الحسابات الإنشائية والتكاليف بتسلسل هندسي.
 * @param {Object} data - Data object received from /api/process, expected to have hasMap: true.
 * @returns {Promise<Object>} - Result object containing calculations or error message.
 * @remarks
 * - الحسابات مدمجة داخل هذه الدالة بدلاً من دوال فرعية لتبسيط الهيكلية.
 * - يتبع التسلسل الهندسي: كميات (خرسانة، طابوق)، وزن المنشأ، أساس، كميات نهائية، تكاليف.
 * - يعتمد على مساحات الشبابيك المُرسلة (facadeWindowsDoorsArea, skylightWindowsDoorsArea).
 * - تم إزالة التحققات بناءً على الطلب، وتُجرى في process.js.
 * - تم تحديث الحقول لتشمل جميع مدخلات نموذج HTML المحدث مع أسماء عربية.
 * - تم إضافة دعم لـ Waffle Slab وحقل ceilingThickness وthermostone.
 * - تم تصحيح حسابات الجص (بإضافة إطارات الشبابيك والأبواب)، الأرضيات، المناور، وزن المنشأ، والشتايكر.
 * - تم تحسين تصنيف الأساس وإضافة سمك الحفر الإضافي (0.3 م).
 */
async function processAdvanced(data) {
  try {
    // تسجيل البيانات الواردة للتحقق والتصحيح
    console.log('📥 **البيانات الخام في processAdvanced**:', JSON.stringify(data, null, 2));

    // **استخلاص البيانات مع الحفاظ على القيم الواردة**
    // تنظيم البيانات في كائنات بأسماء عربية كما في نموذج HTML
    const customer = {
      'الاسم الكامل': data.customer?.name || null, // نص
      'رقم الهاتف': data.customer?.phone || null // نص
    };

    const location = {
      'المحافظة': data.location?.governorate || null, // نص (من قائمة)
      'المنطقة/الحي': data.location?.area || null // نص
    };

    const land = {
      'مساحة الأرض (م²)': data.land?.area || 0, // رقم عشري
      'عرض الواجهة (م)': data.land?.facadeWidth || 0 // رقم عشري
    };

    const building = {
      'عدد الطوابق': data.building?.floors || 0, // رقم صحيح
      'عدد الغرف': data.building?.rooms || 0, // رقم صحيح
      'عدد الحمامات': data.building?.bathrooms || 0, // رقم صحيح
      'ارتفاع الطابق الأرضي (م)': data.building?.groundFloorHeight || 0, // رقم عشري
      'ارتفاع باقي الطوابق (م)': data.building?.otherFloorsHeight || 0, // رقم عشري
      'سمك السقف (م)': data.building?.ceilingThickness || 0, // رقم عشري
      'نوع الطابوق': data.building?.brickType || null, // نص (yellow, red, thermstone)
      'تفاصيل السقف': data.building?.ceilingDetails || null, // نص (plywood, regular, waffle)
      'نوع الواجهة': data.building?.facadeType || null, // نص (economy, simple, luxury, custom)
      'حديقة': data.building?.hasGarden || false, // منطقي
      'مسبح': data.building?.hasPool || false, // منطقي
      'تدفئة وتبريد': data.building?.hasHVAC || false, // منطقي
      'مصعد': data.building?.hasElevator || false, // منطقي
      'سياج': data.building?.hasFence || false, // منطقي
      // حقول مشروطة
      'حجم الفراغ (م³)': data.waffleSlabInfo ? data.building?.voidSize || 0 : null, // رقم عشري (لـ Waffle Slab)
      'عدد الفراغات': data.waffleSlabInfo ? data.building?.voidCount || 0 : null, // رقم صحيح (لـ Waffle Slab)
      'مساحة الواجهة المخصصة (م²)': data.customFacadeInfo ? data.building?.facadeArea || 0 : null, // رقم عشري
      'عدد الشقق': data.apartmentsInfo ? data.building?.apartmentsCount || 0 : null, // رقم صحيح
      'عدد الطوابق السفلية': data.basementInfo ? data.building?.basementFloors || 0 : null, // رقم صحيح
      'مساحة السقوف (م²)': data.basementInfo ? data.building?.basementCeilingArea || 0 : null, // رقم عشري
      'سعر م² الطوابق السفلية': data.basementInfo ? data.building?.basementPrice || 0 : null // رقم عشري
    };

    const pricesInput = {
      'سعر م² تشطيب الأرضيات': data.prices?.flooring || 0, // رقم عشري
      'سعر م² تركيب الجدران': data.prices?.wallInstallation || 0, // رقم عشري
      'سعر م² صبغ الجدران': data.prices?.wallPainting || 0, // رقم عشري
      'سعر م² شبابيك وأبواب': data.prices?.windowsDoors || 0, // رقم عشري
      'سعر م² الواجهة': data.customFacadeInfo ? data.prices?.facadePrice || 0 : null, // رقم عشري
      'سعر المتر الطولي': data.stairsRailingInfo && data.hasMap ? data.prices?.stairsRailing || 0 : null, // رقم عشري
      'سعر م² الجدران': data.internalWallsInfo && data.hasMap ? data.prices?.internalWalls || 0 : null // رقم عشري
    };

    const technicalDetails = data.hasMap ? {
      'مساحة السقوف (م²)': data.technicalDetails?.totalRoofArea || 0, // رقم عشري
      'مساحة الحديقة (م²)': data.technicalDetails?.gardenArea || 0, // رقم عشري
      'مساحة الكراج والممرات (م²)': data.technicalDetails?.garagePathArea || 0, // رقم عشري
      'مساحة المناور (م²)': data.technicalDetails?.skylightsArea || 0, // رقم عشري
      'طول الرباطات (م)': data.technicalDetails?.tiesLength || 0, // رقم عشري
      'طول الجسور المقلوبة (م)': data.technicalDetails?.invertedBeams || 0, // رقم عشري
      'أطوال الجدران الخارجية 24سم (م)': data.technicalDetails?.externalWalls24cm || 0, // رقم عشري
      'أطوال الجدران الداخلية 24سم (م)': data.technicalDetails?.internalWalls24cm || 0, // رقم عشري
      'طول ستارة السطح (م)': data.technicalDetails?.roofFenceLength || 0, // رقم عشري
      'عدد الأبواب الخارجية': data.technicalDetails?.externalDoors || 0, // رقم صحيح
      'عدد الأبواب الداخلية': data.technicalDetails?.internalDoors || 0, // رقم صحيح
      'مساحة شبابيك وأبواب الواجهة (م²)': data.technicalDetails?.facadeWindowsDoorsArea || 0, // رقم عشري
      'مساحة شبابيك المناور (م²)': data.technicalDetails?.skylightWindowsDoorsArea || 0, // رقم عشري
      'مساحة السقوف الثانوية (م²)': data.technicalDetails?.secondaryCeilingsArea || 0, // رقم عشري
      'مساحة الجدران الديكورية (م²)': data.technicalDetails?.decorativeWallsArea || 0, // رقم عشري
      'مساحة الجدران التغليف (م²)': data.technicalDetails?.claddingWallsArea || 0, // رقم عشري
      'مساحة الجص الخارجي (م²)': data.technicalDetails?.plasterWallsArea || 0, // رقم عشري
      'حجم الكونكريت (م³)': data.concreteColumnsInfo && data.hasMap ? data.technicalDetails?.concreteVolume || 0 : null, // رقم عشري
      'طول محجر الدرج (م)': data.stairsRailingInfo && data.hasMap ? data.technicalDetails?.stairsRailingLength || 0 : null, // رقم عشري
      'مساحة الجدران (م²)': data.internalWallsInfo && data.hasMap ? data.technicalDetails?.internalWallsArea || 0 : null // رقم عشري
    } : {};

    // **معالجة الأقسام المشروطة**
    const customFacadeInfo = data.customFacadeInfo === true;
    const waffleSlabInfo = data.waffleSlabInfo === true;
    const apartmentsInfo = data.apartmentsInfo === true;
    const basementInfo = data.basementInfo === true;
    const stairsRailingInfo = data.stairsRailingInfo === true;
    const internalWallsInfo = data.internalWallsInfo === true;
    const concreteColumnsInfo = data.concreteColumnsInfo === true;

    // **الحصول على الأسعار والثوابت**
    const prices = getMaterialPrices();
    const constants = getEngineeringConstants();

    // **حساب الكميات الأولية**
    // --- خرسانة الأسقف ---
    let roofConcrete = technicalDetails['مساحة السقوف (م²)'] * building['سمك السقف (م)'];
    if (waffleSlabInfo && building['تفاصيل السقف'] === 'waffle') {
      const voidVolume = building['حجم الفراغ (م³)'] * building['عدد الفراغات'];
      roofConcrete = Math.max(0, roofConcrete - voidVolume); // طرح حجم الفراغات مع ضمان عدم السلبية
    }

    // --- تحديد سمك الجدار بناءً على نوع الطابوق ---
    const wallThickness = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowDimensions.width
      : building['نوع الطابوق'] === 'red' ? constants.brickRedDimensions.width
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneDimensions.width
      : constants.brickYellowDimensions.width;

    // --- خرسانة الرباطات ---
    const tieBeamConcrete = technicalDetails['طول الرباطات (م)'] * constants.tieBeamHeight * wallThickness;

    // --- خرسانة الجسور المقلوبة ---
    const invertedBeamConcrete = technicalDetails['طول الجسور المقلوبة (م)'] * constants.invertedBeamHeight * wallThickness;

    // --- الخرسانة الإضافية ---
    const additionalConcrete = concreteColumnsInfo ? technicalDetails['حجم الكونكريت (م³)'] || 0 : 0;

    // --- إجمالي الخرسانة الأولية (بدون الأساس) ---
    let totalConcrete = roofConcrete + tieBeamConcrete + invertedBeamConcrete + additionalConcrete;

    // --- الجدران ---
    // حساب نسبة تغطية الرباطات
    const totalWallLength = technicalDetails['أطوال الجدران الخارجية 24سم (م)'] + technicalDetails['أطوال الجدران الداخلية 24سم (م)'];
    const coverageRatio = totalWallLength > 0 ? Math.min(1, technicalDetails['طول الرباطات (م)'] / totalWallLength) : 0;

    // حساب ارتفاع الجدران الصافي
    const adjustedGroundFloorHeight = building['ارتفاع الطابق الأرضي (م)'] - (coverageRatio * constants.tieBeamHeight);
    const adjustedOtherFloorsHeight = building['ارتفاع باقي الطوابق (م)'] - (coverageRatio * constants.tieBeamHeight);
    const totalWallHeight = adjustedGroundFloorHeight + (building['عدد الطوابق'] - 1) * adjustedOtherFloorsHeight;

    // حجم الجدران الخارجية
    const externalWallsVolume = technicalDetails['أطوال الجدران الخارجية 24سم (م)'] * totalWallHeight * wallThickness;

    // حجم الجدران الداخلية
    const internalWallsVolume = technicalDetails['أطوال الجدران الداخلية 24سم (م)'] * totalWallHeight * wallThickness;

    // --- الفتحات ---
    const facadeOpeningsVolume = technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'] * wallThickness;
    const skylightOpeningsVolume = technicalDetails['مساحة شبابيك المناور (م²)'] * wallThickness;
    const externalDoorsVolume = technicalDetails['عدد الأبواب الخارجية'] * 
      constants.externalDoorDimensions.width * constants.externalDoorDimensions.height * wallThickness;
    const internalDoorsVolume = technicalDetails['عدد الأبواب الداخلية'] * 
      constants.internalDoorDimensions.width * constants.internalDoorDimensions.height * wallThickness;
    const totalOpeningsVolume = facadeOpeningsVolume + skylightOpeningsVolume + externalDoorsVolume + internalDoorsVolume;

    // --- حجم الجدران الصافي ---
    const wallsVolume = Math.max(0, externalWallsVolume + internalWallsVolume - totalOpeningsVolume);

    // **حساب الطابوق**
    let brickDbls = 0;
    let brickCount = 0;
    const brickVolume = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowDimensions.width * constants.brickYellowDimensions.length * constants.brickYellowDimensions.height
      : building['نوع الطابوق'] === 'red' ? constants.brickRedDimensions.width * constants.brickRedDimensions.length * constants.brickRedDimensions.height
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneDimensions.width * constants.brickThermostoneDimensions.length * constants.brickThermostoneDimensions.height
      : constants.brickYellowDimensions.width * constants.brickYellowDimensions.length * constants.brickYellowDimensions.height;

    const brickDensity = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowDensity
      : building['نوع الطابوق'] === 'red' ? constants.brickRedDensity
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneDensity
      : constants.brickYellowDensity;

    if (building['نوع الطابوق'] === 'thermostone') {
      const brickWithMortarLength = constants.brickThermostoneDimensions.length + constants.brickThermostoneMortarVertical;
      const brickWithMortarHeight = constants.brickThermostoneDimensions.height + constants.brickThermostoneMortarHorizontal;
      const brickWithMortarVolume = constants.brickThermostoneDimensions.width * brickWithMortarLength * brickWithMortarHeight;
      brickCount = Math.ceil(wallsVolume / brickWithMortarVolume);
      brickDbls = Math.ceil(brickCount / 1000); // ألف طابوقة
    } else {
      const coveragePerDbl = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowCoveragePerDbl
        : building['نوع الطابوق'] === 'red' ? constants.brickRedCoveragePerDbl
        : constants.brickYellowCoveragePerDbl;
      brickDbls = Math.ceil(wallsVolume / coveragePerDbl);
      brickCount = brickDbls * constants.bricksPerDbl;
    }

    // **حساب الأرضيات والمونة**
    // مساحة أرضية الطابق الأرضي
    const groundFloorArea = land['مساحة الأرض (م²)'] - technicalDetails['مساحة الحديقة (م²)'] - technicalDetails['مساحة الكراج والممرات (م²)'];
    // مساحة الأرضيات للطوابق الأخرى (باستثناء السطح)
    const roofAreaPerFloor = building['عدد الطوابق'] > 0 ? technicalDetails['مساحة السقوف (م²)'] / building['عدد الطوابق'] : 0;
    const otherFloorsArea = roofAreaPerFloor * (building['عدد الطوابق'] - 1);
    // مساحة الجدران لكل طابق
    const wallsAreaPerFloor = (technicalDetails['أطوال الجدران الخارجية 24سم (م)'] + technicalDetails['أطوال الجدران الداخلية 24سم (م)']) * wallThickness;
    const flooringArea = Math.max(0, groundFloorArea + otherFloorsArea - wallsAreaPerFloor * building['عدد الطوابق']);

    // مساحة مونة الجدران
    const wallMortarArea = technicalDetails['مساحة الجدران التغليف (م²)'] || 0;

    // **حساب الجص الخارجي**
    const skylightArea = technicalDetails['مساحة المناور (م²)'];
    const skylightWidth = skylightArea > 0 ? Math.sqrt(skylightArea / 3) : 0; // العرض = √(مساحة/3)
    const skylightLength = skylightWidth * 3; // الطول = 3 × العرض
    const skylightLongestWallArea = skylightLength * totalWallHeight; // مساحة أطول جدار مناور
    let externalWallsPlasterArea = technicalDetails['أطوال الجدران الخارجية 24سم (م)'] * totalWallHeight - 
      technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'] - 
      technicalDetails['عدد الأبواب الخارجية'] * constants.externalDoorDimensions.width * constants.externalDoorDimensions.height - 
      skylightLongestWallArea;

    // **حساب جدران المناور**
    const skylightPerimeter = skylightArea > 0 ? 2 * (skylightLength + skylightWidth) : 0; // محيط المناور
    const skylightHeightPerFloor = building['ارتفاع باقي الطوابق (م)'] + building['سمك السقف (م)']; // إضافة سمك السقف
    const totalSkylightHeight = adjustedGroundFloorHeight + (building['عدد الطوابق'] - 1) * skylightHeightPerFloor; // ارتفاع صافي للمناور
    const skylightWallsPlasterArea = skylightPerimeter * totalSkylightHeight - 
      technicalDetails['مساحة شبابيك المناور (م²)'];

    // **حساب الجص الداخلي**
    const skylightInternalWallsArea = skylightArea > 0 ? (2 * skylightWidth + skylightLength) * totalSkylightHeight - 
      technicalDetails['مساحة شبابيك المناور (م²)'] : 0; // مساحة ثلاثة أوجه داخلية للمناور
    let internalWallsPlasterArea = (technicalDetails['أطوال الجدران الداخلية 24سم (م)'] * totalWallHeight * 2) - // وجهين
      (technicalDetails['عدد الأبواب الداخلية'] * constants.internalDoorDimensions.width * constants.internalDoorDimensions.height) - // طرح الأبواب
      skylightInternalWallsArea; // طرح ثلاثة أوجه من المناور

    // مساحة جص الأسقف (باستثناء السطح)
    const ceilingPlasterArea = roofAreaPerFloor * (building['عدد الطوابق'] - 1) - 
      technicalDetails['مساحة السقوف الثانوية (م²)'] - 
      wallsAreaPerFloor;

    // **حساب إطارات الشبابيك والأبواب للجص**
    const frameHeight = adjustedGroundFloorHeight; // ارتفاع الإطارات
    // محيط إطارات الشبابيك
    const facadeWindowsFramePerimeter = technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'] > 0 
      ? 2 * (Math.sqrt(technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)']) + frameHeight) 
      : 0;
    const skylightWindowsFramePerimeter = technicalDetails['مساحة شبابيك المناور (م²)'] > 0 
      ? 2 * (Math.sqrt(technicalDetails['مساحة شبابيك المناور (م²)']) + frameHeight) 
      : 0;
    // محيط إطارات الأبواب
    const externalDoorsFramePerimeter = technicalDetails['عدد الأبواب الخارجية'] * 
      (constants.externalDoorDimensions.width + 2 * constants.externalDoorDimensions.height);
    const internalDoorsFramePerimeter = technicalDetails['عدد الأبواب الداخلية'] * 
      (constants.internalDoorDimensions.width + 2 * constants.internalDoorDimensions.height);
    // مساحة إطارات الجص
    const windowsFrameAreaExternal = (facadeWindowsFramePerimeter + skylightWindowsFramePerimeter) * (wallThickness / 2);
    const externalDoorsFrameArea = externalDoorsFramePerimeter * (wallThickness / 2);
    const internalDoorsFrameArea = internalDoorsFramePerimeter * wallThickness;
    // إضافة إلى مساحة الجص
    externalWallsPlasterArea += windowsFrameAreaExternal + externalDoorsFrameArea;
    internalWallsPlasterArea += windowsFrameAreaExternal + internalDoorsFrameArea;

    // إجمالي مساحة الجص
    const totalPlasterArea = Math.max(0, externalWallsPlasterArea + internalWallsPlasterArea + ceilingPlasterArea - wallMortarArea);

    // **حساب وزن المنشأ**
    const concreteWeight = totalConcrete * constants.concreteDensity;
    const roofSteel = totalConcrete * constants.steelPerM3ConcreteRoof / 1000;
    const steelWeight = roofSteel * constants.steelDensity;
    const brickWeight = wallsVolume * brickDensity;
    const floorMortarWeight = flooringArea * constants.mortarFloorThickness * constants.mortarFloorDensity;
    const wallMortarWeight = wallMortarArea * constants.mortarWallsThickness * constants.mortarWallsDensity;
    const flooringWeight = flooringArea * constants.mortarFloorThickness * constants.flooringDensity;
    const plasterWeight = totalPlasterArea * constants.plasterThickness * 
      (constants.gypsumDensity * 0.75 + constants.limeDensity * 0.25);
    const liveLoadWeight = roofAreaPerFloor * (
      building['عدد الطوابق'] === 1 ? constants.liveLoadPerM2GroundFloor : 
      ((constants.liveLoadPerM2GroundFloor + (building['عدد الطوابق'] - 1) * constants.liveLoadPerM2OtherFloors + constants.liveLoadPerM2Roof) / building['عدد الطوابق'])
    );
    const additionalDeadLoadWeight = (roofAreaPerFloor + technicalDetails['مساحة السقوف الثانوية (م²)'] + 
      technicalDetails['مساحة الجدران الديكورية (م²)']) * constants.deadLoadAdditionalPerM2;

    // إضافة وزن خزانات الماء والسخانات
    const waterTanksWeight = building['عدد الحمامات'] * constants.waterTankWeight;
    const heatersWeight = building['عدد الحمامات'] * constants.heaterWeight;

    // إضافة وزن الأبواب والشبابيك
    const externalDoorsWeight = technicalDetails['عدد الأبواب الخارجية'] * constants.externalDoorWeight;
    const internalDoorsWeight = technicalDetails['عدد الأبواب الداخلية'] * constants.internalDoorWeight;
    const windowsWeight = (technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'] + 
      technicalDetails['مساحة شبابيك المناور (م²)']) * constants.windowWeightPerM2;
    const totalOpeningsWeight = externalDoorsWeight + internalDoorsWeight + windowsWeight;

    // وزن الشتايكر
    const screedWeight = roofAreaPerFloor * constants.screedThickness * constants.screedDensity;

    // الوزن الكلي (kN)
    const totalWeight = (concreteWeight + steelWeight + brickWeight + floorMortarWeight + 
      wallMortarWeight + flooringWeight + plasterWeight + liveLoadWeight + additionalDeadLoadWeight + 
      waterTanksWeight + heatersWeight + totalOpeningsWeight + screedWeight) * constants.gravityConstant / 1000;

    // **حساب الأساس**
    const raftArea = land['مساحة الأرض (م²)'] - technicalDetails['مساحة الحديقة (م²)'] - 
      technicalDetails['مساحة الكراج والممرات (م²)'];
    const pressure = totalWeight / raftArea;
    const requiredRaftThickness = Math.max(
      constants.minRaftThickness,
      Math.min(
        constants.maxRaftThickness,
        (pressure / (constants.soilBearingCapacity / constants.safetyFactorFoundation)) * 0.3
      )
    );
    const raftThickness = Math.ceil(requiredRaftThickness * 100) / 100;
    let raftType;
    let foundationRecommendation = '';
    if (raftThickness <= 0.3) {
      raftType = 'عادي';
    } else if (raftThickness <= 0.8) {
      raftType = 'مقوى';
    } else {
      raftType = 'غير مناسب';
      foundationRecommendation = 'يُوصى باستخدام أساسات شريطية أو خوازيق لتقليل التكلفة.';
    }
    const raftVolume = raftArea * raftThickness;

    // **حساب حجم الحفر مع طبقة إضافية**
    const excavationDepth = ((building['عدد الطوابق السفلية'] || 0) * constants.excavationDepthBasement) + constants.baseLayerThickness;
    const excavationVolume = land['مساحة الأرض (م²)'] * excavationDepth;
    const truckTrips = Math.ceil(excavationVolume / 24);

    // **الكميات النهائية**
    totalConcrete += raftVolume;
    const foundationSteel = raftVolume * constants.steelPerM3ConcreteFoundation / 1000;
    const totalSteel = roofSteel + foundationSteel;
    const baseVolume = raftArea * constants.baseLayerThickness;
    const gravelBase = baseVolume * 0.6;
    const sandBase = baseVolume * 0.4;
    const cementForFloorMortar = flooringArea * constants.cementPerM2MortarFloor;
    const sandForFloorMortar = flooringArea * constants.sandPerM2MortarFloor;
    const cementForWallMortar = wallMortarArea * constants.cementPerM2MortarWalls;
    const sandForWallMortar = wallMortarArea * constants.sandPerM2MortarWalls;
    const gypsumQuantity = totalPlasterArea * constants.gypsumPerM2Plaster;
    const limeQuantity = totalPlasterArea * constants.limePerM2Plaster;

    // **استقرار الجدران**
    const brickCompressiveStrength = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowCompressiveStrength
      : building['نوع الطابوق'] === 'red' ? constants.brickRedCompressiveStrength
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneCompressiveStrength
      : constants.brickYellowCompressiveStrength;
    const wallCapacity = brickCompressiveStrength * 1000 * wallThickness * totalWallLength;
    const minWallLength = totalWeight / (brickCompressiveStrength * 1000 * wallThickness);
    const isWallStable = totalWallLength >= minWallLength;

    // **حساب الواجهة**
    const facadeArea = customFacadeInfo ? building['مساحة الواجهة المخصصة (م²)'] 
      : land['عرض الواجهة (م)'] * (building['ارتفاع الطابق الأرضي (م)'] + building['ارتفاع باقي الطوابق (م)'] * (building['عدد الطوابق'] - 1)) - 
        technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'];
    const facadeCost = customFacadeInfo ? facadeArea * pricesInput['سعر م² الواجهة']
      : facadeArea * (building['نوع الواجهة'] === 'economy' ? prices.facadeEconomyPerM2
        : building['نوع الواجهة'] === 'simple' ? prices.facadeSimplePerM2 : prices.facadeLuxuryPerM2);

    // **حساب المناور**
    const skylightCost = building['حديقة'] 
      ? technicalDetails['مساحة الحديقة (م²)'] * prices.gardenPerM2
      : skylightWallsPlasterArea * prices.plasterLaborPerM2;

    // **حساب التكاليف**
    const costBreakdown = {
      concrete: (totalConcrete - raftVolume) * prices.concreteC30PerM3 + raftVolume * prices.concreteC40PerM3,
      steel: totalSteel * prices.steelPerTon,
      cement: (cementForFloorMortar + cementForWallMortar) * prices.cementOrdinaryPerTon,
      sand: (sandForFloorMortar + sandForWallMortar) * prices.sandPerM3,
      gravelBase: gravelBase * prices.gravelBasePerM3,
      sandBase: sandBase * prices.sandBasePerM3,
      baseLabor: raftArea * prices.baseLaborPerM2,
      bricks: building['نوع الطابوق'] === 'thermostone' 
        ? brickDbls * prices.brickThermostonePerThousand
        : brickDbls * (building['نوع الطابوق'] === 'yellow' ? prices.brickYellowPerDbl : prices.brickRedPerDbl),
      gypsum: gypsumQuantity * prices.gypsumPerTon,
      lime: limeQuantity * prices.limePerTon,
      excavation: excavationVolume * prices.excavationPerM3,
      truckTransport: truckTrips * prices.truckTransportPerTrip,
      flooring: flooringArea * pricesInput['سعر م² تشطيب الأرضيات'],
      flooringMortarLabor: flooringArea * prices.flooringMortarLaborPerM2,
      facade: facadeCost,
      facadeLabor: facadeArea * prices.facadeLaborPerM2,
      windowsDoors: technicalDetails['مساحة شبابيك وأبواب الواجهة (م²)'] * pricesInput['سعر م² شبابيك وأبواب'],
      externalDoors: technicalDetails['عدد الأبواب الخارجية'] * prices.externalDoorFixed,
      internalDoors: technicalDetails['عدد الأبواب الداخلية'] * prices.internalDoorFixed,
      carGate: technicalDetails['مساحة الكراج والممرات (م²)'] >= 24 ? land['عرض الواجهة (م)'] * 2 * prices.carGatePerM2 : 0,
      skylight: skylightCost,
      claddingWalls: wallMortarArea * pricesInput['سعر م² تركيب الجدران'],
      paintingWalls: (totalPlasterArea + technicalDetails['مساحة السقوف الثانوية (م²)']) * pricesInput['سعر م² صبغ الجدران'],
      plasterLabor: (externalWallsPlasterArea + internalWallsPlasterArea) * prices.plasterLaborPerM2 + 
        ceilingPlasterArea * prices.plasterCeilingLaborPerM2,
      priming: (externalWallsPlasterArea + internalWallsPlasterArea) * prices.primingPerM2,
      brickLabor: building['نوع الطابوق'] === 'thermostone'
        ? Array.from({ length: building['عدد الطوابق'] }, (_, i) => {
            const bricksPerFloor = Math.ceil(brickCount / building['عدد الطوابق']);
            return Math.ceil(bricksPerFloor / 1000) * (prices.brickLaborPerThousand + i * prices.brickLaborExtraPerFloor);
          }).reduce((sum, cost) => sum + cost, 0)
        : Array.from({ length: building['عدد الطوابق'] }, (_, i) => {
            const brickDblsPerFloor = Math.ceil(brickDbls / building['عدد الطوابق']);
            return brickDblsPerFloor * (prices.brickLaborPerDbl + i * prices.brickLaborExtraPerFloor);
          }).reduce((sum, cost) => sum + cost, 0),
      carpentrySteelLabor: totalConcrete * (prices.carpentryLaborPerM3[building['تفاصيل السقف'] || 'regular'] + prices.steelLaborPerM3),
      transport: building['نوع الطابوق'] === 'thermostone'
        ? (totalConcrete * prices.transportConcretePerM3 + 
           totalSteel * prices.transportSteelPerTon + 
           (cementForFloorMortar + cementForWallMortar) * prices.transportCementPerTon + 
           (sandForFloorMortar + sandForWallMortar) * prices.transportSandPerM3 + 
           brickDbls * prices.transportBricksThermostonePerThousand)
        : (totalConcrete * prices.transportConcretePerM3 + 
           totalSteel * prices.transportSteelPerTon + 
           (cementForFloorMortar + cementForWallMortar) * prices.transportCementPerTon + 
           (sandForFloorMortar + sandForWallMortar) * prices.transportSandPerM3 + 
           brickDbls * prices.transportBricksPerDbl),
      electricalMaterials: ((technicalDetails['أطوال الجدران الخارجية 24سم (م)'] * 1 + technicalDetails['أطوال الجدران الداخلية 24سم (م)'] * 2) * 
        constants.electricalPointsPerMWall + roofAreaPerFloor * constants.electricalPointsPerM2Ceiling) * 
        prices.electricalPointCost + prices.electricalBoardFixed * (1 + (apartmentsInfo ? building['عدد الشقق'] : 0)),
      electricalLabor: ((technicalDetails['أطوال الجدران الخارجية 24سم (م)'] * 1 + technicalDetails['أطوال الجدران الداخلية 24سم (م)'] * 2) * 
        constants.electricalPointsPerMWall + roofAreaPerFloor * constants.electricalPointsPerM2Ceiling) * 
        prices.electricalLaborPerPoint,
      plumbingCost: building['عدد الحمامات'] * prices.plumbingBathroomMaterials + 
        (apartmentsInfo ? building['عدد الشقق'] : 1) * (prices.plumbingKitchenMaterials + prices.plumbingOtherMaterials),
      plumbingLabor: building['عدد الحمامات'] * prices.plumbingBathroomLabor,
      bathroomFittings: building['عدد الحمامات'] * prices.bathroomFittingsPerSet,
      hvac: building['تدفئة وتبريد'] ? (technicalDetails['أطوال الجدران الخارجية 24سم (م)'] + technicalDetails['أطوال الجدران الداخلية 24سم (م)']) * prices.hvacPerM : 0,
      pool: building['مسبح'] ? prices.poolFixed : 0,
      fence: building['سياج'] ? technicalDetails['طول ستارة السطح (م)'] * prices.fencePerM : 0,
      elevator: building['مصعد'] ? prices.elevatorBaseCost + prices.elevatorPerFloorCost * building['عدد الطوابق'] : 0,
      secondaryCeilings: technicalDetails['مساحة السقوف الثانوية (م²)'] * prices.secondaryCeilingsPerM2,
      decorativeWalls: technicalDetails['مساحة الجدران الديكورية (م²)'] * prices.decorativeWallsPerM2,
      garageCanopy: technicalDetails['مساحة الكراج والممرات (م²)'] >= 24 ? prices.garageCanopyFixed : 0,
      stairsRailing: stairsRailingInfo ? technicalDetails['طول محجر الدرج (م)'] * pricesInput['سعر المتر الطولي'] : 0,
      internalWalls: internalWallsInfo ? technicalDetails['مساحة الجدران (م²)'] * pricesInput['سعر م² الجدران'] : 0,
      basement: basementInfo ? building['مساحة السقوف (م²)'] * building['سعر م² الطوابق السفلية'] : 0
    };

    // إجمالي التكلفة
    const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);

    // **إرجاع النتائج**
    return {
      success: true,
      customer,
      location,
      land,
      building,
      quantities: {
        concrete: totalConcrete, // م³
        steel: totalSteel, // طن
        cement: cementForFloorMortar + cementForWallMortar, // طن
        sand: sandForFloorMortar + sandForWallMortar, // م³
        gravelBase, // م³
        sandBase, // م³
        bricks: brickCount, // عدد الطابوقات
        brickDbls, // عدد الدبل (أو ألف للثرمستون)
        gypsum: gypsumQuantity, // طن
        lime: limeQuantity, // طن
        excavation: excavationVolume, // م³
        truckTrips, // عدد الرحلات
        flooringArea, // م²
        plasterArea: totalPlasterArea, // م²
        facadeArea, // م²
        skylightArea // م²
      },
      engineering: {
        totalWeight, // kN
        pressure, // kN/m²
        raftThickness, // م
        raftType, // نص
        foundationRecommendation, // نص
        wallCapacity, // kN
        isWallStable, // منطقي
        minWallLength // م
      },
      costs: {
        ...costBreakdown,
        total: totalCost // دينار
      }
    };
  } catch (error) {
    console.error('❌ **خطأ في processAdvanced**:', error);
    return {
      success: false,
      error: error.message || 'خطأ في معالجة البيانات'
    };
  }
}

// تصدير الدالة
module.exports = { processAdvanced };
