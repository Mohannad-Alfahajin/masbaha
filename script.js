// أفضل الممارسات: تنظيم الكود في كائن رئيسي
const TasbeehApp = {
  // عناصر DOM
  elements: {
    counterDisplay: document.getElementById('counter'),
    zekrSelect: document.getElementById('zekrSelect'),
    currentZekr: document.getElementById('currentZekr'),
    incrementBtn: document.querySelector('.btn-count'),
    resetBtn: document.querySelector('.btn-reset')
  },

  // حالة التطبيق
  state: {
    count: 0,
    currentZekr: 'أستغفر الله',
    targetCount: 33,
    lastUpdated: null
  },

  // تهيئة التطبيق
  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
    this.updateUI();
    this.setupKeyboardControls();
  },

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    this.elements.zekrSelect.addEventListener('change', () => this.handleZekrChange());
    this.elements.incrementBtn.addEventListener('click', () => this.increment());
    this.elements.resetBtn.addEventListener('click', () => this.resetCounter());
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
    this.saveToLocalStorage();
  },

  // زيادة العداد
  increment() {
    this.state.count++;
    this.state.lastUpdated = new Date().toISOString();
    
    if (this.state.count % this.state.targetCount === 0) {
      this.animateCounter('milestone');
      this.playSound();
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
      this.state.lastUpdated = new Date().toISOString();
      this.animateCounter('reset');
      this.updateUI();
      this.saveToLocalStorage();
    }
  },

  // تحديث واجهة المستخدم
  updateUI() {
    this.elements.counterDisplay.textContent = this.state.count;
    this.elements.currentZekr.textContent = `الذكر الحالي: ${this.state.currentZekr}`;
    this.elements.counterDisplay.style.color = this.state.count >= this.state.targetCount ? '#e74c3c' : '#27ae60';
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
    localStorage.setItem('tasbeehData', JSON.stringify({
      count: this.state.count,
      zekr: this.state.currentZekr,
      lastUpdated: this.state.lastUpdated
    }));
  },

  // تحميل من الذاكرة المحلية
  loadFromLocalStorage() {
    const savedData = localStorage.getItem('tasbeehData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.state.count = data.count || 0;
        this.state.currentZekr = data.zekr || 'أستغفر الله';
        this.state.lastUpdated = data.lastUpdated;
        this.elements.zekrSelect.value = this.state.currentZekr;
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  },

  // تشغيل صوت (اختياري)
  playSound() {
    const audio = new Audio('click-sound.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('لا يمكن تشغيل الصوت:', e));
  }
};

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  TasbeehApp.init();
  
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
});
