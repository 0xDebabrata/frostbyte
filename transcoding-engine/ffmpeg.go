package main

import (
	"context"
	"fmt"
	"log"
	"time"
    "bytes"
    "os/exec"

	"gopkg.in/vansante/go-ffprobe.v2"
)

var videoCodecMap = map[string]string{
    "original": "copy",
    "h264": "libx264",
    "h265": "libx265",
}

var videoResolutions = map[string]int{
    "4k": 4096,
    "1080p": 1080,
    "720p": 720,
    "480p": 480,
}

func buildffmpegCommand(
    inputFileName string,
    outputFileName string,
    job *Job,
    ffprobeOutput *ffprobe.ProbeData,
) *exec.Cmd {
    videoCodecArg, audioCodecArg := getTranscodingVideoAudioCodecs(inputFileName, job, ffprobeOutput)

    if job.Resolution == "original" {
        return exec.Command(
            "ffmpeg",
            "-i", inputFileName,

            "-c:v", videoCodecArg,
            "-crf", setVideoQuality(job),
            "-c:a", audioCodecArg,
            outputFileName,
        )
    } else {
        return exec.Command(
            "ffmpeg",
            "-i", inputFileName,

            "-vf", generateScaleFilter(job),
            "-c:v", videoCodecArg,
            "-crf", setVideoQuality(job),
            "-c:a", audioCodecArg,
            outputFileName,
        )
    }
}

func generateScaleFilter(
    job *Job,
) string {
    return fmt.Sprintf("scale=-2:%d", videoResolutions[job.Resolution])
}

func getTranscodingVideoAudioCodecs(
    inputFileName string,
    job *Job,
    ffprobeOutput *ffprobe.ProbeData,
) (string, string) {
    inputVideoCodec := ffprobeOutput.FirstVideoStream().CodecName
    inputAudioCodec := ffprobeOutput.FirstAudioStream().CodecName

    // Set output video and audio codecs
    // Copy codec if file already has supported codecs. Prevents unnecessary
    // transcoding
    outputVideoCodec := "copy"
    if job.VideoCodec != "original" && job.VideoCodec != inputVideoCodec {
        outputVideoCodec = videoCodecMap[job.VideoCodec]
    }
    outputAudioCodec := "aac"
    if inputAudioCodec == outputAudioCodec {
        outputAudioCodec = "copy"
    }

    return outputVideoCodec, outputAudioCodec
}

func probeInputVideoData(
    inputFileName string,
) *ffprobe.ProbeData {
    ctx, cancelFn := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancelFn()

    // Read input video and audio codecs
    ffprobeOutput, err := ffprobe.ProbeURL(ctx, inputFileName)
    if err != nil {
        log.Panicf("Error probing video file: %v", err)
    }
    return ffprobeOutput
}

func processVideo(
    inputFileName string,
    outputFileName string,
    job *Job,
    ffprobeOutput *ffprobe.ProbeData,
) {
    cmd := buildffmpegCommand(
        inputFileName,
        outputFileName,
        job,
        ffprobeOutput,
    )
    var out bytes.Buffer
    var stderr bytes.Buffer
    cmd.Stdout = &out
    cmd.Stderr = &stderr

    err := cmd.Run()
    if err != nil {
        fmt.Println(fmt.Sprint(err))
        fmt.Println(stderr.String())
        fmt.Println(out.String())
        return
    }
    fmt.Println(stderr.String())

    if err != nil {
        log.Panicf("Error transcoding video file: %v", err)
    }
}

func setVideoQuality(
    job *Job,
) string {
    switch job.Quality {
    case "lossless":
        return "0"
    case "high":
        return "12"
    case "medium":
        return "18"
    case "low":
        return "24"
    default:
        return "23"
    }
}
