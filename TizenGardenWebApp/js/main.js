window.onload = function() {
    initMQTTConnection();
    initGraph(); 
	
	
    // listener for hardware "back" button onboard
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
}

var BROKER_ADDRESS = "106.109.130.18";
var BROKER_PORT = 1884;
var CLIENT_ID = "tatyana";
var MQTTClient; //MQTT client object
function initMQTTConnection() {
	MQTTClient = new Paho.MQTT.Client(BROKER_ADDRESS, BROKER_PORT, CLIENT_ID);
	MQTTClient.onConnectionLost = onConnectionLost;
	MQTTClient.onMessageArrived = onMessageArrived;
	MQTTClient.connect({onSuccess:onConnect});
}

function onConnectionLost(responseObject) {
	console.log("Соединение потеряно! " +
			" Код: " + responseObject.ErrorCode + 
			" Текст: " + responseObject.errorMessage);
}

function onMessageArrived(message) {
	  console.log("Пришло сообщение: " + message.payloadString);
}

//A topic from which we want to receive messages
var TOPIC_SUB = "devices/lora/807B85902000019A/#";
function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("Успешное соединение");
	  MQTTClient.subscribe(TOPIC_SUB);
}

function sendMQTTMessage(text, destinationTopic)
{
	var message = new Paho.MQTT.Message(text);
	message.destinationName = destinationTopic;
	try {
		MQTTClient.send(message);
		console.log("Отправлено сообщение: " + text + " по адресу " + destinationTopic);	
	}
	catch (e) {
		console.log("Невозможно отправить сообщение")
	}
}


var GPIO_TOPIC = "devices/lora/807B85902000019A/gpio";
var LIGHT_GPIO = 17;
var WATER_GPIO = 16;

function setLight(flag) {	
	var message = "set " + LIGHT_GPIO + " " + flag;
	sendMQTTMessage(message, GPIO_TOPIC);		
	alert("Статус света изменен на: " + flag);	
}

function setWater(flag) {	
	var message = "set " + WATER_GPIO + " " + flag;
	sendMQTTMessage(message, GPIO_TOPIC);	
	alert("Статус воды изменен на: " + flag);
}

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
