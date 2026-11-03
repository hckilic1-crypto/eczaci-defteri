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
      "Saç dökülmesi tek bir vitamin eksikliğinin belirtisi değildir. Androgenetik alopesi, telogen effluvium, dermatolojik hastalıklar ve beslenme yetersizlikleri farklı mekanizmalara sahiptir. Bu merkezde amaç, bir takviyeyi başlangıç noktası yapmak yerine önce belirtileri ve olası nedenleri ayırt etmektir.",
      "Biyotin, demir ve çinko saç ve tırnakların normal yapısıyla ilişkili besin öğeleridir. Buna karşılık eksiklik kanıtı olmadan daha yüksek doz kullanmanın ek fayda sağladığı genellenemez. Özellikle yüksek doz biyotinin bazı laboratuvar testlerinde yanıltıcı sonuç oluşturabilmesi, etiket okumanın da klinik değerlendirmenin bir parçası olduğunu gösterir.",
      "İlk olarak biyotin dosyasıyla yaygın iddiaları ele alın; ardından demir ve çinko gibi olası eksikliklerin nasıl değerlendirildiğini okuyun. İlişkili kavramlar ve ürün etiketleri sizi daha ayrıntılı kaynaklara götürür."
    ],
    "steps": [
      {
        "title": "Sorunun tipini tanımla",
        "text": "Saçın seyrelme biçimi, dökülme süresi ve eşlik eden deri-tırnak bulguları olası nedenleri değiştirir."
      },
      {
        "title": "Eksikliği iddiadan ayır",
        "text": "Biyotin, demir veya çinko desteğinde yarar, kişinin durumuna ve kanıtlanmış gereksinime bağlıdır."
      },
      {
        "title": "Ürünü güvenli oku",
        "text": "µg–mg dönüşümü, elementel mineral miktarı ve biyotinin tahlil girişimi gibi ayrıntıları kontrol et."
      }
    ],
    "posts": [
      "biotin-b7-vitamini-sac-tirnak-laboratuvar-testleri",
      "demir-takviyesi-ferritin-ve-emilim",
      "cinko-takviyesi-ne-zaman-gerekli",
      "biyoyararlanim-nedir-takviyelerde-emilim-ve-etki"
    ],
    "atlas": [
      "biotin",
      "demir",
      "cinko",
      "kollajen"
    ],
    "glossary": [
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
    "short": "Seramidler, niasinamid, retinoidler ve güneşten korunmayı mekanizmalarıyla keşfedin.",
    "eyebrow": "CİLT / BİLEŞENLER / UYGULAMA",
    "mark": "02",
    "symbol": "02",
    "intro": [
      "Cilt bariyeri yalnızca bir nemlendiricinin hissettirdiği yumuşaklık değildir. Stratum corneum, hücreler arası lipitler ve epidermal su kaybını sınırlayan düzenekler birlikte çalışır. Bu yapı bozulduğunda kuruluk ve tahriş artabilir; ancak her kızarıklığın nedeni bariyer hasarı değildir.",
      "Seramidler, niasinamid, pantenol ve farklı retinoidler aynı amaçla kullanılmaz. Bazıları bariyer desteğiyle ilişkilendirilirken bazıları akne veya pigmentasyon gibi hedeflerde incelenir. Ürün formülasyonu, konsantrasyon, uygulama sıklığı ve tolerans, tek bir bileşen adından daha fazlasını anlatır.",
      "Bu merkezde bileşenleri kullanım amacına göre okumayı, yüzdeleri yanlış karşılaştırmamayı ve SPF ile UVA korumasını birbirinden ayırmayı hedefliyoruz. Klinik hastalık kuşkusunda kozmetik danışmanlığı dermatolojik değerlendirmenin yerine geçmez."
    ],
    "steps": [
      {
        "title": "Bariyerin işlevini öğren",
        "text": "Seramidler ve epidermal yapı üzerinden kuruluk ve tahrişin mekanizmasını anla."
      },
      {
        "title": "Etkin maddeleri ayır",
        "text": "Niasinamid, azelaik asit, retinol ve retinalin formülasyon ve endikasyon farklarına bak."
      },
      {
        "title": "Koruma iddiasını doğrula",
        "text": "SPF, UVA ve suya dayanıklılık ifadelerini gerçek kullanım koşullarıyla birlikte yorumla."
      }
    ],
    "posts": [
      "seramidler-cilt-bariyeri-ve-nemlendirme",
      "niasinamid-yuzde-5-mi-yuzde-10-mu",
      "azelaik-asit-akne-leke-kizariklik",
      "spf-30-ve-spf-50-arasindaki-fark-nedir"
    ],
    "atlas": [
      "seramid",
      "niasinamid",
      "pantenol",
      "azelaik-asit",
      "retinol",
      "retinal",
      "gunes-koruyucu"
    ],
    "glossary": [
      "cilt-bariyeri",
      "cilt-ph",
      "keratinosit",
      "retinol",
      "genis-spektrum-gunes-korumasi",
      "alerjik-kontakt-dermatit"
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
