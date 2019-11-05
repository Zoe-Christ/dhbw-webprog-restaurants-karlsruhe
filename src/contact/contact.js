// JS Seite Kontakt

 class Contact {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
    }

    /**
     * Inhalt der Seite anzeigen. Diese Methode wird hierfür von der
     * App-Klasse aufgerufen.
     */
    async show(matches) {
        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("contact/contact.html");
        let css = await fetch("contact/contact.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }

        // Seite zur Anzeige bringen
        let pageDom = document.createElement("div");
        html = this._processTemplate(html);
        pageDom.innerHTML = html;

        this._app.setPageTitle("Kontakt");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));



    }

    /**
     * HTML-Code vor der Anzeige verändern (Suchen und Ersetzen von Platzhaltern).
     */
    _processTemplate(html) {
        return html;
    }
}
