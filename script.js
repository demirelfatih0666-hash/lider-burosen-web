(async () => {
  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"
  );

  const { getFirestore, collection, onSnapshot } = await import(
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

  onSnapshot(collection(db, "icerikler"), (snapshot) => {
    const haberler = snapshot.docs
      .map((doc) => doc.data())
      .filter((haber) =>
        haber["Yayınlandı"] === true || haber.published === true
      )
      .sort((a, b) => {
        const tarihA =
          a["oluşturulduAt"]?.toMillis?.() ||
          a.createdAt?.toMillis?.() ||
          0;

        const tarihB =
          b["oluşturulduAt"]?.toMillis?.() ||
          b.createdAt?.toMillis?.() ||
          0;

        return tarihB - tarihA;
      });

    if (haberler.length === 0) {
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

    haberler.slice(0, 6).forEach((haber) => {
      const zaman =
        haber["oluşturulduAt"] ||
        haber.createdAt;

      const tarih = zaman?.toDate
        ? zaman.toDate().toLocaleDateString("tr-TR")
        : "";

      const tip = haber["Tip"] || haber.type || "Haber";
      const baslik = haber["Başlık"] || haber.title || "";
      const ozet =
        haber["Özet"] ||
        haber.summary ||
        haber["İçerik"] ||
        haber.content ||
        "";

      haberKutusu.innerHTML += `
        <article>
          <span>${tip}</span>
          <h3>${baslik}</h3>
          <p>${ozet}</p>
          <time>${tarih}</time>
        </article>
      `;
    });
  }, (error) => {
    console.error("Firebase bağlantı hatası:", error);

    haberKutusu.innerHTML = `
      <article>
        <span>Hata</span>
        <h3>Haberler yüklenemedi</h3>
        <p>${error.message}</p>
      </article>
    `;
  });
})();
