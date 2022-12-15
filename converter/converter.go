package main

import (
	"fmt"
	"encoding/json"
	"net/http"
	"os/exec"
)

// Struct for storing job description
type Job struct {
	ID 		  string
	InputURL string
	OutputCodec string
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
  // parse the request body
  var data Job
  if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  
  // parse the JSON document
  if err := json.Unmarshal([]byte(jsonStr), &job); err != nil {
    panic("There was an error while trying to Unmarshal the JSON request --Details: ", err)
  }
  
  // write a response
  w.WriteHeader(http.StatusOK)
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(responseData)
}

func main() {

	http.HandleFunc("/submit", submitHandler)
  
  	http.ListenAndServe(":8080", nil)

	// Set the input and output file paths
	inputPath := "data/hasbulla.mp4"
	outputPath := "data/output.mp4"

	// Use the ffmpeg command to transcode the video
	cmd := exec.Command("ffmpeg", "-i", inputPath, "-c:v", "h264", "-c:a", "aac", outputPath)

	// Run the command and print any errors
	if err := cmd.Run(); err != nil {
		panic("An error occurred while trying to execute the command --Details: ", err)
	}
}
