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
                beschreibung:"Das Studentenlokal mit Emailleschildern an den Wänden und Biergarten serviert Frühstück und herzhafte Küche.",
            },{
                id:          2,
                img:        "restaurants/bleu.png",
                name:       "Cafe Bleu",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1968,
                bewertung:   "Westlich von Island gesunken",
                link:       "https://www.cafe-bleu.de/",
                beschreibung:"Das Café-Restaurant mit Biergarten bietet deftige Hausmannskost in uriger Aufmachung mit Emailleschildern."
            },{
                id:          3,
                img:        "restaurants/oxford.png",
                name:       "Oxford Cafe",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1958,
                bewertung:   "In Fahrt",
                link:       "https://oxford-cafe.de/",
                beschreibung:"Das Oxford Cafe begeistert dich täglich mit seiner vielfältigen Auswahl an Getränken und internationalen Bieren."
            },{
                id:          4,
                img:        "restaurants/stoevchen.jpg",
                name:       "Stoevchen",
                typ:        "Frühstück-, Mittag- und Abendessen",
                gruendungsjahr: 1916,
                bewertung:   "In Fahrt",
                link:       "https://www.stoevchen.com/",
                beschreibung:"Leckere Cocktails, Hammer Frühstück und gutes Essen zu günstigen Preisen gibt es bei uns im Stövchen Karlsruhe."
            },{
                id:          5,
                img:        "restaurants/aposto.jpg",
                name:       "Aposto",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 2006,
                bewertung:   "Kollision im Ärmelkanal",
                link:       "https://karlsruhe.aposto.eu/",
                beschreibung:"Hausgemachte Pasta, Pizza und Grillgerichte an edlen hellen Holztischen zwischen Säulen und auf der Terrasse."
            },{
                id:          6,
                img:        "restaurants/vapiano.jpg",
                name:       "Vapiano",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 2010,
                bewertung:   "Museum im Portsmouth",
                link:       "https://de.vapiano.com/de/nc/restaurants/vapiano-karlsruhe-karlstrasse-11-1/",
                beschreibung:"Mischung aus Pasta-Lokal, Pizzeria, Lounge und Bar nach italienischem Vorbild. Selbstbedienung ist ein wesentliches Element des Konzepts von Vapiano."
            },{
                id:          7,
                img:        "restaurants/badisches_brauhaus.jpg",
                name:       "Badisches Brauhaus",
                typ:        "Mittag- und Abendessen",
                gruendungsjahr: 1999,
                bewertung:   "Kulturdenkmal in Bremen-Vegesack",
                link:       "https://www.badisch-brauhaus.de/",
                beschreibung: "Umfangreich und vielfältig, für jeden etwas. Mit Produkten aus der Region, ausgezeichnet von Schmeck-den-Süden."
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
