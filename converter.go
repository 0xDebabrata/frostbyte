package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	"os/exec"
	"io/ioutil"
)

// Get heroku port
port := os.Getenv("PORT")

// Create a global variable for the job queue
var queue = &JobQueue{}

// Create a map for formats and their ffmpeg flags
var flags = map[string]string{
	"mp4":   "-movflags frag_keyframe+empty_moov -f mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k",
	"webm":  "-c:v libvpx-vp9 -crf 30 -c:a libopus -b:a 128k",
	"ogg":   "-c:v libtheora -c:a libvorbis",
}

// Struct for storing job description
type Job struct {
	SupabaseURL    string `json:"supabase_url"`
	SecretKey      string `json:"secretKey"`
	SignedURL      string `json:"signedUrl"`
	Spec           Spec   `json:"spec"`
	SourceBucket   string `json:"source_bucket"`
	DestinationBucket string `json:"destination_bucket"`
}

type Spec struct {
	Format      string `json:"format"`
	Operation   string `json:"operation"`
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

// Construct the ffmpeg command and execute it 
func processJob(job Job) {
	var cmdStr string

	operation := job.Spec.Operation

	switch operation {
	case "transcode video":
		cmdStr = fmt.Sprintf("ffmpeg -i %s %s -headers $'Authorization: Bearer %s\\r\\napikey: %s %s/storage/v1/object/%s/%d.%s", 
							job.SignedURL, 
							flags[job.Spec.Format], 
							job.SecretKey, 
							job.SecretKey, 
							job.SupabaseURL, 
							job.DestinationBucket, 
							time.Now().Unix(),
							job.Spec.Format)
	case "separate audio":
		cmdStr = fmt.Sprintf("ffmpeg %s", "Foo Bar")
	}

	
	log.Println("Executing ffmpeg cmd...")
	// Use the ffmpeg command to transcode the video
	cmd := exec.Command(cmdStr)

	// Upstream the error back to terminal
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

func submitHandler(w http.ResponseWriter, r *http.Request) {

	// Parse the JSON from the request body
	var data Job

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		fmt.Println("There was a problem trying to parse JSON data --Details: ", err)
	}

	// Add the job to the queue
	queue.Enqueue(data)
	fmt.Println("A new job has been added to the queue...")
	fmt.Println(queue)


	//Start converting the latest job concurrently
	go processJob(queue.Dequeue())
}

func main() {

	http.HandleFunc("/submit", submitHandler)

	log.Printf("Listening for job requests on localhost:8080/submit...")
	err := http.ListenAndServe(":" + port, nil)
	log.Fatal(err)
}

// {
// supabase_url: "https://kseuhf",
// secretKey: "iurfgu",
// signedUrl: "uyguysfe",
// spec: { format: "AAC", operation: "separate audio" },
// source_bucket: "destiination",
// destination_bucket: "destination"
// }

	// statusCode := 200

	// if()

	// switch statusCode {
	// case 200:
	// 	w.WriteHeader(http.StatusOK)
	// case 404:
	// 	w.WriteHeader(http.StatusNotFound)
	// case 500:
	// 	w.WriteHeader(http.StatusInternalServerError)
	// default:
	// 	w.WriteHeader(http.StatusOK)
	// }

