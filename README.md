# Configuratore gadget promozionali

Calcolatore di preventivi per articoli con **prezzo di listino unico** e
**sconti per fascia di quantità**. Sito statico: nessuna dipendenza, nessuna
compilazione, nessun server. Si apre con doppio click su `index.html` e si
pubblica su GitHub Pages copiando la cartella così com'è.

```
index.html   applicazione completa (markup + stile + logica)
data.js      LISTINO — il solo file da toccare per prezzi, prodotti e opzioni
img/         le immagini dell'anteprima
```

## Come funziona il calcolo

1. **costo unità** del modello **+ lavorazioni scelte** = prezzo di listino;
2. **meno lo sconto** della fascia di quantità raggiunta = prezzo unitario;
3. **per il numero di pezzi** = totale.

Lo sconto si applica a tutto, lavorazioni comprese: un solo prezzo per modello
e una sola percentuale per fascia, invece di un prezzo diverso per ogni fascia.

| Quantità | Sconto |
|---|---|
| 30 - 49 | listino |
| 50 - 99 | −5% |
| 100 - 249 | −10% |
| 250 - 499 | −15% |
| 500+ | −20% |

Esempio con il 2 GB e tutte le lavorazioni (incisione 2 lati, catenella,
caricamento dati, portachiavi): listino 2,00 + 1,20 + 0,20 + 0,35 + 1,20 = **4,95 €/pz**.

| Q.tà | Sconto | €/pz | Totale |
|---|---|---|---|
| 30 | — | 4,95 | 148,50 |
| 50 | −5% | 4,70 | 235,00 |
| 100 | −10% | 4,46 | 446,00 |
| 250 | −15% | 4,21 | 1.052,50 |
| 500 | −20% | 3,96 | 1.980,00 |

I primi tre totali sono a 1-2% da quelli del listino di partenza del fornitore
(148,50 / 237,50 / 455,00), che otteneva lo stesso effetto con tre prezzi base
diversi per il solo prodotto. Le fasce 250 e 500 sono una proposta, da
confermare con il fornitore.

Ogni voce è arrotondata a 2 decimali prima della somma, e lo sconto è mostrato
come riga a sé: le cifre a schermo tornano sempre col prezzo unitario, e
unitario × pezzi col totale.

Il riepilogo segnala anche quando **aumentare la quantità costa meno**
("aggiungi 12 pz e paghi 18,40 € in meno"), confrontando i totali ai punti di
rottura delle fasce.

## Prezzi da confermare

Solo il **2 GB** ha un costo unità confermato (2,00 €). Per 4 GB (2,20) e 8 GB
(2,50) i valori sono **provvisori**, scelti per rendere il configuratore
utilizzabile: sono marcati con `"provvisorio": true` in `data.js`, e la pagina
li segnala sia nel riepilogo sia con un asterisco nella tabella commerciale.
Togli il flag quando hai i numeri veri.

## Modificare i prezzi

Si cambiano **soltanto in `data.js`**, con un editor di testo, e diventano
effettivi con un commit sul ramo `main`. Non esiste nessun pannello di modifica
nella pagina: e' l'unico modo per cambiare quello che vedono gli altri, ed e'
riservato a chi ha accesso al repository.

`data.js` e' JSON puro: solo la prima riga (`window.CATALOGO =`) e' codice.

> Perche' `data.js` e non `data.json`: un `.json` va letto con `fetch()`, che i
> browser bloccano quando la pagina e' aperta con doppio click (`file://`).

```bash
# modifica data.js con un editor di testo, poi:
git add data.js
git commit -m "Aggiornamento listino"
git push        # il sito si aggiorna da se' in circa un minuto
```

Per provare un prezzo prima di pubblicarlo, cambia `data.js` e apri
`index.html` con doppio click: vedi subito l'effetto in locale, e il sito
pubblico resta quello di prima finche' non fai il push.

### Cosa e' pubblico

Il listino sta in un file servito da un sito pubblico: chiunque conosca
l'indirizzo puo' leggerlo, anche direttamente da
`https://balzowits.github.io/configuratore-gadget/data.js`, e i motori di
ricerca possono indicizzarlo. **Se dei valori non devono uscire, non vanno
messi in questo file.** Nessuna misura lato pagina cambia questo: una password
nel codice si legge nei sorgenti, e un login GitHub richiederebbe un server.

Nessuno puo' invece *modificare* i prezzi: per farlo serve un commit sul
repository.

### Struttura di un prodotto

```js
{
  "id": "identificativo-univoco",
  "nome": "Nome commerciale",
  "sottotitolo": "riga descrittiva breve",
  "caratteristiche": ["bullet 1", "bullet 2"],
  "qtaMinima": 30,

  // In ordine crescente. "max": null significa "e oltre".
  // "sconto" e' la percentuale sul totale; "riferimento" la quantita' usata
  // come esempio nella tabella commerciale.
  // Aggiungere uno scaglione = aggiungere una riga qui.
  "fasce": [
    { "min": 30,  "max": 49,   "etichetta": "30 - 49 pz", "sconto": 0,  "riferimento": 30 },
    { "min": 50,  "max": null, "etichetta": "50+ pz",     "sconto": 5,  "riferimento": 50 }
  ],

  // Le alternative fra cui l'articolo si sceglie: capacita', taglia, colore...
  "varianti": {
    "etichetta": "Modello",
    "voci": [
      { "id": "s", "nome": "Small", "prezzo": 2.00 },
      { "id": "m", "nome": "Medium", "prezzo": 2.50, "provvisorio": true },
      { "id": "l", "nome": "Large", "prezzo": null }   // non selezionabile
    ]
  },

  "opzioni": [
    // "esclusiva": se ne sceglie una sola. Metti per prima quella a costo zero.
    { "id": "stampa", "etichetta": "Stampa logo", "tipo": "esclusiva",
      "voci": [ { "id": "no",   "nome": "Nessuna",  "prezzo": 0 },
                { "id": "1col", "nome": "1 colore", "prezzo": 0.80 } ] },
    // "flag": si attiva o no.
    { "id": "astuccio", "etichetta": "Astuccio", "tipo": "flag", "prezzo": 0.25 }
  ],

  "preimpostato": { "variante": "s", "qta": 30, "opzioni": { "stampa": "1col" } }
}
```

Un prezzo si scrive `"prezzo": 0.80` (valore unico) oppure, se davvero varia per
fascia, `"prezzi": [0.80, 0.60]` con un valore per fascia. `null` = non ancora
definito: la voce compare ma non è selezionabile.

Aggiungere un articolo = aggiungere un oggetto come quello sopra nell'array
`prodotti`. Con due o più prodotti compare da sé il selettore in cima al
configuratore. Ogni prodotto ha le **sue** fasce.

## L'anteprima

La foto sta su una cartolina bianca nel binario di sinistra, che resta centrato
mentre si scorre la pagina. Sopra la foto di base si accendono i livelli PNG
trasparenti; gli accessori fotografati a parte compaiono a fianco.

```js
"anteprima": {
  "proporzioni": [1080, 1080],
  "base": "img/chiavetta.png",
  "livelli": {
    // con "valori": si accende se la scelta esclusiva vale uno di quelli
    "incisione": { "img": "img/incisione.png", "opzione": "incisione",
                   "valori": ["1lato", "2lati"] },
    // senza "valori": si accende quando la spunta e' attiva
    "catenella": { "img": "img/catenella.png", "opzione": "catenella" },
    // "separato": non si sovrappone, viene mostrato come immagine a fianco
    "portachiavi": { "img": "img/portachiavi.png", "opzione": "portachiavi",
                     "separato": true, "didascalia": "Portachiavi personalizzato" }
  }
}
```

Requisito per i livelli sovrapposti: **stessa inquadratura e stessa dimensione**
della foto di base, altrimenti non combaciano. Un accessorio ripreso in un'altra
posizione va marcato `"separato": true`.

La foto mostra un lato solo, quindi la scelta fra incisione a 1 e a 2 lati è
scritta sotto l'immagine. Togliendo il blocco `anteprima`, il prodotto non
mostra illustrazione e il configuratore funziona identico.

## La tabella commerciale

Tre tabelle brevi generate dal listino: costo unità per modello, prezzo delle
lavorazioni, e la scala degli sconti applicata alla configurazione scelta nel
configuratore (dichiarata nella nota sotto le tabelle). `data.js` resta l'unica
fonte: cambi un prezzo e le tabelle si rigenerano.

*Copia per Excel* le mette negli appunti separate da tabulazioni.
*Stampa / PDF* stampa solo queste tabelle; il pulsante omonimo nel preventivo
stampa solo il preventivo.

## Il sito pubblicato

**https://balzowits.github.io/configuratore-gadget/**

Repository: https://github.com/BalzoWits/configuratore-gadget (pubblico, ramo
`main`, Pages servito dalla radice).

Per aggiornare il sito basta un commit sul ramo `main`: Pages ricompila da se'
in un minuto circa.

```bash
cd preventivatore-gadget
git add -A
git commit -m "Aggiornamento listino"
git push
```

### Certificati in rete aziendale

Il proxy aziendale ispeziona il traffico TLS, quindi git non riconosceva il
certificato di github.com. Il repository ha gia' la configurazione che serve
(locale, non globale):

```bash
git config http.sslBackend schannel        # usa l'archivio certificati di Windows,
                                           # dove sta la CA aziendale
git config http.schannelCheckRevoke false  # il proxy non pubblica una CRL
                                           # raggiungibile: si salta SOLO questo
                                           # controllo, la verifica del
                                           # certificato resta attiva
```

Servono di nuovo se cloni il repository su un'altra postazione della stessa rete.
Non usare `http.sslVerify false`: disattiverebbe la verifica del certificato.

## Note

- Caratteri tipografici da Google Fonts (Archivo, IBM Plex Mono); senza rete la
  pagina usa quelli di sistema.
- Tema chiaro e scuro; il pulsante in alto a destra cicla auto → chiaro → scuro.
- Nel browser restano memorizzati solo il preventivo in corso e il tema, per
  postazione. Per far circolare un preventivo: *Stampa / PDF* o *Copia come testo*.
- Serve un browser aggiornato (usa il selettore CSS `:has()`).
