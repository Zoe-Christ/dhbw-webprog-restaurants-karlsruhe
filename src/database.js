"use strict";


/**
 * Zentrale Klasse für alle Datenbazugriffe. Diese Klasse versteckt die
 * Einzelheiten der Firebase-Datenbank vor dem Rest der Anwendung, indem
 * sie für alle benötigten Datenbankzugriffe eine Methode definiert, in der
 * der Zugriff auf Firebase ausprogrammiert wurde.
 *
 * Vgl. https://firebase.google.com/docs/firestore?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 * Vgl. https://firebase.google.com/docs/firestore/query-data/get-data?authuser=0
 */
class Database {
    /**
     * Konstruktor. Hier wird die Verbindung zur Firebase-Datenbank
     * hergestellt.
     *
     * Vgl. https://firebase.google.com/docs/firestore/quickstart
     */
    constructor() {
        // Diese Informationen müssen aus der Firebase-Konsole ermittelt
        // werden, indem dort ein neues Projekt mit einer neuen Datenbank
        // angelegt und diese dann mit einer neuen App verknüpft wird.
        firebase.initializeApp({
          apiKey: "AIzaSyB4-Qmsf9E7A3DcXR82uvyNiuDfu23X1R0",
          authDomain: "restaurantfinder-3c68a.firebaseapp.com",
          databaseURL: "https://restaurantfinder-3c68a.firebaseio.com",
          projectId: "restaurantfinder-3c68a",
          storageBucket: "restaurantfinder-3c68a.appspot.com",
          messagingSenderId: "780563355843",
          appId: "1:780563355843:web:8dee4f8a79f37e5fcfaa76"
        });

        // Dieses Objekt dient dem eigentlichen Datenbankzugriff.
        // Dabei können beliebig viele "Collections" angesprochen werden,
        // die in etwa den Tabellen einer klassischen Datenbank entsprechen.
        this._db = firebase.firestore();
    }

    /**
     * Hilfsfunktion zum Anlegen von Demodaten. Die Daten werden nur angelegt,
     * wenn die Collection komplett leer ist.
     *
     * Beachte, dass das Auslesen aller Datensätze keine gute Idee ist, weil
     * Firebase für jedes abgerufene Dokument eine Gebühr verlangt, wenn man
     * keinen kostenlosten Account hat. Dummerweise gibt es aber keine einfache
     * Funktion zum Ermitteln der Anzahl Datensätze. Siehe:
     *
     * https://stackoverflow.com/questions/46554091/cloud-firestore-collection-count
     *
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async createDemoData() {
        let restaurants = await this.selectAll("restaurants");
        if (restaurants.length < 1) {
            this.saveDocs("restaurants", [{
                "id":          "1",
                "img":        "restaurants/emaille.jpg",
                "name":       "Cafe Emaille",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2005,
                "bewertung":   "4.5",
                "link":       "https://cafeemaille.de/",
                "beschreibung":"Das Studentenlokal mit Emailleschildern an den Wänden und Biergarten serviert Frühstück und herzhafte Küche.",
                "oeffnungMo":   "08:00-01:00",
                "oeffnungDi":   "08:00-01:00",
                "oeffnungMi":   "08:00-01:00",
                "oeffnungDo":   "08:00-01:00",
                "oeffnungFr":   "08:00-01:00",
                "oeffnungSa":   "08:00-01:00",
                "oeffnungSo":   "08:00-01:00",
                "bilder": ["restaurants/hammer3.jpg" , "restaurants/hammer5.jpg" ],
            },{
                "id":          "2",
                "img":        "restaurants/bleu.png",
                "name":       "Cafe Bleu",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1968,
                "bewertung":   "Westlich von Island gesunken",
                "link":       "https://www.cafe-bleu.de/",
                "beschreibung":"Das Café-Restaurant mit Biergarten bietet deftige Hausmannskost in uriger Aufmachung mit Emailleschildern.",
                "oeffnungMo":   "08:00-01:00",
                "oeffnungDi":   "08:00-01:00",
                "oeffnungMi":   "08:00-01:00",
                "oeffnungDo":   "08:00-01:00",
                "oeffnungFr":   "08:00-01:00",
                "oeffnungSa":   "08:00-01:00",
                "oeffnungSo":   "08:00-01:00",
                "bilder": ["restaurants/bleu1.jpg" , "restaurants/hintergrund_cafe_bleu_02.jpg" , "restaurants/cafe-bleu-karlsruhe.jpg"],
            },{
                "id":          "3",
                "img":        "restaurants/oxford.png",
                "name":       "Oxford Cafe",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1958,
                "bewertung":   "In Fahrt",
                "link":       "https://oxford-cafe.de/",
                "beschreibung":"Das Oxford Cafe begeistert dich täglich mit seiner vielfältigen Auswahl an Getränken und internationalen Bieren.",
                "oeffnungMo":   "11:00-01:00",
                "oeffnungDi":   "11:00-01:00",
                "oeffnungMi":   "11:00-01:00",
                "oeffnungDo":   "11:00-01:00",
                "oeffnungFr":   "11:00-03:00",
                "oeffnungSa":   "11:00-03:00",
                "oeffnungSo":   "12:00-01:00",
                "bilder": ["restaurants/photo0jpg.jpg" , "restaurants/l.jpg"],
            },{
                "id":          "4",
                "img":        "restaurants/stoevchen.jpg",
                "name":       "Stoevchen",
                "typ":        "Frühstück-, Mittag- und Abendessen",
                "gruendungsjahr": 1916,
                "bewertung":   "In Fahrt",
                "link":       "https://www.stoevchen.com/",
                "beschreibung":"Leckere Cocktails, Hammer Frühstück und gutes Essen zu günstigen Preisen gibt es bei uns im Stövchen Karlsruhe.",
                "oeffnungMo":   "09:00-01:00",
                "oeffnungDi":   "09:00-01:00",
                "oeffnungMi":   "09:00-01:00",
                "oeffnungDo":   "09:00-01:00",
                "oeffnungFr":   "09:00-03:00",
                "oeffnungSa":   "09:00-03:00",
                "oeffnungSo":   "09:00-01:00",
                "bilder": ["restaurants/56f2c8780aef0.jpg" , "restaurants/photo1jpg.jpg"],
            },{
                "id":          "5",
                "img":        "restaurants/aposto.jpg",
                "name":       "Aposto",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2006,
                "bewertung":   "Kollision im Ärmelkanal",
                "link":       "https://karlsruhe.aposto.eu/",
                "beschreibung":"Hausgemachte Pasta, Pizza und Grillgerichte an edlen hellen Holztischen zwischen Säulen und auf der Terrasse.",
                "oeffnungMo":   "09:30-01:00",
                "oeffnungDi":   "09:30-01:00",
                "oeffnungMi":   "09:30-01:00",
                "oeffnungDo":   "09:30-01:00",
                "oeffnungFr":   "09:30-02:00",
                "oeffnungSa":   "09:30-02:00",
                "oeffnungSo":   "09:30-01:00",
                "bilder": ["restaurants/pizza.jpg" , "restaurants/Download.jpg" , "restaurants/Download (1).jpg","58809716_2275654172526624_5687719273546418066_n.jpg"],
            },{
                "id":          "6",
                "img":        "restaurants/vapiano.jpg",
                "name":       "Vapiano",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2010,
                "bewertung":   "Museum im Portsmouth",
                "link":       "https://de.vapiano.com/de/nc/restaurants/vapiano-karlsruhe-karlstrasse-11-1/",
                "beschreibung":"Mischung aus Pasta-Lokal, Pizzeria, Lounge und Bar nach italienischem Vorbild. Selbstbedienung ist ein wesentliches Element des Konzepts von Vapiano.",
                "oeffnungMo":   "11:00-23:30",
                "oeffnungDi":   "11:00-23:30",
                "oeffnungMi":   "11:00-23:30",
                "oeffnungDo":   "11:00-23:30",
                "oeffnungFr":   "11:00-00:30",
                "oeffnungSa":   "11:00-00:30",
                "oeffnungSo":   "11:00-23:30",
                "bilder": ["restaurants/Download (2).jpg" , "restaurants/csm_menu7_b22051ca4f.jpg" , "restaurants/vapiano3.jpg"],
            },{
                "id":          "7",
                "img":        "restaurants/badisches_brauhaus.jpg",
                "name":       "Badisches Brauhaus",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1999,
                "bewertung":   "Kulturdenkmal in Bremen-Vegesack",
                "link":       "https://www.badisch-brauhaus.de/",
                "beschreibung": "Umfangreich und vielfältig, für jeden etwas. Mit Produkten aus der Region, ausgezeichnet von Schmeck-den-Süden.",
                "oeffnungMo":   "11:30-00:00",
                "oeffnungDi":   "11:30-00:00",
                "oeffnungMi":   "11:30-00:00",
                "oeffnungDo":   "11:30-00:00",
                "oeffnungFr":   "11:30-01:00",
                "oeffnungSa":   "11:30-01:00",
                "oeffnungSo":   "11:30-00:00",
                "bilder": ["restaurants/IMG_0664_2-1.jpg" , "restaurants/rinderfilet-mit-pommes.jpg" , "restaurants/cafe-bleu-karlsruhe.jpg"],
            },]);
        }

        let reviews = await this.selectAll("reviews");
        if(reviews.length < 1) {
          await this.saveDocs("reviews", [{
            "id": "1c1",
            "restaurant": "1",
            "autor": "Sara Weis",
            "kommentar": "Sehr leckeres Essen zu günstigen Preisen und schnelle Bedienung.",
            "bewertung": 5,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "2c1",
            "restaurant": "2",
            "autor": "Joseph Stein",
            "kommentar": "Sehr schön zum Draußensitzen im Sommer. Leider kann man nicht mit Karte zahlen.",
            "bewertung": 4,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "3c1",
            "restaurant": "3",
            "autor": "Tim Frey",
            "kommentar": "Gutes Kellerbier - leider sitzt man etwas weit auseinander.",
            "bewertung": 3,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "4c1",
            "restaurant": "4",
            "autor": "Lara Osthaus",
            "kommentar": "Das Essen ist sehr lecker, aber man muss recht lange darauf warten.",
            "bewertung": 3,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "5c1",
            "restaurant": "5",
            "autor": "Lukas Schade",
            "kommentar": "Sehr gute Pizza und offene Küche. Besonders zu empfehlen an Donnerstagen, wenn man Cocktails würfeln kann.",
            "bewertung": 5,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "6c1",
            "restaurant": "6",
            "autor": "Martina Weckerle",
            "kommentar": "Cooles Konzept, da das Essen direkt vor den Kunden zubereitet wird. Teilweise sind die Wartezeiten allerdings relativ lang und die Portiionen nicht groß genug.",
            "bewertung": 4,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "7c1",
            "restaurant": "7",
            "autor": "Markus Becker",
            "kommentar": "Das Highlight war definitiv die Rutsche! Das Essen ist jedoch auch nicht schlecht und das Personal sehr freundlich.",
            "bewertung": 4,
            "hilfreich": 0,
            datum: firebase.firestore.FieldValue.serverTimestamp()
          }, {
            "id": "0",
            "1": 1,
            "2": 1,
            "3": 1,
            "4": 1,
            "5": 1,
            "6": 1,
            "7": 1,
          }]);
        }
    }
    /**
     * Gibt alle in der Datenbank gespeicherten Docs zurück. Hier gilt
     * dasselbe wie im Kommentar zur Methode createDemoData() geschrieben.
     * Alle Dokumente auf einmal auszulesen ist nur dann eine gute Idee,
     * wenn man weiß, dass es nicht viele geben kann. Besser wäre daher,
     * die Menge mit der where()-Funktion von Firebase einzuschränken.
     *
     * @param collection: Collection aus der geladen wird
     * @returns Promise-Objekt mit den gespeicherten Docs
     */
    async selectAll(collection) {
        let coll = this._db.collection(collection);
        let result = await coll.orderBy("id").get();
        let docs = [];

        result.forEach(entry => {
            let doc = entry.data();
            docs.push(doc);
        });

        return docs;
    }

    /**
     * Gibt ein einzelnes Doc anhand seiner ID zurück.
     * @param id: ID des gesuchten docs
     * @param collection: Collection aus der geladen wird
     * @returns Promise-Objekt mit dem gesuchten Doc
     */
    async selectById(id, collection) {
        let coll = this._db.collection(collection);
        let result = await coll.doc(id).get();
        return result.data();
    }

    /**
     * Speichert ein einzelnes doc in der Datenbank. Das hierfür übergebene
     * Objekt sollte folgenden Aufbau haben:
     *
     *      {
     *          id:        "MeinDoc1",
     *          title:     "Name des Docs",
     *          authors:   "Namen der Autoren",
     *          edition:   "8. Auflage",
     *          publisher: "Name des Verlags",
     *          year:      2019,
     *      }
     *
     * @param docs: Zu speicherndes doc-Objekt
     * @param collection: Collection in die gespeichert werden soll
     */
    saveDoc(collection, doc) {
        // this._restaurants.doc(doc.id).set(doc);
        this._db.collection(collection).doc(doc.id).set(doc);
    }

    /**
     * Löscht ein einzelnes doc aus der Datenbank.
     * @param id: ID des zu löschenden docs
     * @param collection: Collection aus der gelöscht werden soll
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteDocById(id, collection) {
        // return this._restaurants.doc(id).delete();
        return this._db.collection(collection).doc(id).delete();

    }

    /**
     * Speichert die übergebenen Docs in der Datenbank. Die hier übergebene
     * Liste sollte folgenden Aufbau haben:
     *
     *      [
     *          {
     *              id:        "MeinDoc1",
     *              title:     "Name des Docs",
     *              authors:   "Namen der Autoren",
     *              edition:   "8. Auflage",
     *              publisher: "Name des Verlags",
     *              year:      2019,
     *          }, {
     *              ...
     *          },
     *     ]
     *
     * @param docs: Liste mit den zu speichernden Objekten
     * @param collection: Collection in die gespeichert werden soll
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async saveDocs(collection, docs) {
        let batch = this._db.batch();

        docs.forEach(doc => {
            // let dbDoc = this._restaurants.doc(doc.id);
            let dbDoc = this._db.collection(collection).doc(doc.id);
            batch.set(dbDoc, doc);
        });

        return batch.commit();
    }

    /**
     * Löscht eines oder mehrere Docs aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Docs
     * @param collection: Collection aus der gelöscht werden soll
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteDocsById(ids, collection) {
        let batch = this._db.batch();

        ids.forEach(id => {
            // let dbDoc = this._restaurants.doc(id);
            let dbDoc = this._db.collection(collection).doc(id);
            batch.delete(dbDoc);
        });

        return batch.commit();
    }

    async selectReviewsByRestaurantId (resId, orderBy) {
      let coll = this._db.collection("reviews");
      let result = await coll.where("restaurant", "==", resId).orderBy(orderBy, "desc").get();
      let reviews = [];

      result.forEach(entry => {
          let doc = entry.data();
          reviews.push(doc);
      });

      return reviews;
    }

    async changeDocValue(collection, docId, docField, docValue) {
      let valueUpdate = {};
      valueUpdate[`${docField}`] = docValue;
      this._db.collection(collection).doc(docId).update(valueUpdate);

    }
}
