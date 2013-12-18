#include <Wire.h>
#include <Servo.h>

#include <Max3421e.h>
#include <Usb.h>
//#include <AndroidAccessory.h>
//#include <CapSense.h>

#define  BUTTON1        11
#define  BUTTON2        12
#define  BUTTON3        13
#define  BUTTON4        10

// analog out (PWM)
#define ANALOG_OUT_FSR_LEFT 6
#define ANALOG_OUT_FSR_MID  7
#define ANALOG_OUT_FSR_RIGHT 8

//デジタル出力用ピン番号の定義:the digital output pins
#define xLow            A0//14
#define xHigh           A1//15
#define yLow            A2//16
#define yHigh           A3//17

//FSR
#define FSR0            A0//left bottom
#define FSR1            A1//left top
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

void init_analog_out()
{
  pinMode(ANALOG_OUT_FSR_LEFT, OUTPUT);
  pinMode(ANALOG_OUT_FSR_MID, OUTPUT);
  pinMode(ANALOG_OUT_FSR_RIGHT, OUTPUT);
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

  //init_buttons();
  init_analog_out();
  init_fsr();

  /*
  b1 = digitalRead(BUTTON1);
  b2 = digitalRead(BUTTON2);
  b3 = digitalRead(BUTTON3);
  b4 = digitalRead(BUTTON4);
  */

  //delay(100);
  //acc.powerOn();
  Serial.print("\r\nSetupEnd");
}

void loop(){  

  //read value from fsr
  uint16_t val0 = analogRead(FSR0);
  uint16_t val1 = analogRead(FSR1);
  uint16_t val2 = analogRead(FSR2);
  uint16_t val3 = analogRead(FSR3);
  uint16_t val4 = analogRead(FSR4);
  uint16_t val5 = analogRead(FSR5);
  
  // 各セクションでの最大値を計算
  uint16_t val_left = max(val0, val1);
  uint16_t val_mid = max(val2, val3);
  uint16_t val_right = max(val4, val5);
  
//  Serial.println("raw data");
//  Serial.println(val_left);
//  Serial.println(val_mid);
//  Serial.println(val_right);


  
  // ベースを1023 -> 255 に変更　and konashi 1.3v に変換
//  val_left = val_left * 256.0/1024.0 * 1.3/5.0;
//  val_mid = val_mid * 256.0/1024.0 * 1.3/5.0;
//  val_right = val_right * 256.0/1024.0 * 1.3/5.0;

  // アナログ出力
  analogWrite(ANALOG_OUT_FSR_LEFT, val_left);
  analogWrite(ANALOG_OUT_FSR_MID, val_mid);
  analogWrite(ANALOG_OUT_FSR_RIGHT, val_right);

  Serial.println("corrected data");
  Serial.println(val_left);
  Serial.println(val_mid);
  Serial.println(val_right);
  delay(10);
}

