# frostbyte x aws s3

1. Create policty and role for lambda with object access
2. Create lambda
    2.1. On upload, lambda creates signed url to download that file.
    2.2. Lambda creates signed url to upload transcoded video.
    2.3. Send download and upload URLs along with transcoding options to frostbyte.
3. For S3, download video -> transcode -> upload.
4. Life goes on.
