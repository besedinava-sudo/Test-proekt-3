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
