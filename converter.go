package main

import (
	"fmt"
	"encoding/json"
	"net/http"
	"log"
)

// Struct for storing job description
type Job struct {
	ID 		  string `json : "ID"`
	InputURL string `json : "InputURL"`
	OutputCodec string `json: "OutputCodec"`
}

// Struct for storing a job queue
type JobQueue struct {
	jobs []Job
}

// Enqueue adds a job to the end of the queue
func (q *JobQueue) Enqueue(job Job) {
	q.jobs = append(q.jobs, job)
}

// Dequeue removes and returns the first job in the queue
func (q *JobQueue) Dequeue() Job {
	job := q.jobs[0]
	q.jobs = q.jobs[1:]
	return job
}

// IsEmpty returns true if the queue is empty
func (q *JobQueue) IsEmpty() bool {
	return len(q.jobs) == 0
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
  
  // Parse the JSON from the request body
  var data Job

  err := json.NewDecoder(r.Body).Decode(&data)
  if err != nil {
    fmt.Println("There was a problem trying to parse JSON data --Details: ", err)
  }

  //print the data recieved
  fmt.Println(data.ID, data.InputURL, data.OutputCodec)

  // write a response
  w.WriteHeader(http.StatusOK)
}

func main() {

	http.HandleFunc("/submit", submitHandler)
  
  	log.Printf("Listening for job requests on localhost:8080/submit...")
  	err := http.ListenAndServe(":8080", nil)
  	log.Fatal(err)
}

	// // Set the input and output file paths
	// inputPath := "data/hasbulla.mp4"
	// outputPath := "data/output.mp4"

	// // Use the ffmpeg command to transcode the video
	// cmd := exec.Command("ffmpeg", "-i", inputPath, "-c:v", "h264", "-c:a", "aac", outputPath)

	// // Run the command and print any errors
	// if err := cmd.Run(); err != nil {
	// 	fmt.Println("An error occurred while trying to execute the command --Details: ", err)
	// }