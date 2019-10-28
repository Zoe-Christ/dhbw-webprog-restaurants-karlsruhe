class Reviews {
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
      this._data = this._app.database.getRecordById(this._recordId);

      // Anzuzeigenden Seiteninhalt nachladen
      let html = await fetch("reviews/reviews.html");
      let css = await fetch("reviews/reviews.css");

      if (html.ok && css.ok) {
          html = await html.text();
          css = await css.text();
      } else {
          console.error("Fehler beim Laden des HTML/CSS-Inhalts");
          return;
      }

      // Seite zur Anzeige bringen
      let pageDom = document.createElement("div")
      html = this._processTemplate(html);
      pageDom.innerHTML = html;

      this._app.setPageTitle(`Bewertungen zu ${this._data.name}`, {isSubPage: true});
      this._app.setPageCss(css);
      this._app.setPageHeader(pageDom.querySelector("header"));
      this._app.setPageContent(pageDom.querySelector("main"));
  }

  _processTemplate(html) {
      return html;
  }
}
