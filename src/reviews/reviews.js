class Reviews {
  constructor(app) {
      this._app = app;
      this._recordId = -1;
      this._data = null;
      // Default-Wert nach dem die Bewertungen geordnet werden
      this.orderValue = "datum";
      // Dient zur Zwischenspeicherung der Anzahl der Sterne aus dem Bewertungsformular
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

      // Dient dem neu-ordnen der Bewertungen bei Nutzung des "Ordnen nach"-Buttons
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
  * @param sort: String nach dem Sortiert wird
  */
  async _showReviews(pageDom, sort) {
    console.log("sort: " + sort);
    let wrapper = pageDom.querySelector("#rev-wrapper");
    let temp = pageDom.querySelector("#review-template");

    let reviewsData = await this._app.database.selectReviewsByRestaurantId(this._recordId, sort);
    //Anzeige-Optionen für das Datum
    let options = {day: 'numeric', month: 'numeric', year: 'numeric'};

    // Hinzufügen der Bewertungen im Vorlagen-Format
    reviewsData.forEach(review => {
      let oneTemp, boxes, stars;

      oneTemp = temp.content.cloneNode(true)

      let contents = oneTemp.querySelectorAll(".review-content");
      console.log("contents: " + contents);
      // Datum
      contents[0].innerHTML = review.datum.toDate().toLocaleDateString("ge-GE", options);
      // Ausgefüllte Sterne überlagern die leeren Sterne
      stars = oneTemp.querySelectorAll(".icon-star");
      for (let i=0; i<review.bewertung; i++) {
        stars[i].classList.add("show-stars");
      }
      //Kommentar und Autor
      contents[2].innerHTML = `"${review.kommentar}" <br><br>~ ${review.autor}`;

      // ja-Button als "Facebook-Like" mit ClickListener für das hochzählen der
      // hilfreich-Variable einer review
      let jaBtn = document.createElement('i');
      jaBtn.id = `ja-${review.id}`;
      jaBtn.className += "icon-thumbs-up"
      jaBtn.onclick = (async () => {
        let num = await this._app.database.selectById(review.id,"reviews");
        this._app.database.changeDocValue("reviews", review.id, "hilfreich",
          (num.hilfreich +1) );
      });

      // nein-Button als "Facebook-Dislike" mit ClickListener für das
      // runterzählen der hilfreich-Variable einer review
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

      // Befüllte Vorlage hinzufügen
      wrapper.appendChild(oneTemp);
    });

    // Hinzufügen des Formulars zum Erstellen einer neuen Bewertung
    let newReviewTemp = pageDom.querySelector("#new-review-template");
    let secondTemp = newReviewTemp.content.cloneNode(true);
    let reviewStarsEmpty = secondTemp.querySelectorAll(".icon-star-empty");
    let reviewStars = secondTemp.querySelectorAll(".icon-star");

    // ClickListener für volle und leere Sterne in neuer Review
    for (let i=0; i<reviewStarsEmpty.length;i++) {
      reviewStarsEmpty[i].addEventListener("click", () => this.onClickStar(i));
    };

    for (let i=0; i<reviewStars.length;i++) {
      reviewStars[i].addEventListener("click", () => this.onClickStar(i));
    };

    // Bewertungsformular hinzufügen
    wrapper.appendChild(secondTemp);

    // ClickListener für den "Hinzufüge"-, "Abbruch"- "Absende"- und "Ordnen nach"-Button registrieren
    pageDom.querySelector("#plus-button").addEventListener("click", () => this.newReview());
    pageDom.querySelector("#cancel-new-review").addEventListener("click", () => this.cancelNewReview());
    pageDom.querySelector("#submit-new-review").addEventListener("click", () => this.submitNewReview());
    pageDom.querySelector("#dropdownBtn").addEventListener("click", () => this.showDropDown());

    // Registrieren der ClickListener für die Auswahlmöglichkeiten von "Ordnen nach"
    let dropdownElement = pageDom.querySelector("#reihenfolge");
    let elements = dropdownElement.querySelectorAll("a");
    console.log("elemente: " + elements);
    elements[0].addEventListener("click", () => this.orderBy("hilfreich"));
    elements[1].addEventListener("click", () => this.orderBy("datum"));
  }

  /**
  * Spingt zur Stelle, an der das Formular für eine neue Bewertung Ausgefüllte
  * werden kann.
  */
  newReview() {
      event.preventDefault();

      let submitNewReviewDiv = document.querySelector("#new-review-anchor");
      let yPosition = submitNewReviewDiv.getBoundingClientRect().top;
      window.scrollTo(0, yPosition);
  }

  /**
  * Abbruch des Prozesses zur Erstellung einer neuen Bewertung.
  */
  cancelNewReview() {
    location.reload();
  }

  /**
  * Die Werte, die in das Formular eingegeben wurden, werden ausgelesen und es
  * wird ein neues Dokument für die Datenbank erstellt und gespeichert.
  * Sind Felder leer geblieben, oder wurde eine Auswahl nicht getroffen, so wird
  * der Benutzer durch farbliche Kennzeichnung darauf hingewiesen, die fehlenden
  * Werte einzutragen.
  */
  async submitNewReview() {
    let text = document.querySelector(".new-review-content");

    // Abfangen fehlender Werte
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
      // Hochzählen der Anzahl an abgegebenen Bewertungen und entsprechendes
      // Vergeben einer neuen Id
      let num = await this._app.database.selectById("0", "reviews");
      let id = "" + this._recordId + "c" + (num[this._recordId] + 1);
      this._app.database.changeDocValue("reviews", "0", (""+this._recordId),
        (num[this._recordId] +1) )

      // Anlegen eines neuen Dokuments
      console.log(await this._app.database.selectById("0", "reviews"));
      this._app.database.saveDoc("reviews", {
        "id": id,
        "restaurant": this._recordId,
        "autor": text[0].value,
        "kommentar": text[1].value,
        "bewertung": this.counterStar.toString(),
        "hilfreich": 0,
        datum: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Zurücksetzen der Variable zur Zwischenspeicherung der vergebenen Sterne
      this.counterStar = 0;
      location.reload();
    }
  }

  /**
  * Es wird zwischen dem Zeigen und dem Verbergen des Dropdown-Inhaltes gewechselt.
  * Klickt der User außerhalb des Buttons, so wird der Dropdown-Inhalt verborgen.
  */
  showDropDown() {
    // Anzeigen des Dropdown-Inhaltes
    document.getElementById("reihenfolge").classList.toggle("show");

    // Schließen des Dropdown-Menues bei Klicken außerhalb des Buttons
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

  /**
  * Neuordnen der Bewertungen nach neuerster oder hilfreichster
  * @param orderVariable: String , der angibt nach was geordnet werden soll
  */
  async orderBy(orderVariable) {
    if (this._orderValue != orderVariable) {
      this._orderValue = orderVariable;
      this._app._handleRouting(orderVariable);
    }
  }

  /**
  * Die vom Benutzer ausgewählte Zahl an Sternen für die Bewertung färbt sich gelb.
  * Die Anzahl der Sterne wird in der Variable "counterStar" zwischengespeichert
  * @param starNumber: number in der die Anzahl der Sterne zur Anzeige übergeben wird
  */
  async onClickStar(starNumber) {
    let reviewStars;
    //wird verwendet um später die korrekte Sternenzahl in der Datenbank zu speichern
    this.counterStar = starNumber+1;

    reviewStars = document.getElementsByClassName("review-star-full");

    for(let i=0; i<5; i++) {
      if (i<=starNumber) {
        //die Sternenanzahl, die geklickt wurde, wird sichtbar gemacht
        reviewStars[i].classList.add("show-stars");
      } else {
        // falls bereits Sterne ausgewählt wurden, werden diese hier wieder leer
        // gemacht
        if(reviewStars[i].classList.contains("show-stars")) {
          reviewStars[i].classList.remove("show-stars");
        }
      }
    }
  }
}
