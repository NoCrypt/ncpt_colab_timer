let startTime;
let timeout;
let myHeaders = new Headers();
myHeaders.append("Bypass-Tunnel-Reminder", "Thanks for checking my code lol");
myHeaders.append(
  "ngrok-skip-browser-warning",
  "Seriously tho, thank you so much!"
);

function updateTimer(el) {
  const a = (i) => (i < 10 ? "0" + i : i);
  const b = (x) => Math.floor(x);
  let c = b(Date.now() / 1000) - startTime;
  h = a(b(c / 3600));
  m = a(b((c / 60) % 60));
  s = a(b(c % 60));
  // console.log(h,m,s)

  // show different text betwen 4:58 and 5:15
  if (c > 298 && c < 315) {
    el.innerText =
      "Usually there's captcha at this time, please check your colab (" +
      h +
      ":" +
      m +
      ":" +
      s +
      ")";
  } else {
    el.innerText = h + ":" + m + ":" + s;
  }

  //refresh timer every 30 seconds
  if (c % 30 == 0) {
    refreshTimer(el, true);
    return;
  }

  timeout = setTimeout(() => updateTimer(el), 1000);
}

refreshTimer = (timerEl, notext = false) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (!notext) timerEl.innerText = "Connecting...";
  fetch("file=static/colabTimer.txt", { cache: "no-store", headers: myHeaders })
    .then((response) => {
      if (response.status == 404) {
        timerEl.innerText = "Error. Colab disconnected!";
        return;
      }
      response.text().then((text) => {
        startTime = parseInt(text);
        if (isNaN(startTime))
          timerEl.innerText = "Error. NaN stuff... Maybe network error";
        else updateTimer(timerEl);
      });
    })
    .catch((err) => {
      console.log(err);
      timerEl.innerText = "Error. " + err;
    });
};

toggleNotification = (imgEl, audioEl, divEl) => {
  audioEl.muted = !audioEl.muted;
  audioEl.currentTime = 0;
  audioEl.play();
  divEl.title = !audioEl.muted
    ? "Currently not-muted. Click to mute"
    : "Currently muted. Click to unmute";
  divEl.style.borderColor = !audioEl.muted ? "#00ff00" : "#ff0000";
  imgEl.src = audioEl.muted
    ? "https://api.iconify.design/ion:md-notifications-off.svg?color=%23ff0000"
    : "https://api.iconify.design/ion:md-notifications.svg?color=%2300ff00";
};

onUiLoaded(function () {
  const quickSettings = gradioApp().querySelector("#quicksettings");
  const audioEl = gradioApp().querySelector("#audio_notification > audio");

  if (gradioApp().querySelector("#nocrypt-timer") != null) return;

  let mainDiv = document.createElement("div");
  mainDiv.id = "nocrypt-timer";
  mainDiv.className = "justify-start";
  mainDiv.style =
    "gap: 10px; user-select: none; margin-block: -10px; transform-origin: left center; scale: 0.8; display:flex;";

  let div2 = document.createElement("div");
  div2.className = "gr-box";
  div2.style =
    "gap: 0.5rem; border-radius:10px; display:flex;align-items:center;border-width:1px; display:flex; cursor: pointer; padding-block: 3px; width: fit-content; padding-inline: 5px; border-color: orange; z-index: 999; background-color: transparent !important;";
  div2.title = "Colab Timer Integration by NoCrypt. Click to refresh.";

  let img = document.createElement("img");
  img.src =
    "https://ssl.gstatic.com/colaboratory-static/common/de56aa663d279b80074b6c21f69dc872/img/favicon.ico";
  img.width = 24;

  let timerEl = document.createElement("div");
  timerEl.style = "font-family: monospace;color: orange;";
  timerEl.innerText = "Connecting...";
  div2.appendChild(img);
  div2.appendChild(timerEl);
  mainDiv.appendChild(div2);
  div2.onclick = () => refreshTimer(timerEl);

  let audioMuteDiv = document.createElement("div");
  audioMuteDiv.className = "gr-box";
  audioMuteDiv.style =
    "gap: 0.5rem; border-radius:10px; display:flex;align-items:center;border-width:1px; display:flex; cursor: pointer; padding-block: 3px; width: fit-content;  padding-inline: 5px; border-color: lime; z-index: 999; background-color: transparent !important;";
  audioMuteDiv.title = "Currently not-muted. Click to mute";

  let img2 = document.createElement("img");
  img2.src =
    "https://api.iconify.design/ion:md-notifications.svg?color=%2300ff00";
  img2.width = 20;
  audioMuteDiv.appendChild(img2);
  audioMuteDiv.onclick = () => toggleNotification(img2, audioEl, audioMuteDiv);
  mainDiv.appendChild(audioMuteDiv);

  let toggleDarkModeDiv = document.createElement("div");
  toggleDarkModeDiv.className = "gr-box";
  toggleDarkModeDiv.style =
    "color: var(--block-title-text-color, inherit); gap: 0.5rem; border-radius:10px; display:flex;align-items:center;border-width:1px; display:flex; cursor: pointer; padding-block: 3px; width: fit-content;  padding-inline: 5px; border-color: var(--block-title-text-color, inherit); z-index: 999; background-color: transparent !important;";
  toggleDarkModeDiv.title = "Toggle Dark Mode";

  toggleDarkModeDiv.innerHTML = `  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 512 512"
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="32"
      d="M256 48v48m0 320v48m147.08-355.08l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48m-320 0H48m355.08 147.08l-33.94-33.94M142.86 142.86l-33.94-33.94"
    />
    <circle
      cx="256"
      cy="256"
      r="80"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="32"
    />
  </svg>`;
  toggleDarkModeDiv.onclick = () =>
    document.querySelector("body").classList.toggle("dark");
  mainDiv.appendChild(toggleDarkModeDiv);

  let nsfwBlur = false;
  let toggleNSFWBlurDiv = document.createElement("div");
  toggleNSFWBlurDiv.className = "gr-box";
  toggleNSFWBlurDiv.style =
    "color: var(--block-title-text-color, inherit); gap: 0.5rem; border-radius:10px; display:flex;align-items:center;border-width:1px; display:flex; cursor: pointer; padding-block: 3px; width: fit-content;  padding-inline: 5px; border-color: var(--block-title-text-color, inherit); z-index: 999; background-color: transparent !important;";
  toggleNSFWBlurDiv.title = "Toggle NSFW Blur";
  toggleNSFWBlurDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><circle cx="256" cy="256" r="64" fill="currentColor"/><path fill="currentColor" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76ZM256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96Z"/></svg>`;
  toggleNSFWBlurDiv.onclick = () => {
    const t2iGallery = gradioApp().querySelector("#txt2img_gallery_container");
    const i2iGallery = gradioApp().querySelector("#img2img_gallery_container");
    nsfwBlur = !nsfwBlur;
    toggleNSFWBlurDiv.innerHTML = nsfwBlur
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="currentColor" d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448ZM248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69a64.11 64.11 0 0 0 53.49 53.49a2 2 0 0 0 1.69-3.39Zm16-119.7L315.87 248a2 2 0 0 0 3.4-1.69a64.13 64.13 0 0 0-53.55-53.55a2 2 0 0 0-1.72 3.39Z"/><path fill="currentColor" d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.54 226.54 0 0 0-71.82 11.79a4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05a96 96 0 0 1 116 116a4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24a343.81 343.81 0 0 0 67.24-77.4ZM256 352a96 96 0 0 1-93.3-118.63a4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.22 238.22 0 0 0 72.64-11.55a4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352Z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><circle cx="256" cy="256" r="64" fill="currentColor"/><path fill="currentColor" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76ZM256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96Z"/></svg>`;

    // if nsfwBlur is true, blur the entire gallery
    if (nsfwBlur) {
      t2iGallery.classList.add("ncpt_blur");
      i2iGallery.classList.add("ncpt_blur");
    } else {
      t2iGallery.classList.remove("ncpt_blur");
      i2iGallery.classList.remove("ncpt_blur");
    }
  };

  // inject blur css
  if (!document.getElementById("nsfw-blur-css")) {
    const style = document.createElement("style");
    style.id = "nsfw-blur-css";

    // unblur on hover
    style.innerHTML = `
        .ncpt_blur {
          filter: blur(10px) grayscale(1) brightness(0.3);
          transition: filter 0.2s ease;
        }
        .ncpt_blur:hover {
          filter: blur(0px) grayscale(0) brightness(1);
        }
      `;

    document.head.appendChild(style);
  }
  mainDiv.appendChild(toggleNSFWBlurDiv);

  quickSettings.parentNode.insertBefore(mainDiv, quickSettings.nextSibling);
  refreshTimer(timerEl);
});
