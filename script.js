
/* ========================================
   PENGATURAN WEBSITE
======================================== */

// Ubah passcode di sini.
// Contoh: "1234", "2007", atau "8888".
const PASSCODE = "2118";

// Atur notifikasi sesuai jam yang kamu inginkan.
// Gunakan format 24 jam: "HH:MM".
const SCHEDULED_NOTIFICATIONS = [
  {
    time: "09:00",
    title: "Good morning ☀️",
    message: "Semoga harimu dimulai dengan hal baik."
  },
  {
    time: "12:00",
    title: "A little reminder ♡",
    message: "Jangan lupa istirahat dan minum air."
  },
  {
    time: "15:30",
    title: "Thinking of you 💌",
    message: "Semoga ada hal kecil yang membuatmu tersenyum."
  },
  {
    time: "18:30",
    title: "A message for you ♡",
    message: "Take a breath. You are doing just fine."
  },
  {
    time: "21:00",
    title: "Before you sleep 🌙",
    message: "You did enough today. Rest well."
  }
];

// Notifikasi awal ketika website dibuka.
const WELCOME_NOTIFICATION = {
  title: "Halloween Party At Monopoli",
  message: "October 31 · in 9 days"
};


/* ========================================
   MENGAMBIL ELEMEN HTML
======================================== */

const $ = (selector) => document.querySelector(selector);

const lockScreen = $("#lockScreen");
const passcodeScreen = $("#passcodeScreen");
const homeScreen = $("#homeScreen");
const appScreen = $("#appScreen");

const lockClock = $("#lockClock");
const lockDate = $("#lockDate");
const statusTime = $("#statusTime");
const widgetClock = $("#widgetClock");
const homeDate = $("#homeDate");

const passcodeDots = $("#passcodeDots");
const passcodeMessage = $("#passcodeMessage");
const keypad = $("#keypad");

const lockNotifications = $("#lockNotifications");

const toast = $("#toast");
const toastTitle = $("#toastTitle");
const toastMessage = $("#toastMessage");

const appTitle = $("#appTitle");
const appContent = $("#appContent");


/* ========================================
   STATUS DAN JAM
======================================== */

let enteredPasscode = "";
let activeApp = "";
let toastTimeout = null;

const notifiedToday = new Set();

function pad(number) {
  return String(number).padStart(2, "0");
}

function getTimeString(date = new Date()) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function updateClock() {
  const now = new Date();

  const time = getTimeString(now);

  const dateLong = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);

  const dateUpper = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now).toUpperCase();

  lockClock.textContent = time;
  statusTime.textContent = time;
  widgetClock.textContent = time;

  lockDate.textContent = dateLong;
  homeDate.textContent = dateUpper;

  $("#calendarMonth").textContent =
    new Intl.DateTimeFormat("en-US", {
      month: "short"
    }).format(now).toUpperCase();

  $("#calendarDay").textContent = now.getDate();
}

// Perbarui waktu setiap detik.
updateClock();
setInterval(updateClock, 1000);


/* ========================================
   PERPINDAHAN LAYAR
======================================== */

function showScreen(screenToShow) {
  [lockScreen, passcodeScreen, homeScreen, appScreen]
    .forEach(screen => screen.classList.add("hidden"));

  screenToShow.classList.remove("hidden");
}

function openPasscode() {
  enteredPasscode = "";
  updatePasscodeDots();
  passcodeMessage.textContent = "";
  showScreen(passcodeScreen);
}

function returnToLock() {
  enteredPasscode = "";
  updatePasscodeDots();
  passcodeMessage.textContent = "";
  showScreen(lockScreen);
}

function unlockPhone() {
  showScreen(homeScreen);
  enteredPasscode = "";
  updatePasscodeDots();

  // Sambutan hanya muncul saat berhasil membuka HP.
  showToast(
    "Navy ♡",
    "yuk temenin aku 31 oct."
  );
}

$("#unlockButton").addEventListener("click", openPasscode);
$("#backToLock").addEventListener("click", returnToLock);


/* ========================================
   PASSCODE
======================================== */

function updatePasscodeDots() {
  const dots = passcodeDots.querySelectorAll("span");

  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPasscode.length);
  });
}

function enterDigit(digit) {
  if (enteredPasscode.length >= 4) return;

  enteredPasscode += digit;
  passcodeMessage.textContent = "";

  updatePasscodeDots();

  if (enteredPasscode.length === 4) {
    // Sedikit jeda agar empat titik terlihat terlebih dahulu.
    setTimeout(checkPasscode, 180);
  }
}

function deleteDigit() {
  enteredPasscode = enteredPasscode.slice(0, -1);
  passcodeMessage.textContent = "";
  updatePasscodeDots();
}

function checkPasscode() {
  if (enteredPasscode === PASSCODE) {
    unlockPhone();
    return;
  }

  passcodeMessage.textContent = "Incorrect passcode. Try again.";

  passcodeDots.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-7px)" },
      { transform: "translateX(7px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(0)" }
    ],
    {
      duration: 260,
      easing: "ease-out"
    }
  );

  setTimeout(() => {
    enteredPasscode = "";
    updatePasscodeDots();
  }, 350);
}

keypad.addEventListener("click", event => {
  const button = event.target.closest("[data-digit]");
  if (!button) return;

  enterDigit(button.dataset.digit);
});

$("#deleteDigit").addEventListener("click", deleteDigit);

// Mendukung keyboard komputer juga.
document.addEventListener("keydown", event => {
  if (passcodeScreen.classList.contains("hidden")) return;

  if (/^\d$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === "Backspace") {
    deleteDigit();
  } else if (event.key === "Escape") {
    returnToLock();
  }
});


/* ========================================
   NOTIFIKASI TOAST
======================================== */

function showToast(title, message) {
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toast.classList.remove("hidden");

  // Restart animasi agar terlihat setiap kali muncul.
  toast.style.animation = "none";
  void toast.offsetWidth;
  toast.style.animation = "";

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 5000);
}


/* ========================================
   NOTIFIKASI DI LOCK SCREEN
======================================== */

function addLockNotification(title, message) {
  const article = document.createElement("article");
  article.className = "notification";

  const icon = document.createElement("div");
  icon.className = "notification-icon messages-icon";
  icon.textContent = "♡";

  const copy = document.createElement("div");
  copy.className = "notification-copy";

  const heading = document.createElement("div");
  heading.className = "notification-heading";

  const strong = document.createElement("strong");
  strong.textContent = title;

  const time = document.createElement("span");
  time.textContent = "NOW";

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  heading.append(strong, time);
  copy.append(heading, paragraph);
  article.append(icon, copy);

  lockNotifications.prepend(article);

  // Batasi jumlah notifikasi yang ditampilkan.
  while (lockNotifications.children.length > 4) {
    lockNotifications.lastElementChild.remove();
  }
}

function triggerNotification(notification) {
  addLockNotification(
    notification.title,
    notification.message
  );

  showToast(
    notification.title,
    notification.message
  );
}


/* ========================================
   JADWAL NOTIFIKASI OTOMATIS
======================================== */

// Jadwal dicek setiap detik.
// Notifikasi dipicu ketika waktu lokal cocok dengan jadwal.
function checkScheduledNotifications() {
  const now = new Date();
  const currentTime = getTimeString(now);

  const todayKey = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join("-");

  SCHEDULED_NOTIFICATIONS.forEach((notification, index) => {
    const uniqueKey = `${todayKey}-${index}`;

    if (
      notification.time === currentTime &&
      !notifiedToday.has(uniqueKey)
    ) {
      notifiedToday.add(uniqueKey);
      triggerNotification(notification);
    }
  });

  // Hapus catatan hari sebelumnya saat tanggal berganti.
  for (const key of notifiedToday) {
    if (!key.startsWith(todayKey)) {
      notifiedToday.delete(key);
    }
  }
}

setInterval(checkScheduledNotifications, 1000);

// Sambutan ketika halaman pertama kali dimuat.
addLockNotification(
  WELCOME_NOTIFICATION.title,
  WELCOME_NOTIFICATION.message
);


/* ========================================
   MEMBUKA APLIKASI
======================================== */

const appNames = {
  messages: "Messages",
  photos: "Photos",
  music: "Music",
  notes: "Notes",
  calendar: "Calendar",
  weather: "Weather",
  clock: "Clock",
  settings: "Settings",
  phone: "Phone"
};

function openApp(appName) {
  activeApp = appName;
  appTitle.textContent = appNames[appName] || "App";

  renderApp(appName);
  showScreen(appScreen);
}

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    openApp(button.dataset.app);
  });
});

$("#closeApp").addEventListener("click", () => {
  showScreen(homeScreen);
  activeApp = "";
});


/* ========================================
   ISI APLIKASI SIMULASI
======================================== */

function createCard(title, message) {
  const card = document.createElement("div");
  card.className = "app-card";

  const heading = document.createElement("h4");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  paragraph.style.whiteSpace = "pre-line";

  card.append(heading, paragraph);
  return card;
}

function renderApp(appName) {
  appContent.replaceChildren();

  switch (appName) {
    case "messages": {
      appContent.append(
        createCard(
          "Navy ♡",
          "yuk temenin aku 31 oct."
        ),
        createCard(
          "Halloween Party At Monopoli",
          "Club In Fix In Jadi - 31 October 2026"
        ),
        createCard(
          "Traveloka ✈️",
          `Halo Shakira!

            Reservasi hotel Anda telah sukses dikonfirmasi.

            DETAIL PESANAN
            ━━━━━━━━━━━━━━━━━━
            Nama Tamu     : Shakira & Fira
            Hotel         : Hotel Monopoli
            Check-in      : 31 Oktober 2026 / 14:00
            Check-out     : 1 November 2026 / 12:00
            Jumlah Tamu   : 2 orang
            Status        : Terkonfirmasi

            Terima kasih telah memesan melalui Traveloka.`
        )
      );
      break;
    }

    
case "photos": {
  const card = createCard(
    "Little memories ✿",
    "Every little moment deserves to be remembered."
  );

  const decoration = document.createElement("div");
  decoration.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 20px auto 10px;
    width: 88%;
  `;

  const photos = [
    { src: "memory1.jpeg", caption: "a little piece of happiness, one of my favorite moments ♡" },
    { src: "memory2.jpeg", caption: "will you make a little memory with me?" }
  ];

  // Overlay foto seperti layar passcode
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(5, 12, 30, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const viewer = document.createElement("div");
  viewer.style.cssText = `
    position: relative;
    width: min(100%, 330px);
    padding: 10px 10px 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    transform: translateY(25px) scale(0.96);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  `;

  const bigImg = document.createElement("img");
  bigImg.style.cssText = `
    display: block;
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
    background: #e8edf6;
    border-radius: 3px;
  `;

  const bigCaption = document.createElement("div");
  bigCaption.style.cssText = `
    text-align: center;
    padding-top: 16px;
    color: #243858;
    font-family: Georgia, serif;
    font-size: 13px;
  `;

  const close = document.createElement("button");
  close.textContent = "×";
  close.setAttribute("aria-label", "Tutup foto");
  close.style.cssText = `
    position: absolute;
    top: -42px;
    right: 0;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(255,255,255,0.45);
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    color: white;
    font-size: 26px;
    cursor: pointer;
  `;

  function closePhoto() {
    overlay.style.opacity = "0";
    viewer.style.transform = "translateY(25px) scale(0.96)";

    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
  }

  close.addEventListener("click", closePhoto);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePhoto();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.style.display === "flex") {
      closePhoto();
    }
  });

  viewer.append(close, bigImg, bigCaption);
  overlay.append(viewer);
  document.body.append(overlay);

  photos.forEach(({ src, caption }, index) => {
    const polaroid = document.createElement("div");
    polaroid.style.cssText = `
      padding: 8px 8px 14px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 6px 18px rgba(9,25,55,0.18);
      transform: rotate(${index === 0 ? "-2deg" : "2deg"});
      cursor: pointer;
      transition: transform 0.3s ease;
    `;

    const img = document.createElement("img");
    img.src = src;
    img.alt = caption;
    img.loading = "lazy";
    img.style.cssText = `
      display: block;
      width: 100%;
      height: 175px;
      object-fit: cover;
      border-radius: 2px;
      background: #e8edf6;
    `;

    const label = document.createElement("div");
    label.textContent = caption;
    label.style.cssText = `
      text-align: center;
      padding-top: 12px;
      color: #243858;
      font-family: Georgia, serif;
      font-size: 12px;
    `;

    polaroid.addEventListener("click", () => {
      bigImg.src = src;
      bigImg.alt = caption;
      bigCaption.textContent = caption;

      overlay.style.display = "flex";
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        viewer.style.transform = "translateY(0) scale(1)";
      });
    });

    polaroid.addEventListener("mouseenter", () => {
      polaroid.style.transform = "rotate(0deg) translateY(-3px)";
    });

    polaroid.addEventListener("mouseleave", () => {
      polaroid.style.transform =
        `rotate(${index === 0 ? "-2deg" : "2deg"})`;
    });

    polaroid.append(img, label);
    decoration.append(polaroid);
  });

  card.append(decoration);
  appContent.append(card);
  break;
}


    case "music": {
      appContent.append(
        createCard(
          "♫ Now playing",
          "Oui - Jeremih"
        )
      );

      const songs = [
        "Best Part - Daniel Caesar, H.E.R.",
        "Mine - Taylor Swift",
        "Closer - The Chainsmokers, Hasley",
        "Slow Motion - Trey Songz",
        "Code Blue - TheDream",
        "Botfriend - Big Time Rush",
        "Your Guardian Angel - The Red Jumpsuit Apparatus",
        "When You Look Me In The Eyes - Jonas Brothers",
        "Dress - Taylor Swift",
        "What U Need - Justin Vasquez",
        "Something New - Zendaya, Crish Brown",
        "Hope You Do - Crish Brown",
        "Drugs & Money (New) - Chase Atlantic",
        "Water - Trina",
        "Willow - Taylor Swift",
        "Perfect - One Direction",
        "LetMe - Zayn"
        
      ];

      songs.forEach(song => {
        appContent.append(createCard(song, "♡  Your playlist - https://bit.ly/4Bk2tLp"));
      });
      break;
    }

    case "notes": {
      const card = createCard(
        "Dear diary ♡",
        "Write something you want to remember."
      );

      const textarea = document.createElement("textarea");
      textarea.className = "note-input";
      textarea.placeholder = "Today, I feel...";
      textarea.setAttribute("aria-label", "Write your note");

      const saveButton = document.createElement("button");
      saveButton.className = "mini-button";
      saveButton.textContent = "Save note";

      const saved = document.createElement("p");
      saved.style.marginTop = "12px";

      saveButton.addEventListener("click", () => {
        saved.textContent = textarea.value.trim()
          ? "Your note is saved for this session ♡"
          : "Write something first.";

        showToast(
          "Notes",
          textarea.value.trim()
            ? "Your note is ready."
            : "Write something first."
        );
      });

      card.append(textarea, saveButton, saved);
      appContent.append(card);
      break;
    }

    case "calendar": {
      const now = new Date();

      appContent.append(
        createCard(
          new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          }).format(now),
          "A new day, a new chance to make a little memory."
        ),
        createCard(
          "♡ Reminder",
          "Be gentle with yourself today."
        )
      );
      break;
    }

    case "weather": {
      appContent.append(
        createCard(
          "☀️ A little sunshine",
          "This is a decorative weather screen. Connect a weather service if you want real-time forecasts."
        )
      );
      break;
    }

    case "clock": {
      const card = createCard(
        "Local time",
        getTimeString()
      );

      appContent.append(card);

      const clockInterval = setInterval(() => {
        if (activeApp !== "clock") {
          clearInterval(clockInterval);
          return;
        }

        card.querySelector("p").textContent = getTimeString();
      }, 1000);
      break;
    }

    case "settings": {
      appContent.append(
        createCard(
          "Passcode",
          "To change your passcode, edit PASSCODE at the top of script.js."
        ),
        createCard(
          "Notifications",
          "Edit SCHEDULED_NOTIFICATIONS in script.js to change the times and messages."
        ),
        createCard(
          "Wallpaper",
          "Customize the wallpaper gradients in style.css."
        )
      );
      break;
    }

    case "phone": {
      appContent.append(
        createCard(
          "☎ Phone",
          "Navy ♡ - (+62 858-3320-8733)."
        )
      );
      break;
    }

    default: {
      appContent.append(
        createCard(
          "Coming soon ♡",
          "This little app is still being prepared."
        )
      );
    }
  }
}


/* ========================================
   TOMBOL TAMBAHAN
======================================== */

$("#flashButton").addEventListener("click", () => {
  showToast(
    "Flashlight ϟ",
    "This is a visual demo of the flashlight button."
  );
});

$("#cameraButton").addEventListener("click", () => {
  showToast(
    "Camera ◎",
    "This is a visual demo of the camera button."
  );
});

$("#emergencyButton").addEventListener("click", () => {
  passcodeMessage.textContent =
    "Emergency calling is not available in this demo.";
});

$("#profileButton").addEventListener("click", () => {
  showToast(
    "Your little space ♡",
    "A little reminder: you are doing better than you think."
  );
});

// Tombol Home di bagian bawah:
// saat aplikasi terbuka, kembali ke dashboard;
// dari dashboard, kembali ke lock screen.
$("#homeIndicator").addEventListener("click", () => {
  if (!appScreen.classList.contains("hidden")) {
    showScreen(homeScreen);
  } else if (!homeScreen.classList.contains("hidden")) {
    returnToLock();
  } else if (!passcodeScreen.classList.contains("hidden")) {
    returnToLock();
  }
});
