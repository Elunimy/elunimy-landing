/* Elunimy waitlist — form handling.
 *
 * Flow: validate email + consent → (honeypot guard) → POST one row into the
 * Supabase `waitlist` table via PostgREST. The table's RLS allows anon INSERT
 * only, so the page can add an email but can never read the list back.
 */
(function () {
  'use strict';

  var cfg = window.WAITLIST_CONFIG || {};
  var form = document.getElementById('waitlist-form');
  var emailInput = document.getElementById('email');
  var consent = document.getElementById('consent');
  var honeypot = document.getElementById('company');
  var button = document.getElementById('submit');
  var statusEl = document.getElementById('status');
  var successView = document.getElementById('success');
  var successLine = document.getElementById('success-line');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(msg, type) {
    statusEl.textContent = msg || '';
    statusEl.className = 'status' + (type ? ' status--' + type : '');
  }

  function setLoading(on) {
    button.disabled = on;
    button.textContent = on ? 'Joining…' : button.dataset.label;
  }

  function showSuccess(alreadyOnList) {
    form.hidden = true;
    if (alreadyOnList && successLine) {
      successLine.textContent = "You're already on the list — we'll email you the moment Elunimy opens.";
    }
    successView.hidden = false;
    successView.classList.add('show');
    successView.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    setStatus('', null);

    var email = (emailInput.value || '').trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }
    if (!consent.checked) {
      setStatus('Please agree to receive updates to continue.', 'error');
      return;
    }

    // Honeypot: a human never fills this hidden field. If it has a value the
    // submission is a bot — pretend success, never touch the database.
    if (honeypot && honeypot.value) {
      showSuccess(false);
      return;
    }

    if (!cfg.url || !cfg.anonKey) {
      setStatus('Configuration error. Please try again later.', 'error');
      return;
    }

    setLoading(true);
    try {
      var res = await fetch(cfg.url + '/rest/v1/waitlist', {
        method: 'POST',
        headers: {
          'apikey': cfg.anonKey,
          'Authorization': 'Bearer ' + cfg.anonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          email: email,
          consent: true,
          source: cfg.source || 'web',
        }),
      });

      if (res.ok) {
        showSuccess(false);
      } else if (res.status === 409) {
        // Unique-violation → email already on the list. Friendly success.
        showSuccess(true);
      } else {
        setStatus('Something went wrong. Please try again in a moment.', 'error');
        setLoading(false);
      }
    } catch (err) {
      setStatus('Network error. Please check your connection and try again.', 'error');
      setLoading(false);
    }
  });
})();

/* Capabilities — interactive segmented pillars (Save / Edit / Find). */
(function () {
  'use strict';
  var COPIES = [
    'Everything worth keeping, in one quiet place.',
    'Open it, change it, make it yours — anytime.',
    'Ask in your own words. Find it, even years later.',
  ];
  var btns = Array.prototype.slice.call(document.querySelectorAll('.seg__btn'));
  var copyEl = document.getElementById('pillar-copy');
  if (!btns.length || !copyEl) return;

  function select(i) {
    btns.forEach(function (b, j) {
      var on = j === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    copyEl.classList.add('is-anim');
    setTimeout(function () {
      copyEl.textContent = COPIES[i];
      copyEl.classList.remove('is-anim');
    }, 150);
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { select(parseInt(b.dataset.i, 10)); });
    b.addEventListener('keydown', function (e) {
      var i = parseInt(b.dataset.i, 10);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var n = (i + 1) % btns.length; btns[n].focus(); select(n);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var p = (i - 1 + btns.length) % btns.length; btns[p].focus(); select(p);
      }
    });
  });
})();
