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

func createDirectory(path string) {
    os.MkdirAll(path, os.ModePerm)
}

func cleanup(path string) {
    err := os.Remove(path)
    handleError(err, "Could not remove file")
}

func getEnv(key string) string {
    err := godotenv.Load(".env")
    handleError(err, "Error loading .env file")
    return os.Getenv(key)
}

