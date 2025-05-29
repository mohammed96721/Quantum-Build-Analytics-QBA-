// advancedCalculate.js

// دالة لإرجاع أسعار المواد (دينار عراقي)
// الغرض: تحديد أسعار جميع المواد المستخدمة في البناء لاستخدامها في حساب التكاليف.
// مكان الاستخدام: في قسم الأسعار والكلف لحساب تكلفة المواد مثل الكونكريت، الحديد، الطابوق، إلخ.
// تعليمات التعديل: عدّل الأسعار بناءً على أسعار السوق الحالية (مايو 2025). القيم يجب أن تكون موجبة.
// ملاحظات: تحقق من أسعار السوق في بغداد أو المحافظات الأخرى. إذا تغيرت الأسعار، استبدل القيم مباشرة.
function getMaterialPrices() {
  return {
    concrete: 150000, // سعر الكونكريت (د.ع/م³) - للخرسانة المسلحة القياسية، تحقق من أسعار المصانع المحلية.
    steel: 2000,      // سعر الحديد (د.ع/كجم) - للحديد المستخدم في التسليح، تأكد من سعر الطن (2 د.ع/كجم = 2,000,000 د.ع/طن).
    brick: 1000,      // سعر الطابوقة الواحدة (د.ع/طابوقة) - للطابوق الأصفر أو الأحمر القياسي، تحقق من أسعار الموردين.
    cement: 50000,    // سعر السمنت (د.ع/م³) - للسمنت المستخدم في المونة، قد يختلف حسب العلامة التجارية.
    sand: 20000,      // سعر الرمل (د.ع/م³) - للرمل الناعم أو الخشن المستخدم في المونة والخرسانة.
    ducting: 25000,   // سعر دكتات الهواء (د.ع/م) - لأنظمة التكييف (بليت 0.7 أب)، تحقق من أسعار الأنابيب.
    electricalMaterials: 5000, // سعر المواد الكهربائية (د.ع/نقطة) - للأسلاك والمفاتيح لكل نقطة كهربائية.
    plumbingMaterialsBathroom: 500000, // سعر مواد الصحيات للحمام (د.ع/حمام) - للأنابيب والحنفيات والمراحيض.
    plumbingMaterialsKitchen: 300000, // سعر مواد الصحيات للمطبخ (د.ع/مطبخ) - للأنابيب والمغاسل.
    windowsDoors: 10000, // سعر الشبابيك والأبواب (د.ع/م²) - للنوافذ والأبواب القياسية، قد يختلف حسب المادة (ألمنيوم/خشب).
    bathroomFurnishing: 600000, // سعر تأثيث الحمام (د.ع/حمام) - للأدوات الصحية مثل المغاسل والدوش.
    electricalBoard: 500000, // سعر بورد الكهرباء (د.ع/وحدة) - لوحة التوزيع الكهربائية لكل شقة.
  };
}

// دالة لإرجاع كثافات المواد (كجم/م³)
// الغرض: تحديد كثافات المواد لاستخدامها في حساب وزن المنشأة.
// مكان الاستخدام: في حساب وزن المنشأة (الأحمال الثابتة) ضمن التحليل الإنشائي.
// تعليمات التعديل: عدّل بناءً على مواصفات المواد. القيم يجب أن تكون موجبة.
function getMaterialDensities() {
  return {
    brickYellow: 1800, // كثافة الطابوق الأصفر (كجم/م³)
    brickRed: 2000,   // كثافة الطابوق الأحمر (كجم/م³)
    concrete: 2400,   // كثافة الكونكريت (كجم/م³)
  };
}

// دالة لإرجاع أحجام الطابوق (م³)
// الغرض: تحديد حجم الطابوقة الواحدة لحساب عدد الطابوق المطلوب.
// مكان الاستخدام: في حساب كمية الطابوق ضمن قسم الكميات والحسابات.
// تعليمات التعديل: غيّر القيم بناءً على أبعاد الطابوق القياسية (طول × عرض × ارتفاع).
function getBrickVolumes() {
  return {
    yellow: 0.00288, // حجم الطابوقة الصفراء (24×12×6 سم = 0.00288 م³)
    red: 0.00336,   // حجم الطابوقة الحمراء (24×12×7 سم = 0.00336 م³)
  };
}

// دالة لإرجاع قوة الطابوق (ميغاباسكال)
// الغرض: تحديد قوة تحمل الطابوق للضغط للتحقق من سلامة جدران الطابق الأرضي.
// مكان الاستخدام: في التحليل الإنشائي للتحقق من قدرة الجدران.
// تعليمات التعديل: عدّل بناءً على المواصفات الهندسية للطابوق.
function getBrickStrengths() {
  return {
    yellow: 5, // قوة الطابوق الأصفر (ميغاباسكال)
    red: 7,   // قوة الطابوق الأحمر (ميغاباسكال)
  };
}

// دالة لإرجاع الأحمال الحية (كيلو نيوتن/م²)
// الغرض: تحديد الأحمال الحية للطوابق السكنية لحساب وزن المنشأة.
// مكان الاستخدام: في حساب الوزن الكلي ضمن التحليل الإنشائي.
// تعليمات التعديل: القيمة 2.5 كيلو نيوتن/م² قياسية (ASCE 7-10). غيّرها إذا لزم الأمر.
function getLiveLoads() {
  return {
    residential: 2.5, // الأحمال الحية للطوابق السكنية (كيلو نيوتن/م²)
  };
}

// دالة لإرجاع قدرة تحمل التربة (كيلو نيوتن/م²)
// الغرض: تحديد قدرة تحمل التربة لتحديد نوع الرفت وسمكه.
// مكان الاستخدام: في التحليل الإنشائي لحساب نوع الرفت وسمكه.
// تعليمات التعديل: عدّل بناءً على تقارير التربة المحلية (جلمود وسبيس).
function getSoilBearingCapacities() {
  return {
    regularRaft: 100, // قدرة تحمل التربة للرفت العادي (كيلو نيوتن/م²)
    reinforcedRaft: 150, // قدرة تحمل التربة للرفت المقوى (كيلو نيوتن/م²)
  };
}

// دالة لإرجاع أسعار الواجهات (دينار عراقي/م²)
// الغرض: تحديد أسعار الواجهات بناءً على النوع (اقتصادي، بسيط، فاخر).
// مكان الاستخدام: في حساب تكلفة الواجهة ضمن قسم الأسعار والكلف.
// تعليمات التعديل: عدّل الأسعار بناءً على السوق. إذا كانت الواجهة مخصصة، يُستخدم facadePrice.
function getFacadePrices() {
  return {
    economy: 5000,  // سعر الواجهة الاقتصادية (د.ع/م²)
    simple: 10000,  // سعر الواجهة البسيطة (د.ع/م²)
    luxury: 20000,  // سعر الواجهة الفاخرة (د.ع/م²)
  };
}

// دالة لإرجاع أسعار الأعمال (دينار عراقي)
// الغرض: تحديد أسعار الأعمال مثل الحفر، الفرش، الأرضيات، البياض، إلخ.
// مكان الاستخدام: في قسم الأسعار والكلف لحساب تكاليف الأعمال.
// تعليمات التعديل: عدّل الأسعار بناءً على أسعار العمالة في السوق.
function getWorkPrices() {
  return {
    excavation: 5000,      // سعر الحفر (د.ع/م³)
    transport: 10000,      // سعر نقل المواد (د.ع/قلاب)
    bedding: 3000,         // سعر فرش الأرض (د.ع/م²)
    flooring: 15000,       // سعر الأرضيات (افتراضي، د.ع/م²)
    plastering: 7000,      // سعر البياض (د.ع/م²)
    skylight: 7000,        // سعر المناور (د.ع/م²)
    electricalLabor: 3000, // أجور الكهربائي (د.ع/م²)
    plumbingLabor: 2000,   // أجور الصحيات (د.ع/م²)
    brickLabor: 400000,    // أجور بناء الطابوق (د.ع/دبل، 4000 طابوقة)
    carpentryAndSteelLabor: 50000, // أجور النجارة والحدادة (د.ع/م³)
    wallInstallation: 10000, // سعر تطبيق الجدران (د.ع/م²)
    garageCover: 1000000,  // سعر مسقف الكراج (د.ع)
  };
}

// دالة لإرجاع أسعار الرفت (دينار عراقي/م²)
// الغرض: تحديد تكلفة الرفت بناءً على نوعه (عادي، مقوى، خاص).
// مكان الاستخدام: في التحليل الإنشائي وحساب تكلفة الرفت.
// تعليمات التعديل: عدّل الأسعار بناءً على تكاليف البناء.
function getRaftPrices() {
  return {
    regular: 50000,  // سعر الرفت العادي (د.ع/م²)
    reinforced: 75000, // سعر الرفت المقوى (د.ع/م²)
    special: 100000, // سعر الأساسات الخاصة (د.ع/م²)
  };
}

// دالة لإرجاع النسب الهندسية
// الغرض: تحديد النسب المستخدمة في الحسابات الهندسية (مثل نسبة الحديد، سمك المونة).
// مكان الاستخدام: في حسابات الكميات (الكونكريت، الحديد، المونة، إلخ).
// تعليمات التعديل: النسب قياسية للمباني السكنية العراقية. عدّلها بحذر.
function getEngineeringRatios() {
  return {
    steelToConcrete: 130, // نسبة الحديد للكونكريت (كجم/م³)
    flooringMortarWidth: 0.075, // سمك مونة الأرضيات (م)
    wallsMortarWidth: 0.05, // سمك مونة الجدران (م)
    plasterMortarWidth: 0.04, // سمك مونة اللبخ (م)
    cementToMortar: 1 / 5, // نسبة السمنت في المونة (1:4)
    sandToMortar: 4 / 5, // نسبة الرمل في المونة (1:4)
    ductingFactor: 0.5, // معامل دكتات الهواء (م/م² من مساحة السقوف)
    concreteSlabThickness: 0.2, // سمك السقوف (م)
    tieBeamSection: 0.3 * 0.3, // مقطع الرباطات (م²، 30×30 سم)
    invertedBeamSection: 0.3 * 0.3, // مقطع الجسور المقلوبة (م²، 30×30 سم)
    raftSafetyFactor: 1.5, // عامل أمان سمك الرفت
    minRaftThickness: 0.3, // الحد الأدنى لسمك الرفت (م)
    wallThickness: 0.24, // سمك الجدران (م)
    skylightExtraHeight: 0.2, // الارتفاع الإضافي للمناور لكل طابق (م)
    truckCapacity: 10, // سعة القلاب (م³)
    electricalPointsPerArea: 2, // عدد النقاط الكهربائية لكل متر مربع
  };
}

// دالة لإرجاع أسعار الأبواب الخارجية (دينار عراقي)
// الغرض: تحديد تكلفة الباب الخارجي بناءً على مساحة الكراج.
// مكان الاستخدام: في حساب تكلفة الباب الخارجي ضمن قسم الأسعار والكلف.
// تعليمات التعديل: عدّل الأسعار بناءً على السوق. القيمة الأولى للكراجات الكبيرة (> 12 م²).
function getExternalDoorPrices() {
  return {
    small: 200000, // سعر الباب للكراج < 12 م² (د.ع)
    large: 500000, // سعر الباب للكراج ≥ 12 م² (د.ع)
    garageThreshold: 12, // عتبة مساحة الكراج (م²)
  };
}

// دالة رئيسية لتجميع كل القيم
// الغرض: تسهيل الوصول إلى جميع القيم الثابتة من مكان واحد.
// مكان الاستخدام: في بداية دالة processAdvanced لتحميل القيم.
// تعليمات التعديل: لا تعدل هذه الدالة، بل عدّل الدوال الأخرى.
function getAllConstants() {
  return {
    materialPrices: getMaterialPrices(),
    density: getMaterialDensities(),
    brickVolumes: getBrickVolumes(),
    brickStrengths: getBrickStrengths(),
    liveLoads: getLiveLoads(),
    soilBearingCapacities: getSoilBearingCapacities(),
    facadePrices: getFacadePrices(),
    workPrices: getWorkPrices(),
    raftPrices: getRaftPrices(),
    engineeringRatios: getEngineeringRatios(),
    externalDoorPrices: getExternalDoorPrices(),
  };
}

// الدالة الرئيسية لمعالجة الحسابات المتقدمة
// الغرض: إجراء جميع الحسابات الهندسية بناءً على مدخلات العميل وإرجاع النتائج لتقرير PDF.
// مكان الاستخدام: يتم استدعاؤها عند إرسال البيانات من نموذج HTML.
function processAdvanced(data) {
  console.log('معالجة في advancedCalculate.js:', data);

  // تفكيك البيانات المدخلة
  const { customer, location, land, building, prices, technicalDetails, otherBrickInfo, customFacadeInfo, basementInfo, apartmentsInfo } = data;

  // تحميل الثوابت
  const constants = getAllConstants();

  // تهيئة التكاليف
  const costBreakdown = {
    structural: 0, // التحليل الإنشائي
    excavation: 0, // الحفر والفرش
    facade: 0, // الواجهة
    raft: 0, // الرفت
    flooring: 0, // الأرضيات
    concrete: 0, // الكونكريت
    steel: 0, // الحديد
    plastering: 0, // البياض
    bricks: 0, // الطابوق
    skylights: 0, // المناور
    flooringMortar: 0, // مونة الأرضيات
    wallsMortar: 0, // مونة الجدران
    plasterMortar: 0, // مونة اللبخ
    materialTransport: 0, // نقل المواد
    electricalMaterials: 0, // المواد الكهربائية
    electricalLabor: 0, // أجور الكهربائي
    plumbingMaterials: 0, // مواد الصحيات
    plumbingLabor: 0, // أجور الصحيات
    brickLabor: 0, // أجور الطابوق
    carpentryAndSteelLabor: 0, // أجور النجارة والحدادة
    facadeLabor: 0, // أجور الواجهة
    externalDoor: 0, // الباب الخارجي
    skylightCost: 0, // سكاي لايت
    cladding: 0, // تطبيق الجدران
    painting: 0, // صبغ الجدران
    plasteringCost: 0, // لبخ الجدران
    bathroomFurnishing: 0, // تأثيث الحمامات
    garageCover: 0, // مسقف الكراج
    electricalBoard: 0, // بورد الكهرباء
    hvac: 0, // دكتات الهواء
  };

  // التحليل الإنشائي
  // حساب وزن المنشأة
  const brickDensity = building.brickType === 'yellow' ? constants.density.brickYellow : building.brickType === 'red' ? constants.density.brickRed : otherBrickInfo.brickDensity;
  const wallsVolume = (technicalDetails.externalWalls24cm + technicalDetails.internalWalls24cm) * (building.groundFloorHeight + (building.floors - 1) * building.otherFloorsHeight) * constants.engineeringRatios.wallThickness;
  const concreteVolume = technicalDetails.concreteVolume + (technicalDetails.totalRoofArea * constants.engineeringRatios.concreteSlabThickness) + (technicalDetails.tiesLength * constants.engineeringRatios.tieBeamSection) + (technicalDetails.invertedBeams * constants.engineeringRatios.invertedBeamSection);
  const brickWeight = wallsVolume * brickDensity;
  const concreteWeight = concreteVolume * constants.density.concrete;
  const liveLoad = technicalDetails.totalRoofArea * constants.liveLoads.residential;
  const totalWeight = ((brickWeight + concreteWeight) * 9.81 / 1000) + liveLoad; // كيلو نيوتن
  const pressure = totalWeight / land.area; // كيلو نيوتن/م²
  const raftType = pressure < constants.soilBearingCapacities.regularRaft ? 'regular' : pressure < constants.soilBearingCapacities.reinforcedRaft ? 'reinforced' : 'special';
  const raftThickness = Math.max(constants.engineeringRatios.minRaftThickness, (pressure / (raftType === 'regular' ? constants.soilBearingCapacities.regularRaft : constants.soilBearingCapacities.reinforcedRaft)) * constants.engineeringRatios.raftSafetyFactor);
  costBreakdown.structural = land.area * (raftType === 'regular' ? constants.raftPrices.regular : raftType === 'reinforced' ? constants.raftPrices.reinforced : constants.raftPrices.special);

  // التحقق من جدران الطابق الأرضي
  let wallCheck = '';
  if (building.brickType !== 'other') {
    const wallLength = technicalDetails.externalWalls24cm + technicalDetails.internalWalls24cm;
    const wallPressure = (totalWeight * 1000) / (wallLength * constants.engineeringRatios.wallThickness); // ميغاباسكال
    const brickStrength = building.brickType === 'yellow' ? constants.brickStrengths.yellow : constants.brickStrengths.red;
    wallCheck = wallPressure < brickStrength ? 'الجدران كافية' : 'تحذير: زيادة طول الجدران أو إضافة أعمدة';
  }

  // دكتات الهواء
  if (building.hasHVAC) {
    const ductLength = technicalDetails.totalRoofArea * constants.engineeringRatios.ductingFactor;
    costBreakdown.hvac = ductLength * constants.materialPrices.ducting;
  }

  // الحفر والفرش
  const excavationDepth = 1 + (basementInfo ? building.basementFloors * 2 : 0);
  const excavationVolume = land.area * excavationDepth;
  const trucks = Math.ceil(excavationVolume / constants.engineeringRatios.truckCapacity);
  costBreakdown.excavation = (excavationVolume * constants.workPrices.excavation) + (trucks * constants.workPrices.transport) + (land.area * constants.workPrices.bedding);

  // الواجهة
  const facadeArea = customFacadeInfo ? building.facadeArea : land.facadeWidth * (building.groundFloorHeight + (building.floors - 1) * building.otherFloorsHeight) - technicalDetails.facadeWindowsDoorsArea;
  costBreakdown.facade = facadeArea * (customFacadeInfo ? building.facadePrice : constants.facadePrices[building.facadeType]);
  costBreakdown.facadeLabor = costBreakdown.facade;

  // الرفت
  const raftArea = land.area - (technicalDetails.garagePathArea || 0) - (technicalDetails.gardenArea || 0);
  costBreakdown.raft = raftArea * (raftType === 'regular' ? constants.raftPrices.regular : raftType === 'reinforced' ? constants.raftPrices.reinforced : constants.raftPrices.special);

  // الأرضيات
  const wallsArea = (technicalDetails.externalWalls24cm + technicalDetails.internalWalls24cm) * (building.groundFloorHeight + (building.floors - 1) * building.otherFloorsHeight) * constants.engineeringRatios.wallThickness;
  const flooringArea = technicalDetails.totalRoofArea + raftArea - wallsArea;
  costBreakdown.flooring = flooringArea * (prices.flooring || constants.workPrices.flooring);

  // الكونكريت
  costBreakdown.concrete = concreteVolume * constants.materialPrices.concrete;

  // الحديد
  const steelQuantity = concreteVolume * constants.engineeringRatios.steelToConcrete;
  costBreakdown.steel = steelQuantity * constants.materialPrices.steel;

  // البياض
  const height = building.groundFloorHeight + (building.floors - 1) * building.otherFloorsHeight;
  const plasteringArea = (technicalDetails.externalWalls24cm * height) + (technicalDetails.internalWalls24cm * height * 2) + technicalDetails.totalRoofArea - (technicalDetails.facadeWindowsDoorsArea || 0) - (technicalDetails.skylightWindowsDoorsArea || 0) - (technicalDetails.claddingWallsArea || 0) - (technicalDetails.secondaryCeilingsArea || 0);
  costBreakdown.plastering = plasteringArea * (prices.wallPainting || constants.workPrices.plastering);
  costBreakdown.painting = costBreakdown.plastering;

  // الطابوق
  let brickCount = 0;
  let brickArea = 0;
  if (building.brickType !== 'other') {
    brickArea = (technicalDetails.externalWalls24cm + technicalDetails.internalWalls24cm) * (height - (technicalDetails.tiesLength * constants.engineeringRatios.tieBeamSection / 0.3));
    brickCount = brickArea / (building.brickType === 'yellow' ? constants.brickVolumes.yellow : constants.brickVolumes.red);
    costBreakdown.bricks = brickCount * constants.materialPrices.brick;
  }
  costBreakdown.brickLabor = Math.ceil(brickCount / 4000) * constants.workPrices.brickLabor;

  // المناور
  const skylightArea = technicalDetails.skylightsArea * (height + building.floors * constants.engineeringRatios.skylightExtraHeight) - (technicalDetails.skylightWindowsDoorsArea || 0);
  costBreakdown.skylights = skylightArea * constants.workPrices.skylight;
  costBreakdown.skylightCost = technicalDetails.skylightsArea * (prices.windowsDoors || constants.materialPrices.windowsDoors);

  // مونة الأرضيات
  const flooringMortarVolume = flooringArea * constants.engineeringRatios.flooringMortarWidth;
  const cementFlooring = flooringMortarVolume * constants.engineeringRatios.cementToMortar;
  const sandFlooring = flooringMortarVolume * constants.engineeringRatios.sandToMortar;
  costBreakdown.flooringMortar = (cementFlooring * constants.materialPrices.cement) + (sandFlooring * constants.materialPrices.sand);

  // مونة الجدران
  const wallsMortarVolume = brickArea * constants.engineeringRatios.wallsMortarWidth;
  const cementWalls = wallsMortarVolume * constants.engineeringRatios.cementToMortar;
  const sandWalls = wallsMortarVolume * constants.engineeringRatios.sandToMortar;
  costBreakdown.wallsMortar = (cementWalls * constants.materialPrices.cement) + (sandWalls * constants.materialPrices.sand);

  // مونة اللبخ
  const plasterMortarVolume = technicalDetails.plasterWallsArea * constants.engineeringRatios.plasterMortarWidth;
  const cementPlaster = plasterMortarVolume * constants.engineeringRatios.cementToMortar;
  const sandPlaster = plasterMortarVolume * constants.engineeringRatios.sandToMortar;
  costBreakdown.plasterMortar = (cementPlaster * constants.materialPrices.cement) + (sandPlaster * constants.materialPrices.sand);
  costBreakdown.plasteringCost = (technicalDetails.plasterWallsArea * constants.workPrices.plastering) + costBreakdown.plasterMortar;

  // نقل المواد
  const totalMaterialVolume = concreteVolume + wallsMortarVolume + plasterMortarVolume + flooringMortarVolume;
  costBreakdown.materialTransport = Math.ceil(totalMaterialVolume / constants.engineeringRatios.truckCapacity) * constants.workPrices.transport;

  // المواد الكهربائية وأجور الكهربائي
  costBreakdown.electricalMaterials = technicalDetails.totalRoofArea * constants.engineeringRatios.electricalPointsPerArea * constants.materialPrices.electricalMaterials;
  costBreakdown.electricalLabor = technicalDetails.totalRoofArea * constants.workPrices.electricalLabor;
  costBreakdown.electricalBoard = (apartmentsInfo ? building.apartmentsCount : 1) * constants.materialPrices.electricalBoard;

  // مواد الصحيات وأجور الصحيات
  costBreakdown.plumbingMaterials = (building.bathrooms * constants.materialPrices.plumbingMaterialsBathroom) + (apartmentsInfo ? building.apartmentsCount : 1) * constants.materialPrices.plumbingMaterialsKitchen;
  costBreakdown.plumbingLabor = technicalDetails.totalRoofArea * constants.workPrices.plumbingLabor;
  costBreakdown.bathroomFurnishing = building.bathrooms * constants.materialPrices.bathroomFurnishing;

  // أجور النجارة والحدادة
  costBreakdown.carpentryAndSteelLabor = concreteVolume * constants.workPrices.carpentryAndSteelLabor;

  // الباب الخارجي
  costBreakdown.externalDoor = (technicalDetails.garagePathArea < constants.externalDoorPrices.garageThreshold) ? constants.externalDoorPrices.small : constants.externalDoorPrices.large;

  // تطبيق الجدران
  costBreakdown.cladding = technicalDetails.claddingWallsArea * (prices.wallInstallation || constants.workPrices.wallInstallation);

  // مسقف الكراج
  costBreakdown.garageCover = (technicalDetails.garagePathArea > constants.externalDoorPrices.garageThreshold) ? constants.workPrices.garageCover : 0;

  // إجمالي التكلفة
  const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);

  // إرجاع النتائج
  return {
    message: 'تم حساب التكاليف بنجاح',
    inputData: { customer, location, land, building },
    totalCost,
    costBreakdown,
    details: {
      governorate: location.governorate,
      landArea: land.area,
      floors: building.floors,
      facadeType: building.facadeType,
      timestamp: new Date().toLocaleString('ar-IQ'),
      wallCheck,
      raftType,
      raftThickness,
      facadeArea,
      raftArea,
      flooringArea,
      concreteVolume,
      steelQuantity,
      plasteringArea,
      brickCount,
      skylightArea,
      flooringMortarVolume,
      wallsMortarVolume,
      plasterMortarVolume,
    },
  };
}

module.exports = { processAdvanced };
