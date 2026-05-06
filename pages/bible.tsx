// pages/bible.tsx
// Embeds the KJV Bible reader from biblekjv.vercel.app inside an iframe
// so users can read any book, chapter, and verse without leaving BibleGPT.

import React, { useState } from "react";
import Link from "next/link";

// ─── Bible book list ──────────────────────────────────────────────────────────

const OLD_TESTAMENT = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
  "Haggai","Zechariah","Malachi",
];

const NEW_TESTAMENT = [
  "Matthew","Mark","Luke","John","Acts",
  "Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians",
  "Philippians","Colossians","1 Thessalonians","2 Thessalonians",
  "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

// Chapter counts per book (KJV)
const CHAPTER_COUNTS: Record<string, number> = {
  Genesis:50,Exodus:40,Leviticus:27,Numbers:36,Deuteronomy:34,
  Joshua:24,Judges:21,Ruth:4,"1 Samuel":31,"2 Samuel":24,
  "1 Kings":22,"2 Kings":25,"1 Chronicles":29,"2 Chronicles":36,
  Ezra:10,Nehemiah:13,Esther:10,Job:42,Psalms:150,Proverbs:31,
  Ecclesiastes:12,"Song of Solomon":8,Isaiah:66,Jeremiah:52,
  Lamentations:5,Ezekiel:48,Daniel:12,Hosea:14,Joel:3,Amos:9,
  Obadiah:1,Jonah:4,Micah:7,Nahum:3,Habakkuk:3,Zephaniah:3,
  Haggai:2,Zechariah:14,Malachi:4,
  Matthew:28,Mark:16,Luke:24,John:21,Acts:28,
  Romans:16,"1 Corinthians":16,"2 Corinthians":13,Galatians:6,Ephesians:6,
  Philippians:4,Colossians:4,"1 Thessalonians":5,"2 Thessalonians":3,
  "1 Timothy":6,"2 Timothy":4,Titus:3,Philemon:1,Hebrews:13,James:5,
  "1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,"3 John":1,Jude:1,Revelation:22,
};

function toSlug(book: string): string {
  return book.toLowerCase().replace(/\s+/g, "-");
}

export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [panelOpen, setPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"ot" | "nt">("nt");

  const maxChapters = CHAPTER_COUNTS[selectedBook] ?? 1;

  // Build the iframe URL — biblekjv.vercel.app uses hash or query routing
  const iframeSrc = `https://biblekjv.vercel.app/`;

  const allBooks = tab === "ot" ? OLD_TESTAMENT : NEW_TESTAMENT;
  const filteredBooks = searchQuery.trim()
    ? [...OLD_TESTAMENT, ...NEW_TESTAMENT].filter((b) =>
        b.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBooks;

  function selectBook(book: string) {
    setSelectedBook(book);
    setSelectedChapter(1);
  }

  function prevChapter() {
    if (selectedChapter > 1) setSelectedChapter((c) => c - 1);
    else {
      const all = [...OLD_TESTAMENT, ...NEW_TESTAMENT];
      const idx = all.indexOf(selectedBook);
      if (idx > 0) {
        const prev = all[idx - 1];
        setSelectedBook(prev);
        setSelectedChapter(CHAPTER_COUNTS[prev] ?? 1);
      }
    }
  }

  function nextChapter() {
    if (selectedChapter < maxChapters) setSelectedChapter((c) => c + 1);
    else {
      const all = [...OLD_TESTAMENT, ...NEW_TESTAMENT];
      const idx = all.indexOf(selectedBook);
      if (idx < all.length - 1) {
        setSelectedBook(all[idx + 1]);
        setSelectedChapter(1);
      }
    }
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #1a1a2e;
          --sidebar-bg: #111827;
          --border: #2d2d4a;
          --accent: #8b5cf6;
          --accent2: #a78bfa;
          --text: #ffffff;
          --text2: #9ca3af;
          --input-bg: #1e1e3a;
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); }

        .page { display: flex; flex-direction: column; height: 100vh; }

        /* ── Top Nav ── */
        .topnav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 50px; background: #0d0d1f;
          border-bottom: 1px solid var(--border); flex-shrink: 0; z-index: 20;
        }
        .topnav-brand { font-size: 1.05rem; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .topnav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 500;
          color: var(--text2); text-decoration: none;
          transition: all 0.18s; border: 1px solid transparent;
        }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--text); }
        .nav-link.active { background: rgba(139,92,246,0.18); color: var(--accent2); border-color: rgba(139,92,246,0.3); }

        /* ── Body ── */
        .body { display: flex; flex: 1; overflow: hidden; }

        /* ── Book Panel ── */
        .book-panel {
          width: 240px; background: var(--sidebar-bg); display: flex; flex-direction: column;
          border-right: 1px solid var(--border); flex-shrink: 0; transition: width 0.2s;
        }
        .book-panel.closed { width: 0; overflow: hidden; }

        .panel-header {
          padding: 12px; border-bottom: 1px solid var(--border); flex-shrink: 0;
        }
        .panel-title { font-size: 0.8rem; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

        .search-input {
          width: 100%; padding: 7px 10px; background: var(--input-bg);
          border: 1px solid var(--border); border-radius: 8px; color: var(--text);
          font-size: 0.82rem; outline: none;
        }
        .search-input:focus { border-color: var(--accent); }
        .search-input::placeholder { color: #6b7280; }

        .testament-tabs { display: flex; gap: 4px; margin-top: 8px; }
        .tab-btn {
          flex: 1; padding: 5px; background: transparent; border: 1px solid var(--border);
          border-radius: 6px; color: var(--text2); font-size: 0.75rem; cursor: pointer; transition: all 0.15s;
        }
        .tab-btn.active { background: rgba(139,92,246,0.2); color: var(--accent2); border-color: rgba(139,92,246,0.4); }

        .book-list { flex: 1; overflow-y: auto; padding: 8px; }
        .book-item {
          padding: 8px 12px; border-radius: 7px; cursor: pointer;
          color: var(--text2); font-size: 0.82rem; transition: all 0.15s;
          margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .book-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .book-item.selected { background: rgba(139,92,246,0.18); color: var(--accent2); font-weight: 600; }

        /* ── Reader area ── */
        .reader-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        /* ── Reader toolbar ── */
        .reader-toolbar {
          padding: 10px 16px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          background: #16172a; flex-wrap: wrap;
        }
        .toolbar-toggle {
          background: transparent; border: none; color: var(--text2);
          cursor: pointer; font-size: 1.1rem; padding: 4px 8px; border-radius: 6px;
        }
        .toolbar-toggle:hover { background: rgba(255,255,255,0.06); color: var(--text); }

        .book-chapter-info {
          font-size: 1rem; font-weight: 700; color: var(--text); flex: 1;
          min-width: 120px;
        }
        .chapter-badge { font-size: 0.75rem; color: var(--text2); font-weight: 400; margin-left: 6px; }

        .chapter-nav { display: flex; align-items: center; gap: 6px; }
        .chapter-select {
          background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text); padding: 5px 10px;
          font-size: 0.82rem; outline: none; cursor: pointer;
        }
        .chapter-select:focus { border-color: var(--accent); }

        .nav-btn {
          background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text); padding: 6px 12px;
          font-size: 0.82rem; cursor: pointer; transition: all 0.15s;
        }
        .nav-btn:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.4); }
        .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .ext-link {
          display: flex; align-items: center; gap: 5px;
          background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.35);
          border-radius: 8px; color: var(--accent2);
          padding: 5px 12px; font-size: 0.8rem; font-weight: 500;
          text-decoration: none; transition: all 0.15s; white-space: nowrap;
        }
        .ext-link:hover { background: rgba(139,92,246,0.28); }

        /* ── iFrame ── */
        .iframe-wrapper { flex: 1; position: relative; }
        .bible-iframe {
          width: 100%; height: 100%; border: none; background: #fff;
          display: block;
        }

        /* ── Scrollbars ── */
        .book-list::-webkit-scrollbar { width: 4px; }
        .book-list::-webkit-scrollbar-track { background: transparent; }
        .book-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .book-panel { position: fixed; top: 50px; left: 0; z-index: 30; height: calc(100% - 50px); }
          .book-panel.closed { width: 0; }
          .nav-label { display: none; }
          .ext-link span { display: none; }
        }
      `}</style>

      <div className="page">
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
            <Link href="/bible" className="nav-link active">
              <span>📜</span>
              <span className="nav-label">Bible</span>
            </Link>
            <Link href="/about" className="nav-link">
              <span>🌿</span>
              <span className="nav-label">About</span>
            </Link>
          </div>
        </nav>

        <div className="body">
          {/* ── Book Panel ── */}
          <div className={`book-panel${panelOpen ? "" : " closed"}`}>
            <div className="panel-header">
              <div className="panel-title">📚 Books of the Bible</div>
              <input
                className="search-input"
                type="text"
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); }}
              />
              {!searchQuery && (
                <div className="testament-tabs">
                  <button
                    className={`tab-btn${tab === "ot" ? " active" : ""}`}
                    onClick={() => setTab("ot")}
                  >
                    Old Testament
                  </button>
                  <button
                    className={`tab-btn${tab === "nt" ? " active" : ""}`}
                    onClick={() => setTab("nt")}
                  >
                    New Testament
                  </button>
                </div>
              )}
            </div>

            <div className="book-list">
              {filteredBooks.map((book) => (
                <div
                  key={book}
                  className={`book-item${book === selectedBook ? " selected" : ""}`}
                  onClick={() => selectBook(book)}
                >
                  {book}
                </div>
              ))}
            </div>
          </div>

          {/* ── Reader ── */}
          <div className="reader-area">
            <div className="reader-toolbar">
              <button
                className="toolbar-toggle"
                onClick={() => setPanelOpen((v) => !v)}
                title="Toggle book list"
              >
                {panelOpen ? "◀" : "▶"}
              </button>

              <div className="book-chapter-info">
                {selectedBook}
                <span className="chapter-badge">Chapter {selectedChapter}</span>
              </div>

              <div className="chapter-nav">
                <button className="nav-btn" onClick={prevChapter} title="Previous chapter">◀</button>

                <select
                  className="chapter-select"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(Number(e.target.value))}
                >
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch}>
                      Ch {ch}
                    </option>
                  ))}
                </select>

                <button className="nav-btn" onClick={nextChapter} title="Next chapter">▶</button>
              </div>

              <a
                href={`https://biblekjv.vercel.app/`}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link"
                title="Open in full KJV reader"
              >
                ↗ <span>Full reader</span>
              </a>
            </div>

            {/* Bible iframe */}
            <div className="iframe-wrapper">
              <iframe
                key={`${toSlug(selectedBook)}-${selectedChapter}`}
                className="bible-iframe"
                src={iframeSrc}
                title={`${selectedBook} Chapter ${selectedChapter} — KJV Bible`}
                sandbox="allow-scripts allow-same-origin allow-forms"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
