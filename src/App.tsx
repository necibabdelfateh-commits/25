import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShieldCheck, 
  Zap, 
  Users, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  ChevronLeft, 
  PhoneCall, 
  MapPin, 
  Mail, 
  Wrench, 
  FileCheck, 
  Calculator, 
  FolderKanban, 
  MessageSquare, 
  Home, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertTriangle, 
  Sliders, 
  Check, 
  Search, 
  Info,
  Clock,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';
import { Lead, Message } from './types';
import { CAMERA_PRODUCTS, ALARM_PRODUCTS, ELECTRICAL_TASKS, INITIAL_LEADS } from './data';

export default function App() {
  // Navigation tabs: 'dashboard', 'calculator', 'leads', 'chat'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Engineer portal lock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('safe_tech_engineer_authed') === 'true';
  });
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  // Leads State with LocalStorage persistence
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('fateh_leads_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading leads from localStorage", e);
      }
    }
    return INITIAL_LEADS;
  });

  // Save leads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fateh_leads_data', JSON.stringify(leads));
  }, [leads]);

  // Lead Form / Estimator State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('الجزائر العاصمة');
  const [propertyType, setPropertyType] = useState('فيلا');
  const [rooms, setRooms] = useState(4);
  const [floors, setFloors] = useState(1);
  
  // Selections for Estimator
  const [needsCameras, setNeedsCameras] = useState(true);
  const [selectedCameraId, setSelectedCameraId] = useState(CAMERA_PRODUCTS[1].id); // default IP 5MP
  const [cameraCount, setCameraCount] = useState(4);
  const [cameraLocations, setCameraLocations] = useState<string[]>(['المدخل الرئيسي', 'السور الخارجي']);
  
  const [needsAlarms, setNeedsAlarms] = useState(false);
  const [selectedAlarmIds, setSelectedAlarmIds] = useState<string[]>([ALARM_PRODUCTS[0].id, ALARM_PRODUCTS[2].id]); // default motion + smoke
  
  const [needsElectricity, setNeedsElectricity] = useState(false);
  const [selectedElectricTasks, setSelectedElectricTasks] = useState<{ taskId: string; qty: number }[]>([]);

  const [priority, setPriority] = useState<'quality' | 'budget' | 'balanced'>('balanced');
  const [clientNotes, setClientNotes] = useState('');

  // AI Recommendation Generation States
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [generatedRecommendation, setGeneratedRecommendation] = useState('');
  const [estimationResult, setEstimationResult] = useState<number>(0);

  // Leads Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');

  // AI Chat Consultant State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Quick Callback Form
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickService, setQuickService] = useState('cctv');
  const [quickSubmitted, setQuickSubmitted] = useState(false);

  // Initialize Chat with greeting
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: 'مرحباً بك! أنا "المهندس الذكي"، المساعد التقني المدعوم بـ AI لشركة Safe Tech. يسعدني إجابتك على أي استفسار فني يخص كاميرات المراقبة، أنظمة الإنذار الذكية، أو الأعمال الكهربائية المنزلية وحساب الأحمال وقواطع الحماية. كيف يمكنني مساعدتك اليوم؟',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Recalculate estimated price whenever options change
  useEffect(() => {
    let price = 0;

    // 1. Calculate cameras
    if (needsCameras) {
      const cam = CAMERA_PRODUCTS.find(c => c.id === selectedCameraId);
      if (cam) {
        price += cam.basePrice * cameraCount;
      }
      // Add installation and config labor cost per camera (1500 DA per camera)
      price += 1500 * cameraCount; 
      // Base installation materials (NVR/DVR, wires, power supplies, connectors - 25000 DA)
      price += 25000; 
    }

    // 2. Calculate alarms
    if (needsAlarms) {
      selectedAlarmIds.forEach(id => {
        const item = ALARM_PRODUCTS.find(a => a.id === id);
        if (item) {
          price += item.basePrice;
        }
      });
      // Main control panel base if not selected (6000 DA general wiring/setup)
      if (!selectedAlarmIds.includes('alarm_keypad')) {
        price += 6000; 
      }
      // installation labor (5000 DA)
      price += 5000; 
    }

    // 3. Calculate electric tasks
    if (needsElectricity) {
      selectedElectricTasks.forEach(item => {
        const task = ELECTRICAL_TASKS.find(t => t.id === item.taskId);
        if (task) {
          price += task.pricePerUnit * item.qty;
        }
      });
    }

    // Adjust based on priority standard multipliers
    if (priority === 'quality') {
      price = Math.round(price * 1.15); // premium materials
    } else if (priority === 'budget') {
      price = Math.round(price * 0.85); // economic components
    }

    setEstimationResult(price);
  }, [needsCameras, selectedCameraId, cameraCount, needsAlarms, selectedAlarmIds, needsElectricity, selectedElectricTasks, priority]);

  // Handle quick client callback submit
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName || !quickPhone) return;

    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      clientName: quickName,
      clientPhone: quickPhone,
      clientLocation: 'اتصال سريع',
      propertyType: 'غير محدد',
      rooms: 1,
      floors: 1,
      needsCameras: quickService === 'cctv' || quickService === 'all',
      cameraCount: quickService === 'cctv' || quickService === 'all' ? 4 : 0,
      cameraLocation: [],
      needsAlarms: quickService === 'alarm' || quickService === 'all',
      alarmSpecs: [],
      needsElectricity: quickService === 'electric' || quickService === 'all',
      electricitySpecs: [],
      priority: 'balanced',
      status: 'pending',
      estimatedPrice: quickService === 'cctv' ? 2400 : quickService === 'alarm' ? 1200 : quickService === 'electric' ? 1500 : 4500,
      notes: `طلب اتصال سريع بخصوص: ${
        quickService === 'cctv' ? 'كاميرات مراقبة' : 
        quickService === 'alarm' ? 'أنظمة إنذار' : 
        quickService === 'electric' ? 'كهرباء منزلية' : 'جميع الخدمات'
      }`,
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    setQuickSubmitted(true);
    setQuickName('');
    setQuickPhone('');
    
    // Reset success message after 4 seconds
    setTimeout(() => {
      setQuickSubmitted(false);
    }, 4000);
  };

  // Toggle alarm item selection
  const toggleAlarmItem = (id: string) => {
    setSelectedAlarmIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Update electrical task quantity
  const handleElectricQtyChange = (taskId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedElectricTasks(prev => prev.filter(t => t.taskId !== taskId));
    } else {
      setSelectedElectricTasks(prev => {
        const existing = prev.find(t => t.taskId === taskId);
        if (existing) {
          return prev.map(t => t.taskId === taskId ? { ...t, qty } : t);
        } else {
          return [...prev, { taskId, qty }];
        }
      });
    }
  };

  // Call Express + Gemini API to generate customized recommendations
  const handleGenerateAIRecommendation = async () => {
    setIsGeneratingRecommendation(true);
    setGeneratedRecommendation('');
    
    try {
      const activeAlarmSpecs = needsAlarms 
        ? selectedAlarmIds.map(id => ALARM_PRODUCTS.find(a => a.id === id)?.name || id)
        : [];
        
      const activeElectricSpecs = needsElectricity
        ? selectedElectricTasks.map(t => {
            const spec = ELECTRICAL_TASKS.find(et => et.id === t.taskId);
            return `${spec?.name || t.taskId} (${t.qty} وحدة)`;
          })
        : [];

      const res = await fetch('/api/generate-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          rooms,
          floors,
          needsCameras,
          cameraCount: needsCameras ? cameraCount : 0,
          cameraLocation: needsCameras ? cameraLocations : [],
          needsAlarms,
          alarmSpecs: activeAlarmSpecs,
          needsElectricity,
          electricitySpecs: activeElectricSpecs,
          priority
        })
      });

      if (!res.ok) {
        throw new Error('حدث خطأ في الاتصال بالخادم الرئيسي لتوليد التوصيات.');
      }

      const data = await res.json();
      setGeneratedRecommendation(data.text);
    } catch (err: any) {
      console.error(err);
      setGeneratedRecommendation(`### تعذر الاتصال بمساعد الذكاء الاصطناعي\n\nلم نتمكن من توليد تقرير تلقائي بسبب: ${err.message || 'خطأ غير معروف'}.\n\nولكن يمكنك حفظ تفاصيل التسعير والطلب الآن يدوياً في قائمة المشاريع وسيقوم المهندس بالتواصل معك ومراجعة طلبك فوراً.`);
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  // Save calculated estimate and options as a lead
  const handleSaveEstimateAsLead = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('الرجاء إدخال اسم العميل ورقم جواله لإتمام حفظ المشروع.');
      return;
    }

    const activeAlarmSpecs = needsAlarms 
      ? selectedAlarmIds.map(id => ALARM_PRODUCTS.find(a => a.id === id)?.name || id)
      : [];
      
    const activeElectricSpecs = needsElectricity
      ? selectedElectricTasks.map(t => {
          const spec = ELECTRICAL_TASKS.find(et => et.id === t.taskId);
          return `${spec?.name || t.taskId} (عدد: ${t.qty})`;
        })
      : [];

    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientLocation,
      propertyType,
      rooms,
      floors,
      needsCameras,
      cameraCount: needsCameras ? cameraCount : 0,
      cameraLocation: needsCameras ? cameraLocations : [],
      needsAlarms,
      alarmSpecs: activeAlarmSpecs,
      needsElectricity,
      electricitySpecs: activeElectricSpecs,
      priority,
      status: 'pending',
      estimatedPrice: estimationResult,
      notes: clientNotes.trim() || 'تم التقدير عبر حاسبة الأسعار الآلية.',
      createdAt: new Date().toISOString(),
      aiRecommendation: generatedRecommendation || undefined
    };

    setLeads(prev => [newLead, ...prev]);
    alert('🎉 تم حفظ طلب المشروع والتسعيرة بنجاح! يمكنك الآن متابعة حالة الطلب في علامة تبويب "إدارة المشاريع".');
    
    // Reset form
    setClientName('');
    setClientPhone('');
    setClientNotes('');
    setGeneratedRecommendation('');
    setActiveTab('leads');
  };

  // Add customized location string
  const [customLocInput, setCustomLocInput] = useState('');
  const addCameraLocation = () => {
    if (customLocInput.trim() && !cameraLocations.includes(customLocInput.trim())) {
      setCameraLocations([...cameraLocations, customLocInput.trim()]);
      setCustomLocInput('');
    }
  };

  // Remove camera location
  const removeCameraLocation = (loc: string) => {
    setCameraLocations(cameraLocations.filter(l => l !== loc));
  };

  // AI Chat Consultant submit handler
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsgText = chatInput.trim();
    const userMsgId = 'user_' + Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Gather last 8 messages for context to keep it concise
      const historyContext = chatMessages.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: historyContext
        })
      });

      if (!res.ok) {
        throw new Error('حدث خطأ أثناء إرسال استفسارك للمستشار الذكي.');
      }

      const data = await res.json();
      
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: 'error_' + Date.now(),
        sender: 'ai',
        text: `أنا آسف جداً، واجهتني مشكلة فنية أثناء توليد الإجابة: ${err.message || 'خطأ غير معروف'}. يرجى المحاولة مرة أخرى أو التأكد من إعداد مفتاح API.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Preset question clicked in Chat
  const handlePresetQuestion = (question: string) => {
    setChatInput(question);
    // Submit in next tick
    setTimeout(() => {
      const btn = document.getElementById('submit-chat-btn');
      if (btn) btn.click();
    }, 50);
  };

  // Update a Lead Status
  const handleUpdateLeadStatus = (leadId: string, newStatus: 'pending' | 'contacted' | 'scheduled' | 'completed') => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Save additional notes on lead
  const handleSaveLeadNotes = () => {
    if (!selectedLead) return;
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: leadNotesInput } : l));
    setSelectedLead(prev => prev ? { ...prev, notes: leadNotesInput } : null);
    alert('تم حفظ الملاحظات على المشروع بنجاح!');
  };

  // Delete a Lead
  const handleDeleteLead = (leadId: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً من أرشيفك؟')) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      setSelectedLead(null);
    }
  };

  // Filter and search logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.clientPhone.includes(searchQuery) ||
      (l.clientLocation && l.clientLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.propertyType && l.propertyType.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && l.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white" dir="rtl" id="app-root">
      
      {/* HEADER BAR */}
      <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Safe Tech
                </h1>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  متصل ومتاح
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">كاميرات المراقبة • أنظمة الإنذار • الكهرباء المنزلية</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 gap-1 w-full sm:w-auto overflow-x-auto justify-start sm:justify-center">
            <button
              id="nav-tab-dashboard"
              onClick={() => { setActiveTab('dashboard'); setSelectedLead(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </button>
            <button
              id="nav-tab-calculator"
              onClick={() => { setActiveTab('calculator'); setSelectedLead(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === 'calculator' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              حاسبة الأسعار الذكية
            </button>
            {isUnlocked && (
              <button
                id="nav-tab-leads"
                onClick={() => { setActiveTab('leads'); }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap relative ${
                  activeTab === 'leads' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                إدارة المشاريع
                {leads.filter(l => l.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">
                    {leads.filter(l => l.status === 'pending').length}
                  </span>
                )}
              </button>
            )}
            <button
              id="nav-tab-chat"
              onClick={() => { setActiveTab('chat'); setSelectedLead(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              المستشار الفني الذكي
            </button>
          </nav>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8" id="app-main-content">
        
        {/* ==================================== TAB 1: BENTO DASHBOARD ==================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in" id="dashboard-tab">
            
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="bento-container-grid">
              
              {/* Box 1: Welcome/Hero (Col-span-8, row-span-4) */}
              <div className="md:col-span-8 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 rounded-[2rem] p-8 md:p-10 border border-blue-500/20 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[380px]" id="bento-hero">
                <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-48 h-48 text-blue-500" />
                </div>
                
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-500/15 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/30 mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    خبرة هندسية وجودة مضمونة في التركيب
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                    Safe Tech <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 via-emerald-400 to-amber-300">
                      للحلول الأمنية والكهربائية المتكاملة
                    </span>
                  </h2>
                  
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed mb-6 font-normal">
                    بوابة ذكية مخصصة لطلب وحساب تسعيرة مشاريع تركيب وتمديد شبكات كاميرات المراقبة الفائقة (IP / Analog 4K)، أنظمة إنذار السطو والحرائق، وصيانة التمديدات واللوحات الكهربائية المنزلية وفق المعايير الفنية المعتمدة.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/80 pt-6">
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-white tracking-tight font-mono">4K UHD</span>
                      <span className="text-xs text-slate-400 uppercase font-semibold">دقة الكاميرات</span>
                    </div>
                    <div className="w-px h-10 bg-slate-800"></div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-white tracking-tight font-mono">IP & Analog</span>
                      <span className="text-xs text-slate-400 uppercase font-semibold">أنواع الأنظمة</span>
                    </div>
                    <div className="w-px h-10 bg-slate-800"></div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-white tracking-tight font-mono">GSM / WiFi</span>
                      <span className="text-xs text-slate-400 uppercase font-semibold">ربط إنذار ذكي</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-blue-500/20"
                    >
                      حساب تسعيرة ذكية
                    </button>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all duration-200 hover:scale-[1.03] border border-slate-700"
                    >
                      استشارة AI
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 2: Alarms highlight (Col-span-4) */}
              <div className="md:col-span-4 bg-slate-900 rounded-[2rem] p-7 border border-slate-800 flex flex-col justify-between hover:border-red-500/30 transition-all duration-300 shadow-xl group" id="bento-alarms">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/20 group-hover:bg-red-500/20 transition-all">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] bg-red-500/10 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                    أمان ٢٤/٧
                  </span>
                </div>
                
                <div className="mt-8 space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">أنظمة الإنذار ضد السرقة</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    حماية استباقية للمباني من خلال كواشف الحركة، مستشعرات النوافذ والأبواب الماغنتيتية، وصفارات الإنذار الخارجية مع ربط هاتفي مباشر.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>تنبيهات فورية على الموبايل</span>
                  <span className="text-red-400 font-bold font-mono">GSM Enabled</span>
                </div>
              </div>

              {/* Box 3: Electricity highlight (Col-span-4) */}
              <div className="md:col-span-4 bg-amber-500 text-slate-950 rounded-[2rem] p-7 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden group" id="bento-electricity">
                <div className="absolute -bottom-6 -left-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-36 h-36 text-slate-950" />
                </div>
                
                <div className="flex justify-between items-start z-10">
                  <div className="w-12 h-12 bg-slate-950/10 rounded-2xl flex items-center justify-center text-slate-950 border border-slate-950/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] bg-slate-950/20 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    الأمان أولاً
                  </span>
                </div>

                <div className="mt-8 space-y-2 z-10">
                  <h3 className="text-2xl font-bold text-slate-950">الكهرباء المنزلية والإنارة</h3>
                  <p className="text-slate-900/80 text-sm leading-relaxed font-medium">
                    تأسيس وصيانة لوحات القواطع والتوزيع الرئيسية (الطبلون)، سحب وتمديد الأسلاك النحاسية وتأريض وقائي مع تفعيل مفاتيح الإنارة الذكية LED.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-950/10 flex items-center justify-between text-xs font-bold text-slate-900 z-10">
                  <span>Schneider / Riyadh Cables</span>
                  <span className="italic">Safety Standard</span>
                </div>
              </div>

              {/* Box 4: Project counter (Col-span-3) */}
              <div className="md:col-span-3 bg-slate-900 rounded-[2rem] p-6 border border-slate-800 flex flex-col justify-between text-center items-center" id="bento-stats">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="my-4">
                  <div className="text-5xl font-black text-emerald-400 tracking-tight font-mono">+150</div>
                  <div className="text-sm text-slate-300 font-bold mt-2">مشروع مكتمل بنجاح</div>
                </div>
                <p className="text-[11px] text-slate-500">من الفلل والعمائر السكنية والمحلات التجارية والمستودعات الكبيرة.</p>
              </div>

              {/* Box 5: Why choose Safe Tech? (Col-span-5) */}
              <div className="md:col-span-5 bg-slate-900 rounded-[2rem] p-6 border border-slate-800 flex flex-col justify-between" id="bento-why-us">
                <h4 className="text-lg font-extrabold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                  <Wrench className="w-4.5 h-4.5 text-blue-400" />
                  لماذا تختار Safe Tech؟
                </h4>
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-300">تمديدات نحاسية معزولة ومحمية بالكامل.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-300">ضمان حقيقي على أعمال التأسيس والصيانة.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-300">مطابقة تامة لشروط الحماية المدنية والترخيص الولائي بالجزائر.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-300">برمجة سحابية وتدريب مجاني على تطبيقات الموبايل.</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 text-center font-mono">
                  Dahua • Hikvision • Schneider • ENICAB (Algeria)
                </div>
              </div>

            </div>

            {/* Quick Consultation Request Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="callback-section">
              
              {/* Quick Form */}
              <div className="lg:col-span-7 bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex flex-col justify-between relative overflow-hidden" id="quick-callback-form">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-emerald-400 animate-pulse" />
                    احجز معاينة مجانية لـ منزلك/عقارك الآن
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
                    أدخل معلومات الاتصال السريعة والخدمة المطلوبة، وسيقوم فريق Safe Tech بالاتصال بك مباشرة لجدولة موعد زيارة للموقع ومعاينة التأسيس مجاناً وبدون أي التزامات.
                  </p>

                  {quickSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/35 rounded-2xl p-6 text-center text-emerald-300 space-y-2">
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">✓</div>
                      <h4 className="font-extrabold text-lg">تم إرسال طلبك بنجاح!</h4>
                      <p className="text-sm">تمت إضافة طلبك في إدارة المشاريع، وسيتصل بك فريق Safe Tech في غضون ٢٤ ساعة القادمة.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold block">اسمك الكريم</label>
                          <input
                            type="text"
                            placeholder="مثال: خالد الحربي"
                            value={quickName}
                            onChange={e => setQuickName(e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold block">رقم الجوال (الواتساب)</label>
                          <input
                            type="tel"
                            placeholder="مثال: 0658866639"
                            value={quickPhone}
                            onChange={e => setQuickPhone(e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-sm font-mono text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-bold block">الخدمة الأساسية المطلوبة</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { value: 'cctv', label: 'كاميرات مراقبة' },
                            { value: 'alarm', label: 'أجهزة إنذار' },
                            { value: 'electric', label: 'كهرباء وإنارة' },
                            { value: 'all', label: 'جميع الخدمات' }
                          ].map(srv => (
                            <button
                              key={srv.value}
                              type="button"
                              onClick={() => setQuickService(srv.value)}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                                quickService === srv.value 
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {srv.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/10 hover:scale-[1.01]"
                      >
                        إرسال الطلب وجدولة معاينة مجاناً
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Live Technical Tips card */}
              <div className="lg:col-span-5 bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex flex-col justify-between" id="technical-tips-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <BookOpen className="w-5 h-5" />
                    <h4 className="font-bold">مفاتيح هامة قبل تأسيس منزلك</h4>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                    <div className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                      <span className="text-xl shrink-0">📹</span>
                      <div>
                        <strong>تأسيس كاميرات المراقبة:</strong> يفضّل سحب كابلات شبكية من نوع Cat6 مستقلة لكل كاميرا من الخارج إلى النقطة المركزية (موقع الـ NVR) لتأمين أفضل دقة للـ IP Cameras وبدون تأخير في البث المباشر.
                      </div>
                    </div>

                    <div className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                      <span className="text-xl shrink-0">⚡</span>
                      <div>
                        <strong>قواطع الحماية الكهربائية:</strong> تأكد من عدم خلط إنارة الغرف بمآخذ القوة (الأفياش) في قاطع واحد. الأفياش تتطلب سلك 4 مم وقاطع 16/20 أمبير، بينما الإنارة تتطلب 2.5 مم وقاطع 10 أمبير.
                      </div>
                    </div>

                    <div className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                      <span className="text-xl shrink-0">🚨</span>
                      <div>
                        <strong>مستشعرات الحركة:</strong> تجنب تركيب مستشعر PIR مقابل النوافذ أو بجانب فتحات تكييف الهواء مباشرة، لأن تقلبات الحرارة السريعة أو تيارات الهواء الساخن قد تتسبب بإنذارات كاذبة.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
                  <button 
                    onClick={() => setActiveTab('chat')} 
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
                  >
                    هل تريد استشارة فنية مخصصة؟ اسأل مستشارنا الذكي الآن
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================== TAB 2: SMART CALCULATOR & AI REPORT ==================================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fade-in" id="calculator-tab">
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Form Side - Left on LTR / Right on RTL (12 columns total: 7 cols form, 5 cols summary) */}
              <div className="w-full lg:w-7/12 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl" id="calculator-form-container">
                
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
                    أداة التخطيط الذكي
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">حاسبة تسعير وتخطيط الأنظمة</h2>
                  <p className="text-slate-400 text-xs md:text-sm mt-1">حدد تفاصيل منزلك أو منشأتك لتوليد تسعيرة مواد وتركيب فورية وتقرير أمني بالذكاء الاصطناعي.</p>
                </div>

                {/* Section 1: Property and Client details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-5 h-5 bg-slate-800 text-xs text-blue-400 rounded-full flex items-center justify-center font-bold font-mono">1</span>
                    بيانات العميل والعقار
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">اسم العميل (لحفظ التقرير)</label>
                      <input
                        type="text"
                        placeholder="أدخل الاسم الثنائي للعميل"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">رقم الجوال</label>
                      <input
                        type="tel"
                        placeholder="0658866639"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-sm font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">نوع العقار</label>
                      <select
                        value={propertyType}
                        onChange={e => setPropertyType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold"
                      >
                        <option value="فيلا مستقلة">فيلا مستقلة</option>
                        <option value="شقة سكنية">شقة سكنية</option>
                        <option value="محل تجاري">محل تجاري</option>
                        <option value="مكتب/مقر شركة">مكتب/مقر شركة</option>
                        <option value="مستودع/هانجر">مستودع/هانجر</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">المنطقة/المدينة</label>
                      <input
                        type="text"
                        value={clientLocation}
                        onChange={e => setClientLocation(e.target.value)}
                        placeholder="الجزائر العاصمة، وهران، قسنطينة..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">عدد الغرف والمساحات</label>
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900">-</button>
                        <span className="flex-1 text-center font-mono text-sm text-slate-200">{rooms}</span>
                        <button type="button" onClick={() => setRooms(rooms + 1)} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900">+</button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold block">عدد الطوابق</label>
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <button type="button" onClick={() => setFloors(Math.max(1, floors - 1))} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900">-</button>
                        <span className="flex-1 text-center font-mono text-sm text-slate-200">{floors}</span>
                        <button type="button" onClick={() => setFloors(floors + 1)} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Camera Specifications */}
                <div className="border-t border-slate-800/80 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 bg-slate-800 text-xs text-blue-400 rounded-full flex items-center justify-center font-bold font-mono">2</span>
                      مواصفات نظام كاميرات المراقبة (CCTV)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setNeedsCameras(!needsCameras)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        needsCameras 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/35' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {needsCameras ? '✓ مطلوب' : '✗ غير مطلوب'}
                    </button>
                  </div>

                  {needsCameras && (
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 space-y-4 animate-fade-in">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Camera model select */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold block">نوع وجودة الكاميرا المفضلة</label>
                          <select
                            value={selectedCameraId}
                            onChange={e => setSelectedCameraId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold"
                          >
                            {CAMERA_PRODUCTS.map(cam => (
                              <option key={cam.id} value={cam.id}>
                                {cam.name} ({cam.basePrice.toLocaleString()} دج/وحدة)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Camera count */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold block">إجمالي عدد الكاميرات المطلوبة</label>
                          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <button type="button" onClick={() => setCameraCount(Math.max(1, cameraCount - 1))} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800">-</button>
                            <span className="flex-1 text-center font-mono text-sm text-slate-200 font-bold">{cameraCount} كاميرات</span>
                            <button type="button" onClick={() => setCameraCount(cameraCount + 1)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800">+</button>
                          </div>
                        </div>
                      </div>

                      {/* Camera locations tag editor */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold block">أماكن ومواقع الكاميرات المقترحة</label>
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 min-h-[44px]">
                          {cameraLocations.map(loc => (
                            <span key={loc} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg border border-slate-700/60">
                              {loc}
                              <button type="button" onClick={() => removeCameraLocation(loc)} className="text-slate-500 hover:text-red-400 text-[10px]">✕</button>
                            </span>
                          ))}
                          {cameraLocations.length === 0 && (
                            <span className="text-xs text-slate-500 p-1">لا توجد مواقع محددة، يرجى كتابتها أدناه</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="مثال: الواجهة الخارجية، الملحق، الدرج، المستودع..."
                            value={customLocInput}
                            onChange={e => setCustomLocInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCameraLocation(); } }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                          />
                          <button
                            type="button"
                            onClick={addCameraLocation}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* Section 3: Alarm System Specifications */}
                <div className="border-t border-slate-800/80 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 bg-slate-800 text-xs text-blue-400 rounded-full flex items-center justify-center font-bold font-mono">3</span>
                      مواصفات نظام الإنذار والحماية ضد السرقة
                    </h3>
                    <button
                      type="button"
                      onClick={() => setNeedsAlarms(!needsAlarms)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        needsAlarms 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/35' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {needsAlarms ? '✓ مطلوب' : '✗ غير مطلوب'}
                    </button>
                  </div>

                  {needsAlarms && (
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 space-y-3 animate-fade-in">
                      <label className="text-xs text-slate-400 font-bold block mb-1">اختر المكونات والمستشعرات المطلوبة:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {ALARM_PRODUCTS.map(item => {
                          const isSelected = selectedAlarmIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleAlarmItem(item.id)}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-right ${
                                isSelected 
                                  ? 'bg-red-950/20 border-red-500/40 text-red-400' 
                                  : 'bg-slate-900 border-slate-800/70 text-slate-400 hover:text-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-red-500 border-red-600 text-slate-950' : 'border-slate-700'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div className="text-xs">
                                <p className="font-bold text-slate-200">{item.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                                <p className={`text-[10px] font-extrabold font-mono mt-1 ${isSelected ? 'text-red-400' : 'text-slate-500'}`}>
                                  {item.basePrice.toLocaleString()} دج/قطعة
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Electrical Works Specifications */}
                <div className="border-t border-slate-800/80 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-5 h-5 bg-slate-800 text-xs text-blue-400 rounded-full flex items-center justify-center font-bold font-mono">4</span>
                      الأعمال الكهربائية والإنارة الذكية
                    </h3>
                    <button
                      type="button"
                      onClick={() => setNeedsElectricity(!needsElectricity)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        needsElectricity 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {needsElectricity ? '✓ مطلوب' : '✗ غير مطلوب'}
                    </button>
                  </div>

                  {needsElectricity && (
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 space-y-3.5 animate-fade-in">
                      <label className="text-xs text-slate-400 font-bold block">حدد الخدمات والكميات المطلوبة:</label>
                      <div className="space-y-3">
                        {ELECTRICAL_TASKS.map(task => {
                          const existingSelection = selectedElectricTasks.find(t => t.taskId === task.id);
                          const qty = existingSelection ? existingSelection.qty : 0;
                          
                          return (
                            <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800/80 rounded-xl">
                              <div className="text-xs space-y-0.5">
                                <p className="font-bold text-slate-200">{task.name}</p>
                                <p className="text-[10px] text-slate-400 leading-relaxed">{task.description}</p>
                                <p className="text-[10px] text-amber-400 font-extrabold font-mono">
                                  السعر: {task.pricePerUnit.toLocaleString()} دج / {task.unit}
                                </p>
                              </div>
                              
                              <div className="flex items-center border border-slate-700/60 bg-slate-950 rounded-lg overflow-hidden h-9 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleElectricQtyChange(task.id, qty - 1)}
                                  className="px-3 text-slate-400 hover:text-white hover:bg-slate-800 h-full text-sm font-extrabold"
                                >
                                  -
                                </button>
                                <span className="px-4 font-mono text-xs font-bold text-slate-100 min-w-[70px] text-center">
                                  {qty} {task.unit}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleElectricQtyChange(task.id, qty + 1)}
                                  className="px-3 text-slate-400 hover:text-white hover:bg-slate-800 h-full text-sm font-extrabold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 5: Priority level & client notes */}
                <div className="border-t border-slate-800/80 pt-5 space-y-4">
                  <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-5 h-5 bg-slate-800 text-xs text-blue-400 rounded-full flex items-center justify-center font-bold font-mono">5</span>
                    الأولويات والملاحظات
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">ميزانية المشروع والتركيز</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'quality', label: 'جودة متميزة', desc: 'أعلى حماية ومواصفات' },
                        { value: 'balanced', label: 'متوازن وعملي', desc: 'توازن مثالي للميزانية' },
                        { value: 'budget', label: 'اقتصادي', desc: 'التركيز على السعر المناسب' }
                      ].map(item => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setPriority(item.value as any)}
                          className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                            priority === item.value 
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[9px] text-slate-500 mt-1 leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold block">ملاحظات إضافية أو شروط خاصة</label>
                    <textarea
                      placeholder="اكتب هنا أي شروط خاصة أو مواصفات إضافية ترغب بها (مثال: ربط بكابلات شنايدر الفرنسية، تسجيل ممتد لـ 60 يوم، تأجير راك خاص...)"
                      rows={3}
                      value={clientNotes}
                      onChange={e => setClientNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                    ></textarea>
                  </div>
                </div>

              </div>

              {/* Summary and AI Report Generation Side - Right/Left (5 cols) */}
              <div className="w-full lg:w-5/12 space-y-6 lg:sticky lg:top-24" id="calculator-summary-side">
                
                {/* Cost Estimation Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xl" id="cost-estimate-results">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                    <span>ملخص تكلفة التأسيس المبدئية</span>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">تقدير فوري</span>
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    {needsCameras && (
                      <div className="flex justify-between items-center text-slate-300">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-100">نظام كاميرات المراقبة ({cameraCount} قطع)</p>
                          <p className="text-[10px] text-slate-500">
                            {CAMERA_PRODUCTS.find(c => c.id === selectedCameraId)?.name}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-slate-200">
                          {(((CAMERA_PRODUCTS.find(c => c.id === selectedCameraId)?.basePrice || 0) * cameraCount) + (1500 * cameraCount) + 25000).toLocaleString()} دج
                        </span>
                      </div>
                    )}

                    {needsAlarms && (
                      <div className="flex justify-between items-center text-slate-300">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-100">نظام الإنذار والسرقة</p>
                          <p className="text-[10px] text-slate-500">
                            {selectedAlarmIds.length} مستشعرات مع صفارة ولوحة تفعيل
                          </p>
                        </div>
                        <span className="font-mono font-bold text-slate-200">
                          {(selectedAlarmIds.reduce((sum, id) => sum + (ALARM_PRODUCTS.find(a => a.id === id)?.basePrice || 0), 0) + (!selectedAlarmIds.includes('alarm_keypad') ? 6000 : 0) + 5000).toLocaleString()} دج
                        </span>
                      </div>
                    )}

                    {needsElectricity && selectedElectricTasks.length > 0 && (
                      <div className="flex justify-between items-center text-slate-300">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-100">الأعمال الكهربائية وتوزيع الإنارة</p>
                          <p className="text-[10px] text-slate-500">
                            موزعة على {selectedElectricTasks.length} فئات تمديد وقواطع
                          </p>
                        </div>
                        <span className="font-mono font-bold text-slate-200">
                          {selectedElectricTasks.reduce((sum, t) => sum + ((ELECTRICAL_TASKS.find(et => et.id === t.taskId)?.pricePerUnit || 0) * t.qty), 0).toLocaleString()} دج
                        </span>
                      </div>
                    )}

                    {(!needsCameras && !needsAlarms && (!needsElectricity || selectedElectricTasks.length === 0)) && (
                      <p className="text-slate-500 text-center py-4">الرجاء تفعيل وتحديد أحد الأنظمة لترى تفاصيل التسعير.</p>
                    )}

                    <div className="border-t border-slate-800/80 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>نوع التسعيرة المختارة:</span>
                        <span className="font-bold text-slate-300">
                          {priority === 'quality' ? 'جودة متميزة ومتقدمة (+15%)' : priority === 'budget' ? 'ميزانية اقتصادية مخفضة (-15%)' : 'تسعيرة قياسية متوازنة'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>أجور الأيدي العاملة والبرمجة:</span>
                        <span className="text-emerald-400 font-bold">شاملة ومدمجة في التقدير</span>
                      </div>
                    </div>
                  </div>

                  {/* Big Total Price */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-slate-400 text-xs font-bold">إجمالي التكلفة التقريبية المقدرة (شامل المواد والتركيب)</span>
                    <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      {estimationResult.toLocaleString()} <span className="text-sm font-bold text-slate-300">دينار جزائري (دج)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-relaxed">السعر تقريبي مبدئي ويعتمد على المعاينة الميدانية والمسافات الفعلية للكابلات.</span>
                  </div>

                  {/* AI Recommendation Generator Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleGenerateAIRecommendation}
                      disabled={isGeneratingRecommendation || (!needsCameras && !needsAlarms && !needsElectricity)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.01]"
                    >
                      {isGeneratingRecommendation ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          جاري تخطيط التقرير الأمني وتوليده بـ AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          توليد تقرير هندسي وتوصيات فنية بـ AI
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveEstimateAsLead}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all border border-slate-700"
                    >
                      حفظ تفاصيل الطلب والتسعيرة في المشاريع
                    </button>
                  </div>
                </div>

                {/* AI generated report container */}
                {(generatedRecommendation || isGeneratingRecommendation) && (
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 space-y-4 shadow-xl animate-fade-in" id="ai-generated-report-card">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h4 className="font-bold text-slate-100 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-blue-400" />
                        التقرير والتوصيات الهندسية المقترحة بـ AI
                      </h4>
                      <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/25">
                        Gemini 3.5 Active
                      </span>
                    </div>

                    {isGeneratingRecommendation ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-xs text-slate-400 font-bold">يقوم المساعد الذكي الآن بتحليل هيكل العقار والأبعاد، واختيار الكاميرات ومواقع التثبيت لتجنب الزوايا الميتة والحد من الإنذارات الكاذبة...</p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {generatedRecommendation.split('\n').map((line, lidx) => {
                          if (line.startsWith('###')) {
                            return <h5 key={lidx} className="text-sm font-black text-white mt-4 pb-1 border-b border-slate-800/60">{line.replace('###', '')}</h5>;
                          }
                          if (line.startsWith('####')) {
                            return <h6 key={lidx} className="font-extrabold text-blue-400 mt-3">{line.replace('####', '')}</h6>;
                          }
                          if (line.startsWith('*')) {
                            return <p key={lidx} className="mr-3 list-disc relative before:content-['•'] before:absolute before:-mr-3.5 before:text-blue-500">{line.substring(1)}</p>;
                          }
                          return <p key={lidx}>{line}</p>;
                        })}
                      </div>
                    )}
                    
                    <p className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-3 text-center">
                      يمكنك النقر على "حفظ تفاصيل الطلب والتسعيرة في المشاريع" لتسجيل هذا التقرير في لوحة المتابعة للرجوع الفوري إليه.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ==================================== TAB 3: PROJECTS & LEADS DIRECTORY ==================================== */}
        {activeTab === 'leads' && (
          !isUnlocked ? (
            <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6 animate-fade-in" id="leads-restricted-container">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">الوصول مقيد للمهندس فقط</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  هذا القسم يحتوي على بيانات العملاء وإدارة المشاريع الخاصة بشركة Safe Tech. يرجى إدخال رمز المرور للوصول.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/10 mx-auto"
              >
                <Unlock className="w-4 h-4" />
                دخول المهندس (رمز المرور)
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in" id="leads-tab">
            
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl" id="leads-directory-header">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">إدارة المشاريع وطلبات الزبائن</h2>
                  <p className="text-slate-400 text-xs md:text-sm mt-1">تتبع حالة المعاينات، التركيبات، الفواتير، والتقارير الهندسية لزبائنك.</p>
                </div>
                
                {/* Statistics small summary */}
                <div className="flex gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block">انتظار المراجعة</span>
                    <span className="text-amber-400 font-bold font-mono text-base">{leads.filter(l => l.status === 'pending').length}</span>
                  </div>
                  <div className="w-px bg-slate-800"></div>
                  <div>
                    <span className="text-slate-400 block">تم التواصل</span>
                    <span className="text-blue-400 font-bold font-mono text-base">{leads.filter(l => l.status === 'contacted').length}</span>
                  </div>
                  <div className="w-px bg-slate-800"></div>
                  <div>
                    <span className="text-slate-400 block">موعد مجدول</span>
                    <span className="text-purple-400 font-bold font-mono text-base">{leads.filter(l => l.status === 'scheduled').length}</span>
                  </div>
                  <div className="w-px bg-slate-800"></div>
                  <div>
                    <span className="text-slate-400 block">مكتمل</span>
                    <span className="text-emerald-400 font-bold font-mono text-base">{leads.filter(l => l.status === 'completed').length}</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 pt-6 border-t border-slate-800/85">
                <div className="md:col-span-6 relative">
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="ابحث عن العميل بالاسم، الهاتف، العقار أو المدينة..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="md:col-span-6 flex gap-2 overflow-x-auto">
                  {[
                    { value: 'all', label: 'الكل' },
                    { value: 'pending', label: 'انتظار المراجعة' },
                    { value: 'contacted', label: 'تم التواصل' },
                    { value: 'scheduled', label: 'موعد مجدول' },
                    { value: 'completed', label: 'مكتمل' }
                  ].map(flt => (
                    <button
                      key={flt.value}
                      onClick={() => setStatusFilter(flt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                        statusFilter === flt.value 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Split layout: List on right (Arabic), Detailed modal/panel on left */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Leads list - 5 cols */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-[2rem] p-4 space-y-3 shadow-xl max-h-[600px] overflow-y-auto custom-scrollbar" id="leads-list-column">
                <h3 className="font-extrabold text-sm text-slate-300 px-2 pb-2 border-b border-slate-800 flex justify-between items-center">
                  <span>قائمة المشاريع والزبائن ({filteredLeads.length})</span>
                  <span className="text-[10px] text-slate-500 font-bold">انقر لمشاهدة التفاصيل الكاملة والتقرير</span>
                </h3>

                {filteredLeads.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <span className="text-3xl block">📁</span>
                    <p className="text-xs">لا توجد مشاريع مسجلة تطابق بحثك حالياً.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLeads.map(l => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setSelectedLead(l);
                          setLeadNotesInput(l.notes);
                        }}
                        className={`w-full text-right p-4 rounded-xl border transition-all duration-200 block ${
                          selectedLead?.id === l.id 
                            ? 'bg-blue-950/20 border-blue-500/80 shadow-md shadow-blue-500/5' 
                            : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/60'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-100 text-sm">{l.clientName}</h4>
                            <p className="text-[10px] text-slate-400 font-mono" dir="ltr">{l.clientPhone}</p>
                          </div>
                          
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            l.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            l.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            l.status === 'scheduled' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {l.status === 'pending' ? 'انتظار مراجعة' :
                             l.status === 'contacted' ? 'تم التواصل' :
                             l.status === 'scheduled' ? 'موعد مجدول' :
                             'مكتمل'}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{l.clientLocation}</span>
                          </div>
                          
                          <span className="font-mono font-bold text-slate-300 text-xs">
                            {l.estimatedPrice.toLocaleString()} دج
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed panel - 7 cols */}
              <div className="lg:col-span-7" id="lead-details-column">
                {selectedLead ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-6 shadow-xl animate-fade-in">
                    
                    {/* Panel Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold font-mono">معرف الطلب: {selectedLead.id}</span>
                        <h3 className="text-xl font-bold text-white mt-1">{selectedLead.clientName}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLead.clientPhone}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Status Quick changer dropdown */}
                        <select
                          value={selectedLead.status}
                          onChange={e => handleUpdateLeadStatus(selectedLead.id, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 ${
                            selectedLead.status === 'pending' ? 'text-amber-400' :
                            selectedLead.status === 'contacted' ? 'text-blue-400' :
                            selectedLead.status === 'scheduled' ? 'text-purple-400' :
                            'text-emerald-400'
                          }`}
                        >
                          <option value="pending">⏳ انتظار مراجعة</option>
                          <option value="contacted">📞 تم التواصل</option>
                          <option value="scheduled">📅 موعد معاينة</option>
                          <option value="completed">✓ تم الإكمال بنجاح</option>
                        </select>

                        <button
                          onClick={() => handleDeleteLead(selectedLead.id)}
                          className="p-1.5 rounded-xl border border-slate-800 hover:border-red-500/40 text-slate-500 hover:text-red-400 bg-slate-950 transition-all"
                          title="حذف المشروع"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Specs Overview Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block">نوع العقار</span>
                        <span className="text-xs font-bold text-slate-200">{selectedLead.propertyType || 'غير محدد'}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block">المساحات والغرف</span>
                        <span className="text-xs font-bold text-slate-200">{selectedLead.rooms} غرف / {selectedLead.floors} طابق</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block">التركيز والميزانية</span>
                        <span className="text-xs font-bold text-slate-200">
                          {selectedLead.priority === 'quality' ? 'جودة متميزة' : selectedLead.priority === 'budget' ? 'اقتصادي وموفر' : 'متوازن'}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block">الميزانية المقدرة</span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">{selectedLead.estimatedPrice.toLocaleString()} دج</span>
                      </div>
                    </div>

                    {/* System requirements specific details */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-xs text-slate-300 pb-1 border-b border-slate-800/50">مكونات الأنظمة المطلوبة في المشروع</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* CCTV column */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/70 space-y-2">
                          <div className="flex items-center gap-2 text-blue-400">
                            <Camera className="w-4 h-4" />
                            <span className="text-xs font-bold">كاميرات المراقبة</span>
                          </div>
                          {selectedLead.needsCameras ? (
                            <div className="text-[11px] text-slate-300 space-y-1.5">
                              <p>✓ <strong>العدد:</strong> {selectedLead.cameraCount} كاميرات</p>
                              {selectedLead.cameraLocation && selectedLead.cameraLocation.length > 0 && (
                                <p><strong>مواقع:</strong> {selectedLead.cameraLocation.join('، ')}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic block">غير مطلوب في هذا المشروع</span>
                          )}
                        </div>

                        {/* Alarms column */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/70 space-y-2">
                          <div className="flex items-center gap-2 text-red-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold">أنظمة الإنذار</span>
                          </div>
                          {selectedLead.needsAlarms && selectedLead.alarmSpecs && selectedLead.alarmSpecs.length > 0 ? (
                            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                              {selectedLead.alarmSpecs.map((sp, idx) => (
                                <li key={idx} className="truncate">{sp}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic block">غير مطلوب في هذا المشروع</span>
                          )}
                        </div>

                        {/* Electricity column */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/70 space-y-2">
                          <div className="flex items-center gap-2 text-amber-400">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-bold">الكهرباء المنزلية</span>
                          </div>
                          {selectedLead.needsElectricity && selectedLead.electricitySpecs && selectedLead.electricitySpecs.length > 0 ? (
                            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                              {selectedLead.electricitySpecs.map((sp, idx) => (
                                <li key={idx} className="truncate">{sp}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic block">غير مطلوب في هذا المشروع</span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* AI generated report view inside details panel */}
                    {selectedLead.aiRecommendation && (
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3.5">
                        <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-2">
                          <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-pulse" />
                          <h4 className="text-xs font-bold">التقرير الأمني والتوصيات الهندسية لشركة Safe Tech (توليد AI)</h4>
                        </div>
                        
                        <div className="text-xs text-slate-300 leading-relaxed space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {selectedLead.aiRecommendation.split('\n').map((line, lidx) => {
                            if (line.startsWith('###')) {
                              return <h5 key={lidx} className="text-xs font-black text-white mt-3 pb-0.5 border-b border-slate-800/50">{line.replace('###', '')}</h5>;
                            }
                            if (line.startsWith('####')) {
                              return <h6 key={lidx} className="font-extrabold text-blue-400 mt-2">{line.replace('####', '')}</h6>;
                            }
                            if (line.startsWith('*')) {
                              return <p key={lidx} className="mr-3 list-disc relative before:content-['•'] before:absolute before:-mr-3.5 before:text-blue-500">{line.substring(1)}</p>;
                            }
                            return <p key={lidx}>{line}</p>;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Project Notes management panel */}
                    <div className="space-y-2 border-t border-slate-800 pt-5">
                      <label className="text-xs text-slate-400 font-bold block">مفكرة تقدم المشروع الفني (خاص بالمهندس)</label>
                      <textarea
                        rows={3}
                        value={leadNotesInput}
                        onChange={e => setLeadNotesInput(e.target.value)}
                        placeholder="سجل تقدم العمل هنا... (مثال: تم سحب كابلات كات6 وتأسيس صفارة الإنذار على مدخل الفيلا. يتبقى فحص التوصيل الكهربائي للماتور)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                      ></textarea>
                      <button
                        type="button"
                        onClick={handleSaveLeadNotes}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all hover:scale-[1.01]"
                      >
                        حفظ الملاحظات والمستجدات
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-12 text-center text-slate-500 space-y-4 shadow-xl" id="lead-select-prompt">
                    <span className="text-5xl block animate-bounce">📋</span>
                    <h4 className="font-bold text-slate-300 text-lg">لم يتم اختيار أي مشروع</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      الرجاء النقر على أحد طلبات ومشاريع العملاء من القائمة المجاورة لمراجعة تفاصيل التأسيس والكميات والتقرير الفني للذكاء الاصطناعي وتعديل حالة المشروع.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )
      )}

        {/* ==================================== TAB 4: INTERACTIVE AI CONSULTANT ==================================== */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fade-in" id="chat-tab">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Technical Presets sidebar - 4 cols */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-5 shadow-xl flex flex-col justify-between" id="chat-presets-sidebar">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <HelpCircle className="w-5 h-5 animate-pulse" />
                    <h3 className="font-extrabold text-sm text-slate-100">أسئلة فنية واستشارية شائعة</h3>
                  </div>
                  
                  <p className="text-slate-400 text-xs leading-relaxed">
                    انقر على أي من الأسئلة الجاهزة أدناه ليرد عليك مستشار م. فاتح الذكي فوراً بحلول هندسية وتوجيهات عملية:
                  </p>

                  <div className="space-y-2">
                    {[
                      { q: "ما الفرق العملي بين كاميرات IP وكاميرات الـ Analog (HD-TVI)؟", cat: "cctv" },
                      { q: "كيف أقوم بتخطيط وتوزيع مستشعرات الحركة لتفادي الإنذار الكاذب؟", cat: "alarm" },
                      { q: "ما هي شروط الحماية المدنية والترخيص الولائي لتركيب الكاميرات بالجزائر؟", cat: "cctv" },
                      { q: "كيف أختار قاطع تيار الحماية (MCB) المناسب للأحمال المنزلية العالية؟", cat: "electric" },
                      { q: "ما هي الطريقة الفنية لحساب سعة قرص التخزين المطلوب لـ 4 كاميرات دقة 5MP؟", cat: "cctv" },
                      { q: "ما هو دور نظام التأريض (Earthing) وكيف يقي الأجهزة من التلف؟", cat: "electric" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePresetQuestion(item.q)}
                        className="w-full text-right p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 transition-all text-xs font-semibold text-slate-300 leading-relaxed block"
                      >
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate">{item.q}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            item.cat === 'cctv' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' :
                            item.cat === 'alarm' ? 'bg-red-500/10 text-red-400 border border-red-500/15' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                          }`}>
                            {item.cat === 'cctv' ? 'كاميرات' : item.cat === 'alarm' ? 'إنذار' : 'كهرباء'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 text-[10px] text-slate-400 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>ملاحظة للمهندس والفنيين</span>
                  </div>
                  <p>يمكنك استخدام هذا المستشار الذكي كمرجع تقني سريع أثناء العمل في الموقع للاستعلام عن الرموز والمشاكل الكهربائية والأمنية.</p>
                </div>
              </div>

              {/* Chat Container - 8 cols */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-4 md:p-6 shadow-xl flex flex-col h-[580px]" id="chat-messages-container">
                
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/15 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-100">المستشار الهندسي الذكي</h3>
                      <p className="text-[10px] text-emerald-400 font-medium">مدعوم بـ AI لشركة Safe Tech • إجابات تقنية فورية</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('هل ترغب في إعادة ضبط ومسح محادثة المستشار الذكي؟')) {
                        setChatMessages([
                          {
                            id: 'welcome-msg',
                            sender: 'ai',
                            text: 'مرحباً بك مجدداً! أنا "المساعد الذكي"، المستشار الفني لشركة Safe Tech. كيف يمكنني مساعدتك في حساب أو تخطيط أو صيانة أنظمتك اليوم؟',
                            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                          }
                        ]);
                      }
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 underline font-semibold"
                  >
                    تصفير المحادثة
                  </button>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto my-4 pr-1 pl-2 space-y-4 custom-scrollbar text-xs md:text-sm">
                  {chatMessages.map(msg => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-0 ml-auto text-right' : 'mr-auto ml-0 text-left'}`}
                      >
                        {isAi && (
                          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 self-start font-bold">
                            🤖
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <div className={`p-4 rounded-2xl leading-relaxed font-normal ${
                            isAi 
                              ? 'bg-slate-950 text-slate-200 rounded-tr-none border border-slate-850/80' 
                              : 'bg-blue-600 text-white rounded-tl-none font-medium'
                          }`}>
                            {isAi ? (
                              <div className="space-y-2">
                                {msg.text.split('\n').map((line, idx) => {
                                  if (line.startsWith('###')) {
                                    return <h5 key={idx} className="text-xs font-black text-white mt-3 pb-0.5 border-b border-slate-800/40">{line.replace('###', '')}</h5>;
                                  }
                                  if (line.startsWith('####')) {
                                    return <h6 key={idx} className="font-extrabold text-blue-400 mt-2">{line.replace('####', '')}</h6>;
                                  }
                                  if (line.startsWith('*')) {
                                    return <p key={idx} className="mr-3 list-disc relative before:content-['•'] before:absolute before:-mr-3.5 before:text-blue-500">{line.substring(1)}</p>;
                                  }
                                  return <p key={idx}>{line}</p>;
                                })}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                          </div>
                          
                          <p className="text-[9px] text-slate-500 font-mono tracking-tighter px-1">
                            {msg.timestamp}
                          </p>
                        </div>

                        {!isAi && (
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 self-start font-bold text-xs uppercase font-mono">
                            Me
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isChatLoading && (
                    <div className="flex gap-3 mr-0 ml-auto max-w-[85%] text-right items-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 self-start">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      </div>
                      <div className="bg-slate-950 text-slate-400 text-xs px-4 py-3 rounded-2xl rounded-tr-none border border-slate-850/80 flex items-center gap-2">
                        <span>يقوم المستشار الذكي بكتابة الإجابة وتحليل التوصيات الهندسية...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0 border-t border-slate-800/80 pt-3" id="chat-input-form">
                  <input
                    type="text"
                    placeholder="اكتب استفسارك الفني هنا (مثال: كم مسافة الكابل المسموحة لكاميرات IP بدون مقوي؟)..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-xs disabled:opacity-65"
                  />
                  <button
                    type="submit"
                    id="submit-chat-btn"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    إرسال
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 mt-12 text-center" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="text-right">
            <p className="font-bold text-slate-400">بوابة Safe Tech للأنظمة والكهرباء © {new Date().getFullYear()}</p>
            <p className="mt-1">تصميم وتنفيذ متكامل وحساب تسعيرة دقيقة مدعومة بـ الذكاء الاصطناعي</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500">
            <div className="flex gap-3 flex-wrap justify-center">
              <span className="font-bold text-slate-300">الهاتف: 0658866639</span>
              <span>•</span>
              <span className="font-mono">necibfateh25@gmail.com</span>
              <span>•</span>
              <span className="font-bold">مرخص ومعتمد للمشاريع الأمنية والكهربائية</span>
            </div>
            <button
              onClick={() => {
                if (isUnlocked) {
                  setIsUnlocked(false);
                  localStorage.removeItem('safe_tech_engineer_authed');
                  setActiveTab('dashboard');
                } else {
                  setIsUnlockModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 transition-all text-xs font-black shrink-0"
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  خروج المهندس (قفل اللوحة)
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  بوابة المهندس
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* PASSCODE / UNLOCK MODAL */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="unlock-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-fade-in" dir="rtl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/25">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-white">بوابة المهندس (خاص بالشركة)</h3>
              <p className="text-slate-400 text-xs">يرجى إدخال رمز المرور الجديد للوصول إلى لوحة إدارة المشاريع وطلبات العملاء.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (passcode === '16ماي2000' || passcode === '16may2000' || passcode === '16maic2000') {
                setIsUnlocked(true);
                localStorage.setItem('safe_tech_engineer_authed', 'true');
                setIsUnlockModalOpen(false);
                setPasscode('');
                setPasscodeError('');
                setActiveTab('leads');
              } else {
                setPasscodeError('رمز المرور غير صحيح! يرجى المحاولة مرة أخرى.');
              }
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block">رمز المرور</label>
                <input
                  type="text"
                  placeholder="أدخل رمز المرور هنا..."
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-center tracking-wide"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-[11px] text-rose-400 font-semibold">{passcodeError}</p>
                )}
                <p className="text-[10px] text-slate-500 text-center mt-1">تلميح للمهندس: رمز المرور الجديد هو (16ماي2000)</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUnlockModalOpen(false);
                    setPasscode('');
                    setPasscodeError('');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all border border-slate-700/60"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/10"
                >
                  تأكيد الدخول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
