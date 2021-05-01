import type { Args } from "../types.ts"
import { Logger } from "../deps.ts"
import { validateFilePath, validateURI } from "../util/validation.ts"

const logger = new Logger()

const validateIO = (i: string) => !validateFilePath(i) || !validateURI(i)

export class FFmpeg {
    constructor( private _args?: string[], private _execPath?: string ) { this._args = []; this._execPath = "ffmpeg" }

    private _pushArgs(flag: string, value?: any) { value ? this._pushArgs(`-${flag}`, `${value}`) : this._pushArgs(`-${flag}`) }

    public execPath(i: string) { this._execPath = i; return this }

    public input(i: string) { // Validate input regex
        if (validateIO(i)) this._pushArgs("i", i); else logger.error("I/O", new Error("Invalid input path/URI"))
        return this
    }

    public output(i: string) { // Validate output regex
        if (validateIO(i)) this._pushArgs("", i); else logger.error("I/O", new Error("Invalid output path/URI"))
        return this
    }

    public format(i: Args["format"]) { // Set the output format
        this._pushArgs("f", i); return this
    }

    public videoCodec(i: Args["videoCodec"]) { // Set output codec
        this._pushArgs("c:v", i); return this
    }

    public audioCodec(i: Args["audioCodec"]) { // Set output codec
        this._pushArgs("c:a", i); return this
    }

    public videoBitrate(i: Args["videoBitrate"]) { // Set output codec
        this._pushArgs("b:v", i); return this
    }

    public audioBitrate(i: Args["audioBitrate"]) { // Set output audio codec
        this._pushArgs("b:a", i); return this
    }

    public frameRate(i: Args["frameRate"]) { // Set frameRate
        this._pushArgs("r", i); return this
    }

    public bufsize(i: Args["bufsize"]) { // Set bufsize
        this._pushArgs("bufsize", i); return this
    }

    public preset(i: Args["preset"]) { // Set preset
        this._pushArgs("preset", i); return this
    }

    public crf(i: Args["crf"]) { // Set Constant Rate Factor
        this._pushArgs("crf", i); return this
    }

    public strict(i: Args["strict"]) { // Set strict
        this._pushArgs("strict", i); return this
    }

    public errDetect(i: Args["errDetect"]) { // Set error detection level
        this._pushArgs("err_detect", i); return this
    }

    public map(i: string) { // "Designate one or more input streams as a source for the output file"
        this._pushArgs("-map", i); return this
    }

    public threads(i: Args["threads"]) { // Set the amount of threads to use
        this._pushArgs("threads", i); return this
    }

    public banner() { // Show the banner
        this._pushArgs("hide_banner"); return this
    }

    public copy() { // Just copy the input encoding
        this._pushArgs("c", "copy"); return this
    }

    public copyVideo() { // Just copy the input encoding
        this._pushArgs("c:v", "copy"); return this
    }


    public copyAudio() { // Just copy the input encoding
        this._pushArgs("c:a", "copy"); return this
    }

    public rotate(i: Args["rotate"]) { // Set rotate level
        this._pushArgs("vf", `transpose=${i}`); return this
    }

    public tune(i: Args["tune"]) { // Set tune
        this._pushArgs("tune", i); return this
    }

    public deinterlace() { // Deinterlace
        this._pushArgs("vf", "yadif"); return this
    }

    public removeAudio() { // Completely remove the audio track
        this._pushArgs("an"); return this
    }

    public removeVideo() { // Extract the audio only
        this._pushArgs("vn"); return this
    }

    public overwrite() { // Overwrite any existing output files
        this._pushArgs("y"); return this
    }

    public metadata(i: object) { // Add metadata
        for (const [key, value] of Object.entries(i)) this._pushArgs("-metadata", `${key}=${value}`)
        return this
    }

    public maxRate(i: Args["maxRate"]) { // Set a max rate
        this._pushArgs("maxrate", i)
        return this
    }

    public gop(i: Args["gop"]) { // Use a 2 second Group of Pictures (framerate * 2)
        this._pushArgs("g", i)
        return this
    }

    public videoSize(i: Args["videoSize"]) { // Set the video size
        this._pushArgs("video_size", i)
        return this
    }

    public timeOffset(i: Args["timeOffset"]) {
        this._pushArgs("ss", i)
    }

    public copyCodec() {
        this._pushArgs("codec", "copy")
    }

    public duration(i: Args["duration"]) {
        this._pushArgs("t", i)
    }

    public scale(height: string, width: string) {
        this._pushArgs("vf", `scale=${height}:${width}`)
    }

    public shortest() {
        this._pushArgs("shortest")
    }

    public pixelFormat(i: string) {
        this._pushArgs("pix_fmt", i)
    }

    public audioChannels(i: number) {
        this._pushArgs("ac", i)
    }

    public filterComplex(i: string) {
        this._pushArgs("filter_complex", i)
    }

    public loop(i?: number) {
        this._pushArgs("loop", i ? i : 1)
    }

    public streamLoop() {
        this._pushArgs("stream_loop", "-1")
    }

    public nativeSourceFrameRate() {
        this._pushArgs("re")
    }

    public flags(i: string) {
        this._pushArgs("flags", i)
    }

    async run() {
        if (this._execPath && this._args) {
            logger.log(`${this._execPath} ${this._args.join(" ")}`)
            const p = Deno.run({ cmd: [ this._execPath, ...this._args ] })
            await p.status()
        } else logger.error("Can't run", new Error("Missing '_execPath' or '_args'"))
    }
}

export function ffmpeg(): FFmpeg { return new FFmpeg() }
