var contextMenuItem = {
    "id": "ptPopdic",
    "title": "PT POPDIC",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

var httpGet = function httpGet(url, callback) {
    var err = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : console.error;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        return callback(request.responseText);
    };
    request.onerror = function () {
        return err(request);
    };
    request.send();
};

chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId === contextMenuItem.id && clickData.selectionText) {
        httpGet('http://ptdic.lento.in/api?query=' + clickData.selectionText, function (data) {
            data = JSON.parse(data);
            if (data.error) {
                var notiOptions = {
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: clickData.selectionText,
                    message: '단어를 찾지 못했습니다.'
                };
                return chrome.notifications.create(clickData.selectionText + Math.random(), notiOptions);
            }

            var title = data.entry + ' ' + (data.phoneticSigns || '') ;
            var message = data.meanings.reduce(function (acc, val, idx) {
                return idx === 0 ? (val.partOfSpeech || '') + " " + val.value : acc + ", " + val.value;
            }, '');

            var notiOptions = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title: title,
                message: message
            };

            // console.log('callback', data);
            chrome.notifications.create(clickData.selectionText + Math.random(), notiOptions);
        });
    }
});

// var contextMenuItem = {
//     "id": "ptPopdic",
//     "title": "PT POPDIC",
//     "contexts": ["selection"]
// };

// chrome.contextMenus.create(contextMenuItem)

// const httpGet = (url, callback, err = console.error) => {
//     const request = new XMLHttpRequest()
//     request.open('GET', url, true)
//     request.onload = () => callback(request.responseText)
//     request.onerror = () => err(request)
//     request.send()
//   }

// chrome.contextMenus.onClicked.addListener(function(clickData) {
//     if (clickData.menuItemId === contextMenuItem.id && clickData.selectionText){
//         httpGet('http://ptdic.lento.in/api?query=' + clickData.selectionText, (data) => {
//             data = JSON.parse(data)
//             const title = data.entry + ' ' + data.phoneticSigns
//             const message = data.meanings.reduce((acc, val, idx) => idx === 0 ? `${val.partOfSpeech} ${val.value}` : `${acc}, ${val.value}` , '')

//             var notiOptions = {
//                 type: 'basic',
//                 iconUrl: 'icon48.png',
//                 title,
//                 message
//             }

//             console.log('callback', data)
//             chrome.notifications.create(clickData.selectionText + Math.random(), notiOptions)
//         })
//     }
// })
