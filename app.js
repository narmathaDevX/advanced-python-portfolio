/**
 * Advanced Python Programming Course Portfolio
 * Student: Narmatha N (23MIC0049)
 * Application Logic, Multi-Page Router & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initViewRouter();
  initSubTabs();
  initAccordions();
  initAudioPlayer();
  initVideoUpload();
  initCopyButtons();
  initMobileMenu();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   Multi-Page View Router (Home, Theory, Lab, Project)
   -------------------------------------------------------------------------- */
const VALID_VIEWS = ['home', 'theory', 'lab', 'projects'];

function initViewRouter() {
  // Listen for browser back/forward or hash changes
  window.addEventListener('hashchange', () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (VALID_VIEWS.includes(rawHash)) {
      applyViewChange(rawHash, false);
    }
  });

  // Initial load check
  const initialHash = window.location.hash.replace('#', '').trim();
  if (VALID_VIEWS.includes(initialHash)) {
    applyViewChange(initialHash, false);
  } else {
    applyViewChange('home', false);
  }
}

function navigateTo(viewName) {
  if (!VALID_VIEWS.includes(viewName)) viewName = 'home';
  applyViewChange(viewName, true);
}

function applyViewChange(viewName, updateHash = true) {
  // 1. Hide all views and show target view
  VALID_VIEWS.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  // 2. Update navbar active states
  const navItems = document.querySelectorAll('.nav-links .nav-item, .drawer-links .drawer-item');
  navItems.forEach(item => {
    const pageAttr = item.getAttribute('data-page');
    if (pageAttr === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 3. Update URL hash if requested
  if (updateHash && window.location.hash !== `#${viewName}`) {
    window.location.hash = viewName;
  }

  // 4. Smooth scroll to top of page on view change
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* --------------------------------------------------------------------------
   Mobile Drawer Menu Handlers
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) drawer.classList.remove('open');
}

/* --------------------------------------------------------------------------
   Fun Interactive Python Quick Shell on Home Page
   -------------------------------------------------------------------------- */
function runTermCommand(commandType) {
  const term = document.getElementById('terminalOutput');
  if (!term) return;

  if (commandType === 'clear') {
    term.innerHTML = `
      <div class="term-line"><span class="term-prompt">&gt;&gt;&gt;</span> <span class="term-code"># Terminal cleared. Click a quick command below:</span></div>
    `;
    showToast('Terminal cleared');
    return;
  }

  let codePrompt = '';
  let responseText = '';

  if (commandType === 'profile') {
    codePrompt = 'whoami()';
    responseText = `Student: Narmatha N | Reg: 23MIC0049 | Degree: M.Tech Integrated (Computer Science) | Course: CSI3007 Advanced Python Programming | Faculty: Dr. Sharmila Banu K | Institution: VIT Vellore`;
  } else if (commandType === 'theory') {
    codePrompt = 'get_theory_summary()';
    responseText = `[CSI3007 Theory] 10 Comparative Matrix Extra Questions, Quizizz Built-in & Library Review, IoT Assistive Interface (Fine Motor Impairment), Hachoir Binary Analysis Case Study, Interactive Class Experience.`;
  } else if (commandType === 'lab') {
    codePrompt = 'get_lab_stats()';
    responseText = `[CSI3007L Lab 💻] Multithreading Barista Concurrency Storyboard, In-Lab BuildWise Pitch, Padlet Question Sets, 3 Handwritten LeetCode Sheets, Vector DBs (FAISS/Qdrant), 12 Assessment Topics (03.09 & 07.09).`;
  } else if (commandType === 'project') {
    codePrompt = 'get_project_intel()';
    responseText = `[CSI3007J Capstone 🚀] BuildWise + Plan2Space 3D + CivicFix: Full-Stack Python FastAPI Microservices, React 18 Studio, Three.js WebGL Spatial Walkthroughs, Live Civic Ingestion, PostGIS, NBC 2016 Compliance.`;
  } else if (commandType === 'syllabus') {
    codePrompt = 'get_syllabus()';
    responseText = `[CSI3007 Approved 8-Module Syllabus & Course Outcomes] \n• Module 1: Data Structures (CO:1 • Apply/Remember) - Lists, Dicts, Tuples, Sets, Lambdas, Generators\n• Module 2: Classes & Objects (CO:2 • Apply/Understand) - OOP, Abstraction, Data Hiding, Inheritance\n• Module 3: Multithreading in Python (CO:3 • Apply) - Multiprocessing, Threading, PriorityQueue\n• Module 4: Data Processing (CO:4 • Analyze/Apply) - CSV, JSON, NumPy Arrays, Slicing, Matplotlib\n• Module 5: Data Science Perspectives (CO:5 • Analyze/Understand) - Series, DataFrames, GroupBy, Pivot Summary Tables\n• Module 6: Data Handling Techniques (CO:6 • Apply/Understand) - Data Wrangling, Joining, Loan Prediction\n• Module 7: Web Applications (CO:7 • Evaluate/Create) - Django/Flask/FastAPI, NoSQL, Embedded IoT Devices\n• Module 8: Recent Trends (CO:8 • Analyze) - Recent Innovative Projects, Spatial Computing & AI`;
  }

  const promptLine = document.createElement('div');
  promptLine.className = 'term-line';
  promptLine.innerHTML = `<span class="term-prompt">&gt;&gt;&gt;</span> <span class="term-code">${codePrompt}</span>`;

  const resLine = document.createElement('div');
  resLine.className = 'term-line';
  resLine.innerHTML = `<span class="term-res">${responseText}</span>`;

  term.appendChild(promptLine);
  term.appendChild(resLine);
  term.scrollTop = term.scrollHeight;
  showToast(`Executed ${codePrompt}`);
}

/* --------------------------------------------------------------------------
   Theme Toggle (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Load stored theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' 
    ? '<i class="fa-solid fa-moon"></i>' 
    : '<i class="fa-solid fa-sun"></i>';
}

/* --------------------------------------------------------------------------
   Subsections Tab Switching (Theory & Lab)
   -------------------------------------------------------------------------- */
function initSubTabs() {
  setupTabGroup('theoryTabs');
  setupTabGroup('labTabs');
  setupTabGroup('projectTabs');
}

function setupTabGroup(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll('.sub-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      // Update button active state in this group
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility in parent section
      const section = container.closest('.portfolio-section');
      if (!section) return;

      const panels = section.querySelectorAll('.sub-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Accordion Toggle (Extra Questions)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;
      
      const isOpen = item.classList.contains('open');
      
      const parentList = item.closest('.accordion-list');
      if (parentList) {
        parentList.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      }

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Audio Player Interaction (Lab Audio Recording - Real Audio Playback)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const audio = document.getElementById('labAudioElement');
  const playBtn = document.getElementById('audioPlayToggle');
  const playIcon = document.getElementById('playIcon');
  const rewindBtn = document.getElementById('audioRewindBtn');
  const forwardBtn = document.getElementById('audioForwardBtn');
  const waveform = document.getElementById('waveform');
  const timeDisplay = document.getElementById('currentTime');
  const totalDurationDisplay = document.getElementById('totalDuration');
  const progressBar = document.getElementById('audioProgressBar');
  const progressWrap = document.getElementById('audioProgressWrap');
  const volumeSlider = document.getElementById('audioVolume');
  const muteBtn = document.getElementById('audioMuteToggle');
  const volIcon = document.getElementById('volIcon');

  if (!audio || !playBtn) return;

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Set duration once audio metadata loads
  const setDuration = () => {
    if (audio.duration && !isNaN(audio.duration) && totalDurationDisplay) {
      totalDurationDisplay.textContent = formatTime(audio.duration);
    }
  };

  audio.addEventListener('loadedmetadata', setDuration);
  if (audio.readyState >= 1) {
    setDuration();
  }

  // Play / Pause Toggle
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (waveform) waveform.classList.add('playing');
        showToast('Playing BuildWise Project Pitch Recording');
      }).catch(err => {
        console.warn('Playback error:', err);
        showToast('Click anywhere on the page first, then play audio.');
      });
    } else {
      audio.pause();
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (waveform) waveform.classList.remove('playing');
      showToast('Audio Paused');
    }
  });

  // Timeupdate: sync time display, progress bar, and waveform
  audio.addEventListener('timeupdate', () => {
    if (timeDisplay) {
      timeDisplay.textContent = formatTime(audio.currentTime);
    }
    const duration = audio.duration || 206.6;
    const progressPercent = (audio.currentTime / duration) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
    if (waveform) {
      const bars = waveform.querySelectorAll('.wave-bar');
      const activeBarCount = Math.floor((audio.currentTime / duration) * bars.length);
      bars.forEach((bar, index) => {
        if (index <= activeBarCount) {
          bar.classList.add('passed');
        } else {
          bar.classList.remove('passed');
        }
      });
    }
  });

  // Audio Ended
  audio.addEventListener('ended', () => {
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (waveform) waveform.classList.remove('playing');
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '00:00';
    audio.currentTime = 0;
  });

  // Rewind 10s
  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
      showToast('Rewound 10 seconds');
    });
  }

  // Forward 10s
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      const maxDuration = audio.duration || 206.6;
      audio.currentTime = Math.min(maxDuration, audio.currentTime + 10);
      showToast('Forwarded 10 seconds');
    });
  }

  // Click on progress bar to seek
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      const rect = progressWrap.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const duration = audio.duration || 206.6;
      audio.currentTime = clickPos * duration;
    });
  }

  // Click on waveform to seek
  if (waveform) {
    waveform.addEventListener('click', (e) => {
      const rect = waveform.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const duration = audio.duration || 206.6;
      audio.currentTime = clickPos * duration;
    });
  }

  // Volume slider
  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener('input', () => {
      audio.volume = parseFloat(volumeSlider.value);
      audio.muted = (audio.volume === 0);
      updateVolIcon();
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      updateVolIcon();
    });
  }

  function updateVolIcon() {
    if (!volIcon) return;
    if (audio.muted || audio.volume === 0) {
      volIcon.className = 'fa-solid fa-volume-xmark';
    } else if (audio.volume < 0.5) {
      volIcon.className = 'fa-solid fa-volume-low';
    } else {
      volIcon.className = 'fa-solid fa-volume-high';
    }
  }
}

/* --------------------------------------------------------------------------
   Copy Code Snippet Buttons
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-snippet-box')?.querySelector('pre code');
      if (!codeBlock) return;

      navigator.clipboard.writeText(codeBlock.textContent.trim()).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-accent"></i> Copied!';
        showToast('Code copied to clipboard!');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      }).catch(() => {
        showToast('Could not copy automatically');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Proof Modal Handler (For Upload / Proof Image Placeholders)
   -------------------------------------------------------------------------- */
function triggerProofModal(itemTitle) {
  const modal = document.getElementById('proofModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  if (!modal) return;

  if (modalTitle) modalTitle.textContent = itemTitle;
  if (modalDescription) {
    modalDescription.innerHTML = `
      This is a dedicated slot for <strong>${itemTitle}</strong>.<br>
      In your next message, provide the image file, URL, or screenshot, and it will be embedded right here!
    `;
  }

  modal.classList.add('active');
}

function closeProofModal(event) {
  const modal = document.getElementById('proofModal');
  if (modal) modal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   Project Resource Link Handler (PPT, Video, Live Project, GitHub)
   -------------------------------------------------------------------------- */
function handleLinkClick(linkName, linkType) {
  const placeholders = {
    ppt: {
      title: 'Presentation Slide Deck (PPT)',
      message: 'PPT presentation link placeholder is ready. In the next chat, send your Google Slides, OneDrive, or PDF link to connect it instantly!'
    },
    video: {
      title: 'Project Demo Video',
      message: 'Demo video link placeholder is ready. You can share your YouTube, Drive, or Loom link to embed or launch directly.'
    },
    proj: {
      title: 'Live Project Application',
      message: 'Live project web application URL slot is active. Send your Streamlit, Render, PythonAnywhere, or Vercel link when ready.'
    },
    github: {
      title: 'GitHub Source Repository',
      message: 'GitHub repository slot is configured. Send your repository URL (e.g. github.com/narmatha-n/advanced-python) to link your code directly.'
    }
  };

  const info = placeholders[linkType] || { title: linkName, message: 'Link slot ready for input.' };
  
  const modal = document.getElementById('proofModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  if (modal && modalTitle && modalDescription) {
    modalTitle.textContent = info.title;
    modalDescription.innerHTML = `
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--accent-cyan);">
        <i class="fa-solid fa-link"></i> ${info.title}
      </div>
      <p style="margin-bottom: 1rem;">${info.message}</p>
      <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem;">
        Status: <span style="color: var(--accent-amber);">Awaiting Narmatha's Link</span>
      </div>
    `;
    modal.classList.add('active');
  } else {
    showToast(`${info.title} placeholder ready!`);
  }
}

/* --------------------------------------------------------------------------
   Real-Time Table Filter for Extra Questions
   -------------------------------------------------------------------------- */
function filterQuestionsTable() {
  const input = document.getElementById('questionSearch');
  const filter = input ? input.value.toLowerCase().trim() : '';
  const table = document.getElementById('questionsTable');
  if (!table) return;

  const rows = table.getElementsByTagName('tbody')[0]?.getElementsByTagName('tr');
  if (!rows) return;

  for (let i = 0; i < rows.length; i++) {
    const rowText = rows[i].textContent.toLowerCase();
    if (rowText.includes(filter)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

/* --------------------------------------------------------------------------
   High-Res Image Lightbox Modal
   -------------------------------------------------------------------------- */
function openImageModal(imageSrc, captionTitle) {
  const modal = document.getElementById('proofModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = captionTitle || 'Photo Preview';
  modalBody.innerHTML = `
    <div style="text-align: center; max-height: 70vh; overflow-y: auto;">
      <img src="${imageSrc}" alt="${captionTitle}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--border-accent);">
      <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
        <i class="fa-solid fa-circle-check text-accent"></i> ${captionTitle}
      </p>
    </div>
  `;

  modal.classList.add('active');
}

/* --------------------------------------------------------------------------
   Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* --------------------------------------------------------------------------
   Tab Switching Helpers for All Domains (Theory, Lab, Project)
   -------------------------------------------------------------------------- */
function switchTheoryTab(tabId) {
  const container = document.getElementById('theoryTabs');
  if (!container) return;
  const targetBtn = container.querySelector(`[data-target="${tabId}"]`);
  if (targetBtn) {
    targetBtn.click();
    targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function switchLabTab(tabId) {
  const container = document.getElementById('labTabs');
  if (!container) return;
  const targetBtn = container.querySelector(`[data-target="${tabId}"]`);
  if (targetBtn) {
    targetBtn.click();
    targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function switchProjectTab(tabId) {
  const container = document.getElementById('projectTabs');
  if (!container) return;
  const targetBtn = container.querySelector(`[data-target="${tabId}"]`);
  if (targetBtn) {
    targetBtn.click();
    targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function switchVideo(type) {
  const video = document.getElementById('carVideoElement');
  const source = document.getElementById('carVideoSource');
  const btnInput = document.getElementById('btnInputVideo');
  const btnDetected = document.getElementById('btnDetectedVideo');
  const statusBadge = document.getElementById('videoStatusBadge');

  if (!video || !source) return;

  if (type === 'detected') {
    source.src = 'assets/car_moving_detected.mp4';
    if (btnInput) btnInput.classList.remove('active');
    if (btnDetected) btnDetected.classList.add('active');
    if (statusBadge) {
      statusBadge.innerHTML = '<i class="fa-solid fa-crosshairs text-emerald"></i> <strong>Detection Result Video:</strong> Specific Red Car Detected &amp; Tracked with Bounding Box amidst 5&ndash;6 Concurrent Moving Vehicles';
    }
    showToast('Switched to Detection Result Video (Target Red Car Tracked)');
  } else {
    source.src = 'assets/car_moving_input.mp4';
    if (btnDetected) btnDetected.classList.remove('active');
    if (btnInput) btnInput.classList.add('active');
    if (statusBadge) {
      statusBadge.innerHTML = '<i class="fa-solid fa-video text-accent"></i> <strong>Raw Multi-Car Input Video:</strong> 30s Multi-Lane Highway Recording (5&ndash;6 Concurrent Moving Vehicles in Frame)';
    }
    showToast('Switched to Raw Multi-Car Input Video');
  }
  video.load();
  video.play().catch(() => {});
}

function initVideoUpload() {
  const uploader = document.getElementById('userVideoUpload');
  const video = document.getElementById('carVideoElement');
  const source = document.getElementById('carVideoSource');
  const statusBadge = document.getElementById('videoStatusBadge');

  if (!uploader || !video) return;

  uploader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      source.src = fileUrl;
      video.load();
      video.play().catch(() => {});
      if (statusBadge) {
        statusBadge.innerHTML = `<i class="fa-solid fa-file-video text-accent"></i> <strong>Custom Video Loaded:</strong> ${file.name} (${(file.size / (1024*1024)).toFixed(1)} MB)`;
      }
      showToast(`Loaded user video: ${file.name}`);
    }
  });
}

function toggleDetectionResult() {
  const resultCard = document.getElementById('detectionResultsCard');
  const btn = document.getElementById('btnToggleResultModal');
  if (!resultCard) return;

  const isHidden = resultCard.style.display === 'none' || !resultCard.style.display;
  if (isHidden) {
    resultCard.style.display = 'block';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Detection Results';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Displaying Detection Frame Results');
  } else {
    resultCard.style.display = 'none';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-table-list"></i> See Detection Results Table & Keyframe Timestamps';
  }
}

/* --------------------------------------------------------------------------
   Lab GVI & Pivot Table Analytical Query Handlers
   -------------------------------------------------------------------------- */
function selectGVIQuery(queryNum) {
  // Update query nav buttons
  const navBtns = document.querySelectorAll('.gvi-query-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-query') === String(queryNum)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update KPI cards
  const kpiCards = document.querySelectorAll('.gvi-kpi-card');
  kpiCards.forEach(card => {
    if (card.getAttribute('data-query') === String(queryNum)) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // Show active query pane
  const panes = document.querySelectorAll('.gvi-query-pane');
  panes.forEach(pane => {
    if (pane.id === `gvi-pane-${queryNum}`) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  const targetPane = document.getElementById(`gvi-pane-${queryNum}`);
  if (targetPane) {
    targetPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function toggleGVICode(queryNum) {
  const drawer = document.getElementById(`gvi-drawer-${queryNum}`);
  const togglePill = document.getElementById(`gvi-toggle-pill-${queryNum}`);
  if (!drawer) return;

  const isExpanded = drawer.classList.contains('expanded');
  if (isExpanded) {
    drawer.classList.remove('expanded');
    if (togglePill) {
      togglePill.innerHTML = '<i class="fa-solid fa-code"></i> Show 3 Python Solutions (pivot_table, groupby, filtering) <i class="fa-solid fa-chevron-down"></i>';
    }
  } else {
    drawer.classList.add('expanded');
    if (togglePill) {
      togglePill.innerHTML = '<i class="fa-solid fa-code"></i> Hide Python Solutions <i class="fa-solid fa-chevron-up"></i>';
    }
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function toggleTerminal() {
  const drawer = document.getElementById('terminalDrawer');
  const icon = document.getElementById('terminalToggleIcon');
  if (!drawer) return;
  const isExpanded = drawer.classList.contains('expanded');
  if (isExpanded) {
    drawer.classList.remove('expanded');
    if (icon) icon.className = 'fa-solid fa-chevron-down';
  } else {
    drawer.classList.add('expanded');
    if (icon) icon.className = 'fa-solid fa-chevron-up';
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Global exposure for inline onclick attributes
window.navigateTo = navigateTo;
window.closeMobileMenu = closeMobileMenu;
window.runTermCommand = runTermCommand;
window.triggerProofModal = triggerProofModal;
window.closeProofModal = closeProofModal;
window.handleLinkClick = handleLinkClick;
window.showToast = showToast;
window.filterQuestionsTable = filterQuestionsTable;
window.openImageModal = openImageModal;
window.switchLabTab = switchLabTab;
window.switchTheoryTab = switchTheoryTab;
window.switchProjectTab = switchProjectTab;
window.switchVideo = switchVideo;
window.toggleDetectionResult = toggleDetectionResult;
window.selectGVIQuery = selectGVIQuery;
window.toggleGVICode = toggleGVICode;
window.toggleTerminal = toggleTerminal;

// ==========================================================================
// ENHANCED SIMPLIFIED UI HANDLERS (Syllabus, Video Code, Hachoir, Matrix)
// ==========================================================================

function toggleSyllabusModule(modNum) {
  const body = document.getElementById('syllabusModBody' + modNum);
  const chevron = document.getElementById('syllabusChevron' + modNum);
  if (!body) return;

  const isHidden = (body.style.display === 'none');
  if (isHidden) {
    body.style.display = 'block';
    if (chevron) chevron.classList.add('rotated');
  } else {
    body.style.display = 'none';
    if (chevron) chevron.classList.remove('rotated');
  }
}

function filterSyllabusModule(target) {
  const pills = document.querySelectorAll('.s-filter-pill');
  pills.forEach(function(p) { p.classList.remove('active'); });

  const coCards = document.querySelectorAll('.syllabus-co-card');
  coCards.forEach(function(c) { c.classList.remove('active'); });

  if (target === 'all') {
    for (let i = 1; i <= 8; i++) {
      const card = document.getElementById('syllabusMod' + i);
      const body = document.getElementById('syllabusModBody' + i);
      const chevron = document.getElementById('syllabusChevron' + i);
      if (card) card.style.display = 'block';
      if (body) body.style.display = 'block';
      if (chevron) chevron.classList.add('rotated');
    }
    const allPill = document.querySelector(".s-filter-pill[onclick*='all']");
    if (allPill) allPill.classList.add('active');
  } else {
    const num = parseInt(target, 10);
    for (let i = 1; i <= 8; i++) {
      const card = document.getElementById('syllabusMod' + i);
      const body = document.getElementById('syllabusModBody' + i);
      const chevron = document.getElementById('syllabusChevron' + i);
      if (i === num) {
        if (card) card.style.display = 'block';
        if (body) body.style.display = 'block';
        if (chevron) chevron.classList.add('rotated');
      } else {
        if (card) card.style.display = 'none';
      }
    }
    const matchingPill = document.querySelector(".s-filter-pill[onclick*='filterSyllabusModule(" + num + ")']");
    if (matchingPill) matchingPill.classList.add('active');

    if (coCards && coCards[num - 1]) {
      coCards[num - 1].classList.add('active');
    }

    const targetCard = document.getElementById('syllabusMod' + num);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function expandAllSyllabusModules() {
  for (let i = 1; i <= 8; i++) {
    const card = document.getElementById('syllabusMod' + i);
    const body = document.getElementById('syllabusModBody' + i);
    const chevron = document.getElementById('syllabusChevron' + i);
    if (card) card.style.display = 'block';
    if (body) body.style.display = 'block';
    if (chevron) chevron.classList.add('rotated');
  }
  const allPill = document.querySelector(".s-filter-pill[onclick*='all']");
  if (allPill) {
    document.querySelectorAll('.s-filter-pill').forEach(function(p) { p.classList.remove('active'); });
    allPill.classList.add('active');
  }
}

function collapseAllSyllabusModules() {
  for (let i = 1; i <= 8; i++) {
    const card = document.getElementById('syllabusMod' + i);
    const body = document.getElementById('syllabusModBody' + i);
    const chevron = document.getElementById('syllabusChevron' + i);
    if (card) card.style.display = 'block';
    if (body) body.style.display = 'none';
    if (chevron) chevron.classList.remove('rotated');
  }
}

function toggleHachoirFunctions() {
  const drawer = document.getElementById('hachoirFuncsDrawer');
  const btn = document.getElementById('btnToggleHachoirFuncs');
  if (!drawer || !btn) return;

  const isHidden = (drawer.style.display === 'none' || drawer.style.display === '');
  if (isHidden) {
    drawer.style.display = 'block';
    btn.innerHTML = '<i class="fa-solid fa-list-check"></i> Hide Functions Matrix <i class="fa-solid fa-chevron-up"></i>';
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    drawer.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-list-check"></i> Explore All 10 Functions <i class="fa-solid fa-chevron-down"></i>';
  }
}

function filterMatrixTopic(category, btnElement) {
  const pills = document.querySelectorAll('.m-filter-pill');
  pills.forEach(function(p) { p.classList.remove('active'); });
  if (btnElement) btnElement.classList.add('active');

  const rows = document.querySelectorAll('#questionsTable tbody tr');
  rows.forEach(function(row) {
    if (category === 'all') {
      row.style.display = '';
    } else {
      const rowCat = row.getAttribute('data-category');
      row.style.display = (rowCat === category) ? '' : 'none';
    }
  });
}

function toggleVideoCode() {
  const drawer = document.getElementById('videoCodeDrawer');
  const btn = document.getElementById('btnToggleVideoCode');
  if (!drawer || !btn) return;

  const isHidden = (drawer.style.display === 'none' || drawer.style.display === '');
  if (isHidden) {
    drawer.style.display = 'block';
    btn.innerHTML = '<i class="fa-solid fa-code"></i> Hide Python OpenCV Code <i class="fa-solid fa-chevron-up"></i>';
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    drawer.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-code"></i> View Python OpenCV Code <i class="fa-solid fa-chevron-down"></i>';
  }
}

// Global exports
window.toggleSyllabusModule = toggleSyllabusModule;
window.filterSyllabusModule = filterSyllabusModule;
window.expandAllSyllabusModules = expandAllSyllabusModules;
window.collapseAllSyllabusModules = collapseAllSyllabusModules;
window.toggleHachoirFunctions = toggleHachoirFunctions;
window.filterMatrixTopic = filterMatrixTopic;
window.toggleVideoCode = toggleVideoCode;

function switchPadletSubTab(subId) {
  const mapping = {
    'board': { btn: 'btnPadletSub1', panel: 'padletSubBoard' },
    'worksheets': { btn: 'btnPadletSub2', panel: 'padletSubWorksheets' },
    'activities': { btn: 'btnPadletSub3', panel: 'padletSubActivities' }
  };

  Object.values(mapping).forEach(item => {
    const b = document.getElementById(item.btn);
    const p = document.getElementById(item.panel);
    if (b) b.classList.remove('active');
    if (p) p.style.display = 'none';
  });

  const activeItem = mapping[subId];
  if (activeItem) {
    const activeBtn = document.getElementById(activeItem.btn);
    const activePanel = document.getElementById(activeItem.panel);
    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) activePanel.style.display = 'block';
  }
}

function switchHachoirSubTab(subId) {
  const mapping = {
    'overview': { btn: 'btnHachoirSub1', panel: 'hachoirSubOverview' },
    'features': { btn: 'btnHachoirSub2', panel: 'hachoirSubFeatures' },
    'reflection': { btn: 'btnHachoirSub3', panel: 'hachoirSubReflection' }
  };

  Object.values(mapping).forEach(item => {
    const b = document.getElementById(item.btn);
    const p = document.getElementById(item.panel);
    if (b) b.classList.remove('active');
    if (p) p.style.display = 'none';
  });

  const activeItem = mapping[subId];
  if (activeItem) {
    const activeBtn = document.getElementById(activeItem.btn);
    const activePanel = document.getElementById(activeItem.panel);
    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) activePanel.style.display = 'block';
  }
}

window.switchPadletSubTab = switchPadletSubTab;
window.switchHachoirSubTab = switchHachoirSubTab;

function handleLeetcodeUpload(event) {
  const files = event.target.files;
  if (!files || !files.length) return;

  const grid = document.getElementById('leetcodeSheetsGrid');
  if (!grid) return;

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      const count = grid.querySelectorAll('.sheet-card:not(.sheet-upload-card)').length + 1;
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      
      const newCard = document.createElement('div');
      newCard.className = 'sheet-card animated-card';
      newCard.innerHTML = `
        <div class="sheet-image-box" onclick="openImageModal('${dataUrl}', 'Uploaded LeetCode Sheet: ${cleanName}')">
          <img src="${dataUrl}" alt="${cleanName}" class="sheet-thumb-img">
          <div class="photo-overlay">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
            <span>Click to view Sheet</span>
          </div>
        </div>
        <div class="sheet-details">
          <div class="sheet-tag"><i class="fa-solid fa-tag"></i> Practice Sheet ${count.toString().padStart(2, '0')} (Uploaded)</div>
          <h4 class="sheet-title">${cleanName}</h4>
          <p class="sheet-desc">Handwritten LeetCode practice solution sheet uploaded by student.</p>
        </div>
      `;
      const uploadCard = grid.querySelector('.sheet-upload-card');
      if (uploadCard) {
        grid.insertBefore(newCard, uploadCard);
      } else {
        grid.appendChild(newCard);
      }
    };
    reader.readAsDataURL(file);
  });
}

window.handleLeetcodeUpload = handleLeetcodeUpload;
