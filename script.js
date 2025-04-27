// أفضل الممارسات: تنظيم الكود في كائن رئيسي
const TasbeehApp = {
  // عناصر DOM
  elements: {
    counterDisplay: document.getElementById('counter'),
    zekrSelect: document.getElementById('zekrSelect'),
    currentZekr: document.getElementById('currentZekr'),
    incrementBtn: document.querySelector('[onclick="increment()"]'),
    resetBtn: document.querySelector('[onclick="resetCounter()"]')
  },

  // حالة التطبيق
  state: {
    count: 0,
    currentZekr: 'أستغفر الله',
    targetCount: 33 // يمكن تغييره حسب الحاجة
  },

  // تهيئة التطبيق
  init() {
    this.setupEventListeners();
    this.updateUI();
    this.setupKeyboardControls();
    this.checkDarkMode();
  },

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    this.elements.zekrSelect.addEventListener('change', () => this.handleZekrChange());
    this.elements.incrementBtn.addEventListener('click', () => this.increment());
    this.elements.resetBtn.addEventListener('click', () => this.resetCounter());
    
    // للشاشات التي تدعم اللمس
    this.elements.counterDisplay.addEventListener('click', () => this.increment());
  },

  // التحكم بلوحة المفاتيح
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        this.increment();
      } else if (e.key === 'r' || e.key === 'R') {
        this.resetCounter();
      }
    });
  },

  // تغيير الذكر
  handleZekrChange() {
    this.state.currentZekr = this.elements.zekrSelect.value;
    this.state.count = 0;
    this.updateUI();
    this.animateCounter('change');
  },

  // زيادة العداد
  increment() {
    this.state.count++;
    
    // تأثيرات بصرية عند أرقام محددة
    if (this.state.count % this.state.targetCount === 0) {
      this.animateCounter('milestone');
      this.playSound(); // يمكن إضافة صوت هنا
    } else {
      this.animateCounter('increment');
    }
    
    this.updateUI();
    this.saveToLocalStorage();
  },

  // إعادة تعيين العداد
  resetCounter() {
    if (this.state.count > 0 && confirm('هل تريد تصفير العداد؟')) {
      this.state.count = 0;
      this.animateCounter('reset');
      this.updateUI();
      this.saveToLocalStorage();
    }
  },

  // تحديث واجهة المستخدم
  updateUI() {
    this.elements.counterDisplay.textContent = this.state.count;
    this.elements.currentZekr.textContent = `الذكر الحالي: ${this.state.currentZekr}`;
    
    // تغيير اللون عند الوصول لعدد معين
    if (this.state.count >= this.state.targetCount) {
      this.elements.counterDisplay.style.color = '#e74c3c';
    } else {
      this.elements.counterDisplay.style.color = '#27ae60';
    }
  },

  // تأثيرات حركية
  animateCounter(type) {
    const counter = this.elements.counterDisplay;
    
    switch(type) {
      case 'increment':
        counter.style.transform = 'scale(1.1)';
        setTimeout(() => { counter.style.transform = 'scale(1)'; }, 200);
        break;
        
      case 'milestone':
        counter.style.animation = 'pulse 0.5s 2';
        setTimeout(() => { counter.style.animation = ''; }, 1000);
        break;
        
      case 'reset':
        counter.style.transform = 'rotate(360deg)';
        counter.style.transition = 'transform 0.5s';
        setTimeout(() => { 
          counter.style.transform = 'rotate(0deg)';
          counter.style.transition = '';
        }, 500);
        break;
        
      case 'change':
        counter.style.opacity = '0';
        counter.style.transition = 'opacity 0.3s';
        setTimeout(() => { 
          counter.style.opacity = '1';
          counter.style.transition = '';
        }, 300);
        break;
    }
  },

  // حفظ في الذاكرة المحلية
  saveToLocalStorage() {
    localStorage.setItem('tasbeehCount', this.state.count);
    localStorage.setItem('selectedZekr', this.state.currentZekr);
  },

  // تحميل من الذاكرة المحلية
  loadFromLocalStorage() {
    const savedCount = localStorage.getItem('tasbeehCount');
    const savedZekr = localStorage.getItem('selectedZekr');
    
    if (savedCount) this.state.count = parseInt(savedCount);
    if (savedZekr) {
      this.state.currentZekr = savedZekr;
      this.elements.zekrSelect.value = savedZekr;
    }
  },

  // دعم الوضع المظلم
  checkDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    }
  },

  // تشغيل صوت (اختياري)
  playSound() {
    // يمكن إضافة صوت خفيف هنا
    const audio = new Audio('click-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('لا يمكن تشغيل الصوت:', e));
  }
};

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  TasbeehApp.init();
  TasbeehApp.loadFromLocalStorage();
});

// إضافة أنيميشن للـ CSS ديناميكيًا
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
