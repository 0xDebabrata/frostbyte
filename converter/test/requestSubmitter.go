package main

import (
	"fmt"
	"io/ioutil"
  "net/http"
  "bytes"
)

func main() {
  // create a RequestData instance
  jobData := 
  `{
  "supabase_url": "https://xblahorigatqigmwvzbf.supabase.co",
  "secretKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGFob3JpZ2F0cWlnbXd2emJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MDY4MjQ5OCwiZXhwIjoxOTg2MjU4NDk4fQ.L-tLP0WeCIMDf9Z76-hi4FAbnqo4JZvo5NDph2byjSw",
  "signedUrl": "https://xblahorigatqigmwvzbf.supabase.co/storage/v1/object/sign/source/we%20don't%20have%20the%20capacity.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VyY2Uvd2UgZG9uJ3QgaGF2ZSB0aGUgY2FwYWNpdHkubXA0IiwidHJhbnNmb3JtYXRpb25zIjoiIiwiaWF0IjoxNjcxNDAxNjM2LCJleHAiOjE5ODY3NjE2MzZ9.1OYdezZL6ncy0oJetoVCpa0qoUS9U2HwYgnBi8XjOL8",
  "spec": {
    "format": "mp4",
    "operation": "transcode video"
  },
  "source_bucket": "destination",
  "destination_bucket": "destination"
  }`

  // Encode the JSON string as a byte slice
  jsonData := []byte(jobData)

  // Create a POST request with the JSON data
  req, err := http.NewRequest("POST", "http://localhost:8080/submit", bytes.NewBuffer(jsonData))
  if err != nil {
    fmt.Println("There was an error while trying to create POST request --Details: ", err)
  }

  // Set the Content-Type header
  req.Header.Set("Content-Type", "application/json")

  // Send the request
  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    fmt.Println("There was an error in issuing POST request --Details: ", err)
  }
  defer resp.Body.Close()

  // Print the response
  respBody, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    fmt.Println("There was an error while reading the response body --Details: ", err)
  }

  fmt.Println(string(respBody), string(resp.Status))
}
