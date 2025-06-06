/**
 * @file advancedCalculate.js
 * @desc معالجة بيانات النموذج من process.js وحساب التكاليف والتحليل الإنشائي بدقة هندسية.
 * @version 1.6.3
 * @remarks
 * - يعالج بيانات التصميم (خرسانة، طابوق، أساس، تكاليف) حسب معايير العراق 2025.
 * - الحسابات مرتبة: كميات، وزن المنشأ، أساس، تكاليف.
 * - تحسينات: تنظيم النتائج لتكون واضحة ومناسبة لتصدير PDF مع تفاصيل هندسية دقيقة.
 * - إزالة التحققات (تُجرى في process.js).
 */

/**
 * @function getMaterialPrices
 * @desc إرجاع أسعار المواد والعمالة بالدينار العراقي لعام 2025.
 * @returns {Object} أسعار المواد والعمالة.
 */
function getMaterialPrices() {
  return {
    concreteC30PerM3: 80000, // خرسانة C30: 80000 د.ع/م³
    concreteC40PerM3: 98000, // خرسانة C40: 98000 د.ع/م³
    steelPerTon: 1500000, // حديد: 1500000 د.ع/طن
    cementOrdinaryPerTon: 120000, // إسمنت: 120000 د.ع/طن
    sandPerM3: 25000, // رمل: 25000 د.ع/م³
    gravelBasePerM3: 30000, // حصى أساس: 30000 د.ع/م³
    sandBasePerM3: 25000, // رمل أساس: 25000 د.ع/م³
    brickYellowPerDbl: 600000, // دبل طابوق أصفر: 600000 د.ع
    brickRedPerDbl: 1250000, // دبل طابوق أحمر: 1250000 د.ع
    brickThermostonePerThousand: 375000, // ألف طابوقة ثرمستون: 375000 د.ع
    gypsumPerTon: 75000, // جبس: 75000 د.ع/طن
    limePerTon: 80000, // جير: 80000 د.ع/طن
    plasterLaborPerM2: 7000, // عمالة جص: 7000 د.ع/م²
    plasterCeilingLaborPerM2: 8000, // عمالة جص أسقف: 8000 د.ع/م²
    primingPerM2: 2000, // تمهيد: 2000 د.ع/م²
    flooringMortarLaborPerM2: 6000, // عمالة مونة أرضيات: 6000 د.ع/م²
    facadeEconomyPerM2: 20000, // واجهة اقتصادية: 20000 د.ع/م²
    facadeSimplePerM2: 30000, // واجهة بسيطة: 30000 د.ع/م²
    facadeLuxuryPerM2: 50000, // واجهة فاخرة: 50000 د.ع/م²
    facadeLaborPerM2: 15000, // عمالة واجهة: 15000 د.ع/م²
    externalDoorFixed: 500000, // باب خارجي: 500000 د.ع
    internalDoorFixed: 300000, // باب داخلي: 300000 د.ع
    carGatePerM2: 30000, // بوابة سيارة: 30000 د.ع/م²
    hvacPerM: 25000, // تكييف: 25000 د.ع/م
    poolFixed: 10000000, // مسبح: 10000000 د.ع
    gardenPerM2: 25000, // حديقة: 25000 د.ع/م²
    fencePerM: 50000, // سياج: 50000 د.ع/م
    elevatorBaseCost: 10000000, // مصعد أساسي: 10000000 د.ع
    elevatorPerFloorCost: 2500000, // مصعد لكل طابق: 2500000 د.ع
    excavationPerM3: 5000, // حفر: 5000 د.ع/م³
    truckTransportPerTrip: 90000, // نقل مخلفات: 90000 د.ع/رحلة
    baseLaborPerM2: 3000, // عمالة أساس: 3000 د.ع/م²
    electricalPointCost: 9000, // نقطة كهربائية: 9000 د.ع
    electricalBoardFixed: 500000, // لوحة كهربائية: 500000 د.ع
    electricalLaborPerPoint: 3000, // عمالة نقطة كهربائية: 3000 د.ع
    plumbingBathroomMaterials: 500000, // مواد سباكة حمام: 500000 د.ع
    plumbingKitchenMaterials: 150000, // مواد سباكة مطبخ: 150000 د.ع
    plumbingOtherMaterials: 100000, // مواد سباكة أخرى: 100000 د.ع
    plumbingBathroomLabor: 1500000, // عمالة سباكة حمام: 1500000 د.ع
    bathroomFittingsPerSet: 1200000, // تجهيزات حمام: 1200000 د.ع/مجموعة
    brickLaborPerDbl: 400000, // عمالة طابوق: 400000 د.ع/دبل
    brickLaborPerThousand: 100000, // عمالة طابوق ثرمستون: 100000 د.ع/ألف
    brickLaborExtraPerFloor: 50000, // زيادة عمالة طابوق لكل طابق: 50000 د.ع
    carpentryLaborPerM3: {
      plywood: 100000, // عمالة نجارة بليوود: 100000 د.ع/م³
      regular: 120000, // عمالة نجارة عادي: 120000 د.ع/م³
      waffle: 150000 // عمالة نجارة وافل: 150000 د.ع/م³
    },
    steelLaborPerM3: 100000, //عماله حديد:100000 د.ع/م³
    skylightsPerM2: 150000, // مناور: 150000 د.ع/م²
    secondaryCeilingsPerM2: 30000, // أسقف ثانوية: 30000 د.ع/م²
    decorativeWallsPerM2: 35000, // جدران زخرفية: 35000 د.ع/م²
    garageCanopyFixed: 1000000, // مظلة مرآب: 1000000 د.ع
    transportConcretePerM3: 2000, // نقل خرسانة: 2000 د.ع/م³
    transportSteelPerTon: 50000, // نقل حديد: 50000 د.ع/طن
    transportCementPerTon: 3000, // نقل إسمنت: 3000 د.ع/طن
    transportSandPerM3: 1500, // نقل رمل: 1500 د.ع/م³
    transportBricksPerDbl: 40000, // نقل طابوق: 40000 د.ع/دبل
    transportBricksThermostonePerThousand: 10000 // نقل ثرمستون: 10000 د.ع/ألف
  };
}

/**
 * @function getEngineeringConstants
 * @desc إرجاع الثوابت الهندسية حسب المعايير العراقية.
 * @returns {Object} الثوابت الهندسية.
 */
async function processAdvanced(data) {
  try {
    // تسجيل البيانات الواردة للتحقق منها
    console.log('📥 **بيانات processAdvanced**:', JSON.stringify(data, null, 2));

    // التحقق من وجود البيانات
    if (!data || typeof data !== 'object') {
      throw new Error('البيانات المدخلة غير صالحة أو غير موجودة');
    }

    // **استخلاص البيانات مع قيم افتراضية آمنة**
    const customer = {
      'الاسم': data.customer?.name ?? 'غير متوفر', // استخدام ?? لضمان قيمة افتراضية
      'الهاتف': data.customer?.phone ?? 'غير متوفر' // نص
    };

    const location = {
      'المحافظة': data.location?.governorate ?? 'غير محدد', // نص
      'المنطقة': data.location?.area ?? 'غير محدد' // نص
    };

    const land = {
      'مساحة الأرض (م²)': data.land?.area ?? 0, // عشري
      'عرض الواجهة (م)': data.land?.facadeWidth ?? 0 // عشري
    };

    const building = {
      'عدد الطوابق': data.building?.floors ?? 0, // صحيح
      'عدد الغرف': data.building?.rooms ?? 0, // صحيح
      'عدد الحمامات': data.building?.bathrooms ?? 0, // صحيح
      'ارتفاع الأرضي (م)': data.building?.groundFloorHeight ?? 0, // عشري
      'ارتفاع الطوابق (م)': data.building?.otherFloorsHeight ?? 0, // عشري
      'سمك السقف (م)': data.building?.ceilingThickness ?? 0, // عشري
      'نوع الطابوق': data.building?.brickType ?? 'yellow', // نص
      'تفاصيل السقف': data.building?.ceilingDetails ?? 'regular', // نص
      'نوع الواجهة': data.building?.facadeType ?? 'economy', // نص
      'حديقة': data.building?.hasGarden ?? false, // منطقي
      'مسبح': data.building?.hasPool ?? false, // منطقي
      'تكييف': data.building?.hasHVAC ?? false, // منطقي
      'مصعد': data.building?.hasElevator ?? false, // منطقي
      'سياج': data.building?.hasFence ?? false, // منطقي
      'حجم الفراغ (م³)': data.waffleSlabInfo ? data.building?.voidSize ?? 0 : 0, // عشري
      'عدد الفراغات': data.waffleSlabInfo ? data.building?.voidCount ?? 0 : 0, // صحيح
      'مساحة الواجهة (م²)': data.customFacadeInfo ? data.building?.facadeArea ?? 0 : 0, // عشري
      'عدد الشقق': data.apartmentsInfo ? data.building?.apartmentsCount ?? 0 : 0, // صحيح
      'عدد الطوابق السفلية': data.basementInfo ? data.building?.basementFloors ?? 0 : 0, // صحيح
      'مساحة السقوف السفلية (م²)': data.basementInfo ? data.building?.basementCeilingArea ?? 0 : 0, // عشري
      'سعر م² الطوابق السفلية': data.basementInfo ? data.building?.basementPrice ?? 0 : 0 // عشري
    };

    const pricesInput = {
      'تشطيب الأرضيات (د.ع/م²)': data.prices?.flooring ?? 0, // عشري
      'تركيب الجدران (د.ع/م²)': data.prices?.wallInstallation ?? 0, // عشري
      'صبغ الجدران (د.ع/م²)': data.prices?.wallPainting ?? 0, // عشري
      'شبابيك وأبواب (د.ع/م²)': data.prices?.windowsDoors ?? 0, // عشري
      'الواجهة (د.ع/م²)': data.customFacadeInfo ? data.prices?.facadePrice ?? 0 : 0, // عشري
      'محجر الدرج (د.ع/م)': data.stairsRailingInfo && data.hasMap ? data.prices?.stairsRailing ?? 0 : 0, // عشري
      'الجدران الداخلية (د.ع/م²)': data.internalWallsInfo && data.hasMap ? data.prices?.internalWalls ?? 0 : 0 // عشري
    };

    const technicalDetails = data.hasMap ? {
      'مساحة السقوف (م²)': data.technicalDetails?.totalRoofArea ?? 0, // عشري
      'مساحة الحديقة (م²)': data.technicalDetails?.gardenArea ?? 0, // عشري
      'مساحة الكراج (م²)': data.technicalDetails?.garagePathArea ?? 0, // عشري
      'مساحة المناور (م²)': data.technicalDetails?.skylightsArea ?? 0, // عشري
      'طول الرباطات (م)': data.technicalDetails?.tiesLength ?? 0, // عشري
      'طول الجسور المقلوبة (م)': data.technicalDetails?.invertedBeams ?? 0, // عشري
      'جدران خارجية 24سم (م)': data.technicalDetails?.externalWalls24cm ?? 0, // عشري
      'جدران داخلية 24سم (م)': data.technicalDetails?.internalWalls24cm ?? 0, // عشري
      'ستارة السطح (م)': data.technicalDetails?.roofFenceLength ?? 0, // عشري
      'عدد الأبواب الخارجية': data.technicalDetails?.externalDoors ?? 0, // صحيح
      'عدد الأبواب الداخلية': data.technicalDetails?.internalDoors ?? 0, // صحيح
      'شبابيك الواجهة (م²)': data.technicalDetails?.facadeWindowsDoorsArea ?? 0, // عشري
      'شبابيك المناور (م²)': data.technicalDetails?.skylightWindowsDoorsArea ?? 0, // عشري
      'سقوف ثانوية (م²)': data.technicalDetails?.secondaryCeilingsArea ?? 0, // عشري
      'جدران ديكورية (م²)': data.technicalDetails?.decorativeWallsArea ?? 0, // عشري
      'جدران التغليف (م²)': data.technicalDetails?.claddingWallsArea ?? 0, // عشري
      'جص خارجي (م²)': data.technicalDetails?.plasterWallsArea ?? 0, // عشري
      'حجم الكونكريت (م³)': data.concreteColumnsInfo && data.hasMap ? data.technicalDetails?.concreteVolume ?? 0 : 0, // عشري
      'محجر الدرج (م)': data.stairsRailingInfo && data.hasMap ? data.technicalDetails?.stairsRailingLength ?? 0 : 0, // عشري
      'مساحة الجدران (م²)': data.internalWallsInfo && data.hasMap ? data.technicalDetails?.internalWallsArea ?? 0 : 0 // عشري
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

    // **دالة لتقريب الأرقام إلى منزلتين عشريتين**
    const roundToTwoDecimals = (num) => isNaN(num) ? 0 : Math.round(num * 100) / 100;

    // **حساب الكميات الأولية**
    // --- خرسانة الأسقف ---
    let roofConcrete = roundToTwoDecimals(technicalDetails['مساحة السقوف (م²)'] * building['سمك السقف (م)']);
    if (waffleSlabInfo && building['تفاصيل السقف'] === 'waffle') {
      const voidVolume = roundToTwoDecimals(building['حجم الفراغ (م³)'] * building['عدد الفراغات']);
      roofConcrete = Math.max(0, roundToTwoDecimals(roofConcrete - voidVolume));
    }

    // --- سمك الجدار حسب نوع الطابوق ---
    const wallThickness = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowDimensions.width
      : building['نوع الطابوق'] === 'red' ? constants.brickRedDimensions.width
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneDimensions.width
      : constants.brickYellowDimensions.width;

    // --- خرسانة الرباطات ---
    const tieBeamConcrete = roundToTwoDecimals(technicalDetails['طول الرباطات (م)'] * constants.tieBeamHeight * wallThickness);

    // --- خرسانة الجسور المقلوبة ---
    const invertedBeamConcrete = roundToTwoDecimals(technicalDetails['طول الجسور المقلوبة (م)'] * constants.invertedBeamHeight * wallThickness);

    // --- خرسانة إضافية ---
    const additionalConcrete = concreteColumnsInfo ? roundToTwoDecimals(technicalDetails['حجم الكونكريت (م³)'] || 0) : 0;

    // --- إجمالي الخرسانة الأولية ---
    let totalConcrete = roundToTwoDecimals(roofConcrete + tieBeamConcrete + invertedBeamConcrete + additionalConcrete);

    // --- الجدران ---
    const totalWallLength = roundToTwoDecimals(technicalDetails['جدران خارجية 24سم (م)'] + technicalDetails['جدران داخلية 24سم (م)']);
    const coverageRatio = totalWallLength > 0 ? Math.min(1, roundToTwoDecimals(technicalDetails['طول الرباطات (م)'] / totalWallLength)) : 0;

    // --- ارتفاع الجدران الصافي ---
    const adjustedGroundFloorHeight = roundToTwoDecimals(building['ارتفاع الأرضي (م)'] - (coverageRatio * constants.tieBeamHeight));
    const adjustedOtherFloorsHeight = roundToTwoDecimals(building['ارتفاع الطوابق (م)'] - (coverageRatio * constants.tieBeamHeight));
    const totalWallHeight = roundToTwoDecimals(adjustedGroundFloorHeight + (building['عدد الطوابق'] - 1) * adjustedOtherFloorsHeight);

    // --- حجم الجدران ---
    const externalWallsVolume = roundToTwoDecimals(technicalDetails['جدران خارجية 24سم (م)'] * totalWallHeight * wallThickness);
    const internalWallsVolume = roundToTwoDecimals(technicalDetails['جدران داخلية 24سم (م)'] * totalWallHeight * wallThickness);

    // --- الفتحات ---
    const facadeOpeningsVolume = roundToTwoDecimals(technicalDetails['شبابيك الواجهة (م²)'] * wallThickness);
    const skylightOpeningsVolume = roundToTwoDecimals(technicalDetails['شبابيك المناور (م²)'] * wallThickness);
    const externalDoorsVolume = roundToTwoDecimals(technicalDetails['عدد الأبواب الخارجية'] * 
      constants.externalDoorDimensions.width * constants.externalDoorDimensions.height * wallThickness);
    const internalDoorsVolume = roundToTwoDecimals(technicalDetails['عدد الأبواب الداخلية'] * 
      constants.internalDoorDimensions.width * constants.internalDoorDimensions.height * wallThickness);
    const totalOpeningsVolume = roundToTwoDecimals(facadeOpeningsVolume + skylightOpeningsVolume + externalDoorsVolume + internalDoorsVolume);

    // --- حجم الجدران الصافي ---
    const wallsVolume = Math.max(0, roundToTwoDecimals(externalWallsVolume + internalWallsVolume - totalOpeningsVolume));

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
      const brickWithMortarVolume = roundToTwoDecimals(constants.brickThermostoneDimensions.width * brickWithMortarLength * brickWithMortarHeight);
      brickCount = Math.ceil(wallsVolume / brickWithMortarVolume);
      brickDbls = Math.ceil(brickCount / 1000);
    } else {
      const coveragePerDbl = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowCoveragePerDbl
        : building['نوع الطابوق'] === 'red' ? constants.brickRedCoveragePerDbl
        : constants.brickYellowCoveragePerDbl;
      brickDbls = Math.ceil(wallsVolume / coveragePerDbl);
      brickCount = brickDbls * constants.bricksPerDbl;
    }

    // **حساب الأرضيات والمونة**
    const groundFloorArea = roundToTwoDecimals(land['مساحة الأرض (م²)'] - technicalDetails['مساحة الحديقة (م²)'] - technicalDetails['مساحة الكراج (م²)']);
    const roofAreaPerFloor = building['عدد الطوابق'] > 0 ? roundToTwoDecimals(technicalDetails['مساحة السقوف (م²)'] / building['عدد الطوابق']) : 0;
    const otherFloorsArea = roundToTwoDecimals(roofAreaPerFloor * (building['عدد الطوابق'] - 1));
    const wallsAreaPerFloor = roundToTwoDecimals((technicalDetails['جدران خارجية 24سم (م)'] + technicalDetails['جدران داخلية 24سم (م)']) * wallThickness);
    const flooringArea = Math.max(0, roundToTwoDecimals(groundFloorArea + otherFloorsArea - wallsAreaPerFloor * building['عدد الطوابق']));
    const wallMortarArea = roundToTwoDecimals(technicalDetails['جدران التغليف (م²)'] || 0);

    // **حساب الجص الخارجي**
    const skylightArea = roundToTwoDecimals(technicalDetails['مساحة المناور (م²)']);
    const skylightWidth = skylightArea > 0 ? roundToTwoDecimals(Math.sqrt(skylightArea / 3)) : 0;
    const skylightLength = roundToTwoDecimals(skylightWidth * 3);
    const skylightLongestWallArea = roundToTwoDecimals(skylightLength * totalWallHeight);
    let externalWallsPlasterArea = roundToTwoDecimals(technicalDetails['جدران خارجية 24سم (م)'] * totalWallHeight - 
      technicalDetails['شبابيك الواجهة (م²)'] - 
      technicalDetails['عدد الأبواب الخارجية'] * constants.externalDoorDimensions.width * constants.externalDoorDimensions.height - 
      skylightLongestWallArea);

    // **حساب جدران المناور**
    const skylightPerimeter = skylightArea > 0 ? roundToTwoDecimals(2 * (skylightLength + skylightWidth)) : 0;
    const skylightHeightPerFloor = roundToTwoDecimals(building['ارتفاع الطوابق (م)'] + building['سمك السقف (م)']);
    const totalSkylightHeight = roundToTwoDecimals(adjustedGroundFloorHeight + (building['عدد الطوابق'] - 1) * skylightHeightPerFloor);
    const skylightWallsPlasterArea = roundToTwoDecimals(skylightPerimeter * totalSkylightHeight - 
      technicalDetails['شبابيك المناور (م²)']);

    // **حساب الجص الداخلي**
    const skylightInternalWallsArea = skylightArea > 0 ? roundToTwoDecimals((2 * skylightWidth + skylightLength) * totalSkylightHeight - 
      technicalDetails['شبابيك المناور (م²)']) : 0;
    let internalWallsPlasterArea = roundToTwoDecimals((technicalDetails['جدران داخلية 24سم (م)'] * totalWallHeight * 2) - 
      (technicalDetails['عدد الأبواب الداخلية'] * constants.internalDoorDimensions.width * constants.internalDoorDimensions.height) - 
      skylightInternalWallsArea);

    // **حساب جص الأسقف**
    const ceilingPlasterArea = roundToTwoDecimals(roofAreaPerFloor * (building['عدد الطوابق'] - 1) - 
      technicalDetails['سقوف ثانوية (م²)'] - 
      wallsAreaPerFloor);

    // **حساب إطارات الشبابيك والأبواب للجص**
    const frameHeight = roundToTwoDecimals(adjustedGroundFloorHeight);
    const facadeWindowsFramePerimeter = technicalDetails['شبابيك الواجهة (م²)'] > 0 
      ? roundToTwoDecimals(2 * (Math.sqrt(technicalDetails['شبابيك الواجهة (م²)']) + frameHeight)) 
      : 0;
    const skylightWindowsFramePerimeter = technicalDetails['شبابيك المناور (م²)'] > 0 
      ? roundToTwoDecimals(2 * (Math.sqrt(technicalDetails['شبابيك المناور (م²)']) + frameHeight)) 
      : 0;
    const externalDoorsFramePerimeter = roundToTwoDecimals(technicalDetails['عدد الأبواب الخارجية'] * 
      (constants.externalDoorDimensions.width + 2 * constants.externalDoorDimensions.height));
    const internalDoorsFramePerimeter = roundToTwoDecimals(technicalDetails['عدد الأبواب الداخلية'] * 
      (constants.internalDoorDimensions.width + 2 * constants.internalDoorDimensions.height));
    const windowsFrameAreaExternal = roundToTwoDecimals((facadeWindowsFramePerimeter + skylightWindowsFramePerimeter) * (wallThickness / 2));
    const externalDoorsFrameArea = roundToTwoDecimals(externalDoorsFramePerimeter * (wallThickness / 2));
    const internalDoorsFrameArea = roundToTwoDecimals(internalDoorsFramePerimeter * wallThickness);
    externalWallsPlasterArea += roundToTwoDecimals(windowsFrameAreaExternal + externalDoorsFrameArea);
    internalWallsPlasterArea += roundToTwoDecimals(windowsFrameAreaExternal + internalDoorsFrameArea);
    const totalPlasterArea = Math.max(0, roundToTwoDecimals(externalWallsPlasterArea + internalWallsPlasterArea + ceilingPlasterArea - wallMortarArea));

    // **حساب وزن المنشأ**
    const concreteWeight = roundToTwoDecimals(totalConcrete * constants.concreteDensity);
    const roofSteel = roundToTwoDecimals(totalConcrete * constants.steelPerM3ConcreteRoof / 1000);
    const steelWeight = roundToTwoDecimals(roofSteel * constants.steelDensity);
    const brickWeight = roundToTwoDecimals(wallsVolume * brickDensity);
    const floorMortarWeight = roundToTwoDecimals(flooringArea * constants.mortarFloorThickness * constants.mortarFloorDensity);
    const wallMortarWeight = roundToTwoDecimals(wallMortarArea * constants.mortarWallsThickness * constants.mortarWallsDensity);
    const flooringWeight = roundToTwoDecimals(flooringArea * constants.mortarFloorThickness * constants.flooringDensity);
    const plasterWeight = roundToTwoDecimals(totalPlasterArea * constants.plasterThickness * 
      (constants.gypsumDensity * 0.75 + constants.limeDensity * 0.25));
    const liveLoadWeight = roundToTwoDecimals(roofAreaPerFloor * (
      building['عدد الطوابق'] === 1 ? constants.liveLoadPerM2GroundFloor : 
      ((constants.liveLoadPerM2GroundFloor + (building['عدد الطوابق'] - 1) * constants.liveLoadPerM2OtherFloors + constants.liveLoadPerM2Roof) / building['عدد الطوابق'])
    ));
    const additionalDeadLoadWeight = roundToTwoDecimals((roofAreaPerFloor + technicalDetails['سقوف ثانوية (م²)'] + 
      technicalDetails['جدران ديكورية (م²)']) * constants.deadLoadAdditionalPerM2);
    const waterTanksWeight = roundToTwoDecimals(building['عدد الحمامات'] * constants.waterTankWeight);
    const heatersWeight = roundToTwoDecimals(building['عدد الحمامات'] * constants.heaterWeight);
    const externalDoorsWeight = roundToTwoDecimals(technicalDetails['عدد الأبواب الخارجية'] * constants.externalDoorWeight);
    const internalDoorsWeight = roundToTwoDecimals(technicalDetails['عدد الأبواب الداخلية'] * constants.internalDoorWeight);
    const windowsWeight = roundToTwoDecimals((technicalDetails['شبابيك الواجهة (م²)'] + 
      technicalDetails['شبابيك المناور (م²)']) * constants.windowWeightPerM2);
    const totalOpeningsWeight = roundToTwoDecimals(externalDoorsWeight + internalDoorsWeight + windowsWeight);
    const screedWeight = roundToTwoDecimals(roofAreaPerFloor * constants.screedThickness * constants.screedDensity);
    const totalWeight = roundToTwoDecimals((concreteWeight + steelWeight + brickWeight + floorMortarWeight + 
      wallMortarWeight + flooringWeight + plasterWeight + liveLoadWeight + additionalDeadLoadWeight + 
      waterTanksWeight + heatersWeight + totalOpeningsWeight + screedWeight) * constants.gravityConstant / 1000);

    // **حساب الأساس**
    const raftArea = roundToTwoDecimals(land['مساحة الأرض (م²)'] - technicalDetails['مساحة الحديقة (م²)'] - 
      technicalDetails['مساحة الكراج (م²)']);
    const pressure = roundToTwoDecimals(totalWeight / (raftArea || 1)); // تجنب القسمة على صفر
    const requiredRaftThickness = Math.max(
      constants.minRaftThickness,
      Math.min(
        constants.maxRaftThickness,
        roundToTwoDecimals((pressure / (constants.soilBearingCapacity / constants.safetyFactorFoundation)) * 0.3)
      )
    );
    const raftThickness = roundToTwoDecimals(requiredRaftThickness);
    let raftType;
    let foundationRecommendation = '';
    if (raftThickness <= 0.3) {
      raftType = 'عادي';
      foundationRecommendation = 'أساس ركائزي مناسب للأحمال الخفيفة.';
    } else if (raftThickness <= 0.8) {
      raftType = 'مقوى';
      foundationRecommendation = 'أساس مقوى مع طبقة خرسانية سميكة.';
    } else {
      raftType = 'غير مناسب';
      foundationRecommendation = 'يُنصح باستخدام أساسات شريطية أو خوازيق لتقليل التكلفة.';
    }
    const raftVolume = roundToTwoDecimals(raftArea * raftThickness);

    // **حساب حجم الحفر**
    const excavationDepth = roundToTwoDecimals(((building['عدد الطوابق السفلية'] || 0) * constants.excavationDepthBasement) + constants.baseLayerThickness);
    const excavationVolume = roundToTwoDecimals(land['مساحة الأرض (م²)'] * excavationDepth);
    const truckTrips = Math.ceil(excavationVolume / 24);

    // **الكميات النهائية**
    totalConcrete = roundToTwoDecimals(totalConcrete + raftVolume);
    const foundationSteel = roundToTwoDecimals(raftVolume * constants.steelPerM3ConcreteFoundation / 1000);
    const totalSteel = roundToTwoDecimals(roofSteel + foundationSteel);
    const baseVolume = roundToTwoDecimals(raftArea * constants.baseLayerThickness);
    const gravelBase = roundToTwoDecimals(baseVolume * 0.6);
    const sandBase = roundToTwoDecimals(baseVolume * 0.4);
    const cementForFloorMortar = roundToTwoDecimals(flooringArea * constants.cementPerM2MortarFloor);
    const sandForFloorMortar = roundToTwoDecimals(flooringArea * constants.sandPerM2MortarFloor);
    const cementForWallMortar = roundToTwoDecimals(wallMortarArea * constants.cementPerM2MortarWalls);
    const sandForWallMortar = roundToTwoDecimals(wallMortarArea * constants.sandPerM2MortarWalls);
    const gypsumQuantity = roundToTwoDecimals(totalPlasterArea * constants.gypsumPerM2Plaster);
    const limeQuantity = roundToTwoDecimals(totalPlasterArea * constants.limePerM2Plaster);

    // **استقرار الجدران**
    const brickCompressiveStrength = building['نوع الطابوق'] === 'yellow' ? constants.brickYellowCompressiveStrength
      : building['نوع الطابوق'] === 'red' ? constants.brickRedCompressiveStrength
      : building['نوع الطابوق'] === 'thermostone' ? constants.brickThermostoneCompressiveStrength
      : constants.brickYellowCompressiveStrength;
    const wallCapacity = roundToTwoDecimals(brickCompressiveStrength * 1000 * wallThickness * totalWallLength);
    const minWallLength = roundToTwoDecimals(totalWeight / (brickCompressiveStrength * 1000 * wallThickness));
    const isWallStable = totalWallLength >= minWallLength;
    const stabilityNote = isWallStable ? 'الجدران مستقرة وتتحمل الأحمال.' : 'الجدران غير مستقرة، يُنصح بزيادة طول الجدران أو استخدام دعامات إضافية.';

    // **حساب الواجهة**
    const facadeArea = customFacadeInfo ? roundToTwoDecimals(building['مساحة الواجهة (م²)']) 
      : roundToTwoDecimals(land['عرض الواجهة (م)'] * (building['ارتفاع الأرضي (م)'] + building['ارتفاع الطوابق (م)'] * (building['عدد الطوابق'] - 1)) - 
        technicalDetails['شبابيك الواجهة (م²)']);
    const facadeCost = customFacadeInfo ? roundToTwoDecimals(facadeArea * pricesInput['الواجهة (د.ع/م²)'])
      : roundToTwoDecimals(facadeArea * (building['نوع الواجهة'] === 'economy' ? prices.facadeEconomyPerM2
        : building['نوع الواجهة'] === 'simple' ? prices.facadeSimplePerM2 : prices.facadeLuxuryPerM2));

    // **حساب المناور**
    const skylightCost = building['حديقة'] 
      ? roundToTwoDecimals(technicalDetails['مساحة الحديقة (م²)'] * prices.gardenPerM2)
      : roundToTwoDecimals(skylightWallsPlasterArea * prices.plasterLaborPerM2);

    // **حساب التكاليف**
    const costBreakdown = {
      'خرسانة': roundToTwoDecimals((totalConcrete - raftVolume) * prices.concreteC30PerM3 + raftVolume * prices.concreteC40PerM3),
      'حديد التسليح': roundToTwoDecimals(totalSteel * prices.steelPerTon),
      'إسمنت': roundToTwoDecimals((cementForFloorMortar + cementForWallMortar) * prices.cementOrdinaryPerTon),
      'رمل': roundToTwoDecimals((sandForFloorMortar + sandForWallMortar) * prices.sandPerM3),
      'حصى الأساس': roundToTwoDecimals(gravelBase * prices.gravelBasePerM3),
      'رمل الأساس': roundToTwoDecimals(sandBase * prices.sandBasePerM3),
      'عمالة الأساس': roundToTwoDecimals(raftArea * prices.baseLaborPerM2),
      'طابوق': building['نوع الطابوق'] === 'thermostone' 
        ? roundToTwoDecimals(BbrickDbls * prices.brickThermostonePerThousand)
        : roundToTwoDecimals(brickDbls * (building['نوع الطابوق'] === 'yellow' ? prices.brickYellowPerDbl : prices.brickRedPerDbl)),
      'جبس': roundToTwoDecimals(gypsumQuantity * prices.gypsumPerTon),
      'جير': roundToTwoDecimals(limeQuantity * prices.limePerTon),
      'حفر': roundToTwoDecimals(excavationVolume * prices.excavationPerM3),
      'نقل المخلفات': roundToTwoDecimals(truckTrips * prices.truckTransportPerTrip),
      'تشطيب الأرضيات': roundToTwoDecimals(flooringArea * pricesInput['تشطيب الأرضيات (د.ع/م²)']),
      'عمالة مونة الأرضيات': roundToTwoDecimals(flooringArea * prices.flooringMortarLaborPerM2),
      'الواجهة': facadeCost,
      'عمالة الواجهة': roundToTwoDecimals(facadeArea * prices.facadeLaborPerM2),
      'شبابيك وأبواب': roundToTwoDecimals(technicalDetails['شبابيك الواجهة (م²)'] * pricesInput['شبابيك وأبواب (د.ع/م²)']),
      'أبواب خارجية': roundToTwoDecimals(technicalDetails['عدد الأبواب الخارجية'] * prices.externalDoorFixed),
      'أبواب داخلية': roundToTwoDecimals(technicalDetails['عدد الأبواب الداخلية'] * prices.internalDoorFixed),
      'بوابة سيارة': technicalDetails['مساحة الكراج (م²)'] >= 24 ? roundToTwoDecimals(land['عرض الواجهة (م)'] * 2 * prices.carGatePerM2) : 0,
      'مناور': skylightCost,
      'جدران التغليف': roundToTwoDecimals(wallMortarArea * pricesInput['تركيب الجدران (د.ع/م²)']),
      'صبغ الجدران': roundToTwoDecimals((totalPlasterArea + technicalDetails['سقوف ثانوية (م²)']) * pricesInput['صبغ الجدران (د.ع/م²)']),
      'عمالة الجص': roundToTwoDecimals((externalWallsPlasterArea + internalWallsPlasterArea) * prices.plasterLaborPerM2 + 
        ceilingPlasterArea * prices.plasterCeilingLaborPerM2),
      'التمهيد': roundToTwoDecimals((externalWallsPlasterArea + internalWallsPlasterArea) * prices.primingPerM2),
      'عمالة الطابوق': building['نوع الطابوق'] === 'thermostone'
        ? roundToTwoDecimals(Array.from({ length: building['عدد الطوابق'] }, (_, i) => {
            const bricksPerFloor = Math.ceil(brickCount / building['عدد الطوابق']);
            return Math.ceil(bricksPerFloor / 1000) * (prices.brickLaborPerThousand + i * prices.brickLaborExtraPerFloor);
          }).reduce((sum, cost) => sum + cost, 0))
        : roundToTwoDecimals(Array.from({ length: building['عدد الطوابق'] }, (_, i) => {
            const brickDblsPerFloor = Math.ceil(brickDbls / building['عدد الطوابق']);
            return brickDblsPerFloor * (prices.brickLaborPerDbl + i * prices.brickLaborExtraPerFloor);
          }).reduce((sum, cost) => sum + cost, 0)),
      'عمالة النجارة والتسليح': roundToTwoDecimals(totalConcrete * (prices.carpentryLaborPerM3[building['تفاصيل السقف'] || 'regular'] + prices.steelLaborPerM3)),
      'نقل المواد': building['نوع الطابوق'] === 'thermostone'
        ? roundToTwoDecimals(totalConcrete * prices.transportConcretePerM3 + 
           totalSteel * prices.transportSteelPerTon + 
           (cementForFloorMortar + cementForWallMortar) * prices.transportCementPerTon + 
           (sandForFloorMortar + sandForWallMortar) * prices.transportSandPerM3 + 
           brickDbls * prices.transportBricksThermostonePerThousand)
        : roundToTwoDecimals(totalConcrete * prices.transportConcretePerM3 + 
           totalSteel * prices.transportSteelPerTon + 
           (cementForFloorMortar + cementForWallMortar) * prices.transportCementPerTon + 
           (sandForFloorMortar + sandForWallMortar) * prices.transportSandPerM3 + 
           brickDbls * prices.transportBricksPerDbl),
      'مواد كهربائية': roundToTwoDecimals(((technicalDetails['جدران خارجية 24سم (م)'] * 1 + technicalDetails['جدران داخلية 24سم (م)'] * 2) * 
        constants.electricalPointsPerMWall + roofAreaPerFloor * constants.electricalPointsPerM2Ceiling) * 
        prices.electricalPointCost + prices.electricalBoardFixed * (1 + (apartmentsInfo ? building['عدد الشقق'] : 0))),
      'عمالة كهربائية': roundToTwoDecimals(((technicalDetails['جدران خارجية 24سم (م)'] * 1 + technicalDetails['جدران داخلية 24سم (م)'] * 2) * 
        constants.electricalPointsPerMWall + roofAreaPerFloor * constants.electricalPointsPerM2Ceiling) * 
        prices.electricalLaborPerPoint),
      'مواد السباكة': roundToTwoDecimals(building['عدد الحمامات'] * prices.plumbingBathroomMaterials + 
        (apartmentsInfo ? building['عدد الشقق'] : 1) * (prices.plumbingKitchenMaterials + prices.plumbingOtherMaterials)),
      'عمالة السباكة': roundToTwoDecimals(building['عدد الحمامات'] * prices.plumbingBathroomLabor),
      'تجهيزات الحمامات': roundToTwoDecimals(building['عدد الحمامات'] * prices.bathroomFittingsPerSet),
      'تكييف': building['تكييف'] ? roundToTwoDecimals((technicalDetails['جدران خارجية 24سم (م)'] + technicalDetails['جدران داخلية 24سم (م)']) * prices.hvacPerM) : 0,
      'مسبح': building['مسبح'] ? prices.poolFixed : 0,
      'سياج': building['سياج'] ? roundToTwoDecimals(technicalDetails['ستارة السطح (م)'] * prices.fencePerM) : 0,
      'مصعد': building['مصعد'] ? roundToTwoDecimals(prices.elevatorBaseCost + prices.elevatorPerFloorCost * building['عدد الطوابق']) : 0,
      'سقوف ثانوية': roundToTwoDecimals(technicalDetails['سقوف ثانوية (م²)'] * prices.secondaryCeilingsPerM2),
      'جدران ديكورية': roundToTwoDecimals(technicalDetails['جدران ديكورية (م²)'] * prices.decorativeWallsPerM2),
      'مظلة الكراج': technicalDetails['مساحة الكراج (م²)'] >= 24 ? prices.garageCanopyFixed : 0,
      'محجر الدرج': stairsRailingInfo ? roundToTwoDecimals(technicalDetails['محجر الدرج (م)'] * pricesInput['محجر الدرج (د.ع/م)']) : 0,
      'الجدران الداخلية': internalWallsInfo ? roundToTwoDecimals(technicalDetails['مساحة الجدران (م²)'] * pricesInput['الجدران الداخلية (د.ع/م²)']) : 0,
      'الطوابق السفلية': basementInfo ? roundToTwoDecimals(building['مساحة السقوف السفلية (م²)'] * building['سعر م² الطوابق السفلية']) : 0
    };

    // إجمالي التكلفة
    const totalCost = roundToTwoDecimals(Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0));

    // **تحضير البيانات لتقرير PDF**
    const pdfData = {
      // الصفحة الأولى: نبذة عن الشركة
      companyInfo: {
        name: 'شركة الإنشاءات الهندسية المحدودة',
        description: 'شركة رائدة في تقديم الحلول الهندسية المتكاملة لتصميم وبناء المشاريع السكنية والتجارية وفقًا لأعلى معايير الجودة في العراق.',
        contact: {
          phone: '1234-567-890',
          email: 'info@engineeringco.iq',
          address: 'بغداد، العراق'
        },
        logo: 'path/to/logo.png' // سيتم استبداله في HTML
      },

      // الصفحة الثانية: البيانات المدخلة
      inputData: {
        customer: {
          title: 'بيانات العميل',
          fields: [
            { label: 'الاسم', value: customer['الاسم'] || 'غير متوفر' },
            { label: 'رقم الهاتف', value: customer['الهاتف'] || 'غير متوفر' }
          ]
        },
        location: {
          title: 'معلومات الموقع',
          fields: [
            { label: 'المحافظة', value: location['المحافظة'] || 'غير محدد' },
            { label: 'المنطقة', value: location['المنطقة'] || 'غير محدد' }
          ]
        },
        land: {
          title: 'معلومات الأرض',
          fields: [
            { label: 'مساحة الأرض (م²)', value: land['مساحة الأرض (م²)'] || 0 },
            { label: 'عرض الواجهة (م)', value: land['عرض الواجهة (م)'] || 0 }
          ]
        },
        building: {
          title: 'تفاصيل المبنى',
          fields: [
            { label: 'عدد الطوابق', value: building['عدد الطوابق'] || 0 },
            { label: 'عدد الغرف', value: building['عدد الغرف'] || 0 },
            { label: 'عدد الحمامات', value: building['عدد الحمامات'] || 0 },
            { label: 'ارتفاع الطابق الأرضي (م)', value: building['ارتفاع الأرضي (م)'] || 0 },
            { label: 'ارتفاع الطوابق الأخرى (م)', value: building['ارتفاع الطوابق (م)'] || 0 },
            { label: 'سمك السقف (م)', value: building['سمك السقف (م)'] || 0 },
            { label: 'نوع الطابوق', value: building['نوع الطابوق'] === 'yellow' ? 'طابوق أصفر' : building['نوع الطابوق'] === 'red' ? 'طابوق أحمر' : 'ثرمستون' },
            { label: 'نوع الواجهة', value: building['نوع الواجهة'] === 'economy' ? 'اقتصادية' : building['نوع الواجهة'] === 'simple' ? 'بسيطة' : 'فاخرة' },
            { label: 'وجود حديقة', value: building['حديقة'] ? 'نعم' : 'لا' },
            { label: 'وجود مسبح', value: building['مسبح'] ? 'نعم' : 'لا' },
            { label: 'وجود تكييف', value: building['تكييف'] ? 'نعم' : 'لا' },
            { label: 'وجود مصعد', value: building['مصعد'] ? 'نعم' : 'لا' },
            { label: 'وجود سياج', value: building['سياج'] ? 'نعم' : 'لا' }
          ]
        }
      },

      // الصفحة الثالثة: الكميات
      quantities: {
        title: 'تفاصيل الكميات الهندسية',
        sections: [
          {
            subtitle: 'الخرسانة',
            items: [
              { name: 'إجمالي الخرسانة', value: totalConcrete, unit: 'م³' },
              { name: 'خرسانة الأسقف', value: roofConcrete, unit: 'م³' },
              { name: 'خرسانة الرباطات', value: tieBeamConcrete, unit: 'م³' },
              { name: 'خرسانة الجسور المقلوبة', value: invertedBeamConcrete, unit: 'م³' },
              { name: 'خرسانة إضافية', value: additionalConcrete, unit: 'م³' },
              { name: 'خرسانة الأساس', value: raftVolume, unit: 'م³' }
            ]
          },
          {
            subtitle: 'الطابوق',
            items: [
              { name: 'عدد الطابوقات', value: brickCount, unit: 'طابوقة' },
              { name: 'عدد الدبلات/الآلاف', value: brickDbls, unit: building['نوع الطابوق'] === 'thermostone' ? 'ألف' : 'دبل' },
              { name: 'حجم الجدران الصافي', value: wallsVolume, unit: 'م³' }
            ]
          },
          {
            subtitle: 'المونة والأرضيات',
            items: [
              { name: 'إسمنت مونة الأرضيات', value: cementForFloorMortar, unit: 'طن' },
              { name: 'رمل مونة الأرضيات', value: sandForFloorMortar, unit: 'م³' },
              { name: 'إسمنت مونة الجدران', value: cementForWallMortar, unit: 'طن' },
              { name: 'رمل مونة الجدران', value: sandForWallMortar, unit: 'م³' },
              { name: 'مساحة الأرضيات', value: flooringArea, unit: 'م²' }
            ]
          },
          {
            subtitle: 'الجص',
            items: [
              { name: 'إجمالي مساحة الجص', value: totalPlasterArea, unit: 'م²' },
              { name: 'كمية الجبس', value: gypsumQuantity, unit: 'طن' },
              { name: 'كمية الجير', value: limeQuantity, unit: 'طن' }
            ]
          },
          {
            subtitle: 'الأساس',
            items: [
              { name: 'حجم الحفر', value: excavationVolume, unit: 'م³' },
              { name: 'عدد رحلات النقل', value: truckTrips, unit: 'رحلة' },
              { name: 'حصى الأساس', value: gravelBase, unit: 'م³' },
              { name: 'رمل الأساس', value: sandBase, unit: 'م³' }
            ]
          },
          {
            subtitle: 'حديد التسليح',
            items: [
              { name: 'إجمالي حديد التسليح', value: totalSteel, unit: 'طن' }
            ]
          }
        ]
      },

      // الصفحة الرابعة: الحسابات الإنشائية
      engineering: {
        title: 'الحسابات الإنشائية',
        sections: [
          {
            subtitle: 'وزن المنشأ',
            items: [
              { name: 'إجمالي وزن المنشأ', value: totalWeight, unit: 'kN' },
              { name: 'وزن الخرسانة', value: roundToTwoDecimals(concreteWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن حديد التسليح', value: roundToTwoDecimals(steelWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن الطابوق', value: roundToTwoDecimals(brickWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن المونة', value: roundToTwoDecimals((floorMortarWeight + wallMortarWeight) * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن الأرضيات', value: roundToTwoDecimals(flooringWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن الجص', value: roundToTwoDecimals(plasterWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'الحمل الحي', value: roundToTwoDecimals(liveLoadWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'الحمل الميت الإضافي', value: roundToTwoDecimals(additionalDeadLoadWeight * constants.gravityConstant / 1000), unit: 'kN' },
              { name: 'وزن الفتحات', value: roundToTwoDecimals(totalOpeningsWeight * constants.gravityConstant / 1000), unit: 'kN' }
            ]
          },
          {
            subtitle: 'الأساس',
            items: [
              { name: 'مساحة الأساس', value: raftArea, unit: 'م²' },
              { name: 'سمك الأساس', value: raftThickness, unit: 'م' },
              { name: 'ضغط الأساس', value: pressure, unit: 'kN/m²' },
              { name: 'نوع الأساس', value: raftType, unit: '' },
              { name: 'توصيات الأساس', value: foundationRecommendation, unit: '' }
            ]
          },
          {
            subtitle: 'استقرار الجدران',
            items: [
              { name: 'سعة تحمل الجدران', value: wallCapacity, unit: 'kN' },
              { name: 'الحد الأدنى لطول الجدران', value: minWallLength, unit: 'م' },
              { name: 'حالة الاستقرار', value: stabilityNote, unit: '' }
            ]
          }
        ]
      },

      // الصفحة الخامسة: قائمة الأسعار
      costs: {
        title: 'تفاصيل التكاليف',
        total: totalCost,
        items: Object.entries(costBreakdown).map(([name, value]) => ({
          name,
          value: roundToTwoDecimals(value),
          unit: 'د.ع'
        }))
      },

      // الصفحة السادسة: قائمة أسعار المواد
      materialPrices: {
        title: 'أسعار المواد المعتمدة (2025)',
        items: Object.entries(prices).map(([key, value]) => {
          let name, unit;
          switch (key) {
            case 'concreteC30PerM3': name = 'خرسانة C30'; unit = 'د.ع/م³'; break;
            case 'concreteC40PerM3': name = 'خرسانة C40'; unit = 'د.ع/م³'; break;
            case 'steelPerTon': name = 'حديد التسليح'; unit = 'د.ع/طن'; break;
            case 'cementOrdinaryPerTon': name = 'إسمنت عادي'; unit = 'د.ع/طن'; break;
            case 'sandPerM3': name = 'رمل'; unit = 'د.ع/م³'; break;
            case 'gravelBasePerM3': name = 'حصى الأساس'; unit = 'د.ع/م³'; break;
            case 'sandBasePerM3': name = 'رمل الأساس'; unit = 'د.ع/م³'; break;
            case 'brickYellowPerDbl': name = 'طابوق أصفر (دبل)'; unit = 'د.ع/دبل'; break;
            case 'brickRedPerDbl': name = 'طابوق أحمر (دبل)'; unit = 'د.ع/دبل'; break;
            case 'brickThermostonePerThousand': name = 'طابوق ثرمستون (ألف)'; unit = 'د.ع/ألف'; break;
            case 'gypsumPerTon': name = 'جبس'; unit = 'د.ع/طن'; break;
            case 'limePerTon': name = 'جير'; unit = 'د.ع/طن'; break;
            case 'plasterLaborPerM2': name = 'عمالة الجص'; unit = 'د.ع/م²'; break;
            case 'plasterCeilingLaborPerM2': name = 'عمالة جص الأسقف'; unit = 'د.ع/م²'; break;
            case 'primingPerM2': name = 'التمهيد'; unit = 'د.ع/م²'; break;
            case 'flooringMortarLaborPerM2': name = 'عمالة مونة الأرضيات'; unit = 'د.ع/م²'; break;
            case 'facadeEconomyPerM2': name = 'واجهة اقتصادية'; unit = 'د.ع/م²'; break;
            case 'facadeSimplePerM2': name = 'واجهة بسيطة'; unit = 'د.ع/م²'; break;
            case 'facadeLuxuryPerM2': name = 'واجهة فاخرة'; unit = 'د.ع/م²'; break;
            case 'facadeLaborPerM2': name = 'عمالة الواجهة'; unit = 'د.ع/م²'; break;
            case 'externalDoorFixed': name = 'باب خارجي'; unit = 'د.ع'; break;
            case 'internalDoorFixed': name = 'باب داخلي'; unit = 'د.ع'; break;
            case 'carGatePerM2': name = 'بوابة سيارة'; unit = 'د.ع/م²'; break;
            case 'hvacPerM': name = 'تكييف'; unit = 'د.ع/م'; break;
            case 'poolFixed': name = 'مسبح'; unit = 'د.ع'; break;
            case 'gardenPerM2': name = 'حديقة'; unit = 'د.ع/م²'; break;
            case 'fencePerM': name = 'سياج'; unit = 'د.ع/م'; break;
            case 'elevatorBaseCost': name = 'مصعد أساسي'; unit = 'د.ع'; break;
            case 'elevatorPerFloorCost': name = 'مصعد لكل طابق'; unit = 'د.ع'; break;
            case 'excavationPerM3': name = 'حفر'; unit = 'د.ع/م³'; break;
            case 'truckTransportPerTrip': name = 'نقل المخلفات'; unit = 'د.ع/رحلة'; break;
            case 'baseLaborPerM2': name = 'عمالة الأساس'; unit = 'د.ع/م²'; break;
            case 'electricalPointCost': name = 'نقطة كهربائية'; unit = 'د.ع'; break;
            case 'electricalBoardFixed': name = 'لوحة كهربائية'; unit = 'د.ع'; break;
            case 'electricalLaborPerPoint': name = 'عمالة نقطة كهربائية'; unit = 'د.ع'; break;
            case 'plumbingBathroomMaterials': name = 'مواد سباكة الحمام'; unit = 'د.ع'; break;
            case 'plumbingKitchenMaterials': name = 'مواد سباكة المطبخ'; unit = 'د.ع'; break;
            case 'plumbingOtherMaterials': name = 'مواد سباكة أخرى'; unit = 'د.ع'; break;
            case 'plumbingBathroomLabor': name = 'عمالة سباكة الحمام'; unit = 'د.ع'; break;
            case 'bathroomFittingsPerSet': name = 'تجهيزات الحمام'; unit = 'د.ع/مجموعة'; break;
            case 'brickLaborPerDbl': name = 'عمالة الطابوق (دبل)'; unit = 'د.ع/دبل'; break;
            case 'brickLaborPerThousand': name = 'عمالة طابوق ثرمستون'; unit = 'د.ع/ألف'; break;
            case 'brickLaborExtraPerFloor': name = 'زيادة عمالة الطابوق لكل طابق'; unit = 'د.ع'; break;
            case 'carpentryLaborPerM3': 
              name = 'عمالة النجارة'; 
              value = {
                plywood: prices.carpentryLaborPerM3.plywood,
                regular: prices.carpentryLaborPerM3.regular,
                waffle: prices.carpentryLaborPerM3.waffle
              }; 
              unit = 'د.ع/م³'; 
              break;
            case 'steelLaborPerM3': name = 'عمالة حديد التسليح'; unit = 'د.ع/م³'; break;
            case 'skylightsPerM2': name = 'مناور'; unit = 'د.ع/م²'; break;
            case 'secondaryCeilingsPerM2': name = 'سقوف ثانوية'; unit = 'د.ع/م²'; break;
            case 'decorativeWallsPerM2': name = 'جدران ديكورية'; unit = 'د.ع/م²'; break;
            case 'garageCanopyFixed': name = 'مظلة الكراج'; unit = 'د.ع'; break;
            case 'transportConcretePerM3': name = 'نقل الخرسانة'; unit = 'د.ع/م³'; break;
            case 'transportSteelPerTon': name = 'نقل حديد التسليح'; unit = 'د.ع/طن'; break;
            case 'transportCementPerTon': name = 'نقل الإسمنت'; unit = 'د.ع/طن'; break;
            case 'transportSandPerM3': name = 'نقل الرمل'; unit = 'د.ع/م³'; break;
            case 'transportBricksPerDbl': name = 'نقل الطابوق (دبل)'; unit = 'د.ع/دبل'; break;
            case 'transportBricksThermostonePerThousand': name = 'نقل طابوق ثرمستون'; unit = 'د.ع/ألف'; break;
            default: name = key; unit = 'د.ع'; break;
          }
          return { name, value: roundToTwoDecimals(value), unit };
        }).filter(item => item.value > 0) // إزالة الأسعار غير المستخدمة
      }
    };

    // **إرجاع النتائج**
    return {
      success: true,
      message: 'تمت معالجة البيانات بنجاح',
      pdfData
    };
  } catch (error) {
    console.error('❌ **خطأ في processAdvanced**:', error);
    return {
      success: false,
      message: error.message || 'خطأ في معالجة البيانات',
      pdfData: null
    };
  }
}

// تصدير الدالة
module.exports = { processAdvanced };
