"use strict";

/**
 * Klasse Database: Kümmert sich um die Datenhaltung der App
 *
 * Diese Klasse beinhaltet alle Datensätze der App. Entgegen dem Namen handelt
 * es sich nicht wirklich um eine Datenbank, da sie lediglich ein paar statische
 * Testdaten enthält. Ausgefeilte Methoden zum Durchsuchen, Ändern oder Löschen
 * der Daten fehlen komplett, könnten aber in einer echten Anwendung relativ
 * einfach hinzugefügt werden.
 */
class Database {
    /**
     * Konstruktor.
     */
    constructor() {
        this._data = [
            {
                id:          1,
                img:        "restaurants/emaille.jpg",
                name:       "Cafe Emaille",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 2005,
                bewertung:   "In Fahrt",
                link:       "https://cafeemaille.de/",
            },{
                id:          2,
                img:        "restaurants/bleu.jpg",
                name:       "Cafe Bleu",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1968,
                bewertung:   "Westlich von Island gesunken",
                link:       "https://de.wikipedia.org/wiki/Falado_von_Rhodos",
            },{
                id:          3,
                img:        "restaurants/oxford.png",
                name:       "Oxford Cafe",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1958,
                bewertung:   "In Fahrt",
                link:       "https://de.wikipedia.org/wiki/Gorch_Fock_(Schiff,_1958)",
            },{
                id:          4,
                img:        "restaurants/stoevchen.jpg",
                name:       "Stoevchen",
                typ:        "Frühstück-, Mittag- und Abendessen",
                gruendungsjahr: 1916,
                bewertung:   "In Fahrt",
                link:       "https://de.wikipedia.org/wiki/Mare_Frisium",
            },{
                id:          5,
                img:        "restaurants/aposto.jpg",
                name:       "Aposto",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 2006,
                bewertung:   "Kollision im Ärmelkanal",
                link:       "https://de.wikipedia.org/wiki/Preu%C3%9Fen_(Schiff,_1902)",
            },{
                id:          6,
                img:        "restaurants/vapiano.jpg",
                name:       "Vapiano",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 2010,
                bewertung:   "Museum im Portsmouth",
                link:       "https://de.wikipedia.org/wiki/HMS_Victory",
            },{
                id:          7,
                img:        "restaurants/badisches_brauhaus.jpg",
                name:       "Badisches Brauhaus",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1999,
                bewertung:   "Kulturdenkmal in Bremen-Vegesack",
                link:       "https://de.wikipedia.org/wiki/Schulschiff_Deutschland",
            },
        ];
    }

    /**
     * Diese Methode sucht einen Datensazt anhand seiner ID in der Datenbank
     * und liefert den ersten, gefundenen Treffer zurück.
     *
     * @param  {Number} id Datensatz-ID
     * @return {Object} Gefundener Datensatz
     */
    getRecordById(id) {
        id = parseInt(id);
        return this._data.find(r => r.id === id);
    }

    /**
     * Diese Methode gibt eine Liste mit allen Datensätzen zurück.
     * @return {Array} Liste aller Datensätze
     */
    getAllRecords() {
        return this._data;
    }
}
