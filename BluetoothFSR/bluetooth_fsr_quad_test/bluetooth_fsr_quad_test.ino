/*
Reminder when compiling with Arduino UNO
If the port digital 0 or 1 (rx, tx) is occupied with other devices, installing may be stopped.
So if re-compiling is needed, pull out two pins and recover afeter installing.
*/


#include <LiquidCrystal.h>

#define FSR_NUM 4
#define FSR_INPUT_0 A0
#define FSR_INPUT_1 A1
#define FSR_INPUT_2 A2
#define FSR_INPUT_3 A3

#define LOOP_DELAY 20

#define BT_RATE 115200
 
void setup();
void loop();

void init_fsr()
{
  pinMode(FSR_INPUT_0, INPUT);
  pinMode(FSR_INPUT_1, INPUT);
  pinMode(FSR_INPUT_2, INPUT);
  pinMode(FSR_INPUT_3, INPUT);
}
 
 
void setup() {
  init_fsr();
   
  Serial.begin(BT_RATE);
}
 
void loop() {
  byte msg[1 + 2*FSR_NUM + 1];
  
  // message header
  msg[0] = 0x1;
  
  uint16_t fsr_val_0 = analogRead(FSR_INPUT_0);
  msg[1] = fsr_val_0 >> 8;
  msg[2] = fsr_val_0 & 0xff;
    
  uint16_t fsr_val_1 = analogRead(FSR_INPUT_1);
  msg[3] = fsr_val_1 >> 8;
  msg[4] = fsr_val_1 & 0xff;
    
  uint16_t fsr_val_2 = analogRead(FSR_INPUT_2);
  msg[5] = fsr_val_2 >> 8;
  msg[6] = fsr_val_2 & 0xff;
    
  uint16_t fsr_val_3 = analogRead(FSR_INPUT_3);
  msg[7] = fsr_val_3 >> 8;
  msg[8] = fsr_val_3 & 0xff;
  
  msg[9] = 0x2;

  /*  
  if(Serial.available() > 0){
    Serial.println(fsr_val_0);
    Serial.println(fsr_val_1);
    Serial.println(fsr_val_2);
    Serial.println(fsr_val_3);
  }
  */
  
  // byteで送信
  //Serial.write(msg, sizeof(msg));
  // byfferを空にする
  //Serial.read();
  Serial.println(fsr_val_0);
  Serial.println(fsr_val_1);
  Serial.println(fsr_val_2);
  Serial.println(fsr_val_3);
  
  delay(LOOP_DELAY);
}
