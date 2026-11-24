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
