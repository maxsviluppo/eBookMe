import { Book } from '../types';

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'citta-invisibili',
    title: 'Le Città Invisibili',
    subtitle: 'Note e Visioni di Marco Polo',
    author: 'Italo Calvino (Omaggio)',
    year: '1972',
    genre: 'Narrativa Filosofica',
    coverEmblem: 'bridge',
    description: 'Un dialogo tra Marco Polo e Kublai Khan sulle città immaginarie del mondo conosciuto e sognato.',
    chapters: [
      {
        id: 'cap-1',
        number: 1,
        title: 'Le città e la memoria. 1',
        subtitle: 'Diomira',
        readingTimeMinutes: 3,
        content: [
          "Partendosi di là e andando tre giornate a levante, l'uomo si trova a Diomira, città con sessanta cupole d'argento, statue in bronzo di tutti gli dèi, vie lastricate in stagno, un teatro di cristallo, un gallo d'oro che canta ogni mattina su una torre.",
          "Tutte queste bellezze il viaggiatore già conosce per averle viste anche in altre città. Ma la proprietà di questa è che chi vi arriva una sera di settembre, quando le ombre si allungano e nei cortili si accendono i lumi, prova una forma di felicità che credeva di aver perduto.",
          "Se poi gli accade di udire una musica venire da una finestra o di scorgere una giovane donna che scende una scalinata con un canestro di frutta fresca, allora si ricorda che quella stessa musica e quella stessa fanciulla le aveva già incontrate in un'altra sera, in un altro paese, in un tempo che non c'è più.",
          "L'uomo che cavalca a lungo per terreni selvatici ha desiderio d'una città. Finalmente giunge a Isidora, città dove i palazzi hanno scale a chiocciola incrostate di chiocciole marine, dove si fabbricano con tutte le regole cannocchiali e violini, dove quando il forestiero è incerto tra due donne ne incontra sempre una terza."
        ]
      },
      {
        id: 'cap-2',
        number: 2,
        title: 'Le città e il desiderio. 1',
        subtitle: 'Dorotea',
        readingTimeMinutes: 4,
        content: [
          "Della città di Dorotea si può parlare in due modi: dire che quattro torri d'alluminio s'innalzano dalle sue mura fiancheggiando sette porte dal ponte levatoio a molla che scavalca il fossato la cui acqua alimenta quattro canali verdi che tagliano la città in nove quartieri...",
          "Oppure dire come il cammelliere che mi ci condusse: «Vi arrivai nella prima giovinezza, una mattina, molta gente andava svelta per le vie verso il mercato, le donne avevano denti splendidi e guardavano negli occhi, tre soldati su un palco suonavano il clarino, dappertutto attorno giravano le ruote coi cerchi variopinti.»",
          "«Prima d'allora non avevo conosciuto che il deserto e le piste delle carovane. Negli anni seguenti i miei occhi tornarono a contemplare le distese del deserto e le piste delle carovane; ma ora so che questa è solo una delle tante vie che si aprivano a me quella mattina a Dorotea.»",
          "In ogni città c'è una piazza dove non succede nulla per ore e ore, ma se ti fermi ad osservare il pulviscolo che danza nel raggio di sole obliquo, capisci il ritmo segreto di ogni architettura."
        ]
      },
      {
        id: 'cap-3',
        number: 3,
        title: 'Le città e i segni. 1',
        subtitle: 'Tamara',
        readingTimeMinutes: 4,
        content: [
          "L'uomo cammina per giornate tra gli alberi e le pietre. Raramente l'occhio si ferma su una cosa, ed è quando l'ha riconosciuta per il segno d'un'altra cosa: un'orma nella sabbia indica il passaggio della tigre, un pantano annuncia una vena d'acqua, il fiore dell'ibisco la fine dell'inverno.",
          "Tutto il resto è muto e intercambiabile; alberi e pietre sono soltanto ciò che sono.",
          "Finalmente il viaggio conduce alla città di Tamara. Ci si addentra per vie fitte d'insegne che sporgono dai muri. L'occhio non vede cose ma figure di cose che significano altre cose: la tenaglia indica la casa del cavadenti, il boccale la taverna, le alabarde il corpo di guardia.",
          "Se un edificio non porta nessuna insegna o figura, la sua stessa forma e il posto che occupa nell'ordine della città basta a indicarne la funzione: la reggia, la prigione, la zecca, la scuola, il tribunale."
        ]
      }
    ]
  },
  {
    id: 'divina-commedia',
    title: 'La Divina Commedia',
    subtitle: 'Inferno — Canti Scelti',
    author: 'Dante Alighieri',
    year: '1321',
    genre: 'Poema Epico / Classico',
    coverEmblem: 'seal',
    description: 'Il viaggio allegorico attraverso i regni dell’oltretomba, pietra miliare della letteratura universale.',
    chapters: [
      {
        id: 'canto-1',
        number: 1,
        title: 'Canto I',
        subtitle: 'La Selva Oscura e il Colle',
        readingTimeMinutes: 5,
        content: [
          "Nel mezzo del cammin di nostra vita\nmi ritrovai per una selva oscura,\nché la diritta via era smarrita.",
          "Ahi quanto a dir qual era è cosa dura\nesta selva selvaggia e aspra e forte\nche nel pensier rinova la paura!",
          "Tant' è amara che poco è più morte;\nma per trattar del ben ch'i' vi trovai,\ndirò de l'altre cose ch'i' v'ho scorte.",
          "Io non so ben ridir com'i' v'intrai,\ntant' era pien di sonno a quel punto\nche la verace via abbandonai.",
          "Ma poi ch'i' fui al piè d'un colle giunto,\nlà dove terminava quella valle\nche m'avea di paura il cor compunto,",
          "guardai in alto e vidi le sue spalle\nvestite già de' raggi del pianeta\nche mena dritto altrui per ogne calle."
        ]
      },
      {
        id: 'canto-3',
        number: 2,
        title: 'Canto III',
        subtitle: 'La Porta dell’Inferno e Caronte',
        readingTimeMinutes: 5,
        content: [
          "«Per me si va ne la città dolente,\nper me si va ne l'etterno dolore,\nper me si va tra la perduta gente.",
          "Giustizia mosse il mio alto fattore;\nfecemi la divina podestate,\nla somma sapïenza e 'l primo amore.",
          "Dinanzi a me non fuor cose create\nse non etterne, e io etterno duro.\nLasciate ogne speranza, voi ch'intrate.»",
          "Queste parole di colore oscuro\nvid'ïo scritte al sommo d'una porta;\nper ch'io: «Maestro, il senso lor m'è duro»."
        ]
      },
      {
        id: 'canto-5',
        number: 3,
        title: 'Canto V',
        subtitle: 'Paolo e Francesca',
        readingTimeMinutes: 5,
        content: [
          "Così discesi del cerchio primaio\ngiù nel secondo, che men loco cinghia\ne tanto più dolor, che pugne a guaio.",
          "Stavvi Minòs orribilmente, e ringhia:\nesamina le colpe ne l'intrata;\ngiudica e manda secondo ch'avvinghia.",
          "«Amor, ch'al cor gentil ratto s'apprende,\nprese costui de la bella persona\nche mi fu tolta; e 'l modo ancor m'offende.",
          "Amor, ch'a nullo amato amar perdona,\nmi prese del costui piacer sì forte,\nche, come vedi, ancor non m'abbandona.»"
        ]
      }
    ]
  },
  {
    id: 'fu-mattia-pascal',
    title: 'Il Fu Mattia Pascal',
    subtitle: 'Capitoli Iniziali',
    author: 'Luigi Pirandello',
    year: '1904',
    genre: 'Romanzo Modernista',
    coverEmblem: 'quill',
    description: 'La vicenda paradossale dell’uomo che creduto morto tenta di ricominciare una nuova esistenza sotto falso nome.',
    chapters: [
      {
        id: 'mattia-1',
        number: 1,
        title: 'Premessa',
        subtitle: 'Una delle poche cose, anzi forse la sola ch’io sapessi di certo...',
        readingTimeMinutes: 4,
        content: [
          "Una delle poche cose, anzi forse la sola ch'io sapessi di certo era questa: che mi chiamavo Mattia Pascal. E me ne prevalevo.",
          "Ogni qual volta un qualche amico o conoscente dimostrava d'aver perduto il senso della misura e mi chiedeva con aria compunta un parere sul conto mio, io mi stringevo nelle spalle, socchiudevo gli occhi e gli rispondevo: «Io mi chiamo Mattia Pascal.»",
          "— Grazie, caro. Questo lo so.",
          "— E ti par poco?",
          "Non pareva molto, per dir la verità, neanche a me. Ma ignoravo allora che cosa volesse dire il non sapere neppur questo, il non poter più rispondere, cioè, all'occorrenza: «Io mi chiamo Mattia Pascal»."
        ]
      },
      {
        id: 'mattia-2',
        number: 2,
        title: 'Premessa Seconda',
        subtitle: 'Filosofica a mo’ di scusa',
        readingTimeMinutes: 4,
        content: [
          "L'idea di scrivere questo libro m'è venuta nella quiete della chiesetta sconsacrata dove sono ora bibliotecario.",
          "Don Eligio Pellegrinotto, che ha preso cura dei vecchi volumi polverosi, sostiene che tutte le nostre tribolazioni derivino dalla maledetta copernicana invenzione: il sole non gira più attorno alla Terra, e la Terra gira come una trottola spersa nell'universo.",
          "«Maledetto sia Copernico!» esclamava spesso. «Quand'era la terra a star ferma e il sole a girarle attorno per farle lume, l'uomo si sentiva al centro del creato, con doveri nobilissimi e un destino imperituro.»"
        ]
      }
    ]
  }
];
