import Camlica from '../images/camlica.jpg';
import Kudus from '../images/kudus.jpg';
import Kuskonmaz from '../images/kuşkonmaz.jpg';
import Medine from '../images/medine.jpg';
import Mekke from '../images/mekke.jpg';
import Metokati from '../images/metokati-kabri.jpg';
import YerAlti from '../images/yer_alti.png';
import Galata from '../images/Galata.jpg';
import KizKulesi from '../images/Kız-kulesi.jpg';

export const STATIC_PLACES = [
    {
        id: 1,
        title: "Kuşkonmaz Cami",
        description: "İstanbul'un tarihi yarımadasında gizlenmiş, sade ve huzurlu mimarisiyle dikkat çeken Osmanlı dönemi eseri bir cami.",
        link: "https://share.google/eirBQ7ssrkANpFKeK",
        image: Kuskonmaz,
        category: "mosque",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 2,
        title: "Mehmet Emin Tokadi Hz.",
        description: "18. yüzyılın büyük mutasavvıf ve alimlerinden Mehmet Emin Tokadi Hazretleri'nin İstanbul'daki türbesi.",
        link: "https://share.google/UuxEbKnjYZ45UUTlW",
        image: Metokati,
        category: "heritage",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 3,
        title: "Çamlıca Camii",
        description: "Boğazı ve şehri kuşbakışı izleyen, Türkiye'nin en büyük camii olma özelliğini taşıyan modern ve görkemli yapı.",
        link: "https://share.google/sfOzyi7UCE6iUUroD",
        image: Camlica,
        category: "mosque",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 4,
        title: "Yer Altı Camii",
        description: "Karaköy'de zemin altına inşa edilmiş, 50'den fazla sütunuyla eşsiz bir mimari örüntü sergileyen tarihi cami.",
        link: "https://share.google/T2DXYdByeizh8lFNK",
        image: YerAlti,
        category: "mosque",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 5,
        title: "Kudüs — Mescid-i Aksa",
        description: "Müslümanlar için İslam'ın üçüncü kutsal mekânı; peygamberlerin miracın başlangıç noktası olan mübarek şehirde yer alır.",
        link: "https://share.google/Jk7J7FNsOR5BchMt8",
        image: Kudus,
        category: "heritage",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 6,
        title: "Mekke — Kabe",
        description: "İslam'ın en kutsal mekânı; dünyanın dört bir yanından her yıl milyonlarca Müslümanın hac ziyareti yaptığı ilahi emanet.",
        link: "https://share.google/QkHAG1FC0FlEWSW1X",
        image: Mekke,
        category: "heritage",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 7,
        title: "Medine — Mescid-i Nebî",
        description: "Hz. Peygamber'in inşa ettiği ve mübarek türbesinin bulunduğu, nuruyla kalpleri aydınlatan bu şehir müminlerin özlemidir.",
        link: "https://share.google/9SjPB5jgeiKBbLFOp",
        image: Medine,
        category: "heritage",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 8,
        title: "Galata Kulesi",
        description: "İstanbul silüetinin simgesi olan bu Ortaçağ kulesi, tepesinden şehrin ve Boğaz'ın nefes kesen 360° panoramasını sunar.",
        link: "https://share.google/81AAZjpW2bjy9Vbrr",
        image: Galata,
        category: "landmark",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 9,
        title: "Kız Kulesi",
        description: "Boğaz'ın ortasında yükselen, efsaneler ve aşk hikayeleriyle dolu romantik kule; İstanbul'un en ikonik yapılarından biridir.",
        link: "https://share.google/OzQ3MJTlTy7INbUKs",
        image: KizKulesi,
        category: "landmark",
        rating: 0, reviews: [], photos: []
    },
    /* ── 5 New Istanbul Landmarks ─────────────────────── */
    {
        id: 10,
        title: "Ayasofya Cami-i Şerifi",
        description: "Bizans'tan Osmanlı'ya uzanan köklü tarihi, eşsiz mimarisi ve manevi ağırlığıyla İstanbul'un kalbinde duran bu yapı insanlığın ortak mirası sayılır.",
        link: "https://maps.app.goo.gl/ayasofya",
        image: Camlica,           /* placeholder — swap with real image */
        category: "mosque",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 11,
        title: "Yerebatan Sarnıcı",
        description: "532 yılında inşa edilen ve 336 mermer sütunuyla desteklenen bu antik su deposu, yeraltında büyülü bir atmosfer oluşturur.",
        link: "https://maps.app.goo.gl/yerebatan",
        image: YerAlti,           /* placeholder — swap with real image */
        category: "landmark",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 12,
        title: "Topkapı Sarayı",
        description: "Osmanlı İmparatorluğu'nun 400 yıllık yönetim merkezi; harem daireleri, hazine odaları ve geniş bahçeleriyle tarihe açılan bir kapı.",
        link: "https://maps.app.goo.gl/topkapi",
        image: Galata,            /* placeholder — swap with real image */
        category: "landmark",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 13,
        title: "Dolmabahçe Sarayı",
        description: "Avrupa mimarisini Osmanlı zarafetiyle buluşturan bu görkemli sahil sarayı, Atatürk'ün son günlerini geçirdiği tarihi mekândır.",
        link: "https://maps.app.goo.gl/dolmabahce",
        image: KizKulesi,         /* placeholder — swap with real image */
        category: "landmark",
        rating: 0, reviews: [], photos: []
    },
    {
        id: 14,
        title: "Süleymaniye Camii",
        description: "Mimar Sinan'ın şaheseri, dört minaresi ve kubbesiyle İstanbul'u taçlandıran bu cami; huzur, büyük ve sonsuzluğun sembolüdür.",
        link: "https://maps.app.goo.gl/suleymaniye",
        image: Kuskonmaz,         /* placeholder — swap with real image */
        category: "mosque",
        rating: 0, reviews: [], photos: []
    },
];
