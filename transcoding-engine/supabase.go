package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
    "bufio"

	storage_go "github.com/supabase-community/storage-go"
	"github.com/supabase-community/supabase-go"
)

type SupabaseProjectDetails struct {
    SupabaseUrl         string  `json:"supabase_url"`
    SupabaseSecretKey   string  `json:"decrypted_supabase_secret_key"`
}

func getSupabaseAdmin() *supabase.Client {
    var adminClient, err = supabase.NewClient(
        getEnv("SUPABASE_URL"),
        getEnv("SUPABASE_SECRET_KEY"),
        nil,
    )

    if err != nil {
        log.Fatalf("Error initialising Supabase client: %v", err)
    }

    return adminClient
}

func initialiseStorageClient(supabaseProjectCreds SupabaseProjectDetails) *storage_go.Client {
    storageClient := storage_go.NewClient(
        fmt.Sprintf("%s/storage/v1", supabaseProjectCreds.SupabaseUrl),
        supabaseProjectCreds.SupabaseSecretKey,
        nil,
    )
    return storageClient
}

func getUserProjectDetails(id int8) SupabaseProjectDetails {
    client := getSupabaseAdmin()
    data, _, err := client.
                        From("decrypted_supabase_projects").
                        Select("supabase_url, decrypted_supabase_secret_key", "exact", false).
                        Eq("id", fmt.Sprint(id)).
                        Single().
                        Execute()

    if err != nil {
        log.Fatalf("Error fetching project details from Supabase: %v", err)
    }

    var projectDetails SupabaseProjectDetails
    if err = json.Unmarshal(data, &projectDetails); err != nil {
        log.Fatalf("Error fetching project details from Supabase: %v", err)
    }

    return projectDetails
}

func downloadInputFile(
    bucketId string,
    filepath string,
    localFilepath string,
    supabaseProjectCreds SupabaseProjectDetails,
) {
    storageClient := initialiseStorageClient(supabaseProjectCreds)
    result, err := storageClient.DownloadFile(bucketId, filepath)
    if err != nil {
        log.Fatalf("Error downloading file: %v", err)
    }

    // Write file to disk
    // 0644 -> we can read and write but other users can only read
    err = os.WriteFile(localFilepath, result, 0644)
}

func uploadOutputFile(
    bucketId string,
    filepath string,
    localFilepath string,
    supabaseProjectCreds SupabaseProjectDetails,
) {
    storageClient := initialiseStorageClient(supabaseProjectCreds)
    f, err := os.Open(localFilepath)
    if err != nil {
        log.Fatalf("Error opening file: %v", err)
    }

    fileData := bufio.NewReader(f)
    upsertParam := true
    defaultContentType := "video/mp4"

    result, err := storageClient.UploadFile(bucketId, filepath, fileData, storage_go.FileOptions{
        Upsert: &upsertParam,
        ContentType: &defaultContentType,
    })
    if err != nil {
        log.Fatalf("Error uploading file: %v", err)
    }
    log.Println(result)
}
