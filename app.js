const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = {
  sound: true,
  words: [
    { kk: "кейіпкер", ru: "персонаж" },
    { kk: "оқиға", ru: "событие" },
    { kk: "негізгі ой", ru: "главная мысль" },
    { kk: "тақырып", ru: "тема" },
    { kk: "мәтін", ru: "текст" },
    { kk: "зат есім", ru: "существительное" },
    { kk: "сын есім", ru: "прилагательное" },
    { kk: "етістік", ru: "глагол" },
    { kk: "сөйлем", ru: "предложение" }
  ],
  texts: [
    {
      id: "t1",
      title: "Оқиға",
      rows: [
        { b: "1", kk: "Кейіпкер мектепке келді.", ru: "Персонаж пришёл в школу." },
        { b: "2", kk: "Ол кітап оқыды.", ru: "Он читал книгу." },
        { b: "3", kk: "Негізгі ой түсінікті болды.", ru: "Главная мысль стала понятной." }
      ],
      q: { kk: "Кейіпкер не істеді?", opts: ["Кітап оқыды", "Ойнады"], ans: "Кітап оқыды" }
    },
    {
      id: "t2",
      title: "Сөйлем",
      rows: [
        { b: "1", kk: "Мен досымды көрдім.", ru: "Я увидел друга." },
        { b: "2", kk: "Ол сәлем айтты.", ru: "Он поздоровался." }
      ],
      q: { kk: "Кім сәлем айтты?", opts: ["Ол", "Мен"], ans: "Ол" }
    }
  ]
};

function say(text){
  if (!state.sound) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

function show(name){
  $$(".tab").forEach(b => b.classList.toggle("is-on", b.dataset.view === name));
  $$(".view").forEach(v => v.classList.toggle("is-on", v.id === `view-${name}`));
}

$$(".tab").forEach(b => b.addEventListener("click", () => show(b.dataset.view)));

let currentComic = "https://qazcomics.kz/kz";
$$("[data-comic]").forEach(btn => {
  btn.addEventListener("click", () => {
    $$("#view-comic [data-comic]").forEach(b => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    currentComic = btn.dataset.comic;
    $("#comicFrame").src = currentComic;
  });
});
$("#comicOpen").addEventListener("click", () => {
  window.open(currentComic, "_blank", "noopener,noreferrer");
});

$("#t-contrast").addEventListener("click", () => {
  const on = document.body.classList.toggle("contrast");
  $("#t-contrast").setAttribute("aria-pressed", String(on));
});
$("#t-font").addEventListener("click", () => {
  const on = document.body.classList.toggle("big");
  $("#t-font").setAttribute("aria-pressed", String(on));
});
$("#t-sound").addEventListener("click", () => {
  state.sound = !state.sound;
  $("#t-sound").classList.toggle("is-on", state.sound);
  $("#t-sound").setAttribute("aria-pressed", String(state.sound));
});

function renderWords(){
  const list = $("#wordList");
  list.innerHTML = "";
  state.words.forEach(w => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div>
        <div class="kk">${w.kk}</div>
        <div class="ru">${w.ru}</div>
      </div>
      <button class="btn ghost" type="button">Оқу</button>
    `;
    el.querySelector("button").addEventListener("click", () => say(w.kk));
    list.appendChild(el);
  });

  $("#b-readAll").addEventListener("click", () => {
    let i = 0;
    const seq = () => {
      if (i >= state.words.length) return;
      say(state.words[i].kk);
      i += 1;
      setTimeout(seq, 1100);
    };
    seq();
  });
}

function renderText(){
  const sel = $("#textSel");
  sel.innerHTML = "";
  state.texts.forEach(t => {
    const o = document.createElement("option");
    o.value = t.id;
    o.textContent = t.title;
    sel.appendChild(o);
  });

  const draw = (id) => {
    const t = state.texts.find(x => x.id === id);
    const box = $("#textBox");
    box.innerHTML = "";

    t.rows.forEach(r => {
      const row = document.createElement("div");
      row.className = "trow";
      row.innerHTML = `
        <div class="badge" aria-hidden="true">${r.b}</div>
        <div>
          <p class="tkk">${r.kk}</p>
          <p class="tru">${r.ru}</p>
        </div>
      `;
      row.addEventListener("click", () => say(r.kk));
      box.appendChild(row);
    });

    const q = document.createElement("div");
    q.className = "box";
    q.innerHTML = `
      <div class="kk">${t.q.kk}</div>
      <div class="ans"></div>
    `;
    const ans = q.querySelector(".ans");

    t.q.opts.forEach(opt => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "abtn";
      b.textContent = opt;
      b.addEventListener("click", () => {
        if (opt === t.q.ans) { b.classList.add("ok"); say("Жарайсың"); }
        else { say(t.q.ans); }
      });
      ans.appendChild(b);
    });

    box.appendChild(q);
  };

  sel.addEventListener("change", () => draw(sel.value));
  draw(state.texts[0].id);
}

function renderQuiz(){
  const quiz = $("#quiz");
  quiz.innerHTML = "";

  const items = [
    { q: "Кейіпкер кім?", opts: ["Батыр", "Құс"], ans: "Батыр" },
    { q: "Оқиға қайда?", opts: ["Далада", "Теңізде"], ans: "Далада" }
  ];

  items.forEach(it => {
    const row = document.createElement("div");
    row.className = "qrow";
    row.innerHTML = `<div class="kk">${it.q}</div><div class="pills"></div>`;
    const pills = row.querySelector(".pills");

    it.opts.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pill";
      b.textContent = o;
      b.addEventListener("click", () => {
        if (o === it.ans) { b.classList.add("ok"); say("Жарайсың"); }
        else { say(it.ans); }
      });
      pills.appendChild(b);
    });

    quiz.appendChild(row);
  });
}

function renderSentence(){
  const bank = $("#sentBank");
  const out = $("#sentOut");
  out.textContent = "";

  const words = ["Мен","ол","дос","батыр","келді","кетті","оқыды","айтты"];

  bank.innerHTML = "";
  words.forEach(w => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "wbtn";
    b.textContent = w;
    b.addEventListener("click", () => {
      out.textContent = (out.textContent ? out.textContent + " " : "") + w;
      say(w);
    });
    bank.appendChild(b);
  });

  $("#b-say").addEventListener("click", () => say(out.textContent || " "));
  $("#b-clear").addEventListener("click", () => { out.textContent = ""; });
}

function renderPick(){
  const box = $("#pickBox");

  const make = () => {
    box.innerHTML = "";
    const pool = state.words.slice(0, 8);
    const q = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter(x => x !== q).sort(() => Math.random() - 0.5).slice(0, 2);
    const opts = [q, ...others].sort(() => Math.random() - 0.5);

    const wrap = document.createElement("div");
    wrap.className = "box";
    wrap.innerHTML = `<div class="kk">Қайсысы: ${q.kk}?</div><div class="ans"></div>`;
    const ans = wrap.querySelector(".ans");

    opts.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "abtn";
      b.textContent = o.ru;
      b.addEventListener("click", () => {
        if (o === q) { b.classList.add("ok"); say("Жарайсың"); }
        else { say(q.kk); }
      });
      ans.appendChild(b);
    });

    box.appendChild(wrap);
  };

  $("#b-new").addEventListener("click", make);
  make();
}

renderWords();
renderText();
renderQuiz();
renderSentence();
renderPick();
show("comic");
