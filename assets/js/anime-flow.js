/**
 * SITB Insight - Anime.js Interactive Flowchart
 * Visualizing real-time healthcare data pipelines in SITB Ecosystem
 */

(function () {
  'use strict';

  // Node technical specifications
  const nodeDetails = {
    puskesmas: {
      title: "01. Puskesmas & Faskes Tingkat Pertama (FKTP)",
      desc: "Mencatat setiap terduga TB (Formulir TB.05 / e-TB), skrining batuk berdahak >2 minggu, pengambilan spesimen dahak pagi-sewaktu, serta pemantauan pengawas menelan obat (PMO)."
    },
    swasta: {
      title: "02. Faskes Swasta & RS Rujukan (Public-Private Mix)",
      desc: "Klinik pratama, dokter praktik mandiri, dan RS swasta terintegrasi via SITB / bridge SatuSehat. Menjamin tidak ada kasus 'lost to follow-up' atau fenomena gunung es kasus yang tak tercatat."
    },
    lab: {
      title: "03. Laboratorium Tes Cepat Molekuler (TCM / GeneXpert)",
      desc: "Mengunggah hasil pemeriksaan molekuler otomatis: Deteksi DNA Mycobacterium tuberculosis dan resistansi terhadap Rifampisin (MTB/RIF) dalam waktu < 2 jam."
    },
    kontak: {
      title: "04. Tim Tracing Kontak Erat (Investigasi Kontak)",
      desc: "Pencatatan skrining minimal 10–15 orang kontak serumah & kontak erat dari pasien TB terkonfirmasi bakteriologis, pemberian Terapi Pencegahan TB (TPT) bila negatif bergejala."
    },
    sitb: {
      title: "05. Central Hub Server SITB Kemenkes RI",
      desc: "Basis data nasional terenkripsi. Menjalankan algoritma pembersihan data (data deduplication NIK Dukcapil), validasi konsistensi status pengobatan, dan proteksi privasi pasien sesuai UU PDP."
    },
    analisis: {
      title: "06. Engine Analisis Prediktif & Diagnostik",
      desc: "Mendeteksi cluster peningkatan kasus lokal (outbreak warning), angka putus berobat (lost to follow-up), konversi dahak bulan ke-2, serta kalkulasi angka keberhasilan pengobatan (treatment success rate)."
    },
    dinkes: {
      title: "07. Dashboard Eksekutif Dinkes & Early Warning System",
      desc: "Menampilkan peta sebaran GIS wilayah berisiko tinggi (merah/kuning), indikator CDR (Case Detection Rate), serta memberikan notifikasi darurat penanganan lonjakan kasus."
    },
    logistik: {
      title: "08. Kebijakan Intervensi & Logistik OAT Kemenkes",
      desc: "Menjamin ketersediaan buffer stock Obat Anti Tuberkulosis (OAT Kategori 1 & Rejimen TB-RO) agar tidak terjadi 'stock-out' di faskes manapun di seluruh Indonesia."
    }
  };

  let animationInstance = null;
  let isPlaying = true;

  function initAnimeFlow() {
    if (typeof anime === 'undefined') {
      console.warn('Anime.js not loaded yet. Retrying...');
      setTimeout(initAnimeFlow, 300);
      return;
    }

    const svg = document.getElementById('sitb-flow-svg');
    if (!svg) return;

    // Attach click handlers on SVG nodes
    Object.keys(nodeDetails).forEach(key => {
      const nodeEl = document.getElementById(`node-${key}`);
      if (nodeEl) {
        nodeEl.style.cursor = 'pointer';
        nodeEl.addEventListener('click', () => selectNode(key));
      }
    });

    // Start data packet animations
    startPipelineAnimation();
  }

  function selectNode(key) {
    const data = nodeDetails[key];
    if (!data) return;

    const titleEl = document.getElementById('flow-info-title');
    const descEl = document.getElementById('flow-info-desc');

    if (titleEl && descEl) {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;

      // Animate text transition
      anime({
        targets: [titleEl, descEl],
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 400,
        easing: 'easeOutQuad'
      });
    }

    // Highlight selected node
    document.querySelectorAll('.flow-node').forEach(el => {
      el.classList.remove('active');
      const rect = el.querySelector('rect, circle');
      if (rect) rect.setAttribute('stroke-width', '1.5');
    });

    const activeNode = document.getElementById(`node-${key}`);
    if (activeNode) {
      activeNode.classList.add('active');
      const rect = activeNode.querySelector('rect, circle');
      if (rect) {
        rect.setAttribute('stroke-width', '3');
        anime({
          targets: rect,
          scale: [1, 1.05, 1],
          duration: 400,
          easing: 'easeInOutQuad'
        });
      }
    }
  }

  function startPipelineAnimation() {
    // Animate glowing particles along SVG paths
    const particles = document.querySelectorAll('.flow-packet');
    if (!particles.length) return;

    // Pulsing Central Hub
    anime({
      targets: '#hub-pulse',
      r: [42, 58],
      opacity: [0.6, 0.0],
      duration: 1800,
      easing: 'easeOutSine',
      loop: true
    });

    // Path dash animations
    anime({
      targets: '.flow-line-animated',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      duration: 3000,
      delay: function (el, i) { return i * 250; },
      loop: true
    });

    // Animate individual data packets
    const paths = [
      { p: '#path-faskes-hub', packet: '#packet-1', delay: 0 },
      { p: '#path-swasta-hub', packet: '#packet-2', delay: 600 },
      { p: '#path-lab-hub', packet: '#packet-3', delay: 1200 },
      { p: '#path-kontak-hub', packet: '#packet-4', delay: 1800 },
      { p: '#path-hub-analisis', packet: '#packet-5', delay: 400 },
      { p: '#path-analisis-dinkes', packet: '#packet-6', delay: 1000 },
      { p: '#path-analisis-logistik', packet: '#packet-7', delay: 1600 }
    ];

    paths.forEach(item => {
      const pathEl = document.querySelector(item.p);
      const packetEl = document.querySelector(item.packet);
      if (pathEl && packetEl) {
        const path = anime.path(pathEl);
        anime({
          targets: packetEl,
          translateX: path('x'),
          translateY: path('y'),
          rotate: path('angle'),
          easing: 'linear',
          duration: 2600,
          loop: true,
          delay: item.delay
        });
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimeFlow);
  } else {
    initAnimeFlow();
  }
})();

