(async () => {
  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"
  );

  const { getFirestore, collection, query, where, orderBy, onSnapshot } =
    await import(
      "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"
    );

  const firebaseConfig = {
    apiKey: "AIzaSyCyDO-VfmmLRrc1KS8SaVcaIR94pnc5M4g",
    authDomain: "lider-burosen-web.firebaseapp.com",
    projectId: "lider-burosen-web",
    storageBucket: "lider-burosen-web.firebasestorage.app",
    messagingSenderId: "883869377747",
    appId: "1:883869377747:web:90AE255db06aad942FA026"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const haberKutusu = document.querySelector("#haberler .cards");

  if (!haberKutusu) return;

  const q = query(
    collection(db, "icerikler"),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      haberKutusu.innerHTML = `
        <article>
          <span>Bilgi</span>
          <h3>Henüz yayımlanmış içerik yok</h3>
          <p>Yeni haber ve duyurular burada yayımlanacaktır.</p>
        </article>
      `;
      return;
    }

    haberKutusu.innerHTML = "";

    snapshot.docs.slice(0, 6).forEach((doc) => {
      const haber = doc.data();

      const tarih = haber.createdAt?.toDate
        ? haber.createdAt.toDate().toLocaleDateString("tr-TR")
        : "";

      haberKutusu.innerHTML += `
        <article>
          <span>${haber.type === "duyuru" ? "Duyuru" : "Haber"}</span>
          <h3>${haber.title || ""}</h3>
          <p>${haber.summary || haber.content || ""}</p>
          <time>${tarih}</time>
        </article>
      `;
    });
  });
})();
