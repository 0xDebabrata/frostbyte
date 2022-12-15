package test

import (
	"fmt"
	"github.com/0xDebabrata/frostbyte/converter"
	"encoding/json"
	"io/ioutil"
)

func main() {
  // create a RequestData instance
  jobData := converter.Job{
    ID : "123456",
    InputeURL : "https://xblahorigatqigmwvzbf.supabase.co/storage/v1/object/public/source/hasbulla.mp4?t=2022-12-14T13%3A24%3A30.795Z"
    OutputCodec : "-c:v h264 -c:a aac"
  }
  
  // create a JSON representation of the request data
  jobDataBytes, err := json.Marshal(jobData)
  if err != nil {
    panic("There was an error while trying to marshal the request struct into json --Details: ", err)
  }
  
  // create a POST request to the API
  resp, err := http.Post("http://localhost:8080/submit", "application/json", bytes.NewBuffer(jobDataBytes))
  if err != nil {
    // handle error
  }
  
  // read the response data
  respData, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    panic("There was a problem while reading the response sent back from converter --Details: ", err)
  }
  
  // close the response body
  defer resp.Body.Close()
  
  // parse the response data
  var respObj converter.Job
  if err := json.Unmarshal(respData, &respObj); err != nil {
    // handle error
  }
  
  fmt.Println("Here's the response sent by converter: ", respObj)
}
