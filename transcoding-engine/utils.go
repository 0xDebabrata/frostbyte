package main

import (
	"os"
)

func createDirectory(path string) {
    os.MkdirAll(path, os.ModePerm)
}
