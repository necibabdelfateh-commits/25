import { CameraProduct, AlarmProduct, ElectricalTask, Lead } from './types';

export const CAMERA_PRODUCTS: CameraProduct[] = [
  {
    id: 'cam_ip_4k',
    name: 'كاميرا IP بدقة 4K (8 ميجابكسل) Hikvision',
    description: 'كاميرا شبكية ذكية عالية الدقة ممتازة للتفاصيل البعيدة والتعرف على الوجوه مع رؤية ليلية ملونة وصوت اتجاهين.',
    basePrice: 14500, // in DZD (DA)
    type: 'ip',
    resolution: '4K (8MP)'
  },
  {
    id: 'cam_ip_5mp',
    name: 'كاميرا IP بدقة 5 ميجابكسل Dahua',
    description: 'كاميرا شبكية ذكية توفر جودة ممتازة وسعر متوازن مع ميزة كشف الحركة والذكاء الاصطناعي الذكي.',
    basePrice: 9800,
    type: 'ip',
    resolution: '5MP'
  },
  {
    id: 'cam_analog_5mp',
    name: 'كاميرا Analog بدقة 5 ميجابكسل Hikvision Turbo HD',
    description: 'كاميرا كواكسيل اقتصادية وعالية الدقة مناسبة للترقيات السريعة على التمديدات القديمة دون تغيير الكابلات.',
    basePrice: 5500,
    type: 'analog',
    resolution: '5MP'
  },
  {
    id: 'cam_ptz_4k',
    name: 'كاميرا متحركة PTZ بدقة 4K Dahua',
    description: 'كاميرا قابلة للميلان والدوران والتقريب البصري (Zoom 25x) تغطي مساحات واسعة مع تتبع تلقائي ذكي للحركة.',
    basePrice: 39000,
    type: 'ptz',
    resolution: '4K'
  },
  {
    id: 'cam_dome_2mp',
    name: 'كاميرا Dome داخلية 2 ميجابكسل Hikvision',
    description: 'كاميرا سقفية صغيرة وغير ملفتة للانتباه، ممتازة للمكاتب، الصالونات، والمحلات من الداخل.',
    basePrice: 3800,
    type: 'dome',
    resolution: '1080p'
  }
];

export const ALARM_PRODUCTS: AlarmProduct[] = [
  {
    id: 'alarm_motion',
    name: 'مستشعر حركة لاسلكي PIR Ajax',
    description: 'يكتشف أي حركة مشبوهة في الغرف والممرات بدقة عالية ويرسل تنبيهاً فورياً للجهاز المركزي Ajax Hub.',
    basePrice: 6500,
    type: 'motion'
  },
  {
    id: 'alarm_door',
    name: 'مستشعر فتح الأبواب والنوافذ Ajax DoorProtect',
    description: 'مستشعر مغناطيسي دقيق يثبت على إطارات الأبواب والنوافذ لتنبيهك فور فتحها أو محاولة كسرها.',
    basePrice: 3800,
    type: 'door_window'
  },
  {
    id: 'alarm_smoke',
    name: 'كاشف دخان وحرارة ذكي للحرائق Ajax FireProtect',
    description: 'كاشف مبكر لغازات الاحتراق والدخان يعمل بالبطارية ويرتبط بالنظام المركزي لإطلاق جرس الإنذار فوراً.',
    basePrice: 4800,
    type: 'smoke_fire'
  },
  {
    id: 'alarm_siren',
    name: 'صفارة إنذار خارجية Ajax StreetSiren مع فلاش',
    description: 'صفارة إنذار عالية الصوت (113dB) ومقاومة للعوامل الجوية تطلق رادعاً صوتياً وضوئياً قوياً لإخافة اللصوص.',
    basePrice: 8500,
    type: 'siren'
  },
  {
    id: 'alarm_keypad',
    name: 'لوحة تحكم ذكية Ajax Hub 2 (4G/Wi-Fi)',
    description: 'اللوحة الرئيسية لتفعيل وإلغاء تفعيل نظام الإنذار مجهزة ببطارية احتياطية وشريحتي اتصال لتجنب انقطاع البث.',
    basePrice: 28000,
    type: 'keypad'
  }
];

export const ELECTRICAL_TASKS: ElectricalTask[] = [
  {
    id: 'elec_outlet',
    name: 'تركيب وتمديد نقاط كهرباء (مآخذ/أفياش) Legrand',
    description: 'تمديد وتركيب مآخذ كهربائية (Prises) جديدة بأسلاك نحاسية ذات جودة عالية ماركة Legrand الفرنسية.',
    pricePerUnit: 2500,
    unit: 'نقطة'
  },
  {
    id: 'elec_board',
    name: 'تأسيس وتركيب لوحة القواطع الرئيسية (طابلو) Schneider',
    description: 'توزيع وتنظيم خطوط التغذية الرئيسية وتركيب قواطع الحماية (Disjoncteurs) المتطورة ضد زيادة الأحمال والالتماس.',
    pricePerUnit: 45000,
    unit: 'لوحة'
  },
  {
    id: 'elec_wiring',
    name: 'إعادة سحب وتمديد الأسلاك المنزلية (Câblage)',
    description: 'تجديد كامل لأسلاك الغرفة المتضررة أو القديمة بأسلاك نحاسية ممتازة ومعزولة ذات منشأ محلي بجودة ممتازة.',
    pricePerUnit: 6500,
    unit: 'غرفة'
  },
  {
    id: 'elec_smart_light',
    name: 'تركيب مفاتيح الإنارة الذكية وتأثيرات شريط LED',
    description: 'ربط مفاتيح إنارة المنزل بالهاتف والتحكم الصوتي، وتركيب أشرطة الإضاءة الحديثة المخفية (Ruban LED).',
    pricePerUnit: 8500,
    unit: 'مفتاح/خط'
  },
  {
    id: 'elec_grounding',
    name: 'تأسيس نظام التأريض الوقائي (Prise de Terre)',
    description: 'حفر وبناء بئر تأريض مع وتد نحاسي وتوصيله باللوحة الرئيسية لحماية الأجهزة المنزلية من الصعق والماس.',
    pricePerUnit: 35000,
    unit: 'مشروع كامل'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_1',
    clientName: 'الحاج محمد بوخروبة',
    clientPhone: '0661234567',
    clientLocation: 'الجزائر العاصمة، حي باب الزوار',
    propertyType: 'فيلا طابقين',
    rooms: 8,
    floors: 2,
    needsCameras: true,
    cameraCount: 6,
    cameraLocation: ['المدخل الرئيسي والواجهة', 'المرأب الخلفي (Garage)', 'الحديقة والأسوار الجانبية', 'الصالة الرئيسية في الطابق الأرضي'],
    needsAlarms: true,
    alarmSpecs: ['مستشعر حركة لاسلكي PIR Ajax', 'مستشعر فتح الأبواب والنوافذ Ajax DoorProtect', 'صفارة إنذار خارجية Ajax StreetSiren مع فلاش'],
    needsElectricity: true,
    electricitySpecs: ['تركيب وتمديد نقاط كهرباء (مآخذ/أفياش) Legrand', 'تأسيس وتركيب لوحة القواطع الرئيسية (طابلو) Schneider'],
    priority: 'balanced',
    status: 'scheduled',
    estimatedPrice: 198000,
    notes: 'الزبون يرغب في تركيب كاميرات IP فائقة الدقة ماركة Hikvision مدمجة بالذكاء الاصطناعي مع تفعيل نظام إنذار Ajax متصل بتطبيق الهاتف. تمت جدولة المعاينة الميدانية يوم الأحد القادم في باب الزوار.',
    createdAt: '2026-07-10T14:30:00Z',
    aiRecommendation: `### التقرير الفني المبدئي لفيلا الحاج محمد بوخروبة

#### 1. توزيع الكاميرات (CCTV IP Setup - Hikvision)
*   **كاميرا 4K IP خارجية (عدد 2)**: واحدة للمدخل الرئيسي والواجهة وواحدة للمرأب لضمان قراءة لوحات السيارات والتعرف الفوري على الوجوه بدقة فائقة.
*   **كاميرات 5MP IP خارجية (عدد 2)**: لتغطية الحديقة والأسوار الجانبية للمبنى.
*   **كاميرات Dome داخلية 5MP (عدد 2)**: للصالة والمدخل الداخلي.
*   **جهاز NVR**: سعة 8 قنوات مع قرص صلب (Hard Disk) بسعة 4 تيرابايت لتأمين تسجيل متواصل لمدة لا تقل عن 30 يوماً.

#### 2. نظام الإنذار المقترح (Ajax Intrusion Detection)
*   تركيب مستشعرات الأبواب المغناطيسية DoorProtect على جميع المداخل الأرضية والنوافذ الخلفية للفيلا.
*   مستشعر حركة ذكي PIR مخصص للحيوانات الأليفة (Pet Immune) يوضع في الصالة الرئيسية لتفادي الإنذارات الكاذبة.
*   جهاز إنذار مركزي Hub 2 متصل بشبكة Wi-Fi وشريحة Mobilis/Ooredoo لضمان البث المستمر للإشعارات الفورية على هاتف العميل.

#### 3. التأسيس الكهربائي والإنارة (Legrand & Schneider)
*   استخدام كابلات نحاسية محلية الصنع (مثل كابلات ENICAB أو علامات وطنية ممتازة) بقطر 4 مم للمآخذ الكهربائية وقواطع مخصصة من Schneider.
*   تأسيس الحماية بقطع تيار حماية مخصص (Parafoudre) في لوحة التوزيع لمنع تلف الكاميرات الحساسة عند حدوث صدمات الجهد الكهربائي في الشبكة المحلية.`
  },
  {
    id: 'lead_2',
    clientName: 'مؤسسة الأنيق للألبسة (السيد أمين بن مهيدي)',
    clientPhone: '0550987654',
    clientLocation: 'وهران، حي العقيد لطفي',
    propertyType: 'محل تجاري',
    rooms: 3,
    floors: 1,
    needsCameras: true,
    cameraCount: 4,
    cameraLocation: ['منطقة الكاشير والتحصيل', 'المستودع الداخلي للملابس', 'المدخل الرئيسي للمحل والواجهة الخارجية'],
    needsAlarms: true,
    alarmSpecs: ['مستشعر فتح الأبواب والنوافذ Ajax DoorProtect', 'صفارة إنذار خارجية Ajax StreetSiren مع فلاش'],
    needsElectricity: false,
    electricitySpecs: [],
    priority: 'quality',
    status: 'pending',
    estimatedPrice: 114000,
    notes: 'محل تجاري لبيع الملابس الفاخرة بحاجة إلى تلبية متطلبات الحماية والرقابة الأمنية لتركيب كاميرات المراقبة والحصول على الشهادة المطابقة. يرغب في كاميرات IP عالية الجودة Dahua مع تسجيل ممتد لـ 30 يوم.',
    createdAt: '2026-07-11T09:15:00Z',
    aiRecommendation: `### التقرير الفني لمتطلبات الحماية - محل الأنيق للألبسة بوهران

#### 1. الالتزام بالشروط والأنظمة الأمنية للمحلات التجارية
*   كاميرات IP Dahua بدقة لا تقل عن 5 ميجابكسل تدعم التصوير الليلي الملون والوضوح العالي، تغطي واجهة المحل كاملة، الممر، ومنطقة الصندوق (Caisse).
*   جهاز تسجيل NVR مخصص ومحمي في خزانة معدنية (Rack) مع وحدة عدم انقطاع التيار الكهربائي (UPS) لضمان العمل حتى عند انقطاع التيار عمداً.
*   مستودع البضائع مغطى بكاميرا عريضة الزاوية بدقة 5 ميجابكسل ترصد الحركة بشكل كامل.

#### 2. نظام الإنذار والسرقة المقترح
*   مستشعر مغناطيسي قوي للأبواب الحديدية (Shutter Sensor) لباب المحل الدوار الخارجي لمنع التسلل بعد أوقات العمل.
*   صفارة إنذار ضوئية وصوتية خارجية لتنبيه الحراس والمارة في حال محاولة كسر قفل الباب ليلاً.`
  },
  {
    id: 'lead_3',
    clientName: 'الأستاذ عبد القادر جبار',
    clientPhone: '0771554433',
    clientLocation: 'قسنطينة، حي سيدي مبروك',
    propertyType: 'شقة سكنية',
    rooms: 4,
    floors: 1,
    needsCameras: false,
    cameraCount: 0,
    cameraLocation: [],
    needsAlarms: false,
    alarmSpecs: [],
    needsElectricity: true,
    electricitySpecs: ['تأسيس وتركيب لوحة القواطع الرئيسية (طابلو) Schneider', 'إعادة سحب وتمديد الأسلاك المنزلية (Câblage)', 'تأسيس نظام التأريض الوقائي (Prise de Terre)'],
    priority: 'budget',
    status: 'completed',
    estimatedPrice: 94000,
    notes: 'تم الانتهاء من العمل بالكامل! تم استبدال علبة القواطع القديمة بطابلو Schneider الفرنسي الأصلي وسحب أسلاك جديدة مع عمل حفرة تأريض ممتازة (Piquet de terre) وقياس المقاومة وجدتها مثالية ومطابقة للمقاييس العالمية.',
    createdAt: '2026-07-08T11:00:00Z'
  }
];
