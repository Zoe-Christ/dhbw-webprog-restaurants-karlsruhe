class Reviews {
  constructor(app) {
      this._app = app;
      this._recordId = -1;
      this._data = null;
      this.orderValue = "datum";
  }

  /**
   * Seite anzeigen. Wird von der App-Klasse aufgerufen.
   */
  async show(matches, sort) {
      sort = sort || null;
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

      if (sort == null) {
        await this._showReviews(pageDom, this.orderValue);
      } else {
        await this._showReviews(pageDom, sort);
      }


      this._app.setPageTitle(`Bewertungen zu ${this._data.name}`, {isSubPage: true});
      this._app.setPageCss(css);
      this._app.setPageHeader(pageDom.querySelector("header"));
      this._app.setPageContent(pageDom.querySelector("main"));
  }

  /**
  * @param {HTMLElement} pageDom
  */
  async _showReviews(pageDom, sort) {
    console.log("sort: " + sort);
    let wrapper = pageDom.querySelector("#rev-wrapper");
    let temp = pageDom.querySelector("#review-template");

    let reviewsData = await this._app.database.selectReviewsByRestaurantId(this._recordId, sort);
    // console.log("reviewsLength: " + reviewsData.length);
    let options = {day: 'numeric', month: 'long', year: 'numeric'};
    // mainElement.innerHTML = null;

    reviewsData.forEach(review => {
      let oneTemp, boxes;

      oneTemp = temp.content.cloneNode(true)

      let contents = oneTemp.querySelectorAll(".review-content");
      console.log("contents: " + contents);
      contents[0].innerHTML = review.datum.toDate().toLocaleDateString("ge-GE", options);
      contents[1].innerHTML = `${review.bewertung} von 5 Sternen`;
      contents[2].innerHTML = `"${review.kommentar}" - ${review.autor}`;
      // contents[3].innerHTML = "War diese Bewertung hilfreich?"

      // ja-Button
      let jaBtn = document.createElement('input');
      jaBtn.type = "button";
      jaBtn.id = `ja-${review.id}`;
      jaBtn.className += "hilfreich-button"
      jaBtn.value = "ja";
      jaBtn.onclick = (async () => {
        let num = await this._app.database.selectById(review.id,"reviews");
        this._app.database.changeDocValue("reviews", review.id, "hilfreich",
          (num.hilfreich +1) );
      });

      // nein-Button
      let neinBtn = document.createElement('input');
      neinBtn.type = "button";
      neinBtn.id = `nein-${review.id}`;
      neinBtn.className += "hilfreich-button"
      neinBtn.value = "nein";
      neinBtn.onclick = (async () => {
        let num = await this._app.database.selectById(review.id,"reviews");
        this._app.database.changeDocValue("reviews", review.id, "hilfreich",
          (num.hilfreich -1) );
      });

      // cells[5].textContent = "War diese Bewertung hilfreich?"
      contents[3].appendChild(jaBtn);
      contents[3].appendChild(neinBtn);

      // cells[6].textContent = &nbsp;

      // template einpassen
      wrapper.appendChild(oneTemp);
    });

    let newReviewTemp = pageDom.querySelector("#new-review-template");
    let secondTemp = newReviewTemp.content.cloneNode(true);
    wrapper.appendChild(secondTemp);



    // console.log(pageDom.querySelector("#ja-Button").parentElement.id);
    pageDom.querySelector("#plus-button").addEventListener("click", () => this.newReview());
    pageDom.querySelector("#cancel-new-review").addEventListener("click", () => this.cancelNewReview());
    pageDom.querySelector("#submit-new-review").addEventListener("click", () => this.submitNewReview());
    pageDom.querySelector("#dropdownBtn").addEventListener("click", () => this.showDropDown());

    let dropdownElement = pageDom.querySelector("#reihenfolge");
    let elements = dropdownElement.querySelectorAll("a");
    console.log("elemente: " + elements);
    // debugger;
    elements[0].addEventListener("click", () => this.orderBy("hilfreich"));
    elements[1].addEventListener("click", () => this.orderBy("datum"));
  }

  newReview() {
      event.preventDefault();

      let submitNewReviewDiv = document.querySelector("#new-review-anchor");
      let yPosition = submitNewReviewDiv.getBoundingClientRect().top;
      window.scrollTo(0, yPosition);

    // Single Page Router starten und die erste Seite aufrufen
    // window.addEventListener("hashchange", () => _app._handleRouting());
    // _app._handleRouting();
  }

  cancelNewReview() {
    location.reload();
  }

//async changeDocValue(collection, docId, docField, docValue)
  async submitNewReview() {
    let text = document.querySelector(".new-review-content");
    console.log(text);

    let num = await this._app.database.selectById("0", "reviews");
    let id = "" + this._recordId + "c" + (num[this._recordId] + 1);
    this._app.database.changeDocValue("reviews", "0", (""+this._recordId),
      (num[this._recordId] +1) )

    console.log(await this._app.database.selectById("0", "reviews"));
    this._app.database.saveDoc("reviews", {
      "id": id,
      "restaurant": this._recordId,
      "autor": text[0].value,
      "kommentar": text[1].value,
      "bewertung": text[2].value,
      "hilfreich": 0,
      datum: firebase.firestore.FieldValue.serverTimestamp()
    });

    location.reload();

  }

  /* When the user clicks on the button,
  toggle between hiding and showing the dropdown content */
  showDropDown() {
    document.getElementById("reihenfolge").classList.toggle("show");

  // Close the dropdown menu if the user clicks outside of it
    window.onclick = (event) => {
      if (!event.target.matches('.dropdown-button')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }

  async orderBy(orderVariable) {
    if (this._orderValue != orderVariable) {
      this._orderValue = orderVariable;
      this._app._handleRouting(orderVariable);
    }
  }
}
