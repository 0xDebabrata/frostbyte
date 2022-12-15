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
    "ID" : "123456",
    "InputURL" : "https://xblahorigatqigmwvzbf.supabase.co/storage/v1/object/public/source/hasbulla.mp4?t=2022-12-14T13%3A24%3A30.795Z",
    "OutputCodec" : "-c:v h264 -c:a aac"
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
