/* ==========================================================================
   PERSONALIZABLE CONFIGURATION DATA
   Easily customize messages, photos, and friend letters here.
   ========================================================================== */
const CONFIG = {
  // Centralized photo list (Supports 3 or 4 photos automatically).
  // First photo is always used for the puzzle and first reveal.
  memories: [
  "assets/puzzle-photo.jpg",
  "assets/memory-02.jpg",
  "assets/memory-03.jpg",
  "assets/memory04.jpg"
],

  // Captions for each photo in the gallery / Slide 01
  photoCaptions: {
    "assets/puzzle-photo.jpg": "A memory worth keeping. The puzzle piece that started it all.",
    "assets/memory-02.jpg": "One of our favorite adventures together, filled with laughter.",
    "assets/memory-03.jpg": "A quiet moment of warmth and happiness.",
    "assets/memory04.jpg": "Every single day with you is a gift I cherish."
  },
  
  // Photo Reveal Quote
  revealQuote: "Every moment with you turns into a quiet little masterpiece.",

  // Slide 2: Bouquet quotes/notes (She can pick and reopen these anytime)
  bouquetNotes: [
    {
      id: 1,
      title: "Arah yang sesuai",
      icon: "🌹",
      text: "Karena hati tidak perlu memilih, ia selalu tahu kemana harus berlabuh.",
      signature: "— Selalu jadi milikmu"
    },
    {
      id: 2,
      title: "Sebuah perkataan",
      icon: "🌸",
      text: "Jangan rindu. Ini berat. Kau tak akan kuat. Biar aku saja.",
      signature: "— Jangan di berat beratkan"
    },
    {
      id: 3,
      title: "Setiap momen yang ku tunggu selalu",
      icon: "✨",
      text: "Kau adalah detak di dadaku, hening di malamku, dan pagi yang selalu kunanti.",
      signature: "— Hari yang ku tunggu"
    },
    {
      id: 4,
      title: "Sebuah perjuangan",
      icon: "💐",
      text: "Kamu adalah ketidakpastian yang paling ingin aku perjuangkan.",
      signature: "— Ketidakpastian menjadi perjuang untuk jadi pasti"
    }
  ],

  // Slide 3: Friend & Me Letters (Customizable messages from friends & you)
  friendLetters: [
    {
      id: 1,
      name: "Friend 01",
      icon: "💌",
      hint: "Bestie wishes",
      title: " besti teraayang ",
      text: "Happy Birthday! This is your happy day, I hope you will always be blessed with good health and loved by your family dan besstimu ini selalu ada buat kamu !",
      author: "Alek berikan lelek",
      isSpecial: false
    },
    {
      id: 2,
      name: "Friend 02",
      icon: "💌",
      hint: "Pikiran yang wajib",
      title: "Buka aja lah bingung mau nulis apa",
      text: "Happy birthday nalia wkwkwk umur berapa sih lupa, yang penting mah selamat ulang tahun weh naiii ceuk aku mahh, panjang umurr makin sholehah sama makin langgeng ama marji xD, jadi keinget waktu kamu cerita pas kamu ngomongin tentang si basket atau si rpl itu, dan akhirnya ga dapet wkwkwk eh malah dapetnya mirja lebih baik. Ga ada kata kata lagi sih sing penting important happy birthday nai",
      author: "Fajri",
      isSpecial: false
    },
    {
      id: 3,
      name: "Friend 03",
      icon: "💌",
      hint: "Harapan",
      title: "selamat ultah GIRLIEE",
      text: "Halo cantik, SELAMAT ULANG TAHUN!! Semoga harimu indah dan kamu menikmati hari ulang tahunmu!! Semoga semua harapan dan impianmu terwujud... SELAMAT ULANG TAHUN!!!",
      author: "Gail your sistaco",
      isSpecial: false
    },
    {
      id: 4,
      name: "From Me",
      icon: "💖",
      hint: "Special letter",
      title: "Our Story",
      text: "cieee ada yang habede niii... yang keberapa yaaaa kira kiraaa hmmm? semoga di lancarin segala hal nya seperti pelajaran dan sehari hari nya... janlup kita juga lancar selalu anjayy, moga hadiah ini yang bisa aku kasi untuk sekarang saya mirza berminta maaf, tapi aku tetep kasi sebisa mungkinnn lopeee... dan 3 kata untukmu sayangg, I.LOVE.YOU. sayanggg semoga selalu semangat dan juga happy terusss",
      author: "Your Love ♡",
      isSpecial: true
    }
  ]
};

/* ==========================================================================
   BACKEND / SAVING LOGIC
   Replace these functions with your API endpoint or Webhook (Formspree/Discord)
   ========================================================================== */

/** Saves her thought from Screen 4 */
async function sendThoughtToServer(thoughtText) {
  try {
    const response = await fetch("https://formspree.io/f/xvkojgdb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        type: "Birthday Thought",
        message: thoughtText
      })
    });

    if (!response.ok) {
      throw new Error("Failed to send thought");
    }

    console.log("Thought sent successfully!");
  } catch (error) {
    console.error("Error sending thought:", error);
  }
}

/** Saves her wish from Slide 4 */
async function sendWishToServer(wishText) {
  try {
    const response = await fetch("https://formspree.io/f/xvkojgdb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        type: "Birthday Wish",
        message: wishText
      })
    });

    if (!response.ok) {
      throw new Error("Failed to send wish");
    }

    console.log("Wish sent successfully!");
  } catch (error) {
    console.error("Error sending wish:", error);
  }
}

/* ==========================================================================
   APP STATE MANAGEMENT & SCREEN SWITCHING
   ========================================================================== */
let activeScreenId = "screen-loader";

function showScreen(screenId) {
  const current = document.getElementById(activeScreenId);
  const next = document.getElementById(screenId);

  if (!next || activeScreenId === screenId) return;

  if (current) {
    current.classList.remove("active");
  }
  next.classList.add("active");
  activeScreenId = screenId;
}

/* ==========================================================================
   SCREEN 1: LOADING & ASSET PRELOADING
   ========================================================================== */
let validMemories = [];

async function initLoadingScreen() {
  const progressBar = document.getElementById("loaderProgress");
  let progress = 0;

  // Verify and filter available memory photos (supports 3 or 4 seamlessly without broken images)
  validMemories = [];
  for (const path of CONFIG.memories) {
    const exists = await checkImageExists(path);
    if (exists) {
      validMemories.push(path);
    }
  }

  // Fallback if none loaded
  if (validMemories.length === 0 && CONFIG.memories.length > 0) {
    validMemories.push(CONFIG.memories[0]);
  }

  // Preload audio and valid images
  const audio = document.getElementById("bgMusic");
  if (audio) audio.load();

  validMemories.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      if (progressBar) progressBar.style.width = "100%";
      setTimeout(() => {
        showScreen("screen-puzzle");
        initPuzzle();
      }, 500);
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
    }
  }, 160);
}

function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/* ==========================================================================
   SCREEN 2: 3x3 PHOTO PUZZLE LOGIC
   ========================================================================== */
let puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let selectedTileIndex = null;
let dragSourceIndex = null;
let isPuzzleSolved = false;

function initPuzzle() {
  const puzzlePhoto = validMemories.length > 0 ? validMemories[0] : "assets/puzzle-photo.jpg";

  const peekImg = document.getElementById("peekImage");
  if (peekImg) peekImg.src = puzzlePhoto;

  const revealImg = document.getElementById("revealedPhoto");
  if (revealImg) revealImg.src = puzzlePhoto;

  const revealQuoteEl = document.getElementById("revealQuoteText");
  if (revealQuoteEl) revealQuoteEl.textContent = `"${CONFIG.revealQuote}"`;

  shufflePuzzle();
}

function shufflePuzzle() {
  isPuzzleSolved = false;
  selectedTileIndex = null;
  dragSourceIndex = null;

  const board = document.getElementById("puzzleBoard");
  if (board) board.classList.remove("solved");

  const statusMsg = document.getElementById("puzzleStatus");
  if (statusMsg) statusMsg.textContent = "Rearrange the 9 pieces to unlock the memory.";

  puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  do {
    puzzleOrder.sort(() => Math.random() - 0.5);
  } while (puzzleOrder.every((val, idx) => val === idx));

  renderPuzzleBoard();
}

function renderPuzzleBoard() {
  const board = document.getElementById("puzzleBoard");
  if (!board) return;

  const puzzlePhoto = validMemories.length > 0 ? validMemories[0] : "assets/puzzle-photo.jpg";
  board.innerHTML = "";

  puzzleOrder.forEach((pieceId, currentPosition) => {
    const tile = document.createElement("div");
    tile.className = "puzzle-tile";
    tile.dataset.position = currentPosition;
    tile.dataset.pieceId = pieceId;

    const origRow = Math.floor(pieceId / 3);
    const origCol = pieceId % 3;
    tile.style.backgroundImage = `url("${puzzlePhoto}")`;
    tile.style.backgroundPosition = `${origCol * 50}% ${origRow * 50}%`;

    if (!isPuzzleSolved) {
      tile.draggable = true;

      tile.addEventListener("dragstart", (e) => {
        dragSourceIndex = currentPosition;
        tile.classList.add("dragging");
        e.dataTransfer.setData("text/plain", currentPosition);
      });

      tile.addEventListener("dragend", () => {
        tile.classList.remove("dragging");
        document.querySelectorAll(".puzzle-tile").forEach(t => t.classList.remove("drag-over"));
      });

      tile.addEventListener("dragover", (e) => {
        e.preventDefault();
        tile.classList.add("drag-over");
      });

      tile.addEventListener("dragleave", () => {
        tile.classList.remove("drag-over");
      });

      tile.addEventListener("drop", (e) => {
        e.preventDefault();
        tile.classList.remove("drag-over");
        const fromPos = parseInt(e.dataTransfer.getData("text/plain") || dragSourceIndex, 10);
        const toPos = currentPosition;
        if (!isNaN(fromPos) && fromPos !== toPos) {
          swapPuzzleTiles(fromPos, toPos);
        }
      });

      tile.addEventListener("click", () => handleTileTap(currentPosition));
    }

    if (selectedTileIndex === currentPosition) {
      tile.classList.add("selected");
    }

    board.appendChild(tile);
  });
}

function handleTileTap(position) {
  if (isPuzzleSolved) return;

  if (selectedTileIndex === null) {
    selectedTileIndex = position;
    const statusMsg = document.getElementById("puzzleStatus");
    if (statusMsg) statusMsg.textContent = "Tile selected! Tap another tile to swap.";
    renderPuzzleBoard();
  } else if (selectedTileIndex === position) {
    selectedTileIndex = null;
    const statusMsg = document.getElementById("puzzleStatus");
    if (statusMsg) statusMsg.textContent = "Rearrange the 9 pieces to unlock the memory.";
    renderPuzzleBoard();
  } else {
    const fromPos = selectedTileIndex;
    selectedTileIndex = null;
    swapPuzzleTiles(fromPos, position);
  }
}

function swapPuzzleTiles(fromPos, toPos) {
  if (isPuzzleSolved) return;

  const temp = puzzleOrder[fromPos];
  puzzleOrder[fromPos] = puzzleOrder[toPos];
  puzzleOrder[toPos] = temp;

  renderPuzzleBoard();

  if (checkPuzzleSolved()) {
    handlePuzzleSolved();
  }
}

function checkPuzzleSolved() {
  return puzzleOrder.every((pieceId, index) => pieceId === index);
}

function handlePuzzleSolved() {
  if (isPuzzleSolved) return;

  isPuzzleSolved = true;

  const board = document.getElementById("puzzleBoard");
  const statusMsg = document.getElementById("puzzleStatus");

  if (board) {
    board.classList.add("solved");
  }

  if (statusMsg) {
    statusMsg.textContent = "✨ You solved it!";
  }

  triggerConfetti();

  setTimeout(() => {
    showScreen("screen-thought");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, 1000);
}

function togglePeekPreview() {
  const peekModal = document.getElementById("peekModal");
  if (peekModal) {
    peekModal.classList.toggle("hidden");
  }
}

/* ==========================================================================
   SCREEN 3: REVEAL & SCREEN 4: THOUGHT
   ========================================================================== */
function proceedToGallery() {
  showScreen("screen-gallery");
  initMemoryGallery();
  window.scrollTo(0, 0);
}

let currentMemoryIndex = 0;

function initMemoryGallery() {
  currentMemoryIndex = 0;

  const track = document.getElementById("galleryTrack");
  const dots = document.getElementById("galleryDots");

  if (!track) {
    console.error("Gallery track not found.");
    return;
  }

  track.innerHTML = "";

  if (dots) {
    dots.innerHTML = "";
  }

  validMemories.forEach((photo, index) => {
    // Create photo slide
    const slide = document.createElement("div");
    slide.className = "gallery-slide";

    const img = document.createElement("img");
    img.src = photo;
    img.alt = `Memory ${index + 1}`;

    slide.appendChild(img);
    track.appendChild(slide);

    // Create navigation dot
    if (dots) {
      const dot = document.createElement("button");

      dot.className = "gallery-dot";

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

      dot.addEventListener("click", () => {
        currentMemoryIndex = index;
        updateMemoryGallery();
      });

      dots.appendChild(dot);
    }
  });

  updateMemoryGallery();
  setupMemorySwipe();
}

function updateMemoryGallery() {
  const track = document.getElementById("galleryTrack");
  const dots = document.querySelectorAll(".gallery-dot");
  const caption = document.getElementById("galleryCaptionText");

  if (!track || validMemories.length === 0) return;

  // Move gallery horizontally
  track.style.transform =
    `translateX(-${currentMemoryIndex * 100}%)`;

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentMemoryIndex
    );
  });

  // Update caption
  if (caption) {
    const photo = validMemories[currentMemoryIndex];

    caption.textContent =
      CONFIG.photoCaptions[photo] ||
      "A memory worth keeping.";
  }
}

function nextGalleryPhoto() {
  if (validMemories.length === 0) return;

  currentMemoryIndex =
    (currentMemoryIndex + 1) % validMemories.length;

  updateMemoryGallery();
}

function prevGalleryPhoto() {
  if (validMemories.length === 0) return;

  currentMemoryIndex =
    (currentMemoryIndex - 1 + validMemories.length) %
    validMemories.length;

  updateMemoryGallery();
}

function setupMemorySwipe() {
  const viewport = document.getElementById("galleryViewport");

  if (!viewport) return;

  let startX = 0;
  let isDragging = false;

  // PHONE
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;

    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const difference = endX - startX;

    if (Math.abs(difference) < 40) return;

    if (difference < 0) {
      nextGalleryPhoto();
    } else {
      prevGalleryPhoto();
    }
  }, { passive: true });

  // PC MOUSE
  viewport.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  viewport.addEventListener("mouseup", (e) => {
    if (!isDragging) return;

    isDragging = false;

    const difference = e.clientX - startX;

    if (Math.abs(difference) < 50) return;

    if (difference < 0) {
      nextGalleryPhoto();
    } else {
      prevGalleryPhoto();
    }
  });
}

function setupMemorySwipe() {
  const viewport = document.getElementById("galleryViewport");

  if (!viewport) return;

  let startX = 0;
  let isDragging = false;

  // PHONE
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;

    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const difference = endX - startX;

    if (Math.abs(difference) < 40) return;

    if (difference < 0) {
      nextGalleryPhoto();
    } else {
      prevGalleryPhoto();
    }
  }, { passive: true });

  // PC MOUSE
  viewport.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  viewport.addEventListener("mouseup", (e) => {
    if (!isDragging) return;

    isDragging = false;

    const difference = e.clientX - startX;

    if (Math.abs(difference) < 50) return;

    if (difference < 0) {
      nextGalleryPhoto();
    } else {
      prevGalleryPhoto();
    }
  });
}

function updateMemoryGallery() {
  const slides = document.querySelectorAll(".memory-slide");

  slides.forEach((slide, index) => {
    slide.classList.toggle(
      "active",
      index === currentMemoryIndex
    );
  });

  const counter = document.getElementById("memoryCounter");

  if (counter) {
    counter.textContent =
      `${currentMemoryIndex + 1} / ${validMemories.length}`;
  }
}

function nextMemory() {
  if (validMemories.length === 0) return;

  currentMemoryIndex =
    (currentMemoryIndex + 1) % validMemories.length;

  updateMemoryGallery();
}

function previousMemory() {
  if (validMemories.length === 0) return;

  currentMemoryIndex =
    (currentMemoryIndex - 1 + validMemories.length) %
    validMemories.length;

  updateMemoryGallery();
}

function proceedToThought() {
  showScreen("screen-thought");
  window.scrollTo(0, 0);
}

function handleSendThought() {
  const input = document.getElementById("thoughtInput");
  const thoughtText = input ? input.value.trim() : "";

  if (!thoughtText) {
    if (input) input.focus();
    return;
  }

  sendThoughtToServer(thoughtText);
  startMusicFadeIn();
  triggerConfetti();

  showScreen("screen-world");
  initWorldCarousel();
  window.scrollTo(0, 0);
}

/* ==========================================================================
   MUSIC & AUDIO MANAGEMENT
   ========================================================================== */
let isAudioPlaying = false;
let audioFadeInterval = null;

function initAudioControls() {
  const ctrl = document.getElementById("audioControl");
  const music = document.getElementById("bgMusic");

  if (ctrl && music) {
    ctrl.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        ctrl.classList.remove("muted");
        isAudioPlaying = true;
      } else {
        music.pause();
        ctrl.classList.add("muted");
        isAudioPlaying = false;
      }
    });
  }
}

function startMusicFadeIn() {
  const music = document.getElementById("bgMusic");
  const ctrl = document.getElementById("audioControl");

  if (!music) return;

  if (ctrl) ctrl.classList.remove("hidden");

  music.currentTime = 0;
  music.volume = 0;
  music.play().then(() => {
    isAudioPlaying = true;
    let vol = 0;
    if (audioFadeInterval) clearInterval(audioFadeInterval);

    audioFadeInterval = setInterval(() => {
      vol += 0.04;
      if (vol >= 0.7) {
        vol = 0.7;
        clearInterval(audioFadeInterval);
      }
      music.volume = vol;
    }, 120);
  }).catch(err => {
    console.warn("Autoplay audio blocked or error:", err);
  });
}

function setupMusicVisibility() {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  let wasPlaying = false;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      wasPlaying = !music.paused;
      music.pause();
    } else if (wasPlaying) {
      music.play().catch(err => {
        console.warn("Could not resume music:", err);
      });
    }
  });
}
/* ==========================================================================
   SCREEN 5: 3D CIRCULAR ORBIT CAROUSEL LOGIC
   ========================================================================== */
let currentSlideIndex = 0;
const TOTAL_SLIDES = 4;
let isCarouselInitialized = false;

function initWorldCarousel() {
  if (isCarouselInitialized) {
    updateCarousel();
    updateWorldPhoto();
    return;
  }

  isCarouselInitialized = true;

  renderBouquetSlide();
  renderLettersSlide();

  updateCarousel();
  setupCarouselInteractions();

  // Start the memory album
  initWorldPhotoAlbum();
}

function updateCarousel() {
  const cards = document.querySelectorAll(".carousel-card");
  const dots = document.querySelectorAll(".dot");

  cards.forEach((card, idx) => {
    card.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

    const prevIndex = (currentSlideIndex - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
    const nextIndex = (currentSlideIndex + 1) % TOTAL_SLIDES;

    if (idx === currentSlideIndex) {
      card.classList.add("is-active");
    } else if (idx === prevIndex) {
      card.classList.add("is-prev");
    } else if (idx === nextIndex) {
      card.classList.add("is-next");
    } else {
      card.classList.add("is-hidden");
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % TOTAL_SLIDES;
  updateCarousel();
}

function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
  updateCarousel();
}

function goToSlide(index) {
  if (index >= 0 && index < TOTAL_SLIDES) {
    currentSlideIndex = index;
    updateCarousel();
  }
}

function setupCarouselInteractions() {
  const viewport = document.getElementById("carouselViewport");
  if (!viewport) return;

  let startX = 0;
  let isDragging = false;

  // Touch Swipe
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 40) {
      if (diffX < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Mouse Drag
  viewport.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  viewport.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;

    if (Math.abs(diffX) > 50) {
      if (diffX < 0) nextSlide();
      else prevSlide();
    }
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (activeScreenId === "screen-world") {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    }
  });
}

/* =========================================================
   WORLD MEMORY PHOTO SLIDER
   ========================================================= */

let currentWorldPhoto = 0;

function initWorldPhotoAlbum() {
  currentWorldPhoto = 0;

  const dots = document.getElementById("worldAlbumDots");

  if (dots) {
    dots.innerHTML = validMemories.map((photo, index) => `
      <button
        class="album-dot ${index === 0 ? "active" : ""}"
        onclick="goToWorldPhoto(${index})"
        aria-label="View memory ${index + 1}">
      </button>
    `).join("");
  }

  updateWorldPhoto();
}

function updateWorldPhoto() {
  if (validMemories.length === 0) return;

  const photo = validMemories[currentWorldPhoto];

  const image = document.getElementById("worldSlidePhoto");
  const caption = document.getElementById("worldSlideCaption");
  const dots = document.querySelectorAll(".album-dot");

  if (image) {
    image.style.opacity = "0";

    setTimeout(() => {
      image.src = photo;
      image.style.opacity = "1";
    }, 180);
  }

  if (caption) {
    caption.style.opacity = "0";

    setTimeout(() => {
      caption.textContent =
        CONFIG.photoCaptions[photo] ||
        "Every captured moment tells our story.";

      caption.style.opacity = "1";
    }, 180);
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentWorldPhoto
    );
  });
}

function worldNextPhoto() {
  if (validMemories.length <= 1) return;

  currentWorldPhoto =
    (currentWorldPhoto + 1) % validMemories.length;

  updateWorldPhoto();
}

function worldPrevPhoto() {
  if (validMemories.length <= 1) return;

  currentWorldPhoto =
    (currentWorldPhoto - 1 + validMemories.length) %
    validMemories.length;

  updateWorldPhoto();
}

function goToWorldPhoto(index) {
  if (
    index < 0 ||
    index >= validMemories.length
  ) {
    return;
  }

  currentWorldPhoto = index;

  updateWorldPhoto();
}

/* ==========================================================================
   SLIDE 2 & SLIDE 3 CONTENT RENDERERS & MODAL LOGIC
   ========================================================================== */
function renderBouquetSlide() {
  const cluster = document.getElementById("rosesCluster");
  const tagsContainer = document.getElementById("bouquetTagsContainer");

  if (cluster) {
    cluster.innerHTML = CONFIG.bouquetNotes.map(n => 
      `<span class="rose-icon" onclick="openBouquetModal(${n.id})">${n.icon}</span>`
    ).join("");
  }

  if (tagsContainer) {
    tagsContainer.innerHTML = CONFIG.bouquetNotes.map(n => `
      <div class="flower-tag" onclick="openBouquetModal(${n.id})">
        <span class="tag-icon">${n.icon}</span>
        <span>${n.title}</span>
      </div>
    `).join("");
  }
}

function openBouquetModal(noteId) {
  const note = CONFIG.bouquetNotes.find(n => n.id === noteId);
  if (!note) return;

  const modalBadge = document.getElementById("modalBadge");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalSig = document.getElementById("modalSignature");

  if (modalBadge) modalBadge.textContent = "A Little Blossom 🌸";
  if (modalTitle) modalTitle.textContent = note.title;
  if (modalBody) modalBody.textContent = note.text;
  if (modalSig) modalSig.textContent = note.signature || "— With love";

  openModal();
}

function renderLettersSlide() {
  const container = document.getElementById("lettersGridContainer");
  if (!container) return;

  container.innerHTML = CONFIG.friendLetters.map(l => `
    <div class="letter-item ${l.isSpecial ? 'special-letter' : ''}" onclick="openLetterModal(${l.id})">
      <div class="letter-icon">${l.icon}</div>
      <div class="letter-name">${l.name}</div>
      <div class="letter-hint">${l.hint}</div>
    </div>
  `).join("");
}

function openLetterModal(letterId) {
  const letter = CONFIG.friendLetters.find(l => l.id === letterId);
  if (!letter) return;

  const modalBadge = document.getElementById("modalBadge");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalSig = document.getElementById("modalSignature");

  if (modalBadge) modalBadge.textContent = letter.isSpecial ? "Special Letter 💖" : "Friend Message 💌";
  if (modalTitle) modalTitle.textContent = letter.title;
  if (modalBody) modalBody.textContent = letter.text;
  if (modalSig) modalSig.textContent = `— From ${letter.author}`;

  openModal();
}

function openModal() {
  const modal = document.getElementById("messageModal");
  if (modal) modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("messageModal");
  if (modal) modal.classList.add("hidden");
}

/* ==========================================================================
   SLIDE 4: WISH SUBMISSION
   ========================================================================== */
function handleSendWish() {
  const input = document.getElementById("wishInput");
  const wishText = input ? input.value.trim() : "";

  if (!wishText) {
    if (input) input.focus();
    return;
  }

  sendWishToServer(wishText);

  const formWrap = document.getElementById("wishFormWrap");
  const confirmBox = document.getElementById("wishConfirmation");

  if (formWrap) formWrap.style.display = "none";
  if (confirmBox) confirmBox.classList.remove("hidden");

  triggerConfetti();
}

/* ==========================================================================
   AMBIENT BACKGROUND PARTICLES & CONFETTI
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.2 + 0.6,
    speedY: -(Math.random() * 0.4 + 0.15),
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.6 + 0.2,
    symbol: Math.random() > 0.85 ? "♡" : (Math.random() > 0.7 ? "✦" : "·")
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.fillStyle = `rgba(247, 202, 208, ${p.opacity})`;
      if (p.symbol === "·") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = `${Math.floor(p.size * 6 + 8)}px sans-serif`;
        ctx.fillText(p.symbol, p.x, p.y);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

function triggerConfetti() {
  const symbols = ["✦", "♡", "🌸", "✨", "💫", "🌹"];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement("span");
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.position = "fixed";
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.zIndex = "999";
    p.style.pointerEvents = "none";
    p.style.fontSize = `${14 + Math.random() * 20}px`;
    p.style.color = Math.random() > 0.5 ? "#ffb3c6" : "#c77dff";

    const x = (Math.random() - 0.5) * window.innerWidth * 0.8;
    const y = (Math.random() - 0.65) * window.innerHeight * 0.7;

    const anim = p.animate([
      { transform: "translate(-50%, -50%) scale(0.5) rotate(0deg)", opacity: 1 },
      { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.2) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
    ], {
      duration: 1400 + Math.random() * 1000,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    });

    document.body.appendChild(p);
    anim.finished.then(() => p.remove());
  }
}

/* ==========================================================================
   APPLICATION INITIALIZATION
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  initAmbientCanvas();
  initAudioControls();
  setupMusicVisibility();
  initLoadingScreen();
});
