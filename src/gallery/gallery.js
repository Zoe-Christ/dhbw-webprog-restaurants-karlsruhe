class Gallery {
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
      console.log(this._data);

      // Anzuzeigenden Seiteninhalt nachladen
      let html = await fetch("gallery/gallery.html");
      let css = await fetch("gallery/gallery.css");

      if (html.ok && css.ok) {
          html = await html.text();
          css = await css.text();
      } else {
          console.error("Fehler beim Laden des HTML/CSS-Inhalts");
          return;
      }

      // Seite zur Anzeige bringen
      let pageDom = document.createElement("div");
      pageDom.innerHTML = html;

      await this._showGallery(pageDom);

      this._app.setPageTitle(`Fotogalerie zu ${this._data.name}`, {isSubPage: true});
      this._app.setPageCss(css);
      this._app.setPageHeader(pageDom.querySelector("header"));
      this._app.setPageContent(pageDom.querySelector("main"));
  }

  /**
  * @param {HTMLElement} pageDom
  */
  async _showGallery(pageDom) {
    let mainElement = pageDom.querySelector("main");
    let templateElement = pageDom.querySelector("#gallery-template");

    let html = templateElement.innerHTML;


    if(this._data.bilder){
        for(var i=0; i< this._data.bilder.length;i++){
            html+= '<img src="'+this._data.bilder[i]+'" alt="" width="400" />';
        }
    }
    mainElement.innerHTML += html;
    return pageDom;
  }

  /* When the user clicks on the button,
  toggle between hiding and showing the dropdown content */
  // showDropDown() {
  //   document.getElementById("reihenfolge").classList.toggle("show");
  // }
  //
  // // Close the dropdown menu if the user clicks outside of it
  // window.onclick = (event) => {
  //   if (!event.target.matches('.dropdown-button')) {
  //     var dropdowns = document.getElementsByClassName("dropdown-content");
  //     var i;
  //     for (i = 0; i < dropdowns.length; i++) {
  //       var openDropdown = dropdowns[i];
  //       if (openDropdown.classList.contains('show')) {
  //         openDropdown.classList.remove('show');
  //       }
  //     }
  //   }
  // }

  newReview() {

  }

}
