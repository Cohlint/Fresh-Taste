importScripts('js/cache-polyfill.js'); // cache 扩展

var CACHE_NAME = 'app-v1'; // 缓存文件的版本
var CACHE_FILES = [ // 需要缓存的页面文件
    '/',
    './app.js',
    './app.css'
];

self.addEventListener('install', function (event) { // 监听worker的install事件
    console.log('installed!');
    event.waitUntil( // 延迟install事件直到缓存初始化完成
        caches.open(CACHE_NAME)
              .then(function (cache) {
                  console.log('Opened cache', cache);
                  return cache.addAll(CACHE_FILES);
              })
    );
});

self.addEventListener('activate', function (event) { // 监听worker的activate事件
    event.waitUntil( // 延迟activate事件直到
        caches.keys().then(function(keys){
            console.log('keys:', keys)
            return Promise.all(keys.map(function(key, i){ // 清除旧版本缓存
                if(key !== CACHE_NAME){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )

    // event.waitUntil(
    //     caches.keys().then(function(cacheNames) {
    //         return Promise.all(
    //             cacheNames.map(function(cacheName) {
    //                 if(cacheWhitelist.indexOf(cacheName) === -1) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         );
    //     })
    // );
});

self.addEventListener('fetch', function (event) { // 截取页面的资源请求
    event.respondWith( // 返回页面的资源请求
        caches.match(event.request).then(function(res){ // 判断缓存是否命中
            // Cache hit - return response
            if(res){  // 返回缓存中的资源
                //console.log(res)
                // console.log('Caught request for ' + event.request.url);
                return res;
                // return (new Response("Hello world!"));
            }


            console.log('In fetch')
            //requestBackend(event); // 执行请求备份操作
            return fetch(event.request);

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response

            //var fetchRequest = event.request.clone();

            // return fetch(fetchRequest).then(
            //     function(response) {
            //         // Check if we received a valid response
            //         if(!response || response.status !== 200 || response.type !== 'basic') {
            //             return response;
            //         }
            //
            //         // IMPORTANT: Clone the response. A response is a stream
            //         // and because we want the browser to consume the response
            //         // as well as the cache consuming the response, we need
            //         // to clone it so we have 2 stream.
            //         var responseToCache = response.clone();
            //
            //         caches.open(CACHE_NAME)
            //               .then(function(cache) {
            //                   cache.put(event.request, responseToCache);
            //               });
            //
            //         return response;
            //     }
            // );
        })
    )
});

function requestBackend(event){  // 请求备份操作
    var url = event.request.clone();
    return fetch(url).then(function(res){ // 请求线上资源
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_NAME).then(function(cache){ // 缓存从线上获取的资源
            cache.put(event.request, response);
        });

        return res;
    })
}

self.addEventListener('message', function(event) {

    const data = event.data;     console.log(event);
    if(data.command === 'oneWayCommunication') {
        console.log(`Message from the Page : ${data.message}`);
    }
    if (data.command === 'twoWayCommunication') {
        event.ports[0].postMessage({
            message: 'Hi, Page'
        });
    }
});


