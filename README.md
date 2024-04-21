# Frostbyte ❄️

Frostbyte is an easy to use video transcoder service that works with Supabase Storage to help automate and maintain video transcoding jobs for all your projects! You can convert videos of any format to H.264 or H.265 for broadcasting or streaming by simply describing an input bucket, an output bucket, and parameters for the conversion.

Frostbyte is complete with a web-interface for creating and monitoring current jobs under any of your connected Supabase projects. We authenticate using Github and encrypt your project keys as well. With cloud-based transcoding, you can focus on delivering compelling media experiences and worry less about maintaining video processing infrastructure.

[Visit the site to try it out yourself!](https://github.com/0xDebabrata/frostbyte)\\

### How it works:

1. When a user signs up with Supabase auth, they can connect any of their existing Supabase projects to Frostbyte by providing the project URL and service role key.
2. Each project has jobs associated with it which describe a video transcoding pipeline including where we source the video files (input bucket), where we store the converted file (output bucket), format for conversion, resolution and quality. The buckets are fetched from the user's Supabase Storage using an Edge function.
3. After a job is created, the user adds a trigger which lets us know when a video has been uploaded to their input bucket.
4. When a video gets uploaded, a Supabase trigger sets off an Edge Function to add a job to our Kafka queue. Our background worker then downloads this video, converts it using FFmpeg and uploads it back to the output bucket. We use the Kafka message queue to keep track of jobs and their progress.
5. The user has the option to view the logs for any job they have created to troubleshoot issues. We store details about a job in a table in Frostbyte's Supabase DB.

Vercel has been used to host the Next.js app and Upstash is used to maintain the Kafka job queue.

### The process

The idea for Frostbyte came from the need of a video transcoding service like AWS Elemental MediaConvert for Supabase Storage. After we built [Fireplace](https://github.com/0xDebabrata/fireplace), the Supabase Hackathon 2019 runner-up for best overall project, we wanted to expand it to support more video formats that would enable streaming playback. That led us to look for transcoding services that could be integrate easily with Supabase Storage (and have a generous free-tier!) but couldn't find any. So we decided to make one ourselves and quickly brainstormed some ideas for the architecture.

From the get go we wanted to use FFmpeg to do the conversion, oweing to it's reliability, speed and support for different formats. But implementing a job queue to process the conversions was a challenge. Luckily, Kafka came to the rescue and we were able to set up a rudimentary message broker that would allow us to keep track of jobs being submitted. We used Golang to write a background worker that consumes jobs from the queue and completes them.

### What's next

Supabase Hackathons are always super fun and we are excited to showcase Frostbyte and all its features. However, we do have some ideas to improve on what we have built:

1. Support HLS transcoding for Adaptive Bitrate Streaming
2. Scale backend architecture to support larger file sizes and faster processing
3. Make the process fully automated by capturing user's DB credentials to set up triggers
4. Get acquired by Supabase
