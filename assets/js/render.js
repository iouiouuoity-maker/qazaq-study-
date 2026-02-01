function renderLessons(){
  const box=document.getElementById("lessonList");
  box.innerHTML="";
  LESSONS.filter(l=>STATE.grade==="all"||l.grade===STATE.grade)
    .forEach(l=>{
      const d=document.createElement("div");
      d.textContent=l.title;
      d.onclick=()=>openLesson(l.id);
      box.appendChild(d);
    });
}

function openLesson(id){
  const l=LESSONS.find(x=>x.id===id);
  STATE.lessonId=id;
  document.getElementById("lessonTitle").textContent=l.title;
  document.getElementById("m-topic").textContent=l.topic;

  const t=document.getElementById("lessonText");
  t.innerHTML="";
  l.text.forEach(s=>{
    const p=document.createElement("div");
    p.textContent=s;
    p.onclick=()=>speak(s);
    t.appendChild(p);
  });

  const b=document.getElementById("wordBank");
  b.innerHTML="";
  l.bank.forEach(w=>{
    const btn=document.createElement("button");
    btn.textContent=w;
    btn.onclick=()=>addWord(w);
    b.appendChild(btn);
  });

  renderQuiz(l.quiz);
  renderPick(l.pick);
}

function addWord(w){
  const o=document.getElementById("sentenceOut");
  o.textContent+=(o.textContent?" ":"")+w;
  speak(w);
}

function renderQuiz(q){
  const box=document.getElementById("quiz");
  box.innerHTML="";
  q.forEach(x=>{
    x.a.forEach((a,i)=>{
      const b=document.createElement("button");
      b.textContent=a;
      b.onclick=()=>i===x.ok?speak("Жарайсың"):speak(x.a[x.ok]);
      box.appendChild(b);
    });
  });
}

function renderPick(p){
  const box=document.getElementById("pick");
  box.innerHTML="";
  p.a.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a;
    b.onclick=()=>i===p.ok?speak("Жарайсың"):speak(p.a[p.ok]);
    box.appendChild(b);
  });
}
