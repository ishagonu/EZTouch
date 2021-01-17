/*included libraries*/
/*Anna Anderson 2021*/
#include <SevSeg.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

/*IR Sensor*/
#define wLED 15
#define gLED 19
#define btn 4 //interrupt pin
#define slider 34 //interrupt pin
#define DEBOUNCE_TIME 250 //debounce time for button
/*OLED Values*/
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET -1 //reset pint (-1 when sharing arduino reset pin)
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/*SevSeg Values*/
byte numDigits = 4;  
byte digitPins[] = {33, 32, 5, 18};
byte segmentPins[] = {13, 12, 14, 27, 26, 25, 2, 23};
bool resistorsOnSegments = 0; 

//Initiate a seven segment controller object
SevSeg sevseg;


/*Function Declarations*/
void splitTxt(String text, String overflow[]);
void dispNum(int num, int dec, int t);
void dStep(String instruction, int number); //display step
void dIngred(String ingredient, int quant); //display ingredient
int numDecPlaces(String number); //get the number of decimal places for displaying ingredient decimal
void transIngred(String raw); //fill in globals for ingredients
void transInstruct(String raw); //fill in globals for instructions 

/*Globals*/
volatile bool instructions = false;
volatile bool next = false;
String input;
int stepNum;
float amount;
int amt;
int decimal;
int state = 0;
int buttonInterruptTime = 0;
int sliderInterruptTime = 0;
String raw = "";
String ins[3] = {"6 Stir constantly until this thickens", "7 Take off of heat", "8 Season with salt and pepper"};
String ing[3] = {"8.5 ounces water-packed tuna", "0.75 cups chopped onion", "2 teaspoons of soy sauce"};
int insC = 0;
int ingC = 0;

void IRAM_ATTR advance() {

  if(millis() - buttonInterruptTime > 200)
  {
    next = !next;
    buttonInterruptTime = millis();
  }


  
}

void IRAM_ATTR shift() {
  

  if(millis() - sliderInterruptTime > 200)
  {
    instructions = !instructions;
    sliderInterruptTime = millis();
  }
}

/*START OF PROGRAM -------------------------------------------------------------------------------------------------*/
void setup() {
  /*pinmodes and interrupts*/
  pinMode(wLED, OUTPUT);
  pinMode(gLED, OUTPUT);
  pinMode(btn, INPUT_PULLUP);
  pinMode(slider, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(btn), advance, RISING);
  attachInterrupt(digitalPinToInterrupt(slider), shift, CHANGE);
  Serial.begin(115200);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(2000);
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.clearDisplay();
 /*setup seven segment display*/
  // variable above indicates that 4 resistors were placed on the digit pins.
  // set variable to 1 if you want to use 8 resistors on the segment pins.
  sevseg.begin(COMMON_CATHODE, numDigits, digitPins, segmentPins, resistorsOnSegments);
  sevseg.setBrightness(90);
}

void loop() {
//  if (digitalRead(btn) == HIGH) {
//    Serial.println("pressed");
//  }
//  else {
//    Serial.println("not pressed");
//  }
//
//  if(next)
//  {
//    Serial.println("next");
//    digitalWrite(wLED, LOW);
//    digitalWrite(gLED, LOW);
//  }
//
//  if (!next) {
//    Serial.println("not next");
//    digitalWrite(wLED, HIGH);
//    digitalWrite(gLED, HIGH);
//  }
  
  if(instructions) {
   // Serial.println("intructions");
    digitalWrite(wLED, HIGH);
    digitalWrite(gLED, LOW);
  }
  if(!instructions) {
   // Serial.println("ingredients");
    digitalWrite(gLED, HIGH);
    digitalWrite(wLED, LOW);
  }
   if(!next) {
   // Serial.println("stay on current");
    //FOR TESTING PURPOSES
    if(instructions) {
      /*input = "We all want the world to end during our lifetimes because it's comforting to think we're special somehow instead of just another generation of dumb apes who will come and go without making much of a difference. Anyway sure Pepsi is fine.";
      stepNum = 1;*/
      dStep(input, stepNum);
    
      }
    if(!instructions) {
     // Serial.println("ingredients");
      /*input = "carrots";
      amount = 1.5;
      amt = 15;
      decimal = 1;*/
      dIngred(input, amt, decimal);
    }
  }
  if(next) {
    //Serial.println("advance to next");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Fetching next: ");
    if(!instructions) {
      display.println("ingredient");
      /*for testing purposes*/
      raw = ing[ingC];
      if (ingC < 3) {
        ingC++;
      }
      else {
        ingC = 0;
      }
      transIngred(raw);
    }
    else {
      display.println("instruction");
      /*for testing purposes*/
      raw = ins[insC];
      if (insC < 3) {
        insC++;
      }
      else {
        insC = 0;
      }
      transInstruct(raw);
    }
    display.display();
    delay(3000);
    //call fetch
    next = false;
  }
}

/*Function Definitions -------------------------------------------------------------------------------------------------*/

void splitTxt(String text, String overflow[]) {
  int len = text.length();
  int counter = 0;
  int overIndex = 0;
  while(counter<len) {
    for (int j=0; j<168;j++) {
      overflow[overIndex].concat(text[counter]);
      counter++;
    }
    overIndex++;
  }
  for (int i=0; i<sizeof(overflow);i++) {
    Serial.println(overflow[i]);
  }
}

void dispNum(int num, int dec, int t, bool dispMode) {
  int myTime = millis();
  int count = myTime + t;
  while (myTime < count && ((instructions && dispMode)||(!instructions && !dispMode)) ) {
    sevseg.setNumber(num, dec);
    sevseg.refreshDisplay();
    myTime = millis();
  }
  sevseg.begin(COMMON_CATHODE, numDigits, digitPins, segmentPins, resistorsOnSegments);
}

void dStep(String instruction, int number){
  //dispNum(number, 0, 3000, true); //display the step number on the seven segment display for 2 seconds
  display.clearDisplay();
  display.setCursor(0,0);
  display.println(instruction);
  display.display();
  dispNum(number, 0, 2000, true);
}

void dIngred(String ingredient, int quant, int dec){
  float sizeOver = ceil(ingredient.length()/168.0); //in case the ingredient exceeds the capacity
  String texts[int(sizeOver)]; 
  splitTxt(input, texts); //split indredient into "pages"
  for (int i = 0; i<sizeOver;i++){ //display each "page"
    display.clearDisplay();
    display.setCursor(0,0);
    display.println(texts[i]);
    display.display();
    if (sizeOver != 1) { //skip delay if only 1 page
//      delay(7000);
        int startTime = millis();
        while( (millis() - startTime < 7000) && !instructions)
        {
          
          }
    }
  }
  if (sizeOver == 1) {
    dispNum(quant, dec, 2000, false);
  }
}

//ingredient:  6.5 ounces water-packed tuna
//instruction: 6 Stir constantly until this thickens

int numDecPlaces(String number) {
  float num = number.toFloat();
  int count = 0;
  int val = floor(num);
  float residue = num - float(val);
  if (residue !=0) {
    int mult = 1;
    while (floor(mult*residue) != (mult*residue)) {
      mult = 10*mult;
      count++;
    }
  }
  decimal = count; //change decimal to be the new place
  return count;
}

void transIngred(String raw) {
  String number;
  String a;
  input = "";
  for (int i = 0; i<raw.length(); i++) {
    char c = raw[i];
    if((c>=48 && c<=57) || c== 46) {
      if(c!=46) {
        a.concat(c); //create number without decimal to input into sevSeg
      }
      number.concat(c); //create number with decimal
    }
    else {
      input.concat(c); //create message
    }
  }
  amt = a.toFloat();
  numDecPlaces(number);
}


void transInstruct(String raw) {
  String number;
  input = "";
  for (int i = 0; i<raw.length(); i++) {
    char c = raw[i];
    if(c>=48 && c<=57) {
      number.concat(c); //create stepnumber
    }
    input.concat(c); //create message
  }
  stepNum = number.toFloat();
}
