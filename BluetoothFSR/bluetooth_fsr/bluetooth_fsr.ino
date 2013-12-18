/*
Reminder when compiling with Arduino UNO
If the port digital 0 or 1 (rx, tx) is occupied with other devices, installing may be stopped.
So if re-compiling is needed, pull out two pins and recover afeter installing.
*/


#include <LiquidCrystal.h>

#define FSR_INPUT_0 A0
#define FSR_INPUT_1 A1
#define FSR_INPUT_2 A2
#define FSR_INPUT_3 A3

#define MAX_VAL  1023
 
int data[128]={};
int incomingByte;
int dataLength = 0;
 
void setup();
void loop();

void init_fsr()
{
   pinMode(FSR_INPUT_0, INPUT);
  /*
  //no use
  pinMode(FSR_INPUT_1, INPUT);
  pinMode(FSR_INPUT_2, INPUT);
  pinMode(FSR_INPUT_3, INPUT);
  */
}
 
 
void setup() {
  init_fsr();
   
  Serial.begin(115200);
}
 
void loop() {
  uint16_t val0 = analogRead(FSR_INPUT_0);
  
  /*
  byte msg[3];
  msg[0] = 0x7;
  msg[1] = val0 >> 8;
  msg[2] = val0 & 0xff;
  
  Serial.print(msg);
  */
  
  Serial.println(val0, DEC);
  
  // emptize buffer
  Serial.read();
   
  delay(10);
}
