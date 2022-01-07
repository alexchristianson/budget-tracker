const indexedDB = window.indexedDB || window.mozindexedDB || window.msindexedDB;

let db;

const request = indexedDB.open("budget_db", 1);

request.onsuccess = (target) => {
    db = target.result;
    console.log(db);
    if (navigator.onLine) {
        checkDatabase ();
    }
};

request.onupgradeneeded = (target) => {
    let db = target.result;
    db.createObjectStore("Pending", {
        autoIncrement: true
    });
};

request.onerror = (event) => {
    console.log("Something went wrong!" + event.target.errorCode);
}

function saveRecord (record) {
    const transaction = db.transaction([ "Pending" ], "readwrite");
    const store = transaction.objectStore("Pending");
    store.add(record);
};