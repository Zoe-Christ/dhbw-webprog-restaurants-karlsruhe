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
      this._data = await this._app.database.selectById(this._recordId, "restaurants");
      console.log(this._data);

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
      let pageDom = document.createElement("div");
      pageDom.innerHTML = html;

      await this._showReviews(pageDom);

      this._app.setPageTitle(`Bewertungen zu ${this._data.name}`, {isSubPage: true});
      this._app.setPageCss(css);
      this._app.setPageHeader(pageDom.querySelector("header"));
      this._app.setPageContent(pageDom.querySelector("main"));
  }

  /**
  * @param {HTMLElement} pageDom
  */
  async _showReviews(pageDom) {
    let mainElement = pageDom.querySelector("main");
    let templateElement = pageDom.querySelector("#review-template");

    // TODO set Dropdown href

    let reviewsData = await this._app.database.selectReviewsByRestaurantId(this._recordId);
    console.log(reviewsData);
    let options = {day: 'numeric', month: 'long', year: 'numeric'};

    reviewsData.forEach(review => {
      let html = templateElement.innerHTML;
      html = html.replace("{DATUM}", `${review.datum.toDate().toLocaleDateString("ge-GE", options)}`);
      html = html.replace("{BEWERTUNG}", review.bewertung);
      html = html.replace("{KOMMENTAR}", review.kommentar);
      html = html.replace("{AUTOR}", `~ ${review.autor}`);

      mainElement.innerHTML += html;
    });

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
