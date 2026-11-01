import React, { useState } from 'react';
import { Plus, Minus, ShieldCheck, Lock, Sparkles, HelpCircle } from 'lucide-react';
import { Pricing } from '@/components/ui/pricing';
import useScrollReveal from '@/hooks/useScrollReveal';

export default function PricingPage() {
  const [isCompany, setIsCompany] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [faqRef, faqVisible] = useScrollReveal();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      name: "Free Community",
      badge: "Starter Tier",
      activePrice: 0,
      activePeriod: "forever",
      billingSubtext: "No credit card or commitment required",
      features: [
        "4 automated vulnerability scans every day",
        "OWASP Top 10 heuristic security coverage",
        "Interactive downloadable audit report summary",
        "100% Client-side local data privacy",
        "Community forum knowledgebase access"
      ],
      description: "Perfect for developers and hobbyists auditing personal web projects.",
      buttonText: "Start Free",
      href: "/scan",
      isPopular: false,
      isDark: false,
      isTopUp: false
    },
    {
      name: "Pro Monitor",
      badge: "Continuous Shield",
      activePrice: isCompany ? "₹10,000 – ₹1,00,000" : 10000,
      activePeriod: "year",
      billingSubtext: isCompany 
        ? "Scalable based on company size & monitored targets" 
        : "Billed annually (₹833/month equivalent)",
      features: [
        "Real-time background monitoring daemon",
        "Unlimited deep vulnerability audits",
        "Actionable remediation code snippets & CVSS",
        "Desktop & instant email incident alerting",
        "Priority 24/7 technical support response",
        ...(isCompany ? [
          "Multi-target corporate dashboard",
          "Team seats & centralized audit logs"
        ] : [
          "Single-seat developer license"
        ])
      ],
      description: "Continuous real-time vulnerability monitoring for high-reliability websites.",
      buttonText: "Available Soon",
      href: "#",
      isPopular: true,
      isDark: false,
      isTopUp: false
    },
    {
      name: "Defense Active",
      badge: "Active Countermeasure",
      activePrice: isCompany ? "Yearly Contract Base" : 12000,
      activePeriod: isCompany ? "yearly base" : "6 months",
      billingSubtext: isCompany 
        ? "Tailored enterprise SLA with dedicated threat retainer" 
        : "Billed semi-annually (₹2,000/month equivalent)",
      features: [
        "Everything included in Pro Monitor",
        "Autonomous real-time malicious traffic blocking",
        "Attacker origin IP tracing & forensic telemetry",
        "Automated local firewall rule enforcement",
        "Zero-day exploit shielding",
        ...(isCompany ? [
          "Dedicated SOC security engineer",
          "Custom compliance & contractual SLA"
        ] : [
          "Full standalone defensive suite"
        ])
      ],
      description: "Active autonomous firewall and attacker neutralization suite.",
      buttonText: "Available Soon",
      href: "#",
      isPopular: false,
      isDark: true,
      isTopUp: false
    },
    {
      name: "Scan Top-Ups",
      badge: "On-Demand Credit",
      activePrice: isCompany ? "From ₹49" : "From ₹39",
      activePeriod: "pack",
      billingSubtext: "Instant scan recharge • Zero recurring commitment",
      features: [
        "1 Day Pass: 15 on-demand scans for ₹39",
        "1 Day Power Pass: 25 on-demand scans for ₹49",
        "Deep Audit Pack: 50 scans + remediation for ₹99",
        "Valid across any target domain or URL",
        "Instant credit activation on your account",
        "Never expires until credits are consumed"
      ],
      description: "Pay-as-you-go scan packages when you need emergency target audits without a monthly plan.",
      buttonText: "Available Soon",
      href: "#",
      isPopular: false,
      isDark: false,
      isTopUp: true
    }
  ];

  const faqs = [
    {
      q: "How does the Pro version pricing work for Individuals vs Startups?",
      a: "For individual developers, Pro Monitor is a flat ₹10,000/year (~₹833/month). For startups and growing businesses, pricing flexibly scales between ₹10,000 and ₹1,00,000/year depending on your active endpoints, target applications, and team seat requirements."
    },
    {
      q: "What is the billing cadence for the Defense Active tier?",
      a: "For individuals, Defense Active is priced at ₹12,000 for 6 months. For startups and enterprises, Defense Active is structured as an annual contract base with customized SLAs, dedicated security engineers, and emergency threat response."
    },
    {
      q: "How do On-Demand Scan Top-Ups work?",
      a: "If you are on the Free tier and exceed the 4 free scans/day limit, you can purchase an instant Top-Up pack starting at just ₹39 for 15 scans. Credits are added immediately to your account without requiring a recurring monthly or annual commitment."
    },
    {
      q: "Why do the paid subscription buttons say 'Available Soon'?",
      a: "We are currently completing payment gateway certification and compliance for Indian UPI, NetBanking, and corporate billing. You can enjoy Free Community scans today, and paid subscriptions will unlock shortly."
    },
    {
      q: "Is my application data or target code sent to external servers?",
      a: "Never. Rakshak operates on a privacy-first architecture where scans, security headers, and network telemetry are processed directly in your local environment."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-[calc(100vh-64px)] py-10 md:py-16 text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Interactive Pricing Section */}
        <Pricing
          plans={plans}
          title="Simple, Transparent Cybersecurity Pricing"
          description="Choose the security level your application needs.\nStart with our free community tier, or upgrade for automated real-time defense."
          isCompany={isCompany}
          setIsCompany={setIsCompany}
        />

        {/* Security & Verification Assurance Banner */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-white border border-neutral-200/80 shadow-sm max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488] shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h4 className="text-base font-bold text-neutral-900 mb-1">
              Enterprise Grade Local-Only Security Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All plans include Aadhaar-verified identity protections and zero data retention. Your scan payloads and vulnerability findings are never sold, cached, or transferred to third parties.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div 
          ref={faqRef} 
          className={`mt-20 max-w-3xl mx-auto transition-all duration-700 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/60 text-neutral-700 text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Got Questions? We’ve Got Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-neutral-200 bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-4 px-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/80 transition-colors"
                  >
                    <span className="text-neutral-900">{faq.q}</span>
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
