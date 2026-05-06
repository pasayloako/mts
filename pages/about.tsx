// pages/about.tsx
import React, { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function AboutPage() {
  // Toast helper for CTA buttons
  function showToast(message: string, href: string) {
    const existing = document.getElementById("__biblegpt_toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "__biblegpt_toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "28px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#2e5c2c",
      color: "white",
      padding: "12px 28px",
      borderRadius: "50px",
      fontWeight: "500",
      fontSize: "0.9rem",
      zIndex: "9999",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      fontFamily: "'Inter', sans-serif",
      transition: "opacity 0.4s",
      whiteSpace: "nowrap",
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 2800);
    setTimeout(() => window.open(href, "_blank", "noopener noreferrer"), 400);
  }

  return (
    <>
      <Head>
        <title>BibleAIGPT • About Us | Faith & AI united</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>

      <style>{`
        /* ── Nav reuse ── */
        :root {
          --bg-nav: #0d0d1f;
          --border-nav: #2d2d4a;
          --accent-nav: #8b5cf6;
          --accent2-nav: #a78bfa;
          --text-nav: #ffffff;
          --text2-nav: #9ca3af;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(145deg, #fefaf5 0%, #f9f3ea 100%);
          color: #2c2418;
          line-height: 1.5;
          min-height: 100vh;
        }

        /* ── Top Nav ── */
        .topnav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 50px; background: var(--bg-nav);
          border-bottom: 1px solid var(--border-nav); position: sticky; top: 0; z-index: 20;
        }
        .topnav-brand { font-size: 1.05rem; font-weight: 700; color: var(--text-nav); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .topnav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 8px; font-size: 0.875rem; font-weight: 500;
          color: var(--text2-nav); text-decoration: none; transition: all 0.18s; border: 1px solid transparent;
        }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--text-nav); }
        .nav-link.active { background: rgba(139,92,246,0.18); color: var(--accent2-nav); border-color: rgba(139,92,246,0.3); }

        /* ── Page body ── */
        .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

        .hero-section { text-align: center; margin-bottom: 3.5rem; }
        .badge {
          display: inline-block; background: #e9dfd1; color: #6b4e2e;
          font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px;
          padding: 0.3rem 1rem; border-radius: 40px; margin-bottom: 1.2rem;
        }
        h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 3.2rem; font-weight: 600; color: #2e4a2c;
          letter-spacing: -0.01em; margin-bottom: 1rem;
        }
        .subhead {
          font-size: 1.2rem; color: #5a4a38; max-width: 700px;
          margin: 0 auto; font-weight: 400;
          border-top: 1px solid #e2d5c6; border-bottom: 1px solid #e2d5c6;
          display: inline-block; padding: 0.6rem 1.2rem;
        }

        .section-card {
          background: rgba(255,253,250,0.85); border-radius: 2rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.05);
          padding: 2rem; margin-bottom: 2.8rem; border: 1px solid #f0e5da;
          transition: box-shadow 0.2s;
        }
        .section-card:hover { box-shadow: 0 20px 35px -12px rgba(66,45,20,0.1); }

        h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem; font-weight: 600; color: #2e5c2c;
          border-left: 5px solid #c0a080; padding-left: 1.2rem; margin-bottom: 1.4rem;
        }
        .p-large { font-size: 1.08rem; line-height: 1.6; color: #3e3324; margin-bottom: 1.2rem; }

        .grid-team { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px,1fr)); gap: 2rem; margin-top: 1.5rem; }
        .team-card {
          background: white; border-radius: 1.5rem; padding: 1.6rem;
          box-shadow: 0 5px 12px rgba(0,0,0,0.02); border: 1px solid #efe3d6; transition: all 0.2s;
        }
        .team-card:hover { background: #fffdf9; border-color: #d9caba; }
        .team-icon { font-size: 2.8rem; color: #8b694a; margin-bottom: 0.5rem; }
        .team-name { font-size: 1.6rem; font-weight: 700; font-family: 'Cormorant Garamond', serif; color: #2a4b28; margin-bottom: 0.25rem; }
        .team-role { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #b38b60; margin-bottom: 1rem; }
        .team-desc { font-size: 0.95rem; color: #4e3f2e; line-height: 1.5; }

        .quote-box {
          background: #f2ede5; border-radius: 2rem; padding: 2rem; margin: 2rem 0 1rem;
          font-style: italic; font-size: 1.1rem; color: #3a2c1c;
          border-left: 6px solid #b5906b; font-family: 'Cormorant Garamond', serif; font-weight: 500;
        }

        .vision-block { background: #e7f0e4; border-radius: 2rem; padding: 1.8rem 2rem; }

        .btn-faith {
          display: inline-flex; align-items: center; gap: 10px;
          background: #2e5c2c; color: white; padding: 0.8rem 2rem;
          border-radius: 50px; font-weight: 500; text-decoration: none;
          transition: all 0.25s; margin-top: 1rem; border: none; cursor: pointer;
          font-size: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05); font-family: inherit;
        }
        .btn-faith:hover { background: #1f421d; transform: translateY(-2px); box-shadow: 0 10px 18px -8px rgba(0,0,0,0.2); }
        .btn-brown { background: #846c52 !important; }
        .btn-brown:hover { background: #6a5540 !important; }

        footer {
          text-align: center; margin-top: 3rem; padding-top: 2rem;
          border-top: 1px solid #e1d3c5; color: #6c5b4b; font-size: 0.85rem;
        }

        .verse-tag {
          font-size: 0.85rem; background: #faf2ea; border-radius: 30px;
          padding: 0.2rem 0.8rem; display: inline-block; margin-bottom: 1rem; color: #8b694a;
        }

        @media (max-width: 700px) {
          .container { padding: 1.5rem 1rem 2.5rem; }
          h1 { font-size: 2.4rem; }
          .section-card { padding: 1.5rem; }
          .grid-team { gap: 1.2rem; }
          .nav-label { display: none; }
        }
      `}</style>

      {/* ── Top Nav ── */}
      <nav className="topnav">
        <Link href="/" className="topnav-brand">
          <span>📖</span> BibleGPT
        </Link>
        <div className="topnav-links">
          <Link href="/" className="nav-link">
            <span>💬</span>
            <span className="nav-label">Chat</span>
          </Link>
          <Link href="/bible" className="nav-link">
            <span>📜</span>
            <span className="nav-label">Bible</span>
          </Link>
          <Link href="/about" className="nav-link active">
            <span>🌿</span>
            <span className="nav-label">About</span>
          </Link>
        </div>
      </nav>

      <div className="container">
        {/* Hero */}
        <div className="hero-section">
          <div className="badge">
            <i className="fas fa-cross" style={{ marginRight: 6 }} />
            Faith + Artificial Intelligence
          </div>
          <h1>BibleAIGPT</h1>
          <div className="subhead">Ancient Scriptures · Modern Guidance · Eternal Hope</div>
        </div>

        {/* Purpose */}
        <div className="section-card">
          <h2>
            <i className="fas fa-bible" style={{ marginRight: 12, color: "#b5906b" }} />
            Our Purpose
          </h2>
          <p className="p-large">
            BibleAIGPT was born from a simple yet profound calling:{" "}
            <strong>
              to help you understand the Bible, grow spiritually, and receive guidance through
              AI-powered insights that are deeply rooted in Scripture.
            </strong>{" "}
            We're not just another chatbot — every response is shaped by the timeless wisdom of
            God's Word, designed to illuminate your path, answer hard questions, and nurture your
            relationship with Christ.
          </p>
          <p className="p-large">
            In a digital age where information overwhelms and truth can be blurred, our platform
            stands as a lighthouse. Whether you are a new believer, a seasoned disciple, or someone
            simply curious about the Christian faith, BibleAIGPT meets you where you are — offering
            clarity, encouragement, and biblical grounding. We believe technology, when surrendered
            to God's purposes, can become a powerful tool for discipleship and spiritual renewal.
          </p>
        </div>

        {/* Mission */}
        <div className="section-card">
          <h2>
            <i className="fas fa-hand-holding-heart" style={{ marginRight: 12, color: "#b5906b" }} />
            Mission: Making God's Word Accessible
          </h2>
          <p className="p-large">
            Our mission is clear:{" "}
            <strong>
              to make the Gospel more accessible, especially for modern users and younger
              generations.
            </strong>{" "}
            We understand that many people open their phones before they open their Bibles — and we
            want that moment to lead them to truth, not distraction. BibleAIGPT combines
            conversational AI with rich scriptural references, devotional context, and thoughtful
            insights. No dry theology, no robotic answers: just honest, faith-filled conversations
            that point back to Jesus.
          </p>
          <p className="p-large">
            From teenagers scrolling late at night to busy parents seeking a quick yet meaningful
            devotion, our platform bridges the gap between ancient truth and contemporary life. We
            aim to remove barriers — language, time, or biblical literacy — so that everyone can
            encounter God's love in a fresh and personal way.
          </p>
        </div>

        {/* Team */}
        <div className="section-card">
          <h2>
            <i className="fas fa-users" style={{ marginRight: 12, color: "#b5906b" }} />
            The Jay Team — Faith meets Code
          </h2>
          <p className="p-large">
            What started as a late-night conversation between two friends and a shared digital
            whiteboard,{" "}
            <strong>BibleAIGPT is brought to life by the Jay Team</strong> — a small but passionate
            group of believers, builders, and dreamers. We aren't a massive corporation; we're a
            handpicked community of faith-driven engineers, creatives, and theologians who believe
            the Gospel is the most powerful message ever given. Our journey includes countless
            trials, sleepless nights debugging, joyful breakthroughs, and moments of prayer asking
            for wisdom. But through every challenge, God's guidance shaped each line of code and
            every insight the platform offers.
          </p>

          <div className="grid-team">
            {/* Jay D Bohol */}
            <div className="team-card">
              <div className="team-icon">
                <i className="fas fa-chalkboard-user" />
              </div>
              <div className="team-name">Jay D Bohol</div>
              <div className="team-role">Founder & Visionary</div>
              <div className="team-desc">
                Jay is the heart and driving force behind BibleAIGPT. A technologist with a
                pastor's heart, he dreamed of an AI that answers not just with data, but with
                divine perspective. Passionate about faith, innovation, and helping others grow
                spiritually, Jay leads the team with humility and boldness. He often says,{" "}
                <em>
                  "If coding can feed the hungry or heal the sick, it can certainly share the
                  Gospel — and that's our call."
                </em>{" "}
                His leadership blends strategic vision and genuine pastoral care for every user.
              </div>
            </div>

            {/* Selov Ask */}
            <div className="team-card">
              <div className="team-icon">
                <i className="fas fa-pen-fancy" />
              </div>
              <div className="team-name">Selov Ask</div>
              <div className="team-role">Creative & Support Lead</div>
              <div className="team-desc">
                Selov brings warmth and creativity to the project, contributing in development
                support, user experience design, and content polishing. Whether refining the
                platform's voice or helping users navigate difficult spiritual questions, Selov
                ensures that every interaction feels human, caring, and biblically sound. With a
                gift for empathy and artistic detail, Selov transforms raw ideas into soulful
                features that invite people deeper into Scripture.
              </div>
            </div>

            {/* Claude */}
            <div className="team-card">
              <div className="team-icon">
                <i className="fas fa-microchip" />
              </div>
              <div className="team-name">Claude</div>
              <div className="team-role">AI Architect & Logic Shaper</div>
              <div className="team-desc">
                Claude is the key team member who shaped the system's intelligence — from
                theological logic flows to contextual memory and scriptural alignment. Working
                behind the scenes, Claude helped structure how BibleAIGPT understands complex
                biblical topics, preventing shallow answers and reinforcing doctrinal integrity.
                Claude's tireless effort in prompt engineering and AI improvements made the
                difference between a generic chatbot and a truly faith-centered guide. We call
                Claude our "architect of understanding."
              </div>
            </div>
          </div>

          <div className="quote-box">
            <i className="fas fa-quote-left" style={{ marginRight: 8, opacity: 0.6 }} />
            We started small — two laptops, one Bible, a lot of prayer, and fierce dedication.
            There were moments our AI gave unexpected verses, late-night errors, and moments we
            almost gave up. Yet God kept reminding us:{" "}
            <strong>"My grace is sufficient."</strong> Today, BibleAIGPT reaches souls across
            continents, and we're only beginning.
          </div>
        </div>

        {/* Journey */}
        <div className="section-card">
          <h2>
            <i className="fas fa-seedling" style={{ marginRight: 12, color: "#b5906b" }} />
            Our Journey: Struggles, Growth & Digital Harvest
          </h2>
          <p className="p-large">
            Building a faith-based AI is no small task. We grappled with nuanced theological
            questions:{" "}
            <em>
              How do we remain non-denominational yet deeply rooted in core Christian truths? How
              to avoid misinterpretation while staying compassionate?
            </em>{" "}
            We spent months curating training sources, collaborating with pastors and scholars, and
            testing thousands of biblical questions. Server costs, resource limitations, and
            self-doubt were real. But every time we saw a testimony —{" "}
            <em>"This helped me forgive,"</em> or <em>"Now I understand the Book of Romans,"</em>{" "}
            — we knew the struggle was worth it. Our goal is not perfection, but faithful
            stewardship: sharing the Gospel through ones and zeros.
          </p>
          <p className="p-large">
            Today, BibleAIGPT evolves through real user feedback. We believe in learning as a
            community — iterating with grace. Our team still faces obstacles, but we cling to the
            promise that God's Word never returns void. We're determined to spread the Gospel
            digitally, serving both the curious and the committed.
          </p>
        </div>

        {/* Vision */}
        <div className="vision-block">
          <h2 style={{ borderLeftColor: "#dbbd9a", marginTop: 0 }}>
            <i className="fas fa-globe" style={{ marginRight: 12, color: "#b5906b" }} />
            Vision & What's Ahead
          </h2>
          <p className="p-large">
            We dream big because our God is big. In the near future, BibleAIGPT will introduce{" "}
            <strong>multiple Bible translations (ESV, NIV, KJV, NLT, and more)</strong>, personalized
            prayer prompts, audio devotionals, and even community-based Bible study features. Our
            roadmap includes expanding in multiple languages so that believers in every corner of
            the world can access Scripture in their heart language.
          </p>
          <p className="p-large">
            We also envision a{" "}
            <strong>youth discipleship track</strong> — interactive Q&A journeys for teenagers, and
            a "Explore the Bible in 90 days" AI mentor. All powered by our core conviction: making
            disciples of all nations, one conversation at a time. We invite you to walk this journey
            with us, to pray for our project, and to use BibleAIGPT daily as your digital companion
            in faith.
          </p>
          <button
            className="btn-faith"
            onClick={() =>
              showToast(
                "✨ Opening BibleAIGPT platform — may God bless your exploration! ✨",
                "https://bibleaigpt.vercel.app"
              )
            }
          >
            <i className="fas fa-hands-praying" /> Join the journey — try BibleAIGPT
          </button>
        </div>

        {/* Closing */}
        <div className="section-card" style={{ background: "#fffaf2", textAlign: "center", marginTop: "2.8rem" }}>
          <i className="fas fa-heart" style={{ fontSize: "2rem", color: "#bc8f6b", marginBottom: "0.5rem", display: "inline-block" }} />
          <h2 style={{ borderLeft: "none", textAlign: "center", paddingLeft: 0 }}>
            Grow in Faith Today
          </h2>
          <p className="p-large" style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
            Whether you're seeking answers, daily encouragement, or a deeper understanding of
            Scripture — BibleAIGPT is your prayerful companion.{" "}
            <strong>You are not alone.</strong> Let the timeless Word of God meet you in this
            modern space. Step into a new way of exploring the Bible, rooted in faith, guided by
            AI, and always pointing to Jesus.
          </p>
          <div className="verse-tag">
            <i className="fas fa-book-open" /> Jeremiah 29:13 — "You will seek me and find me
            when you seek me with all your heart."
          </div>
          <p style={{ fontWeight: 500, marginTop: "1rem" }}>
            Peace be with you. The Jay Team 🌿
          </p>
          <button
            className="btn-faith btn-brown"
            style={{ marginTop: "1rem" }}
            onClick={() =>
              showToast(
                "✨ Opening BibleAIGPT — God bless your journey! ✨",
                "https://bibleaigpt.vercel.app"
              )
            }
          >
            <i className="fas fa-arrow-right" /> Start your journey at bibleaigpt.vercel.app
          </button>
        </div>

        <footer>
          <p>
            <i className="fas fa-church" /> BibleAIGPT — bridging ancient Scripture with modern
            hearts. | Based on faith, built with love. | Jay Team © 2025
          </p>
          <p style={{ marginTop: 8, fontSize: "0.75rem" }}>
            *Always test AI answers with your Bible & pastoral counsel — we are a tool, but the
            Holy Spirit is the ultimate teacher.
          </p>
        </footer>
      </div>
    </>
  );
}
