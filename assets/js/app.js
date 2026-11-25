/**
 * SITB Insight - Main Application Controller
 * Handles Theme, Team Modal, Comparator, Lightbox, Quiz & Certificate Generation
 */

(function () {
  'use strict';

  // 1. Student Authors Data (9 Mahasiswa)
  const teamMembers = [
    { name: "Afifah Zuhra", nim: "241000273", initial: "AZ" },
    { name: "Sarah Azrinaz Dian", nim: "241000283", initial: "SD" },
    { name: "Shania Aqiila Zahra", nim: "241000290", initial: "SZ" },
    { name: "Regita Cahyani Harahap", nim: "241000294", initial: "RH" },
    { name: "Siti Shahnaz", nim: "241000296", initial: "SS" },
    { name: "Catherin Vinensky Br Surbakti", nim: "241000301", initial: "CS" },
    { name: "Bulan Margolang", nim: "241000320", initial: "BM" },
    { name: "Sabila Paramesywari Anwar", nim: "241000336", initial: "SA" },
    { name: "Yesion Stefani Hutabarat", nim: "241000353", initial: "YH" }
  ];

  // 2. Quiz Questions & Answers
  const quizData = [
    {
      question: "Apa fungsi fundamental dari Sistem Informasi Tuberkulosis (SITB) di Indonesia?",
      options: [
        "Hanya untuk menghitung stok obat di gudang Kemenkes",
        "Pencatatan dan pelaporan terpadu kasus TB dari penemuan terduga hingga akhir pengobatan",
        "Menampilkan rekam medis umum rumah sakit tanpa pelaporan nasional",
        "Aplikasi absensi khusus untuk dokter spesialis paru"
      ],
      correct: 1,
      explanation: "SITB berfungsi mencatat seluruh terduga TB, hasil diagnosis TCM/mikroskopis, pemberian rejimen obat, pemantauan kontak, hingga evaluasi kesembuhan secara nasional."
    },
    {
      question: "Mengapa fasilitas pelayanan kesehatan (Faskes) swasta wajib mencatat kasus TB di SITB?",
      options: [
        "Agar faskes swasta dikenakan biaya pajak tambahan",
        "Mencegah 'under-reporting' dan memastikan semua pasien terpantau agar tidak putus berobat",
        "Hanya sebagai formalitas tanpa tindak lanjut klinis",
        "Agar faskes swasta tidak perlu merawat pasien TB"
      ],
      correct: 1,
      explanation: "Melalui integrasi Public-Private Mix (PPM), faskes swasta wajib melapor agar tidak terjadi fenomena gunung es dan rantai penularan di masyarakat dapat diputus."
    },
    {
      question: "Pemeriksaan diagnostik utama apa yang direkomendasikan Kemenkes RI untuk deteksi cepat TB sekaligus resistansi Rifampisin?",
      options: [
        "Rontgen Thorax saja tanpa uji laboratorium",
        "Tes Cepat Molekuler (TCM / GeneXpert MTB/RIF)",
        "Tes darah lengkap rutin",
        "Uji kulit Mantoux semata"
      ],
      correct: 1,
      explanation: "TCM (Tes Cepat Molekuler) menggunakan sampel dahak untuk mendeteksi DNA kuman M. tuberculosis sekaligus mutasi gen resistan Rifampisin dalam hitungan 2 jam."
    },
    {
      question: "Berapa durasi standar pengobatan Tuberkulosis Sensitif Obat (TB-SO) Kategori 1?",
      options: [
        "2 minggu sampai batuk mereda",
        "Minimal 6 bulan (2 bulan fase intensif + 4 bulan fase lanjutan) secara teratur",
        "1 bulan fase intensif saja",
        "3 tahun berturut-turut tanpa jeda"
      ],
      correct: 1,
      explanation: "Terapi TB-SO membutuhkan kepatuhan 6 bulan penuh (2HRZE / 4HR) untuk membunuh seluruh populasi kuman yang aktif maupun yang dorman agar tidak kambuh atau bermutasi menjadi resistan."
    },
    {
      question: "Dalam taksonomi pengolahan data SITB, apa yang dimaksud dengan Analisis Prediktif?",
      options: [
        "Merekap jumlah pasien yang sembuh tahun lalu",
        "Memperkirakan tren kasus dan kebutuhan logistik obat OAT di masa depan berdasarkan data historis",
        "Mencari siapa petugas yang salah memasukkan data",
        "Menghapus data pasien lama dari server"
      ],
      correct: 1,
      explanation: "Analisis Prediktif memanfaatkan data historis dan tren epidemiologi untuk meramalkan estimasi beban kasus dan kebutuhan obat anti-TB agar tidak terjadi kelangkaan stok."
    }
  ];

  let currentQuizIndex = 0;
  let userScore = 0;
  let quizAnswered = false;

  // DOM Elements
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initTeamModal();
    initComparator();
    initGalleryLightbox();
    initQuiz();
    initSmoothScroll();
  });

  /**
   * 1. Theme Switcher (Dark / Light)
   */
  function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('sitb-theme') || 'dark';

    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sitb-theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const iconEl = document.getElementById('theme-icon');
    if (iconEl) {
      iconEl.innerHTML = theme === 'light'
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
    }
  }

  /**
   * 1b. Mobile Hamburger Navigation Toggle
   */
  function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const header = document.querySelector('header.site-header');
    const navLinks = document.getElementById('main-nav');
    const burger = toggle ? toggle.querySelector('.icon-burger') : null;
    const closeIc = toggle ? toggle.querySelector('.icon-close') : null;

    if (!toggle || !header || !navLinks) return;

    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen);
      if (burger) burger.style.display = isOpen ? 'none' : 'inline-block';
      if (closeIc) closeIc.style.display = isOpen ? 'inline-block' : 'none';
    });

    // Close nav when any link is clicked
    navLinks.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (burger) burger.style.display = 'inline-block';
        if (closeIc) closeIc.style.display = 'none';
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (burger) burger.style.display = 'inline-block';
        if (closeIc) closeIc.style.display = 'none';
      }
    });
  }

  /**
   * 2. Student Team Section (Embedded)
   */
  function initTeamModal() {
    const embeddedTeamGrid = document.getElementById('embedded-team-grid');
    const modalTeamGrid = document.getElementById('modal-team-grid');

    const teamHTML = teamMembers.map(m => `
      <div class="student-card">
        <div class="student-avatar">${m.initial}</div>
        <div class="student-info">
          <h4>${m.name}</h4>
          <p>NIM ${m.nim}</p>
        </div>
      </div>
    `).join('');

    if (embeddedTeamGrid) embeddedTeamGrid.innerHTML = teamHTML;
    if (modalTeamGrid) modalTeamGrid.innerHTML = teamHTML;
  }

  /**
   * 3. TB-SO vs TB-RO Comparator
   */
  function initComparator() {
    const colSO = document.getElementById('col-comp-so');
    const colRO = document.getElementById('col-comp-ro');
    if (colSO) colSO.style.display = 'block';
    if (colRO) colRO.style.display = 'block';
  }

  /**
   * 4. Medical Photo Lightbox
   */
  function initGalleryLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-lightbox');

    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('h4')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';

        if (lightboxImg && img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
        }
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.88rem;color:#ddd">${desc}</span>`;
        }
        if (lightboxModal) {
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      if (lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }
  }

  /**
   * 5. Gamified Quiz & Digital Certificate Generator
   */
  function initQuiz() {
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const questionContainer = document.getElementById('quiz-box');
    if (!questionContainer) return;

    if (currentQuizIndex >= quizData.length) {
      renderQuizResult(questionContainer);
      return;
    }

    const q = quizData[currentQuizIndex];
    quizAnswered = false;

    // Update progress
    const progressFill = document.getElementById('quiz-progress-fill');
    const progressText = document.getElementById('quiz-step-text');
    if (progressFill) progressFill.style.width = `${((currentQuizIndex + 1) / quizData.length) * 100}%`;
    if (progressText) progressText.textContent = `Soal ${currentQuizIndex + 1} dari ${quizData.length}`;

    questionContainer.innerHTML = `
      <h3 class="quiz-question-title">${currentQuizIndex + 1}. ${q.question}</h3>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-opt-btn" data-index="${i}">
            <span>${opt}</span>
            <span class="opt-icon"></span>
          </button>
        `).join('')}
      </div>
      <div id="quiz-feedback-box"></div>
      <div class="quiz-action-bar" style="display:none;" id="quiz-next-bar">
        <button class="btn-primary" id="btn-quiz-next">
          <span>${currentQuizIndex === quizData.length - 1 ? 'Lihat Hasil Akhir' : 'Soal Selanjutnya'}</span>
          <svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;

    // Attach answer events
    const buttons = questionContainer.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        quizAnswered = true;

        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        const feedbackBox = document.getElementById('quiz-feedback-box');
        const nextBar = document.getElementById('quiz-next-bar');

        buttons.forEach((b, idx) => {
          b.disabled = true;
          if (idx === q.correct) {
            b.classList.add('correct');
            b.querySelector('.opt-icon').innerHTML = '<svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          }
        });

        if (selectedIndex === q.correct) {
          userScore++;
          feedbackBox.innerHTML = `
            <div class="quiz-feedback" style="border-left-color: var(--bio-emerald);">
              <b style="color: var(--bio-emerald); display: flex; align-items: center; gap: 6px;">
                <svg class="svg-ic" width="18" height="18" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Jawaban Benar!
              </b>
              <p style="margin-top: 4px;">${q.explanation}</p>
            </div>
          `;
        } else {
          btn.classList.add('wrong');
          btn.querySelector('.opt-icon').innerHTML = '<svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
          feedbackBox.innerHTML = `
            <div class="quiz-feedback" style="border-left-color: var(--bio-danger);">
              <b style="color: var(--bio-danger); display: flex; align-items: center; gap: 6px;">
                <svg class="svg-ic" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Jawaban Kurang Tepat
              </b>
              <p style="margin-top: 4px;">${q.explanation}</p>
            </div>
          `;
        }

        if (nextBar) nextBar.style.display = 'flex';
        document.getElementById('btn-quiz-next').addEventListener('click', () => {
          currentQuizIndex++;
          renderQuizQuestion();
        });
      });
    });
  }

  function renderQuizResult(container) {
    const percentage = Math.round((userScore / quizData.length) * 100);
    const passed = percentage >= 80;

    container.innerHTML = `
      <div class="certificate-card">
        <div class="cert-stamp">
          ${passed
        ? '<svg class="svg-ic" width="38" height="38" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>'
        : '<svg class="svg-ic" width="38" height="38" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'}
        </div>
        <h3 style="font-size: 1.6rem; margin-bottom: 8px;">Evaluasi Selesai!</h3>
        <p style="font-size: 1.15rem; color: var(--rose-accent); margin-bottom: 16px;">
          Skor Anda: <strong>${userScore} / ${quizData.length} (${percentage}%)</strong>
        </p>
        <p style="max-width: 520px; margin: 0 auto 28px; font-size: 0.95rem; line-height: 1.6;">
          ${passed
        ? 'Luar biasa! Anda telah memahami konsep kritis Sistem Informasi Tuberkulosis (SITB) dan prinsip tata kelola data kesehatan nasional.'
        : 'Terima kasih telah mengikuti evaluasi. Silakan pelajari kembali materi modul edukasi untuk memperdalam pemahaman.'}
        </p>

        <div style="display: flex; justify-content: center;">
          <button class="btn-primary" id="btn-restart-quiz" style="padding: 12px 28px; display: inline-flex; align-items: center; gap: 8px;">
            <svg class="svg-ic" width="18" height="18" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            <span>Ulangi Kuis</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-restart-quiz').addEventListener('click', () => {
      currentQuizIndex = 0;
      userScore = 0;
      renderQuizQuestion();
    });
  }

  /**
   * 6. Smooth Scroll Navigation
   */
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

})();

