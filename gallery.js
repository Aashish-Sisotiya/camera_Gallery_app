setTimeout(() => {

    if (db) {
        //video reterival


        let dbTransaction = db.transaction("video", "readonly");
        let videoStore = dbTransaction.objectStore("video");

        let videoRequest = videoStore.getAll();    // event driven

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                <video src="${url}" autoplay loop></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>`;
                ;
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener)
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);

            });
        }
        //image retreival

        let dbTransactionImg = db.transaction("image", "readonly");
        let imageStore = dbTransactionImg.objectStore("image");

        let imageRequest = imageStore.getAll();    // event driven

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                <img src="${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>`;
                ;
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener)
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener)

            });
        }



    }
}, 100)


//UI remove , DB remove
function deleteListener(e) {

    //DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");

        videoStore.delete(id);

    }
    else if (type == "img") {
        let dbTransactionImg = db.transaction("image", "readwrite");
        let imageStore = dbTransactionImg.objectStore("image");
        imageStore.delete(id);
    }

    //UI removal

    e.target.parentElement.remove();

}


function downloadListener(e) {

    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type == "vid") {
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");

        let videoRequest = videoStore.get(id);  //event driven


        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoUrl = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "stam.mp4";
            a.click();
        }

    }
    else if (type == "img") {
        let dbTransactionImg = db.transaction("image", "readwrite");
        let imageStore = dbTransactionImg.objectStore("image");

        let imageRequest = imageStore.get(id);  //event driven


        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let imageUrl = imageResult.url;
            let a = document.createElement("a");
            a.href = imageUrl;
            a.download = "image.jpg";
            a.click();
        }
    }

}