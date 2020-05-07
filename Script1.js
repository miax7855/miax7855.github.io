
var Device;
var aService = 0x1800;       
var aCharacteristic = 0x2A00;   

function connect() {
    navigator.bluetooth.requestDevice({
        optionalServices: [aService],
        acceptAllDevices: true
    })
        .then(function (device) {
            //used for disconnect
            Device = device;
            console.log(device);
            return device.gatt.connect();
        })
        .then(function (server) {
            return server.getPrimaryService(aService);
        })
        .then(function (service) {
            return service.getCharacteristics();
        })
        .then(function (characteristics) {
            for (c in characteristics) {
                characteristics[c].startNotifications()
                    .then(subscribeToChanges);
            }
        })
        .catch(function (error) {
            console.error('fail', error);
        });
}

function subscribeToChanges(characteristic) {
    characteristic.oncharacteristicvaluechanged = handleData;
}

function handleData(event) {
    var buf = new Uint8Array(event.target.value);
    console.log(buf);
}

function disconnect() {
    if (Device) {
        // disconnect:
        Device.gatt.disconnect();
    }
}

