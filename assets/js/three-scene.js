/**
 * SITB Edu - Three.js 3D Medical Visualizer
 * Dual Mode: Mycobacterium tuberculosis (Bacilli) & Lungs Pathology (Infection Nodules)
 */

(function () {
  'use strict';

  let scene, camera, renderer, controls;
  let container;
  let bacteriaGroup, lungsGroup, particleGroup;
  let currentMode = 'bacteria'; // 'bacteria' | 'lungs'
  let isAutoRotate = true;
  let isWireframe = false;
  let animationFrameId;

  // Hotspot / HUD data
  const clinicalInfo = {
    bacteria: {
      tag: "PATOGEN TB - MIKROBIOLOGI",
      name: "Mycobacterium tuberculosis (BTA)",
      desc: "Bakteri berbentuk batang (basil) lurus/agak bengkok dengan panjang 2–4 µm dan lebar 0.2–0.5 µm. Memiliki dinding sel kaya lipid & asam mikolat kompleks yang membuatnya tahan asam, hidrofobik, dan kebal terhadap berbagai antibiotik standar."
    },
    lungs: {
      tag: "ANATOMI PATOLOGI THORAX",
      name: "Paru-Paru & Lesi Tuberkulosis (Kavitas)",
      desc: "Kuman TB menyukai jaringan kaya oksigen di apeks (bagian atas) paru. Menghasilkan lesi perkejuan (kaseosa), kavitas berdinding tebal, fibrosis, dan pembesaran kelenjar getah bening hilus (Kompleks Ghon)."
    }
  };

  function initThree() {
    container = document.getElementById('three-canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0407, 0.025);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 35;
      controls.minDistance = 6;
      controls.autoRotate = isAutoRotate;
      controls.autoRotateSpeed = 1.2;
    }

    // 5. Lighting
    setupLighting();

    // 6. Build Models
    bacteriaGroup = createBacteriaModel();
    lungsGroup = createLungsModel();
    particleGroup = createBioParticles();

    scene.add(bacteriaGroup);
    scene.add(lungsGroup);
    scene.add(particleGroup);

    // Initial visibility
    lungsGroup.visible = false;
    bacteriaGroup.visible = true;

    // 7. Event Listeners
    setupControlsUI();
    window.addEventListener('resize', onWindowResize);

    // 8. Start Loop
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key Light - Burgundy/Crimson tone
    const keyLight = new THREE.PointLight(0xc93b5d, 2.5, 50);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    // Fill Light - Medical Bio-Cyan tone
    const fillLight = new THREE.PointLight(0x06b6d4, 2.0, 50);
    fillLight.position.set(-10, -10, -10);
    scene.add(fillLight);

    // Back Light - Rose Gold sheen
    const backLight = new THREE.DirectionalLight(0xe07a5f, 1.5);
    backLight.position.set(0, 20, -15);
    scene.add(backLight);
  }

  /**
   * Generates Mycobacterium tuberculosis Bacilli Cluster
   */
  function createBacteriaModel() {
    const group = new THREE.Group();

    // Capsule helper: cylinder + 2 spheres
    function createBacillus(radius, length, colorHex) {
      const bacillus = new THREE.Group();
      
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.25,
        metalness: 0.1,
        transmission: 0.35,
        thickness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        wireframe: isWireframe
      });

      // Central cylinder
      const cylGeom = new THREE.CylinderGeometry(radius, radius, length, 32);
      const cyl = new THREE.Mesh(cylGeom, mat);
      bacillus.add(cyl);

      // Top cap
      const sphereGeom = new THREE.SphereGeometry(radius, 32, 16);
      const topCap = new THREE.Mesh(sphereGeom, mat);
      topCap.position.y = length / 2;
      bacillus.add(topCap);

      // Bottom cap
      const bottomCap = new THREE.Mesh(sphereGeom, mat);
      bottomCap.position.y = -length / 2;
      bacillus.add(bottomCap);

      // Outer mycolic acid sheath / glow
      const sheathGeom = new THREE.CylinderGeometry(radius * 1.15, radius * 1.15, length * 1.05, 16);
      const sheathMat = new THREE.MeshBasicMaterial({
        color: 0xff4d79,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const sheath = new THREE.Mesh(sheathGeom, sheathMat);
      bacillus.add(sheath);

      return bacillus;
    }

    // Bacilli configurations (cluster of tuberculosis bacteria)
    const bacilliData = [
      { r: 0.55, l: 3.8, color: 0xc93b5d, pos: [0, 0, 0], rot: [0.2, 0.4, 0.6] },
      { r: 0.5, l: 3.4, color: 0x9b2c46, pos: [-1.8, 1.2, -0.8], rot: [-0.4, 0.7, -0.3] },
      { r: 0.52, l: 3.6, color: 0x751e33, pos: [1.6, -1.0, 0.6], rot: [0.6, -0.3, 0.8] },
      { r: 0.48, l: 3.2, color: 0xe07a5f, pos: [-0.8, -1.8, -1.2], rot: [1.1, 0.5, -0.5] },
      { r: 0.54, l: 4.0, color: 0x8b263e, pos: [1.4, 1.8, -0.5], rot: [-0.7, -0.6, 0.4] },
      { r: 0.45, l: 3.0, color: 0xb53250, pos: [-2.2, -0.6, 1.0], rot: [0.3, 1.2, -0.8] },
      { r: 0.5, l: 3.5, color: 0xc93b5d, pos: [0.3, 2.5, 0.8], rot: [-0.5, 0.8, 0.7] }
    ];

    bacilliData.forEach(d => {
      const b = createBacillus(d.r, d.l, d.color);
      b.position.set(...d.pos);
      b.rotation.set(...d.rot);
      group.add(b);
    });

    // Medical Target Ring (HUD)
    const ringGeom = new THREE.RingGeometry(5.5, 5.58, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    group.add(ring);

    return group;
  }

  /**
   * Generates 3D Lungs with Bronchial Tree & Infection Nodules
   */
  function createLungsModel() {
    const group = new THREE.Group();

    // 1. Bronchial Tree (Trachea & Main Bronchi)
    const bronchusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: isWireframe
    });

    // Trachea (Batang Tenggorokan)
    const tracheaGeom = new THREE.CylinderGeometry(0.45, 0.4, 3.2, 24);
    const trachea = new THREE.Mesh(tracheaGeom, bronchusMat);
    trachea.position.set(0, 3.6, 0);
    group.add(trachea);

    // Left & Right Bronchus
    const bronchusRGeom = new THREE.CylinderGeometry(0.3, 0.25, 2.2, 16);
    const bronchusR = new THREE.Mesh(bronchusRGeom, bronchusMat);
    bronchusR.position.set(1.1, 1.8, 0);
    bronchusR.rotation.z = -0.7;
    group.add(bronchusR);

    const bronchusLGeom = new THREE.CylinderGeometry(0.3, 0.25, 2.2, 16);
    const bronchusL = new THREE.Mesh(bronchusLGeom, bronchusMat);
    bronchusL.position.set(-1.1, 1.8, 0);
    bronchusL.rotation.z = 0.7;
    group.add(bronchusL);

    // 2. Lungs Parenchyma (Volumetric Point Cloud Lungs)
    function createLungLobe(isRight) {
      const lobeGroup = new THREE.Group();
      const count = 3500;
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorBase = new THREE.Color(0x9b2c46);
      const colorInfect = new THREE.Color(0xef4444);

      for (let i = 0; i < count; i++) {
        // Parametric ellipsoid coordinates with lungs deformation
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random());

        // Lobe proportions (Apex narrow, base broad, medial concavity)
        let x = r * Math.sin(phi) * Math.cos(theta) * 2.2;
        let y = r * Math.cos(phi) * 3.4;
        let z = r * Math.sin(phi) * Math.sin(theta) * 1.8;

        // Shape deformation for lungs
        y += 0.4;
        if (y < 0) {
          x *= (1.0 - y * 0.15); // broader base
        }
        if (isRight) {
          x += 2.4;
        } else {
          x -= 2.4;
          // Cardiac notch on left lung
          if (y < 0 && x > -2.0) x -= 0.5;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color gradient: higher apical lesions are infected (bright crimson)
        const isApicalInfection = (y > 1.2 && Math.random() < 0.35);
        const c = isApicalInfection ? colorInfect : colorBase;

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const pMesh = new THREE.Points(geom, pMat);
      lobeGroup.add(pMesh);
      return lobeGroup;
    }

    group.add(createLungLobe(true));  // Right lung (3 lobes)
    group.add(createLungLobe(false)); // Left lung (2 lobes)

    // 3. Tuberculosis Cavitary Lesion (Active TB Focus at Apex)
    const cavityGeom = new THREE.SphereGeometry(0.85, 24, 24);
    const cavityMat = new THREE.MeshPhysicalMaterial({
      color: 0xff3b5c,
      emissive: 0x751e33,
      emissiveIntensity: 0.8,
      roughness: 0.4,
      metalness: 0.1,
      wireframe: true
    });
    const cavityNodule = new THREE.Mesh(cavityGeom, cavityMat);
    cavityNodule.position.set(2.4, 2.6, 0.4);
    group.add(cavityNodule);

    // Ghon Focus (Subpleural calcification nodule)
    const ghonGeom = new THREE.SphereGeometry(0.55, 16, 16);
    const ghonMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6
    });
    const ghonFocus = new THREE.Mesh(ghonGeom, ghonMat);
    ghonFocus.position.set(-2.5, 0.5, 0.9);
    group.add(ghonFocus);

    group.position.y = -0.5;
    return group;
  }

  /**
   * Floating Bio-particles
   */
  function createBioParticles() {
    const count = 400;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geom, mat);
  }

  /**
   * HUD & UI Buttons Interaction
   */
  function setupControlsUI() {
    const btnBacteria = document.getElementById('btn-3d-bacteria');
    const btnLungs = document.getElementById('btn-3d-lungs');
    const btnRotate = document.getElementById('btn-3d-rotate');
    const btnWireframe = document.getElementById('btn-3d-wireframe');
    const btnReset = document.getElementById('btn-3d-reset');

    const hudTag = document.getElementById('hud-tag');
    const hudName = document.getElementById('hud-name');
    const hudDesc = document.getElementById('hud-desc');

    function updateHudInfo(mode) {
      if (hudTag && hudName && hudDesc) {
        hudTag.textContent = clinicalInfo[mode].tag;
        hudName.textContent = clinicalInfo[mode].name;
        hudDesc.textContent = clinicalInfo[mode].desc;
      }
    }

    if (btnBacteria) {
      btnBacteria.addEventListener('click', () => {
        currentMode = 'bacteria';
        bacteriaGroup.visible = true;
        lungsGroup.visible = false;
        btnBacteria.classList.add('active');
        if (btnLungs) btnLungs.classList.remove('active');
        updateHudInfo('bacteria');
      });
    }

    if (btnLungs) {
      btnLungs.addEventListener('click', () => {
        currentMode = 'lungs';
        bacteriaGroup.visible = false;
        lungsGroup.visible = true;
        btnLungs.classList.add('active');
        if (btnBacteria) btnBacteria.classList.remove('active');
        updateHudInfo('lungs');
      });
    }

    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        isAutoRotate = !isAutoRotate;
        if (controls) controls.autoRotate = isAutoRotate;
        btnRotate.classList.toggle('active', isAutoRotate);
      });
    }

    if (btnWireframe) {
      btnWireframe.addEventListener('click', () => {
        isWireframe = !isWireframe;
        btnWireframe.classList.toggle('active', isWireframe);

        // Toggle wireframe on bacteria
        bacteriaGroup.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.wireframe = isWireframe;
          }
        });
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (controls) controls.reset();
        camera.position.set(0, 0, 18);
      });
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /**
   * Main Render Loop
   */
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Subtle floating brownian animation for bacteria
    if (bacteriaGroup && bacteriaGroup.visible) {
      bacteriaGroup.rotation.y = time * 0.15;
      bacteriaGroup.children.forEach((b, i) => {
        if (b.isGroup) {
          b.position.y += Math.sin(time * 1.5 + i) * 0.003;
        }
      });
    }

    // Gentle breathing pulsation for lungs
    if (lungsGroup && lungsGroup.visible) {
      const breathScale = 1.0 + Math.sin(time * 2.0) * 0.02;
      lungsGroup.scale.set(breathScale, breathScale, breathScale);
    }

    // Particle drift
    if (particleGroup) {
      particleGroup.rotation.y = time * 0.04;
      particleGroup.rotation.x = time * 0.02;
    }

    if (controls) controls.update();

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();

