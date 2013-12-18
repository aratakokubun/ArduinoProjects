#include <Wire.h>
#include <Servo.h>

#include <Max3421e.h>
#include <Usb.h>
#include <AndroidAccessory.h>
#include <CapSense.h>

#define  BUTTON1        11
#define  BUTTON2        12
#define  BUTTON3        13
#define  BUTTON4        10

//デジタル出力用ピン番号の定義:the digital output pins
#define xLow            A0//14
#define xHigh           A1//15
#define yLow            A2//16
#define yHigh           A3//17

//FSR
#define  FSR0            A0//left bottom
#define  FSR1            A1//left top
#define FSR2             A2//mid bottom
#define FSR3             A3//mid top
#define FSR4             A4//right bottom
#define FSR5             A5//right top
/*
//no use
 #define FSR6             A6
 #define FSR7             A7
 #define FSR8             A8
 #define FSR9             A9
 */

#define  MAX_VAL        1023

#define ANDROID         true

AndroidAccessory acc("Google, Inc.",
"DemoKit",
"DemoKit Arduino Board",
"1.0",
"http://www.android.com",
"0000000012345678");

// 10M ohm resistor on demo shield
//CapSense   touch_robot = CapSense(TOUCH_SEND, TOUCH_RECV);

void setup();
void loop();

void init_buttons()
{
  pinMode(BUTTON1, INPUT);
  pinMode(BUTTON2, INPUT);
  pinMode(BUTTON3, INPUT);
  pinMode(BUTTON4, INPUT);

  // enable the internal pullups
  digitalWrite(BUTTON1, HIGH);
  digitalWrite(BUTTON2, HIGH);
  digitalWrite(BUTTON3, HIGH);
  digitalWrite(BUTTON4, HIGH);
}

void init_fsr()
{
  pinMode(FSR0, INPUT);
  pinMode(FSR1, INPUT);
  pinMode(FSR2, INPUT);
  pinMode(FSR3, INPUT);
  pinMode(FSR4, INPUT);
  pinMode(FSR5, INPUT);
  /*
        //no use
   pinMode(FSR6, INPUT);
   pinMode(FSR7, INPUT);
   pinMode(FSR8, INPUT);
   pinMode(FSR9, INPUT);
   */
}

byte b1, b2, b3, b4;
void setup(){
  //シリアル通信開始:start serial communication
  //Serial.begin(9600);
  Serial.begin(115200);
  Serial.print("\r\nStart");

  init_buttons();
  init_fsr();

  // autocalibrate OFF
  //touch_robot.set_CS_AutocaL_Millis(0xFFFFFFFF);

  b1 = digitalRead(BUTTON1);
  b2 = digitalRead(BUTTON2);
  b3 = digitalRead(BUTTON3);
  b4 = digitalRead(BUTTON4);

  delay(100);
  acc.powerOn();
  Serial.print("\r\nSetupEnd");
}

void loop(){  
  byte msg[5];
  byte allMsg[13];

  /*
  //X座標用端子をデジタル出力に設定し、それぞれをLOWとHIGHで出力しておく
   //set the both x-coordinate pins as digital output:one is Low the other is HIGH  
   pinMode(xLow,OUTPUT);
   pinMode(xHigh,OUTPUT);
   digitalWrite(xLow,LOW);
   digitalWrite(xHigh,HIGH);
   
   //Y座標用端子をLOWにしておく:the both y-coordinate pins are set to be LOW
   digitalWrite(yLow,LOW);
   digitalWrite(yHigh,LOW);
   
   //Y座標用端子をデジタル入力に設定:change the y-coordinate pins as digital input
   pinMode(yLow,INPUT);
   pinMode(yHigh,INPUT);
   delay(10);
   
   //アナログ入力２番ピン（yLowピン）で読み込み
   //read analog pin2(yLow pin) to get an x-coordinate value
   //int x=analogRead(yLow);
   uint16_t uint_x = analogRead(yLow);
   
   //Y座標用端子をデジタル出力に設定し、それぞれをLOWとHIGHで出力しておく
   //set the both y-coordinate pins as digital output:one is Low the other is HIGH 
   pinMode(yLow,OUTPUT);
   pinMode(yHigh,OUTPUT);
   digitalWrite(yLow,LOW);
   digitalWrite(yHigh,HIGH);
   
   //X座標用端子をLOWにしておく:the both x-coordinate pins are set to be LOW
   digitalWrite(xLow,LOW);
   digitalWrite(xHigh,LOW);
   
   //X座標用端子をデジタル入力に設定:change the x-coordinate pins as digital input
   pinMode(xLow,INPUT);
   pinMode(xHigh,INPUT);
   delay(10);
   
   //アナログ入力０番ピン（xLowピン）で読み込み
   //read analog pin0(xLow pin) to get an y-coordinate value
   //int y=analogRead(xLow);
   uint16_t uint_y = analogRead(xLow);
   */

  //read value from fsr
  uint16_t val0 = analogRead(FSR0);
  uint16_t val1 = analogRead(FSR1);
  uint16_t val2 = analogRead(FSR2);
  uint16_t val3 = analogRead(FSR3);
  uint16_t val4 = analogRead(FSR4);
  uint16_t val5 = analogRead(FSR5);
  /*
  //no use
   uint16_t val6 = analogRead(FSR6);
   uint16_t val7 = analogRead(FSR7);
   uint16_t val8 = analogRead(FSR8);
   uint16_t val9 = analogRead(FSR9);
   //add
   */

  if(!ANDROID){

  } 
  else {
    if (acc.isConnected()) {
      // androidとの通信    
      byte b;

      msg[0] = 0x1;

      b = digitalRead(BUTTON1);
      if (b != b1) {
        msg[1] = 0;
        msg[2] = b ? 0 : 1;
        acc.write(msg, 3);
        b1 = b;
      }

      b = digitalRead(BUTTON2);
      if (b != b2) {
        msg[1] = 1;
        msg[2] = b ? 0 : 1;
        acc.write(msg, 3);
        b2 = b;
      }

      b = digitalRead(BUTTON3);
      if (b != b3) {
        msg[1] = 2;
        msg[2] = b ? 0 : 1;
        acc.write(msg, 3);
        b3 = b;
      }

      b = digitalRead(BUTTON4);
      if (b != b4) {
        msg[1] = 3;
        msg[2] = b ? 0 : 1;
        acc.write(msg, 3);
        b4 = b;
      }

      /*
      // read from fsr
      msg[0] = 0x7;
      msg[1] = val0 >> 8;
      msg[2] = val0 & 0xff;
      acc.write(msg, 5);

      msg[0] = 0x8;
      msg[1] = val1 >> 8;
      msg[2] = val1 & 0xff;
      acc.write(msg, 5);

      msg[0] = 0x9;
      msg[1] = val2 >> 8;
      msg[2] = val2 & 0xff;
      acc.write(msg, 5);

      msg[0] = 0xa;
      msg[1] = val3 >> 8;
      msg[2] = val3 & 0xff;
      acc.write(msg, 5);

      msg[0] = 0xb;
      msg[1] = val4 >> 8;
      msg[2] = val4 & 0xff;
      acc.write(msg, 5);

      msg[0] = 0xc;
      msg[1] = val5 >> 8;
      msg[2] = val5 & 0xff;
      acc.write(msg, 5);
      */
      //send all at once
      allMsg[0] = 0xf;
      allMsg[1] = val0 >> 8;
      allMsg[2] = val0 & 0xff;
      allMsg[3] = val1 >> 8;
      allMsg[4] = val1 & 0xff;
      allMsg[5] = val2 >> 8;
      allMsg[6] = val2 & 0xff;
      allMsg[7] = val3 >> 8;
      allMsg[8] = val3 & 0xff;
      allMsg[9] = val4 >> 8;
      allMsg[10] = val4 & 0xff;
      allMsg[11] = val5 >> 8;
      allMsg[12] = val5 & 0xff;
      acc.write(allMsg, 13);

      /*
      //no use
       msg[0] = 0xd;
       msg[1] = val6 >> 8;
       msg[2] = val6 & 0xff;
       acc.write(msg, 5);
       
       msg[0] = 0xe;
       msg[1] = val7 >> 8;
       msg[2] = val7 & 0xff;
       acc.write(msg, 5);
       
       msg[0] = 0xf;
       msg[1] = val8 >> 8;
       msg[2] = val8 & 0xff;
       acc.write(msg, 5);
       
       msg[0] = 0x6;
       msg[1] = val9 >> 8;
       msg[2] = val9 & 0xff;
       acc.write(msg, 5);
       //add
       */

      delay(10);
      Serial.println(val0);
      Serial.println(val1);
      Serial.println(val2);
      Serial.println(val3);
      Serial.println(val4);
      Serial.println(val5);
    } 
    else {
      Serial.println(val0);
      Serial.println(val1);
      Serial.println(val2);
      Serial.println(val3);
      Serial.println(val4);
      Serial.println(val5);
    }
  }

}

