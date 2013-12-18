import processing.serial.*;

private static final int BT_RATE = 115200;
private static final int WIDTH = 1920;
private static final int HEIGHT = 1200;
private static final int MARGIN = 100;

private Serial port;
private int[] fsr = new int[4];

void setup()
{
  size(WIDTH + MARGIN*2, HEIGHT + MARGIN*2);
  
  String portName = Serial.list()[0];
  port = new Serial(this, portName, BT_RATE);
  
  for(int i = 0; i < 4; i++){
    fsr[i] = 0;
  }
  
  noStroke();
  smooth();
}

void draw()
{
  background(255);
  fill(0);
  for(int i = 0; i < 4; i++){
    int w = MARGIN + ((i % 2 == 0) ? 0 : WIDTH);
    int h = MARGIN + (((int)(i / 2) == 0) ? 0 : HEIGHT);
    ellipse(w, h, fsr[i], fsr[i]);
  }
}

void serialEvent(Serial p)
{
  if(port.available()>4){
    for(int i = 0; i < 4; i++){
      fsr[i] = port.read();
      // fsr[i] = composeInt(port.read(), port.read());
    }
    // return the endmessage to arduino
    port.write(255);
  }
}

int composeInt(byte hi, byte lo)
{
  int val = (int)( hi & 0xff );
  val *= 256;
  val += (int)( lo & 0xff);
  return val;
}
