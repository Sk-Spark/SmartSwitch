#include <WiFi.h>
#include <ESP32WebServer.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

#include "index_html.h"
#include "main_js.h"
#include "main_css.h"

const char *ssid = "SparkMI";
const char *password = "123456789";

#define SERVO_PIN 2 // D2 for ESP8266, GPIO2 for ESP32
Servo myservo;
int servoPosition = 90;
char *switchStatus = "OFF";
ESP32WebServer server(80);

void handleOptions()
{
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Add other methods if needed
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "text/plain", "");
}

void handleRoot()
{
  // String html = "<html><head>  <style>    .switch {position: relative;width: 60px;height: 34px;margin-top: 10px;margin-left: 20px;    }    .switch input {opacity: 0;width: 0;height: 0;    }    .slider {position: absolute;cursor: pointer;top: 0;left: 0;right: 0;bottom: 0;background-color: #ccc;-webkit-transition: .4s;transition: .4s;    }    .slider:before {position: absolute;content: '';height: 26px;width: 26px;left: 4px;bottom: 4px;background-color: white;-webkit-transition: .4s;transition: .4s;    }    input:checked+.slider {background-color: #2196F3;    }    input:focus+.slider {box-shadow: 0 0 1px #2196F3;    }    input:checked+.slider:before {-webkit-transform: translateX(26px);-ms-transform: translateX(26px);transform: translateX(26px);    }    .slider.round {border-radius: 34px;    }    .slider.round:before {border-radius: 50%;    }  </style>  <script>    document.addEventListener('DOMContentLoaded', function () {const servoCheckbox = document.getElementById('servoCheckbox');const apiUrl = '/servo';servoCheckbox.addEventListener('change', function () {  const isChecked = this.checked;  if (isChecked) {    makeApiCall('90');  } else {    makeApiCall('0');  }});function makeApiCall(action) {  fetch(apiUrl, {    method: 'POST',    body: action,    headers: {'Content-Type': 'application/json',    },  })    .then(response => {if (!response.ok) {  throw new Error('Network response was not ok');}return response.json();    })    .then(data => {console.log('API response:', data);    })    .catch(error => {console.error('There was a problem with the fetch operation:', error);    });}    });  </script></head><body style='align-content: center;'>  <h1>Smart Switch</h1>  <div style='display:inline-flex;'>    <h3>Geyser</h3>    <label class='switch'><input type='checkbox' id='servoCheckbox'><span class='slider round'></span>    </label>  </div></body></html>";
  server.send(200, "text/html", index_html);
}

void handleMainJs()
{
  server.send(200, "application/javascript", main_js);
}

void handleServo()
{
  StaticJsonDocument<200> root;
  String message = "Save State:\n";
  uint pin, value;
  String postBody = server.arg("plain");
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, postBody);
  if (error)
  {
    // if the file didn't open, print an error:
    Serial.print(F("Error parsing JSON "));
    Serial.println(error.c_str());
    String msg = error.c_str();
    server.send(400, F("text/html"), "Error in parsin json body! <br>" + msg);
  }
  else
  {
    JsonObject postObj = doc.as<JsonObject>();
    Serial.println("Received body:");
    Serial.println(postBody);
    myservo.attach(SERVO_PIN);

    if (postObj.containsKey("pin"))
    {
      String s_pin = postObj["pin"];
      message += "pin: ";
      message += s_pin + '\n';
      pin = s_pin.toInt();
    }
    if (postObj.containsKey("value"))
    {
      String val = postObj["value"];
      message += val + '\n';
      value = val.toInt();
    }

    // Send CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Add other methods if needed
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

    if (servoPosition != value)
    {
      servoPosition = value;
      Serial.println("servoPosition");
      Serial.println(servoPosition);
      if (servoPosition != 0)
      {
        switchStatus = "ON";
      }
      else
      {
        switchStatus = "OFF";
      }
      if (servoPosition > 180)
      {
        servoPosition = 180;
      }
      if (servoPosition < 0)
      {
        servoPosition = 0;
      }
      myservo.write(servoPosition);
      server.send(200, "text/plain", "OK");
    }
    else
    {
      server.send(400, "text/plain", "Bad Request");
    }
    delay(1000);
    myservo.detach();
  }
}

void setup()
{
  Serial.begin(115200);
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/ping", [](){ server.send(200, "text/plain", "Pong (this works as well)"); });

  // server.on("/", HTTP_GET, handleRoot);

  server.on("/", [](){server.send(200, "text/html", index_html); });

  // server.on("/main.js", HTTP_GET, handleMainJs);
  server.on("/main.js", [](){
    Serial.println("main.js");
    server.send(200, "application/javascript", main_js); 
  });

  server.on("/main.css", [](){ server.send(200, "text/css", main_css); });

  // Handle OPTIONS requests for CORS
  server.on("/servo", HTTP_OPTIONS, handleOptions);

  server.on("/servo", HTTP_POST, handleServo);
  server.begin();
}

void loop()
{
  server.handleClient();
}
