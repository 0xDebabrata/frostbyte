package main

import (
	"fmt"
	"os/exec"
)

func main() {
	// Set the input and output file paths
	inputPath := "data/hasbulla.mp4"
	outputPath := "data/output.mp4"

	// Use the ffmpeg command to transcode the video
	cmd := exec.Command("ffmpeg", "-i", inputPath, "-c:v", "h264", "-c:a", "aac", outputPath)

	// Run the command and print any errors
	if err := cmd.Run(); err != nil {
		fmt.Println("An error occurred while trying to execute the command --Details: ", err)
	}
}
