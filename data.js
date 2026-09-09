/* ============================================================================
   LISTINO — l'unico file da modificare per cambiare prezzi, prodotti e opzioni.
   Il contenuto e' JSON puro: solo la prima riga (window.CATALOGO =) e' codice.
   Serve cosi' perche' un .json vero richiede fetch(), che i browser bloccano
   quando la pagina viene aperta con doppio click (protocollo file://).

   COME SI FORMA IL PREZZO
     1. costo unita' del modello + prezzo delle lavorazioni scelte = prezzo di listino
     2. meno lo sconto della fascia di quantita' raggiunta = prezzo unitario
     3. per il numero di pezzi = totale

   Lo sconto si applica a TUTTO (chiavetta e lavorazioni), non solo al prodotto:
   un solo prezzo per modello e una sola percentuale per fascia.

   Questo file ha sempre l'ultima parola: quello che scrivi qui e' quello che
   la pagina mostra, a ogni ricaricamento. Diventa effettivo con un commit.
   ========================================================================= */

window.CATALOGO = {
  "note": "Il prezzo di listino non dipende dalla quantita': lo sconto di fascia si applica al totale, lavorazioni comprese.",

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
      "qtaMinima": 30,

      /* Fasce di quantita' e sconto sul totale. "riferimento" e' la quantita'
         usata come esempio nella tabella commerciale.
         Aggiungere uno scaglione = aggiungere una riga qui. */
      "fasce": [
        { "min": 30,  "max": 49,   "etichetta": "30 - 49 pz",   "sconto": 0,  "riferimento": 30 },
        { "min": 50,  "max": 99,   "etichetta": "50 - 99 pz",   "sconto": 5,  "riferimento": 50 },
        { "min": 100, "max": 249,  "etichetta": "100 - 249 pz", "sconto": 10, "riferimento": 100 },
        { "min": 250, "max": 499,  "etichetta": "250 - 499 pz", "sconto": 15, "riferimento": 250 },
        { "min": 500, "max": null, "etichetta": "500+ pz",       "sconto": 20, "riferimento": 500 }
      ],

      /* ATTENZIONE: solo il 2 GB ha un prezzo confermato (2,00, dal listino
         del fornitore). 4 GB e 8 GB sono PROVVISORI, scelti per rendere il
         configuratore utilizzabile: "provvisorio": true li fa segnalare
         nell'anteprima e nella tabella. Togli il flag quando hai i veri. */
      "varianti": {
        "etichetta": "Modello",
        "voci": [
          { "id": "2gb", "nome": "2 GB", "prezzo": 2.00 },
          { "id": "4gb", "nome": "4 GB", "prezzo": 2.20, "provvisorio": true },
          { "id": "8gb", "nome": "8 GB", "prezzo": 2.50, "provvisorio": true }
        ]
      },

      "opzioni": [
        {
          "id": "colore",
          "etichetta": "Colore",
          "tipo": "esclusiva",
          /* "sempre": la scelta compare nelle descrizioni anche se non costa
             nulla, perche' e' una caratteristica del prodotto e non un extra.
             Se un colore dovesse costare di piu', basta dargli un "prezzo". */
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
            { "id": "1lato", "nome": "1 lato",            "prezzo": 0.80 },
            { "id": "2lati", "nome": "2 lati",            "prezzo": 1.20 }
          ]
        },
        { "id": "catenella",   "etichetta": "Catenella standard", "tipo": "flag", "prezzo": 0.20 },
        { "id": "dati",        "etichetta": "Caricamento dati",   "tipo": "flag", "prezzo": 0.35 },
        { "id": "portachiavi", "etichetta": "Portachiavi",        "tipo": "flag", "prezzo": 1.20 }
      ],

      /* ANTEPRIMA — immagini che si accendono con le scelte.
         L'ORDINE CONTA: i livelli si impilano come sono scritti qui, quindi i
         colori stanno per primi e incisione, catenella e scritta si disegnano
         sopra di loro. Tutti i livelli sovrapposti hanno la stessa
         inquadratura e la stessa dimensione della foto di base.
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
          "catenella":   { "img": "img/catenella.png", "opzione": "catenella" },
          "dati":        { "img": "img/dati.png",      "opzione": "dati" },
          "portachiavi": { "img": "img/portachiavi.png", "opzione": "portachiavi",
                           "separato": true, "didascalia": "Portachiavi personalizzato" }
        }
      },

      /* Configurazione mostrata all'apertura della pagina. */
      "preimpostato": {
        "variante": "2gb",
        "qta": 30,
        "opzioni": {
          "colore": "nera", "incisione": "2lati",
          "catenella": true, "dati": true, "portachiavi": true
        }
      }
    }
  ]
};
