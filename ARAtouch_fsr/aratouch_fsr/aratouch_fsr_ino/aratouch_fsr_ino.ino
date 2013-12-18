#include <Wire.h>
#include <Servo.h>

#include <Max3421e.h>
#include <Usb.h>
#include <AndroidAccessory.h>



#include <CapSense.h>

#define  LED3_RED       2
#define  LED3_GREEN     4
#define  LED3_BLUE      3

#define  BUTTON1        11
#define  BUTTON2        12

#define  TOUCH_RECV     14
#define  TOUCH_SEND     15

#define  FSR1           A0
#define  FSR2           A1
#define  MAX_VAL        1023

#define  JOY_SWITCH     A9      // pulls line down when pressed
#define  JOY_nINT       A10     // active low interrupt input
#define  JOY_nRESET     A11     // active low reset output

AndroidAccessory acc("Google, Inc.",
		     "DemoKit",
		     "DemoKit Arduino Board",
		     "1.0",
		     "http://www.android.com",
		     "0000000012345678");
Servo servos[3];

// 10M ohm resistor on demo shield
CapSense   touch_robot = CapSense(TOUCH_SEND, TOUCH_RECV);

void setup();
void loop();

void init_buttons()
{
	pinMode(BUTTON1, INPUT);
	pinMode(BUTTON2, INPUT);

	// enable the internal pullups
	digitalWrite(BUTTON1, HIGH);
	digitalWrite(BUTTON2, HIGH);
}

void init_leds()
{
	digitalWrite(LED3_RED, 1);
	digitalWrite(LED3_GREEN, 1);
	digitalWrite(LED3_BLUE, 1);

	pinMode(LED3_RED, OUTPUT);
	pinMode(LED3_GREEN, OUTPUT);
	pinMode(LED3_BLUE, OUTPUT);
}

void init_fsr()
{
        pinMode(FSR, INPUT);
}

void init_joystick(int threshold);

byte b1, b2, b3, b4, c;
void setup()
{
	Serial.begin(115200);
        //if need using other rate of serial speed, must using 9600
	Serial.print("\r\nStart");

	init_leds();

	init_buttons();

        init_fsr();

	// autocalibrate OFF
	touch_robot.set_CS_AutocaL_Millis(0xFFFFFFFF);

	b1 = digitalRead(BUTTON1);
	b2 = digitalRead(BUTTON2);
	c = 0;

	acc.powerOn();
}

void loop()
{
	byte err;
	byte idle;
	static byte count = 0;
	byte msg[3];
	long touchcount;
        // from other source
        // int maxVal = 1023;
        // float readVal = 0;

	if (acc.isConnected()) {
		int len = acc.read(msg, sizeof(msg), 1);
		int i;
		byte b;
		uint16_t val1, val2;
		int x, y;
		char c0;

		if (len > 0) {
			// assumes only one command per packet
			if (msg[0] == 0x2) {
				if (msg[1] == 0x0)
					;
				else if (msg[1] == 0x1)
					;
				else if (msg[1] == 0x2)
					;
				else if (msg[1] == 0x3)
					;
				else if (msg[1] == 0x4)
					;
				else if (msg[1] == 0x5)
					;
				else if (msg[1] == 0x6)
					analogWrite(LED3_RED, 255 - msg[2]);
				else if (msg[1] == 0x7)
					analogWrite(LED3_GREEN, 255 - msg[2]);
				else if (msg[1] == 0x8)
					analogWrite(LED3_BLUE, 255 - msg[2]);
				else if (msg[1] == 0x10)
					;
				else if (msg[1] == 0x11)
					;
				else if (msg[1] == 0x12)
					;
			} else if (msg[0] == 0x3) {
				if (msg[1] == 0x0)
                                        ;
				else if (msg[1] == 0x1)
					;
			}
		}

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

                // read from fsr
                val1 = analogRead(FSR1);
                msg[0] = 0x7;
                msg[1] = val1 >> 8;
                msg[2] = val1 && 0xff;
                acc.write(msg, 3);
                
                val2 = analogRead(FSR2);
                msg[0] = 0x8;
                msg[1] = val2 >> 8;
                msg[2] = val2 && 0xff;
                acc.write(msg, 3);
                
	} else {
		// reset outputs to default values on disconnect
		analogWrite(LED3_RED, 255);
		analogWrite(LED3_GREEN, 255);
		analogWrite(LED3_BLUE, 255);
	}

        // from other source
        // TODO readVal = (float)analogRead(put a pin number of return voltage of press sensor)/maxVal;
        // need method to readVal data to android

	delay(10);
}

// ==============================================================================
// Austria Microsystems i2c Joystick
void init_joystick(int threshold)
{
	byte status = 0;

	pinMode(JOY_SWITCH, INPUT);
	digitalWrite(JOY_SWITCH, HIGH);

	pinMode(JOY_nINT, INPUT);
	digitalWrite(JOY_nINT, HIGH);

	pinMode(JOY_nRESET, OUTPUT);

	digitalWrite(JOY_nRESET, 1);
	delay(1);
	digitalWrite(JOY_nRESET, 0);
	delay(1);
	digitalWrite(JOY_nRESET, 1);

	Wire.begin();

	do {
		status = read_joy_reg(0x0f);
	} while ((status & 0xf0) != 0xf0);

	// invert magnet polarity setting, per datasheet
	write_joy_reg(0x2e, 0x86);

	calibrate_joystick(threshold);
}


int offset_X, offset_Y;

void calibrate_joystick(int dz)
{
	char iii;
	int x_cal = 0;
	int y_cal = 0;

	// Low Power Mode, 20ms auto wakeup
	// INTn output enabled
	// INTn active after each measurement
	// Normal (non-Reset) mode
	write_joy_reg(0x0f, 0x00);
	delay(1);

	// dummy read of Y_reg to reset interrupt
	read_joy_reg(0x11);

	for(iii = 0; iii != 16; iii++) {
		while(!joystick_interrupt()) {}

		x_cal += read_joy_reg(0x10);
		y_cal += read_joy_reg(0x11);
	}

	// divide by 16 to get average
	offset_X = -(x_cal>>4);
	offset_Y = -(y_cal>>4);

	write_joy_reg(0x12, dz - offset_X);  // Xp, LEFT threshold for INTn
	write_joy_reg(0x13, -dz - offset_X);  // Xn, RIGHT threshold for INTn
	write_joy_reg(0x14, dz - offset_Y);  // Yp, UP threshold for INTn
	write_joy_reg(0x15, -dz - offset_Y);  // Yn, DOWN threshold for INTn

	// dead zone threshold detect requested?
	if (dz)
		write_joy_reg(0x0f, 0x04);
}


void read_joystick(int *x, int *y)
{
	*x = read_joy_reg(0x10) + offset_X;
	*y = read_joy_reg(0x11) + offset_Y;  // reading Y clears the interrupt
}

char joystick_interrupt()
{
	return digitalRead(JOY_nINT) == 0;
}


#define  JOY_I2C_ADDR    0x40

char read_joy_reg(char reg_addr)
{
	char c;

	Wire.beginTransmission(JOY_I2C_ADDR);
	Wire.send(reg_addr);
	Wire.endTransmission();

	Wire.requestFrom(JOY_I2C_ADDR, 1);

	while(Wire.available())
		c = Wire.receive();

	return c;
}

void write_joy_reg(char reg_addr, char val)
{
	Wire.beginTransmission(JOY_I2C_ADDR);
	Wire.send(reg_addr);
	Wire.send(val);
	Wire.endTransmission();
}
