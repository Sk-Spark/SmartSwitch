#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

#include "index_html.h"
#include "main_js.h"
#include "main_css.h"
#include "main_js_zip.h"

const char *ssid = "SparkMI";
const char *password = "123456789";

#define SERVO_PIN 2 // D2 for ESP8266, GPIO2 for ESP32
Servo myservo;
int servoPosition = 90;
char *switchStatus = "OFF";
AsyncWebServer server(80);

bool handleTest(AsyncWebServerRequest *request, uint8_t *datas)
{

  Serial.printf("[REQUEST]\t%s\r\n", (const char *)datas);

  // DynamicJsonBuffer jsonBuffer;
  // JsonObject &_test = jsonBuffer.parseObject((const char *)datas);
  // if (!_test.success())
  //   return 0;

  // if (!_test.containsKey("command"))
  //   return 0;
  // String _command = _test["command"].asString();
  // Serial.println(_command);

  return 1;
}

void handleOptions(AsyncWebServerRequest *request)
{
  request->send(200, "text/plain", "");
}

void handleRoot(AsyncWebServerRequest *request)
{
  request->send_P(200, "text/html", index_html);
}

void handleServo(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
  StaticJsonDocument<200> root;
  String message = "Save State:\n";
  uint pin, value;

  // String postBody = data;
  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, data);
  if (error)
  {
    Serial.print(F("Error parsing JSON "));
    Serial.println(error.c_str());
    String msg = error.c_str();
    request->send(400, "text/html", "Error in parsing JSON body!<br>" + msg);
  }
  else
  {
    JsonObject postObj = doc.as<JsonObject>();
    Serial.println("Received body:");
    Serial.println((const char *)data);

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
      request->send(200, "text/plain", "OK");
    }
    else
    {
      request->send(400, "text/plain", "Bad Request");
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

  server.on("/ping", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", "Pong (this works as well)"); });

  server.on("/", HTTP_GET, handleRoot);

  server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    Serial.println("main.js");
    request->send_P(200, "application/javascript", main_js); });

  server.on("/main.css", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/css", main_css); });

  // Handle OPTIONS requests for CORS
  server.on("/servo", HTTP_OPTIONS, handleOptions);

  server.on("/servo", HTTP_POST, [](AsyncWebServerRequest * request){}, NULL, handleServo);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*"); 

  server.begin();
}

void loop()
{
  // server.handleClient();
}
