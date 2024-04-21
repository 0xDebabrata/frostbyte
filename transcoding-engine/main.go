package main

import (
	"fmt"
	"log"
	"time"
)

func main() {
    tempDirectory := "tmp"
    createDirectory(tempDirectory)

    jobsChannel := make(chan Job)
    /*
    createTopic(topicNameMap["jobs"])
    produceJob(Job{
        Id: "1",
        UserId: "49bd29e9-9da6-461c-a5fa-67412f6a7e32",
        ProjectId: 11,
        InputBucketId: "test",
        ObjectName: "video_20240227_161742.mp4",
        OutputBucketId: "test_output",
        VideoCodec: "original",
        Resolution: "480p",
        Quality: "lossless",
        ReceivedAt: 0,
        ProcessedAt: 0,
    })
    */

    go readJob(jobsChannel)

    for {
        select {
        case job := <-jobsChannel:
            logUpdateParam := LogUpdate{
                status: "processing",
                processed: false,
                message: "",
                logId: job.LogID,
            }

            projectDetails, err := getUserProjectDetails(job.ProjectId)
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error while fetching Supabase project credentials: %v", err),
                )
                break
            }
            logUpdate(logUpdateParam)

            localFilePath := fmt.Sprintf("%s/%s_%s", tempDirectory, time.Now().String(), job.ObjectName)
            localOutputPath := fmt.Sprintf("%s/output_%s_%s", tempDirectory, time.Now().String(), job.ObjectName)

            // Download input file
            err = downloadInputFile(
                job.InputBucketId,
                job.ObjectName,
                localFilePath,
                projectDetails,
            )
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error downloading file: %v", err),
                )
                break
            }
            log.Println("Downloaded file")

            // Conversion process
            inputVideoData, err := probeInputVideoData(localFilePath)
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error probing file: %v", err),
                )
                break
            }
            processVideo(
                localFilePath,
                localOutputPath,
                &job,
                inputVideoData,
            )
            log.Println("File processed")

            // Upload converted file
            err = uploadOutputFile(
                job.OutputBucketId,
                fmt.Sprintf("frostbyte_output_%s", job.ObjectName),
                localOutputPath,
                projectDetails,
            )
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error uploading file: %v", err),
                )
                break
            }
            log.Println("File uploaded")

            // Remove temporary files
            err = cleanup(localFilePath)
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error removing input file: %v", err),
                )
                break
            }
            err = cleanup(localOutputPath)
            if err != nil {
                logErrorToSupabase(
                    &logUpdateParam,
                    fmt.Sprintf("Error removing output file: %v", err),
                )
                break
            }

            logUpdateParam.processed = true
            logUpdateParam.status = "complete"
            logUpdate(logUpdateParam)

            log.Println("Finished job")
        }
    }
}
