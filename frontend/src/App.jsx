import { useEffect, useMemo, useState } from 'react'
import {
    createDuyuru,
    createHaber,
    deleteEtkinlik,
    getEtkinlikler,
    updateDuyuru,
    updateHaber
} from './services/api'

const EKRANLAR = {
    KULLANICI_HABER: 'KULLANICI_HABER',
    KULLANICI_DUYURU: 'KULLANICI_DUYURU',
    ADMIN_HABER: 'ADMIN_HABER',
    ADMIN_DUYURU: 'ADMIN_DUYURU'
}

const ROLLER = {
    KULLANICI: 'KULLANICI',
    ADMIN: 'ADMIN'
}

const isHaberTipi = (etkinlik) => Object.prototype.hasOwnProperty.call(etkinlik, 'haberLinki')

function App() {
    const [etkinlikler, setEtkinlikler] = useState([])
    const [yukleniyor, setYukleniyor] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    const [anaEkran, setAnaEkran] = useState(EKRANLAR.KULLANICI_HABER)
    const [aktifRol, setAktifRol] = useState(ROLLER.KULLANICI)

    const [duzenlenenId, setDuzenlenenId] = useState(null)
    const [konu, setKonu] = useState('')
    const [icerik, setIcerik] = useState('')
    const [haberLinki, setHaberLinki] = useState('')
    const [resim, setResim] = useState(null)
    const [tarih, setTarih] = useState('')

    const [seciliHaber, setSeciliHaber] = useState(null)

    const haberler = useMemo(() => etkinlikler.filter((item) => isHaberTipi(item)), [etkinlikler])
    const duyurular = useMemo(() => etkinlikler.filter((item) => !isHaberTipi(item)), [etkinlikler])
    const adminHaberEkrani = anaEkran === EKRANLAR.ADMIN_HABER
    const adminDuyuruEkrani = anaEkran === EKRANLAR.ADMIN_DUYURU
    const adminIcerikler = adminHaberEkrani ? haberler : duyurular

    const veriGetir = async () => {
        setYukleniyor(true)
        try {
            const data = await getEtkinlikler()
            setEtkinlikler(data)
        } catch (error) {
            console.error('Veriler çekilirken hata oluştu:', error)
            alert('Veriler yüklenirken bir hata oluştu.')
        } finally {
            setYukleniyor(false)
        }
    }

    useEffect(() => {
        veriGetir()
    }, [])

    const formuTemizle = () => {
        setDuzenlenenId(null)
        setKonu('')
        setIcerik('')
        setHaberLinki('')
        setResim(null)
        setTarih('')
    }

    const adminEkraniDegistir = (ekran) => {
        setAnaEkran(ekran)
        formuTemizle()
    }

    const rolDegistir = (rol) => {
        setAktifRol(rol)

        if (rol === ROLLER.ADMIN && (anaEkran === EKRANLAR.KULLANICI_HABER || anaEkran === EKRANLAR.KULLANICI_DUYURU)) {
            adminEkraniDegistir(EKRANLAR.ADMIN_HABER)
        }

        if (rol === ROLLER.KULLANICI && (anaEkran === EKRANLAR.ADMIN_HABER || anaEkran === EKRANLAR.ADMIN_DUYURU)) {
            setAnaEkran(EKRANLAR.KULLANICI_HABER)
            formuTemizle()
        }
    }

    const duzenlemeyiYukle = (item) => {
        setDuzenlenenId(item.id)
        setKonu(item.konu ?? '')
        setIcerik(item.icerik ?? '')
        setTarih(item.gecerlilikTarihi ?? '')
        setResim(null)
        if (isHaberTipi(item)) {
            setAnaEkran(EKRANLAR.ADMIN_HABER)
            setHaberLinki(item.haberLinki ?? '')
        } else {
            setAnaEkran(EKRANLAR.ADMIN_DUYURU)
            setHaberLinki('')
        }
    }

    const handleKaydet = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('konu', konu)
        formData.append('icerik', icerik)
        formData.append('tarih', tarih)

        try {
            setYukleniyor(true)

            if (adminHaberEkrani) {
                formData.append('link', haberLinki)
                if (duzenlenenId) {
                    await updateHaber(duzenlenenId, formData)
                } else {
                    await createHaber(formData)
                }
            } else {
                if (resim) {
                    formData.append('resim', resim)
                }
                if (duzenlenenId) {
                    await updateDuyuru(duzenlenenId, formData)
                } else {
                    await createDuyuru(formData)
                }
            }

            await veriGetir()
            formuTemizle()
            alert(duzenlenenId ? 'İçerik güncellendi.' : 'İçerik eklendi.')
        } catch (error) {
            console.error('Kaydetme sırasında hata oluştu:', error)
            alert('Kaydetme işleminde hata oluştu.')
            setYukleniyor(false)
        }
    }

    const handleSil = async (id) => {
        if (!confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
            return
        }

        try {
            setYukleniyor(true)
            await deleteEtkinlik(id)
            await veriGetir()
            if (duzenlenenId === id) {
                formuTemizle()
            }
            alert('İçerik silindi.')
        } catch (error) {
            console.error('Silme işlemi başarısız:', error)
            alert('Silme sırasında hata oluştu.')
            setYukleniyor(false)
        }
    }

    const inputSinifi = `p-2 text-sm rounded-lg border focus:outline-none ${
        darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
    }`

    if (yukleniyor) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-zinc-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
                    <span className="sr-only">Yükleniyor...</span>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
            <header className={`border-b sticky top-0 z-40 transition-colors duration-300 ${darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
                <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-lg font-black tracking-wider text-indigo-600">
                        DİJİTAL<span className={darkMode ? 'text-zinc-400' : 'text-slate-600'}>PANO</span>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <button
                            onClick={() => rolDegistir(ROLLER.KULLANICI)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                aktifRol === ROLLER.KULLANICI
                                    ? 'bg-indigo-600 text-white'
                                    : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                            }`}
                        >
                            Kullanıcı Paneli
                        </button>
                        <button
                            onClick={() => rolDegistir(ROLLER.ADMIN)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                aktifRol === ROLLER.ADMIN
                                    ? 'bg-indigo-600 text-white'
                                    : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                            }`}
                        >
                            Admin Paneli
                        </button>

                        {aktifRol === ROLLER.KULLANICI ? (
                            <>
                                <button
                                    onClick={() => setAnaEkran(EKRANLAR.KULLANICI_HABER)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                        anaEkran === EKRANLAR.KULLANICI_HABER
                                            ? 'bg-indigo-600 text-white'
                                            : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                                    }`}
                                >
                                    Haberler Listeleme
                                </button>
                                <button
                                    onClick={() => setAnaEkran(EKRANLAR.KULLANICI_DUYURU)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                        anaEkran === EKRANLAR.KULLANICI_DUYURU
                                            ? 'bg-indigo-600 text-white'
                                            : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                                    }`}
                                >
                                    Duyurular Listeleme
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => adminEkraniDegistir(EKRANLAR.ADMIN_HABER)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                        anaEkran === EKRANLAR.ADMIN_HABER
                                            ? 'bg-indigo-600 text-white'
                                            : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                                    }`}
                                >
                                    Haber Giriş/Güncelleme/Silme
                                </button>
                                <button
                                    onClick={() => adminEkraniDegistir(EKRANLAR.ADMIN_DUYURU)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                        anaEkran === EKRANLAR.ADMIN_DUYURU
                                            ? 'bg-indigo-600 text-white'
                                            : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                                    }`}
                                >
                                    Duyuru Giriş/Güncelleme/Silme
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg border text-sm ${darkMode ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            <main className="max-w-6xl mx-auto py-8 px-4">
                {anaEkran === EKRANLAR.KULLANICI_HABER && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-extrabold">Kullanıcı - Haberler Listeleme</h1>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {haberler.map((haber) => (
                                <button
                                    key={haber.id}
                                    onClick={() => setSeciliHaber(haber)}
                                    className={`text-left p-5 border rounded-xl transition-all ${darkMode ? 'bg-zinc-800/40 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                >
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mb-3 bg-cyan-500/10 text-cyan-500">
                                        HABER
                                    </span>
                                    <h2 className="font-bold mb-2 line-clamp-2">{haber.konu}</h2>
                                    <p className={`text-sm line-clamp-3 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{haber.icerik}</p>
                                    <div className={`mt-3 text-xs ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{haber.gecerlilikTarihi}</div>
                                </button>
                            ))}
                            {haberler.length === 0 && (
                                <div className={`col-span-full text-center border rounded-xl p-10 ${darkMode ? 'bg-zinc-800/50 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    Listelenecek haber bulunamadı.
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {anaEkran === EKRANLAR.KULLANICI_DUYURU && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-extrabold">Kullanıcı - Duyurular Listeleme</h1>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {duyurular.map((duyuru) => (
                                <div key={duyuru.id} className={`border rounded-xl overflow-hidden ${darkMode ? 'bg-zinc-800/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
                                    {duyuru.resim && (
                                        <div className="h-44 bg-zinc-100">
                                            <img className="w-full h-full object-cover" src={`http://localhost:8080/uploads/${duyuru.resim}`} alt={duyuru.konu} />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mb-3 bg-amber-500/10 text-amber-500">
                                            DUYURU
                                        </span>
                                        <h2 className="font-bold mb-2">{duyuru.konu}</h2>
                                        <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{duyuru.icerik}</p>
                                        <div className={`mt-3 text-xs ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{duyuru.gecerlilikTarihi}</div>
                                    </div>
                                </div>
                            ))}
                            {duyurular.length === 0 && (
                                <div className={`col-span-full text-center border rounded-xl p-10 ${darkMode ? 'bg-zinc-800/50 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    Listelenecek duyuru bulunamadı.
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {(adminHaberEkrani || adminDuyuruEkrani) && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-extrabold">
                                {adminHaberEkrani ? 'Admin - Haber Giriş/Güncelleme/Silme' : 'Admin - Duyuru Giriş/Güncelleme/Silme'}
                            </h1>
                        </div>

                        <div className={`p-6 border rounded-xl shadow-sm ${darkMode ? 'bg-zinc-800/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <h3 className="text-base font-bold mb-4">
                                {adminHaberEkrani ? 'Haber Yönetimi' : 'Duyuru Yönetimi'} - {duzenlenenId ? 'Güncelleme' : 'Yeni Kayıt'}
                            </h3>

                            <form onSubmit={handleKaydet} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-zinc-400">Konu / Başlık</label>
                                        <input type="text" required value={konu} onChange={(e) => setKonu(e.target.value)} className={inputSinifi} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-zinc-400">Son Geçerlilik Tarihi</label>
                                        <input type="date" required value={tarih} onChange={(e) => setTarih(e.target.value)} className={inputSinifi} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-zinc-400">İçerik</label>
                                    <textarea required rows="4" value={icerik} onChange={(e) => setIcerik(e.target.value)} className={inputSinifi} />
                                </div>

                                {adminHaberEkrani ? (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-cyan-500">Haber Linki</label>
                                        <input type="url" required value={haberLinki} onChange={(e) => setHaberLinki(e.target.value)} className={inputSinifi} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-amber-500">Duyuru Görseli (Opsiyonel)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setResim(e.target.files?.[0] ?? null)}
                                            className={`text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold ${darkMode ? 'text-zinc-400 file:bg-zinc-700 file:text-zinc-200' : 'text-slate-500 file:bg-slate-200 file:text-slate-700'}`}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    {duzenlenenId && (
                                        <button
                                            type="button"
                                            onClick={formuTemizle}
                                            className={`px-4 py-2 text-sm font-bold rounded-lg ${darkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-slate-200 text-slate-700'}`}
                                        >
                                            İptal
                                        </button>
                                    )}
                                    <button type="submit" className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        {duzenlenenId ? 'Güncellemeyi Kaydet' : 'Yeni Kayıt Ekle'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className={`border rounded-xl overflow-hidden ${darkMode ? 'bg-zinc-800/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <div className="p-4 border-b border-inherit">
                                <h3 className="text-sm font-bold">
                                    {adminHaberEkrani ? 'Haber Listesi' : 'Duyuru Listesi'} ({adminIcerikler.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className={darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}>
                                            <th className="p-3 font-semibold">Başlık</th>
                                            <th className="p-3 font-semibold hidden md:table-cell">Tarih</th>
                                            <th className="p-3 font-semibold text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-inherit">
                                        {adminIcerikler.map((item) => (
                                            <tr key={item.id} className={darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-slate-50'}>
                                                <td className="p-3 font-medium max-w-xs truncate">{item.konu}</td>
                                                <td className="p-3 hidden md:table-cell text-zinc-400">{item.gecerlilikTarihi}</td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => duzenlemeyiYukle(item)}
                                                        className="px-2 py-1 font-bold text-indigo-500 hover:text-indigo-700 hover:bg-indigo-500/10 rounded transition-all"
                                                    >
                                                        Güncelle
                                                    </button>
                                                    <button
                                                        onClick={() => handleSil(item.id)}
                                                        className="px-2 py-1 font-bold text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded transition-all"
                                                    >
                                                        Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {adminIcerikler.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-5 text-center text-slate-400">
                                                    Bu bölüm için içerik bulunamadı.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {seciliHaber && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className={`w-full max-w-2xl border rounded-xl p-6 ${darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-xl font-bold">{seciliHaber.konu}</h2>
                            <button onClick={() => setSeciliHaber(null)} className="text-sm font-bold text-red-500 hover:text-red-600">
                                Kapat
                            </button>
                        </div>
                        <p className={`mt-4 text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-slate-600'}`}>{seciliHaber.icerik}</p>
                        <div className={`mt-4 text-xs ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{seciliHaber.gecerlilikTarihi}</div>
                        {seciliHaber.haberLinki && (
                            <a
                                href={seciliHaber.haberLinki}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-4 text-sm font-bold text-indigo-500 hover:text-indigo-600"
                            >
                                Kaynağa Git →
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
