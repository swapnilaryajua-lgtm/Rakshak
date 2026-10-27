import React from 'react';
import { Check, Plus } from 'lucide-react';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.jsx';

export default function Pricing() {
    const [headerRef, headerVisible] = useScrollReveal();
    const [cardsRef, cardsVisible] = useScrollReveal();
    const [faqRef, faqVisible] = useScrollReveal();

    const [openFaq, setOpenFaq] = React.useState(null);
    const [isCompany, setIsCompany] = React.useState(false);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        { q: 'Can I upgrade or downgrade anytime?', a: 'Yes, you can change your plan at any time. Prorated charges or credits will be applied automatically.' },
        { q: 'How does the monitoring software work?', a: 'Our lightweight Windows application runs in the background and monitors your web app traffic locally. No data is sent to our servers.' },
        { q: 'Is my data stored on your servers?', a: 'No. Scan results and monitoring data remain entirely on your device, ensuring complete privacy.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, UPI, and net banking options through our secure payment gateway.' }
    ];

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', backgroundColor: 'var(--bg-primary, #FAF8F5)', minHeight: 'calc(100vh - 64px)', padding: '64px 24px', color: 'var(--text-primary, #1C1917)' }}>
            <style>
                {`
                .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
                .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
                .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: stretch; margin-top: 48px; }
                @media (min-width: 1024px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); align-items: center; } }
                .feature-item { display: flex; alignItems: flex-start; gap: 12px; margin-bottom: 16px; font-size: 15px; color: var(--text-secondary, #57534E); }
                .pro-card { transform: scale(1); border: 2px solid var(--accent, #0D9488); }
                @media (min-width: 1024px) { .pro-card { transform: scale(1.03); z-index: 10; } }
                .faq-item { border-bottom: 1px solid var(--border-default, #E7E5E4); padding: 24px 0; cursor: pointer; }
                .faq-q { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 18px; }
                .faq-a { margin-top: 16px; color: var(--text-secondary, #57534E); line-height: 1.6; display: none; }
                .faq-a.open { display: block; }
                .toggle-container { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 32px 0; font-weight: 600; }
                .toggle-btn { background: var(--border-default); border-radius: 999px; width: 64px; height: 32px; position: relative; cursor: pointer; transition: background 0.3s; }
                .toggle-btn.active { background: var(--accent); }
                .toggle-circle { position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .toggle-btn.active .toggle-circle { transform: translateX(32px); }
                `}
            </style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div ref={headerRef} className={`animate-on-scroll ${headerVisible ? 'is-visible' : ''}`} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Simple, Transparent Pricing</h1>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary, #57534E)', maxWidth: '600px', margin: '0 auto' }}>Choose the security level your application needs. Start free, upgrade when you are ready.</p>
                </div>

                <div className="toggle-container animate-on-scroll is-visible">
                    <span style={{ color: !isCompany ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Individual</span>
                    <div className={`toggle-btn ${isCompany ? 'active' : ''}`} onClick={() => setIsCompany(!isCompany)}>
                        <div className="toggle-circle"></div>
                    </div>
                    <span style={{ color: isCompany ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Startup / Company</span>
                </div>

                <div ref={cardsRef} className={`pricing-grid animate-on-scroll ${cardsVisible ? 'is-visible' : ''}`}>
                    {/* Free Card */}
                    <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Free</h2>
                        <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>₹0 <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary, #57534E)' }}>/month</span></div>
                        <div style={{ flexGrow: 1, marginBottom: '32px' }}>
                            <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> 4 free scans a day</div>
                            <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Basic vulnerability report</div>
                            <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> OWASP Top 10 coverage</div>
                            <div className="feature-item" style={{ marginTop: '24px', fontWeight: 600 }}>Top-up Scans:</div>
                            <div className="feature-item" style={{ fontSize: '14px' }}>• 1 day (15 scans) for ₹39</div>
                            <div className="feature-item" style={{ fontSize: '14px' }}>• 1 day (25 scans) for ₹49</div>
                        </div>
                        <Button variant="secondary" style={{ width: '100%' }}>Start Free</Button>
                    </Card>

                    {/* Pro Card */}
                    <Card className="pro-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: 'var(--accent-light, #CCFBF1)', padding: '32px', borderBottom: '1px solid var(--border-default, #E7E5E4)' }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--accent, #0D9488)', color: 'white', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700 }}>Most Popular</div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Pro Monitor</h2>
                            <div style={{ fontSize: '36px', fontWeight: 800 }}>
                                ₹{isCompany ? '15,000' : '5,000'} <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary, #57534E)' }}>/month</span>
                            </div>
                        </div>
                        <div style={{ padding: '32px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flexGrow: 1, marginBottom: '32px' }}>
                                <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Real-time Website Monitoring</div>
                                <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Unlimited vulnerability scans</div>
                                <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Detailed reports with remediation</div>
                                <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Desktop & Email notifications</div>
                                <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Priority email support</div>
                                {isCompany && <div className="feature-item"><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Corporate Dashboard</div>}
                            </div>
                            <Button variant="primary" style={{ width: '100%' }}>Subscribe to Pro</Button>
                        </div>
                    </Card>

                    {/* Defense Card */}
                    <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', backgroundColor: '#1C1917', color: 'white' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Defense</h2>
                        <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>
                            ₹{isCompany ? '20,000' : '10,000'} <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted, #A8A29E)' }}>/month</span>
                        </div>
                        <div style={{ flexGrow: 1, marginBottom: '32px' }}>
                            <div className="feature-item" style={{ color: '#E7E5E4' }}><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Everything in Pro Monitor</div>
                            <div className="feature-item" style={{ color: '#E7E5E4' }}><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Active Real-Time Protection</div>
                            <div className="feature-item" style={{ color: '#E7E5E4' }}><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Automated Hacker Blocking</div>
                            <div className="feature-item" style={{ color: '#E7E5E4' }}><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Attacker IP tracing</div>
                            <div className="feature-item" style={{ color: '#E7E5E4' }}><Check size={20} color="var(--accent, #0D9488)" style={{ flexShrink: 0 }} /> Firewall rule management</div>
                        </div>
                        <Button variant="primary" style={{ width: '100%' }}>Subscribe to Defense</Button>
                    </Card>
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary, #57534E)', fontSize: '14px' }}>
                    All plans include Aadhaar-verified account security and local-only data processing.
                </div>

                <div ref={faqRef} className={`animate-on-scroll ${faqVisible ? 'is-visible' : ''}`} style={{ marginTop: '96px', maxWidth: '800px', margin: '96px auto 0' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>Frequently Asked Questions</h2>
                    <div>
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="faq-item" onClick={() => toggleFaq(idx)}>
                                <div className="faq-q">
                                    {faq.q}
                                    <Plus size={20} style={{ transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                                </div>
                                <div className={`faq-a ${openFaq === idx ? 'open' : ''}`}>{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
