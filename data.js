/* ============================================================================
   LISTINO — l'unico file da modificare per cambiare prezzi, prodotti e opzioni.
   Il contenuto e' JSON puro: solo la prima riga (window.CATALOGO =) e' codice.
   Serve cosi' perche' un .json vero richiede fetch(), che i browser bloccano
   quando la pagina viene aperta con doppio click (protocollo file://).

   COME SI FORMA IL PREZZO
     1. costo unita' del modello nella fascia raggiunta
     2. piu' il prezzo delle lavorazioni scelte, nella stessa fascia
     3. meno l'eventuale sconto della fascia (oggi zero: gli sconti sono gia'
        dentro i prezzi, che scendono al crescere della quantita')
     4. per il numero di pezzi = totale

   Due modi di scrivere un prezzo:
     "prezzo": 0.80              valore unico, uguale in tutte le fasce
     "prezzi": [1.00, 0.90, 0.80] un valore per fascia, nell'ordine delle fasce
                                  (null = prezzo non ancora definito)

   Questo file ha sempre l'ultima parola: quello che scrivi qui e' quello che
   la pagina mostra, a ogni ricaricamento. Diventa effettivo con un commit.
   ========================================================================= */

window.CATALOGO = {
  "note": "Il costo unita' e il prezzo delle lavorazioni scendono al crescere della quantita': ogni fascia ha i suoi valori.",

  "prodotti": [
    {
      "id": "usb-slim",
      "nome": "Chiavette USB",
      "sottotitolo": "Modello slim in metallo, foro per portachiavi",
      "caratteristiche": [
        "Design compatto e resistente",
        "Ampia area per la personalizzazione",
        "Disponibile in diverse capacita' e colori"
      ],
      "qtaMinima": 10,
      /* Passo di ordinazione: si ordina 10, 20, 30... e non 31.
         Serve a togliere l'anomalia al confine di fascia, dove il prezzo
         scende: a scelta libera 31 pezzi costerebbero meno di 30.
         Metti 1 per lasciare la quantita' libera. */
      "passo": 10,

      /* Fasce di quantita'. "riferimento" e' la quantita' usata come esempio
         nella tabella commerciale e nelle pastiglie di scelta rapida.
         "sconto" e' una percentuale sul totale: oggi zero perche' gli sconti
         sono gia' nei prezzi di ogni fascia. Se un domani servisse uno sconto
         ulteriore (promozioni, clienti fissi), basta valorizzarlo qui.

         NOTA: il listino del fornitore si ferma a 100 pezzi. L'ultima fascia
         e' aperta (51 e oltre) per poter preventivare ordini piu' grandi, ma
         oltre i 100 pezzi i prezzi vanno confermati. */
      "fasce": [
        { "min": 1,  "max": 30,   "etichetta": "1 - 30 pz",  "sconto": 0, "riferimento": 30 },
        { "min": 31, "max": 50,   "etichetta": "31 - 50 pz", "sconto": 0, "riferimento": 50 },
        { "min": 51, "max": null, "etichetta": "51+ pz",     "sconto": 0, "riferimento": 100 }
      ],

      "varianti": {
        "etichetta": "Modello",
        "voci": [
          { "id": "2gb", "nome": "2 GB", "prezzi": [3.20, 3.00, 2.90] },
          { "id": "4gb", "nome": "4 GB", "prezzi": [3.60, 3.40, 3.30] },
          { "id": "8gb", "nome": "8 GB", "prezzi": [3.80, 3.50, 3.40] }
        ]
      },

      "opzioni": [
        {
          "id": "colore",
          "etichetta": "Colore",
          "tipo": "esclusiva",
          /* "sempre": la scelta compare nelle descrizioni anche se non costa
             nulla, perche' e' una caratteristica del prodotto e non un extra.
             Se un colore dovesse costare di piu', basta dargli un prezzo. */
          "sempre": true,
          "voci": [
            { "id": "nera",  "nome": "Nera",  "prezzo": 0 },
            { "id": "blu",   "nome": "Blu",   "prezzo": 0 },
            { "id": "rossa", "nome": "Rossa", "prezzo": 0 }
          ]
        },
        {
          "id": "incisione",
          "etichetta": "Incisione laser",
          "tipo": "esclusiva",
          "voci": [
            { "id": "no",    "nome": "Nessuna incisione", "prezzo": 0 },
            { "id": "1lato", "nome": "1 lato",  "prezzi": [1.00, 0.90, 0.80] },
            { "id": "2lati", "nome": "2 lati",  "prezzi": [1.40, 1.30, 1.20] }
          ]
        },
        {
          /* nel listino le due voci stanno nella stessa colonna e costano
             uguale: sono alternative, si aggancia una cosa sola al foro */
          "id": "portachiavi",
          "etichetta": "Portachiavi",
          "tipo": "esclusiva",
          "voci": [
            { "id": "no",        "nome": "Nessuno",   "prezzo": 0 },
            { "id": "catenella", "nome": "Catenella", "prezzi": [0.40, 0.35, 0.30] },
            { "id": "anello",    "nome": "Anello",    "prezzi": [0.40, 0.35, 0.30] }
          ]
        },
        { "id": "dati", "etichetta": "Caricamento dati", "tipo": "flag",
          "prezzi": [0.50, 0.35, 0.20] }
      ],

      /* ANTEPRIMA — immagini che si accendono con le scelte.
         L'ORDINE CONTA: i livelli si impilano come sono scritti qui, quindi i
         colori stanno per primi e il resto si disegna sopra di loro. Tutti i
         livelli sovrapposti hanno la stessa inquadratura e la stessa
         dimensione della foto di base.
         "separato": true per un accessorio fotografato a parte, che non si
         sovrappone e viene mostrato a fianco.
         Con "valori" il livello si accende se la scelta esclusiva vale uno di
         quelli, senza si accende quando la spunta e' attiva. */
      "anteprima": {
        "proporzioni": [1080, 1080],
        "base": "img/chiavetta.png",
        "livelli": {
          "coloreBlu":   { "img": "img/chiavetta-blu.jpg",   "opzione": "colore", "valori": ["blu"] },
          "coloreRossa": { "img": "img/chiavetta-rossa.jpg", "opzione": "colore", "valori": ["rossa"] },
          "incisione":   { "img": "img/incisione.png", "opzione": "incisione",
                           "valori": ["1lato", "2lati"] },
          "catenella":   { "img": "img/catenella.png", "opzione": "portachiavi",
                           "valori": ["catenella"] },
          "dati":        { "img": "img/dati.png", "opzione": "dati" }
          /* Per la voce "Anello" non c'e' un'immagine: quella disponibile
             (img/portachiavi.png) mostra un portachiavi in gomma
             personalizzato, non l'anellino metallico del listino. Quando
             arriva la foto giusta, si aggiunge qui una riga come le altre. */
        }
      },

      /* Configurazione mostrata all'apertura della pagina. */
      "preimpostato": {
        "variante": "2gb",
        "qta": 30,
        "opzioni": {
          "colore": "nera", "incisione": "2lati",
          "portachiavi": "catenella", "dati": true
        }
      }
    }
  ]
};
