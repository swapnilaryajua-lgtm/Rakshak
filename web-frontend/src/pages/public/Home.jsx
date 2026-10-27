import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, ShieldCheck, UserCheck, HardDrive, DatabaseZap, Search, Cpu, Activity, Lock, ArrowRight, Zap } from 'lucide-react';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import KineticGrid from '../../components/ui/kinetic-grid.jsx';
import { GlobeInteractive } from '../../components/ui/globe-interactive.jsx';
import { Typewriter } from '../../components/ui/typewriter-text.jsx';

export default function Home() {
    const navigate = useNavigate();

    const staggerContainer = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
      }
    };

    const fadeInUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.5 } }
    };

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', backgroundColor: '#000', color: '#fff', position: 'relative', minHeight: '100vh', width: '100%' }}>
            {/* Fixed Background Grid with pointer-events: none to allow smooth mobile touch gestures */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <KineticGrid globalColor="default" style={{ width: '100%', height: '100%' }} />
            </div>

            <style>
                {`
                .hero-glow {
                  position: absolute;
                  width: 600px;
                  height: 600px;
                  background: radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(0,0,0,0) 70%);
                  top: -100px;
                }
                .bento-grid { display: grid; grid-template-columns: 1fr; gap: 20px; position: relative; z-index: 1; }
                @media (min-width: 640px) { .bento-grid { grid-template-columns: 1fr 1fr; } .bento-span-full { grid-column: span 2; } }
                .trust-grid { display: grid; grid-template-columns: 1fr; gap: 24px; text-align: center; }
                @media (min-width: 640px) { .trust-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
                .step-card { position: relative; padding: 24px; border-radius: 16px; background: rgba(20,20,20,0.8); border: 1px solid rgba(255,255,255,0.1); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
                `}
            </style>
            
            {/* Content Wrapper */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Hero Section */}
                <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', padding: 'clamp(32px, 6vw, 64px) clamp(16px, 4vw, 24px)', overflow: 'hidden' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px', width: '100%', position: 'relative', zIndex: 1 }}>
                        
                        {/* Text on the left */}
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, type: 'tween', ease: 'easeOut' }}
                          style={{ flex: '1 1 min(100%, 480px)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
                        >
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: '20px' }}>
                              <img src="/logo.png" alt="Rakshak Logo" style={{ height: 'clamp(44px, 6vw, 64px)', width: 'auto', objectFit: 'contain' }} />
                            </motion.div>
                            <h1 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 54px)', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.5px', textAlign: 'left' }}>
                              <Typewriter text={["Your Digital Shield Against Cyber Threats"]} speed={50} loop={false} />
                            </h1>
                            <p style={{ fontWeight: 400, fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '500px', textAlign: 'left', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                              Scan vulnerabilities. Monitor in real-time. Defend automatically. Rakshak provides enterprise-grade cybersecurity tools powered by local intelligence to keep your web applications impenetrable.
                            </p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
                                <motion.div
                                  whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: '0px 0px 12px rgba(0, 255, 128, 0.3)'
                                  }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                  style={{ borderRadius: '50px' }}
                                >
                                  <Button variant="primary" size="lg" onClick={() => navigate('/scan')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '16px', borderRadius: '50px', minHeight: '48px' }}>
                                    Start Free Scan <ArrowRight size={18} />
                                  </Button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Globe on the right */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.2, type: 'tween', ease: 'easeOut' }}
                          style={{ flex: '1 1 min(100%, 460px)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'clamp(280px, 45vw, 550px)', width: '100%', maxWidth: '550px', margin: '0 auto', zIndex: 0, opacity: 0.95 }}
                        >
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GlobeInteractive />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* How It Works Section */}
                <section style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 24px)', overflow: 'hidden' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                      <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, marginBottom: '16px', textAlign: 'center', letterSpacing: '-0.5px', color: '#fff' }}>Simple, Yet Powerful</h2>
                      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: 'clamp(32px, 6vw, 64px)', fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '600px', margin: '0 auto clamp(32px, 6vw, 64px) auto' }}>Secure your infrastructure in three simple steps without modifying a single line of your application code.</p>
                    </motion.div>

                    <motion.div 
                      className="trust-grid"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.div variants={fadeInUp} whileHover={{ y: -5 }} style={{ borderRadius: '16px' }}>
                        <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(0,255,128,0.15)' }}>
                          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Search size={24} color="var(--accent)" />
                          </div>
                          <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', color: '#fff' }}>Enter Target URL</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Provide the web address of your application. No agent installation or source code access required for the initial scan.</p>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeInUp} whileHover={{ y: -5 }} style={{ borderRadius: '16px' }}>
                        <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(0,255,128,0.15)' }}>
                          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Cpu size={24} color="var(--accent)" />
                          </div>
                          <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', color: '#fff' }}>Engine Analyzes</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Our custom OWASP ZAP wrapper performs deep penetration testing, fuzzing inputs, and hunting for misconfigurations.</p>
                        </Card>
                      </motion.div>
                      <motion.div variants={fadeInUp} whileHover={{ y: -5 }} style={{ borderRadius: '16px' }}>
                        <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(0,255,128,0.15)' }}>
                          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Activity size={24} color="var(--accent)" />
                          </div>
                          <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', color: '#fff' }}>Get Actionable Report</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Receive a detailed, developer-friendly report with precise reproduction steps and remediation code snippets.</p>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 24px)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <motion.h2 
                          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}
                          style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, marginBottom: 'clamp(32px, 6vw, 64px)', textAlign: 'center', letterSpacing: '-0.5px', color: '#fff' }}
                        >
                          Three Layers of Protection
                        </motion.h2>
                        <motion.div 
                          className="bento-grid"
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.div variants={fadeInUp} className="bento-span-full">
                              <motion.div whileHover={{ scale: 1.01, borderColor: 'var(--accent)' }} style={{ height: '100%', borderRadius: '12px' }}>
                                <Card style={{ padding: '40px', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                                    <Shield size={40} color="var(--accent)" style={{ position: 'relative', zIndex: 1 }} />
                                    <h3 style={{ fontSize: '28px', fontWeight: 700, position: 'relative', zIndex: 1, color: '#fff' }}>Web Vulnerability Scanner</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: 1.6, maxWidth: '800px', position: 'relative', zIndex: 1 }}>Submit any URL and receive a comprehensive security audit powered by our OWASP ZAP integration. Identifies SQL injection, XSS, server misconfigurations, and 50+ other vulnerability types with plain-language explanations.</p>
                                </Card>
                              </motion.div>
                            </motion.div>
                            <motion.div variants={fadeInUp}>
                              <motion.div whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }} style={{ height: '100%', borderRadius: '12px' }}>
                                <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <Eye size={32} color="var(--accent)" />
                                    <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Real-Time Monitoring</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Download our Windows software to continuously watch your web applications. Get instant desktop notifications the moment a new vulnerability is detected — all processed locally.</p>
                                </Card>
                              </motion.div>
                            </motion.div>
                            <motion.div variants={fadeInUp}>
                              <motion.div whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }} style={{ height: '100%', borderRadius: '12px' }}>
                                <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <ShieldCheck size={32} color="var(--accent)" />
                                    <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Active Defense System</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Our most advanced tier automatically blocks suspicious traffic, traces attacker IPs to their origin, and generates detailed incident reports. Your autonomous security analyst.</p>
                                </Card>
                              </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
                
                {/* Live Metrics [NEW] */}
                <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '64px' }}>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ type: 'tween', ease: 'easeOut' }} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>1.2M+</div>
                      <div style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Threats Blocked</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ type: 'tween', ease: 'easeOut', delay: 0.1 }} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>99.9%</div>
                      <div style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Uptime Protection</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ type: 'tween', ease: 'easeOut', delay: 0.2 }} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>50+</div>
                      <div style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Vuln Types Detected</div>
                    </motion.div>
                  </div>
                </section>

                {/* Trust Section */}
                <section style={{ padding: '96px 24px', position: 'relative' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <motion.h2 
                          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                          style={{ fontSize: '32px', fontWeight: 700, marginBottom: '64px', textAlign: 'center', color: '#fff' }}
                        >
                          Built on Trust & Privacy
                        </motion.h2>
                        <motion.div 
                          className="trust-grid"
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, margin: "-50px" }}
                        >
                            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <UserCheck size={32} color="var(--accent)" />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>Aadhaar-Verified Users</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Every account is identity-verified for a trusted, secure community ecosystem.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <HardDrive size={32} color="var(--accent)" />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>Local-Only Processing</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Monitoring software runs entirely on your machine. Zero sensitive data leaves your device.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <DatabaseZap size={32} color="var(--accent)" />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>No Server-Side Storage</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Scan results are generated in real-time and never persistently stored on our remote servers.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section style={{ padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
                      style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}
                    >
                        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px', color: '#fff' }}>Ready to Secure Your Application?</h2>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>Start with a free vulnerability scan — no signup or credit card required.</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant="primary" size="lg" onClick={() => navigate('/scan')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '18px' }}>
                            <Lock size={20} /> Initialize Free Scan
                          </Button>
                        </div>
                    </motion.div>
                </section>

            </div>
        </div>
    );
}
