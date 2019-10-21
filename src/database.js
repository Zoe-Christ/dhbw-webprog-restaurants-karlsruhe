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
                img:        "emaille.jpg",
                name:       "Cafe Emaille",
                typ:        "Ewer",
                stapellauf: 1909,
                verbleib:   "In Fahrt",
                link:       "https://de.wikipedia.org/wiki/Petrine",
            },{
                id:          2,
                img:        "bleu.jpg",
                name:       "Cafe Bleu",
                typ:        "Brigatine",
                stapellauf: 1968,
                verbleib:   "Westlich von Island gesunken",
                link:       "https://de.wikipedia.org/wiki/Falado_von_Rhodos",
            },{
                id:          3,
                img:        "oxford.png",
                name:       "Oxford Cafe",
                typ:        "Segelschiff",
                stapellauf: 1958,
                verbleib:   "In Fahrt",
                link:       "https://de.wikipedia.org/wiki/Gorch_Fock_(Schiff,_1958)",
            },{
                id:          4,
                img:        "stoevchen.jpg",
                name:       "Stoevchen",
                typ:        "Dreimastmarstoppsegelschoner",
                stapellauf: 1916,
                verbleib:   "In Fahrt",
                link:       "https://de.wikipedia.org/wiki/Mare_Frisium",
            },{
                id:          5,
                img:        "aposto.jpg",
                name:       "Aposto",
                typ:        "Frachtsegler",
                stapellauf: 1902,
                verbleib:   "Kollision im Ärmelkanal",
                link:       "https://de.wikipedia.org/wiki/Preu%C3%9Fen_(Schiff,_1902)",
            },{
                id:          6,
                img:        "vapiano.jpg",
                name:       "Vapiano",
                typ:        "Linienschiff",
                stapellauf: 1765,
                verbleib:   "Museum im Portsmouth",
                link:       "https://de.wikipedia.org/wiki/HMS_Victory",
            },{
                id:          7,
                img:        "badisches_brauhaus.jpg",
                name:       "Badisches Brauhaus",
                typ:        "Segelschulschiff",
                stapellauf: 1927,
                verbleib:   "Kulturdenkmal in Bremen-Vegesack",
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
