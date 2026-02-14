(function () {
  function stripFixedHeightFromSrcset(srcset) {
    if (!srcset) return srcset;

    // маха ,h_460 и /h_460 и подобни
    return srcset
      .replace(/,h_\d+/g, '')
      .replace(/\/h_\d+/g, '')
      .replace(/h_\d+,/g, '')
      .replace(/h_\d+\//g, '');
  }

  function processModule(module) {
    if (!module) return;

    var sources = module.querySelectorAll('picture source');
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i];
      var oldSet = s.getAttribute('srcset');
      var newSet = stripFixedHeightFromSrcset(oldSet);

      if (newSet && newSet !== oldSet) {
        s.setAttribute('srcset', newSet);
      }
    }

    // прерисува картинките
    var imgs = module.querySelectorAll('picture img');
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      // “по-здрав” форс-релоуд
      img.setAttribute('src', img.getAttribute('src'));
    }
  }

  function run() {
    // всички banner модули, независимо от номера
    var modules = document.querySelectorAll('[id^="banners_module_"]');
    for (var i = 0; i < modules.length; i++) {
      processModule(modules[i]);
    }
  }

  // 1) DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // 2) още един път при пълно зареждане (понякога банерите идват късно)
  window.addEventListener('load', run);

  // 3) следи за динамично добавени банери
  if (window.MutationObserver) {
    var scheduled = false;
    var obs = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;

      // throttle: изпълни веднъж след “вълната” промени
      setTimeout(function () {
        scheduled = false;
        run();
      }, 50);
    });

    obs.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})(); /* Resize banner */