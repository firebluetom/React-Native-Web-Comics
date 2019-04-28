const HTMLParser = require('fast-html-parser');

export const getImageDetailsAtUrl = (url) => {
    return fetch(url, { cache: "force-cache" })
        .then((response) => response.text())
        .then((response) => {
            var root = HTMLParser.parse(response);

            let prev, next, afterComic;
            const { src, title } = root.querySelector('#cc-comic').attributes;
            const previousButton = root.querySelector('.cc-prev');
            const nextButton = root.querySelector('.cc-next');
            const afterComicImg = root.querySelector('#aftercomic img');

            if (previousButton) {
                ({ href: prev } = root.querySelector('.cc-prev').attributes);
            }
            if (nextButton) {
                ({ href: next } = root.querySelector('.cc-next').attributes);
            }
            if (afterComicImg) {
                ({ src: afterComic } = afterComicImg.attributes);
            }

            return {
                title,
                src,
                prev,
                next,
                afterComic,
            };

        })
        .catch((error) => {
            console.error(error);
        });
}
