const PHOTO_CONTAINER = $('#photos-wrapper .photo-container');

function insertDefaultContent() {
    const IMG_NAMES = ['SquareAle_600.jpg', 'SquareLuca_600.jpg', '/discoInferno/circleDiscoInferno3.jpg', 'SquareRox_600.jpg', 'SquareWalt_600.jpg'];

    for (var i = 0; i < PHOTO_CONTAINER.length; i++) {
        PHOTO_CONTAINER[i].innerHTML = `<img src="media/photos/${IMG_NAMES[i]}" alt="">`;
    }
}

async function fetchInstagramMedia() {
    try {
        const RESPONSE = await $.ajax({
            url: 'api_server/instagram-media.php',
            method: 'GET',
        });

        if (RESPONSE.status == 500 || RESPONSE.status == 503) throw "Request Failed";
        
        const MEDIA = RESPONSE.data;
        let count = 0;
        for (let i = 0; i < MEDIA.length && count < 5; i++) {
            let mediaType = MEDIA[i].media_type;
            let imageUrl;
            let isVideo = false;
            if (mediaType === "IMAGE") {
                imageUrl = MEDIA[i].media_url;
            } else if (mediaType === "VIDEO") {
                imageUrl = MEDIA[i].thumbnail_url;
                isVideo = true;
            }
            let permalink = MEDIA[i].permalink;
        
            if (imageUrl && permalink) {
                PHOTO_CONTAINER[count].innerHTML = `
                    <a href="${permalink}" target="_blank" class="instagram-link">
                        ${isVideo ? '<i class="fa-solid fa-play"></i>' : ''}
                        <img src="${imageUrl}">
                    </a>
                `;
                count++;
            }
        }
    } catch (e) {
        insertDefaultContent();
    }
}
  
fetchInstagramMedia();