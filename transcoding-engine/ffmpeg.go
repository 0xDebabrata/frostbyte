package main

import (
	"context"
	"fmt"
	"log"
	"time"

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

func generateScaleFilter(
    job *Job,
    ffprobeOutput *ffprobe.ProbeData,
) string {
    inputVideoStream := ffprobeOutput.FirstVideoStream()
    inputVideoWidth := inputVideoStream.Width
    inputVideoHeight := inputVideoStream.Height
    if job.resolution == "original" {
        return fmt.Sprintf("scale=%d:%d", inputVideoWidth, inputVideoHeight);
    }

    return fmt.Sprintf("scale=-2:%d", videoResolutions[job.resolution])
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
    if job.videoCodec != "original" && job.videoCodec != inputVideoCodec {
        outputVideoCodec = videoCodecMap[job.videoCodec]
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
    videoCodecArg, audioCodecArg := getTranscodingVideoAudioCodecs(inputFileName, job, ffprobeOutput)
    log.Println(videoCodecArg, audioCodecArg)
}
