package main

import (
	"context"
	"time"
    "log"

	"gopkg.in/vansante/go-ffprobe.v2"
)

var videoCodecMap = map[string]string{
    "unchanged": "copy",
    "h264": "libx264",
    "h265": "libx265",
}

func getTranscodingVideoAudioCodecs(
    inputFileName string,
    job *Job,
) (string, string) {
    ctx, cancelFn := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancelFn()

    // Read input video and audio codecs
    ffprobeOutput, err := ffprobe.ProbeURL(ctx, inputFileName)
    if err != nil {
        log.Panicf("Error probing video file: %v", err)
    }
    inputVideoCodec := ffprobeOutput.FirstVideoStream().CodecName
    inputAudioCodec := ffprobeOutput.FirstAudioStream().CodecName

    // Set output video and audio codecs
    // Copy codec if file already has supported codecs. Prevents unnecessary
    // transcoding
    outputVideoCodec := "copy"
    if job.videoCodec != "unchanged" && job.videoCodec != inputVideoCodec {
        outputVideoCodec = videoCodecMap[job.videoCodec]
    }
    outputAudioCodec := "aac"
    if inputAudioCodec == outputAudioCodec {
        outputAudioCodec = "copy"
    }

    return outputVideoCodec, outputAudioCodec
}

func processVideo(
    inputFileName string,
    outputFileName string,
    job *Job,
) {
    videoCodecArg, audioCodecArg := getTranscodingVideoAudioCodecs(inputFileName, job)
    log.Println(videoCodecArg, audioCodecArg)
}
