window.onload = function() {
    // listener for hardware "back" button onboard
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    initMQTTConnection();
    initGraph(); 
};

var BROKER_ADDRESS = "106.109.130.18";
var BROKER_PORT = 1884;
var MQTTClient; //MQTT client object
function initMQTTConnection() {
	MQTTClient = new Paho.MQTT.Client(BROKER_ADDRESS, Number(1884), "root");
	MQTTClient.onConnectionLost = onConnectionLost;
	MQTTClient.onMessageArrived = onMessageArrived;
	MQTTClient.onSuccess = onConnect;
	MQTTClient.connect();	
}

//A topic from which we want to receive messages
var TOPIC_SUB = "devices/lora/807B85902000019A/#";

function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("Успешное соединение");
	  MQTTClient.subscribe(TOPIC_SUB);
}

function onConnectionLost(responseObject) {
	console.log("Соединение потеряно! Код ошибки: " +  " Текст ошибки: " + responseObject.errorMessage);
}

function onMessageArrived(message) {
	  console.log("Пришло сообщение: " + message.payloadString);
}

function sendMQTTMessage(text, destination)
{
	var message = new Paho.MQTT.Message(text);
	message.destinationName = destination;
	try {
		MQTTClient.send(message);
		console.log("Отправлено сообщение: " + text + " по адресу " + destination);	
	}
	catch (e) {
		console.log("Невозможно отправить сообщение")
	}
}


var GPIO_TOPIC = "devices/lora/807B85902000019A/gpio";
var LIGHT_GPIO = 17;
var WATER_GPIO = 16;

//Command "set 17 1" turns on the light
//Command "set 17 0" turns off the light
function setLight(flag) {	
	var message = "set " + LIGHT_GPIO + " " + flag;
	sendMQTTMessage(message, GPIO_TOPIC);		
	alert("Статус света изменен на: " + flag);	
}

//Command "set 16 1" turns on the water
//Command "set 16 0" turns off the water
function setWater(flag) {	
	var message = "set " + WATER_GPIO + " " + flag;
	sendMQTTMessage(message, GPIO_TOPIC);	
	alert("Статус воды изменен на: " + flag);
}

//function to create demo graph
function initGraph() {
    var container = document.getElementById('visualization');
    var items = [
      {x: '2014-06-11', y: 10},
      {x: '2014-06-12', y: 25},
      {x: '2014-06-13', y: 30},
      {x: '2014-06-14', y: 10},
      {x: '2014-06-15', y: 15},
      {x: '2014-06-16', y: 30}
    ];
    var dataset = new vis.DataSet(items);
    var options = {
      start: '2014-06-10',
      end: '2014-06-18'
    };
    var graph2d = new vis.Graph2d(container, dataset, options);
}
