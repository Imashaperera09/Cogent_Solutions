"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, ChevronDown,
  Sun, Moon, ArrowRight, Zap, Shield, Award
} from "lucide-react";

import { SPEAKERS, AGENDA, REASONS, FILTER_TYPES, TYPE_CLASS } from "./data";
import AiConsole from "./components/AiConsole";

const IconMap = {
  zap: <Zap size={22} />,
  award: <Award size={22} />,
  shield: <Shield size={22} />,
};

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const } }),
};

export default function Home() {
  const [theme, setTheme]         = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled]   = useState(false);
  const [agendaFilter, setFilter] = useState("All");
  const registerRef = useRef<HTMLElement | null>(null);

  const eventDate = new Date("2024-11-13T09:30:00+04:00");
  const countdown = useCountdown(eventDate);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredAgenda = agendaFilter === "All"
    ? AGENDA
    : AGENDA.filter(s => s.type === agendaFilter);

  const scrollToRegister = () =>
    registerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container-xl nav-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-dot" />
            AccelAlpha <span style={{ color: "var(--red)", marginLeft: 4 }}>× Oracle</span>
          </a>

          <ul className="nav-links">
            {["About", "Speakers", "Agenda", "Register"].map(link => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`}>{link}</a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              id="theme-toggle-btn"
              className="theme-toggle"
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="btn-primary" onClick={scrollToRegister}>
              Register <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-content container-xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Exclusive Executive Summit
            </div>
          </motion.div>

          <motion.h1 className="hero-title" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            Troubled Waters:<br />
            <span className="gradient-text">Sailing with AI</span><br />
            in Supply Chain
          </motion.h1>

          <motion.p className="hero-subtitle" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            An exclusive Accelalpha &amp; Oracle summit for Gulf supply chain leaders — 
            charting the course through rising costs, disruption, and digital transformation.
          </motion.p>

          <motion.div className="hero-meta" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <div className="hero-meta-item">
              <Calendar size={15} />
              13th November 2024
            </div>
            <div className="hero-meta-item">
              <Clock size={15} />
              09:30 AM – 01:00 PM
            </div>
            <div className="hero-meta-item">
              <MapPin size={15} />
              Marriott Resort, The Palm, Dubai
            </div>
          </motion.div>

          <motion.div className="hero-actions" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <button id="hero-register-btn" className="btn-primary" onClick={scrollToRegister}>
              Register Now <ArrowRight size={16} />
            </button>
            <a href="#agenda" className="btn-outline">
              View Agenda <ChevronDown size={15} />
            </a>
          </motion.div>
        </div>

        <div className="hero-scroll-indicator">
          <ChevronDown size={18} />
          <span>Scroll to explore</span>
        </div>
      </section>

      <section className="countdown-section">
        <div className="container-xl countdown-inner">
          <div className="countdown-label">
            Count every second<br />until the event
          </div>
          <div className="countdown-timer">
            {[
              { label: "Days",    value: countdown.days },
              { label: "Hours",   value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                className="countdown-unit"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 0.3 }}
              >
                <span className="countdown-number">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="countdown-unit-label">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container-xl about-grid">
          <motion.div
            className="about-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="section-eyebrow">Context</p>
            <h2 className="section-title">
              Navigate the Complexities of<br />
              <span className="gradient-text">Gulf Supply Chain &amp; Logistics</span>
            </h2>
            <p>
              The Gulf&apos;s supply chains are under pressure from rising costs, geopolitical instability, 
              and shifting sustainability mandates — forcing CFOs, COOs, and supply chain leaders to 
              reduce costs, build resilience, and integrate sustainable practices without compromising performance.
            </p>
            <p>
              AI-powered SCM and WMS solutions are key to future-proofing logistics and driving efficiency. 
              This exclusive event, hosted by Accelalpha &amp; Oracle, offers practical insights and real-world 
              strategies to streamline operations, reduce risks, and meet sustainability goals while staying 
              ahead of market volatility.
            </p>
            <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={scrollToRegister}>
              Secure Your Seat <ArrowRight size={15} />
            </button>
          </motion.div>

          <div className="stat-grid">
            {[
              { number: "8+",   label: "Industry Speakers"     },
              { number: "3.5h", label: "Curated Sessions"      },
              { number: "100+", label: "Executive Attendees"   },
              { number: "1",    label: "Exclusive Venue, Dubai" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
              >
                <div className="stat-number gradient-text">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
        <div className="container-xl">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-eyebrow">Why Attend</span>
            <h2 className="section-title">Top 3 Reasons to Attend</h2>
            <p className="section-desc">
              This is your opportunity to rethink your supply chain strategy, stay ahead of disruption, 
              and lead with sustainable, data-driven solutions tailored to the region&apos;s needs.
            </p>
          </motion.div>

          <div className="reasons-grid">
            {REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                className="reason-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="reason-icon">{IconMap[r.iconName]}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="speakers">
        <div className="container-xl">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-eyebrow">Our Speakers</span>
            <h2 className="section-title">Industry Leaders &amp; Experts</h2>
            <p className="section-desc">
              Hear from C-suite executives and regional directors shaping the future of supply chain in the Gulf.
            </p>
          </motion.div>

          <div className="speakers-grid">
            {SPEAKERS.map((s, i) => (
              <motion.div
                key={s.name}
                className="speaker-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.4}
              >
                <div className="speaker-avatar">{s.initials}</div>
                <div className="speaker-info">
                  <h4>{s.name}</h4>
                  <p className="speaker-role">{s.role}</p>
                  <p className="speaker-company">{s.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="agenda" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
        <div className="container-xl">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-eyebrow">Programme</span>
            <h2 className="section-title">Event Agenda</h2>
            <p className="section-desc">13th November 2024 · 09:30 AM – 01:00 PM</p>
          </motion.div>

          <div className="agenda-filters">
            {FILTER_TYPES.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                className={`filter-btn ${agendaFilter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="agenda-timeline">
            <AnimatePresence mode="popLayout">
              {filteredAgenda.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="agenda-item"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <div className="agenda-time">{item.time}</div>
                  <div className="agenda-card">
                    <span className={`agenda-type-badge ${TYPE_CLASS[item.type] ?? "type-session"}`}>
                      {item.type}
                    </span>
                    <h4>{item.title}</h4>
                    <p className="agenda-speaker">{item.speaker}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="section register-section" id="register" ref={registerRef}>
        <div className="container-xl">
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <span className="section-eyebrow">Interactive Matcher</span>
            <h2 className="section-title">AI-Powered Registration</h2>
            <p className="section-desc">
              Input your profile details to run real-time vector analysis, match with optimal content, and trigger automated MCP workflows.
            </p>
          </div>
          
          <AiConsole onSuccess={() => {}} />
        </div>
      </section>

      <footer className="footer">
        <div className="container-xl footer-inner">
          <div className="footer-brand">
            AccelAlpha <span style={{ color: "var(--red)" }}>×</span> Oracle
          </div>
          <p className="footer-copy">
            Troubled Waters: Sailing with AI in Supply Chain · 13th Nov 2024 · Marriott Resort, The Palm, Dubai
          </p>
          <p className="footer-copy">© 2024 Cogent Solutions. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
