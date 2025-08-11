
import Webcam from "react-webcam"
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'







export default function WebcamCapture(props) {
  const webcamRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [capture, setCapture] = useState(true)

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  }







  const handleCapture = () => {
    props.setx() 
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      props.setImagePreview(imageSrc)  
      props.setFaceImage(props.dataURLtoFile(imageSrc, "captured_image.jpg"))
      console.log()
      setCapture(false)
    }
  }

  return (
    <div className="mt-4">
      {capture && (
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleCapture}
      >
        Capture Image
      </Button>

      {imagePreview && (
        <img src={imagePreview} alt="Captured" className="mt-4" />
      )}
    </div>
  )
}