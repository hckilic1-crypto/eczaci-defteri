export interface TopicStep { title: string; text: string }
export interface TopicHub {
  slug:string; title:string; short:string; eyebrow:string; mark:string; symbol:string;
  intro:string[]; steps:TopicStep[];
  posts:string[]; atlas:string[]; glossary:string[]; guides:string[];
}
export const topicHubs: TopicHub[] = [
  {
    "slug": "sac-ve-tirnak-sagligi",
    "title": "Saç ve Tırnak Sağlığı",
    "short": "Saç dökülmesi, kırılgan tırnaklar ve destek ürünlerini kanıtlarıyla değerlendirin.",
    "eyebrow": "SAÇ / TIRNAK / BESLENME",
    "mark": "01",
    "symbol": "01",
    "intro": [
      "Saç ve tırnak sorunlarının ortak noktası keratinize dokuları etkilemeleridir; ancak nedenleri ve tedavileri aynı değildir. Yaygın saç dökülmesi, folikül minyatürizasyonu, otoimmün saç kaybı, skarlı alopesi ve tırnak plağı kırılganlığı birbirinden ayrılmalıdır. Bu merkez tanıyı bir vitamin kutusuna indirgemeden, klinik örüntüden başlayarak okunacak biçimde düzenlenmiştir.",
      "Saç tarafında önce dökülmenin türü, ardından telogen effluvium ile androgenetik alopesi arasındaki farklar ve alopesi areata/skarlı süreçlerde erken değerlendirme önemlidir. Tırnak tarafında onikoşizi, onikoreksis, mantar, sedef ve melanonişi farklı mekanizmalarla ele alınır. Özellikle ağrılı inflamasyon veya yeni gelişen tek tırnak pigment bandında kozmetik öneri öncelik olmamalıdır.",
      "Demir, çinko ve biyotin eksikliklerinde saç veya tırnak belirtileri gelişebilir; fakat eksikliği olmayan bireyde yüksek doz takviyenin yararı otomatik olarak kanıtlanmış değildir. Son okumalarımız ürün etiketleri, laboratuvar girişimi ve insan çalışmalarının sınırlılıklarını bir araya getirir. Başlıklardan birini izleyebilir veya önce ana klinik incelemeyle başlayabilirsiniz."
    ],
    "steps": [
      {
        "title": "Önce bulgunun tipini ayır",
        "text": "Yaygın dökülme, yavaş seyrelme, fokal plak, inflamasyon ve tırnak distrofisi farklı tanı yollarına işaret eder."
      },
      {
        "title": "Doğru incelemeyi seç",
        "text": "Ferritin, hemogram, TSH ve diğer ölçümler ancak öykü ve muayeneyle ilişkilendirildiğinde anlam kazanır; şüpheli mantar veya pigment bandı ayrı inceleme gerektirir."
      },
      {
        "title": "Etkinlik ile güvenliliği birlikte değerlendir",
        "text": "Minoksidil ve diğer hastalığa yönelik tedavileri eksiklik replasmanından; biyotin/kolajen reklamını ise kontrollü insan kanıtından ayır."
      }
    ],
    "posts": [
      "sac-dokulmesi-nedenleri-turleri-klinik-degerlendirme",
      "telogen-effluvium-reaktif-sac-dokulmesi",
      "androgenetik-alopesi-kadin-erkek-tedavi-kanit",
      "alopesi-areata-skarlı-alopesi-kritik-belirtiler",
      "sac-dokulmesinde-kan-tahlilleri-ferritin-tsh-b12-cinko",
      "kirilan-tirnaklar-onikosizi-biyotin-klinik-nedenler",
      "tirnak-mantari-sedef-melanonişi-ayirici-tani",
      "sac-tirnak-takviyeleri-biyotin-kolajen-keratin-kanit",
      "biotin-b7-vitamini-sac-tirnak-laboratuvar-testleri",
      "demir-takviyesi-ferritin-ve-emilim",
      "cinko-takviyesi-ne-zaman-gerekli"
    ],
    "atlas": [
      "biotin",
      "demir",
      "cinko",
      "kollajen"
    ],
    "glossary": [
      "telogen-effluvium",
      "androgenetik-alopesi",
      "alopesi-areata",
      "sikatrisyel-alopesi",
      "trikoskopi",
      "folikul-minyaturizasyonu",
      "onikosizi",
      "onikoreksis",
      "onikoliz",
      "onikomikoz",
      "melanonisi",
      "biotin",
      "keratin",
      "keratinosit",
      "cinko",
      "demir-bisglisinat"
    ],
    "guides": [
      "biotin-mikrogram-tahlil",
      "demir-tuzlari",
      "cinko-elementel-bakir"
    ]
  },
  {
    "slug": "cilt-bariyeri-ve-dermokozmetik",
    "title": "Cilt Bariyeri ve Dermokozmetik",
    "short": "Cilt bariyeri, dermokozmetik aktifler, egzama, akne, lekeler ve güneşten korunma üzerine bağımsız bilimsel dosyalar.",
    "eyebrow": "CİLT / BİLEŞENLER / UYGULAMA",
    "mark": "02",
    "symbol": "02",
    "intro": [
      "Cilt bariyerinin merkezinde korneositler, seramidler, kolesterol, serbest yağ asitleri ve doğal nemlendirici faktörler birlikte çalışır. Bariyer desteği; yalnız yoğun bir krem kullanmaktan ibaret değildir. Kuruluk, irritan temas, inflamatuvar egzama ve rozasea farklı sorunlardır. Bu dosya önce epidermisin nasıl çalıştığını, ardından cildin hangi koşulda hangi bakımdan yarar sağlayabileceğini açıklar.",
      "Seramidler, gliserin, pantenol, hyaluronik asit ve niasinamid gibi bileşenleri kullanırken kimyasal işlevleri önemlidir. Retinoidler, azelaik asit, benzoil peroksit ve AHA/BHA ise akne, pigmentasyon veya yüzey dokusu gibi daha özgül hedeflerde değerlendirilir. Bunların bazıları ruhsatlı ilaç, bazıları kozmetik bileşendir; etki mekanizması ve kanıtı birbirinden ayrılmalıdır.",
      "Güneş koruyucu seçimi bütün merkezin ortak bağlantı noktasıdır: SPF, UVA koruması ve pigmentasyon için görünür ışık aynı göstergeyle ölçülmez. Özellikle melazmada demir oksit içeren renkli koruyucular yararlı olabilir. Okuma sırası, kullanım amacı, formülasyon, tolerans ve kontrendikasyonları birlikte görmeyi sağlar."
    ],
    "steps": [
      {
        "title": "Önce dokuyu ve tanıyı tanı",
        "text": "Stratum corneum, lipit lamelleri, TEWL ve NMF işlevlerini öğren; kuruluk ile egzama, alerji veya rozaseayı aynı durum sanma."
      },
      {
        "title": "Etkiyi ve mekanizmayı eşleştir",
        "text": "Nemlendirici, niasinamid, retinoid, azelaik asit, BPO ve AHA/BHA arasındaki farmakolojik/kozmetik farkları yararlarına göre değerlendir."
      },
      {
        "title": "Uygulamayı kişiselleştir",
        "text": "Ürün yüzdesi, formülasyon, gebelik/iritasyon riski, günlük bakım ve SPF–UVA–görünür ışık korumasını aynı rutinde dengele."
      }
    ],
    "posts": [
      "cilt-bariyeri-bozulmasi-seramidler-dermatit-bakim",
      "nemlendirici-secimi-gliserin-ure-petrolatum-hyaluronik-asit",
      "seramidler-cilt-bariyeri-ve-nemlendirme",
      "atopik-dermatit-egzama-cilt-bariyeri-topikal-tedaviler",
      "irritan-alerjik-kontakt-dermatit-yama-testi",
      "rozasea-hassas-cilt-kizariklik-azelaik-asit-ivermektin",
      "niasinamid-yuzde-5-mi-yuzde-10-mu",
      "c-vitamini-serumu-l-askorbik-asit-fotoyaslanma",
      "retinoidler-retinol-retinal-tretinoin-adapalen-farklari",
      "akne-tedavisi-retinoid-benzoil-peroksit-salisilik-asit",
      "azelaik-asit-akne-leke-kizariklik",
      "aha-bha-peeling-glikolik-salisilik-asit-uygulama",
      "melazma-leke-hiperpigmentasyon-spf-azelaik-traneksamik",
      "spf-30-ve-spf-50-arasindaki-fark-nedir"
    ],
    "atlas": [
      "seramid",
      "hyaluronik-asit",
      "pantenol",
      "niasinamid",
      "retinol",
      "retinal",
      "azelaik-asit",
      "salisilik-asit",
      "glikolik-asit",
      "traneksamik-asit",
      "gunes-koruyucu"
    ],
    "glossary": [
      "cilt-bariyeri",
      "cilt-ph",
      "keratinosit",
      "retinol",
      "genis-spektrum-gunes-korumasi",
      "alerjik-kontakt-dermatit",
      "filaggrin",
      "dogal-nemlendirici-faktor",
      "okluzif",
      "retinaldehit",
      "melanozom-transferi",
      "yama-testi",
      "parmak-ucu-birimi",
      "fotoyaslanma",
      "komedon",
      "glukokortikoid-reseptoru",
      "il-4-il-13",
      "cilt-fototipi",
      "demir-oksit-renkli-spf",
      "seramid-lamelleri",
      "aha-exfoliasyon"
    ],
    "guides": [
      "niasinamid-yuzde",
      "retinol-ve-retinal",
      "spf-uva-uvb"
    ]
  },
  {
    "slug": "bagirsak-mikrobiyotasi",
    "title": "Bağırsak Mikrobiyotası",
    "short": "Probiyotik suşları, prebiyotikler, postbiyotikler ve sindirim sistemi kanıtlarını inceleyin.",
    "eyebrow": "MİKROBİYOTA / SUŞ / KLİNİK KANIT",
    "mark": "03",
    "symbol": "03",
    "intro": [
      "Bağırsak mikrobiyotası tek bir 'iyi bakteri' listesinden ibaret değildir. Bağırsakta bulunan mikroorganizmaların bileşimi ve işlevi; beslenme, ilaçlar, hastalıklar ve birçok çevresel faktörle ilişkilidir. Bir mikrobiyota değişikliğinin bir hastalıkla birlikte gözlenmesi, her zaman hastalığın nedeni olduğunu kanıtlamaz.",
      "Probiyotik ürünlerinde cins, tür ve özellikle suş kimliği önem taşır. Çalışmanın bir suşta gösterdiği sonuç diğer suşlara otomatik aktarılmaz. Prebiyotik, probiyotik, sinbiyotik ve postbiyotik de eş anlamlı değildir; etiketlerinde farklı nitelikler aranır.",
      "Rehberlerin ana sorusu 'kaç milyar CFU' değil, hangi canlı mikroorganizmanın, hangi koşulda, hangi sonlanım için incelendiğidir. İmmünsüpresyon ve kritik hastalık gibi özel durumlarda güvenlilik ayrıca değerlendirilmelidir."
    ],
    "steps": [
      {
        "title": "Kavramları netleştir",
        "text": "Mikrobiyota, mikrobiyom, probiyotik, prebiyotik ve postbiyotiğin farklarını öğren."
      },
      {
        "title": "Suş bazlı kanıtı oku",
        "text": "Bir klinik sonucun belirli tür ve suşa ait olabileceğini; çok suşlu etiketin tek başına yeterli olmadığını kontrol et."
      },
      {
        "title": "CFU ve güvenliliği sorgula",
        "text": "Miktarın hangi tarihte geçerli olduğunu ve özel hasta gruplarındaki riskleri öğren."
      }
    ],
    "posts": [
      "probiyotik-secerken-cfu-mu-sus-mu",
      "saccharomyces-boulardii-ne-ise-yarar",
      "sinbiyotik-ve-postbiyotik-nedir",
      "nane-yagi-ibs-sindirim-konforu"
    ],
    "atlas": [
      "probiyotik",
      "prebiyotik",
      "psyllium",
      "nane-yagi"
    ],
    "glossary": [
      "mikrobiyota",
      "mikrobiyom",
      "probiyotik",
      "prebiyotik",
      "probiyotik-sus",
      "saccharomyces-boulardii"
    ],
    "guides": [
      "probiyotik-cfu-sus"
    ]
  },
  {
    "slug": "vitamin-ve-mineraller",
    "title": "Vitamin ve Mineraller",
    "short": "Günlük alım referansları, eksiklik, biyoyararlanım ve elementel miktarı doğru okuyun.",
    "eyebrow": "VİTAMİNLER / MİNERALLER / GEREKSİNİM",
    "mark": "04",
    "symbol": "04",
    "intro": [
      "Vitamin ve minerallerde üç farklı sayı sıklıkla birbirine karıştırılır: normal beslenme için referans alım, bir takviyenin günlük porsiyonu ve kanıtlanmış eksiklikte kullanılan tedavi dozu. Bunların amaçları farklıdır. Bir sayının 'yüksek' ya da 'düşük' görünmesi tek başına klinik karar oluşturmaz.",
      "Demir, çinko ve magnezyum gibi minerallerde tuzun kütlesiyle elementel mineralin miktarını ayırt etmek gerekir. D vitamininde IU–µg dönüşümü, B12'nin farklı formları ve K2'nin menakinon tipleri de etiket karşılaştırmasını etkiler. Laboratuvar değerleri, emilim sorunları, böbrek fonksiyonu ve ilaçlar doz kararına dahil olabilir.",
      "Buradaki dosyalar sağlıklı bireylere yönelik beslenme referanslarını, özel klinik durumlarda gereken değerlendirmeden ayrı tutar. Eksiklik veya toksisite belirtileri olan bireylerde kişiye özel tanı ve tedavi gereklidir."
    ],
    "steps": [
      {
        "title": "Gereksinimi tanımla",
        "text": "Beslenme referansı, üst güvenli alım ve eksiklik tedavisinin farklı kavramlar olduğunu ayır."
      },
      {
        "title": "Formu ve birimi oku",
        "text": "µg–mg–IU dönüşümlerini, elementel mineral miktarını ve porsiyon başına değeri karşılaştır."
      },
      {
        "title": "Hasta bağlamına yerleştir",
        "text": "Malabsorpsiyon, ilaçlar, böbrek hastalığı veya gebelik gibi durumlardaki özel değerlendirmeyi unutma."
      }
    ],
    "posts": [
      "b12-vitamini-eksikligi-ve-takviye-formlari",
      "d3-ve-k2-vitamini-birlikte-alinmali-mi-bilimsel-kanitlar-ne-soeylueyor",
      "magnezyum-sitrat-mi-bisglisinat-mi-etikette-asil-neye-bakmali",
      "demir-takviyesi-ferritin-ve-emilim",
      "c-vitamini-bagisiklik-soguk-alginligi-ve-takviye",
      "cinko-takviyesi-ne-zaman-gerekli"
    ],
    "atlas": [
      "b12-vitamini",
      "d-vitamini",
      "k2-vitamini",
      "magnezyum",
      "demir",
      "cinko",
      "c-vitamini",
      "biotin"
    ],
    "glossary": [
      "25-oh-d-vitamini",
      "b12-vitamini",
      "d2-vitamini",
      "k2-vitamini",
      "ferroz-demir",
      "cinko",
      "biotin"
    ],
    "guides": [
      "iu-ve-mikrogram",
      "k2-mk7-mk4",
      "magnezyum-elementel-miktar",
      "demir-tuzlari",
      "cinko-elementel-bakir"
    ]
  },
  {
    "slug": "takviye-guvenliligi",
    "title": "Takviye Güvenliliği",
    "short": "İlaç etkileşimleri, yüksek doz riskleri, standardizasyon ve bilimsel kanıtın sınırları.",
    "eyebrow": "GÜVENLİLİK / ETKİLEŞİM / KANIT",
    "mark": "05",
    "symbol": "05",
    "intro": [
      "Takviye edici gıdalar da farmakolojik etki, doz bağımlı yan etki veya ilaçlarla etkileşim gösterebilir. 'Doğal' ifadesi, bir bileşenin tüm kullanıcılarda güvenli olduğu anlamına gelmez. Özellikle birden fazla ürünün aynı anda alınması, günlük toplam maruziyeti hesaplamayı güçleştirir.",
      "Bitkisel ekstrelerde DER, standardizasyon yüzdesi ve etken marker bilgisi birbirinden ayrılmalıdır. Bir bileşenin hücre veya hayvan çalışmalarında belirli etki göstermesi de insanlarda kanıtlanmış klinik yarar sunduğu anlamına gelmez. Araştırmanın popülasyonu, doz, süre ve sonlanımı birlikte değerlendirilir.",
      "Bu merkez, ürün seçimi yapmadan önce etkileşim potansiyelini, özel risk gruplarını, laboratuvar girişimini ve araştırma kalitesini kontrol etmek için hazırlanmıştır. Özellikle antikoagülan, psikiyatrik ilaç veya çoklu tedavi alan hastalarda bütün ürünlerin kaydı önemlidir."
    ],
    "steps": [
      {
        "title": "İddianın kanıtını sorgula",
        "text": "Hücre, hayvan ve insan çalışma sonuçlarının farklı kanıt düzeyleri olduğunu değerlendir."
      },
      {
        "title": "Toplam dozu ve etkileşimleri kontrol et",
        "text": "Birden fazla ürünün içeriğini ve reçeteli ilaçlarla olası etkileşimlerini birlikte incele."
      },
      {
        "title": "Özel grupları ayır",
        "text": "Gebelik, organ yetmezliği, antikoagülan kullanımı veya yaklaşan laboratuvar testi gibi durumlara dikkat et."
      }
    ],
    "posts": [
      "birden-fazla-takviyeyi-birlikte-kullanmak",
      "ilac-etkilesimleri-her-uyari-ayni-mi",
      "bilimsel-calismalari-yorumlarken-kanit-duzeyi",
      "ashwagandha-stres-uyku-ve-guvenlilik",
      "biyoyararlanim-nedir-takviyelerde-emilim-ve-etki",
      "biotin-b7-vitamini-sac-tirnak-laboratuvar-testleri"
    ],
    "atlas": [
      "ashwagandha",
      "5-htp",
      "ginseng",
      "omega-3",
      "k2-vitamini",
      "biotin"
    ],
    "glossary": [
      "ilac-etkilesimi",
      "farmakokinetik-etkilesim",
      "farmakodinamik-etkilesim",
      "biyoyararlanim",
      "metabolizma"
    ],
    "guides": [
      "ekstre-standardizasyonu",
      "biotin-mikrogram-tahlil",
      "k2-mk7-mk4",
      "balik-yagi-ve-epa-dha"
    ]
  }
] as TopicHub[];
export type HubContentKind = 'posts'|'atlas'|'glossary'|'guides';
export function hubsForContent(kind: HubContentKind, slug:string): TopicHub[] {
  return topicHubs.filter(hub => hub[kind].includes(slug));
}
