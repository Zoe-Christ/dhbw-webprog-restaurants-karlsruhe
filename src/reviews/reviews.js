class Reviews {
  constructor(app) {
      this._app = app;
      this._recordId = -1;
      this._data = null;
      this.orderValue = "datum";
      this.counterStar = 0;
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
    //Optionen für Datum
    let options = {day: 'numeric', month: 'numeric', year: 'numeric'};

    reviewsData.forEach(review => {
      let oneTemp, boxes, stars;

      oneTemp = temp.content.cloneNode(true)

      let contents = oneTemp.querySelectorAll(".review-content");
      console.log("contents: " + contents);
      // Datum
      contents[0].innerHTML = review.datum.toDate().toLocaleDateString("ge-GE", options);
      //Sterne
      stars = oneTemp.querySelectorAll(".icon-star");
      for (let i=0; i<review.bewertung; i++) {
        stars[i].style.display = 'inline';
      }
      //Kommentar und Autor
      contents[2].innerHTML = `"${review.kommentar}" <br><br>~ ${review.autor}`;

      // ja-Button
      let jaBtn = document.createElement('i');
      jaBtn.id = `ja-${review.id}`;
      jaBtn.className += "icon-thumbs-up"
      jaBtn.onclick = (async () => {
        let num = await this._app.database.selectById(review.id,"reviews");
        this._app.database.changeDocValue("reviews", review.id, "hilfreich",
          (num.hilfreich +1) );
      });

      // nein-Button
      let neinBtn = document.createElement('i');
      neinBtn.id = `nein-${review.id}`;
      neinBtn.className += "icon-thumbs-down"
      neinBtn.onclick = (async () => {
        let num = await this._app.database.selectById(review.id,"reviews");
        this._app.database.changeDocValue("reviews", review.id, "hilfreich",
          (num.hilfreich -1) );
      });

      contents[3].appendChild(jaBtn);
      contents[3].appendChild(neinBtn);

      // template einpassen
      wrapper.appendChild(oneTemp);
    });

    let newReviewTemp = pageDom.querySelector("#new-review-template");
    let secondTemp = newReviewTemp.content.cloneNode(true);
    let reviewStarsEmpty = secondTemp.querySelectorAll(".icon-star-empty");
    let reviewStars = secondTemp.querySelectorAll(".icon-star");

    // ClickListener bei Sternen in neuer Review
    for (let i=0; i<reviewStarsEmpty.length;i++) {
      reviewStarsEmpty[i].addEventListener("click", () => this.onClickStar(i));
      // reviewStarsEmpty[i].addEventListener("mouseover", () => this.whenMouseOver(i));
    };

    for (let i=0; i<reviewStars.length;i++) {
      reviewStars[i].addEventListener("click", () => this.onClickStar(i));
    };

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
  }

  cancelNewReview() {
    location.reload();
  }

//async changeDocValue(collection, docId, docField, docValue)
  async submitNewReview() {
    let text = document.querySelector(".new-review-content");

    if (text[0].value == '') {
      text[0].style.backgroundColor = '#F5A9A9';
    } else if (text[1].value == '') {
      text[1].style.backgroundColor = '#F5A9A9';
    } else if (this.counterStar == 0) {
      let warnStars = document.querySelectorAll(".review-star-empty i");
      for(let i = 0; i<warnStars.length; i++) {
        warnStars[i].style.color = 'red';
      }
    } else {
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
        "bewertung": this.counterStar.toString(),
        "hilfreich": 0,
        datum: firebase.firestore.FieldValue.serverTimestamp()
      });

      this.counterStar = 0;
      location.reload();
    }
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

  async onClickStar(starNumber) {
    let reviewStars, clickedCheckContainer, emptyReviewStars;
    //wird verwendet um später die korrekte Sternenzahl in der Datenbank zu speichern
    this.counterStar = starNumber+1;

    reviewStars = document.getElementsByClassName("review-star-full");
    emptyReviewStars = document.getElementsByClassName("review-star-empty2")
    clickedCheckContainer = document.getElementById("review-star-empty-id");

    /* dem div "review-star-empty" wird die Klasse star-clicked hinzugefügt
    ** so wird später das mouseover event nur ausgeführt, falls die Sterne nicht
    ** schon geklickt wurden
    */
    clickedCheckContainer.classList.add("star-clicked")

    console.log("counterStar" + this.counterStar);

    for(let i=0; i<5; i++) {
      if (i<=starNumber) {
        //die Sternenanzahl, die geklickt wurde, wird sichtbar gemacht
        reviewStars[i].classList.add("show-stars");
      } else {
        if(reviewStars[i].classList.contains("show-stars")) {
          reviewStars[i].classList.remove("show-stars");
        }
      }
      // emptyReviewStars[i].removeEventListener("mouseover", this.whenMouseOver(starNumber))
    }
  }

  // async whenMouseOver(starNumber) {
  //   let reviewStars, clickedCheckContainer;
  //
  //   clickedCheckContainer = document.getElementById("review-star-empty-id");
  //
  //   if(!clickedCheckContainer.classList.contains("star-clicked")) {
  //     console.log("mouseover");
  //     reviewStars = document.getElementsByClassName("review-star-full");
  //
  //     for(let i=0; i<=starNumber; i++) {
  //         //die Sternenanzahl, die geklickt wurde, wird sichtbar gemacht
  //         reviewStars[i].classList.add("show-stars");
  //         setTimeout(() => {
  //           reviewStars[i].classList.remove("show-stars");
  //         }, 500);
  //
  //     }
  //   }
  //
  // }
}
