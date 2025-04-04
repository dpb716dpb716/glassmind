import serial
import struct
import numpy as np
import cv2

# Open the serial port. Adjust port name and baud rate as needed.
ser = serial.Serial('COM3', 115200, timeout=1)

while True:
    # Read the 4-byte header
    header = ser.read(4)
    if len(header) < 4:
        continue  # Incomplete header, skip

    # Unpack header to get the frame length
    frame_len = struct.unpack('>I', header)[0]

    # Read the image data based on the received length
    frame_data = ser.read(frame_len)
    if len(frame_data) != frame_len:
        continue  # Incomplete image data, skip this frame

    # Convert the byte data to a NumPy array and decode the JPEG
    np_arr = np.frombuffer(frame_data, dtype=np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if frame is not None:
        # Display the image using OpenCV
        cv2.imshow('OpenMV Cam Feed', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

ser.close()
cv2.destroyAllWindows()