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
    let options = {day: 'numeric', month: 'long', year: 'numeric'};

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
      contents[2].innerHTML = `"${review.kommentar}" ~ ${review.autor}`;

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
    };

    wrapper.appendChild(secondTemp);

    // //MouseOver bei Sternen in neuer Review
    // for (let i=0; i<reviewStarsEmpty.length;i++) {
    //   reviewStarsEmpty[i].hover(() => {
    //     for(let j=0; j<=i; j++) {
    //       reviewStars[j].style.cursor = 'pointer';
    //       reviewStarsEmpty[j].style.cursor = 'pointer';
    //       reviewStars[j].toggleClass('show');
    //       console.log("mouseover: " + event.target);
    //     }
    //   });
    // };
    //   addEventListener("mouseover", () => {
    //     if (this.counterStar == 0) {
    //       console.log("" + this.counterStar);
    //       for(let j=0; j<=i; j++) {
    //         reviewStars[j].style.cursor = 'pointer';
    //         reviewStarsEmpty[j].style.cursor = 'pointer';
    //         reviewStars[j].style.display = 'inline';
    //         console.log("mouseover: " + event.target);
    //       }
    //     } else {}
    //   });
    // };

    //MouseOut bei Sternen in neuer review
    // for (let i=0; i<reviewStarsEmpty.length;i++) {
    //   reviewStarsEmpty[i].addEventListener("mouseout", () => {
    //     if (this.counterStar == 0) {
    //       console.log("" + this.counterStar);
    //       for(let j=0; j<=i; j++) {
    //         reviewStars[j].style.display = 'none';
    //         console.log("mouseout: " + event.target);
    //       }
    //     } else {}
    //   });
    // };



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
      "bewertung": this.counterStar.toString(),
      "hilfreich": 0,
      datum: firebase.firestore.FieldValue.serverTimestamp()
    });

    this.counterStar = 0;
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

  async onClickStar(starNumber) {
    let temp, reviewStars, clickedCheckContainer;
    //wird verwendet um später die korrekte Sternenzahl in der Datenbank zu speichern
    this.counterStar = starNumber+1;

    temp = document.getElementById("new-review-template");
    reviewStars = document.getElementsByClassName("review-star-full");
    clickedCheckContainer = document.getElementById("review-star-empty-id");

    console.log("" + this.counterStar);
    for(let i=0; i<=starNumber; i++) {
      //die Sternenanzahl, die geklickt wurde, wird sichtbar gemacht
      reviewStars[i].classList.add("show-stars");
    }

    /* dem div "review-star-empty" wird die Klasse star-clicked hinzugefügt
    ** so wird später das mouseover event nur ausgeführt, falls die Sterne nicht
    ** schon geklickt wurden
    */
    clickedCheckContainer.classList.add("star-clicked")
  }
}
