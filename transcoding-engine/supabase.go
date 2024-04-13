package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/supabase-community/supabase-go"
    storage_go "github.com/supabase-community/storage-go"
)

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

func getUserProjectDetails(id int8) map[string]interface{} {
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

    var projectDetails map[string]interface{}
    if err = json.Unmarshal(data, &projectDetails); err != nil {
        log.Fatalf("Error fetching project details from Supabase: %v", err)
    }

    return projectDetails
}

func downloadInputFile(bucketId string, filepath string) []byte {
    storageClient := storage_go.NewClient(
        getEnv("SUPABASE_URL"),
        getEnv("SUPABASE_SECRET_KEY"),
        nil,
    )
    result, err := storageClient.DownloadFile(bucketId, filepath)
    if err != nil {
        log.Fatalf("Error downloading file: %v", err)
    }
    return result
}
