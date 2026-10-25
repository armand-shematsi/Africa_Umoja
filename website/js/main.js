// Add the real contact details here. Leave a field blank to hide it.
const SITE = {
  phone: "",
  phonePretty: "",
  whatsapp: "",
  email: "",
  location: "",
};

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const header = document.querySelector(".site-header");
const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-stuck", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

function fillContactSlots() {
  const phoneText = SITE.phonePretty || SITE.phone;
  document.querySelectorAll("[data-contact='phone']").forEach((node) => {
    if (!SITE.phone) return;
    node.hidden = false;
    node.innerHTML = `<a href="tel:${SITE.phone.replace(/\s/g, "")}">${phoneText}</a>`;
  });

  document.querySelectorAll("[data-contact='email']").forEach((node) => {
    if (!SITE.email) return;
    node.hidden = false;
    node.innerHTML = `<a href="mailto:${SITE.email}">${SITE.email}</a>`;
  });

  document.querySelectorAll("[data-contact='location']").forEach((node) => {
    if (!SITE.location) return;
    node.hidden = false;
    node.textContent = SITE.location;
  });
}

fillContactSlots();

const note = document.querySelector("#form-note");
if (note) {
  if (SITE.whatsapp) {
    note.hidden = false;
    note.textContent = "Sending opens WhatsApp with your request ready to go to the crew.";
  } else if (SITE.email) {
    note.hidden = false;
    note.textContent = "Sending opens your email app with the request ready to send.";
  } else {
    note.hidden = true;
  }
}

const form = document.querySelector("#visit-form");
const success = document.querySelector("#form-success");
const error = document.querySelector("#form-error");

function messageFrom(data) {
  const extra = data.message ? ` ${data.message}` : "";
  return `Hello Africa Umoja. My name is ${data.name}. I need help with ${data.service} at ${data.place}. My phone is ${data.phone}.${extra}`;
}

if (form && success) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (error) error.hidden = true;

    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.phone || !data.place || !data.service) {
      if (error) {
        error.hidden = false;
        error.textContent = "Please add your name, phone, location, and the kind of job.";
      }
      form.reportValidity();
      return;
    }

    const text = messageFrom(data);
    const title = document.querySelector("#success-title");
    const copy = document.querySelector("#success-copy");
    if (title) title.textContent = `Thank you, ${data.name}.`;

    if (SITE.whatsapp) {
      window.open(
        `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
      if (copy) {
        copy.textContent = "WhatsApp should have opened with your request. Send that message and keep your phone nearby.";
      }
    } else if (SITE.email) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Site visit: " + data.service)}&body=${encodeURIComponent(text)}`;
      if (copy) {
        copy.textContent = "Your email app should have opened with the message ready. Send it, and the crew will use the number you gave.";
      }
    } else if (copy) {
      copy.textContent = `For ${data.service} in ${data.place}, call the crew directly for now. Once a WhatsApp number is added, this form will deliver the request.`;
    }

    form.hidden = true;
    success.hidden = false;
    success.style.scrollMarginTop = "11rem";
    success.scrollIntoView({ block: "start" });
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    const caption = shot.dataset.caption || shot.querySelector("span")?.textContent || "";
    lightboxImg.src = shot.dataset.src || "";
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    }
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox?.addEventListener("close", () => {
  if (lightboxImg) lightboxImg.removeAttribute("src");
});
