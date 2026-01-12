# Complete Guide to Live Video Streaming

A comprehensive guide covering everything you need to know before building a streaming application.

---

## Table of Contents

1. [How Video Streaming Works](#how-video-streaming-works)
2. [Streaming Protocols](#streaming-protocols)
3. [Video Encoding & Codecs](#video-encoding--codecs)
4. [Streaming Architecture](#streaming-architecture)
5. [Latency Considerations](#latency-considerations)
6. [Key Technologies](#key-technologies)
7. [Common Challenges](#common-challenges)

---

## How Video Streaming Works

### The Basic Flow

```
Camera → Encoder → Protocol → Server → CDN → Player → Viewer
```

### Step-by-Step Breakdown

1. **Capture**: Camera/screen captures raw video frames (huge data)
2. **Encode**: Compress video using codecs (H.264, VP9, AV1)
3. **Package**: Wrap encoded video in a streaming protocol (RTMP, HLS)
4. **Ingest**: Send to media server
5. **Transcode**: Convert to viewer-friendly formats/qualities
6. **Deliver**: Distribute via CDN to viewers globally
7. **Playback**: Browser/app decodes and displays

### Why Can't We Just Send Raw Video?

| Video Type      | Data Size | For 1 minute |
| --------------- | --------- | ------------ |
| Raw 1080p 30fps | ~3 Gbps   | ~22 GB       |
| Encoded 1080p   | ~5 Mbps   | ~37 MB       |

**Compression ratio: ~600x!**

---

## Streaming Protocols

### RTMP (Real-Time Messaging Protocol)

**What it is**: Adobe's protocol, originally for Flash

**Used for**: Ingest (streamer → server)

**Pros**:

- Low latency (~1-3 seconds)
- Reliable delivery (TCP-based)
- Industry standard for OBS, Streamlabs

**Cons**:

- Browsers don't support it natively anymore
- Requires Flash plugin (deprecated)

**How it works**:

```
OBS connects to: rtmp://server:1935/live/stream-key
                 ↑      ↑    ↑    ↑     ↑
              protocol host port app  stream
```

---

### HLS (HTTP Live Streaming)

**What it is**: Apple's adaptive streaming protocol

**Used for**: Delivery (server → viewers)

**Pros**:

- Works in ALL browsers
- Adaptive bitrate (auto quality adjustment)
- Uses standard HTTP (easy to cache via CDN)
- Works through firewalls

**Cons**:

- Higher latency (10-30 seconds typically)

**How it works**:

```
1. Server splits video into segments (2-10 seconds each)

   segment001.ts (2 sec) → segment002.ts (2 sec) → segment003.ts ...

2. Server creates playlist file (manifest):

   playlist.m3u8
   ├── #EXTM3U
   ├── #EXT-X-VERSION:3
   ├── #EXT-X-TARGETDURATION:2
   ├── segment001.ts
   ├── segment002.ts
   └── segment003.ts

3. Player fetches playlist, then segments one by one
4. Player buffers a few segments before playing
```

**Adaptive Bitrate (ABR)**:

```
master.m3u8 (master playlist)
├── 1080p.m3u8 → segments at 5 Mbps
├── 720p.m3u8  → segments at 2.5 Mbps
├── 480p.m3u8  → segments at 1 Mbps
└── 360p.m3u8  → segments at 0.5 Mbps

Player picks quality based on viewer's bandwidth
```

---

### WebRTC (Web Real-Time Communication)

**What it is**: Browser-native real-time protocol

**Used for**: Browser streaming, video calls

**Pros**:

- Ultra-low latency (<500ms possible)
- Built into browsers (no plugins)
- Peer-to-peer capable
- Camera/microphone access APIs

**Cons**:

- Complex to implement
- Doesn't scale well for 1-to-many streaming
- UDP-based (can have packet loss)

**Use cases**:

- "Go Live from Browser" feature
- Video conferencing
- Interactive streaming

---

### Protocol Comparison

| Protocol | Latency | Browser Support | Best For            |
| -------- | ------- | --------------- | ------------------- |
| RTMP     | 1-3s    | ❌ No           | Ingest from OBS     |
| HLS      | 10-30s  | ✅ Yes          | Delivery to viewers |
| WebRTC   | <1s     | ✅ Yes          | Browser streaming   |
| DASH     | 10-30s  | ✅ Yes          | Alternative to HLS  |
| SRT      | 1-3s    | ❌ No           | Professional ingest |

---

## Video Encoding & Codecs

### What is a Codec?

**Codec** = **Co**der + **Dec**oder

Compresses video for transmission, decompresses for viewing.

### Common Video Codecs

| Codec        | Quality | CPU Cost | Browser Support |
| ------------ | ------- | -------- | --------------- |
| H.264 (AVC)  | Good    | Low      | ✅ Universal    |
| H.265 (HEVC) | Better  | Medium   | ⚠️ Limited      |
| VP9          | Better  | Medium   | ✅ Good         |
| AV1          | Best    | High     | ⚠️ Growing      |

**Recommendation**: Use **H.264** for maximum compatibility.

### Key Encoding Terms

| Term           | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| **Bitrate**    | Data per second (e.g., 5 Mbps). Higher = better quality |
| **Resolution** | Frame size (1920x1080, 1280x720, etc.)                  |
| **Framerate**  | Frames per second (24, 30, 60 fps)                      |
| **Keyframe**   | Full frame (I-frame), vs partial frames (P/B-frames)    |
| **GOP**        | Group of Pictures - keyframe interval                   |

### Bitrate Guidelines

| Resolution | Framerate | Recommended Bitrate |
| ---------- | --------- | ------------------- |
| 1080p      | 60 fps    | 4500-6000 Kbps      |
| 1080p      | 30 fps    | 3000-4500 Kbps      |
| 720p       | 60 fps    | 2500-4000 Kbps      |
| 720p       | 30 fps    | 1500-2500 Kbps      |
| 480p       | 30 fps    | 500-1000 Kbps       |

---

## Streaming Architecture

### Simple Architecture (What we're building)

```
┌─────────────────────────────────────────────────────────────┐
│                        STREAMERS                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   OBS    │  │ Browser  │  │  Mobile  │                  │
│  │  (RTMP)  │  │ (WebRTC) │  │  (RTMP)  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MEDIA SERVER                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Node-Media-Server                       │   │
│  │  • Receives RTMP streams                            │   │
│  │  • Validates stream keys                            │   │
│  │  • Triggers webhooks (stream start/end)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    TRANSCODER                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    FFmpeg                            │   │
│  │  • Converts RTMP → HLS segments                     │   │
│  │  • Creates multiple quality levels                  │   │
│  │  • Generates thumbnails                              │   │
│  │  • Records for VOD                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    DELIVERY                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             HLS Files (Local/CDN)                    │   │
│  │                                                      │   │
│  │  /media/stream-id/                                   │   │
│  │  ├── playlist.m3u8                                   │   │
│  │  ├── segment001.ts                                   │   │
│  │  ├── segment002.ts                                   │   │
│  │  └── ...                                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      VIEWERS                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Browser (hls.js) fetches playlist → plays segments  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Production Architecture (Twitch/YouTube scale)

```
                         ┌─────────────────┐
                         │   Load Balancer │
                         └────────┬────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Media Server 1 │     │  Media Server 2 │     │  Media Server N │
│  (Region: US)   │     │  (Region: EU)   │     │  (Region: Asia) │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌────────┴────────┐
                         │   Origin Server │
                         └────────┬────────┘
                                  │
                         ┌────────┴────────┐
                         │       CDN       │
                         │  (Edge Servers) │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
         [Viewer 1]          [Viewer 2]          [Viewer N]
```

---

## Latency Considerations

### What Causes Latency?

| Stage             | Latency Added | Explanation             |
| ----------------- | ------------- | ----------------------- |
| Encoding          | 50-200ms      | CPU time to compress    |
| Network (upload)  | 50-500ms      | ISP, distance           |
| Server processing | 50-100ms      | Receive, transcode      |
| Segmentation      | 2000-10000ms  | HLS segment duration    |
| CDN               | 50-200ms      | Edge distribution       |
| Player buffering  | 2000-10000ms  | Preload for smooth play |
| Decoding          | 50-100ms      | CPU time to decompress  |

**Total typical HLS latency: 10-30 seconds**

### Reducing Latency

| Technique                | New Latency | Tradeoff                     |
| ------------------------ | ----------- | ---------------------------- |
| Shorter segments (1-2s)  | 6-10s       | More requests, more overhead |
| Low-Latency HLS (LL-HLS) | 2-5s        | Complex, newer tech          |
| WebRTC delivery          | <1s         | Doesn't scale well           |
| SRT ingest               | 1-3s        | Limited support              |

---

## Key Technologies

### For Our Stack

| Component    | Technology            | Purpose             |
| ------------ | --------------------- | ------------------- |
| Media Server | **Node-Media-Server** | Receive RTMP        |
| Transcoder   | **FFmpeg**            | RTMP → HLS          |
| Video Player | **hls.js**            | Play HLS in browser |
| Storage      | **MinIO/S3**          | Store VODs          |
| CDN          | **CloudFront/Bunny**  | Global delivery     |

### FFmpeg Basics

```bash
# Convert RTMP to HLS
ffmpeg -i rtmp://localhost/live/stream \
  -c:v copy -c:a copy \
  -f hls \
  -hls_time 2 \
  -hls_list_size 5 \
  -hls_flags delete_segments \
  output/playlist.m3u8
```

| Flag                         | Meaning                           |
| ---------------------------- | --------------------------------- |
| `-i`                         | Input source                      |
| `-c:v copy`                  | Copy video codec (no re-encoding) |
| `-c:a copy`                  | Copy audio codec                  |
| `-f hls`                     | Output format: HLS                |
| `-hls_time 2`                | 2-second segments                 |
| `-hls_list_size 5`           | Keep 5 segments in playlist       |
| `-hls_flags delete_segments` | Delete old segments               |

---

## Common Challenges

### 1. Stream Key Security

- Never expose stream keys in frontend
- Regenerate if compromised
- Use HTTPS for key transmission

### 2. Scaling

- Media servers are CPU-intensive
- Need horizontal scaling for many streamers
- Use CDN for many viewers

### 3. Mobile Compatibility

- iOS Safari: Native HLS support
- Android: Needs hls.js or ExoPlayer
- Test on real devices

### 4. Network Issues

- Handle reconnection gracefully
- Buffer for unstable connections
- Show quality indicator to users

### 5. Storage Costs

- VODs get expensive quickly
- Consider compression, deletion policies
- Use object storage (S3/MinIO)

---

## Glossary

| Term          | Definition                            |
| ------------- | ------------------------------------- |
| **Ingest**    | Receiving video from streamer         |
| **Transcode** | Converting video format/quality       |
| **Mux**       | Combining video + audio tracks        |
| **Demux**     | Separating video + audio              |
| **Bitrate**   | Data rate (bits per second)           |
| **Keyframe**  | Complete frame (for seeking)          |
| **GOP**       | Group of Pictures (keyframe interval) |
| **Manifest**  | Playlist file (.m3u8 for HLS)         |
| **Segment**   | Small chunk of video (2-10s)          |
| **ABR**       | Adaptive Bitrate                      |
| **CDN**       | Content Delivery Network              |
| **Origin**    | Source server for CDN                 |
| **Edge**      | CDN servers close to users            |
| **VOD**       | Video on Demand (recorded)            |
| **Live**      | Real-time streaming                   |

---

## Further Reading

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [HLS Specification](https://datatracker.ietf.org/doc/html/rfc8216)
- [WebRTC for the Curious](https://webrtcforthecurious.com/)
- [Video.js Documentation](https://docs.videojs.com/)
