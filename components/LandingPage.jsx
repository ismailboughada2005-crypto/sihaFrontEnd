'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "../images/aa.png";
import { translations } from "../app/translations";

import {
  Heart,
  Activity,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Users,
  FileText,
  Star,
  Check,
  ChevronDown,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Lock,
  X,
  Menu,
  Award,
  BookOpen,
  Filter,
  RefreshCw,
  Eye,
  ShieldAlert,
  Globe,
} from "lucide-react";

const specialtyKeyMap = {
  "General Medicine": "specialtyGeneral",
  Cardiology: "specialtyCardiology",
  Pediatrics: "specialtyPediatrics",
  Neurology: "specialtyNeurology",
};

const doctorKeyMap = {
  "Dr. Sarah Mitchell": "doctorMitchell",
  "Dr. James Chen": "doctorChen",
  "Dr. Elena Rostova": "doctorRostova",
  "Dr. Aaron Patel": "doctorPatel",
};

export default function LandingPage() {
  const [lang, setLang] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Statistics Chart Filter States
  const [statsTimeframe, setStatsTimeframe] = useState("hourly"); // hourly, weekly, monthly

  // Custom interactive mock data for Statistics Section
  const statsChartData = {
    hourly: [
      { label: "08:00", value: 34, load: "0.4s" },
      { label: "10:00", value: 85, load: "0.7s" },
      { label: "12:00", value: 110, load: "0.9s" },
      { label: "14:00", value: 64, load: "0.5s" },
      { label: "16:00", value: 92, load: "0.8s" },
      { label: "18:00", value: 120, load: "1.1s" },
      { label: "20:00", value: 45, load: "0.3s" },
    ],
    weekly: [
      { label: "Mon", value: 420, load: "0.8s" },
      { label: "Tue", value: 580, load: "0.6s" },
      { label: "Wed", value: 690, load: "0.9s" },
      { label: "Thu", value: 512, load: "0.5s" },
      { label: "Fri", value: 780, load: "1.2s" },
      { label: "Sat", value: 210, load: "0.4s" },
      { label: "Sun", value: 140, load: "0.3s" },
    ],
    monthly: [
      { label: "Jan", value: 2400, load: "0.9s" },
      { label: "Feb", value: 2800, load: "0.8s" },
      { label: "Mar", value: 3900, load: "1.0s" },
      { label: "Apr", value: 3500, load: "0.7s" },
      { label: "May", value: 4200, load: "1.1s" },
      { label: "Jun", value: 5100, load: "1.3s" },
      { label: "Jul", value: 4800, load: "0.9s" },
    ],
  };

  // Testimonials Slider State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Lead Submission State
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("Platform Demo");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Interactive Booking Widget State inside Services/Statistics context
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("General Medicine");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:00 AM");
  const [isBooked, setIsBooked] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const testimonials = [
    {
      quote: translations[lang].testimonial1Quote,
      author: translations[lang].doctorMitchell,
      role: translations[lang].roleMitchell,
      facility: translations[lang].facilityMitchell,
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      quote: translations[lang].testimonial2Quote,
      author: "Gregory Chen",
      role: translations[lang].roleChen,
      facility: translations[lang].facilityChen,
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      quote: translations[lang].testimonial3Quote,
      author: "Amira Al-Mansoor",
      role: translations[lang].roleMansoor,
      facility: translations[lang].facilityMansoor,
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150",
    },
  ];

  // Preloader Simulation Logic and Login Status Check
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("auth_token"));

    const numTexts = 6;
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setLoadingProgress(currentProgress);

      const textIndex = Math.min(
        Math.floor((currentProgress / 100) * numTexts),
        numTexts - 1,
      );
      setLoadingTextIndex(textIndex);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }
    }, 15); // Fast load simulation

    return () => clearInterval(interval);
  }, []);

  const handleDemoBooking = (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setPatientName("");
      setPatientPhone("");
    }, 6000);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFullName("");
      setClinicName("");
      setEmail("");
      setMessage("");
    }, 6000);
  };

  // Find max value in active timeframe dataset to scale the SVG chart proportionally
  const selectedChartDataset = statsChartData[statsTimeframe];
  const maxChartValue = Math.max(...selectedChartDataset.map((d) => d.value));

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* 1. INITIAL SIMULATED PRELOADER PAGE */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            id="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center">
              {/* Spinning active loading seal */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/25 relative"
              >
                <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-md opacity-40 animate-pulse pointer-events-none" />
                <Activity className="w-12 h-12 stroke-[2.5] relative z-10" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                  SIHA{" "}
                  <span className="text-blue-500 font-semibold">HEALTH</span>
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {translations[lang].serenity}
                </p>
              </div>

              {/* Progress and status line */}
              <div className="w-full max-w-xs space-y-3 pt-6">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                    className="bg-blue-500 h-full rounded-full transition-all duration-75 shadow-md shadow-blue-500/30"
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>
                    {
                      [
                        translations[lang].initializing,
                        translations[lang].verifying,
                        translations[lang].mapping,
                        translations[lang].loading,
                        translations[lang].cryptographic,
                        translations[lang].ready,
                      ][loadingTextIndex]
                    }
                  </span>
                  <span className="font-extrabold text-blue-500 text-xs">
                    {loadingProgress}%
                  </span>
                </div>
              </div>

              {/* Instant bypass hook */}
              <button
                onClick={() => setIsLoading(false)}
                className="text-[11px] text-slate-500 hover:text-blue-400 underline transition-colors pt-4 font-mono font-medium tracking-wide"
              >
                {translations[lang].bypass}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE WEB LANDING CORE COMPONENT */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* HEADER SECT SYSTEM NAVIGATION & CODES */}
          <header
            id="nav-header"
            className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all"
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center text-white relative">
                  <a href="/">
                    <Image src={logo} alt="waa" className="object-contain" />
                  </a>
                </div>
              </div>

              {/* Desktop anchor points */}
              <nav className="hidden md:flex items-center gap-8">
                <a
                  href="#services"
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {translations[lang].services}
                </a>
                <a
                  href="#about"
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {translations[lang].aboutUs}
                </a>
                <a
                  href="#statistics"
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {translations[lang].statistics}
                </a>
                <a
                  href="#contact"
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {translations[lang].contact}
                </a>
              </nav>

              {/* Utility elements */}
              <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
                  <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
                  <div className="flex text-xs">
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${lang === "en" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang("fr")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${lang === "fr" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                    >
                      FR
                    </button>
                  </div>
                </div>

                {/* Login/Dashboard button */}
                <Link
                  href={isLoggedIn ? "/" : "/login"}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10"
                >
                  {isLoggedIn ? (lang === "en" ? "Dashboard" : "Tableau de Bord") : (lang === "en" ? "Sign In" : "Connexion")}
                </Link>

                {/* Mobile Menu Icon toggling */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Expandable Overlay Drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden border-t border-slate-100 bg-white overflow-hidden px-6 py-4"
                >
                  <div className="flex flex-col gap-4">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      href="#home"
                      className="text-sm font-bold text-slate-700 py-1 block"
                    >
                      {translations[lang].home}
                    </a>
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      href="#about"
                      className="text-sm font-bold text-slate-700 py-1 block"
                    >
                      {translations[lang].aboutUs}
                    </a>
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      href="#services"
                      className="text-sm font-bold text-slate-700 py-1 block"
                    >
                      {translations[lang].services}
                    </a>
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      href="#statistics"
                      className="text-sm font-bold text-slate-700 py-1 block"
                    >
                      {translations[lang].statistics}
                    </a>
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      href="#contact"
                      className="text-sm font-bold text-slate-700 py-1 block font-mono text-blue-600"
                    >
                      {translations[lang].contactDesk}
                    </a>

                    {/* Mobile language switcher */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Globe className="w-4 h-4" /> Language / Langue
                      </span>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs">
                        <button
                          onClick={() => setLang("en")}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-600"}`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => setLang("fr")}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all ${lang === "fr" ? "bg-blue-600 text-white" : "text-slate-600"}`}
                        >
                          FR
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* SECTION 1: HOME (HERO BLOCK) */}
          <section
            id="home"
            className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-200/50"
          >
            <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/20 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-85 bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Home Text Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div
                  id="home-badge"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-blue-500 fill-blue-100" />
                  <span>{translations[lang].heroBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[54px] lg:leading-[62px] font-black tracking-tight text-slate-900 leading-tight">
                  {translations[lang].heroTitlePart1} <br />
                  <span className="text-blue-600">
                    {translations[lang].heroTitlePart2}
                  </span>
                </h1>

                <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                  {translations[lang].heroDescription}
                </p>

                <div className="flex flex-wrap gap-4 pt-3">
                  <a
                    href="#services"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.01] transition-all flex items-center gap-2"
                  >
                    {translations[lang].viewServices}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#statistics"
                    className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all"
                  >
                    {translations[lang].examineStats}
                  </a>
                </div>
              </div>

              {/* Home Visual Right Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/40">
                  <img
                    alt="Clinical interface illustration"
                    className="w-full h-auto rounded-2xl drop-shadow-sm select-none"
                    src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=600"
                    referrerPolicy="no-referrer"
                  />

                  {/* Real-time styled overlay label */}
                  <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl space-y-1.5 max-w-[220px] border border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-extrabold">
                      <Heart className="w-4 h-4 fill-emerald-500 stroke-none animate-pulse" />
                      <span>{translations[lang].telemetryOnline}</span>
                    </div>
                    <p className="text-sm font-extrabold tracking-tight">
                      {translations[lang].integratedGrid}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {translations[lang].allStable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ABOUT US */}
          <section
            id="about"
            className="py-24 bg-white border-b border-slate-200/50"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* About Us Media/Highlight Left Column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-1 max-w-[360px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
                    <img
                      alt="Healthcare doctors consulting"
                      className="w-full h-72 sm:h-96 object-cover rounded-2xl"
                      src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Visual trust seal */}
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-start max-w-md">
                    <Award className="w-8 h-8 text-blue-600 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {translations[lang].certifiedStandards}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {translations[lang].certifiedDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Us Copy Right Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {translations[lang].aboutWhoWeAre}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                      {translations[lang].aboutTitle}
                    </h2>
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {translations[lang].aboutDescription}
                  </p>

                  {/* Core Value Pillars list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="p-5 rounded-xl border border-slate-200/65 space-y-3 hover:bg-slate-50/60 transition-all">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm text-slate-900">
                        {translations[lang].providerCentric}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {translations[lang].providerDescription}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-200/65 space-y-3 hover:bg-slate-50/60 transition-all">
                      <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm text-slate-900">
                        {translations[lang].adaptiveIntegrations}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {translations[lang].adaptiveDescription}
                      </p>
                    </div>
                  </div>

                  {/* Quote block */}
                  <div className="border-l-4 border-blue-600 pl-4 py-1.5 italic text-sm text-slate-600 bg-slate-50/50 p-4 rounded-r-xl">
                    {translations[lang].quoteText}
                    <span className="block font-bold text-xs text-slate-800 not-italic mt-2">
                      {translations[lang].designCommission}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: SERVICES */}
          <section
            id="services"
            className="py-24 bg-slate-50 border-b border-slate-200/50"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  {translations[lang].servicesBadge}
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                  {translations[lang].servicesTitle}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base">
                  {translations[lang].servicesSubtitle}
                </p>
              </div>

              {/* Premium Service cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Service 1 */}
                <div
                  id="service-intake"
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/20 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {translations[lang].serviceIntakeTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {translations[lang].serviceIntakeDesc}
                  </p>
                  <ul className="space-y-2 pt-2 text-xs font-bold text-slate-700 border-t border-slate-50">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-500" />{" "}
                      {translations[lang].serviceIntakeFeature1}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-500" />{" "}
                      {translations[lang].serviceIntakeFeature2}
                    </li>
                  </ul>
                </div>

                {/* Service 2 */}
                <div
                  id="service-calendar"
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {translations[lang].serviceCalendarTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {translations[lang].serviceCalendarDesc}
                  </p>
                  <ul className="space-y-2 pt-2 text-xs font-bold text-slate-700 border-t border-slate-50">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />{" "}
                      {translations[lang].serviceCalendarFeature1}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />{" "}
                      {translations[lang].serviceCalendarFeature2}
                    </li>
                  </ul>
                </div>

                {/* Service 3 */}
                <div
                  id="service-billing"
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-[#b45309]/20 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {translations[lang].serviceBillingTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {translations[lang].serviceBillingDesc}
                  </p>
                  <ul className="space-y-2 pt-2 text-xs font-bold text-slate-700 border-t border-slate-50">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-500" />{" "}
                      {translations[lang].serviceBillingFeature1}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-500" />{" "}
                      {translations[lang].serviceBillingFeature2}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: STATISTICS */}
          <section
            id="statistics"
            className="py-24 bg-white border-b border-slate-200/50"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#003c90] bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {translations[lang].statsBadge}
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                  {translations[lang].statsTitle}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base">
                  {translations[lang].statsSubtitle}
                </p>
              </div>

              {/* Bento Grid layout for Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Chart Card - 7 Columns */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#f1f5f9] flex items-center gap-2 text-sm uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />{" "}
                        {translations[lang].statsChartTitle}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        {translations[lang].statsChartDesc}
                      </p>
                    </div>

                    {/* Filter Segment Toggles */}
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs">
                      <button
                        onClick={() => setStatsTimeframe("hourly")}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statsTimeframe === "hourly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                      >
                        {translations[lang].statsHourly}
                      </button>
                      <button
                        onClick={() => setStatsTimeframe("weekly")}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statsTimeframe === "weekly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                      >
                        {translations[lang].statsWeekly}
                      </button>
                      <button
                        onClick={() => setStatsTimeframe("monthly")}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${statsTimeframe === "monthly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                      >
                        {translations[lang].statsMonthly}
                      </button>
                    </div>
                  </div>

                  {/* SVG Rendered Line Graph detailing analytics */}
                  <div className="pt-4 space-y-4">
                    <div className="h-44 sm:h-52 w-full flex items-end gap-2.5 sm:gap-4 relative pt-6 pr-2">
                      {selectedChartDataset.map((point, index) => {
                        const barPercentage =
                          (point.value / maxChartValue) * 100;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center h-full justify-end group"
                          >
                            {/* Hover tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 absolute top-0 bg-slate-800 text-[10px] font-mono py-1 px-2.5 rounded border border-slate-700 text-blue-400 font-bold transition-all duration-200 shadow-xl pointer-events-none mb-1 text-center">
                              Vol: {point.value} • latency: {point.load}
                            </div>

                            {/* Solid bar graphic component representing clinical load */}
                            <div
                              className="w-full bg-slate-800 rounded-md overflow-hidden relative"
                              style={{ height: `${barPercentage}%` }}
                            >
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "100%" }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.05,
                                }}
                                className="w-full bg-blue-600 group-hover:bg-blue-500 rounded-md shadow-inner transition-colors duration-150 relative"
                              >
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-400/30" />
                              </motion.div>
                            </div>

                            {/* Label */}
                            <span className="text-[10px] font-semibold text-slate-500 font-mono mt-3 uppercase tracking-wider">
                              {point.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-4">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />{" "}
                        {translations[lang].statsLiveUpdate}
                      </span>
                      <span>{translations[lang].statsSync}</span>
                    </div>
                  </div>
                </div>

                {/* Key statistics indicators - 5 Columns */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Stats Block 1 */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 mt-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {translations[lang].statsSatisfactionLabel}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-extrabold border border-emerald-100">
                        {translations[lang].statsStable}
                      </span>
                    </div>
                    <div className="flex gap-2 items-baseline">
                      <span className="text-3xl font-black text-slate-900">
                        4.9/5
                      </span>
                      <span className="text-xs text-slate-500 font-semibold font-mono">
                        {translations[lang].statsSatisfactionSub}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {translations[lang].statsSatisfactionDesc}
                    </p>
                  </div>

                  {/* Stats Block 2 */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 mt-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {translations[lang].statsTunnelLabel}
                      </span>
                      <span className="text-xs text-blue-600 font-bold font-mono">
                        TLS 1.3 AES-256
                      </span>
                    </div>
                    <div className="flex gap-2 items-baseline">
                      <span className="text-3xl font-black text-slate-900">
                        99.99%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {translations[lang].statsTunnelSub}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: "99.99%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: CONTACT */}
          <section
            id="contact"
            className="py-24 bg-slate-50 relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Side: Contact Information Channels */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {translations[lang].contactBadge}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight sm:text-4xl">
                      {translations[lang].contactTitle}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {translations[lang].contactDesc}
                    </p>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {translations[lang].contactEmailLabel}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-mono">
                          integrations@siha.health
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {translations[lang].contactPhoneLabel}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-mono">
                          +212 654-321-987 (9AM-5PM PST)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-200/50 rounded-xl flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {translations[lang].contactHqLabel}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600">
                          123 Digital Health Ave, Marrakech, MA 40091
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Secure Submission Consultation Form */}
                <div className="lg:col-span-7">
                  <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                    {/* Simulated validation overlay */}
                    {formSubmitted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">
                          {translations[lang].contactSuccessTitle}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                          {translations[lang].contactSuccessDesc}
                        </p>
                        <button
                          onClick={() => setFormSubmitted(false)}
                          className="mt-6 bg-slate-900 hover:bg-black text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                        >
                          {translations[lang].contactSuccessBtn}
                        </button>
                      </motion.div>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />{" "}
                      {translations[lang].contactFormTitle}
                    </h3>

                    <form onSubmit={handleInquirySubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase text-slate-500">
                            {translations[lang].contactFormName}
                          </label>
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl h-11 px-4 text-sm outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase text-slate-500">
                            {translations[lang].contactFormClinic}
                          </label>
                          <input
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                            type="text"
                            placeholder="Central Health Practice"
                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl h-11 px-4 text-sm outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase text-slate-500">
                          {translations[lang].contactFormEmail}
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          type="email"
                          placeholder="doctor@healthpractice.com"
                          className="w-full bg-[#f8fafc] border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl h-11 px-4 text-sm outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase text-slate-500">
                          {translations[lang].contactFormSubject}
                        </label>
                        <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full bg-[#f8fafc] border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl h-11 px-4 text-sm outline-none transition-all cursor-pointer font-semibold text-slate-700"
                        >
                          <option value="Platform Demo">
                            {translations[lang].subjectDemo}
                          </option>
                          <option value="Migration Support">
                            {translations[lang].subjectMigration}
                          </option>
                          <option value="Pricing Query">
                            {translations[lang].subjectPricing}
                          </option>
                          <option value="Partnership Setup">
                            {translations[lang].subjectPartnership}
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase text-slate-500">
                          {translations[lang].contactFormMessage}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          placeholder={
                            translations[lang].contactFormPlaceholder
                          }
                          className="w-full bg-[#f8fafc] border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl h-28 p-4 text-sm outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 inline-flex items-center justify-center"
                      >
                        {translations[lang].contactFormSubmit}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Footer Element */}
          <footer className="bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white relative">
                  <Image src={logo} alt="waa" className="object-contain" />
                </div>
                <span className="font-extrabold text-[#0f172a] text-md">
                  SIHA Health
                </span>
              </div>

              <p className="text-slate-500 text-xs text-center select-none">
                {translations[lang].footerText}
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
