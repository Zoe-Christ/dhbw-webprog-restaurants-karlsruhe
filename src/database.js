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
        this._restaurants = this._db.collection("restaurants");
        this._comments = this._db.collection("comments");
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
        let restaurants = await this.selectAllRestaurants();

        if (restaurants.length < 1) {
            this.saveRestaurants([{
                "id":          "1",
                "img":        "restaurants/emaille.jpg",
                "name":       "Cafe Emaille",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2005,
                "bewertung":   "In Fahrt",
                "link":       "https://cafeemaille.de/",
                "beschreibung":"Das Studentenlokal mit Emailleschildern an den Wänden und Biergarten serviert Frühstück und herzhafte Küche.",
            },{
                "id":          "2",
                "img":        "restaurants/bleu.png",
                "name":       "Cafe Bleu",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1968,
                "bewertung":   "Westlich von Island gesunken",
                "link":       "https://www.cafe-bleu.de/",
                "beschreibung":"Das Café-Restaurant mit Biergarten bietet deftige Hausmannskost in uriger Aufmachung mit Emailleschildern."
            },{
                "id":          "3",
                "img":        "restaurants/oxford.png",
                "name":       "Oxford Cafe",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1958,
                "bewertung":   "In Fahrt",
                "link":       "https://oxford-cafe.de/",
                "beschreibung":"Das Oxford Cafe begeistert dich täglich mit seiner vielfältigen Auswahl an Getränken und internationalen Bieren."
            },{
                "id":          "4",
                "img":        "restaurants/stoevchen.jpg",
                "name":       "Stoevchen",
                "typ":        "Frühstück-, Mittag- und Abendessen",
                "gruendungsjahr": 1916,
                "bewertung":   "In Fahrt",
                "link":       "https://www.stoevchen.com/",
                "beschreibung":"Leckere Cocktails, Hammer Frühstück und gutes Essen zu günstigen Preisen gibt es bei uns im Stövchen Karlsruhe."
            },{
                "id":          "5",
                "img":        "restaurants/aposto.jpg",
                "name":       "Aposto",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2006,
                "bewertung":   "Kollision im Ärmelkanal",
                "link":       "https://karlsruhe.aposto.eu/",
                "beschreibung":"Hausgemachte Pasta, Pizza und Grillgerichte an edlen hellen Holztischen zwischen Säulen und auf der Terrasse."
            },{
                "id":          "6",
                "img":        "restaurants/vapiano.jpg",
                "name":       "Vapiano",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 2010,
                "bewertung":   "Museum im Portsmouth",
                "link":       "https://de.vapiano.com/de/nc/restaurants/vapiano-karlsruhe-karlstrasse-11-1/",
                "beschreibung":"Mischung aus Pasta-Lokal, Pizzeria, Lounge und Bar nach italienischem Vorbild. Selbstbedienung ist ein wesentliches Element des Konzepts von Vapiano."
            },{
                "id":          "7",
                "img":        "restaurants/badisches_brauhaus.jpg",
                "name":       "Badisches Brauhaus",
                "typ":        "Mittag- und Abendessen",
                "gruendungsjahr": 1999,
                "bewertung":   "Kulturdenkmal in Bremen-Vegesack",
                "link":       "https://www.badisch-brauhaus.de/",
                "beschreibung": "Umfangreich und vielfältig, für jeden etwas. Mit Produkten aus der Region, ausgezeichnet von Schmeck-den-Süden."
            },]);
        }
    }
    /**
     * Gibt alle in der Datenbank gespeicherten Bücher zurück. Hier gilt
     * dasselbe wie im Kommentar zur Methode createDemoData() geschrieben.
     * Alle Dokumente auf einmal auszulesen ist nur dann eine gute Idee,
     * wenn man weiß, dass es nicht viele geben kann. Besser wäre daher,
     * die Menge mit der where()-Funktion von Firebase einzuschränken.
     *
     * @returns Promise-Objekt mit den gespeicherten Büchern
     */
    async selectAllRestaurants() {
        let result = await this._restaurants.orderBy("name").get();
        let restaurants = [];

        result.forEach(entry => {
            let restaurant = entry.data();
            restaurants.push(restaurants);
        });

        return restaurants;
    }

    /**
     * Gibt ein einzelnes Buch anhand seiner ID zurück.
     * @param id: ID des gesuchten Buches
     * @returns Promise-Objekt mit dem gesuchten Buch
     */
    async selectRestaurantById(id) {
        let result = await this._restaurants.doc(id).get();
        return result.data();
    }

    /**
     * Speichert ein einzelnes Buch in der Datenbank. Das hierfür übergebene
     * Objekt sollte folgenden Aufbau haben:
     *
     *      {
     *          id:        "MeinBuch1",
     *          title:     "Name des Buches",
     *          authors:   "Namen der Autoren",
     *          edition:   "8. Auflage",
     *          publisher: "Name des Verlags",
     *          year:      2019,
     *      }
     *
     * @param restaurants: Zu speicherndes Buch-Objekt
     */
    saveBook(restaurant) {
        this._restaurants.doc(restaurant.id).set(restaurant);
    }

    /**
     * Löscht ein einzelnes Buch aus der Datenbank.
     * @param id: ID des zu löschenden Buches
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteRestaurantById(id) {
        return this._restaurants.doc(id).delete();
    }

    /**
     * Speichert die übergebenen Bücher in der Datenbank. Die hier übergebene
     * Liste sollte folgenden Aufbau haben:
     *
     *      [
     *          {
     *              id:        "MeinBuch1",
     *              title:     "Name des Buches",
     *              authors:   "Namen der Autoren",
     *              edition:   "8. Auflage",
     *              publisher: "Name des Verlags",
     *              year:      2019,
     *          }, {
     *              ...
     *          },
     *     ]
     *
     * @param restaurants: Liste mit den zu speichernden Objekten
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async saveRestaurants(restaurants) {
        let batch = this._db.batch();

        restaurants.forEach(restaurant => {
            let dbRestaurant = this._restaurants.doc(restaurant.id);
            batch.set(dbRestaurant, restaurant);
        });

        return batch.commit();
    }

    /**
     * Löscht eines oder mehrerer Bücher aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Bücher
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteRestaurantsById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbRestaurant = this._restaurants.doc(id);
            batch.delete(dbRestaurant);
        });

        return batch.commit();
    }
}


// class Database {
//     /**
//      * Konstruktor.
//      */
//
//     constructor() {
//
//         this._data = [
//             {
//                 id:          1,
//                 img:        "restaurants/emaille.jpg",
//                 name:       "Cafe Emaille",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 2005,
//                 bewertung:   "In Fahrt",
//                 link:       "https://cafeemaille.de/",
//                 beschreibung:"Das Studentenlokal mit Emailleschildern an den Wänden und Biergarten serviert Frühstück und herzhafte Küche.",
//             },{
//                 id:          2,
//                 img:        "restaurants/bleu.png",
//                 name:       "Cafe Bleu",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 1968,
//                 bewertung:   "Westlich von Island gesunken",
//                 link:       "https://www.cafe-bleu.de/",
//                 beschreibung:"Das Café-Restaurant mit Biergarten bietet deftige Hausmannskost in uriger Aufmachung mit Emailleschildern."
//             },{
//                 id:          3,
//                 img:        "restaurants/oxford.png",
//                 name:       "Oxford Cafe",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 1958,
//                 bewertung:   "In Fahrt",
//                 link:       "https://oxford-cafe.de/",
//                 beschreibung:"Das Oxford Cafe begeistert dich täglich mit seiner vielfältigen Auswahl an Getränken und internationalen Bieren."
//             },{
//                 id:          4,
//                 img:        "restaurants/stoevchen.jpg",
//                 name:       "Stoevchen",
//                 typ:        "Frühstück-, Mittag- und Abendessen",
//                 gruendungsjahr: 1916,
//                 bewertung:   "In Fahrt",
//                 link:       "https://www.stoevchen.com/",
//                 beschreibung:"Leckere Cocktails, Hammer Frühstück und gutes Essen zu günstigen Preisen gibt es bei uns im Stövchen Karlsruhe."
//             },{
//                 id:          5,
//                 img:        "restaurants/aposto.jpg",
//                 name:       "Aposto",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 2006,
//                 bewertung:   "Kollision im Ärmelkanal",
//                 link:       "https://karlsruhe.aposto.eu/",
//                 beschreibung:"Hausgemachte Pasta, Pizza und Grillgerichte an edlen hellen Holztischen zwischen Säulen und auf der Terrasse."
//             },{
//                 id:          6,
//                 img:        "restaurants/vapiano.jpg",
//                 name:       "Vapiano",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 2010,
//                 bewertung:   "Museum im Portsmouth",
//                 link:       "https://de.vapiano.com/de/nc/restaurants/vapiano-karlsruhe-karlstrasse-11-1/",
//                 beschreibung:"Mischung aus Pasta-Lokal, Pizzeria, Lounge und Bar nach italienischem Vorbild. Selbstbedienung ist ein wesentliches Element des Konzepts von Vapiano."
//             },{
//                 id:          7,
//                 img:        "restaurants/badisches_brauhaus.jpg",
//                 name:       "Badisches Brauhaus",
//                 typ:        "Mittag- und Abendessen",
//                 gruendungsjahr: 1999,
//                 bewertung:   "Kulturdenkmal in Bremen-Vegesack",
//                 link:       "https://www.badisch-brauhaus.de/",
//                 beschreibung: "Umfangreich und vielfältig, für jeden etwas. Mit Produkten aus der Region, ausgezeichnet von Schmeck-den-Süden."
//             },
//         ];
//     }
//
//     /**
//      * Diese Methode sucht einen Datensazt anhand seiner ID in der Datenbank
//      * und liefert den ersten, gefundenen Treffer zurück.
//      *
//      * @param  {Number} id Datensatz-ID
//      * @return {Object} Gefundener Datensatz
//      */
//     getRecordById(id) {
//         id = parseInt(id);
//         return this._data.find(r => r.id === id);
//     }
//
//     /**
//      * Diese Methode gibt eine Liste mit allen Datensätzen zurück.
//      * @return {Array} Liste aller Datensätze
//      */
//     getAllRecords() {
//         return this._data;
//     }
// }
