import React, { useEffect, useState } from 'react';
import GlyphPortal from '../../components/ui/GlyphPortal.jsx';
import KineticGrid from '../../components/ui/kinetic-grid.jsx';
import Card from '../../components/Card.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.jsx';

const settings = { word: "RAKSHAK", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad;

export default function About(props) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState(null);
  
  useEffect(() => {
    let settled = false;
    const finish = (value) => { if (!settled) { settled = true; setFace(value); } };
    fontLoad ??= new FontFace("Glyph Portal Jakarta", 'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")', { weight: "400 700" })
      .load().then((font) => { document.fonts.add(font); });
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);

  return (
    <div data-demo-scroll data-slipstream-demo tabIndex={0} role="region" aria-label="Rakshak. Scroll to step inside."
      style={{ width: "100%", height: "calc(100vh - 72px)", overflowY: "auto", background: "var(--bg-primary)", containerType: "inline-size", fontFamily: face ?? "Arial, sans-serif" }}>
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 20px;gap:28px;background:#1A1A1A;border:1px solid #1A1A1A;border-radius:50px;color:#fff;font-size:13px;font-weight:600;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer;}
        [data-slipstream-demo] [data-gp-enter]:hover{transform: scale(1.05); box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.15); background:#000;}
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid #1A1A1A;outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{border-color:transparent;border-radius:0px;font-size:12px;color:var(--text-secondary);}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:white; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;font-weight:600;line-height:1.5;letter-spacing:.05em;text-transform: uppercase;color:white;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;font-weight:500;line-height:1.5;color:rgba(255,255,255,0.7);}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:.01em;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:12ch;text-align:right;}[data-sublime-eyebrow]{font-size:12px;}[data-sublime-support]{font-size:14px;}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}
        [data-slipstream-demo] [data-gp-content]{padding:0;font-family:"Plus Jakarta Sans", sans-serif;}
        [data-slipstream-copy]{display:flex;width:100%;flex-direction:column; background: var(--accent); color: white;}
        .team-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .team-grid { grid-template-columns: repeat(3, 1fr); } }
        .values-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .values-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
      
      {face ? <GlyphPortal 
        word={s.word} 
        fontFamily={face} 
        fontWeight={700} 
        style={{ 
          fontFamily: face, 
          '--gp-paper': 'var(--bg-primary)', 
          '--gp-ink': 'var(--accent)', 
          '--gp-field': 'var(--accent)', 
          '--gp-foreground': 'var(--accent)' 
        }}
        scrollLength={s.scrollLength} 
        interactive={s.interactive} 
        annotations={s.annotations} 
        enterLabel="Scroll to know more" 
        background={<KineticGrid globalColor="green" style={{ position: "absolute", inset: 0 }} />}
        front={<>
          <p data-sublime-eyebrow>Enterprise-grade security.</p>
          <p data-sublime-support>Democratizing cyber defense for everyone.</p>
          <span data-sublime-scroll>Scroll to step inside ↓</span>
        </>}>
        
        <div data-slipstream-copy>
            <section style={{ padding: '96px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>Our Mission</h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>Our vision is to democratize cybersecurity for startups and SMBs. We're building tools that provide top-tier protection without the enterprise price tag, empowering developers to build securely from day one.</p>
                </div>
            </section>

            <section style={{ padding: '96px 24px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Privacy by Design</h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '48px', textAlign: 'center' }}>
                        Rakshak was born from a simple observation: small and medium businesses in India are increasingly targeted by cyberattacks, but enterprise security tools are too expensive, and free scanners often sell your vulnerability data or store it insecurely.
                    </p>
                    
                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>Our Local-First Philosophy</h3>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, textAlign: 'center' }}>
                        When you use Rakshak's monitoring or defense tools, the software runs entirely on your Windows machine. Your vulnerability data, scan reports, and traffic logs never leave your device. We provide the intelligence engine; you keep the data.
                    </p>
                </div>
            </section>

            <section style={{ padding: '96px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '48px', textAlign: 'center' }}>Our Values</h2>
                    <div className="values-grid">
                        <Card style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Transparency</h3>
                            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Open communication and clear explanations of security findings.</p>
                        </Card>
                        <Card style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Empowerment</h3>
                            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Giving developers the tools they need to take control of their security.</p>
                        </Card>
                        <Card style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Local Intelligence</h3>
                            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Processing sensitive data directly on your device, ensuring total privacy.</p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
      </GlyphPortal> : <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-muted)", fontSize: 12 }}>Loading portal...</div>}
    </div>
  );
}
