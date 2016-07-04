//Breathing Setup
int sensorPinBreathing = A0; 
int sensorValueBreathing = 0;

bool breathingIn = true;
int lastBreathingValue = 0;
int thresholdBreathing = 2;
//int breathingCounter = 0; //testing

//Pressing Setup
int sensorPinPressing = A1; 
int sensorValuePressing = 0;

bool PressingIn = false;
int lastPressingValue = 0;
int thresholdPressing = 50;
//int pressingCounter = 0; //testing

bool SetStartValues = true;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  sensorValueBreathing = analogRead(sensorPinBreathing);
  sensorValuePressing = analogRead(sensorPinPressing);

  //Serial.print("sensorValueBreathing: ");
  //Serial.print(sensorPinBreathing);
  //Serial.print('\n'); 
  
  //----Testing Pressing
  //Serial.print("sensorValuePressing: "); 
  //Serial.print(sensorValuePressing); 
  //Serial.print(" - lastPressingValue: "); 
  //Serial.print(lastPressingValue); 
  //Serial.print('\n'); 

  if(SetStartValues)
  {
      lastBreathingValue = sensorValueBreathing;
      lastPressingValue = sensorValuePressing;
      SetStartValues = false;
  }  
  else {
    //Breathing code
    if(breathingIn)
    {
      if(sensorValueBreathing > lastBreathingValue)
      {
        lastBreathingValue = sensorValueBreathing;
      }
      else if ((sensorValueBreathing + thresholdBreathing) < lastBreathingValue)
      {
        breathingIn = false;
      }
    }
    else
    {
      if(sensorValueBreathing < lastBreathingValue)
      {
        lastBreathingValue = sensorValueBreathing;
      }
      else if((sensorValueBreathing - thresholdBreathing) > lastBreathingValue)
      {
        breathingIn = true;
        Serial.println("{ \"type\": 1, \"breath\": true }");
        //Serial.print("Breathing: "); //Testing
        //Serial.print(breathingCounter);
        //Serial.print('\n'); //Testing
        //breathingCounter++;
      }      
    }
  
    //Pressing Code
    if(PressingIn)
    {
      if(sensorValuePressing > lastPressingValue)
      {
        lastPressingValue = sensorValuePressing;
      }
      else if ((sensorValuePressing + thresholdPressing) < lastPressingValue)
      {
        PressingIn = false;  
      }
    }
    else
    {
      if(sensorValuePressing < lastPressingValue)
      {
        lastPressingValue = sensorValuePressing;
      }
      else if((sensorValuePressing - thresholdPressing) > lastPressingValue)
      {
        PressingIn = true;
        Serial.println("{ \"type\": 2, \"jump\": true }");
        //Serial.print("Pressing: "); //Testing
        //Serial.print(pressingCounter);
        //Serial.print('\n'); //Testing
        //pressingCounter++;
      }
    }
  }
  

  delay(10);
}
