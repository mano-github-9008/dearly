"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
  Sparkles,
  PlayCircle,
  Layers3,
  Download,
} from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase";
import type { Course } from "@/lib/types";

const demo: Course[] = [
  {
    id: "demo-web",
    title: "The Modern Web, From Zero",
    description:
      "A practical introduction to how the web works, from your first HTML page to a live website.",
    category: "Development",
    cover_url: null,
    published: true,
    lessons: [
      {
        id: "l1",
        course_id: "demo-web",
        title: "Welcome to the web",
        description: "Your learning journey starts here.",
        video_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        position: 1,
        materials: [],
      },
    ],
  },
  {
    id: "demo-design",
    title: "Design Better Interfaces",
    description:
      "Learn the small, repeatable decisions that make digital products clearer and easier to use.",
    category: "Design",
    cover_url: null,
    published: true,
    lessons: [],
  },
  {
    id: "demo-data",
    title: "Data Skills That Stick",
    description:
      "Build confidence with data concepts, simple analysis, and useful everyday workflows.",
    category: "Data",
    cover_url: null,
    published: true,
    lessons: [],
  },
];
const palettes = ["lavender", "peach", "mint", "blue"];
export default function Home() {
  const [courses, setCourses] = useState<Course[]>(demo);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All topics");
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!supabaseConfigured()) return;
    try {
      const supabase = createClient();
      supabase
        .from("courses")
        .select("*, lessons(id)")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setCourses(data as Course[]);
            setConnected(true);
          }
        });
    } catch {}
  }, []);
  const categories = useMemo(
    () => [
      "All topics",
      ...Array.from(new Set(courses.map((c) => c.category || "General"))),
    ],
    [courses],
  );
  const filtered = courses.filter(
    (c) =>
      (category === "All topics" || (c.category || "General") === category) &&
      `${c.title} ${c.description || ""} ${c.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Curiosity has
            <br />a <span className="serif-accent">home.</span>
          </h1>
          <p className="hero-sub">
            Everything you need to learn, all in one place. Take your time. Find
            your rhythm. Grow your way.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#courses">
              Explore courses <ArrowRight size={16} />
            </a>
            <a className="text-link" href="/admin">
              Create a course <span>↗</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack">
              <i>♡</i>
              <i>✦</i>
              <i>✿</i>
              <i>♥</i>
            </div>
            <span>A little progress, a little more wonder.</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />

          <div className="art-card card-video">
            <div className="video-thumb">
              <div className="play-bubble">
                <PlayCircle size={28} />
              </div>
              <span className="video-tag">MADE WITH LOVE ♡</span>
            </div>

            <div className="art-card-bottom">
              <span className="mini-icon purple">
                <BookOpen size={15} />
              </span>
              <div>
                <b>A little something for you</b>
                <small>Video lesson · 12 min</small>
              </div>
              <span className="checkmark">♡</span>
            </div>
          </div>

          <div className="floating-note">
            <span className="note-icon">
              <Download size={17} />
            </span>
            <span>
              <b>Thoughtfully gathered</b>
              <small>Notes, little guides & more</small>
            </span>
          </div>

          <div className="floating-sticker">
            <span>GROW</span>
            <span>AT YOUR</span>
            <b>OWN PACE ♡</b>
          </div>

          <div className="art-sparkle">✳</div>
        </div>
      </section>
      <section className="stat-strip">
        <div>
          <span className="stat-number">01</span>
          <span>One little home for learning</span>
        </div>

        <div>
          <span className="stat-number">∞</span>
          <span>Endless room to grow</span>
        </div>

        <div>
          <span className="stat-number">♡</span>
          <span>Thoughtfully gathered for you</span>
        </div>
      </section>

      <section className="courses-section" id="courses">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A LITTLE LIBRARY ♡</div>
            <h2>
              Find something <span className="serif-accent">lovely.</span>
            </h2>
            <p>Every new idea is the beginning of something beautiful.</p>
          </div>
          <span className="course-count">
            {filtered.length.toString().padStart(2, "0")} LITTLE DISCOVERIES
          </span>
        </div>

        <div className="course-controls">
          <div className="searchbox">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a topic, a skill, a little inspiration…"
            />
          </div>

          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "filter active" : "filter"}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="course-grid">
          {filtered.map((course, i) => (
            <a
              href={`/course/${course.id}`}
              className="course-card"
              key={course.id}
            >
              <div className={`course-cover ${palettes[i % palettes.length]}`}>
                {course.cover_url ? (
                  <img src={course.cover_url} alt="" />
                ) : (
                  <>
                    <span className="cover-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="cover-shape shape-a" />
                    <div className="cover-shape shape-b" />
                    <span className="cover-symbol">
                      {["✳", "◒", "⌘", "✦"][i % 4]}
                    </span>
                    <span className="cover-caption">
                      {course.category || "GENERAL"} / LITTLE DISCOVERIES
                    </span>
                  </>
                )}
              </div>

              <div className="course-card-content">
                <div className="course-meta">
                  <span>{course.category || "A little bit of everything"}</span>
                  <span>
                    <Clock3 size={13} /> At your own pace
                  </span>
                </div>

                <h3>{course.title}</h3>

                <p>
                  {course.description ||
                    "A little collection of lessons to spark your curiosity and help you grow."}
                </p>

                <div className="course-card-bottom">
                  <span>
                    <BookOpen size={14} /> {course.lessons?.length || 0} lessons
                  </span>
                  <span className="round-arrow">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <Layers3 size={28} />
            <h3>Nothing here just yet ♡</h3>
            <p>
              Perhaps your next little discovery is waiting to be added. Try
              another search or create the first course in this library.
            </p>
            <a href="/admin" className="text-link">
              Visit your little creator studio ↗
            </a>
          </div>
        )}

        <div className="library-cta">
          <div className="cta-mark">
            <BookOpen size={23} />
          </div>

          <div>
            <h3>A little knowledge is worth sharing.</h3>
            <p>
              Turn your favorite videos, helpful links, and thoughtful notes
              into something others can learn from.
            </p>
          </div>

          <a className="button button-dark" href="/admin">
            Create something lovely <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="bottom-note">
        <span className="bottom-note-star">♡</span>
        <p>
          You don't have to learn it all today.
          <br />
          <em>Just keep a little room for wonder.</em>
        </p>
      </section>
      {!connected && (
        <div className="demo-note">
          Preview mode · Add Supabase credentials to load your live courses.
        </div>
      )}
    </main>
  );
}
