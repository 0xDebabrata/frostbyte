package main

import (
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
    projectDetails := getUserProjectDetails(3)
    log.Println(projectDetails)
}
