package main

type Job struct {
    id              string
    userId          string

    projectId       string
    inputBucketId   string
    outputBucketId  string
    videoCodec      string
    resolution      string
    bitrate         string

    receivedAt      int
    processedAt     int
}
