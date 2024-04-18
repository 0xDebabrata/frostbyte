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
    produceJob(Job{
        Id: "1",
        UserId: "49bd29e9-9da6-461c-a5fa-67412f6a7e32",
        ProjectId: 11,
        InputBucketId: "test",
        ObjectName: "video_20240227_161742.mp4",
        OutputBucketId: "test_output",
        VideoCodec: "original",
        Resolution: "original",
        Quality: "lossless",
        ReceivedAt: 0,
        ProcessedAt: 0,
    })
    */

    go readJob(jobsChannel)

    for {
        select {
        case job := <-jobsChannel:
            projectDetails := getUserProjectDetails(job.ProjectId)
            log.Println("Supabase URL:", projectDetails.SupabaseUrl)

            localFilePath := fmt.Sprintf("%s/%s_%s", tempDirectory, time.Now().String(), job.ObjectName)
            localOutputPath := fmt.Sprintf("%s/output_%s_%s", tempDirectory, time.Now().String(), job.ObjectName)
            log.Println("Input path:", localFilePath)
            log.Println("Output path:", localOutputPath)

            // Download input file
            downloadInputFile(
                job.InputBucketId,
                job.ObjectName,
                localFilePath,
                projectDetails,
            )
            log.Println("Downloaded file")

            // Conversion process
            inputVideoData := probeInputVideoData(localFilePath)
            processVideo(
                localFilePath,
                localOutputPath,
                &job,
                inputVideoData,
            )
            log.Println("File processed")

            // Upload converted file
            uploadOutputFile(
                job.OutputBucketId,
                job.ObjectName,
                localOutputPath,
                projectDetails,
            )
            log.Println("File uploaded")

            // Remove temporary files
            cleanup(localFilePath)
            cleanup(localOutputPath)
            log.Println("Finished job")
        }
    }
}
