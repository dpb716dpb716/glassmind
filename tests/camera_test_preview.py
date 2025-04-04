from core.capture.pi_camera import PiCameraStream

if __name__ == "__main__":
    cam = PiCameraStream(preview=True)
    cam.start()

    try:
        while True:
            frame = cam.read_frame()
    except KeyboardInterrupt:
        cam.stop()