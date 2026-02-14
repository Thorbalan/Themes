(() => {
  const clean = (root=document) => {
    root.querySelectorAll('[id^="banners_module_"] picture source').forEach(s=>{
      const a = s.srcset;
      if (a) s.srcset = a.replace(/(^|[\/,])h_\d+(?=[\/,]|$)/g, '$1');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => clean());
  } else clean();

  new MutationObserver(m => {
    for (const x of m) for (const n of x.addedNodes)
      if (n.nodeType === 1) clean(n);
  }).observe(document.documentElement, {childList:true, subtree:true});
})();