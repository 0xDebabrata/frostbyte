package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func getEnv(key string) string {
    var err = godotenv.Load(".env")
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    return os.Getenv(key)
}


func main() {
    tempDirectory := "tmp"
    createDirectory(tempDirectory)

    for {
        // Fetch project details
        projectDetails := getUserProjectDetails(11)
        log.Println(projectDetails.SupabaseUrl)

        localFilePath := fmt.Sprintf("%s/%s", tempDirectory, "IMG_20240224_155354.jpg")

        // Download input file
        downloadInputFile(
            "test",
            "IMG_20240224_155354.jpg",
            localFilePath,
            projectDetails,
        )

        // Conversion process
        inputVideoData := probeInputVideoData(localFilePath)

        // Upload converted file
        uploadOutputFile(
            "test",
            "uploaded.jpg",
            localFilePath,
            projectDetails,
        )
    }
}
