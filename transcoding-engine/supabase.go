package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	storage_go "github.com/supabase-community/storage-go"
	"github.com/supabase-community/supabase-go"
)

type SupabaseProjectDetails struct {
    SupabaseUrl         string  `json:"supabase_url"`
    SupabaseSecretKey   string  `json:"decrypted_supabase_secret_key"`
}

type LogUpdate struct {
    logId       int
    status      string
    message     string
    processed   bool
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

func logUpdate(
  param LogUpdate,
) {
    row := map[string]interface{}{
      "status": param.status,
      "message": param.message,
    }
    if param.processed {
      currTime := time.Now().UTC().Format(time.RFC3339)
      row["processed_at"] = currTime
    }

    client := getSupabaseAdmin()
    _, _, err := client.
                        From("logs").
                        Update(row, "", "").
                        Eq("id", fmt.Sprintf("%d", param.logId)).
                        Execute()
    if err != nil {
        log.Fatalf("Error updating status: %v", err)
    }
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
