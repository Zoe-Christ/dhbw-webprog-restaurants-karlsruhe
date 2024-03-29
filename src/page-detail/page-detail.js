"use strict";

/**
 * Klasse PageDetail: Stellt die Detailseite der App zur Verfügung
 */
class PageDetail {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
        this._recordId = -1;
        this._data = null;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show(matches) {
        // URL-Parameter auswerten
        this._recordId = matches[1];
        this._data = await this._app.database.selectById(this._recordId, "restaurants");

        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("page-detail/page-detail.html");
        let css = await fetch("page-detail/page-detail.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }

        // Seite zur Anzeige bringen
        let bewertung = await this.bewertungBerechnen();
        let pageDom = this._processTemplate(html, bewertung);

        this._app.setPageTitle(` ${this._data.name}`, {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));
    }

     /**
     * Hilfsmethode, welche den HTML-Code der eingelesenen HTML-Datei bearbeitet
     * und anhand der eingelesenen Daten ergänzt. Zusätzlich wird hier ein
     * Event Handler für den Button registriert.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */
      _processTemplate(html, bewertung) {
        // Platzhalter mit den eingelesenen Daten ersetzen
        html = html.replace(/{IMG}/g, this._data.img);
        html = html.replace(/{NAME}/g, this._data.name);
        html = html.replace(/{TYP}/g, this._data.typ);
        html = html.replace(/{GRUENDUNGSJAHR}/g, this._data.gruendungsjahr);
        html = html.replace(/{LINK}/g, this._data.link);
        html = html.replace(/{BESCHREIBUNG}/g, this._data.beschreibung);
        html = html.replace(/{OEFFNUNGMO}/g, this._data.oeffnungMo);
        html = html.replace(/{OEFFNUNGDI}/g, this._data.oeffnungDi);
        html = html.replace(/{OEFFNUNGMI}/g, this._data.oeffnungMi);
        html = html.replace(/{OEFFNUNGDO}/g, this._data.oeffnungDo);
        html = html.replace(/{OEFFNUNGFR}/g, this._data.oeffnungFr);
        html = html.replace(/{OEFFNUNGSA}/g, this._data.oeffnungSa);
        html = html.replace(/{OEFFNUNGSO}/g, this._data.oeffnungSo);

        // HTML-Template in echte DOM-Objekte umwandeln, damit wir es mit den
        // DOM-Methoden von JavaScript weiterbearbeiten können
        let pageDom = document.createElement("div");
        pageDom.innerHTML = html;

        //Nur die Sterne, die durchschnittlich vergeben wurden, werden angezeigt
        let reviewStars = pageDom.querySelectorAll(".star-config");
        if(bewertung!=5) {
          for(let i=0; i<(5-bewertung); i++) {
            reviewStars[i].style.display='none';
          }
        } else {
          reviewStars[4].style.marginRight='0em'
        }

        //Es wird mit leeren Sternen aufgefüllt
        let emptyReviewStars = pageDom.querySelectorAll(".empty-star-config");
        if(bewertung==5) {
          for(let i=0; i<(4); i++) {
            emptyReviewStars[i].style.display='none';
          }
        } else {
          for(let i=0; i<(bewertung-1); i++) {
            emptyReviewStars[i].style.display='none';
          }
          emptyReviewStars[3].style.marginRight='0em';
        }


        // Event Handler für den Button registrieren
        pageDom.querySelectorAll(".id").forEach(e => e.textContent = this._recordId);
        pageDom.querySelector("#review-button").addEventListener("click", () => this._onReviewButtonClicked());
        pageDom.querySelector("#gallery-button").addEventListener("click", () => this._onGalleryButtonClicked());
        // Fertig bearbeitetes HTML-Element zurückgeben
        return pageDom;
    }

    /**
     * Beispiel für einen einfachen Event Handler, der bei Klick auf einen
     * Button aufgerufen wird.
     */
    _onReviewButtonClicked() {
      location.hash = `#/Reviews/${this._data.id}`;
    }

    _onGalleryButtonClicked() {
      location.hash = `#/Gallery/${this._data.id}`;
    }

    async bewertungBerechnen() {
      let allRestaurantReviews;
      let bewertung = 0;
      allRestaurantReviews = await this._app.database.selectReviewsByRestaurantId(this._recordId, "hilfreich");
      allRestaurantReviews.forEach(review => {
        bewertung = bewertung + parseFloat(review.bewertung);
      });
      bewertung = Math.round((bewertung/allRestaurantReviews.length));
      console.log("bewertung: " + bewertung);
      return bewertung;
    }
}
