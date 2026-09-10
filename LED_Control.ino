/*
 * Arduino LED Control System

const uint8_t LED_PIN = 13;
const uint8_t SWITCH_PIN = 2;

void setup() {
  // Configure pin modes
  pinMode(LED_PIN, OUTPUT);
  pinMode(SWITCH_PIN, INPUT_PULLUP);

  // Initial LED state
  digitalWrite(LED_PIN, LOW);
}

void loop() {
  // Read switch status
  const bool switchPressed = (digitalRead(SWITCH_PIN) == LOW);

  // Control LED according to switch state
  if (switchPressed) {
    turnOnLED();
  } else {
    turnOffLED();
  }

  delay(20);  // Simple switch debounce
}

// Turn LED ON
void turnOnLED() {
  digitalWrite(LED_PIN, HIGH);
}

// Turn LED OFF
void turnOffLED() {
  digitalWrite(LED_PIN, LOW);
}