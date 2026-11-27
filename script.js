(function () {
    var loader = document.getElementById('siteLoader');
    var fill = document.getElementById('loaderFill');
    var pct = document.getElementById('loaderPct');
    if (!loader) { document.body.classList.remove('loading'); return; }
    var DURATION = 1500;
    var start = null;
    function finish() {
      if (fill) fill.style.width = '100%';
      if (pct) pct.textContent = '100%';
      loader.classList.add('done');
      document.body.classList.remove('loading');
      setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
    }
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 2);
      var value = Math.round(eased * 100);
      if (fill) fill.style.width = value + '%';
      if (pct) pct.textContent = value + '%';
      if (t < 1) { requestAnimationFrame(step); } else { finish(); }
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
    } else {
      requestAnimationFrame(step);
    }
    /* Safety net: never trap the visitor behind the loader */
    setTimeout(function () {
      if (document.body.contains(loader) && !loader.classList.contains('done')) finish();
    }, 4000);
  })();
(function () {
    var form = document.getElementById('enquiryForm');
    if (!form) return;
    var errorBox = document.getElementById('formError');
    var successBox = document.getElementById('formSuccess');
    var whatsappBtn = document.getElementById('whatsappBtn');

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }
    function collect() {
      var pref = form.querySelector('input[name="pref"]:checked');
      return {
        name: val('fName'),
        phone: val('fPhone'),
        email: val('fEmail'),
        company: val('fCompany'),
        service: val('fService'),
        location: val('fLocation'),
        pref: pref ? pref.value : 'Phone Call',
        message: val('fMessage')
      };
    }
    function validate(d) {
      var missing = [];
      if (!d.name) missing.push('Full Name');
      if (!d.phone) missing.push('Phone Number');
      if (!d.email) missing.push('Email Address');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) missing.push('a valid Email Address');
      if (!d.service) missing.push('Service Needed');
      if (!d.message) missing.push('Project Details / Message');
      return missing;
    }
    function showError(msg) {
      if (successBox) successBox.classList.remove('show');
      if (errorBox) { errorBox.textContent = msg; errorBox.classList.add('show'); }
    }
    function showSuccess() {
      if (errorBox) errorBox.classList.remove('show');
      if (successBox) successBox.classList.add('show');
    }
    function bodyText(d) {
      var lines = [
        'New enquiry from the Moosa Enterprises website',
        '',
        'Name: ' + d.name,
        'Phone: ' + d.phone,
        'Email: ' + d.email
      ];
      if (d.company) lines.push('Company: ' + d.company);
      lines.push('Service Needed: ' + d.service);
      if (d.location) lines.push('Project Location: ' + d.location);
      lines.push('Preferred reply: ' + d.pref);
      lines.push('', 'Project Details:', d.message);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = collect();
      var missing = validate(d);
      if (missing.length) {
        showError('Please fill in: ' + missing.join(', ') + '.');
        return;
      }
      var subject = 'Website Enquiry — ' + d.service + ' — ' + d.name;
      var href = 'mailto:moosaco062@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(bodyText(d));
      showSuccess();
      window.location.href = href;
    });

    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', function () {
        var d = collect();
        var missing = validate(d);
        if (missing.length) {
          showError('Please fill in: ' + missing.join(', ') + '.');
          return;
        }
        var url = 'https://wa.me/923091298355?text=' + encodeURIComponent(bodyText(d));
        showSuccess();
        window.open(url, '_blank', 'noopener');
      });
    }
  })();
(function () {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  })();

/* ---------- Carousels (hero + services, auto-rotate) ---------- */
(function () {
    var roots = document.querySelectorAll('.carousel');
    if (!roots.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(roots, function (root) {
      var slides = root.querySelectorAll('.carousel-slide');
      var dots = root.querySelectorAll('.carousel-dot');
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      if (!slides.length) return;
      var current = 0;
      var timer = null;
      var DELAY = 6000;

      function goTo(i) {
        slides[current].classList.remove('active');
        if (dots[current]) { dots[current].classList.remove('active'); dots[current].setAttribute('aria-current', 'false'); }
        current = (i + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dots[current]) { dots[current].classList.add('active'); dots[current].setAttribute('aria-current', 'true'); }
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function start() {
        if (reduceMotion) return;
        stop();
        timer = setInterval(function () { goTo(current + 1); }, DELAY);
      }
      if (prev) prev.addEventListener('click', function () { goTo(current - 1); start(); });
      if (next) next.addEventListener('click', function () { goTo(current + 1); start(); });
      Array.prototype.forEach.call(dots, function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); start(); });
      });
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', start);
      start();
    });
  })();

/* ---------- Services carousel: 3 cards at a time, auto-rotate ---------- */
(function () {
    var root = document.getElementById('svcCarousel');
    if (!root) return;
    var track = root.querySelector('.svc-track');
    var items = track ? track.querySelectorAll('figure') : [];
    var prev = root.querySelector('[data-svc-prev]');
    var next = root.querySelector('[data-svc-next]');
    var dotsWrap = root.querySelector('.svc-dots');
    if (!track || !items.length || !dotsWrap) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index = 0;
    var timer = null;
    var DELAY = 6000;
    var dots = [];

    function visibleCount() {
      var w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 1023) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, items.length - visibleCount()); }
    function step() {
      var gap = parseFloat(window.getComputedStyle(track).columnGap) || 22;
      return items[0].offsetWidth + gap;
    }
    function render() {
      track.style.transform = 'translateX(' + (-index * step()) + 'px)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }
    function goTo(i) {
      var max = maxIndex();
      index = ((i % (max + 1)) + (max + 1)) % (max + 1);
      render();
    }
    function buildDots() {
      dotsWrap.innerHTML = '';
      dots = [];
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'svc-dot';
        b.setAttribute('aria-label', 'Go to services page ' + (i + 1));
        (function (n) {
          b.addEventListener('click', function () { goTo(n); start(); });
        })(i);
        dotsWrap.appendChild(b);
        dots.push(b);
      }
      if (index > maxIndex()) index = maxIndex();
      render();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(function () { goTo(index + 1); }, DELAY);
    }
    if (prev) prev.addEventListener('click', function () { goTo(index - 1); start(); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); start(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    var rT = null;
    window.addEventListener('resize', function () {
      if (rT) clearTimeout(rT);
      rT = setTimeout(buildDots, 150);
    });
    buildDots();
    start();
  })();
