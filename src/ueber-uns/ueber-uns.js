//js Ueber uns
 class UeberUns {
     /**
      * Konstruktor
      * @param {App} app Zentrale Instanz der App-Klasse
      */
     constructor(app) {
         this._app = app;
         this._recordId = -1;
         this._data = null;

         async show(matches) {
             // // URL-Parameter auswerten
             // this._recordId = matches[1];
             // this._data = this._app.database.getRecordById(this._recordId);

             // Anzuzeigenden Seiteninhalt nachladen
             let html = await fetch("ueber-uns/ueber-uns.html");
             let css = await fetch("ueber-uns/ueber-uns.css");

             if (html.ok && css.ok) {
                 html = await html.text();
                 css = await css.text();
             } else {
                 console.error("Fehler beim Laden des HTML/CSS-Inhalts");
                 return;
             }

             // Seite zur Anzeige bringen
             let pageDom = this._processTemplate(html);

             this._app.setPageTitle("Ueber uns");
             this._app.setPageCss(css);
             this._app.setPageHeader(pageDom.querySelector("header"));
             this._app.setPageContent(pageDom.querySelector("main"));
         }
     }
