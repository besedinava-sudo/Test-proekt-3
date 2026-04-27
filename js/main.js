(function () {
  "use strict";

  var header = document.querySelector(".header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  function closeNav() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        openNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (burger && nav && window.matchMedia("(max-width: 900px)").matches) {
        closeNav();
      }
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ——— Заявка: Web3Forms + модальное окно */
  var WEB3_ACCESS_KEY = "bf97d426-1910-4b2f-8b64-d854e9dcf438";
  var WEB3_ENDPOINT = "https://api.web3forms.com/submit";
  var HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
  var leadModal = document.getElementById("lead-modal");
  var leadForm = document.getElementById("lead-form");
  var leadPanelInner = document.getElementById("lead-panel-inner");
  var leadSuccess = document.getElementById("lead-success");
  var leadGlobal = document.getElementById("lead-form-global");
  var leadName = document.getElementById("lead-name");
  var leadContact = document.getElementById("lead-contact");
  var leadType = document.getElementById("lead-type");
  var leadComment = document.getElementById("lead-comment");
  var leadSubmit = document.getElementById("lead-submit");
  var leadBtnText = leadSubmit && leadSubmit.querySelector(".lead-form__btn-text");
  var leadBtnSend = leadSubmit && leadSubmit.querySelector(".lead-form__btn-sending");
  var leadNameErr = document.getElementById("lead-name-err");
  var leadContactErr = document.getElementById("lead-contact-err");
  var leadOpeners = document.querySelectorAll("[data-lead-open]");
  var leadClosers = document.querySelectorAll("[data-lead-close]");

  var lastLeadFocus = null;
  var bodyScrollPrev = "";
  var hCaptchaWidgetId = null;
  var leadCaptchaContainer = document.getElementById("lead-captcha-container");

  function setInertOnModal(value) {
    if (!leadModal) return;
    if ("inert" in leadModal) {
      leadModal.inert = value;
    }
  }

  function showFieldError(nameEl, errEl, show) {
    if (!nameEl) return;
    if (errEl) {
      errEl.hidden = !show;
    }
    nameEl.setAttribute("aria-invalid", show ? "true" : "false");
  }

  function clearFieldErrors() {
    showFieldError(leadName, leadNameErr, false);
    showFieldError(leadContact, leadContactErr, false);
  }

  function setGlobalError(text) {
    if (!leadGlobal) return;
    if (text) {
      leadGlobal.textContent = text;
      leadGlobal.removeAttribute("hidden");
    } else {
      leadGlobal.textContent = "";
      leadGlobal.setAttribute("hidden", "");
    }
  }

  function setSubmitting(is) {
    if (!leadSubmit || !leadBtnText || !leadBtnSend) return;
    leadSubmit.disabled = is;
    leadBtnText.hidden = is;
    leadBtnSend.hidden = !is;
  }

  function resetLeadHCaptcha() {
    if (hCaptchaWidgetId === null || !window.hcaptcha) {
      return;
    }
    try {
      window.hcaptcha.reset(hCaptchaWidgetId);
    } catch (e) {
      // ignore
    }
  }

  function getLeadHCaptchaResponse() {
    if (hCaptchaWidgetId === null || !window.hcaptcha) {
      return "";
    }
    try {
      return String(window.hcaptcha.getResponse(hCaptchaWidgetId) || "");
    } catch (e) {
      return "";
    }
  }

  function initLeadHCaptcha() {
    if (!leadCaptchaContainer) {
      return;
    }
    var doRender = function () {
      if (!window.hcaptcha) {
        return;
      }
      if (hCaptchaWidgetId === null) {
        hCaptchaWidgetId = window.hcaptcha.render(leadCaptchaContainer, {
          sitekey: HCAPTCHA_SITEKEY,
          hl: "ru",
          theme: "light",
        });
      }
    };

    if (window.hcaptcha) {
      doRender();
      return;
    }

    var n = 0;
    var poll = setInterval(function () {
      n += 1;
      if (window.hcaptcha) {
        clearInterval(poll);
        doRender();
        return;
      }
      if (n >= 100) {
        clearInterval(poll);
        if (hCaptchaWidgetId === null && leadGlobal) {
          setGlobalError("Не удалось загрузить проверку. Обновите страницу и попробуйте снова.");
        }
      }
    }, 50);
  }

  function showLeadSuccessView() {
    if (leadPanelInner) {
      leadPanelInner.setAttribute("hidden", "");
    }
    if (leadSuccess) {
      leadSuccess.removeAttribute("hidden");
    }
    if (leadModal) {
      leadModal.setAttribute("aria-labelledby", "lead-success-message");
    }
  }

  function showLeadFormView() {
    if (leadSuccess) {
      leadSuccess.setAttribute("hidden", "");
    }
    if (leadPanelInner) {
      leadPanelInner.removeAttribute("hidden");
    }
    if (leadModal) {
      leadModal.setAttribute("aria-labelledby", "lead-modal-title");
    }
  }

  function resetLeadModal() {
    showLeadFormView();
    if (leadForm) {
      leadForm.reset();
    }
    clearFieldErrors();
    setGlobalError("");
    setSubmitting(false);
    resetLeadHCaptcha();
  }

  function openLeadModal() {
    if (!leadModal) return;
    if (header && window.matchMedia("(max-width: 900px)").matches && nav && nav.classList.contains("is-open")) {
      if (typeof closeNav === "function") {
        closeNav();
      } else {
        if (burger) {
          burger.setAttribute("aria-expanded", "false");
        }
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    }
    lastLeadFocus = document.activeElement;
    resetLeadModal();
    setInertOnModal(false);
    leadModal.setAttribute("aria-hidden", "false");
    leadModal.classList.add("is-open");
    bodyScrollPrev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () {
      if (leadName) {
        leadName.focus();
      } else if (leadSubmit) {
        leadSubmit.focus();
      }
    }, 0);
    window.setTimeout(function () {
      initLeadHCaptcha();
    }, 80);
  }

  function closeLeadModal() {
    if (!leadModal) return;
    if (!leadModal.classList.contains("is-open")) return;
    leadModal.setAttribute("aria-hidden", "true");
    leadModal.classList.remove("is-open");
    setInertOnModal(true);
    document.body.style.overflow = bodyScrollPrev;
    resetLeadModal();
    if (lastLeadFocus && typeof lastLeadFocus.focus === "function") {
      try {
        lastLeadFocus.focus();
      } catch (e) {
        // ignore
      }
    }
    lastLeadFocus = null;
  }

  function validateLead() {
    var name = leadName && leadName.value ? leadName.value.trim() : "";
    var contact = leadContact && leadContact.value ? leadContact.value.trim() : "";
    var ok = true;
    if (!name) {
      showFieldError(leadName, leadNameErr, true);
      ok = false;
    } else {
      showFieldError(leadName, leadNameErr, false);
    }
    if (!contact) {
      showFieldError(leadContact, leadContactErr, true);
      ok = false;
    } else {
      showFieldError(leadContact, leadContactErr, false);
    }
    return ok;
  }

  if (leadModal) {
    setInertOnModal(true);
  }

  leadOpeners.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openLeadModal();
    });
  });

  leadClosers.forEach(function (el) {
    el.addEventListener("click", function () {
      closeLeadModal();
    });
  });

  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!leadName || !leadContact) return;
      setGlobalError("");
      clearFieldErrors();
      if (!validateLead()) {
        return;
      }
      var resCaps = getLeadHCaptchaResponse();
      if (!resCaps) {
        setGlobalError("Пройдите проверку «я не робот».");
        return;
      }
      setSubmitting(true);
      var nameV = leadName.value.trim();
      var contactV = leadContact.value.trim();
      var typeV = leadType && leadType.value ? String(leadType.value) : "";
      if (!typeV && leadType && leadType.options && leadType.selectedIndex > 0) {
        typeV = leadType.options[leadType.selectedIndex].textContent.trim();
      }
      var commV = leadComment && leadComment.value ? leadComment.value.trim() : "";
      var lines = ["Телефон / Telegram: " + contactV];
      if (typeV) {
        lines.push("Тип: " + typeV);
      }
      if (commV) {
        lines.push("Комментарий: " + commV);
      }
      var body = {
        access_key: WEB3_ACCESS_KEY,
        subject: "САМОЛЁТ — заявка с сайта",
        from_name: nameV,
        name: nameV,
        message: lines.join("\n"),
      };
      if (typeV) {
        body.project_type = typeV;
      }
      if (commV) {
        body.comment = commV;
      }
      body["h-captcha-response"] = resCaps;
      fetch(WEB3_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data = null;
            try {
              data = text ? JSON.parse(text) : {};
            } catch (err) {
              data = {};
            }
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          setSubmitting(false);
          if (result && result.data && result.data.success === true) {
            if (leadForm) {
              leadForm.reset();
            }
            clearFieldErrors();
            setGlobalError("");
            resetLeadHCaptcha();
            showLeadSuccessView();
            window.setTimeout(function () {
              var okBtn = leadSuccess && leadSuccess.querySelector(".lead-modal__success-back");
              if (okBtn && typeof okBtn.focus === "function") {
                okBtn.focus();
              }
            }, 0);
            return;
          }
          setGlobalError("Что-то пошло не так. Попробуйте ещё раз");
          resetLeadHCaptcha();
        })
        .catch(function () {
          setSubmitting(false);
          setGlobalError("Что-то пошло не так. Попробуйте ещё раз");
          resetLeadHCaptcha();
        });
    });
  }

  if (leadModal) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && leadModal.classList.contains("is-open")) {
        e.preventDefault();
        closeLeadModal();
      }
    });
  }

  if (leadName) {
    leadName.addEventListener("input", function () {
      if (leadName.getAttribute("aria-invalid") === "true" && leadName.value.trim()) {
        showFieldError(leadName, leadNameErr, false);
      }
    });
  }
  if (leadContact) {
    leadContact.addEventListener("input", function () {
      if (leadContact.getAttribute("aria-invalid") === "true" && leadContact.value.trim()) {
        showFieldError(leadContact, leadContactErr, false);
      }
    });
  }

  /* Отзывы: карусель в духе stagger-компонента */
  var testimonialsRoot = document.getElementById("testimonials-root");
  var testimonialsTrack = document.getElementById("testimonials-track");
  var testimonialsViewport = document.getElementById("testimonials-viewport");
  var testimonialsStatic = document.getElementById("testimonials-static");
  var btnPrev = document.getElementById("testimonials-prev");
  var btnNext = document.getElementById("testimonials-next");

  if (
    testimonialsRoot &&
    testimonialsTrack &&
    testimonialsViewport &&
    testimonialsStatic &&
    btnPrev &&
    btnNext
  ) {
    var testimonialsData = [
      {
        quote:
          "Ролик для детского центра получился тёплым и понятным родителям — наконец-то объяснили правила без занудства.",
        by: "Елена, директор детского развивающего центра",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "САМОЛЁТ помог мягко подготовить детей к процедурам: меньше страха в очереди — это ощутимо в отзывах семей.",
        by: "Андрей, администратор детской клиники",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Сочетание нейросетей и живой режиссуры дало нам стиль, который не выглядит «шаблоном из интернета».",
        by: "Марина, маркетолог санатория",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "За две недели собрали сценарий и визуал под бренд школы — команда держала фокус на задаче, а не на эффектах.",
        by: "Игорь, заместитель директора школы",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Нам важна была доступность сюжета — студия предложила несколько тональностей и выбрали ту, что «села» в аудиторию.",
        by: "Ольга, куратор социального проекта",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Мультик для праздника в центре стал отдельным активом: его крутят на экране и отправляют родителям в чат.",
        by: "Кирилл, коммерческий директор сети студий",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Понравилось, что нас вели за руку от идеи до финала — не нужно было самим собирать production по кускам.",
        by: "Дарья, HR-директор компании с семейным брендом",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Качество озвучки и темп сцен совпали с нашими ожиданиями для детской аудитории — без перегруза информацией.",
        by: "Павел, руководитель отдела коммуникаций клиники",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "История про «первый день в лагере» сняла часть вопросов у родителей заранее — меньше звонков в инфолинию.",
        by: "Светлана, методист образовательного холдинга",
        img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=128&h=160&fit=crop&auto=format&q=80",
      },
      {
        quote:
          "Визуально аккуратно, с характером бренда — ролик используем и на сайте, и на открытых днях.",
        by: "Тимур, продюсер внутренних медиа",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=160&fit=crop&auto=format&q=80",
      },
    ];

    var list = testimonialsData.map(function (item, i) {
      return { tempId: i, quote: item.quote, by: item.by, img: item.img };
    });

    function prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function cardSizePx() {
      return window.matchMedia("(min-width: 640px)").matches ? 365 : 290;
    }

    function handleMove(steps) {
      var newList = list.slice();
      var i;
      if (steps > 0) {
        for (i = 0; i < steps; i++) {
          var first = newList.shift();
          if (!first) return;
          newList.push({ tempId: Math.random(), quote: first.quote, by: first.by, img: first.img });
        }
      } else {
        for (i = 0; i < -steps; i++) {
          var last = newList.pop();
          if (!last) return;
          newList.unshift({ tempId: Math.random(), quote: last.quote, by: last.by, img: last.img });
        }
      }
      list = newList;
      renderCarousel();
    }

    function renderCarousel() {
      var size = cardSizePx();
      var cut = size < 320 ? 36 : 50;
      var n = list.length;
      var track = testimonialsTrack;
      track.textContent = "";
      var half = n % 2 ? (n + 1) / 2 : n / 2;

      list.forEach(function (item, index) {
        var position = index - half;
        var isCenter = position === 0;
        var card = document.createElement("article");
        card.className = "testimonial-card " + (isCenter ? "testimonial-card--center" : "testimonial-card--side");
        card.style.width = size + "px";
        card.style.height = size + "px";
        card.style.clipPath =
          "polygon(" +
          cut +
          "px 0%, calc(100% - " +
          cut +
          "px) 0%, 100% " +
          cut +
          "px, 100% 100%, calc(100% - " +
          cut +
          "px) 100%, " +
          cut +
          "px 100%, 0 100%, 0 0)";
        var yOff = isCenter ? -65 : index % 2 ? 15 : -15;
        var rot = isCenter ? 0 : index % 2 ? 2.5 : -2.5;
        card.style.transform =
          "translate(-50%, -50%) translateX(" +
          (size / 1.5) * position +
          "px) translateY(" +
          yOff +
          "px) rotate(" +
          rot +
          "deg)";

        card.addEventListener("click", function () {
          handleMove(position);
        });

        var img = document.createElement("img");
        img.className = "testimonial-card__photo";
        img.src = item.img;
        img.alt = item.by.split(",")[0].trim();
        img.loading = "lazy";
        img.width = 48;
        img.height = 56;
        card.appendChild(img);

        var q = document.createElement("p");
        q.className = "testimonial-card__quote";
        q.textContent = "\u201C" + item.quote + "\u201D";
        card.appendChild(q);

        var by = document.createElement("p");
        by.className = "testimonial-card__by";
        by.textContent = "\u2014 " + item.by;
        card.appendChild(by);

        track.appendChild(card);
      });
    }

    function renderStaticList() {
      testimonialsStatic.textContent = "";
      testimonialsData.forEach(function (item) {
        var li = document.createElement("li");
        var bq = document.createElement("blockquote");
        bq.textContent = item.quote;
        var cite = document.createElement("cite");
        cite.textContent = item.by;
        li.appendChild(bq);
        li.appendChild(cite);
        testimonialsStatic.appendChild(li);
      });
    }

    renderStaticList();

    if (prefersReducedMotion()) {
      testimonialsStatic.classList.remove("testimonials__static--hide");
    } else {
      testimonialsViewport.removeAttribute("hidden");
      renderCarousel();
      btnPrev.addEventListener("click", function () {
        handleMove(-1);
      });
      btnNext.addEventListener("click", function () {
        handleMove(1);
      });
      window.addEventListener(
        "resize",
        function () {
          renderCarousel();
        },
        { passive: true }
      );
    }
  }
})();
