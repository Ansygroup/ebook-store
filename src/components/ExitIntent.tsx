import { useEffect, useState } from 'react';
import { coupons } from '../data/coupons';

// Exit-intent coupon popup. Fires once per session when the user moves the
// cursor toward the top of the viewport (desktop) or on first mobile back-trigger.
// Pure frontend — no backend. Uses sessionStorage so it shows at most once.
export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const code = 'LEAD10';
  const coupon = coupons.find((c) => c.code === code);

  useEffect(() => {
    if (!coupon) return;
    if (sessionStorage.getItem('eb_exit_shown')) return;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem('eb_exit_shown', '1');
      setOpen(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') trigger();
    };

    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [coupon]);

  if (!open || !coupon) return null;

  const pct = coupon.percent;
  const copy = () => {
    try { navigator.clipboard?.writeText(coupon.code); } catch {}
  };

  return (
    <div className="exit-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <div className="exit-modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="exit-modal__close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        <span className="exit-modal__tag">Special offer</span>
        <h3 className="exit-modal__title">
          Take {pct}% off your first book
        </h3>
        <p className="exit-modal__sub">
          Just move your mouse out — your code is:
        </p>
        <button className="exit-modal__code" onClick={copy} title="Copy">
          {coupon.code}
        </button>
        <a className="btn btn--primary btn--lg exit-modal__cta" href="/shop">
          Shop now
        </a>
      </div>
    </div>
  );
}
