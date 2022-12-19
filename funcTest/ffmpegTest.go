package test

import (
	"os/exec"
	"io/ioutil"
	"log"
)

func main() {
	// Set the input and output file paths
	inputPath := "https://xblahorigatqigmwvzbf.supabase.co/storage/v1/object/public/source/hasbulla.mp4?t=2022-12-14T13%3A24%3A30.795Z"
	outputPath := "../data/output.mp4"

	log.Println("Executing ffmpeg cmd...")
	// Use the ffmpeg command to transcode the video
	cmd := exec.Command("ffmpeg", "-i", inputPath, "-c:v", "h264", "-c:a", "aac", outputPath)

	stdErr, err := cmd.StderrPipe()
	if err != nil {
		log.Println("There was a problem creating stderr pipe --Details: ", err)
	}
	// Run the command and print any errors
	if err := cmd.Run(); err != nil {
		log.Println("An error occurred while trying to execute the command --Details: ", err)
		errorOutput, err := ioutil.ReadAll(stdErr)
		if err != nil {
			log.Println(errorOutput, err)
		}
	} else {
		log.Println("Done")
	}
}

