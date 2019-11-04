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
    // Alter Code
    // let mainElement = pageDom.querySelector("main");
    // let templateElement = pageDom.querySelector("#review-template");

    let tbody = pageDom.querySelector("#review-liste tbody");
    let temp = pageDom.querySelector("#review-template");

    tbody.innerHTML="";

    let reviewsData = await this._app.database.selectReviewsByRestaurantId(this._recordId);
    console.log(reviewsData);
    let options = {day: 'numeric', month: 'long', year: 'numeric'};
    // mainElement.innerHTML = null;

    reviewsData.forEach(review => {
      let oneTemp, cells;

      oneTemp = document.importNode(temp.content, true);

      cells = oneTemp.querySelectorAll("td");
      cells[0].textContent = review.datum.toDate().toLocaleDateString("ge-GE", options);
      cells[1].textContent = "";
      cells[2].textContent = review.bewertung;
      cells[3].textContent = `"${review.kommentar}"`;
      cells[4].textContent = ` - ${review.autor}`;

      // Button hinzufügen
      var jaBtn = document.createElement('input');
      jaBtn.type = "button";
      jaBtn.id = `ja-${review.id}`;
      jaBtn.value = "ja";
      jaBtn.onclick = (() => {
        review.hilfreich = 1 ;
      });
      cells[5].appendChild(jaBtn);
      // cells[5].textContent = &nbsp;

      // template einpassen
      tbody.appendChild(oneTemp);
    });

    // reviewsData.forEach(review => {

      // Alter Code

      // let html = templateElement.innerHTML;
      // // html.id = "review-template-" + review.id;
      // // html = html.replace("{DATUM}", `${review.datum.toDate().toLocaleDateString("ge-GE", options)}`);
      // html = html.replace("{BEWERTUNG}", review.bewertung);
      // html = html.replace("{KOMMENTAR}", review.kommentar);
      // html = html.replace("{AUTOR}", `~ ${review.autor}`);
      // let jaBtn = document.createElement("BUTTON");
      // jaBtn.id = "ja-Btn-" + review.id;
      // jaBtn.innerHTML = "ja";
      // html = html.replace("{JA-BUTTON}", jaBtn);
      // console.log(document.getElementById("ja-BUtton").id);
      // document.querySelector("#ja-Button").id = review.id;
      // console.log(document.querySelector("#ja-Button").id);

      // mainElement.innerHTML = mainElement.innerHTML + html;

    // });

    // console.log(pageDom.querySelector("#ja-Button").parentElement.id);
    pageDom.querySelector("#plus-button").addEventListener("click", () => this.newReview());
    pageDom.querySelector("#cancel-new-review").addEventListener("click", () => this.cancelNewReview());
    pageDom.querySelector("#submit-new-review").addEventListener("click", () => this.submitNewReview());
    pageDom.querySelector("#dropdownBtn").addEventListener("click", () => this.showDropDown());
  }

  newReview() {
    let element = document.getElementById("pop-up-review");
    element.style.display = "block";
  }

  cancelNewReview() {
    let element = document.getElementById("pop-up-review");
    element.style.display = "none";
  }

//async changeDocValue(collection, docId, docField, docValue)
  async submitNewReview() {
    let text = document.querySelector(".pop-up-review-container");
    let num = await this._app.database.selectById("0", "reviews");
    console.log(num);
    let id = "" + this._recordId + "c" + (num[this._recordId] + 1);
    console.log(id);
    this._app.database.changeDocValue("reviews", "0", (""+this._recordId), (num[this._recordId] +1) )
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

  }

  async hilfreichPlus() {

  }

  /* When the user clicks on the button,
  toggle between hiding and showing the dropdown content */
  showDropDown() {
    document.getElementById("reihenfolge").classList.toggle("show");
  }

  // Close the dropdown menu if the user clicks outside of it
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



}
