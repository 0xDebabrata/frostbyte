package main

import (
	"os"
    "log"

	"github.com/joho/godotenv"
)

func handleError(err error, msg string) {
    if err != nil {
        log.Fatalln(msg, err)
    }
}

func logErrorToSupabase(logUpdateParam *LogUpdate, message string) {
    logUpdateParam.status = "failed"
    logUpdateParam.message = message
    logUpdate(*logUpdateParam)
}

func createDirectory(path string) {
    os.MkdirAll(path, os.ModePerm)
}

func cleanup(path string) error {
    err := os.Remove(path)
    return err
    // handleError(err, "Could not remove file")
}

func getEnv(key string) string {
    err := godotenv.Load(".env")
    handleError(err, "Error loading .env file")
    return os.Getenv(key)
}
