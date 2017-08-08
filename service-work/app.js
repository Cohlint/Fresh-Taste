//chrome://inspect/#service-workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {insecure: true}).then(function(registration) {
        if(!registration.installing) return;
        console.log("There is a ServiceWorker installing");
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ',    registration.scope);

        var worker = registration.installing;
        worker.addEventListener('statechange', function() {
            if(worker.state === 'redundant') {
                console.log('Install failed');
            }
            if(worker.state === 'installed') {
                console.log('Install successful!');
            }
        });

    }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}

function oneWayCommunication() {
    console.log(navigator.serviceWorker.controller)
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            command: 'oneWayCommunication',
            message: 'Hi, SW'
        });
    }
}

function twoWayCommunication() {
    if (navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
            console.log(`Response from the SW : ${event.data.message}`);
        }
        navigator.serviceWorker.controller.postMessage({
            command: 'twoWayCommunication',
            message: 'Hi, SW'
        }, [messageChannel.port2]);
    }
}/**
 * Created by Cohlint on 10/07/2017.
 */
