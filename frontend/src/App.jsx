import { useState, useEffect } from 'react'
import { getEtkinlikler, createHaber, createDuyuru, deleteEtkinlik } from './services/api'

function App() {
    const [etkinlikler, setEtkinlikler] = useState([])
    const [yukleniyor, setYukleniyor] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    // Yönetim paneli geçiş durumu (false = Kullanıcı Görünümü, true = Admin Görünümü)
    const [isAdmin, setIsAdmin] = useState(false)

    // Form State'leri
    const [konu, setKonu] = useState('')
    const [icerik, setIcerik] = useState('')
    const [tur, setTur] = useState('HABER') // HABER veya DUYURU
    const [haberLinki, setHaberLinki] = useState('')
    const [resim, setResim] = useState(null)
    const [tarih, setTarih] = useState('')

    useEffect(() => {
        veriGetir()
    }, [])

    const veriGetir = () => {
        setYukleniyor(true)
        getEtkinlikler()
            .then((data) => {
                setEtkinlikler(data)
                setYukleniyor(false)
            })
            .catch((error) => {
                console.error("Veriler çekilirken hata oluştu:", error)
                setYukleniyor(false)
            })
    }

    // Formu sıfırlama fonksiyonu
    const formuTemizle = () => {
        setKonu('')
        setIcerik('')
        setHaberLinki('')
        setResim(null)
        setTarih('')
    }

    // ➕ GERÇEK API: İçerik Ekleme İşlemi
    const handleEkle = async (e) => {
        e.preventDefault()

        // Spring Boot Controller'daki @RequestParam isimleriyle birebir eşleşmeli!
        const formData = new FormData()
        formData.append('konu', konu)
        formData.append('icerik', icerik)
        formData.append('tarih', tarih) // Java'da @RequestParam LocalDate tarih bekliyor

        try {
            setYukleniyor(true)

            if (tur === 'HABER') {
                formData.append('link', haberLinki) // Java'da @RequestParam String link bekliyor
                await createHaber(formData) // /api/etkinlikler/haber'e istek atar
            } else if (tur === 'DUYURU') {
                if (resim) {
                    formData.append('resim', resim) // Java'da MultipartFile resim bekliyor
                }
                await createDuyuru(formData) // /api/etkinlikler/duyuru'ya istek atar
            }

            veriGetir()
            formuTemizle()
            alert('İçerik başarıyla panoya eklendi!')
        } catch (error) {
            console.error("Ekleme sırasında hata oluştu:", error)
            alert("İçerik eklenirken bir hata meydana geldi. Konsolu kontrol et.")
            setYukleniyor(false)
        }
    }

    // 🗑️ GERÇEK API: İçerik Sileme İşlemi
    const handleSil = async (id) => {
        if(confirm('Bu içeriği panodan tamamen silmek istediğinize emin misiniz?')) {
            try {
                setYukleniyor(true)
                // Doğrudan yukarıda import ettiğimiz fonksiyonu çağırıyoruz
                await deleteEtkinlik(id)

                veriGetir()
                alert('İçerik başarıyla silindi!')
            } catch (error) {
                console.error("Silme işlemi başarısız:", error)
                alert("İçerik silinirken bir backend hatası oluştu.")
                setYukleniyor(false)
            }
        }
    }

    if (yukleniyor) {
        return (
            <div class={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-zinc-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
                <div class="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                </div>
            </div>
        )
    }

    return (
        <div class={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>

            {/* Geliştirilmiş Navbar */}
            <header class={`border-b sticky top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
                <nav class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a class="text-lg font-black tracking-wider text-indigo-600" href="#" onClick={() => setIsAdmin(false)}>
                        DİJİTAL<span class={darkMode ? 'text-zinc-400' : 'text-slate-600'}>PANO</span>
                    </a>

                    <div class="flex items-center gap-x-3">
                        {/* Yönetim Paneli / Akış Geçiş Butonu */}
                        <button
                            onClick={() => setIsAdmin(!isAdmin)}
                            class={`px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                                isAdmin
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200')
                            }`}
                        >
                            {isAdmin ? '📋 Akışı Göster' : '🛠️ Yönetim Paneli'}
                        </button>

                        {/* Tema Butonu */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            class={`p-2 rounded-lg border text-sm transition-all ${
                                darkMode ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Ana İçerik */}
            <main class="max-w-5xl mx-auto py-10 px-4">

                {/* ================= GÖRÜNÜM 1: KULLANICI AKIŞI ================= */}
                {!isAdmin && (
                    <>
                        {/* Başlık Alanı */}
                        <div class="text-center max-w-2xl mx-auto mb-10 px-4">
                            <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                                Şirket İçi Pano
                            </h1>
                            <p class={`text-sm md:text-base mt-2 max-w-prose mx-auto ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                                En son haberler ve önemli duyurular.
                            </p>
                        </div>

                        {/* Grid Kart Listesi */}
                        {etkinlikler.length === 0 ? (
                            <div class={`text-center border rounded-xl p-12 ${darkMode ? 'bg-zinc-800/50 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                                <p>Panoda listelenecek aktif bir içerik bulunamadı.</p>
                            </div>
                        ) : (
                            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {etkinlikler.map((etkinlik) => {
                                    const isHaber = etkinlik.hasOwnProperty('haberLinki');

                                    return (
                                        <div key={etkinlik.id} class={`flex flex-col border rounded-xl overflow-hidden transition-all duration-200 shadow-sm ${darkMode ? 'bg-zinc-800/40 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                            {!isHaber && etkinlik.resim && (
                                                <div class="h-44 bg-zinc-100 border-b border-inherit">
                                                    <img class="w-full h-full object-cover" src={`http://localhost:8080/uploads/${etkinlik.resim}`} alt="Duyuru" />
                                                </div>
                                            )}
                                            <div class="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                          <span class={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide mb-3 ${isHaber ? 'bg-cyan-500/10 text-cyan-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {isHaber ? 'HABER' : 'DUYURU'}
                          </span>
                                                    <h2 class="text-base font-bold mb-2 line-clamp-2">{etkinlik.konu}</h2>
                                                    <p class={`text-sm leading-relaxed mb-4 line-clamp-4 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{etkinlik.icerik}</p>
                                                </div>
                                                <div class="border-t border-inherit pt-3 mt-auto flex items-center justify-between text-xs">
                                                    <div>
                                                        {isHaber && etkinlik.haberLinki && (
                                                            <a href={etkinlik.haberLinki} target="_blank" rel="noreferrer" class="font-bold text-indigo-500 hover:text-indigo-600">Kaynağa Git →</a>
                                                        )}
                                                    </div>
                                                    <span class={darkMode ? 'text-zinc-500' : 'text-slate-400'}>{etkinlik.gecerlilikTarihi}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ================= GÖRÜNÜM 2: YÖNETİM PANELİ (ADMIN) ================= */}
                {isAdmin && (
                    <div class="space-y-10 animate-fadeIn">

                        {/* Panel Başlığı */}
                        <div>
                            <h1 class="text-2xl font-extrabold tracking-tight">Pano Yönetim Paneli</h1>
                            <p class={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Yeni içerik ekleyebilir veya mevcut içerikleri silebilirsiniz.</p>
                        </div>

                        {/* 1. Yeni İçerik Ekleme Formu */}
                        <div class={`p-6 border rounded-xl shadow-sm ${darkMode ? 'bg-zinc-800/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <h3 class="text-base font-bold mb-4 flex items-center gap-2">✨ Yeni İçerik Oluştur</h3>

                            <form onSubmit={handleEkle} class="space-y-4">
                                <div class="grid sm:grid-cols-2 gap-4">
                                    {/* Konu Başlığı */}
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-bold text-zinc-400">Konu / Başlık</label>
                                        <input type="text" required value={konu} onChange={(e) => setKonu(e.target.value)} class={`p-2 text-sm rounded-lg border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Örn: Sunucu Bakımı Hakkında" />
                                    </div>
                                    {/* Tür Seçimi */}
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-bold text-zinc-400">İçerik Türü</label>
                                        <select value={tur} onChange={(e) => setTur(e.target.value)} class={`p-2 text-sm rounded-lg border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'}`}>
                                            <option value="HABER">📰 Haber (Dış Bağlantılı Link İçerir)</option>
                                            <option value="DUYURU">📢 Duyuru (Görsel İçerebilir)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* İçerik Metni */}
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-bold text-zinc-400">Açıklama / İçerik</label>
                                    <textarea required rows="3" value={icerik} onChange={(e) => setIcerik(e.target.value)} class={`p-2 text-sm rounded-lg border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="İçerik detaylarını buraya yazın..."></textarea>
                                </div>

                                <div class="grid sm:grid-cols-2 gap-4">
                                    {/* Dinamik Alan: Haber Seçildiyse Link İster */}
                                    {tur === 'HABER' ? (
                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-cyan-500">Haber Linki (URL)</label>
                                            <input type="url" required value={haberLinki} onChange={(e) => setHaberLinki(e.target.value)} class={`p-2 text-sm rounded-lg border focus:outline-none focus:border-cyan-500 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="https://example.com/haber" />
                                        </div>
                                    ) : (
                                        /* Dinamik Alan: Duyuru Seçildiyse Resim İster */
                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-amber-500">Duyuru Görseli (Opsiyonel)</label>
                                            <input type="file" accept="image/*" onChange={(e) => setResim(e.target.files[0])} class={`text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold ${darkMode ? 'text-zinc-400 file:bg-zinc-700 file:text-zinc-200' : 'text-slate-500 file:bg-slate-200 file:text-slate-700'}`} />
                                        </div>
                                    )}

                                    {/* Geçerlilik Tarihi */}
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-bold text-zinc-400">Son Geçerlilik Tarihi</label>
                                        <input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} class={`p-2 text-sm rounded-lg border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                                    </div>
                                </div>

                                {/* Gönder Butonu */}
                                <div class="flex justify-end pt-2">
                                    <button type="submit" class="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                        ➕ Panoya Ekle
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 2. Mevcut İçeriklerin Yönetim Tablosu */}
                        <div class={`border rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-zinc-800/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <div class="p-4 border-b border-inherit">
                                <h3 class="text-sm font-bold">📋 Aktif İlan Listesi ({etkinlikler.length})</h3>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                    <tr class={darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}>
                                        <th class="p-3 font-semibold">Tür</th>
                                        <th class="p-3 font-semibold">Başlık</th>
                                        <th class="p-3 font-semibold hidden md:table-cell">Tarih</th>
                                        <th class="p-3 font-semibold text-right">İşlem</th>
                                    </tr>
                                    </thead>
                                    <tbody class="divide-y divide-inherit">
                                    {etkinlikler.map((item) => {
                                        const isHaber = item.hasOwnProperty('haberLinki');
                                        return (
                                            <tr key={item.id} class={darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-slate-50'}>
                                                <td class="p-3">
                            <span class={`px-1.5 py-0.5 rounded font-bold ${isHaber ? 'bg-cyan-500/10 text-cyan-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {isHaber ? 'HABER' : 'DUYURU'}
                            </span>
                                                </td>
                                                <td class="p-3 font-medium max-w-xs truncate">{item.konu}</td>
                                                <td class="p-3 text-zinc-400 hidden md:table-cell">{item.gecerlilikTarihi}</td>
                                                <td class="p-3 text-right">
                                                    <button
                                                        onClick={() => handleSil(item.id)}
                                                        class="px-2 py-1 font-bold text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded transition-all"
                                                    >
                                                        🗑️ Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

            </main>
        </div>
    )
}

export default App