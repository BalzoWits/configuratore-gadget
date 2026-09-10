/* ============================================================================
   LISTINO — l'unico file da modificare per cambiare prezzi, prodotti e opzioni.
   Il contenuto e' JSON puro: solo la prima riga (window.CATALOGO =) e' codice.
   Serve cosi' perche' un .json vero richiede fetch(), che i browser bloccano
   quando la pagina viene aperta con doppio click (protocollo file://).

   COME SI FORMA IL PREZZO
     1. costo unita' del modello + prezzo delle lavorazioni = prezzo di listino
     2. meno lo sconto della fascia di quantita' raggiunta = prezzo unitario
     3. per il numero di pezzi = totale

   Lo sconto si applica a tutto, lavorazioni comprese: un solo prezzo per
   voce e una sola percentuale per fascia.

   Due modi di scrivere un prezzo:
     "prezzo": 0.80              valore unico, uguale in tutte le fasce
     "prezzi": [1.00, 0.90, 0.80] un valore per fascia, nell'ordine delle fasce
                                  (null = prezzo non ancora definito)

   Questo file ha sempre l'ultima parola: quello che scrivi qui e' quello che
   la pagina mostra, a ogni ricaricamento. Diventa effettivo con un commit.
   ========================================================================= */

window.CATALOGO = {
  "note": "Il prezzo di listino non dipende dalla quantita': lo sconto della fascia si applica al totale, lavorazioni comprese.",

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

      /* SCALA DEGLI SCONTI — il prezzo di listino e' uno, lo sconto dipende
         dalla quantita'. "riferimento" e' la quantita' usata come esempio
         nella tabella commerciale e nelle pastiglie di scelta rapida.

         VINCOLO DA RISPETTARE quando si cambia la scala: con passo 10, una
         fascia non puo' estendersi troppo prima di un salto di sconto,
         altrimenti ordinare di piu' costa meno. La regola e'
             quantita' massima = passo x (1 - sconto nuovo) / (sconto nuovo - vecchio)
         Per un salto di 5 punti: entro 190 pz da 0 a 5%, 180 da 5 a 10%,
         170 da 10 a 15%, 160 da 15 a 20% (e con gli arrotondamenti conviene
         stare un gradino sotto). L'ultima fascia e' aperta e non ha salti
         dopo di se', quindi non pone vincoli.
         Il collaudo lo verifica su ogni quantita' da 10 a 400. */
      "fasce": [
        { "min": 10,  "max": 30,   "etichetta": "10 - 30 pz", "sconto": 0,  "riferimento": 30 },
        { "min": 40,  "max": 60,   "etichetta": "40 - 60 pz", "sconto": 5,  "riferimento": 40 },
        { "min": 70,  "max": 90,   "etichetta": "70 - 90 pz", "sconto": 10, "riferimento": 70 },
        { "min": 100, "max": null, "etichetta": "100+ pz",    "sconto": 15, "riferimento": 100 }
      ],

      "varianti": {
        "etichetta": "Modello",
        "voci": [
          { "id": "2gb", "nome": "2 GB", "prezzo": 3.20 },
          { "id": "4gb", "nome": "4 GB", "prezzo": 3.60 },
          { "id": "8gb", "nome": "8 GB", "prezzo": 3.80 }
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
            { "id": "1lato", "nome": "1 lato",  "prezzo": 1.00 },
            { "id": "2lati", "nome": "2 lati",  "prezzo": 1.40 }
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
            { "id": "catenella", "nome": "Catenella", "prezzo": 0.40 },
            { "id": "anello",    "nome": "Anello",    "prezzo": 0.40 }
          ]
        },
        { "id": "dati", "etichetta": "Caricamento dati", "tipo": "flag", "prezzo": 0.50 }
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
