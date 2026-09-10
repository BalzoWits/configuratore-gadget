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

1. **Costo unità** del modello **+ lavorazioni** scelte = prezzo di listino.
2. **Meno lo sconto** della fascia di quantità raggiunta = prezzo unitario.
3. **Per il numero di pezzi** = totale.

Lo sconto si applica a tutto, lavorazioni comprese: un prezzo per voce e una
percentuale per fascia. Due sole leve da governare.

### Prezzi di listino

| Voce | €/pz |
|---|---|
| Chiavetta 2 GB | 3,20 |
| Chiavetta 4 GB | 3,60 |
| Chiavetta 8 GB | 3,80 |
| Incisione laser 1 lato | +1,00 |
| Incisione laser 2 lati | +1,40 |
| Portachiavi (catenella o anello) | +0,40 |
| Caricamento dati | +0,50 |

Catenella e anello sono **alternative**: si aggancia una cosa sola al foro. Il
colore non ha sovrapprezzo.

### Scala degli sconti

| Quantità | Sconto |
|---|---|
| 10 - 30 | listino |
| 40 - 60 | −5% |
| 70 - 90 | −10% |
| 100+ | −15% |

Esempio — 2 GB con incisione 2 lati, catenella e caricamento dati:
listino 3,20 + 1,40 + 0,40 + 0,50 = **5,50 €/pz**.

| Q.tà | Sconto | €/pz | Totale |
|---|---|---|---|
| 30 | listino | 5,50 | 165,00 |
| 40 | −5% | 5,23 | 209,20 |
| 70 | −10% | 4,95 | 346,50 |
| 100 | −15% | 4,68 | 468,00 |

Ogni voce è arrotondata a 2 decimali prima della somma, e lo sconto è una riga
a sé: le cifre a schermo tornano sempre col prezzo unitario, e unitario ×
pezzi col totale.

### Il vincolo da rispettare se cambi la scala

Con le quantità a passo fisso, un salto di sconto troppo lontano dall'origine
fa ricomparire l'assurdità di prima: ordinare di più costa meno. La regola:

```
quantità massima della fascia = passo × (1 − sconto nuovo) / (sconto nuovo − sconto vecchio)
```

Con passo 10 e salti di 5 punti: la fascia può arrivare a 190 pz passando da 0
a −5%, 180 da −5 a −10%, 170 da −10 a −15%, **160** da −15 a −20% — e con gli
arrotondamenti conviene stare un gradino sotto. È il motivo per cui la scala
si ferma a −15% con l'ultima fascia aperta: **una fascia senza salti dopo di
sé non pone vincoli**, quindi 100+ è sicura per sempre.

Se volessi arrivare a −20%, o abbassi la soglia (−20% da 160 pz in su) o riduci
il salto (−18% invece di −20%). Il collaudo verifica la monotonia su 3 modelli
× 2 configurazioni × 60 quantità, da 10 a 600 pezzi.

### Perché le quantità vanno a multipli di 10

Senza un passo fisso, con qualunque scala a fasce esistono quantità in cui
ordinare un pezzo in più costa meno: subito dopo la soglia, il prezzo scende
prima che la quantità cresca abbastanza. Il campo `"passo": 10` rende quelle
quantità non selezionabili.

Mentre digiti, il valore resta libero così il campo non salta sotto le dita; si
allinea quando lasci il campo. Pulsanti, cursore e pastiglie producono solo
quantità valide, e se la quantità non è ordinabile compare un avviso col
pulsante per correggerla. `"passo": 1` torna alla quantità libera.

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
  // "riferimento": la quantita' usata come esempio nella tabella commerciale
  //                e nelle pastiglie di scelta rapida.
  // "sconto":      percentuale sul totale, di norma 0 (i prezzi di fascia
  //                contengono gia' lo sconto quantita').
  // Aggiungere uno scaglione = aggiungere una riga qui.
  "fasce": [
    { "min": 10, "max": 30,   "etichetta": "10 - 30 pz", "sconto": 0, "riferimento": 30 },
    { "min": 40, "max": null, "etichetta": "40+ pz",     "sconto": 5, "riferimento": 40 }
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
  // L'ORDINE CONTA: i livelli si impilano come sono scritti qui.
  "livelli": {
    // i colori per primi: coprono la base, e il resto si disegna sopra
    "coloreBlu":   { "img": "img/chiavetta-blu.jpg",   "opzione": "colore", "valori": ["blu"] },
    "coloreRossa": { "img": "img/chiavetta-rossa.jpg", "opzione": "colore", "valori": ["rossa"] },
    // con "valori": si accende se la scelta esclusiva vale uno di quelli
    "incisione":   { "img": "img/incisione.png", "opzione": "incisione",
                     "valori": ["1lato", "2lati"] },
    // senza "valori": si accende quando la spunta e' attiva
    "catenella":   { "img": "img/catenella.png", "opzione": "catenella" },
    // "separato": non si sovrappone, viene mostrato come immagine a fianco
    "portachiavi": { "img": "img/portachiavi.png", "opzione": "portachiavi",
                     "separato": true, "didascalia": "Portachiavi personalizzato" }
  }
}
```

### Il colore

Il colore e' una **scelta esclusiva senza sovrapprezzo**, e nell'anteprima
funziona per sovrapposizione: la foto colorata copre quella di base, poi
incisione, catenella e scritta si disegnano sopra. Le tre foto sono allineate
al pixel (stesso riquadro, scostamento zero), verificato prima di usarle.

L'opzione e' marcata `"sempre": true`: significa che compare nelle descrizioni
e nelle righe di preventivo anche se non costa nulla, perche' e' una
caratteristica del prodotto e non un extra. Se un colore dovesse costare di
piu', basta dargli un `"prezzo"`.

Per aggiungere un colore servono una foto con la stessa inquadratura, una voce
in `opzioni.colore.voci` e un livello in `anteprima.livelli` messo **prima**
degli altri.

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
