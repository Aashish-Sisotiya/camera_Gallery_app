/**
 * ! OPEN A DATABASE
 * ! CREATE OBJECT-STORE
 * ! PERFORM TRANSACTION
 * **/
let db;
let openRequest = indexedDB.open("myDataBase");

openRequest.addEventListener("success", (e) => {
    console.log("Db success");
    db = openRequest.result;
})

openRequest.addEventListener("error", (e) => {
    console.log("Db error");
})

openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("Db upgraeded and also for initial DB creation");
    db = openRequest.result; // got access to the database

    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });

})

