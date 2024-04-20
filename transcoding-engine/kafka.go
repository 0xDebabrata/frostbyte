package main

import (
	"encoding/json"
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

type Job struct {
    Id              string
    UserId          string

    ProjectId       int8
    InputBucketId   string
    ObjectName      string
    OutputBucketId  string
    VideoCodec      string
    Resolution      string
    Quality         string

    ReceivedAt      int
    ProcessedAt     int
}

//var kafkaAddress = "localhost:9092"
var kafkaAddress = "frostbyte-kafka-service.onrender.com"
var topicNameMap = map[string] string{
    "jobs": "jobs",
}

func createTopic(name string) {
    // to create topics when auto.create.topics.enable='true'
    _, err := kafka.DialLeader(context.Background(), "tcp", kafkaAddress, name, 0)
    if err != nil {
        panic(err.Error())
    }
}

func produceJob(job Job) {
    w := &kafka.Writer{
        Addr: kafka.TCP(kafkaAddress),
        Topic: topicNameMap["jobs"],
    }
    jobBytes, _ := json.Marshal(job)

    err := w.WriteMessages(context.Background(),
        kafka.Message{
            Key: []byte(job.Id),
            Value: jobBytes,
        },
    )

    if err != nil {
        log.Fatalln("Failed to write messages to kafka:", err)
    }

    if err := w.Close(); err != nil {
        log.Fatalln("Failed to close writer:", err)
    }

    log.Println("Job added to queue.")
}

func readJob(jobsChannel chan<- Job) {
    r := kafka.NewReader(kafka.ReaderConfig{
        Brokers: []string{kafkaAddress},
        Topic: topicNameMap["jobs"],
        GroupID: "jobs-reader-1",
        MaxBytes: 5e6,  // 5 MB
    })

    for {
        m, err := r.ReadMessage(context.Background())
        if err != nil {
            log.Fatalln("Failed to read message from kafka:", err)
            break
        }

        job := Job{}
        json.Unmarshal(m.Value, &job)
        jobsChannel <- job

        log.Printf("Offset: %d\nJob ID: %s\n", m.Offset, job.Id)
    }

    if err := r.Close(); err != nil {
        log.Fatalln("Failed to close reader:", err)
    }
}
