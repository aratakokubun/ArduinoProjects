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
/*
//no use
#define  FSR1            A1//left top
#define FSR2             A2//mid bottom
#define FSR3             A3//mid top
#define FSR4             A4//right bottom
#define FSR5             A5//right top
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
  /*
  //no use
  pinMode(FSR1, INPUT);
  pinMode(FSR2, INPUT);
  pinMode(FSR3, INPUT);
  pinMode(FSR4, INPUT);
  pinMode(FSR5, INPUT);
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

  //init_buttons();
  init_fsr();

  /*
  b1 = digitalRead(BUTTON1);
  b2 = digitalRead(BUTTON2);
  b3 = digitalRead(BUTTON3);
  b4 = digitalRead(BUTTON4);
  */

  delay(100);
  acc.powerOn();
  Serial.print("\r\nSetupEnd");
}

void loop(){  
  byte msg[3];
  byte allMsg[13];

  //read value from fsr
  uint16_t val0 = analogRead(FSR0);
  /*
  //no use
  uint16_t val1 = analogRead(FSR1);
  uint16_t val2 = analogRead(FSR2);
  uint16_t val3 = analogRead(FSR3);
  uint16_t val4 = analogRead(FSR4);
  uint16_t val5 = analogRead(FSR5);
  uint16_t val6 = analogRead(FSR6);
  uint16_t val7 = analogRead(FSR7);
  uint16_t val8 = analogRead(FSR8);
  uint16_t val9 = analogRead(FSR9);
   */

  if(!ANDROID){

  } else {
    if (acc.isConnected()) {
      // androidとの通信    
      byte b;

      /*
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
      */

      // read from fsr
      msg[0] = 0x7;
      msg[1] = val0 >> 8;
      msg[2] = val0 & 0xff;
      acc.write(msg, 3);

      /*
      //no use
      msg[0] = 0x8;
      msg[1] = val1 >> 8;
      msg[2] = val1 & 0xff;
      acc.write(msg, 3);

      msg[0] = 0x9;
      msg[1] = val2 >> 8;
      msg[2] = val2 & 0xff;
      acc.write(msg, 3);

      msg[0] = 0xa;
      msg[1] = val3 >> 8;
      msg[2] = val3 & 0xff;
      acc.write(msg, 3);

      msg[0] = 0xb;
      msg[1] = val4 >> 8;
      msg[2] = val4 & 0xff;
      acc.write(msg, 3);

      msg[0] = 0xc;
      msg[1] = val5 >> 8;
      msg[2] = val5 & 0xff;
      acc.write(msg, 3);

      msg[0] = 0xd;
      msg[1] = val6 >> 8;
      msg[2] = val6 & 0xff;
      acc.write(msg, 3);
       
      msg[0] = 0xe;
      msg[1] = val7 >> 8;
      msg[2] = val7 & 0xff;
      acc.write(msg, 3);
       
      msg[0] = 0xf;
      msg[1] = val8 >> 8;
      msg[2] = val8 & 0xff;
      acc.write(msg, 3);
       
      msg[0] = 0x6;
      msg[1] = val9 >> 8;
      msg[2] = val9 & 0xff;
      acc.write(msg, 3);
      */
      
      /*
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
      */

      delay(10);
      Serial.println(val0);
    } else {
      Serial.println(val0);
    }
  }

}

