import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Sparkles, Clock, Lock, ArrowRight, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the cybersecurity tier your application demands.\nEvery tier includes local privacy and authentic OWASP protection.",
  isCompany,
  setIsCompany,
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const switchRef = useRef(null);

  const handleToggle = (checked) => {
    setIsCompany(checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 55,
        spread: 65,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#0D9488", "#2DD4BF", "#14B8A6", "#047857", "#FBBF24"],
        ticks: 220,
        gravity: 1.1,
        decay: 0.93,
        startVelocity: 28,
        shapes: ["circle", "square"],
      });
    }
  };

  return (
    <div className="w-full py-12 md:py-16">
      {/* Header */}
      <div className="text-center space-y-4 mb-10 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          Flexible Cyber Defense
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-neutral-900">
          {title}
        </h1>
        <p className="text-neutral-600 text-lg whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      {/* Customer Segment Toggle Switch with Confetti */}
      <div className="flex items-center justify-center mb-12 px-4">
        <div className="inline-flex items-center gap-4 p-2 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-sm">
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer",
              !isCompany 
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/80" 
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            Individual Developers
          </button>

          <Label className="cursor-pointer flex items-center">
            <Switch
              ref={switchRef}
              checked={isCompany}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-[#0D9488]"
            />
          </Label>

          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2",
              isCompany 
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/80" 
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            Startups & Companies
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Enterprise Ready
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid (4 Banners: Free, Pro, Defense, Top-Up) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {plans.map((plan, index) => {
          const isNumericPrice = typeof plan.activePrice === "number";
          const isAvailableSoon = plan.buttonText.toLowerCase().includes("soon");

          return (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className={cn(
                "rounded-2xl border bg-white p-7 text-left flex flex-col justify-between relative transition-all duration-200 hover:shadow-xl",
                plan.isPopular 
                  ? "border-[#0D9488] ring-2 ring-[#0D9488]/30 shadow-md bg-gradient-to-b from-teal-50/40 via-white to-white" 
                  : plan.isDark
                    ? "bg-[#111622] border-neutral-800 text-white shadow-lg"
                    : "border-neutral-200",
                plan.isTopUp ? "border-amber-300 bg-gradient-to-b from-amber-50/30 via-white to-white" : ""
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 right-6 bg-[#0D9488] text-white py-1 px-3 rounded-full flex items-center gap-1 shadow-sm text-xs font-bold tracking-wide uppercase">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Top Up Badge */}
              {plan.isTopUp && (
                <div className="absolute -top-3.5 right-6 bg-amber-500 text-white py-1 px-3 rounded-full flex items-center gap-1 shadow-sm text-xs font-bold tracking-wide uppercase">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>On-Demand Credit</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                    plan.isDark 
                      ? "bg-neutral-800 text-neutral-300" 
                      : plan.isPopular
                        ? "bg-teal-100 text-teal-800"
                        : plan.isTopUp
                          ? "bg-amber-100 text-amber-800"
                          : "bg-neutral-100 text-neutral-600"
                  )}>
                    {plan.badge || plan.name}
                  </span>
                </div>

                <h3 className={cn("text-2xl font-extrabold mb-2", plan.isDark ? "text-white" : "text-neutral-900")}>
                  {plan.name}
                </h3>

                <p className={cn("text-xs leading-relaxed min-h-[38px] mb-5", plan.isDark ? "text-neutral-400" : "text-neutral-500")}>
                  {plan.description}
                </p>

                {/* Price Display with NumberFlow */}
                <div className="pt-2 pb-5 border-y border-neutral-200/60 dark:border-neutral-800 mb-6">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    {isNumericPrice ? (
                      <>
                        <span className={cn("text-4xl font-extrabold tracking-tight", plan.isDark ? "text-white" : "text-neutral-900")}>
                          <NumberFlow
                            value={plan.activePrice}
                            format={{
                              style: "currency",
                              currency: "INR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }}
                            formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                            transformTiming={{
                              duration: 400,
                              easing: "ease-out",
                            }}
                            className="font-variant-numeric: tabular-nums"
                          />
                        </span>
                        {plan.activePeriod && (
                          <span className={cn("text-xs font-semibold uppercase tracking-wider", plan.isDark ? "text-neutral-400" : "text-neutral-500")}>
                            / {plan.activePeriod}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={cn("text-2xl font-extrabold tracking-tight", plan.isDark ? "text-white" : "text-neutral-900")}>
                          {plan.activePrice}
                        </span>
                        {plan.activePeriod && (
                          <span className={cn("text-xs font-semibold uppercase tracking-wider", plan.isDark ? "text-neutral-400" : "text-neutral-500")}>
                            / {plan.activePeriod}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className={cn("text-[11px] font-medium mt-1", plan.isDark ? "text-neutral-400" : "text-neutral-500")}>
                    {plan.billingSubtext}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <div className={cn("text-xs font-bold uppercase tracking-wider mb-2", plan.isDark ? "text-neutral-400" : "text-neutral-700")}>
                    Included Features:
                  </div>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check className={cn(
                          "w-4 h-4 mt-0.5 shrink-0", 
                          plan.isDark ? "text-teal-400" : "text-[#0D9488]"
                        )} />
                        <span className={plan.isDark ? "text-neutral-300" : "text-neutral-700"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action Button */}
              <div>
                {isAvailableSoon ? (
                  <button
                    disabled
                    type="button"
                    className={cn(
                      "w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed transition-all",
                      plan.isDark
                        ? "bg-neutral-800/80 text-neutral-400 border border-neutral-700"
                        : plan.isPopular
                          ? "bg-teal-50 text-[#0D9488] border-2 border-[#0D9488]/40"
                          : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Available Soon</span>
                  </button>
                ) : (
                  <Link
                    to={plan.href || "/scan"}
                    className={cn(
                      buttonVariants({ variant: plan.isPopular ? "default" : "outline" }),
                      "w-full py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200",
                      plan.isPopular
                        ? "bg-[#0D9488] hover:bg-[#0F766E] text-white"
                        : "bg-neutral-900 hover:bg-neutral-800 text-white"
                    )}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
